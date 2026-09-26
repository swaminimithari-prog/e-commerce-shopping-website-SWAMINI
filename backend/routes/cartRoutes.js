// routes/cartRoutes.js
const router = require("express").Router();

const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

const { protect } = require("../middleware/auth");

// Get logged-in user's cart
router.get("/", protect, getCart);

// Add product to cart
router.post("/", protect, addToCart);

// Update cart item quantity
router.put("/:productId", protect, updateCartItem);

// Remove one item from cart
router.delete("/:productId", protect, removeFromCart);

// Clear full cart
router.delete("/", protect, clearCart);

module.exports = router;