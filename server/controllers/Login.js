const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

exports.login = async (req, res) => {
  try {
    //fetch data
    const { email, password } = req.body;
    //validate
    if (!email || !password) {
      return res.status(403).jsin({
        sucess: false,
        message: "All fields are required",
      });
    }

    //user exist or not
    const user = await User.findOne({ email }).populate("additonalDetails");
    // console.log(user);
    // console.log(process.env.JWT_SECRET)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "user doesn't exist, kindly register first",
      });
    }
    // const userDetails = user.additonalDetails.populate("additionalDetails");
    // console.log(userDetails)

    //generate jwt after comparing password
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      user.token = token;
      user.password = undefined;

      //create cookie and send response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      };
      res
        .cookie("token", token, options)
        .status(200)
        .json({
          success: true,
          message: "logged in successfully",
          token,
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            accountType: user.accountType,
            image: user.image || null,
            additionalDetails: user.additonalDetails || null,
          },
        });
    } else {
      return res.status(401).json({
        success: false,
        message: "incorrect password",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "login failure, try again",
    });
  }
};
