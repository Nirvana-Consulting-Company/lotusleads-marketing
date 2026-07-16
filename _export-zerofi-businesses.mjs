// Export ZeroFi service_businesses inventory for LotusLeads outreach.
// Uses the Supabase Management API (same as enrich-emails.mjs) to run a
// direct SQL query — no edge-function auth needed.
// Merges enriched emails from the local JSONL file and outputs CSV + JSON.
//
// Usage:
//   SMOKE_MGMT=<supabase-PAT> node _export-zerofi-businesses.mjs
//   (same token as ZeroFi's enrich-emails.mjs)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const REF = 'krxflvkzsqxbcvqavqpy';
const MGMT = process.env.SMOKE_MGMT || '';
if (!MGMT) { console.error('Set SMOKE_MGMT (Supabase personal access token).'); process.exit(2); }

const ENRICHED_PATH = path.join(__dir, '..', 'ZeroFiApp', 'scripts', '_enrich-found-US-v2.jsonl');

const CATEGORY_MAP = {
  roofing: 'roofing',
  plumbing: 'plumbing',
  electrical: 'electrical',
  hvac: 'hvac',
  landscaping: 'landscaping',
  painting: 'painting',
  general_contractor: 'general-contractor',
  tree_service: 'landscaping',
  concrete: 'general-contractor',
  handyman: 'general-contractor',
  solar: 'solar',
  remodeling: 'general-contractor',
  construction: 'general-contractor',
};

const sql = async (q) => {
  const r = await fetch(`https://api.supabase.com/v1/projects/${REF}/database/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${MGMT}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: q }),
  });
  const t = await r.text();
  try { return JSON.parse(t); } catch { throw new Error('SQL: ' + t.slice(0, 300)); }
};

function loadEnrichedEmails() {
  try {
    const lines = fs.readFileSync(ENRICHED_PATH, 'utf8').trim().split('\n');
    const map = new Map();
    for (const line of lines) {
      const rec = JSON.parse(line);
      if (rec.id && rec.email) map.set(rec.id, rec.email);
    }
    console.log(`Loaded ${map.size} enriched emails from ZeroFi.`);
    return map;
  } catch (e) {
    console.warn('Could not load enriched emails — continuing without:', e.message);
    return new Map();
  }
}

function escapeCsv(val) {
  if (val == null) return '';
  const s = String(val);
  return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
}

async function main() {
  console.log('Querying ZeroFi service_businesses (US only)...');

  const rows = await sql(`
    SELECT id, name, category, phone, email, email_source, website,
           address, city, state, postal_code, latitude, longitude,
           rating, review_count, source, status
    FROM service_businesses
    WHERE country = 'US'
    ORDER BY state, category, rating DESC NULLS LAST
  `);

  if (!Array.isArray(rows)) {
    console.error('Unexpected response:', JSON.stringify(rows).slice(0, 500));
    process.exit(1);
  }
  console.log(`Fetched ${rows.length} US businesses from ZeroFi.`);

  const enrichedEmails = loadEnrichedEmails();

  let emailMerged = 0;
  for (const biz of rows) {
    if (!biz.email && enrichedEmails.has(biz.id)) {
      biz.email = enrichedEmails.get(biz.id);
      biz.email_source = 'website_enrichment';
      emailMerged++;
    }
    biz.lotusleads_industry = CATEGORY_MAP[biz.category] || biz.category;
  }
  console.log(`Merged ${emailMerged} enriched emails.`);

  const withEmail = rows.filter(b => b.email).length;
  const withPhone = rows.filter(b => b.phone).length;
  const byCategory = {};
  const byState = {};
  for (const b of rows) {
    byCategory[b.category] = (byCategory[b.category] || 0) + 1;
    byState[b.state] = (byState[b.state] || 0) + 1;
  }

  console.log(`\nWith email: ${withEmail} (${(100 * withEmail / rows.length).toFixed(1)}%)`);
  console.log(`With phone: ${withPhone} (${(100 * withPhone / rows.length).toFixed(1)}%)`);
  console.log('\nBy category:');
  for (const [k, v] of Object.entries(byCategory).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${k}: ${v}`);
  }
  console.log(`\nStates covered: ${Object.keys(byState).length}`);
  console.log('Top states:', Object.entries(byState).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([s, n]) => `${s}(${n})`).join(', '));

  // Write CSV
  const outDir = path.join(__dir, 'data');
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, 'zerofi-businesses.csv');

  const cols = [
    'id', 'name', 'category', 'lotusleads_industry', 'phone', 'email', 'email_source',
    'website', 'address', 'city', 'state', 'postal_code',
    'latitude', 'longitude', 'rating', 'review_count', 'status', 'source',
  ];
  const header = cols.join(',');
  const csvRows = rows.map(b => cols.map(c => escapeCsv(b[c])).join(','));

  fs.writeFileSync(outFile, [header, ...csvRows].join('\n'), 'utf8');
  console.log(`\nExported ${rows.length} businesses → ${outFile}`);

  // Also write a JSON version
  const jsonFile = path.join(outDir, 'zerofi-businesses.json');
  fs.writeFileSync(jsonFile, JSON.stringify(rows, null, 2), 'utf8');
  console.log(`JSON version → ${jsonFile}`);

  // Write outreach-ready subset (businesses with email, mapped to LotusLeads industries)
  const outreachReady = rows.filter(b => b.email);
  const outreachFile = path.join(outDir, 'outreach-ready.csv');
  const outreachCsv = outreachReady.map(b => cols.map(c => escapeCsv(b[c])).join(','));
  fs.writeFileSync(outreachFile, [header, ...outreachCsv].join('\n'), 'utf8');
  console.log(`Outreach-ready (with email): ${outreachReady.length} → ${outreachFile}`);
}

main().catch(e => { console.error(e); process.exit(1); });
