const WalletRequests = require("../models/WalletRequests");
const User = require("../models/Users");
const emailHelpers = require("../utils/emailHelper");
const crypto = require("crypto");

const walletRequestController = {
  // Request deduction or withdrawal
  requestWalletAction: async (req, res) => {
    try {
      const userId = req.user.id;
      const { amount, type, method, details } = req.body;
  
      // Validate input
      if (!amount || isNaN(amount) || amount <= 0 || !['deduct', 'withdraw'].includes(type)) {
        return res.status(400).json({ error: "Invalid request data" });
      }
  
      if (type === 'withdraw' && (!method || !['Wish', 'USDT'].includes(method))) {
        return res.status(400).json({ error: "Invalid withdrawal method" });
      }
  
      if (type === 'withdraw' && method === 'Wish' && !details) {
        return res.status(400).json({ error: "Phone number is required for Wish withdrawal" });
      }
  
      if (type === 'withdraw' && method === 'USDT' && !details) {
        return res.status(400).json({ error: "Wallet address is required for USDT withdrawal" });
      }
  
      // Add the request to the database
      await WalletRequests.addRequest(userId, amount, type, method, details);
  
      // Log the activity
      await WalletRequests.logActivity(
        userId,
        type,
        amount,
        `User requested a ${type} of $${amount} via ${method}`,
        "pending"
      );
  
      // Notify the admin
      await emailHelpers.sendEmail(
        process.env.ADMIN_EMAIL,
        `New Wallet ${type} Request`,
        `<p>User ${req.user.name} (${req.user.email}) has requested to ${type} $${amount} via ${method}. Details: ${details}</p>`
      );
  
      res.status(200).json({ message: `Wallet ${type} request submitted successfully` });
    } catch (error) {
      console.error("Error submitting wallet request:", error);
      res.status(500).json({ error: "Failed to submit wallet request" });
    }
  },
  

  // Approve a request
  approveRequest: async (req, res) => {
    try {
      const { requestId } = req.params;

      // Get request details
      const [requestDetails] = await WalletRequests.getRequestById(requestId);
      if (!requestDetails.length) {
        return res.status(404).json({ error: "Request not found" });
      }

      const request = requestDetails[0];

      // Deduct the amount from the user's wallet
      await User.deductFromWallet(request.user_id, request.amount);

      // Update the request status to approved
      await WalletRequests.approveRequest(requestId);

      // Log the activity
      await WalletRequests.logActivity(
        request.user_id,
        "withdraw_approve",
        request.amount,
        `Withdrawal of $${request.amount} approved by admin.`,
        "completed"
      );

      // Send an email to the user
      await emailHelpers.sendEmail(
        request.email,
        `Wallet ${request.type} Approved`,
        `<p>Your request to ${request.type} ${request.amount} has been approved.</p>`
      );

      res.status(200).json({ message: "Request approved successfully" });
    } catch (error) {
      console.error("Error approving request:", error);
      res.status(500).json({ error: "Failed to approve request" });
    }
  },

  // Reject a request
  rejectRequest: async (req, res) => {
    try {
      const { requestId } = req.params;

      // Get request details
      const [requestDetails] = await WalletRequests.getRequestById(requestId);
      if (!requestDetails.length) {
        return res.status(404).json({ error: "Request not found" });
      }

      const request = requestDetails[0];

      // Update the request status to rejected
      await WalletRequests.rejectRequest(requestId);

      // Log the activity
      await WalletRequests.logActivity(
        request.user_id,
        "withdraw_reject",
        request.amount,
        `Withdrawal of $${request.amount} rejected by admin.`,
        "rejected"
      );

      // Send an email to the user
      await emailHelpers.sendEmail(
        request.email,
        `Wallet ${request.type} Rejected`,
        `<p>Your request to ${request.type} ${request.amount} has been rejected.</p>`
      );

      res.status(200).json({ message: "Request rejected successfully" });
    } catch (error) {
      console.error("Error rejecting request:", error);
      res.status(500).json({ error: "Failed to reject request" });
    }
  },

  // Get all pending requests
  getPendingRequests: async (req, res) => {
    try {
      const [requests] = await WalletRequests.getPendingRequests();
      res.status(200).json(requests);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
      res.status(500).json({ error: "Failed to fetch pending requests" });
    }
  },

    // Get pending requests for a user
  getPendingRequestsForUser: (userId) => {
    const sql = `
      SELECT amount, type, status
      FROM wallet_requests
      WHERE user_id = ? AND status = 'pending'
    `;
    return db.execute(sql, [userId]);
  },

  // Get all wallet logs
  getAllLogs: async (req, res) => {
    try {
      const { limit = 50, offset = 0 } = req.query;
      const [logs] = await WalletRequests.getAllActivityLogs(parseInt(limit), parseInt(offset));
      res.status(200).json(logs);
    } catch (error) {
      console.error("Error fetching all wallet logs:", error);
      res.status(500).json({ error: "Failed to fetch wallet logs." });
    }
  },  

  // Generate OTP
  generateWalletOTP: async (req, res) => {
    try {
      const userId = req.user.id;
      const otp = crypto.randomInt(100000, 999999).toString();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      await WalletRequests.storeOTP(userId, otp, expiresAt);

      await emailHelpers.sendWalletOTP(req.user.email, otp);

      res.status(200).json({ message: "OTP sent to your email." });
    } catch (error) {
      console.error("Error generating OTP:", error);
      res.status(500).json({ error: "Failed to generate OTP." });
    }
  },

  // Validate OTP
  validateWalletOTP: async (req, res) => {
    try {
      const { otp } = req.body;
      const userId = req.user.id;

      const [rows] = await WalletRequests.validateOTP(userId, otp);

      if (rows.length === 0) {
        return res.status(400).json({ error: "Invalid or expired OTP." });
      }

      await WalletRequests.markOTPAsUsed(rows[0].id);

      res.status(200).json({ message: "OTP verified successfully." });
    } catch (error) {
      console.error("Error validating OTP:", error);
      res.status(500).json({ error: "Failed to validate OTP." });
    }
  },
  
  
};

module.exports = walletRequestController;
