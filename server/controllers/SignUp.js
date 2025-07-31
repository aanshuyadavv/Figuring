const OTP = require("../models/OTP");
const User = require("../models/User");
const Profile = require("../models/Profile");
const bcrypt = require("bcrypt");

exports.signUp = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      otp,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Restrict multiple instructors
    if (accountType === "instructor") {
      const existingInstructor = await User.findOne({
        accountType: "instructor",
      });
      if (existingInstructor) {
        return res.status(400).json({
          success: false,
          message: "Only one instructor is allowed on the platform.",
        });
      }
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirmPassword do not match",
      });
    }

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists. Please login.",
      });
    }

    const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });
    if (!recentOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    } else if (otp !== recentOtp.otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create empty profile
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      contactNumber: null,
      about: null,
      image: null,
    });

    // Create avatar URL
    const avatarUrl = `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${firstName}+${lastName}`;

    // Create user in DB
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
      additonalDetails: profileDetails._id,
      image: avatarUrl,
    });

    // Return success
    return res.status(200).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.log("Signup error", error);
    return res.status(500).json({
      success: false,
      message: "Unable to register user",
    });
  }
};
