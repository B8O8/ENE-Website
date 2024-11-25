const Categories = require("../models/Categories");

const categoryController = {
  createCategory: async (req, res) => {
    try {
      const { name, description } = req.body;
      const [result] = await Categories.create({ name, description });

      res.status(201).json({ message: "Category created successfully", categoryId: result.insertId });
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ error: "Failed to create category" });
    }
  },

  getCategories: async (req, res) => {
    try {
      const [categories] = await Categories.getAll();
      res.status(200).json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  },

  updateCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const [result] = await Categories.update(id, { name, description });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Category not found" });
      }

      res.status(200).json({ message: "Category updated successfully" });
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ error: "Failed to update category" });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;

      const [result] = await Categories.delete(id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Category not found" });
      }

      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ error: "Failed to delete category" });
    }
  },
};

module.exports = categoryController;
