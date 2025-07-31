const mongoose = require("mongoose");
const { mailSender } = require("../utils/mailSender");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // 5 min,
  },
});

async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email",
      `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #333;">Verify Your Email</h2>
          <p>Hello,</p>
          <p>Thank you for registering. Please use the OTP below to verify your email address:</p>
          <div style="font-size: 1.5rem; font-weight: bold; color: #222; margin: 10px 0;">
            ${otp}
          </div>
          <p>This OTP is valid for the next 10 minutes. Please do not share it with anyone.</p>
          <p style="color: #555;">– Team LearnCode</p>
        </div>
      `
    );
    console.log("Email sent successfully:", mailResponse);
  } catch (error) {
    console.error("Error while sending verification email:", error);
    throw error;
  }
}

otpSchema.pre("save", async function (next) {
  console.log("new OTP document is being saved to the database.");
  if (this.isNew) {
    try {
      await sendVerificationEmail(this.email, this.otp);
    } catch (error) {
      console.error("Failed to send OTP email. Aborting save.");
      return next(error);
    }
  }

  next();
});
module.exports = mongoose.model("OTP", otpSchema);
