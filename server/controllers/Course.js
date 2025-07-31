const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();
const mongoose = require("mongoose");

//create course
exports.createCourse = async (req, res) => {
  try {
    // console.log("CREATE COURSE - req.body:", req.body);
    // console.log("CREATE COURSE - req.files:", req.files);

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const {
      courseName,
      courseDescription,
      price,
      whatYouWillLearn,
      category,
      tags,
    } = req.body;

    const { thumbnail } = req.files ?? {};

    // Validation
    if (
      !courseName ||
      !courseDescription ||
      !price ||
      !whatYouWillLearn ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!thumbnail) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail image is required",
      });
    }

    const userId = req.user.id;
    // console.log("Backend user ID:", userId);

    const categoryId = await Category.findOne({ name: category });
    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category not found",
      });
    }
    // console.log("Category ID:", categoryId);

    // Fetch instructor details
    const instructorDetails = await User.findById(userId);
    if (!instructorDetails) {
      return res.status(400).json({
        success: false,
        message: "Instructor details not found",
      });
    }

    // Upload thumbnail to Cloudinary
    let thumbnailImage;
    try {
      thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      );
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to upload thumbnail",
        error: err.message,
      });
    }

    // Create new course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      price,
      whatYouWillLearn,
      instructor: instructorDetails._id,
      category: categoryId._id,
      thumbnail: thumbnailImage.secure_url,
      tags,
    });

    // console.log("New course created:", newCourse);

    // Add course to instructor
    await User.findByIdAndUpdate(
      instructorDetails._id,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    // Add course to category
    await Category.findByIdAndUpdate(
      categoryId._id,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    // Send response
    return res.status(200).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    return res.status(500).json({
      success: false,
      message: "Error while creating the course",
      error: error.message,
    });
  }
};

//get all courses
exports.showAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        courseDescription: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
      .exec();
    //return response
    return res.status(200).json({
      success: true,
      message: "All courses fetched successfully",
      data: allCourses,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "error while fetching all course",
    });
  }
};

//getCoursedetails

exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    console.log(courseId);
    // Check if courseId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid courseId format",
      });
    }

    // Get course details
    const course = await Course.findOne({ _id: courseId })
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: { path: "subsection" },
      })
      .populate("instructor")
      .exec();

    console.log(course);

    // If course doesn't exist
    if (!course) {
      return res.status(404).json({
        success: false,
        message: `Course with ID ${courseId} doesn't exist`,
      });
    }

    // Return response
    return res.status(200).json({
      success: true,
      message: "Fetched course details successfully",
      course,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch the course details",
    });
  }
};

exports.deleteAllCourse = async (req, res) => {
  try {
    await Course.deleteMany({});
    await Section.deleteMany({});
    await SubSection.deleteMany({});
    return res.status(200).json({
      success: true,
      message: "All courses deleted successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to delete all courses",
    });
  }
};

exports.publishCourse = async (req, res) => {
  try {
    // console.log("req ki body publish course ki", req.body);
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "courseId is required",
      });
    }
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    course.status = "published";
    await course.save();
    return res.status(200).json({
      success: true,
      message: "Course published successfully",
      course: course,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to publish course",
    });
  }
};

exports.getInstructorCourses = async (req, res) => {
  try {
    console.log("req from get instructor courses", req.user);
    const instructorId = req.user.id;
    console.log("instructorId", instructorId);
    const courses = await Course.find({ instructor: instructorId })
      .populate({
        path: "courseContent",
        populate: {
          path: "subsection",
        },
      })
      .exec();
    return res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      data: courses,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch courses",
      error: error.message,
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID not provided",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    for (const sectionId of course.courseContent) {
      const section = await Section.findById(sectionId);

      if (section) {
        // Delete all subsections inside this section
        for (const subSectionId of section.subsection) {
          await SubSection.findByIdAndDelete(subSectionId);
        }

        // Delete the section itself
        await Section.findByIdAndDelete(sectionId);
      }
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    // Update user to remove the course from their course list
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { courses: courseId },
      },
      { new: true }
    ).populate("courses");

    // Pull courseId from Category.courses array
    await Category.findByIdAndUpdate(
      course.category,
      {
        $pull: { courses: courseId },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Course, its sections, and subsections deleted successfully",
      updatedUser,
    });
  } catch (error) {
    console.error("Error in deletCourse:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting course",
    });
  }
};

exports.editCourse = async (req, res) => {
  try {
    console.log(req.params);
    console.log("edit course ki req body", req.body);
    console.log("edit course ki req files", req.files);
    const {
      courseId,
      courseName,
      courseDescription,
      price,
      whatYouWillLearn,
      category,
      tags,
    } = req.body;

    if (
      !courseId ||
      !courseName ||
      !courseDescription ||
      !price ||
      !whatYouWillLearn ||
      !category ||
      !tags
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const categoryDoc = await Category.findOne({ name: category });
    if (!categoryDoc) {
      return res.status(400).json({
        success: false,
        message: "Category not found",
      });
    }

    const existingCourse = await Course.findById(courseId);
    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    let thumbnailImage = existingCourse.thumbnail;
    console.log("thumbnailImage", thumbnailImage);

    if (req.files) {
      try {
        const uploadResponse = await uploadImageToCloudinary(
          req.files.thumbnail,
          process.env.FOLDER_NAME
        );
        thumbnailImage = uploadResponse.secure_url;
      } catch (err) {
        console.error("Cloudinary upload failed:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to upload thumbnail",
        });
      }
    }

    const updateCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        courseName,
        courseDescription,
        price,
        whatYouWillLearn,
        tags,
        category: categoryDoc._id,
        thumbnail: thumbnailImage,
      },
      { new: true }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subsection",
        },
      })
      .populate("category")
      .exec();

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updateCourse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update course",
      error: error.message,
    });
  }
};
