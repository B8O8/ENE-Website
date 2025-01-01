const db = require("../db/connection");

const WalletRequests = {
  // Add a new wallet request
  addRequest: (userId, amount, type) => {
    const sql = `
      INSERT INTO wallet_requests (user_id, amount, type)
      VALUES (?, ?, ?)
    `;
    return db.execute(sql, [userId, amount, type]);
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
logActivity: (userId, activityType, amount, description, status = 'pending') => {
  const sql = `
    INSERT INTO wallet_activity (user_id, activity_type, amount, description, status)
    VALUES (?, ?, ?, ?, ?)
  `;
  return db.execute(sql, [userId, activityType, amount, description, status]);
},

// Fetch all withdrawal requests (admin)
getAllWithdrawRequests: (status, limit = 50, offset = 0) => {
  const sql = `
    SELECT wallet_activity.*, users.name AS user_name, users.email AS user_email
    FROM wallet_activity
    JOIN users ON wallet_activity.user_id = users.id
    WHERE wallet_activity.activity_type = 'withdraw_request' AND wallet_activity.status = ?
    ORDER BY wallet_activity.created_at DESC
    LIMIT ? OFFSET ?
  `;
  return db.execute(sql, [status, limit, offset]);
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


};

module.exports = WalletRequests;
