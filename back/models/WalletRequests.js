const db = require("../db/connection");

const WalletRequests = {
  // Add a new wallet request
  addRequest: (userId, amount, type, method, details) => {
    const sql = `
      INSERT INTO wallet_requests (user_id, amount, type, method, details)
      VALUES (?, ?, ?, ?, ?)
    `;
    return db.execute(sql, [userId, amount, type, method, details]);
  },

  // Get all pending requests
  getPendingRequests: () => {
    const sql = `
      SELECT wallet_requests.*, users.name, users.email
      FROM wallet_requests
      JOIN users ON wallet_requests.user_id = users.id
      WHERE wallet_requests.status = 'pending'
    `;
    return db.execute(sql);
  },

  // Approve a request
  approveRequest: (requestId) => {
    const sql = `
      UPDATE wallet_requests
      SET status = 'approved'
      WHERE id = ?
    `;
    return db.execute(sql, [requestId]);
  },

  // Reject a request
  rejectRequest: (requestId) => {
    const sql = `
      UPDATE wallet_requests
      SET status = 'rejected'
      WHERE id = ?
    `;
    return db.execute(sql, [requestId]);
  },

  // Get request details
  getRequestById: (requestId) => {
    const sql = `
      SELECT wallet_requests.*, users.name, users.email, users.wallet_balance
      FROM wallet_requests
      JOIN users ON wallet_requests.user_id = users.id
      WHERE wallet_requests.id = ?
    `;
    return db.execute(sql, [requestId]);
  },

  // Log wallet activity
  logActivity: (
    userId,
    activityType,
    amount,
    description,
    status = "pending"
  ) => {
    const sql = `
    INSERT INTO wallet_activity (user_id, activity_type, amount, description, status)
    VALUES (?, ?, ?, ?, ?)
  `;
    return db.execute(sql, [userId, activityType, amount, description, status]);
  },

  // Fetch all withdrawal requests (admin)
  getAllActivityLogs: (limit = 50, offset = 0) => {
    const sql = `
    SELECT wallet_activity.*, users.name AS user_name, users.email AS user_email
    FROM wallet_activity
    JOIN users ON wallet_activity.user_id = users.id
    ORDER BY wallet_activity.created_at DESC
    LIMIT ? OFFSET ?
  `;
    return db.execute(sql, [limit, offset]);
  },
  

  // Approve or reject a withdrawal request
  updateWithdrawRequestStatus: (requestId, status) => {
    const sql = `
    UPDATE wallet_activity
    SET status = ?
    WHERE id = ?
  `;
    return db.execute(sql, [status, requestId]);
  },

  // Get wallet totals
  getUserWalletActivity: (userId) => {
    const sql = `
    SELECT 
      id, 
      activity_type, 
      CAST(amount AS DECIMAL(10,2)) AS amount, 
      description, 
      status, 
      created_at 
    FROM wallet_activity
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;
    return db.execute(sql, [userId]);
  },

  // Store OTP
  storeOTP: (userId, otp, expiresAt) => {
    const sql = `
    INSERT INTO wallet_otps (user_id, otp_code, expires_at)
    VALUES (?, ?, ?)
  `;
    return db.execute(sql, [userId, otp, expiresAt]);
  },

  // Validate OTP
  validateOTP: (userId, otp) => {
    const sql = `
    SELECT * FROM wallet_otps 
    WHERE user_id = ? AND otp_code = ? AND is_used = FALSE AND expires_at > NOW()
  `;
    return db.execute(sql, [userId, otp]);
  },

  // Mark OTP as used
  markOTPAsUsed: (otpId) => {
    const sql = `
    UPDATE wallet_otps SET is_used = TRUE WHERE id = ?
  `;
    return db.execute(sql, [otpId]);
  },
};

module.exports = WalletRequests;
