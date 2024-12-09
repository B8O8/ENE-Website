const Signal = require("../models/SignalModel");
const User = require("../models/userModel");
const TelegramBot = require("node-telegram-bot-api");

// Initialize the Telegram bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

const signalController = {
  // Add user to the signals channel
  addToChannel: async (req, res) => {
    try {
      const { userId } = req.body;

      // Fetch user details
      const [user] = await User.findById(userId);

      if (!user.length) {
        return res.status(404).json({ error: "User not found" });
      }

      const userInfo = user[0];

      // Check subscription validity
      if (!userInfo.subscription_expiry || new Date(userInfo.subscription_expiry) < new Date()) {
        return res.status(403).json({ error: "Subscription expired. Please renew to access signals." });
      }

      // Check signal status
      if (userInfo.signal_status === "active") {
        return res.status(200).json({ message: "User already active in the signals channel." });
      }

      // Add the user to the Telegram channel
      await bot.addChatMember(process.env.TELEGRAM_CHANNEL_ID, {
        user_id: userInfo.phone, // Assuming phone is mapped to Telegram ID
      });

      // Update the user status and log the action
      await Signal.markAsAdded(userId, 30); // Assuming a default 30-day duration
      await Signal.logAction(userId, "add_to_channel", "User added to the signals channel.");

      res.status(200).json({ message: "User added to the signals channel." });
    } catch (error) {
      console.error("Error adding user to channel:", error);
      res.status(500).json({ error: "Failed to add user to the signals channel." });
    }
  },

  // Handle subscription expiration
  handleExpiry: async () => {
    try {
      const [expiredUsers] = await Signal.getExpiredUsers();

      for (const user of expiredUsers) {
        // Remove the user from the channel
        await bot.banChatMember(process.env.TELEGRAM_CHANNEL_ID, user.phone);
        await Signal.markAsExpired(user.id);

        // Log the removal
        await Signal.logAction(user.id, "remove_from_channel", "User removed due to subscription expiry.");
      }

      console.log("Expired users handled successfully.");
    } catch (error) {
      console.error("Error handling expired subscriptions:", error);
    }
  },

  // Send renewal reminders
  sendRenewalReminders: async () => {
    try {
      const [usersNearExpiry] = await Signal.getUsersNearExpiry(5); // Check for users expiring in 5 days

      for (const user of usersNearExpiry) {
        // Notify the user via email or other communication
        console.log(`Sending renewal reminder to ${user.name} (${user.email}).`);

        // Log the reminder
        await Signal.logAction(user.id, "reminder_sent", "Renewal reminder sent.");
      }

      console.log("Renewal reminders sent successfully.");
    } catch (error) {
      console.error("Error sending renewal reminders:", error);
    }
  },
};

module.exports = signalController;
