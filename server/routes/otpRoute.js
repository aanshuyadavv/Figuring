const express = require("express");
const { sendOTP } = require("../controllers/Auth");

const router = express.Router();

router.post("/send-otp", sendOTP);
// router.post("/verify-otp", verifyOtp);

module.exports = router;
