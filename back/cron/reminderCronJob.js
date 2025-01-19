const cron = require("node-cron");
const Reminder = require("../models/Reminder");
const emailHelpers = require("../utils/emailHelper");


// Schedule a cron job to send reminder emails every day at 8 AM
cron.schedule("0 8 * * *", async () => { // Runs every day at 8 AM
  try {
    const [reminders] = await Reminder.getAll();

    const today = new Date().toISOString().split("T")[0];

    reminders.forEach(async (reminder) => {
      if (reminder.reminder_date === today) {
        await emailHelpers.sendEmail(
          process.env.ADMIN_EMAIL,
          `Reminder: ${reminder.name}`,
          `<p>${reminder.description}</p>`
        );
        console.log(`Email sent for reminder: ${reminder.name}`);
      }
    });
  } catch (error) {
    console.error("Error sending reminders:", error);
  }
});

console.log("Reminder email cron job initialized.");
