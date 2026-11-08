const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const { requireDb } = require("../services/db");
const {
  validateAuthorizedStreamUrl
} = require("../services/stream.service");

const resources = {
  matches: {
    table: "matches",
    fields: [
      "title",
      "sport",
      "tournament",
      "team_a",
      "team_b",
      "team_a_score",
      "team_b_score",
      "start_time",
      "status",
      "venue",
      "stream_url",
      "thumbnail"
    ]
  },

  channels: {
    table: "channels",
    fields: [
      "name",
      "category",
      "logo",
      "stream_url",
      "status",
      "description"
    ]
  },

  news: {
    table: "news",
    fields: [
      "title",
      "summary",
      "image",
      "content",
      "status",
      "category"
    ]
  },

  teams: {
    table: "teams",
    fields: [
      "name",
      "sport",
      "logo",
      "country"
    ]
  },

  players: {
    table: "players",
    fields: [
      "name",
      "team",
      "sport",
      "photo",
      "role",
      "country"
    ]
  },

  settings: {
    table: "app_settings",
    fields: [
      "key",
      "value"
    ]
  }
};

router.use(requireAuth("admin"));

for (const [resource, config] of Object.entries(resources)) {
  const base = `/${resource}`;

  router.get(base, async (req, res, next) => {
    try {
      const db = requireDb();

      const { data, error } = await db.from(config.table)
        .select("*")
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

  router.post(base, async (req, res, next) => {
    try {
      const db = requireDb();
      const body = {};

      for (const field of config.fields) {
        if (req.body[field] !== undefined) {
          body[field] = req.body[field];
        }
      }

      if (body.stream_url) {
        body.stream_url =
          validateAuthorizedStreamUrl(body.stream_url);
      }

      const { data, error } = await db.from(config.table)
        .insert(body)
        .select("*")
        .single();

      if (error) throw error;

      res.status(201).json({
        success: true,
        data
      });
    } catch (err) {
      next(err);
    }
  });

  router.put(`${base}/:id`, async (req, res, next) => {
    try {
      const db = requireDb();
      const body = {};

      for (const field of config.fields) {
        if (req.body[field] !== undefined) {
          body[field] = req.body[field];
        }
      }

      if (body.stream_url) {
        body.stream_url =
          validateAuthorizedStreamUrl(body.stream_url);
      }

      const { data, error } = await db.from(config.table)
        .update(body)
        .eq("id", req.params.id)
        .select("*")
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

  router.delete(`${base}/:id`, async (req, res, next) => {
    try {
      const db = requireDb();

      const { error } = await db.from(config.table)
        .delete()
        .eq("id", req.params.id);

      if (error) throw error;

      res.json({
        success: true,
        message: "Deleted successfully."
      });
    } catch (err) {
      next(err);
    }
  });
}

module.exports = router;
