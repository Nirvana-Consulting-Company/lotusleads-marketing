/**
 * _apply-shell.mjs
 * Build script for LotusLeads marketing site.
 * Injects shared nav, footer, SEO meta, and generates sitemap + robots.txt.
 * Idempotent -- safe to run multiple times.
 *
 * Usage:  node _apply-shell.mjs
 */

import fs from 'fs';
import path from 'path';

const ROOT = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Z]:)/i, '$1');
const BASE_URL = 'https://lotusleads.ai';

// ---------------------------------------------------------------------------
// SHARED NAV
// ---------------------------------------------------------------------------
const SHARED_NAV = `
<nav id="main-nav" class="fixed top-0 inset-x-0 z-50 bg-white transition-shadow duration-300" aria-label="Main navigation">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">

      <!-- Logo -->
      <a href="/" class="flex items-center gap-2 shrink-0">
        <img src="/images/logo-icon.png" alt="LotusLeads" class="h-10">
        <span class="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">Lotus</span>
      </a>

      <!-- Desktop Links -->
      <div class="hidden lg:flex items-center gap-8">
        <!-- Product Dropdown -->
        <div class="relative group">
          <button class="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors">
            Product
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
          </button>
          <div class="absolute left-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg ring-1 ring-gray-900/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
            <a href="/features" class="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">All Features</a>
            <a href="/icp" class="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">AI ICP &amp; Prospecting</a>
            <a href="/property-intelligence" class="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">Property Intelligence</a>
            <a href="/lead-management" class="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">Lead Management</a>
            <a href="/campaigns" class="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">Campaign Outreach</a>
            <a href="/competitive-intel" class="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">Competitive Intel</a>
            <a href="/analytics" class="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">Analytics</a>
          </div>
        </div>
        <a href="/pricing" class="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors">Pricing</a>
        <a href="/about" class="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors">About</a>
      </div>

      <!-- Right: Login + CTA + Hamburger -->
      <div class="flex items-center gap-4">
        <a href="/login" class="hidden lg:inline-block text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors">Login</a>
        <a href="/signup" class="hidden lg:inline-flex items-center px-4 py-2 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 shadow-sm transition-all">Start Free Trial</a>
        <button id="mobile-menu-btn" class="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100" aria-label="Toggle menu">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile Menu -->
  <div id="mobile-menu" class="hidden lg:hidden bg-white border-t border-gray-100">
    <div class="px-4 py-4 space-y-2">
      <p class="px-3 pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Product</p>
      <a href="/features" class="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">All Features</a>
      <a href="/icp" class="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">AI ICP &amp; Prospecting</a>
      <a href="/property-intelligence" class="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">Property Intelligence</a>
      <a href="/lead-management" class="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">Lead Management</a>
      <a href="/campaigns" class="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">Campaign Outreach</a>
      <a href="/competitive-intel" class="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">Competitive Intel</a>
      <a href="/analytics" class="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">Analytics</a>
      <hr class="my-2 border-gray-100"/>
      <a href="/pricing" class="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">Pricing</a>
      <a href="/about" class="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">About</a>
      <hr class="my-2 border-gray-100"/>
      <a href="/login" class="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">Login</a>
      <a href="/signup" class="block mx-3 mt-2 text-center px-4 py-2 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-pink-500 to-rose-600">Start Free Trial</a>
    </div>
  </div>
</nav>
<!-- Spacer for fixed nav -->
<div class="h-16"></div>
<script>
  document.getElementById('mobile-menu-btn').addEventListener('click', function() {
    document.getElementById('mobile-menu').classList.toggle('hidden');
  });
</script>
<script>
  (function(){
    var nav = document.getElementById('main-nav');
    window.addEventListener('scroll', function(){
      if(window.scrollY > 10){ nav.classList.add('shadow-md'); }
      else { nav.classList.remove('shadow-md'); }
    });
  })();
</script>
`;

// ---------------------------------------------------------------------------
// SHARED FOOTER
// ---------------------------------------------------------------------------
const SHARED_FOOTER = `
<footer class="bg-[#111827] text-gray-300">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-10">

      <!-- Col 1: Brand -->
      <div class="col-span-2 md:col-span-1">
        <a href="/" class="flex items-center gap-2 mb-4">
          <img src="/images/logo-icon.png" alt="LotusLeads" class="h-10 brightness-0 invert">
          <span class="text-2xl font-bold text-white">Lotus</span>
        </a>
        <p class="text-sm leading-relaxed text-gray-400">AI-powered sales intelligence for B2B service companies.</p>
      </div>

      <!-- Col 2: Product -->
      <div>
        <h4 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">Product</h4>
        <ul class="space-y-2 text-sm">
          <li><a href="/features" class="hover:text-white transition-colors">How It Works</a></li>
          <li><a href="/icp" class="hover:text-white transition-colors">AI ICP Builder</a></li>
          <li><a href="/property-intelligence" class="hover:text-white transition-colors">Property Intelligence</a></li>
          <li><a href="/campaigns" class="hover:text-white transition-colors">Campaign Outreach</a></li>
        </ul>
      </div>

      <!-- Col 3: Solutions -->
      <div>
        <h4 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">Solutions</h4>
        <ul class="space-y-2 text-sm">
          <li><a href="/lead-management" class="hover:text-white transition-colors">Lead Management</a></li>
          <li><a href="/competitive-intel" class="hover:text-white transition-colors">Competitive Intel</a></li>
          <li><a href="/analytics" class="hover:text-white transition-colors">Analytics</a></li>
          <li><a href="/#autopilot" class="hover:text-white transition-colors">Auto-Pilot</a></li>
        </ul>
      </div>

      <!-- Col 4: Company -->
      <div>
        <h4 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h4>
        <ul class="space-y-2 text-sm">
          <li><a href="/about" class="hover:text-white transition-colors">About</a></li>
          <li><a href="/pricing" class="hover:text-white transition-colors">Pricing</a></li>
          <li><a href="/login" class="hover:text-white transition-colors">Login</a></li>
          <li><a href="/signup" class="hover:text-white transition-colors">Start Free Trial</a></li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Bottom bar -->
  <div class="border-t border-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
      <span>&copy; 2026 LotusLeads. All rights reserved.</span>
      <span>Built by <a href="https://nirvanaconsultingcompany.com" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white transition-colors">Nirvana Consulting</a></span>
    </div>
  </div>
</footer>
`;

// ---------------------------------------------------------------------------
// PAGE META — SEO metadata per page
// ---------------------------------------------------------------------------
const PAGE_META = {
  'index.html': {
    title: 'LotusLeads \u2014 AI Sales Intelligence for Field Services',
    description: 'AI-powered prospecting, property analysis, and automated outreach for B2B field-service companies. Find, qualify, and win more commercial accounts.',
    canonical: '/',
  },
  'features.html': {
    title: 'Platform Features | LotusLeads',
    description: 'Explore LotusLeads\u2019 full feature set: AI ICP builder, property intelligence, lead management, campaign outreach, competitive intel, and analytics.',
    canonical: '/features',
  },
  'pricing.html': {
    title: 'Pricing Plans | LotusLeads',
    description: 'Simple, transparent pricing for AI-powered sales intelligence. Choose the plan that fits your team and start closing more commercial accounts.',
    canonical: '/pricing',
  },
  'about.html': {
    title: 'About LotusLeads | Our Mission & Team',
    description: 'Learn how LotusLeads is helping B2B service companies win more commercial accounts with AI-driven sales intelligence and property data.',
    canonical: '/about',
  },
  'icp.html': {
    title: 'AI ICP & Prospecting | LotusLeads',
    description: 'Build your ideal customer profile with AI. Automatically discover and rank prospects that match your best-fit commercial accounts.',
    canonical: '/icp',
  },
  'property-intelligence.html': {
    title: 'Property Intelligence | LotusLeads',
    description: 'Enrich every lead with property data: square footage, roof age, lot size, ownership, and more. Prioritize accounts with real building insights.',
    canonical: '/property-intelligence',
  },
  'lead-management.html': {
    title: 'Lead Management | LotusLeads',
    description: 'Organize, score, and track every commercial lead in one place. AI-powered pipeline management built for field-service sales teams.',
    canonical: '/lead-management',
  },
  'campaigns.html': {
    title: 'Campaign Outreach | LotusLeads',
    description: 'Launch personalized email and multi-channel campaigns at scale. Automate follow-ups and track engagement across your pipeline.',
    canonical: '/campaigns',
  },
  'competitive-intel.html': {
    title: 'Competitive Intel | LotusLeads',
    description: 'See which competitors serve your target properties. Win more bids with data-driven competitive positioning and market insights.',
    canonical: '/competitive-intel',
  },
  'analytics.html': {
    title: 'Analytics & Reporting | LotusLeads',
    description: 'Real-time dashboards for pipeline health, win rates, territory coverage, and team performance. Make data-driven sales decisions.',
    canonical: '/analytics',
  },
};

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

/** Replace content between two marker comments (inclusive of markers). */
function replaceBlock(html, startMarker, endMarker, replacement) {
  const re = new RegExp(
    `(${escapeRegex(startMarker)})[\\s\\S]*?(${escapeRegex(endMarker)})`,
    'g',
  );
  return html.replace(re, `$1\n${replacement}\n$2`);
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Build SEO <head> block for a given page. */
function buildSeoBlock(pageName, meta) {
  const fullUrl = BASE_URL + meta.canonical;
  const ogImage = BASE_URL + '/images/dashboard-overview.png';

  let block = `
  <title>${meta.title}</title>
  <meta name="description" content="${meta.description}"/>
  <link rel="canonical" href="${fullUrl}"/>
  <link rel="icon" href="/favicon.ico" sizes="32x32">
  <link rel="icon" href="/images/favicon-192.png" type="image/png" sizes="192x192">
  <link rel="apple-touch-icon" href="/images/apple-touch-icon.png">

  <!-- Open Graph -->
  <meta property="og:title" content="${meta.title}"/>
  <meta property="og:description" content="${meta.description}"/>
  <meta property="og:url" content="${fullUrl}"/>
  <meta property="og:image" content="${ogImage}"/>
  <meta property="og:type" content="website"/>
  <meta property="og:site_name" content="LotusLeads"/>

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="${meta.title}"/>
  <meta name="twitter:description" content="${meta.description}"/>
  <meta name="twitter:image" content="${ogImage}"/>

  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-56EC8T5DJ2"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-56EC8T5DJ2');
  </script>`;

  // Schema.org LD+JSON for index.html only
  if (pageName === 'index.html') {
    const ldJson = JSON.stringify([
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'LotusLeads',
        url: BASE_URL,
        logo: BASE_URL + '/images/logo.png',
        sameAs: [],
        description: meta.description,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'LotusLeads',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        url: BASE_URL,
        description: meta.description,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          description: 'Free trial available',
        },
      },
    ], null, 2);

    block += `\n\n  <!-- Schema.org LD+JSON -->\n  <script type="application/ld+json">\n${ldJson}\n  </script>`;
  }

  return block;
}

/** Generate sitemap.xml from the list of HTML files. */
function generateSitemap(htmlFiles) {
  const urls = htmlFiles.map((file) => {
    const name = path.basename(file);
    const stat = fs.statSync(file);
    const lastmod = stat.mtime.toISOString().split('T')[0];
    const loc =
      name === 'index.html'
        ? BASE_URL + '/'
        : BASE_URL + '/' + name.replace('.html', '');
    const priority = name === 'index.html' ? '1.0' : '0.8';
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
}

/** Generate robots.txt. */
function generateRobots() {
  return `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;
}

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------
function main() {
  console.log('[apply-shell] Starting build...');

  // Collect all .html files in root directory
  const htmlFiles = fs
    .readdirSync(ROOT)
    .filter((f) => f.endsWith('.html'))
    .map((f) => path.join(ROOT, f));

  if (htmlFiles.length === 0) {
    console.log('[apply-shell] No .html files found. Nothing to do.');
    return;
  }

  console.log(`[apply-shell] Found ${htmlFiles.length} HTML file(s).`);

  for (const filePath of htmlFiles) {
    const pageName = path.basename(filePath);
    let html = fs.readFileSync(filePath, 'utf-8');
    let changed = false;

    // 1. Replace NAV block
    if (html.includes('<!-- NAV_START -->') && html.includes('<!-- NAV_END -->')) {
      html = replaceBlock(html, '<!-- NAV_START -->', '<!-- NAV_END -->', SHARED_NAV);
      changed = true;
    }

    // 2. Replace FOOTER block
    if (html.includes('<!-- FOOTER_START -->') && html.includes('<!-- FOOTER_END -->')) {
      html = replaceBlock(html, '<!-- FOOTER_START -->', '<!-- FOOTER_END -->', SHARED_FOOTER);
      changed = true;
    }

    // 3. Inject SEO block
    if (html.includes('<!-- @seo -->')) {
      const meta = PAGE_META[pageName];
      if (meta) {
        const seoBlock = buildSeoBlock(pageName, meta);
        // Replace between first and second <!-- @seo --> markers
        const parts = html.split('<!-- @seo -->');
        if (parts.length >= 3) {
          // Markers exist in pairs: parts[0] + marker + seo + marker + parts[2]
          html = parts[0] + '<!-- @seo -->' + seoBlock + '\n  <!-- @seo -->' + parts.slice(2).join('<!-- @seo -->');
          changed = true;
        } else if (parts.length === 2) {
          // Only one marker -- insert after it (and add closing marker)
          html = parts[0] + '<!-- @seo -->' + seoBlock + '\n  <!-- @seo -->' + parts[1];
          changed = true;
        }
      } else {
        console.log(`  [warn] No PAGE_META entry for ${pageName}, skipping SEO.`);
      }
    }

    if (changed) {
      fs.writeFileSync(filePath, html, 'utf-8');
      console.log(`  [ok] ${pageName}`);
    } else {
      console.log(`  [skip] ${pageName} (no markers found)`);
    }
  }

  // 4. Generate sitemap.xml
  const sitemapPath = path.join(ROOT, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, generateSitemap(htmlFiles), 'utf-8');
  console.log(`  [ok] sitemap.xml (${htmlFiles.length} URLs)`);

  // 5. Generate robots.txt
  const robotsPath = path.join(ROOT, 'robots.txt');
  fs.writeFileSync(robotsPath, generateRobots(), 'utf-8');
  console.log('  [ok] robots.txt');

  console.log('[apply-shell] Done.');
}

main();
