const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const bcrypt = require("bcrypt");
// add profile image
require("dotenv").config();
exports.updateProfileImage = async (req, res) => {
  try {
    //fetch data
    const userId = req.user.id;
    console.log("user id from update profile", userId);
    const { image } = req.files;
    console.log("image", image);
    // console.log(process.env.FOLDER_NAME);
    if (!image) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded",
      });
    }

    const result = await uploadImageToCloudinary(
      image,
      process.env.FOLDER_NAME || "defaultFolder"
    );

    console.log("Cloudinary result", result);

    const updatedProfile = await User.findById(userId)
      .populate("additonalDetails")
      .exec();
    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    updatedProfile.additonalDetails.image = result.secure_url;
    updatedProfile.image = result.secure_url;
    await updatedProfile.save();
    await updatedProfile.additonalDetails.save();
    console.log("updatedProfile", updatedProfile);

    // console.log("Cloudinary upload result:", result);
    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: result.secure_url,
      updatedProfile: updatedProfile,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to update profile image, try again later",
    });
  }
};

//create profile
exports.updateProfile = async (req, res) => {
  try {
    //fetch data

    console.log(req.body);
    // res.send('done')

    const { firstName, lastName, gender, dateOfBirth, about, contactNumber } =
      req.body;

    //fetch id of user
    const id = req.user.id;
    console.log("id", id);

    //validation
    if (
      !firstName ||
      !lastName ||
      !gender ||
      !dateOfBirth ||
      !about ||
      !contactNumber
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findById(id).populate("additonalDetails").exec();
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    //check if user already has a profile
    user.firstName = firstName;
    user.lastName = lastName;
    await user.save();

    if (user.additonalDetails) {
      //update profile
      user.additonalDetails.gender = gender;
      user.additonalDetails.dateOfBirth = dateOfBirth;
      user.additonalDetails.about = about;
      user.additonalDetails.contactNumber = contactNumber;
      await user.additonalDetails.save();
    }

    // console.log("user", user);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully successfully",
      newUser: user,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to update profile, try again later",
    });
  }
};

//delete account
exports.deleteAccount = async (req, res) => {
  try {
    //fetch user id to to delete the account
    // const { userId } = req.body;
    const id = req.user.id;
    console.log("loggedIn user", id);
    // return res.status(200).json({
    //   userId: id,
    // });
    // find user
    const userDetails = await User.findById(id);

    //check if user exists
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exist with this id, to be deleted",
      });
    }

    //delete profile
    const profile = await Profile.findByIdAndDelete({
      _id: userDetails.additonalDetails,
    });

    // delete user
    const user = await User.findByIdAndDelete({ _id: id });

    // return response
    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
      user: user,
      profile: profile,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to delete the user, try again later",
    });
  }
};

// reset profile password
exports.resetProfilePassword = async (req, res) => {
  try {
    //fetch data
    const { currentPassword, newPassword } = req.body;
    const id = req.user.id;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be same as current password",
      });
    }
    //check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exist with this id",
      });
    }
    //  check if current password is correct
    const dbPassword = user.password;
    const isPasswordMatch = await bcrypt.compare(currentPassword, dbPassword);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password doesn't match with database",
      });
    }
    //upadte password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to reset password, try again later",
    });
  }
};

//get a user details
exports.getUserDetails = async (req, res) => {
  try {
    //fetch user id
    const id = req.user.id;
    console.log("userId", id);
    //get userDetails
    const userDetails = await User.findById(id)
      .populate("additonalDetails")
      .exec();
    console.log("userDetails", userDetails);
    //validate
    if (!userDetails) {
      return res.json({
        success: false,
        message: "user doesn't exist with this userId",
      });
    }
    //return response
    return res.status(200).json({
      success: true,
      message: "User data fetched successfully",
      userDetails,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch user data, try again",
    });
  }
};

exports.getUserEnrolledCourses = async (req, res) => {
  try {
    const id = req.user.id;
    console.log("id", id);
    //find user in db
    const user = await User.findById({ _id: id }).populate("courses").exec();
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exist with this id",
      });
    }
    console.log("user", user);
    return res.status(200).json({
      success: true,
      message: "User enrolled courses fetched successfully",
      data: user.courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch user enrolled courses, try again",
    });
  }
};
