const Event = require("../models/Event");
const emailHelpers = require("../utils/emailHelper");

const eventController = {
  createEvent: async (req, res) => {
    try {
      const { first_name, last_name, email, phone, country_of_residence, event_number, event_name } = req.body;

      // Validate that all required fields are provided
      if (!first_name || !last_name || !email || !phone || !country_of_residence || !event_number || !event_name) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Check if email already exists for this specific event
      const [existingEvent] = await Event.findByEmailAndEvent(email, event_number);
      if (existingEvent.length > 0) {
        return res.status(400).json({ error: "Email already registered for this event" });
      }

      // Send confirmation email
      await emailHelpers.sendEventConfirmation(email, first_name);

      // Create the event record
      const [result] = await Event.create({ first_name, last_name, email, phone, country_of_residence, event_number, event_name });
      return res.status(201).json({ message: "Event registered successfully", eventId: result.insertId });
    } catch (error) {
      console.error("Error creating event:", error);
      return res.status(500).json({ error: "Failed to create event" });
    }
  },

  getEvents: async (req, res) => {
    try {
      const { event_number } = req.query;
      let events;
      if (event_number) {
        [events] = await Event.getByEventNumber(event_number);
      } else {
        [events] = await Event.getAll();
      }
      return res.status(200).json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      return res.status(500).json({ error: "Failed to fetch events" });
    }
  },

  deleteEvent: async (req, res) => {
    try {
      const { id } = req.params;
      const [result] = await Event.delete(id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Event not found" });
      }
      return res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error("Error deleting event:", error);
      return res.status(500).json({ error: "Failed to delete event" });
    }
  },
};

module.exports = eventController;