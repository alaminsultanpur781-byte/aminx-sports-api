const jwt = require("jsonwebtoken");

function signToken(payload) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
}

function requireAuth(requiredRole) {
  return (req, res, next) => {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ")
      ? header.slice(7)
      : "";

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Login required."
      });
    }

    try {
      req.user = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      if (requiredRole && req.user.role !== requiredRole) {
        return res.status(403).json({
          success: false,
          message: "Admin access required."
        });
      }

      next();

    } catch {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token."
      });
    }
  };
}

module.exports = {
  signToken,
  requireAuth
};
