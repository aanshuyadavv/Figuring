const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

//create rating and reviews
exports.createRating = async (req, res) => {
  try {
    const { courseId, rating, review } = req.body;
    const userId = req.user.id;

    //Check if course exists and user is enrolled
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    if (!course.studentsEnrolled.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "User is not enrolled in the course to give rating",
      });
    }

    //Check for duplicate review
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });
    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "User has already reviewed this course",
      });
    }

    //Create new rating and review
    const newRating = await RatingAndReview.create({
      user: userId,
      course: courseId,
      rating,
      review,
    });

    // Add rating to the course's array
    await Course.findByIdAndUpdate(courseId, {
      $push: { ratingAndReviews: newRating._id },
    });

    return res.status(200).json({
      success: true,
      message: "Rating created successfully",
      data: newRating,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to create the rating",
    });
  }
};

exports.alreadyReviewed = async (req, res) => {
  try {
    const { courseId } = req.body;
    console.log("course id alreadyReviewed", courseId);
    const userId = req.user.id;
    console.log("userif from alreadyReviewed", userId);

    // Check if the user has already reviewed the course
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });

    if (alreadyReviewed) {
      return res.status(200).json({
        success: true,
        alreadyReviewed: true,
      });
    } else {
      return;
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to check if the user has already reviewed",
    });
  }
};

exports.fetchRatingAndReviews = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    if (!courseId || !userId) {
      return res.status(400).json({
        success: false,
        message: "courseId or userId is required",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(courseId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid courseId or userId",
      });
    }

    const ratingAndReviews = await RatingAndReview.find({
      course: new mongoose.Types.ObjectId(courseId),
      user: new mongoose.Types.ObjectId(userId),
    }).populate("user");

    // console.log("ratingAndReviews", ratingAndReviews);

    return res.status(200).json({
      success: true,
      message:
        ratingAndReviews.length === 0
          ? "No rating and reviews found"
          : "Rating and reviews fetched successfully",
      ratingAndReviews: ratingAndReviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch ratingAndReviews",
      error: error.message,
    });
  }
};

//get average rating
exports.getAverageRating = async (req, res) => {
  try {
    //get course id
    const { courseId } = req.body;

    const resultRating = await RatingAndReview.aggregate([
      {
        $match: {
          course: mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          avgrating: {
            $avg: "$rating",
          },
        },
      },
    ]);

    //return rating
    if (resultRating.length > 0) {
      return res.status(200).json({
        success: true,
        avgRating: resultRating[0].avgrating,
      });
    }

    //if no rating exists
    return res.status(200).json({
      success: true,
      message: "average rating is 0, no rating given till now",
      avgRating: 0,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      sucess: false,
      message: "Unable to get the average of rating",
    });
  }
};

//get all rating and reviews
exports.getAllRating = async (req, res) => {
  try {
    //fetch all rating
    const allRating = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .populate({ path: "user", select: "fistName" })
      .populate({ path: "user", select: "lastName" })
      .populate({ path: "course", select: "courseName" })
      .exec();

    //return response
    return res.status(200).json({
      success: true,
      message: "All rating and reviews fetched sucessfully",
      data: allRating,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: true,
      message: "Unable to fetch all rating and reviews ",
    });
  }
};
