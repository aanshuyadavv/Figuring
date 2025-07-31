const User = require("../models/User");
const { mailSender } = require("../utils/mailSender");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
require("dotenv").config();

//reset password token
exports.resetPasswordToken = async (req, res) => {
  try {
    //fetch data
    const { email } = req.body;

    //check user for this email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Your email is not registered",
      });
    }

    //generate token to be send in email body

    const token = crypto.randomUUID();
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // const secret = process.env.JWT + user.password;
    // const token = jwt.sign({ id: user._id, email: user.email }, secret, {
    //   expiresIn: "1h",
    // });

    const resetUrl = `http://localhost:3000/reset-password?token=${hashedToken}`;

    //update user by adding token and expires
    const updatedDetails = await User.findOneAndUpdate(
      { email },
      {
        token: hashedToken,
        resetPasswordExpires: Date.now() + 1 * 60 * 60 * 1000, // 1 hours
      },
      { new: true }
    );

    //send mail containing token
    await mailSender(email, "token to reset password", resetUrl);

    //return response

    return res.status(200).json({
      success: true,
      message:
        "reset password link sent successfully. Check email and reset password",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "something went wrong while sending resetPassword mail",
    });
  }
};

//reset password
exports.resetPassword = async (req, res) => {
  try {
    //fetch data
    const { password, confirmPassword, token } = req.body;
    console.log(password, confirmPassword, token)
    //check if password and confirmPassword is same
    if (password !== confirmPassword) {
      return res.json({
        sucesss: false,
        message: "password not matching",
      });
    }
    //fetch user details
    // const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const userDetails = await User.findOne({ token});
    console.log("userDetails", userDetails)
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Invalid token",
      });
    }
    //token time check
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.json({
        success: false,
        message: "token has been expired",
      });
    }

    //  const secret = process.env.JWT + userDetails.password;
    // const verify = jwt.verify(token, secret);

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //update password
    userDetails.password = hashedPassword;
    userDetails.token = null;
    userDetails.resetPasswordExpires = null;
    await userDetails.save();

    // const updatedUserWithNewPassword = await User.findOneAndUpdate(
    //   { token: token },
    //   { password: hashedPassword, token: null, resetPasswordExpires: null },
    //   { new: true }
    // );

    //return response
    return res.status(200).json({
      success: true,
      message: "password has been updated successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "error while reseting password",
    });
  }
};
