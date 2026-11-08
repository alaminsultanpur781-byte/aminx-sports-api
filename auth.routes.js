const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { requireDb } = require("../services/db");
const { signToken } = require("../middleware/auth");

router.post("/register", async (req, res, next) => {
  try {
    const db = requireDb();
    const { name, email, password } = req.body || {};
    if (!name || !email || !password || String(password).length < 8) {
      return res.status(400).json({ success: false, message: "Name, email and password (minimum 8 characters) are required." });
    }
    const normalizedEmail = String(email).trim().toLowerCase();
    const { data: existing, error: lookupError } = await db.from("users").select("id").eq("email", normalizedEmail).maybeSingle();
    if (lookupError) throw lookupError;
    if (existing) return res.status(409).json({ success: false, message: "Email already registered." });

    const password_hash = await bcrypt.hash(String(password), 12);
    const { data: user, error } = await db.from("users")
      .insert({ name: String(name).trim(), email: normalizedEmail, password_hash, role: "user" })
      .select("id,name,email,role").single();
    if (error) throw error;
    const token = signToken({ id: user.id, email: user.email, role: user.role });
    res.status(201).json({ success: true, token, user });
  } catch (err) { next(err); }
});

router.post("/login", async (req, res, next) => {
  try {
    const db = requireDb();
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password required." });
    const { data: user, error } = await db.from("users").select("*")
      .eq("email", String(email).trim().toLowerCase()).maybeSingle();
    if (error) throw error;
    if (!user || !(await bcrypt.compare(String(password), user.password_hash))) {
      return res.status(401).json({ success: false, message: "Incorrect email or password." });
    }
    const token = signToken({ id: user.id, email: user.email, role: user.role });
    res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { next(err); }
});

router.post("/admin-login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD_HASH) {
      return res.status(503).json({ success: false, message: "Admin credentials are not configured." });
    }
    const validEmail = String(email || "").trim().toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase();
    const validPassword = await bcrypt.compare(String(password || ""), process.env.ADMIN_PASSWORD_HASH);
    if (!validEmail || !validPassword) return res.status(401).json({ success: false, message: "Invalid admin credentials." });
    const token = signToken({ id: "admin", email: process.env.ADMIN_EMAIL, role: "admin" });
    res.json({ success: true, token, user: { email: process.env.ADMIN_EMAIL, role: "admin" } });
  } catch (err) { next(err); }
});

module.exports = router;
