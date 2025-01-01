const db = require("../db/connection");

const Categories = {
  // Create a new category
  create: ({ name, description, is_vip_only }) => {
    const sql = `
      INSERT INTO categories (name, description, is_vip_only)
      VALUES (?, ?, ?)
    `;
    return db.execute(sql, [name, description, is_vip_only]);
  },

  // Get all categories
  getAll: () => {
    const sql = `
      SELECT id, name, description, is_vip_only, created_at
      FROM categories
      ORDER BY created_at ASC
    `;
    return db.execute(sql);
  },

  // Find a category by ID
  findById: (id) => {
    const sql = `SELECT * FROM categories WHERE id = ?`;
    return db.execute(sql, [id]);
  },

  // Update a category
  update: (id, { name, description, is_vip_only }) => {
    const sql = `
      UPDATE categories
      SET name = ?, description = ?, is_vip_only = ?
      WHERE id = ?
    `;
    return db.execute(sql, [name, description, is_vip_only, id]);
  },

  // Delete a category
  delete: (id) => {
    const sql = `DELETE FROM categories WHERE id = ?`;
    return db.execute(sql, [id]);
  },
};

module.exports = Categories;
