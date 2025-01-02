const express = require("express");
const signalController = require("../controllers/signalController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Join signals channel
router.post("/add", authMiddleware.authenticate, signalController.addToChannel);

// Fetch active invite link for a user
router.get(
  "/invite/:userId",
  authMiddleware.authenticate,
  signalController.getInviteLink
);

// Reset invite link access for a user
router.post(
  "/reset-invite",
  authMiddleware.authenticate,
  authMiddleware.authorizeAdmin,
  signalController.resetInviteLink
);

// Handle subscription expiry
router.post(
  "/handle-expiry",
  authMiddleware.authenticate,
  authMiddleware.authorizeAdmin,
  async (req, res) => {
    try {
      await signalController.handleExpiry();
      res.status(200).json({ message: "Expiry handled successfully." });
    } catch (error) {
      console.error("Error handling expiry:", error.message);
      res.status(500).json({ error: "Failed to handle expiry." });
    }
  }
);

// Send renewal reminders
router.post(
  "/send-reminders",
  authMiddleware.authenticate,
  authMiddleware.authorizeAdmin,
  async (req, res) => {
    try {
      await signalController.sendRenewalReminders();
      res.status(200).json({ message: "Renewal reminders sent successfully." });
    } catch (error) {
      console.error("Error sending renewal reminders:", error.message);
      res.status(500).json({ error: "Failed to send renewal reminders." });
    }
  },

  // Fetch all signal logs
  router.get(
    "/admin/logs",
    authMiddleware.authenticate,
    authMiddleware.authorizeAdmin,
    signalController.getAllLogs
  )
);

module.exports = router;
