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

  // Save an invite link for a user
  saveInviteLink: (userId, inviteLink) => {
    const sql = `
      INSERT INTO signal_logs (user_id, action, details, invite_link, created_at)
      VALUES (?, 'add_to_channel', 'Invite link generated', ?, NOW())
    `;
    return db.execute(sql, [userId, inviteLink]);
  },

  // Get user by invite link
  getUserByInviteLink: (inviteLink) => {
    const sql = `
      SELECT user_id FROM signal_logs WHERE invite_link = ? LIMIT 1
    `;
    return db.execute(sql, [inviteLink]);
  },

  // Save telegram ID for a user
  saveTelegramId: (userId, telegramId) => {
    const sql = `
      UPDATE users
      SET telegram_id = ?, signal_status = 'active'
      WHERE id = ?
    `;
    return db.execute(sql, [telegramId, userId]);
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
      SELECT id, name, telegram_id, subscription_expiry
      FROM users
      WHERE subscription_expiry IS NOT NULL
        AND signal_status = 'active'
        AND subscription_expiry <= DATE_ADD(NOW(), INTERVAL ? DAY)
    `;
    return db.execute(sql, [daysBeforeExpiry]);
  },

  // Get active invite link for a user
  getActiveInviteLink: (userId) => {
    const sql = `
      SELECT * FROM signal_logs
      WHERE user_id = ? AND action = 'add_to_channel'
        AND created_at > NOW() - INTERVAL 1 HOUR
    `;
    return db.execute(sql, [userId]);
  },

  // Get expired users
  getExpiredUsers: () => {
    const sql = `
      SELECT id, name, telegram_id, subscription_expiry
      FROM users
      WHERE subscription_expiry IS NOT NULL
        AND signal_status = 'active'
        AND subscription_expiry <= NOW()
    `;
    return db.execute(sql);
  },

  // Reset invite access for a user
  resetInviteAccess: (userId) => {
    const sql = `DELETE FROM signal_logs WHERE user_id = ? AND action = 'add_to_channel'`;
    return db.execute(sql, [userId]);
  },

  getInviteLink: (userId) => {
    const sql = `
      SELECT invite_link
      FROM signal_logs
      WHERE user_id = ? AND action = 'add_to_channel' AND created_at > NOW() - INTERVAL 1 HOUR
      LIMIT 1
    `;
    return db.execute(sql, [userId]);
  },

  getUserByTelegramId: (telegramId) => {
    const sql = `
      SELECT * FROM users WHERE telegram_id = ?
    `;
    return db.execute(sql, [telegramId]);
  },

  getMostRecentInviteLink: () => {
    const sql = `
      SELECT user_id, invite_link
      FROM signal_logs
      WHERE action = 'add_to_channel'
      ORDER BY created_at DESC
      LIMIT 1
    `;
    return db.execute(sql);
  },

  getAllLogs: () => {
    const sql = `
      SELECT 
        signal_logs.id,
        signal_logs.user_id,
        signal_logs.action,
        signal_logs.details,
        signal_logs.invite_link,
        signal_logs.retry_count,
        signal_logs.last_retry_at,
        signal_logs.created_at,
        users.name AS user_name,
        users.email AS user_email
      FROM signal_logs
      LEFT JOIN users ON signal_logs.user_id = users.id
      ORDER BY signal_logs.created_at DESC
    `;
    return db.execute(sql);
  },
  

  // Get users nearing subscription expiry
  getUsersNearExpiry: (daysBeforeExpiry) => {
    const sql = `
      SELECT id, name, telegram_id, subscription_expiry
      FROM users
      WHERE subscription_expiry IS NOT NULL
        AND signal_status = 'active'
        AND subscription_expiry <= DATE_ADD(NOW(), INTERVAL ? DAY)
        AND subscription_expiry > NOW()
    `;
    return db.execute(sql, [daysBeforeExpiry]);
  },

  // Get users with expired subscriptions
  getExpiredUsers: () => {
    const sql = `
      SELECT id, name, telegram_id, subscription_expiry
      FROM users
      WHERE subscription_expiry IS NOT NULL
        AND signal_status = 'active'
        AND subscription_expiry <= NOW()
    `;
    return db.execute(sql);
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
};

module.exports = Signal;
