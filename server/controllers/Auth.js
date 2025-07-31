const OTP = require("../models/OTP");
const User = require("../models/User");
const otpGenerator = require("otp-generator");

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    // console.log(email)
    // Check if user is already present
    const checkUserPresent = await User.findOne({ email });
    // If user found with provided email
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User is already registered",
      });
    }
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    let result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
      result = await OTP.findOne({ otp: otp });
    }
    const otpBody = await OTP.create({ email: email, otp: otp });
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otpBody,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
