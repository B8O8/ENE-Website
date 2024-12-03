const crypto = require("crypto");
const db = require("../db/connection");


const affiliateService = {
  // Generate a unique affiliate link
  generateAffiliateLink: async (userEmail) => {
    // Function to generate a random 6-digit number
    const generateRandomId = () => Math.floor(100000 + Math.random() * 900000);
  
    let uniqueId = generateRandomId();
    let isUnique = false;
    let attempts = 0;
  
    // Ensure the ID is unique by checking the database
    while (!isUnique) {
      if (attempts > 100) throw new Error("Failed to generate a unique ID after 100 attempts");
      attempts++;
  
      // Query to check for an existing affiliate link
      const [rows] = await db.query(
        "SELECT 1 FROM users WHERE affiliate_link LIKE ?",
        [`%ref=${uniqueId}`]
      );
  
      
  
      // Ensure the result is interpreted correctly
      if (rows.length === 0) {
        isUnique = true;
      } else {
        uniqueId = generateRandomId();
        
      }
    }
  
    const affiliateLink = `https://ene.ac/register?ref=${uniqueId}`;
    return affiliateLink;
  },
  

  // Parse the referral link to get the referring user's ID
  getReferringUserId: async (ref, db) => {
    // SQL to select the user who referred by the given referral code
    const sql = "SELECT id FROM users WHERE affiliate_link LIKE ?";
    
    // Use the referral code to match against the affiliate_link
    const [rows] = await db.execute(sql, [`%ref=${ref}`]);
  
    // Return the user's ID if found, otherwise return null
    return rows.length > 0 ? rows[0].id : null;
  },
  
  // Track referrals and assign levels
  trackReferral: async (newUserId, referringUserId, db) => {
    let currentReferrer = referringUserId; // Start with the direct referrer
  
    for (let level = 1; level <= 5; level++) {
      if (!currentReferrer) break; // Stop if there is no referrer
  
      // Save the referral relationship
      const insertSql = `
        INSERT INTO affiliate_levels (user_id, referred_id, level)
        VALUES (?, ?, ?)
      `;
      await db.execute(insertSql, [currentReferrer, newUserId, level]);
  
      // Move up the hierarchy
      const sql = "SELECT referred_by FROM users WHERE id = ?";
      const [rows] = await db.execute(sql, [currentReferrer]);
  
      if (!rows.length || !rows[0].referred_by) break; // Stop if there's no further referrer
      currentReferrer = rows[0].referred_by;
    }
  },
};

module.exports = affiliateService;
