// routes/userRoutes.js
const express = require("express");
const router = express.Router();

const {
  getUserProfile,
  updateUserProfile,
  deleteMyAccount,
} = require("../controllers/userController");

const { protect } = require("../middleware/auth");

// Get logged-in user profile
router.get("/profile", protect, getUserProfile);

// Update logged-in user profile
router.put("/profile", protect, updateUserProfile);

// Delete logged-in user account
router.delete("/profile", protect, deleteMyAccount);

module.exports = router;