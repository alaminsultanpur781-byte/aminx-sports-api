const router = require("express").Router();
const { requireDb } = require("../services/db");

router.get("/matches", async (req, res, next) => {
  try {
    const db = requireDb();
    let query = db.from("matches").select("*").order("start_time", { ascending: true }).limit(100);
    if (req.query.sport) query = query.eq("sport", req.query.sport);
    if (req.query.status) query = query.eq("status", req.query.status);
    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (err) { next(err); }
});

router.get("/live", async (req, res, next) => {
  try {
    const db = requireDb();
    const { data, error } = await db.from("matches").select("*").eq("status", "live").order("updated_at", { ascending: false });
    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (err) { next(err); }
});

router.get("/matches/:id", async (req, res, next) => {
  try {
    const db = requireDb();
    const { data, error } = await db.from("matches").select("*").eq("id", req.params.id).single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

module.exports = router;
