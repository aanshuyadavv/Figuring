const Category = require("../models/Category");
const Course = require("../models/Course");

//create category handle function
exports.createCategory = async (req, res) => {
  try {
    //fetch data
    const { name, description, path } = req.body;
    // console.log(req.body)
    if (!name || !description || !path) {
      return res.json({
        success: false,
        message: "All fields are required",
      });
    }
    //create entry in db
    const newCategory = await Category.create({ name, description, path });
    // console.log(newCategory);

    //return response
    return res.status(200).json({
      success: true,
      message: "Category created successfully",
      newCategory: newCategory,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "error while creating category",
    });
  }
};

//get all category

exports.getAllCategory = async (req, res) => {
  try {
    const allCategory = await Category.find({});
    // console.log("all category", allCategory);
    return res.status(200).json({
      success: true,
      message: "All categories have been fetched",
      data: allCategory,
    });
  } catch (error) {
    console.log("Error fetching categories:", error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching categories",
      error: error.message,
    });
  }
};

exports.getCategoryPageDetails = async (req, res) => {
  try {
    console.log("req body category page details ki", req.body);
    const { categoryId } = req.body;

    // Fetch selected category and its courses
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        populate: {
          path: "instructor",
        },
      })
      .exec();

    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: `Category not found with id: ${categoryId}`,
      });
    }

    // Fetch courses from other categories (excluding current)
    const otherCategoriesCourses = await Category.find({
      _id: { $ne: selectedCategory._id },
    })
      .populate({
        path: "courses",
        populate: {
          path: "instructor",
        },
      })
      .exec();

    // Fetch top-selling courses
    const topSellingCourses = await Course.aggregate([
      {
        $addFields: {
          totalEnrolled: { $size: "$studentsEnrolled" },
        },
      },
      {
        $sort: { totalEnrolled: -1 },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: "users", // Name of the collection in MongoDB (usually lowercase plural of model name)
          localField: "instructor",
          foreignField: "_id",
          as: "instructor",
        },
      },
      {
        $unwind: "$instructor", // To convert array to object
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Category page details fetched successfully",
      data: {
        selectedCategory,
        otherCategoriesCourses,
        topSellingCourses,
      },
    });
  } catch (error) {
    console.log("Error in getCategoryPageDetails:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error while fetching category page details",
      error: error.message,
    });
  }
};
