const Cart = require("../models/Cart");
const Course = require("../models/Course");
const User = require("../models/User");
exports.addToCart = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;
    // console.log("userId", userId);
    // console.log("courseId", courseId);

    if (!courseId) {
      return res
        .status(400)
        .json({ success: false, message: "Course ID is required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [],
      });
    }

    const alreadyInCart = cart.items.some(
      (item) => item.courseId.toString() === courseId.toString()
    );
    if (alreadyInCart) {
      return res
        .status(400)
        .json({ success: false, message: "Course already in cart" });
    }

    cart.items.push({ courseId });
    await cart.save();
    await cart.populate("items.courseId");

    return res.status(200).json({
      success: true,
      message: "Course added to cart",
      cart: cart,
    });
  } catch (error) {
    console.error("Error adding course to cart:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    if (!courseId) {
      return res
        .status(400)
        .json({ success: false, message: "Course ID is required" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const courseInCart = cart.items.some(
      (item) => item.courseId.toString() === courseId.toString()
    );
    if (!courseInCart) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found in cart" });
    }

    await Cart.findOneAndUpdate(
      { userId },
      { $pull: { items: { courseId } } },
      { new: true }
    );

    const updatedCart = await Cart.findOne({ userId }).populate(
      "items.courseId"
    );

    return res.status(200).json({
      success: true,
      message: "Course removed from cart",
      updatedCart: updatedCart,
    });
  } catch (error) {
    console.error("Error removing course from cart:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to remove from cart",
    });
  }
};

exports.fetchCart = async (req, res) => {
  try {
    const userId = req.user.id;
    // console.log("userId", userId);

    let cart = await Cart.findOne({ userId }).populate("items.courseId");
    if (!cart) {
      cart = await Cart.create({ userId: userId, items: [] });
    }

    // console.log("cart", cart);

    return res.status(200).json({
      success: true,
      cart: cart,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    await Cart.findOneAndUpdate({ userId: userId }, { $set: { items: [] } });
    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (err) {
    console.error("Error clearing cart:", err);
    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
    });
  }
};
