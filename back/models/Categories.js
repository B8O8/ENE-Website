const db = require("../db/connection");

const Categories = {
  // Create a new category
  create: ({ name, description }) => {
    const sql = `
      INSERT INTO categories (name, description)
      VALUES (?, ?)
    `;
    return db.execute(sql, [name, description]);
  },

  // Get all categories
  getAll: () => {
    const sql = `SELECT * FROM categories ORDER BY created_at DESC`;
    return db.execute(sql);
  },

  // Find a category by ID
  findById: (id) => {
    const sql = `SELECT * FROM categories WHERE id = ?`;
    return db.execute(sql, [id]);
  },

  // Update a category
  update: (id, { name, description }) => {
    const sql = `
      UPDATE categories
      SET name = ?, description = ?
      WHERE id = ?
    `;
    return db.execute(sql, [name, description, id]);
  },

  // Delete a category
  delete: (id) => {
    const sql = `DELETE FROM categories WHERE id = ?`;
    return db.execute(sql, [id]);
  },
};

module.exports = Categories;