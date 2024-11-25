const db = require('./connection');

// SQL Statements to create tables
const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(15) DEFAULT NULL,
  date_of_birth DATE DEFAULT NULL,
  address VARCHAR(255) DEFAULT NULL,
  profession VARCHAR(100) DEFAULT NULL,
  password VARCHAR(255) NOT NULL,
  rank ENUM('Standard User', 'Team A', 'Board Member', 'Admin') DEFAULT 'Standard User',
  affiliate_link VARCHAR(255) DEFAULT NULL,
  referred_by INT DEFAULT NULL,
  status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
  subscription_id INT DEFAULT NULL,
  reset_token VARCHAR(255) DEFAULT NULL,
  reset_expires DATETIME DEFAULT NULL,
  photo VARCHAR(255) DEFAULT NULL,
  wallet_balance DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (referred_by) REFERENCES users(id),
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id),

);`;

const createSubscriptionsTable = `
CREATE TABLE IF NOT EXISTS subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  duration INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

const createAffiliateLevelsTable = `
CREATE TABLE IF NOT EXISTS affiliate_levels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  referred_id INT NOT NULL,
  level INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (referred_id) REFERENCES users(id)
);`;


const createCommissionsTable = `
CREATE TABLE commissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL, -- Referring user who earned the commission
  COLUMN transfer_date DATE DEFAULT NULL
  referrer_level INT DEFAULT NULL
  commission_type VARCHAR(20) DEFAULT NULL
  amount DECIMAL(10, 2) NOT NULL, -- Commission amount
  earned_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- When the commission was earned
  status ENUM('pending', 'transferred') DEFAULT 'pending', -- Status of the commission
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  

);`;

const createWalletRequest = `
CREATE TABLE wallet_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  type ENUM('deduct', 'withdraw') NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`;

const createCategoriesTable = `
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const createVideosTable = `
CREATE TABLE videos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  video_url VARCHAR(255) NOT NULL,
  video_order INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);
`;


// Function to execute the SQL queries
const setupDatabase = async () => {
  try {
    await db.execute(createSubscriptionsTable);
    await db.execute(createUsersTable);
    await db.execute(createAffiliateLevelsTable);
    await db.execute(createCommissionsTable);
    await db.execute(createWalletRequest);
    await db.execute(createCategoriesTable);
    await db.execute(createVideosTable);
    console.log("Tables created successfully!");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
};

// Run the setup
setupDatabase();
