const db = require("../db/connection");

const Event = {
  create: ({ first_name, last_name, email, phone, country_of_residence }) => {
    const sql = `
          INSERT INTO events (first_name, last_name, email, phone, country_of_residence)
          VALUES (?, ?, ?, ?, ?)
        `;
    return db.execute(sql, [
      first_name,
      last_name,
      email,
      phone,
      country_of_residence,
    ]);
  },

  getAll: () => {
    const sql = `SELECT * FROM events ORDER BY created_at DESC`;
    return db.execute(sql);
  },

  findById: (id) => {
    const sql = `SELECT * FROM events WHERE id = ?`;
    return db.execute(sql, [id]);
  },

  findByEmail: (email) => {
    const sql = `SELECT * FROM events WHERE email = ?`;
    return db.execute(sql, [email]);
  },

  delete: (id) => {
    const sql = `DELETE FROM events WHERE id = ?`;
    return db.execute(sql, [id]);
  },
};

module.exports = Event;
