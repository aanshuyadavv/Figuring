const Razorpay = require("razorpay");
require("dotenv").config();

exports.razorpayInstance = new Razorpay({
  // Replace with your key_id
  key_id: process.env.RAZORPAY_KEY_ID,

  // Replace with your key_secret
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
