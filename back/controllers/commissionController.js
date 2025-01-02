const Commissions = require("../models/Commissions");

const commissionController = {
  // Fetch commission totals
  getCommissionTotals: async (req, res) => {
    try {
      const [totals] = await Commissions.getAggregatedCommissionTotals();
      res.status(200).json(totals[0]); // Return the first row with totals
    } catch (error) {
      console.error("Error fetching commission totals:", error);
      res.status(500).json({ error: "Failed to fetch commission totals." });
    }
  },

  // Fetch recent commission logs
  getRecentLogs: async (req, res) => {
    try {
      const { limit = 10 } = req.query; // Allow limiting results via query params
      const [logs] = await Commissions.getRecentCommissionLogs(parseInt(limit, 10));
      res.status(200).json(logs);
    } catch (error) {
      console.error("Error fetching recent commission logs:", error);
      res.status(500).json({ error: "Failed to fetch recent commission logs." });
    }
  },

  // Fetch user-specific commission logs
  getUserCommissionLogs: async (req, res) => {
    try {
      const userId = req.user.id;
      const [logs] = await Commissions.getUserWalletActivity(userId);
      res.status(200).json(logs);
    } catch (error) {
      console.error("Error fetching user commission logs:", error);
      res.status(500).json({ error: "Failed to fetch commission logs." });
    }
  },
};

module.exports = commissionController;
