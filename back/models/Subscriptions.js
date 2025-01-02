const db = require("../db/connection");

const Subscription = {
  // Create a new subscription
  create: (data) => {
    const sql = `
      INSERT INTO subscriptions (name, description, price, duration, is_vip, is_hide)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    return db.execute(sql, [
      data.name,
      data.description,
      data.price,
      data.duration,
      data.is_vip || 0,
      data.is_hide || 0,
    ]);
  },

  // Get all subscriptions that are not hidden
  getAll: () => {
    const sql = `SELECT * FROM subscriptions WHERE is_hide = 0`;
    return db.execute(sql);
  },

  // Get a subscription by ID
  findById: (id) => {
    const sql = `SELECT * FROM subscriptions WHERE id = ?`;
    return db.execute(sql, [id]);
  },

  // Update a subscription
  update: (id, data) => {
    const sql = `
      UPDATE subscriptions
      SET name = ?, description = ?, price = ?, duration = ?, is_vip = ?, is_hide = ?
      WHERE id = ?
    `;
    return db.execute(sql, [
      data.name,
      data.description,
      data.price,
      data.duration,
      data.is_vip || 0,
      data.is_hide || 0,
      id,
    ]);
  },

  // Delete a subscription
  delete: (id) => {
    const sql = `DELETE FROM subscriptions WHERE id = ?`;
    return db.execute(sql, [id]);
  },
};

module.exports = Subscription;
