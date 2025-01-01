const db = require("../db/connection");

const Commissions = {
  // Add a new commission with a calculated transfer date
  addCommission: (
    userId,
    amount,
    commissionType,
    referrerLevel,
    earnedAt = new Date()
  ) => {
    const sql = `
      INSERT INTO commissions (user_id, amount, commission_type, referrer_level, earned_at, transfer_date, status)
      VALUES (?, ?, ?, ?, ?, ?, 'pending')
    `;

    // Calculate transfer date
    const earnedDate = new Date(earnedAt);
    const dayOfWeek = earnedDate.getDay(); // 0 (Sunday) to 6 (Saturday)
    const daysUntilNextMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
    const nextMonday = new Date(earnedDate);
    nextMonday.setDate(nextMonday.getDate() + daysUntilNextMonday);

    const transferDate = new Date(nextMonday);
    transferDate.setDate(nextMonday.getDate() + 7); // Second Monday

    return db.execute(sql, [
      userId,
      amount,
      commissionType,
      referrerLevel,
      earnedAt,
      transferDate,
    ]);
  },

  // Get all pending commissions for a user
  getPendingCommissions: (userId) => {
    const sql = `
      SELECT * FROM commissions
      WHERE user_id = ? AND status = 'pending'
    `;
    return db.execute(sql, [userId]);
  },

  // Update commission status to 'transferred'
  transferCommissionToWallet: (commissionId) => {
    const sql = `
      UPDATE commissions
      SET status = 'transferred'
      WHERE id = ?
    `;
    return db.execute(sql, [commissionId]);
  },

  // Delete old commissions (optional, depending on requirements)
  deleteOldCommissions: (userId, thresholdDate) => {
    const sql = `
      DELETE FROM commissions
      WHERE user_id = ? AND earned_at < ?
    `;
    return db.execute(sql, [userId, thresholdDate]);
  },

  // Fetch all wallet transactions for a specific user
  getUserWalletActivity: (userId) => {
    const sql = `
    SELECT id, amount, commission_type AS type, earned_at AS date, status
    FROM commissions
    WHERE user_id = ?
    ORDER BY earned_at DESC
  `;
    return db.execute(sql, [userId]);
  },

  // Fetch aggregated wallet activity for admin
  getAllWalletActivity: (limit = 50, offset = 0) => {
    const sql = `
    SELECT commissions.*, users.name AS user_name, users.email AS user_email
    FROM commissions
    JOIN users ON commissions.user_id = users.id
    ORDER BY earned_at DESC
    LIMIT ? OFFSET ?
  `;
    return db.execute(sql, [limit, offset]);
  },

  // Fetch aggregated commission totals for admin
  getAggregatedCommissionTotals: () => {
    const sql = `
    SELECT
      SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS total_pending_commissions,
      SUM(CASE WHEN status = 'transferred' THEN amount ELSE 0 END) AS total_transferred_commissions
    FROM commissions
  `;
    return db.execute(sql);
  },

  // Fetch recent commission logs (admin)
  getRecentCommissionLogs: (limit = 10) => {
    const sql = `
    SELECT commissions.*, users.name AS user_name, users.email AS user_email
    FROM commissions
    JOIN users ON commissions.user_id = users.id
    ORDER BY earned_at DESC
    LIMIT ?
  `;
    return db.execute(sql, [limit]);
  },

  // Fetch aggregated totals for admin
  getAggregatedWalletTotals: () => {
    const sql = `
      SELECT
        SUM(CASE WHEN wallet_activity.activity_type = 'add' THEN wallet_activity.amount ELSE 0 END) AS total_added,
        SUM(CASE WHEN wallet_activity.activity_type = 'deduct' THEN wallet_activity.amount ELSE 0 END) AS total_deducted,
        SUM(CASE WHEN wallet_activity.activity_type = 'withdraw' THEN wallet_activity.amount ELSE 0 END) AS total_withdrawn
      FROM wallet_activity
    `;
    return db.execute(sql); // No parameters needed for this query
  },
  
};

module.exports = Commissions;
