const db = require("../db/connection");

const Videos = {
  // Create a new video
  create: ({ category_id, title, description, video_url, video_order }) => {
    const sql = `
      INSERT INTO videos (category_id, title, description, video_url, video_order)
      VALUES (?, ?, ?, ?, ?)
    `;
    return db.execute(sql, [category_id, title, description, video_url, video_order]);
  },

  // Get all videos in a category
  getByCategoryId: (categoryId) => {
    const sql = `
      SELECT * FROM videos
      WHERE category_id = ?
      ORDER BY video_order ASC
    `;
    return db.execute(sql, [categoryId]);
  },

  // Find a video by ID
  findById: (id) => {
    const sql = `SELECT * FROM videos WHERE id = ?`;
    return db.execute(sql, [id]);
  },

  // Update a video
  update: (id, { title, description, video_url, video_order }) => {
    const sql = `
      UPDATE videos
      SET title = ?, description = ?, video_url = ?, video_order = ?
      WHERE id = ?
    `;
    return db.execute(sql, [title, description, video_url, video_order, id]);
  },

  // Delete a video
  delete: (id) => {
    const sql = `DELETE FROM videos WHERE id = ?`;
    return db.execute(sql, [id]);
  },
};

module.exports = Videos;
