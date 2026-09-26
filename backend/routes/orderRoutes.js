// routes/orderRoutes.js
const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getOrderById,
  payOrder,
  cancelOrder,
} = require("../controllers/orderController");

const { protect } = require("../middleware/auth");

// Create new order
router.post("/", protect, createOrder);

// Get logged-in user's orders
router.get("/myorders", protect, getMyOrders);

// Get single order by ID
router.get("/:id", protect, getOrderById);

// Mark order as paid
router.put("/:id/pay", protect, payOrder);

// Cancel order
router.put("/:id/cancel", protect, cancelOrder);

module.exports = router;