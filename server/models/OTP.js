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
      "Verify Your Email - Figuring",
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; border: 1px solid #ddd;">
          <h2 style="color: #2c3e50; text-align: center;">Verify Your Email</h2>
          <p style="color: #333;">Hello,</p>
          <p style="color: #333;">Thanks for signing up on <strong>Figuring</strong>. Please use the OTP below to verify your email address:</p>
          <div style="font-size: 1.8rem; font-weight: bold; color: #000; background: #e0e0e0; padding: 10px 20px; border-radius: 8px; text-align: center; letter-spacing: 2px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="color: #333;">This OTP is valid for the next <strong>10 minutes</strong>. Please do not share it with anyone.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
          <p style="color: #888; font-size: 0.9rem;">If you didn't request this email, please ignore it.</p>
          <p style="color: #555; font-weight: 500;">– Team Figuring</p>
        </div>
      `
    );
  } catch (error) {
    console.error("Error while sending verification email:", error);
    throw error;
  }
}

otpSchema.pre("save", async function (next) {
  // console.log("new OTP document is being saved to the database.");
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
