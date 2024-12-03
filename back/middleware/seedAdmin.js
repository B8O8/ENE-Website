const db = require("../db/connection");
const bcrypt = require("bcrypt");

const seedAdmin = async () => {
  try {
    // Admin details
    const admin = {
      name: "Admin User",
      email: "admin@ene.ac", // Change this to your preferred email
      password: "password", // Change this to your preferred password
      rank: "Admin",
      status: "Approved",
    };

    // Hash the admin's password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(admin.password, saltRounds);

    // Insert admin into the users table
    const sql = `
      INSERT INTO users (name, email, password, rank, status)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [admin.name, admin.email, hashedPassword, admin.rank, admin.status];

    const [result] = await db.execute(sql, values);

    console.log("Admin user seeded successfully with ID:", result.insertId);
  } catch (error) {
    console.error("Error seeding admin user:", error);
  } finally {
    process.exit(); // Exit the script
  }
};

seedAdmin();
