// routes/categoryRoutes.js
const router = require("express").Router();
const { getCategories, createCategory } = require("../controllers/categoryController");
const { protect, admin } = require("../middleware/auth");

// Public
router.get("/", getCategories);

// Admin only
router.post("/", protect, admin, createCategory);

module.exports = router;