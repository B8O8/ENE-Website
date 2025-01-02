const express = require("express");
const libraryController = require("../controllers/libraryController");
const { upload, handleUploadErrors } = require("../middleware/uploadFileMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// Admin-only routes for managing library entries
router.post(
  "/upload",
  authMiddleware.authenticate,
  authMiddleware.authorizeAdmin,
  upload.single("file"), // Middleware to upload files
  handleUploadErrors, // Handle upload errors
  libraryController.createLibraryEntry
);

router.put(
  "/:id",
  authMiddleware.authenticate,
  authMiddleware.authorizeAdmin,
  upload.single("file"), // Middleware to update the file
  handleUploadErrors, // Handle upload errors
  libraryController.updateLibraryEntry
);

router.delete(
  "/:id",
  authMiddleware.authenticate,
  authMiddleware.authorizeAdmin,
  libraryController.deleteLibraryEntry
);

router.get(
  "/admin",
  authMiddleware.authenticate,
  authMiddleware.authorizeAdmin,
  libraryController.getAllLibraryEntries // Admin fetches all library files
);

// User route to fetch all library entries (VIP users only)
router.get(
  "/user",
  authMiddleware.authenticate,
  libraryController.getAllLibraryEntries
);



module.exports = router;
