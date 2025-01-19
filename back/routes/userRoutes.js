const express = require("express");
const userController = require("../controllers/userController");
const subscriptionController = require("../controllers/subscriptionController");
const authMiddleware = require("../middleware/authMiddleware");
const uploadMiddleware = require("../middleware/uploadMiddleware");
const walletController = require("../controllers/walletController");
const walletRequestController = require("../controllers/walletRequestController");
const categoryController = require("../controllers/categoryController");
const videoController = require("../controllers/videoController");
const uploadVideo = require("../middleware/uploadVideoMiddleware");

const router = express.Router();


// Public Routes
router.post("/register", userController.register);
router.post("/login", userController.login);

// Update user details
router.put("/:id", authMiddleware.authenticate, userController.updateUser);

//user upload photo
router.post("/upload-photo", authMiddleware.authenticate, uploadMiddleware.single("photo"), userController.uploadPhoto);

// Endpoint to fetch referrer details
router.get("/referrer-details", userController.getReferrerDetails);


// User Dashboard Routes
router.get("/dashboard/wallet", authMiddleware.authenticate, userController.getWalletBalance);
router.get("/dashboard/commissions", authMiddleware.authenticate, userController.getPendingCommissions);
router.get("/dashboard/referrals", authMiddleware.authenticate, userController.getReferralTree);
router.get("/dashboard/notifications", authMiddleware.authenticate, userController.getNotifications);


// Password Reset Routes
router.post("/forgot-password", userController.generateResetToken);
router.post("/reset-password", userController.resetPassword);

// Admin-Only Routes
router.post("/approve", authMiddleware.authenticate, authMiddleware.authorizeAdmin, userController.approveUser);
router.post("/reject", authMiddleware.authenticate, authMiddleware.authorizeAdmin, userController.rejectUser);
router.get("/", authMiddleware.authenticate, authMiddleware.authorizeAdmin, userController.getAllUsers);
router.put("/admin/:id", authMiddleware.authenticate, authMiddleware.authorizeAdmin, userController.adminUpdateUser);

// Admin Actions
router.get("/admin/wallet-requests", authMiddleware.authenticate, authMiddleware.authorizeAdmin, walletRequestController.getPendingRequests);
router.post("/admin/wallet-requests/:requestId/approve", authMiddleware.authenticate, authMiddleware.authorizeAdmin, walletRequestController.approveRequest);
router.post("/admin/wallet-requests/:requestId/reject", authMiddleware.authenticate, authMiddleware.authorizeAdmin, walletRequestController.rejectRequest);
router.get(
  "/admin/wallet/activity",
  authMiddleware.authenticate,
  authMiddleware.authorizeAdmin,
  walletRequestController.getAllLogs
);
router.get(
  "/admin/wallet/totals",
  authMiddleware.authenticate,
  authMiddleware.authorizeAdmin,
  walletController.getWalletTotals
);

// Subscription Management (Admin Only)
router.get("/subscriptions", subscriptionController.getAllSubscriptions);
router.get("/subscriptionsAdmin", authMiddleware.authenticate, authMiddleware.authorizeAdmin, subscriptionController.getAllSubscriptionAdmin);
router.get("/subscriptions/:id", subscriptionController.getSubscriptionById);
router.post("/subscriptions", authMiddleware.authenticate, authMiddleware.authorizeAdmin, subscriptionController.createSubscription);
router.put("/subscriptions/:id", authMiddleware.authenticate, authMiddleware.authorizeAdmin, subscriptionController.updateSubscription);
router.delete("/subscriptions/:id", authMiddleware.authenticate, authMiddleware.authorizeAdmin, subscriptionController.deleteSubscription);

// Wallet Routes
// User Wallet Requests
router.post("/wallet/request", authMiddleware.authenticate, walletRequestController.requestWalletAction);
router.get("/wallet", authMiddleware.authenticate, walletController.getWalletBalance);
router.post("/wallet/deduct", authMiddleware.authenticate, walletController.deductFromWallet);
router.post("/wallet/withdraw", authMiddleware.authenticate, walletController.withdrawFromWallet);
// Fetch wallet activity logs for the logged-in user
router.get(
  "/wallet/logs",
  authMiddleware.authenticate,
  walletController.getUserWalletLogs
);
router.post("/wallet/otp", authMiddleware.authenticate, walletRequestController.generateWalletOTP);
router.post("/wallet/otp/validate", authMiddleware.authenticate, walletRequestController.validateWalletOTP);



// Category routes
router.post("/categories", authMiddleware.authenticate, authMiddleware.authorizeAdmin, categoryController.createCategory);
router.get("/categories", authMiddleware.authenticate, categoryController.getCategories);
router.put("/categories/:id", authMiddleware.authenticate, authMiddleware.authorizeAdmin, categoryController.updateCategory);
router.delete("/categories/:id", authMiddleware.authenticate, authMiddleware.authorizeAdmin, categoryController.deleteCategory);


// Video routes
router.post(
    "/categories/:categoryId/videos",
    authMiddleware.authenticate,
    authMiddleware.authorizeAdmin,
    uploadVideo.single("video"), // Expect a "video" file in the request
    videoController.createVideo
  );

router.get("/categories/:categoryId/videos", videoController.getVideosByCategory);
router.put(
    "/categories/:categoryId/videos/:videoId",
    authMiddleware.authenticate,
    authMiddleware.authorizeAdmin,
    uploadVideo.single("video"), // Expect a "video" file in the request
    videoController.updateVideo
  );

router.delete(
    "/categories/:categoryId/videos/:videoId",
    authMiddleware.authenticate,
    authMiddleware.authorizeAdmin,
    videoController.deleteVideo
  );

router.get("/me", authMiddleware.authenticate, userController.getUserById);
// Protected Routes
router.get("/:id", authMiddleware.authenticate, userController.getUserById);

module.exports = router;
