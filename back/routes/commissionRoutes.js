const express = require("express");
const commissionController = require("../controllers/commissionController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Admin routes
router.get(
  "/admin/totals",
  authMiddleware.authenticate,
  authMiddleware.authorizeAdmin,
  commissionController.getCommissionTotals
);

router.get(
  "/admin/logs",
  authMiddleware.authenticate,
  authMiddleware.authorizeAdmin,
  commissionController.getRecentLogs
);

// User-specific routes
router.get(
  "/user/logs",
  authMiddleware.authenticate,
  commissionController.getUserCommissionLogs
);

module.exports = router;
