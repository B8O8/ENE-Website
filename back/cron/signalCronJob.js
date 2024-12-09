const cron = require("node-cron");
const signalController = require("../controllers/signalController");

// Run expiry check every day at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("Running expiry check...");
  await signalController.handleExpiry();
});

// Run renewal reminder check every day at 8:00 AM
cron.schedule("0 8 * * *", async () => {
  console.log("Running renewal reminders...");
  await signalController.sendRenewalReminders();
});

console.log("Signal cron jobs initialized.");
