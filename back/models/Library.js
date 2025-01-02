const db = require("../db/connection");

const Library = {
  // Add a new library entry
  create: ({ title, description, file_url }) => {
    const sql = `
      INSERT INTO library (title, description, file_url)
      VALUES (?, ?, ?)
    `;
    return db.execute(sql, [title, description, file_url]);
  },

  // Get all library entries (accessible to VIP users only)
  getAll: () => {
    const sql = `
      SELECT id, title, description, file_url, created_at
      FROM library
      ORDER BY created_at DESC
    `;
    return db.execute(sql);
  },

  // Get a library entry by ID
  findById: (id) => {
    const sql = `
      SELECT id, title, description, file_url, created_at
      FROM library
      WHERE id = ?
    `;
    return db.execute(sql, [id]);
  },

  // Update a library entry
  update: (id, { title, description, file_url = null }) => {
    const sql = `
      UPDATE library
      SET title = ?, description = ? ${file_url ? ", file_url = ?" : ""}
      WHERE id = ?
    `;
    const params = file_url ? [title, description, file_url, id] : [title, description, id];
    return db.execute(sql, params);
  },
  

  // Delete a library entry
  delete: (id) => {
    const sql = `
      DELETE FROM library
      WHERE id = ?
    `;
    return db.execute(sql, [id]);
  },
};

module.exports = Library;
