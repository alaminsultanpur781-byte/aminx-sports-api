const router = require("express").Router();
const { requireDb } = require("../services/db");

router.get("/channels", async (req, res, next) => {
  try {
    const db = requireDb();

    let query = db.from("channels")
      .select("id,name,category,logo,stream_url,description,status")
      .eq("status", "active")
      .order("name")
      .limit(100);

    if (req.query.category) {
      query = query.eq("category", req.query.category);
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

module.exports = router;
