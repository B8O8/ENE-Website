const authService = require("../services/authService");

const authMiddleware = {
  // Protect routes with authentication
  authenticate: (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = authService.verifyToken(token);
      req.user = decoded; // Add user info to request object
      next();
    } catch (error) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  },

  // Admin-only access middleware
  authorizeAdmin: (req, res, next) => {
    if (req.user.rank !== "Admin") {
      return res.status(403).json({ error: "Access forbidden: Admins only" });
    }
    next();
  },
};

module.exports = authMiddleware;
