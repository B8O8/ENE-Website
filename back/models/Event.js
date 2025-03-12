const db = require("../db/connection");

const Event = {
  create: ({ first_name, last_name, email, phone, country_of_residence, event_number, event_name }) => {
    const sql = `
          INSERT INTO events (first_name, last_name, email, phone, country_of_residence, event_number, event_name)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
    return db.execute(sql, [
      first_name,
      last_name,
      email,
      phone,
      country_of_residence,
      event_number,
      event_name,
    ]);
  },

  getAll: () => {
    const sql = `SELECT * FROM events ORDER BY created_at DESC`;
    return db.execute(sql);
  },

  getByEventNumber: (event_number) => {
    const sql = `SELECT * FROM events WHERE event_number = ? ORDER BY created_at DESC`;
    return db.execute(sql, [event_number]);
  },

  findById: (id) => {
    const sql = `SELECT * FROM events WHERE id = ?`;
    return db.execute(sql, [id]);
  },

  findByEmailAndEvent: (email, event_number) => {
    const sql = `SELECT * FROM events WHERE email = ? AND event_number = ?`;
    return db.execute(sql, [email, event_number]);
  },

  delete: (id) => {
    const sql = `DELETE FROM events WHERE id = ?`;
    return db.execute(sql, [id]);
  },
};

module.exports = Event;