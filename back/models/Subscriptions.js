const db = require("../db/connection");

const Subscription = {
  // Create a new subscription
  create: (data) => {
    const sql = `
      INSERT INTO subscriptions (name, description, price, duration)
      VALUES (?, ?, ?, ?)
    `;
    return db.execute(sql, [data.name, data.description, data.price, data.duration]);
  },

  // Get all subscriptions
  getAll: () => {
    const sql = `SELECT * FROM subscriptions`;
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
      SET name = ?, description = ?, price = ?, duration = ?
      WHERE id = ?
    `;
    return db.execute(sql, [data.name, data.description, data.price, data.duration, id]);
  },

  // Delete a subscription
  delete: (id) => {
    const sql = `DELETE FROM subscriptions WHERE id = ?`;
    return db.execute(sql, [id]);
  },
};

module.exports = Subscription;
