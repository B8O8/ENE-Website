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
};

module.exports = WalletRequests;
