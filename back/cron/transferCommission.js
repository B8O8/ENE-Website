const cron = require("node-cron");
const db = require("../db/connection");
const User = require("../models/Users");
const Commissions = require("../models/Commissions");

const transferCommissions = async () => {
  try {
    const today = new Date().toISOString().split("T")[0]; // Today's date in YYYY-MM-DD

    // Fetch all commissions where the transfer date is today
    const [commissionsToTransfer] = await db.execute(
      `SELECT * FROM commissions WHERE status = 'pending' AND transfer_date = ?`,
      [today]
    );

    if (commissionsToTransfer.length === 0) {
      console.log("No commissions to transfer today.");
      return;
    }

    for (const commission of commissionsToTransfer) {
      // Add the amount to the user's wallet balance
      await User.addToWallet(commission.user_id, commission.amount);

      // Mark the commission as transferred
      await Commissions.transferCommissionToWallet(commission.id);

      console.log(`Transferred commission ID: ${commission.id}, Amount: ${commission.amount}`);
    }
  } catch (error) {
    console.error("Error transferring commissions:", error);
  }
};

// Schedule the task to run every day at midnight
cron.schedule("0 0 * * *", transferCommissions);

console.log("Cron job for transferring commissions scheduled.");
