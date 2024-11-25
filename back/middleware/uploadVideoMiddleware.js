const multer = require("multer");
const path = require("path");

// Configure storage for videos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/videos/"); // Save videos in a specific folder
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName); // Ensure unique filenames
  },
});

// File filter for videos
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["video/mp4", "video/avi", "video/mkv", "video/mov"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only MP4, AVI, MKV, and MOV are allowed."));
  }
};

// Initialize Multer
const uploadVideo = multer({
  storage,
  fileFilter,
  // Remove file size limit if needed or set to a very high value
  // limits: { fileSize: 500 * 1024 * 1024 } // Optional: 500 MB limit
});

module.exports = uploadVideo;
