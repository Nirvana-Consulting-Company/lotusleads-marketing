export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const data = req.body;
  if (!data || !data.contact_email || !data.contact_name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const RESEND_KEY = process.env.RESEND_API_KEY;
  const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'rsurana@nirvanaconsultingcompany.com';

  const serviceLabel = (data.service || '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const prosStr = (data.matched_pros || []).join(', ') || 'None matched yet';

  const emailHtml = `
    <div style="font-family:Inter,system-ui,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:linear-gradient(135deg,#E64B8B,#b8326e);padding:24px 32px;border-radius:12px 12px 0 0;">
        <h1 style="color:#fff;font-size:20px;margin:0;">New Estimate Lead</h1>
        <p style="color:#fcd5e5;font-size:14px;margin:4px 0 0;">LotusLeads Property Estimator</p>
      </div>
      <div style="background:#f9fafb;padding:24px 32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">
        <h2 style="font-size:16px;color:#111827;margin:0 0 16px;">Service: ${serviceLabel}</h2>

        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:8px 0;color:#6b7280;width:140px;">Property Address</td><td style="padding:8px 0;color:#111827;font-weight:600;">${data.address || '—'}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">City / State</td><td style="padding:8px 0;color:#111827;">${data.city || '—'}, ${data.state || '—'}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">Property Type</td><td style="padding:8px 0;color:#111827;">${data.property_type || '—'}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">Total Area</td><td style="padding:8px 0;color:#111827;">${data.total_sqft ? data.total_sqft.toLocaleString() + ' sq ft' : '—'}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">AI Estimate</td><td style="padding:8px 0;color:#111827;font-weight:600;">${data.estimate_summary || '—'}</td></tr>
        </table>

        <h3 style="font-size:14px;color:#111827;margin:16px 0 8px;">Contact</h3>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:6px 0;color:#6b7280;width:140px;">Name</td><td style="padding:6px 0;color:#111827;font-weight:600;">${data.contact_name}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280;">Email</td><td style="padding:6px 0;color:#111827;"><a href="mailto:${data.contact_email}" style="color:#E64B8B;">${data.contact_email}</a></td></tr>
          <tr><td style="padding:6px 0;color:#6b7280;">Phone</td><td style="padding:6px 0;color:#111827;">${data.contact_phone || '—'}</td></tr>
        </table>

        <div style="margin:16px 0;padding:12px 16px;background:#fff;border:1px solid #e5e7eb;border-radius:8px;">
          <p style="font-size:12px;color:#6b7280;margin:0 0 4px;">Matched Pros</p>
          <p style="font-size:14px;color:#111827;margin:0;">${prosStr}</p>
        </div>

        <p style="font-size:11px;color:#9ca3af;margin:16px 0 0;">Source: ${data.source_url || 'estimator'} &middot; ${data.submitted_at || new Date().toISOString()}</p>
      </div>
    </div>
  `;

  if (RESEND_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_KEY}` },
        body: JSON.stringify({
          from: 'LotusLeads Estimator <notifications@lotusleads.ai>',
          to: [NOTIFY_EMAIL],
          subject: `Estimate Lead: ${serviceLabel} — ${data.contact_name}`,
          html: emailHtml
        })
      });
    } catch (emailErr) {
      console.error('Resend error:', emailErr);
    }
  }

  return res.status(200).json({ ok: true });
}
