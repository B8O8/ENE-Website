const Reminder = require("../models/Reminder");
const emailHelpers = require("../utils/emailHelper");

const reminderController = {
  createReminder: async (req, res) => {
    try {
      const { name, description, reminder_date, email } = req.body;

      if (!name || !description || !reminder_date || !email) {
        return res.status(400).json({ error: "All fields are required" });
      }

      await Reminder.create({ name, description, reminder_date, email });
      res.status(201).json({ message: "Reminder created successfully" });
    } catch (error) {
      console.error("Error creating reminder:", error);
      res.status(500).json({ error: "Failed to create reminder" });
    }
  },

  getAllReminders: async (req, res) => {
    try {
      const [reminders] = await Reminder.getAll();
      res.status(200).json(reminders);
    } catch (error) {
      console.error("Error fetching reminders:", error);
      res.status(500).json({ error: "Failed to fetch reminders" });
    }
  },

  deleteReminder: async (req, res) => {
    try {
      const { id } = req.params;

      await Reminder.delete(id);
      res.status(200).json({ message: "Reminder deleted successfully" });
    } catch (error) {
      console.error("Error deleting reminder:", error);
      res.status(500).json({ error: "Failed to delete reminder" });
    }
  },
};

module.exports = reminderController;
