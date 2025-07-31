const User = require("../models/User");

exports.fetchInstructorDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const instructorDetails = await User.findById(userId).populate("courses");
    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor details not found",
      });
    }

    if (instructorDetails.accountType !== "instructor") {
      return res.status(403).json({
        success: false,
        message: "User is not an instructor",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Instructor details fetched successfully",
      instructorDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch instructor details",
      error: error.message,
    });
  }
};
