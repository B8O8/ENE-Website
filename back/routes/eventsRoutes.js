const express = require("express");
const eventController = require("../controllers/eventController");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", eventController.createEvent);
router.get("/get", authMiddleware.authenticate, authMiddleware.authorizeAdmin, eventController.getEvents);
router.delete("/events/:id", authMiddleware.authenticate, authMiddleware.authorizeAdmin, eventController.deleteEvent);

module.exports = router;
