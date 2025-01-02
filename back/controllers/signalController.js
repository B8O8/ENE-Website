const Signal = require("../models/SignalModel");
const User = require("../models/Users");
const TelegramBot = require("node-telegram-bot-api");

// Initialize the Telegram bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Handle new members joining the group via invite links
bot.on("message", async (msg) => {
  if (msg.new_chat_members) {
    const newMembers = msg.new_chat_members;

    for (const member of newMembers) {
      const telegramId = member.id;
      const username = member.username || member.first_name;

      

      try {
        // Find the most recent invite link generated for the user
        const [recentInvite] = await Signal.getMostRecentInviteLink();
        if (!recentInvite || recentInvite.length === 0) {
          console.error("No recent invite link found for the new member.");
          await bot.sendMessage(
            telegramId,
            "Welcome! Please contact support if you encounter issues."
          );
          continue;
        }

        const userId = recentInvite[0].user_id;

        // Save the telegram_id to the database
        await Signal.saveTelegramId(userId, telegramId);

        console.log(`Saved Telegram ID ${telegramId} for User ID ${userId}`);
      } catch (error) {
        console.error("Error processing new group member:", error);
      }
    }
  }
});

const signalController = {
  // Add authenticated user to the signals channel
  addToChannel: async (req, res) => {
    try {
      const { userId } = req.body;

     
      if (!userId) {
        return res.status(400).json({ error: "User ID is required." });
      }

      // Fetch user details
      const [user] = await User.findById(userId);

      if (!user.length) {
        return res.status(404).json({ error: "User not found." });
      }

      const userInfo = user[0];
    

      // Check if the user already has an active invite link
      const [existingLink] = await Signal.getActiveInviteLink(userId);

      if (existingLink.length > 0) {
        return res.status(403).json({
          error:
            "You have already generated an invite link. Contact admin for a new one.",
        });
      }

      // Validate subscription expiry
      if (
        !userInfo.subscription_expiry ||
        new Date(userInfo.subscription_expiry) < new Date()
      ) {
        return res
          .status(403)
          .json({
            error: "Subscription expired. Please renew to access signals.",
          });
      }

      // Generate a unique invite link for the user
      const inviteLink = await bot.createChatInviteLink(
        process.env.TELEGRAM_GROUP_ID,
        {
          name: `Invite for ${userInfo.name}`, // Custom name for the invite link
          expire_date: Math.floor(Date.now() / 1000) + 3600, // Expire in 1 hour
          member_limit: 1, // Limit to 1 user
        }
      );

      console.log("Generated Invite Link:", inviteLink);

      // Save the invite link to the database
      await Signal.saveInviteLink(userId, inviteLink.invite_link);

      // Log the invite generation
      await Signal.logAction(
        userId,
        "add_to_channel",
        "Invite link generated for the user."
      );

      res.status(200).json({
        message: "Invite link generated successfully.",
        inviteLink: inviteLink.invite_link,
      });
    } catch (error) {
      console.error("Error adding user to channel:", error);
      res
        .status(500)
        .json({
          error: "Failed to generate invite link for the signals channel.",
        });
    }
  },

  // Handle reminders for users nearing expiry
  sendRenewalReminders: async () => {
    try {
      const [usersNearExpiry] = await Signal.getUsersNearExpiry(5); // Check for users expiring in 5 days

      for (const user of usersNearExpiry) {
        try {
          if (!user.telegram_id) {
            console.error(
              `Skipping reminder for User ID ${user.id} due to missing telegram_id.`
            );
            continue;
          }

          const message = `Hi ${
            user.name
          }, your subscription expires on ${new Date(
            user.subscription_expiry
          ).toLocaleDateString()}. Please renew to continue receiving signals.`;

          await bot.sendMessage(user.telegram_id, message);

          // Log the reminder
          await Signal.logAction(
            user.id,
            "reminder_sent",
            "Renewal reminder sent."
          );
        } catch (telegramError) {
          console.error(
            `Failed to send renewal reminder to User ID ${user.id}:`,
            telegramError.message
          );
        }
      }

      console.log("Renewal reminders sent successfully.");
    } catch (error) {
      console.error("Error sending renewal reminders:", error);
    }
  },

  // Remove users with expired subscriptions
  handleExpiry: async () => {
    try {
      const [expiredUsers] = await Signal.getExpiredUsers();

      for (const user of expiredUsers) {
        try {
          if (!user.telegram_id) {
            console.error(
              `Skipping removal for User ID ${user.id} due to missing telegram_id.`
            );
            continue;
          }

          // Remove the user from the Telegram group
          await bot.banChatMember(
            process.env.TELEGRAM_GROUP_ID,
            user.telegram_id
          );
          await Signal.markAsExpired(user.id);

          // Log the removal
          await Signal.logAction(
            user.id,
            "remove_from_channel",
            "User removed due to subscription expiry."
          );

          // Notify the user
          const message = `Hi ${user.name}, you have been removed from the channel because your subscription has expired. Please renew your subscription to regain access.\n\nFor inquiries, contact support at support@ene.ac.`;
          await bot.sendMessage(user.telegram_id, message);

          console.log(`Removed and notified User ID ${user.id}.`);
        } catch (telegramError) {
          console.error(
            `Failed to remove or notify User ID ${user.id}:`,
            telegramError.message
          );
        }
      }

      console.log("Expired users handled successfully.");
    } catch (error) {
      console.error("Error handling expired subscriptions:", error);
    }
  },

  // Reset invite link access for a user
  resetInviteLink: async (req, res) => {
    try {
      const { userId } = req.body;

      console.log("Reset request for User ID:", userId);

      // Delete active invite link logs for the user
      await Signal.resetInviteAccess(userId);

      res
        .status(200)
        .json({ message: "User's invite link access has been reset." });
    } catch (error) {
      console.error("Error resetting invite access:", error);
      res.status(500).json({ error: "Failed to reset invite link access." });
    }
  },

  // Fetch active invite link for a user
  getInviteLink: async (req, res) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required." });
      }

      const [inviteLinkData] = await Signal.getInviteLink(userId);

      if (!inviteLinkData.length) {
        return res.status(404).json({ error: "No active invite link found." });
      }

      res.status(200).json({ inviteLink: inviteLinkData[0].invite_link });
    } catch (error) {
      console.error("Error fetching invite link:", error);
      res.status(500).json({ error: "Failed to fetch invite link." });
    }
  },

  // Fetch all signal logs
  getAllLogs: async (req, res) => {
    try {
      const [logs] = await Signal.getAllLogs();
      res.status(200).json(logs);
    } catch (error) {
      console.error("Error fetching all logs:", error.message);
      res.status(500).json({ error: "Failed to fetch signal logs." });
    }
  },
};

module.exports = signalController;
