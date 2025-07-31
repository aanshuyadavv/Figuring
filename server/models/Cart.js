const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  items: [
    {
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    },
  ],
});

module.exports = mongoose.model("Cart", cartSchema);
