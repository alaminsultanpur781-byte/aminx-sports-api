const router = require("express").Router();
const { requireDb } = require("../services/db");

router.get("/news", async (req, res, next) => {
  try {
    const db = requireDb();

    const { data, error } = await db.from("news")
      .select("id,title,summary,image,content,category,created_at")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    res.json({
      success: true,
      data: data || []
    });
  } catch (err) {
    next(err);
  }
});

router.get("/teams", async (req, res, next) => {
  try {
    const db = requireDb();

    const { data, error } = await db.from("teams")
      .select("*")
      .order("name")
      .limit(100);

    if (error) throw error;

    res.json({
      success: true,
      data: data || []
    });
  } catch (err) {
    next(err);
  }
});

router.get("/players", async (req, res, next) => {
  try {
    const db = requireDb();

    const { data, error } = await db.from("players")
      .select("*")
      .order("name")
      .limit(100);

    if (error) throw error;

    res.json({
      success: true,
      data: data || []
    });
  } catch (err) {
    next(err);
  }
});

router.get("/settings", async (req, res, next) => {
  try {
    const db = requireDb();

    const { data, error } = await db.from("app_settings")
      .select("key,value");

    if (error) throw error;

    res.json({
      success: true,
      data: Object.fromEntries(
        (data || []).map(item => [item.key, item.value])
      )
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
