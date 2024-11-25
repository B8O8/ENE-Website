const crypto = require("crypto");

const affiliateService = {
  // Generate a unique affiliate link
  generateAffiliateLink: (userEmail) => {
    const uniqueId = crypto.createHash("md5").update(userEmail).digest("hex");
    return `https://ene.ac/register?ref=${uniqueId}`;
  },

  // Parse the referral link to get the referring user's ID
  getReferringUserId: async (ref, db) => {
    const sql = "SELECT id FROM users WHERE MD5(email) = ?";
    const [rows] = await db.execute(sql, [ref]);
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
