const db = require("../db/connection");

const Commissions = {
  // Add a new commission with a calculated transfer date
  addCommission: (userId, amount, commissionType, referrerLevel, earnedAt = new Date()) => {
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
  
    return db.execute(sql, [userId, amount, commissionType, referrerLevel, earnedAt, transferDate]);
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
};

module.exports = Commissions;
