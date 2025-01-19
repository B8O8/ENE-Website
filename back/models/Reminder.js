const db = require("../db/connection");

const Reminder = {
  create: ({ name, description, reminder_date, email }) => {
    const sql = `
      INSERT INTO reminders (name, description, reminder_date, email)
      VALUES (?, ?, ?, ?)
    `;
    return db.execute(sql, [name, description, reminder_date, email]);
  },

  getAll: () => {
    const sql = `SELECT * FROM reminders ORDER BY reminder_date ASC`;
    return db.execute(sql);
  },

  findById: (id) => {
    const sql = `SELECT * FROM reminders WHERE id = ?`;
    return db.execute(sql, [id]);
  },

  delete: (id) => {
    const sql = `DELETE FROM reminders WHERE id = ?`;
    return db.execute(sql, [id]);
  },
};

module.exports = Reminder;
