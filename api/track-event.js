const SUPABASE_URL = process.env.SUPABASE_URL || "https://avwzoatmlljinuejaqwv.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { business_id, event_type, source, referrer, metadata } = req.body || {};

    if (!business_id || !event_type) {
      return res.status(400).json({ error: "business_id and event_type are required" });
    }

    const validTypes = [
      "profile_view", "search_appearance", "phone_click", "website_click",
      "email_click", "quote_request", "claim_started", "claim_completed",
      "direction_click", "share",
    ];
    if (!validTypes.includes(event_type)) {
      return res.status(400).json({ error: "Invalid event_type" });
    }

    const response = await fetch(`${SUPABASE_URL}/rest/v1/marketplace_events`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        business_id,
        event_type,
        source: source || "web",
        referrer: referrer || null,
        metadata: metadata || {},
      }),
    });

    if (!response.ok) {
      return res.status(500).json({ error: "Failed to record event" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: "Internal error" });
  }
};
