const Subscription = require("../models/Subscriptions");

const subscriptionController = {
  // Create a new subscription
  createSubscription: async (req, res) => {
    try {
      const { name, description, price, duration, is_vip, is_hide } = req.body;

      if (!name || !price || !duration) {
        return res.status(400).json({ error: "Name, price, and duration are required" });
      }

      const [result] = await Subscription.create({ name, description, price, duration, is_vip, is_hide });
      res.status(201).json({ message: "Subscription created successfully", subscriptionId: result.insertId });
    } catch (error) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ error: "Failed to create subscription" });
    }
  },

  // Get all subscriptions
  getAllSubscriptions: async (req, res) => {
    try {
      const [subscriptions] = await Subscription.getAll();
      res.status(200).json(subscriptions); // Return all subscriptions
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      res.status(500).json({ error: "Failed to fetch subscriptions" });
    }
  },

  // Get subscription by ID
  getSubscriptionById: async (req, res) => {
    try {
      const { id } = req.params;

      const [rows] = await Subscription.findById(id);
      if (rows.length === 0) {
        return res.status(404).json({ error: "Subscription not found" });
      }

      res.status(200).json(rows[0]);
    } catch (error) {
      console.error("Error fetching subscription:", error);
      res.status(500).json({ error: "Failed to fetch subscription" });
    }
  },

  // Update a subscription
  updateSubscription: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, price, duration, is_vip, is_hide } = req.body;

      if (!name || !price || !duration) {
        return res.status(400).json({ error: "Name, price, and duration are required" });
      }

      const [result] = await Subscription.update(id, { name, description, price, duration, is_vip, is_hide });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Subscription not found" });
      }

      res.status(200).json({ message: "Subscription updated successfully" });
    } catch (error) {
      console.error("Error updating subscription:", error);
      res.status(500).json({ error: "Failed to update subscription" });
    }
  },

  // Delete a subscription
  deleteSubscription: async (req, res) => {
    try {
      const { id } = req.params;

      const [result] = await Subscription.delete(id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Subscription not found" });
      }

      res.status(200).json({ message: "Subscription deleted successfully" });
    } catch (error) {
      console.error("Error deleting subscription:", error);
      res.status(500).json({ error: "Failed to delete subscription" });
    }
  },
};

module.exports = subscriptionController;
