const db = require("../db/connection");

const Signal = {
  // Log a signal action (e.g., user added to channel, reminder sent)
  logAction: (userId, action, details = null) => {
    const sql = `
      INSERT INTO signal_logs (user_id, action, details, created_at)
      VALUES (?, ?, ?, NOW())
    `;
    return db.execute(sql, [userId, action, details]);
  },

  // Fetch logs for a specific user
  getLogsByUser: (userId) => {
    const sql = `
      SELECT * FROM signal_logs WHERE user_id = ? ORDER BY created_at DESC
    `;
    return db.execute(sql, [userId]);
  },

  // Fetch all logs (e.g., for admin monitoring)
  getAllLogs: () => {
    const sql = `
      SELECT * FROM signal_logs ORDER BY created_at DESC
    `;
    return db.execute(sql);
  },

  // Retry adding a user to the channel
  retryAddToChannel: (userId) => {
    const sql = `
      UPDATE signal_logs
      SET retry_count = retry_count + 1, last_retry_at = NOW()
      WHERE user_id = ? AND action = 'add_to_channel' AND retry_count < 3
    `;
    return db.execute(sql, [userId]);
  },

  // Mark a user as added to the signal channel
  markAsAdded: (userId, durationDays) => {
    const sql = `
      UPDATE users
      SET signal_status = 'active', subscription_expiry = DATE_ADD(NOW(), INTERVAL ? DAY)
      WHERE id = ?
    `;
    return db.execute(sql, [durationDays, userId]);
  },

  // Mark a user as expired
  markAsExpired: (userId) => {
    const sql = `
      UPDATE users
      SET signal_status = 'expired'
      WHERE id = ?
    `;
    return db.execute(sql, [userId]);
  },

  // Get users nearing subscription expiry
  getUsersNearExpiry: (daysBeforeExpiry) => {
    const sql = `
      SELECT id, name, email, subscription_expiry
      FROM users
      WHERE subscription_expiry IS NOT NULL
        AND signal_status = 'active'
        AND subscription_expiry <= DATE_ADD(NOW(), INTERVAL ? DAY)
    `;
    return db.execute(sql, [daysBeforeExpiry]);
  },

  // Get expired users
  getExpiredUsers: () => {
    const sql = `
      SELECT id, name, email, subscription_expiry
      FROM users
      WHERE subscription_expiry IS NOT NULL
        AND signal_status = 'active'
        AND subscription_expiry <= NOW()
    `;
    return db.execute(sql);
  },

  // Remove a user from the signal channel
  removeFromChannel: (userId) => {
    const sql = `
      UPDATE users
      SET signal_status = 'expired'
      WHERE id = ?
    `;
    return db.execute(sql, [userId]);
  },
};

module.exports = Signal;

