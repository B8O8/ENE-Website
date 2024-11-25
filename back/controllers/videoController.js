const Videos = require("../models/Videos");

const videoController = {
  createVideo: async (req, res) => {
    try {
      const { categoryId } = req.params; // Ensure `categoryId` is from the URL params
      const { title, description, video_order } = req.body; // Extract required fields from body
      
      // Validate that all required fields are present
      if (!categoryId || !title || !video_order) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      if (!req.file) {
        return res.status(400).json({ error: "No video file uploaded" });
      }
  
      const videoUrl = `/uploads/videos/${req.file.filename}`; // Ensure the file is processed correctly
      
      const [result] = await Videos.create({
        category_id: categoryId,
        title,
        description: description || "", // Use empty string if description is optional
        video_url: videoUrl,
        video_order,
      });
  
      res.status(201).json({ message: "Video uploaded successfully", videoId: result.insertId });
    } catch (error) {
      console.error("Error uploading video:", error);
      res.status(500).json({ error: "Failed to upload video" });
    }
  },
  
  getVideosByCategory: async (req, res) => {
    try {
      const { categoryId } = req.params;
      const [videos] = await Videos.getByCategoryId(categoryId);
  
      // Add full URL to each video
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const videosWithUrl = videos.map((video) => ({
        ...video,
        url: `${baseUrl}${video.video_url}` // Construct the full URL
      }));
  
      res.status(200).json(videosWithUrl); // Send videos with URLs
    } catch (error) {
      console.error("Error fetching videos:", error);
      res.status(500).json({ error: "Failed to fetch videos" });
    }
  },
  

  updateVideo: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, video_url, video_order } = req.body;

      const [result] = await Videos.update(id, { title, description, video_url, video_order });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Video not found" });
      }

      res.status(200).json({ message: "Video updated successfully" });
    } catch (error) {
      console.error("Error updating video:", error);
      res.status(500).json({ error: "Failed to update video" });
    }
  },

  deleteVideo: async (req, res) => {
    try {
      const { id } = req.params;

      const [result] = await Videos.delete(id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Video not found" });
      }

      res.status(200).json({ message: "Video deleted successfully" });
    } catch (error) {
      console.error("Error deleting video:", error);
      res.status(500).json({ error: "Failed to delete video" });
    }
  },
};

module.exports = videoController;
