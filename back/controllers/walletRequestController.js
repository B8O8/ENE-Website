const WalletRequests = require("../models/WalletRequests");
const User = require("../models/Users");
const emailHelpers = require("../utils/emailHelper");

const walletRequestController = {
  // Request deduction or withdrawal
  requestWalletAction: async (req, res) => {
    try {
      const userId = req.user.id;
      const { amount, type } = req.body;

      if (!amount || isNaN(amount) || amount <= 0 || !['deduct', 'withdraw'].includes(type)) {
        return res.status(400).json({ error: "Invalid request data" });
      }

      // Add the request to the database
      await WalletRequests.addRequest(userId, amount, type);

      // Send an email to the admin
      await emailHelpers.sendEmail(
        process.env.ADMIN_EMAIL,
        `New Wallet ${type} Request`,
        `<p>User ${req.user.name} (${req.user.email}) has requested to ${type} ${amount}$ from their wallet.</p>`
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
  
};

module.exports = walletRequestController;
