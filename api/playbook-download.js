export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const data = req.body;
  if (!data || !data.email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const RESEND_KEY = process.env.RESEND_API_KEY;
  const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'rsurana@nirvanaconsultingcompany.com';

  const notifyHtml = `
    <div style="font-family:Inter,system-ui,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:linear-gradient(135deg,#E64B8B,#b8326e);padding:24px 32px;border-radius:12px 12px 0 0;">
        <h1 style="color:#fff;font-size:20px;margin:0;">Playbook Download</h1>
        <p style="color:#fcd5e5;font-size:14px;margin:4px 0 0;">New lead captured</p>
      </div>
      <div style="background:#f9fafb;padding:24px 32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:8px 0;color:#6b7280;width:120px;">Name</td><td style="padding:8px 0;color:#111827;font-weight:600;">${data.name || '—'}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">Email</td><td style="padding:8px 0;color:#111827;"><a href="mailto:${data.email}" style="color:#E64B8B;">${data.email}</a></td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">Company</td><td style="padding:8px 0;color:#111827;">${data.company || '—'}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">Title</td><td style="padding:8px 0;color:#111827;">${data.title || '—'}</td></tr>
        </table>
        <p style="font-size:11px;color:#9ca3af;margin:16px 0 0;">${data.submitted_at || new Date().toISOString()}</p>
      </div>
    </div>
  `;

  if (RESEND_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'LotusLeads <playbook@lotusleads.ai>',
          to: [NOTIFY_EMAIL],
          subject: `Playbook Download: ${data.name || data.email}`,
          html: notifyHtml,
        }),
      });
    } catch (e) {
      console.error('Resend email failed:', e);
    }
  } else {
    console.log('RESEND_API_KEY not set — playbook download logged:', JSON.stringify(data));
  }

  return res.status(200).json({ ok: true });
}
