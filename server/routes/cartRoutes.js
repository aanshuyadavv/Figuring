const express = require("express");
const {
  addToCart,
  removeFromCart,
  fetchCart,
  clearCart,
} = require("../controllers/CartController");
const { auth, isStudent } = require("../middlewares/Auth");
const router = express.Router();

router.post("/cart/add", auth, isStudent, addToCart);
router.delete("/cart/remove", auth, isStudent, removeFromCart);
router.get("/fetch/cart", auth, isStudent, fetchCart);
router.delete("/cart/clear", auth, isStudent, clearCart);

module.exports = router;
