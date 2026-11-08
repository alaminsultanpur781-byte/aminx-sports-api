
const router = require("express").Router();
const { requireDb } = require("../services/db");
const { fetchProviderScores } = require("../services/score.service");

// SportScore provider API
router.get("/scores/provider", async (req, res, next) => {
  try {
    const sport = String(req.query.sport || "cricket").toLowerCase();
    const limit = req.query.limit || 20;

    const result = await fetchProviderScores(sport, limit);

    res.status(result.success ? 200 : 502).json(result);
  } catch (err) {
    next(err);
  }
});

// All matches
router.get("/matches", async (req, res, next) => {
  try {
    const db = requireDb();

    let query = db.from("matches")
      .select("*")
      .order("start_time", { ascending: true })
      .limit(100);

    if (req.query.sport) {
      query = query.eq("sport", req.query.sport);
    }

    if (req.query.status) {
      query = query.eq("status", req.query.status);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      data: data || []
    });
  } catch (err) {
    next(err);
  }
});

// Live matches from database
router.get("/live", async (req, res, next) => {
  try {
    const db = requireDb();

    const { data, error } = await db.from("matches")
      .select("*")
      .eq("status", "live")
      .order("updated_at", { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: data || []
    });
  } catch (err) {
    next(err);
  }
});

// Single match details
router.get("/matches/:id", async (req, res, next) => {
  try {
    const db = requireDb();

    const { data, error } = await db.from("matches")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
