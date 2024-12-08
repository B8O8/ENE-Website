const User = require("../models/Users");
const authService = require("../services/authService");
const affiliateService = require("../services/affliateService");
const db = require("../db/connection");
const crypto = require("crypto");
const emailHelpers = require("../utils/emailHelper");
const Commissions = require("../models/Commissions");
const Subscription = require("../models/Subscriptions");
const { console } = require("inspector");

const calculateTeamACommissions = async (userId, subscriptionPrice, level) => {
  if (level > 20) return; // Stop at Level 20

  // Get the user by ID
  const [user] = await User.findById(userId);
  if (!user.length || !user[0].referred_by) return; // No more referrals in the hierarchy

  const referrerId = user[0].referred_by;

  // Check if the referrer is Ambassador
  const [referrer] = await User.findById(referrerId);
  if (referrer.length && referrer[0].rank === "Ambassador") {
    // Correctly calculate 10% commission
    const teamACommission = Math.round(subscriptionPrice * 10) / 100;

    // Add commission for the Ambassador user
    await Commissions.addCommission(
      referrerId,
      teamACommission,
      `Level ${level}`,
      level
    );
  }

  // Recurse for the next level
  await calculateTeamACommissions(referrerId, subscriptionPrice, level + 1);
};

const userController = {
  // User Registration
  register: async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        phone,
        date_of_birth,
        address,
        profession,
        subscription_id,
        ref,
      } = req.body;

      console.log("User registration details:", req.body);

      // Check if the email already exists
      const [existingUser] = await User.findByEmail(email);
      if (existingUser.length > 0) {
        return res.status(400).json({ error: "Email already in use" });
      }

      // Hash the password
      const hashedPassword = await authService.hashPassword(password);

      // Generate affiliate link for the new user
      const affiliate_link = await affiliateService.generateAffiliateLink(email);

      // Get the referring user's ID from the referral link
      let referringUserId = null;
      
      if (ref) {
        referringUserId = await affiliateService.getReferringUserId(ref, db);
      }

      // Create the new user
      const [result] = await User.create({
        name,
        email,
        password: hashedPassword,
        phone,
        date_of_birth,
        address,
        profession,
        referred_by: referringUserId,
        subscription_id,
        affiliate_link,
      });

      // Track the affiliate levels
      if (referringUserId) {
        await affiliateService.trackReferral(
          result.insertId,
          referringUserId,
          db
        );
      }

      res.status(201).json({
        message: "User registered successfully",
        userId: result.insertId,
      });
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).json({ error: "Failed to register user" });
    }
  },

  // Update User Details
  updateUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const { name, phone, date_of_birth, address, profession } = req.body;

      const [result] = await User.updateUser(userId, {
        name,
        phone,
        date_of_birth,
        address,
        profession,
      });

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  },

  adminUpdateUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const {
        name,
        email,
        phone,
        date_of_birth,
        address,
        profession,
        rank,
        subscription_id,
        status,
      } = req.body;

      // Ensure the email is not duplicated for other users
      if (email) {
        const [existingUser] = await User.findByEmail(email);
        if (
          existingUser.length > 0 &&
          existingUser[0].id !== parseInt(userId)
        ) {
          return res
            .status(400)
            .json({ error: "Email already in use by another user" });
        }
      }

      // Update user details
      const [result] = await User.updateUserAdmin(userId, {
        name,
        email,
        phone,
        date_of_birth,
        address,
        profession,
        rank,
        subscription_id,
        status,
      });

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ message: "User profile updated successfully" });
    } catch (error) {
      console.error("Error updating user profile by admin:", error);
      res.status(500).json({ error: "Failed to update user profile" });
    }
  },

  // User Login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find the user by email
      const [rows] = await User.findByEmail(email);
      if (rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const user = rows[0];

      // Check user status
      if (user.status == "Pending") {
        return res.status(403).json({ error: "Waiting for admin approval" });
      }

      
      if (user.status == "Rejected") {
        return res.status(403).json({ error: "You are not allowed to log in to the website. Please contact your referral." });
      }

      // Compare passwords
      const isPasswordValid = await authService.comparePassword(
        password,
        user.password
      );
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid password" });
      }

      // Generate a JWT
      const token = authService.generateToken(user);

      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Failed to login" });
    }
  },

  // Admin Approval
  approveUser: async function (req, res) {
    try {
      const { userId } = req.body;

      // Approve the user
      const [result] = await User.approveUser(userId);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      // Get the referred_by user and subscription details
      const [user] = await User.findById(userId);
      if (user[0].referred_by) {
        const referringUserId = user[0].referred_by;
        const [subscription] = await Subscription.findById(
          user[0].subscription_id
        );

        // Calculate 25% commission for Level 1
        const level1Commission = (subscription[0].price * 25) / 100;

        // Add Level 1 commission
        await Commissions.addCommission(
          referringUserId,
          level1Commission,
          "Level 1",
          1
        );

        // Validate and calculate commissions for Ambassador users up to Level 20
        await calculateTeamACommissions(
          referringUserId,
          subscription[0].price,
          2
        );
      }

      res.status(200).json({ message: "User approved successfully" });
    } catch (error) {
      console.error("Error approving user:", error);
      res.status(500).json({ error: "Failed to approve user" });
    }
  },

  // Get All Users
  getAllUsers: async (req, res) => {
    try {
      const [users] = await User.getAll();
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  },

  // Get User Details
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      console.log("User ID from request:", id);

      const [rows] = await User.findById(id);
      if (rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch user details" });
    }
  },

  // Generate Password Reset Token
  generateResetToken: async (req, res) => {
    try {
      const { email } = req.body;

      // Check if the user exists
      const [rows] = await User.findByEmail(email);
      if (rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const user = rows[0];

      // Generate a secure reset token and expiry time

      const resetToken = crypto.randomBytes(32).toString("hex");

      const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

      // Save the reset token and expiry in the database

      await User.saveResetToken(user.id, resetToken, resetExpires);

      // Create the reset link
      const resetLink = `https://ene.ac/reset-password?token=${resetToken}`;

      // Send the reset email

      await emailHelpers.sendResetEmail(email, resetLink);

      res
        .status(200)
        .json({ message: "Password reset email sent successfully" });
    } catch (error) {
      console.error("Error generating reset token:", error);
      res.status(500).json({ error: "Failed to generate reset token" });
    }
  },

  // Reset Password
  resetPassword: async (req, res) => {
    try {
      const { token, newPassword } = req.body;

      // Validate the reset token
      const [rows] = await User.findByResetToken(token);
      if (rows.length === 0 || new Date(rows[0].reset_expires) < new Date()) {
        return res
          .status(400)
          .json({ error: "Invalid or expired reset token" });
      }

      const user = rows[0];

      // Hash the new password
      const hashedPassword = await authService.hashPassword(newPassword);

      // Update the user's password and clear the reset token
      await User.updatePassword(user.id, hashedPassword);

      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ error: "Failed to reset password"});
    }
  },

  uploadPhoto: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const photoPath = `/uploads/${req.file.filename}`; // Relative path to the uploaded file

      // Update user's photo in the database
      const userId = req.user.id; // Assuming user ID is available from the token
      const [result] = await User.updatePhoto(userId, photoPath);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res
        .status(200)
        .json({ message: "Photo uploaded successfully", photo: photoPath });
    } catch (error) {
      console.error("Error uploading photo:", error);
      res.status(500).json({ error: "Failed to upload photo" });
    }
  },

  // Get User's Wallet Balance
  getWalletBalance: async (req, res) => {
    try {
      const userId = req.user.id;
      const [rows] = await User.getWalletBalance(userId);

      if (rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ wallet_balance: rows[0].wallet_balance });
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      res.status(500).json({ error: "Failed to fetch wallet balance" });
    }
  },

  //Get Pending Commissions
  getPendingCommissions: async (req, res) => {
    try {
      const userId = req.user.id;
      const [commissions] = await Commissions.getPendingCommissions(userId);

      res.status(200).json(commissions);
    } catch (error) {
      console.error("Error fetching pending commissions:", error);
      res.status(500).json({ error: "Failed to fetch pending commissions" });
    }
  },

  // Get Referral Tree
  getReferralTree: async (req, res) => {
  

    try {
        if (!req.user || !req.user.id) {
            
            return res.status(400).json({ error: "Invalid user data in request." });
        }

        const userId = req.user.id;
        const maxLevels = req.user.rank === "Ambassador" ? 20 : 5;
        

        const referralTree = [];

        for (let level = 1; level <= maxLevels; level++) {
           

            const sql = `
                SELECT al.referred_id AS user_id, u.name AS username
                FROM affiliate_levels al
                JOIN users u ON al.referred_id = u.id
                WHERE al.level = ?
                AND al.user_id = ?
            `;
            const params = [level, userId];
           
            let referrals;
            try {
                const [results] = await db.execute(sql, params);
                referrals = results;
                
            } catch (error) {
               
                throw error;
            }

            if (referrals.length === 0) {
                
                break;
            }

            referralTree.push({
                level,
                referrals,
            });

        }

        
        res.status(200).json(referralTree);

    } catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch referral tree" });
    }
},




  
  
  
  
  

  // Get Notifications
  getNotifications: async (req, res) => {
    try {
      const userId = req.user.id;

      const [approvals] = await db.execute(
        `
        SELECT status
        FROM users
        WHERE id = ? AND status = 'Pending'
      `,
        [userId]
      );

      const [walletRequests] = await WalletRequests.getPendingRequestsForUser(
        userId
      );
      const [transferredCommissions] = await db.execute(
        `
        SELECT amount, earned_at
        FROM commissions
        WHERE user_id = ? AND status = 'transferred'
        ORDER BY earned_at DESC
        LIMIT 5
      `,
        [userId]
      );

      res.status(200).json({
        approvals: approvals.length > 0 ? "Pending admin approval" : null,
        wallet_requests: walletRequests,
        transferred_commissions: transferredCommissions,
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  },

  // Get User info by its referral link
  getReferrerDetails: async (req, res) => {
    try {
      const { ref } = req.query;
  
      if (!ref) {
        return res.status(400).json({ error: "Referral code is required." });
      }
  
      // Query the database to find the referrer
      const [referrer] = await db.query(
        "SELECT name, photo, rank FROM users WHERE affiliate_link LIKE ?",
        [`%${ref}%`]
      );
  
      if (referrer.length === 0) {
        return res.status(404).json({ error: "Referrer not found." });
      }
  
      // Return the referrer's details
      const { name, photo, rank } = referrer[0];
      const photoUrl = photo ? `${req.protocol}://${req.get("host")}${photo}` : null; // Build full URL for the photo
  
      res.status(200).json({
        name,
        photoUrl,
        rank,
      });
    } catch (error) {
      console.error("Error fetching referrer details:", error);
      res.status(500).json({ error: "Failed to fetch referrer details." });
    }
  },

  // reject User
  rejectUser: async (req, res) => {
    try {
      const { userId } = req.body;

      // Reject the user
      const [result] = await User.reject(userId);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ message: "User rejected successfully" });
    } catch (error) {
      console.error("Error rejecting user:", error);
      res.status(500).json({ error: "Failed to reject user" });
    }
  },
  
  
};

module.exports = userController;
