const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const reminderController = require("../controllers/reminderController");

// Admin Routes
router.post("/reminders",authMiddleware.authenticate, authMiddleware.authorizeAdmin, reminderController.createReminder);
router.get("/reminders",authMiddleware.authenticate, authMiddleware.authorizeAdmin, reminderController.getAllReminders);
router.delete("/reminders/:id",authMiddleware.authenticate, authMiddleware.authorizeAdmin, reminderController.deleteReminder);

module.exports = router;
