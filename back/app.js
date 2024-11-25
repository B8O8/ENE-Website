const express = require('express');
const dotenv = require('dotenv');
const db = require('./db/connection');
const cors = require('cors');
const path = require("path");
const fs = require("fs"); // File system module
require("./cron/transferCommission");


const userRoutes = require("./routes/userRoutes");

// Ensure necessary directories exist
const ensureDirectories = () => {
  const directories = [
    path.join(__dirname, "uploads"),          // Root uploads folder
    path.join(__dirname, "uploads/photos"),  // Profile photos
    path.join(__dirname, "uploads/videos"),  // Video uploads
  ];

  directories.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};

// Validate and create directories
ensureDirectories();


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());



// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// User Routes
app.use("/users", userRoutes);



// Test DB connection
const testDbConnection = async () => {
    try {
      await db.query('SELECT 1');
      console.log('Connected to the MySQL database.');
    } catch (err) {
      console.error('Unable to connect to the database:', err);
    }
  };
  
  testDbConnection();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
