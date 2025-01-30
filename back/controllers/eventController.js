const Event = require("../models/Event");
const emailHelpers = require("../utils/emailHelper");

const eventController = {
  createEvent: async (req, res) => {
    try {
      const { first_name, last_name, email, phone, country_of_residence } = req.body;

      // Validate that all required fields are provided
      if (!first_name || !last_name || !email || !phone || !country_of_residence) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Check if email already exists
      const [existingEvent] = await Event.findByEmail(email);
      if (existingEvent.length > 0) {
        return res.status(400).json({ error: "Email already registered for this event" });
      }

      // Send confirmation email
      await emailHelpers.sendEventConfirmation(email, first_name);


      // Create the event record
      const [result] = await Event.create({ first_name, last_name, email, phone, country_of_residence });
      res.status(201).json({ message: "Event registered successfully", eventId: result.insertId });
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ error: "Failed to create event" });
    }
  },

  getEvents: async (req, res) => {
    try {
      const [events] = await Event.getAll();
      res.status(200).json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  },

  deleteEvent: async (req, res) => {
    try {
      const { id } = req.params;
      const [result] = await Event.delete(id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ error: "Failed to delete event" });
    }
  },
};

module.exports = eventController;
