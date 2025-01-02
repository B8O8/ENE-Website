const Library = require("../models/Library");
const fs = require("fs");
const path = require("path");

const libraryController = {
  // Create a new library entry
  createLibraryEntry: async (req, res) => {
    try {
      const { title, description } = req.body;
      const file_url = `/uploads/library/${req.file?.filename}`;

      if (!title || !file_url) {
        return res.status(400).json({ error: "Title and file are required" });
      }

      await Library.create({ title, description, file_url });
      res.status(201).json({ message: "Library entry created successfully" });
    } catch (error) {
      console.error("Error creating library entry:", error);
      res.status(500).json({ error: "Failed to create library entry" });
    }
  },

  // Get all library entries (used by admin and users)
  getAllLibraryEntries: async (req, res) => {
    try {
      const [libraryEntries] = await Library.getAll();
      res.status(200).json(libraryEntries);
    } catch (error) {
      console.error("Error fetching library entries:", error);
      res.status(500).json({ error: "Failed to fetch library entries" });
    }
  },

  // Update a library entry
  updateLibraryEntry: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description } = req.body;
      const file_url = req.file ? `/uploads/library/${req.file.filename}` : undefined;

      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      const updateData = { title, description };
      if (file_url) {
        updateData.file_url = file_url;
      }

      const [result] = await Library.update(id, updateData);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Library entry not found" });
      }

      res.status(200).json({ message: "Library entry updated successfully" });
    } catch (error) {
      console.error("Error updating library entry:", error);
      res.status(500).json({ error: "Failed to update library entry" });
    }
  },

 
  
  // Delete a library entry (admin only)
  deleteLibraryEntry: async (req, res) => {
    try {
      const { id } = req.params;

      // Fetch file details to delete from storage
      const [entry] = await Library.findById(id);
      if (entry.length === 0) {
        return res.status(404).json({ error: "Library entry not found" });
      }

      // Delete the file from storage
      const filePath = path.join(__dirname, "..", entry[0].file_url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Delete the database entry
      const [result] = await Library.delete(id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Library entry not found" });
      }

      res.status(200).json({ message: "Library entry deleted successfully" });
    } catch (error) {
      console.error("Error deleting library entry:", error);
      res.status(500).json({ error: "Failed to delete library entry" });
    }
  },

};

module.exports = libraryController;
