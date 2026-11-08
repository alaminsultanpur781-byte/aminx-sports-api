require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth.routes");
const matchRoutes = require("./routes/matches.routes");
const channelRoutes = require("./routes/channels.routes");
const newsRoutes = require("./routes/news.routes");
const adminRoutes = require("./routes/admin.routes");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));

app.get("/", (req, res) => res.json({
  name: "AminX Sports API",
  status: "online",
  version: "1.0.0",
  docs: "/api/docs"
}));

app.get("/api/health", async (req, res, next) => {
  try {
    const { checkDb } = require("./services/db");
    const connected = await checkDb();
    res.status(connected ? 200 : 503).json({
      success: connected, api: "online",
      database: connected ? "connected" : "not_configured",
      timestamp: new Date().toISOString()
    });
  } catch (err) { next(err); }
});

app.get("/api/docs", (req, res) => res.json({
  name: "AminX Sports API",
  auth: "Protected routes require Authorization: Bearer <token>",
  routes: {
    auth: ["POST /api/auth/register", "POST /api/auth/login", "POST /api/auth/admin-login"],
    matches: ["GET /api/matches", "GET /api/live", "GET /api/matches/:id"],
    content: ["GET /api/channels", "GET /api/news", "GET /api/teams", "GET /api/players", "GET /api/settings"],
    admin: ["GET/POST /api/admin/:resource", "PUT/DELETE /api/admin/:resource/:id"]
  }
}));

app.use("/api/auth", authRoutes);
app.use("/api", matchRoutes);
app.use("/api", channelRoutes);
app.use("/api", newsRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res) => res.status(404).json({
  success: false, message: "API route not found"
}));
app.use(errorHandler);

const port = process.env.PORT || 3000;
const { initializeDatabase } = require("./services/db");
initializeDatabase()
  .then(() => app.listen(port, () => console.log(`AminX Sports API running on port ${port}`)))
  .catch((error) => {
    console.error("Database initialization failed:", error.message);
    process.exit(1);
  });
