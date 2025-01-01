const db = require("../db/connection");

const User = {
  
  // Create a new user
  create: ({ name, email, password, phone, date_of_birth, address, profession, referred_by, subscription_id, affiliate_link }) => {
    const sql = `
      INSERT INTO users (name, email, password, phone, date_of_birth, address, profession, referred_by, subscription_id, affiliate_link)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    return db.execute(sql, [name, email, password, phone, date_of_birth, address, profession, referred_by, subscription_id, affiliate_link]);
  },

  // Update user details
  updateUser: (userId, { name, phone, date_of_birth, address, profession }) => {
    const sql = `
      UPDATE users
      SET name = ?, phone = ?, date_of_birth = ?, address = ?, profession = ?
      WHERE id = ?
    `;
    return db.execute(sql, [name, phone, date_of_birth, address, profession, userId]);
  },

  updateUserAdmin: (userId, { name, email, phone, date_of_birth, address, profession, rank, subscription_id, status, subscription_expiry }) => {
    const sql = `
      UPDATE users
      SET name = ?, email = ?, phone = ?, date_of_birth = ?, address = ?, profession = ?, rank = ?, subscription_id = ?, status = ?, subscription_expiry = ?
      WHERE id = ?
    `;
    return db.execute(sql, [name, email, phone, date_of_birth, address, profession, rank, subscription_id, status, subscription_expiry, userId]);
  },

  // Find a user by email
  findByEmail: (email) => {
    const sql = `
      SELECT u.id, u.email, u.name, u.rank, u.password, u.status, u.subscription_id, s.is_vip
      FROM users u
      LEFT JOIN subscriptions s ON u.subscription_id = s.id
      WHERE u.email = ?
    `;
    return db.execute(sql, [email]);
  },
  

  // Approve a user
  approve: (userId) => {
    const sql = `UPDATE users SET status = 'Approved' WHERE id = ?`;
    return db.execute(sql, [userId]);
  },

  // Reject a user
  reject: (userId) => {
    const sql = `UPDATE users SET status = 'Rejected' WHERE id = ?`;
    return db.execute(sql, [userId]);
  },

  // Get all users
  getAll: () => {
    const sql = `SELECT * FROM users`;
    return db.execute(sql);
  },

  // Find a user by ID
  findById: (id) => {
    const sql = `SELECT * FROM users WHERE id = ?`;
    return db.execute(sql, [id]);
  },

  // Save reset token and expiry
  saveResetToken: (userId, resetToken, resetExpires) => {
    const sql = `
      UPDATE users
      SET reset_token = ?, reset_expires = ?
      WHERE id = ?
    `;
    return db.execute(sql, [resetToken, resetExpires, userId]);
  },

  // Find user by reset token
  findByResetToken: (token) => {
    const sql = `
      SELECT * FROM users
      WHERE reset_token = ?
    `;
    return db.execute(sql, [token]);
  },

  // Update password and clear reset token
  updatePassword: (userId, hashedPassword) => {
    const sql = `
      UPDATE users
      SET password = ?, reset_token = NULL, reset_expires = NULL
      WHERE id = ?
    `;
    return db.execute(sql, [hashedPassword, userId]);
  },

  // Update user photo
  updatePhoto: (userId, photoPath) => {
    const sql = `UPDATE users SET photo = ? WHERE id = ?`;
    return db.execute(sql, [photoPath, userId]);
  },

  // Get the wallet balance for a user
  getWalletBalance: (userId) => {
    const sql = `SELECT wallet_balance FROM users WHERE id = ?`;
    return db.execute(sql, [userId]);
  },

  // Add funds to the wallet
  addToWallet: (userId, amount) => {
    const sql = `UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?`;
    return db.execute(sql, [amount, userId]);
  },

  // Deduct funds from the wallet
  deductFromWallet: (userId, amount) => {
    const sql = `
      UPDATE users
      SET wallet_balance = wallet_balance - ?
      WHERE id = ? AND wallet_balance >= ?`; // Prevent overdraft
    return db.execute(sql, [amount, userId, amount]);
  },

  // Set wallet balance (e.g., for direct updates)
  setWalletBalance: (userId, amount) => {
    const sql = `UPDATE users SET wallet_balance = ? WHERE id = ?`;
    return db.execute(sql, [amount, userId]);
  },

  // Approve user (update their status)
  approveUser: (userId) => {
    const sql = `UPDATE users SET status = 'Approved' WHERE id = ?`;
    return db.execute(sql, [userId]);
  },


};

module.exports = User;
