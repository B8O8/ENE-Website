const cron = require("node-cron");
const signalController = require("../controllers/signalController");

// Run renewal reminder check every day at 8:00 AM
cron.schedule("0 8 * * *", async () => {
  console.log("Running renewal reminders...");
  await signalController.sendRenewalReminders();
});

// Run expiry check every day at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("Running expiry check...");
  await signalController.handleExpiry();
});

// Run the tasks immediately when the application starts
// (async () => {
//   console.log("Running immediate renewal reminders...");
//   await signalController.sendRenewalReminders();

//   console.log("Running immediate expiry check...");
//   await signalController.handleExpiry();
// })();

console.log("Signal cron jobs initialized.");
