// routes/adminRoutes.js
const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getAllOrders,
  updateOrderStatus,
  getAllProductsAdmin,
  deleteProduct,
} = require("../controllers/adminController");

const { protect, admin } = require("../middleware/auth");

// Dashboard
router.get("/dashboard", protect, admin, getDashboardStats);

// Users
router.get("/users", protect, admin, getAllUsers);
router.delete("/users/:id", protect, admin, deleteUser);

// Orders
router.get("/orders", protect, admin, getAllOrders);
router.put("/orders/:id", protect, admin, updateOrderStatus);

// Products
router.get("/products", protect, admin, getAllProductsAdmin);
router.delete("/products/:id", protect, admin, deleteProduct);

module.exports = router;