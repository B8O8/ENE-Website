const User = require("../models/Users");

const walletController = {
  // Get wallet balance
  getWalletBalance: async (req, res) => {
    try {
      const userId = req.user.id;
      const [rows] = await User.getWalletBalance(userId);

      if (rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ wallet_balance: rows[0].wallet_balance });
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      res.status(500).json({ error: "Failed to fetch wallet balance" });
    }
  },

  // Deduct funds from wallet
  deductFromWallet: async (req, res) => {
    try {
      const userId = req.user.id;
      const { amount } = req.body;

      if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
      }

      const [result] = await User.deductFromWallet(userId, amount);
      if (result.affectedRows === 0) {
        return res.status(400).json({ error: "Insufficient wallet balance" });
      }

      res.status(200).json({ message: "Funds deducted successfully" });
    } catch (error) {
      console.error("Error deducting funds from wallet:", error);
      res.status(500).json({ error: "Failed to deduct funds from wallet" });
    }
  },

  // Withdraw funds
  withdrawFromWallet: async (req, res) => {
    try {
      const userId = req.user.id;
      const { amount } = req.body;

      if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
      }

      const [result] = await User.deductFromWallet(userId, amount);
      if (result.affectedRows === 0) {
        return res.status(400).json({ error: "Insufficient wallet balance" });
      }

      res.status(200).json({ message: "Withdrawal initiated successfully" });
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      res.status(500).json({ error: "Failed to process withdrawal" });
    }
  },
};

module.exports = walletController;
