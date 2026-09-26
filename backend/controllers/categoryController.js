// controllers/categoryController.js
const Category = require("../models/Category");

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
      try {
            const categories = await Category.find({ isActive: true }).sort({ name: 1 });
            res.status(200).json({
                  success: true,
                  count: categories.length,
                  categories,
            });
      } catch (error) {
            res.status(500).json({
                  success: false,
                  message: "Failed to fetch categories",
                  error: error.message,
            });
      }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
      try {
            const { name, image, description } = req.body;

            if (!name) {
                  return res.status(400).json({
                        success: false,
                        message: "Category name is required",
                  });
            }

            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

            const existing = await Category.findOne({ slug });
            if (existing) {
                  return res.status(400).json({
                        success: false,
                        message: "A category with this name already exists",
                  });
            }

            const category = await Category.create({ name, slug, image, description });

            res.status(201).json({
                  success: true,
                  message: "Category created successfully",
                  category,
            });
      } catch (error) {
            res.status(500).json({
                  success: false,
                  message: "Failed to create category",
                  error: error.message,
            });
      }
};

module.exports = {
      getCategories,
      createCategory,
};