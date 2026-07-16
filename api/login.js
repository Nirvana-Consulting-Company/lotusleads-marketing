const { sign, timingSafeStrEqual, readBody } = require("./_lib");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
  if (!ADMIN_PASSWORD) return res.status(500).json({ error: "Admin not configured" });

  const { password } = readBody(req);
  if (!password || !timingSafeStrEqual(password, ADMIN_PASSWORD)) {
    return res.status(401).json({ error: "Invalid password" });
  }

  const token = sign({ role: "admin", exp: Date.now() + 12 * 60 * 60 * 1000 });

  res.setHeader("Set-Cookie", [
    `ll_admin=${token}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=43200`,
  ]);
  return res.status(200).json({ ok: true });
};
