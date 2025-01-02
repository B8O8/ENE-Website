require("dotenv").config(); // Load environment variables
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const authService = {
  // Hash password
  hashPassword: async (password) => {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  },

  // Compare password
  comparePassword: async (password, hash) => {
    return bcrypt.compare(password, hash);
  },

  // Generate JWT token
  generateToken: (user) => {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in the environment variables");
    }

    return jwt.sign(
      { id: user.id, email: user.email, rank: user.rank, name: user.name, subscription_id: user.subscription_id,is_vip: user.is_vip, },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" } // Default to 1 hour if not defined
    );
  },

  // Verify JWT token
  verifyToken: (token) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  },
};

module.exports = authService;
