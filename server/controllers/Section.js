const Section = require("../models/Section");
const Course = require("../models/Course");

//create section
exports.createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;

    // Validate
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Create section
    const newSection = await Section.create({ sectionName });

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    ).populate("courseContent");

    return res.status(200).json({
      success: true,
      message: "Section created successfully",
      data: updatedCourse,
      section: newSection,
    });
  } catch (error) {
    console.log("CREATE SECTION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error while creating section",
    });
  }
};

//delete section with sectionId
exports.deleteSection = async (req, res) => {
  try {
    console.log("req body delete section", req.body);

    const { sectionId, courseId } = req.body;

    // Validate input
    if (!sectionId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Both sectionId and courseId are required",
      });
    }

    // Fetch section from DB
    const sectionDetails = await Section.findById(sectionId);

    if (!sectionDetails) {
      return res.status(404).json({
        success: false,
        message: "Section not found. Check the ID and try again.",
      });
    }

    // Delete section
    const deletedSection = await Section.findByIdAndDelete(sectionDetails._id);

    // Remove reference from course
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $pull: {
          courseContent: deletedSection._id,
        },
      },
      { new: true }
    ).populate("courseContent");

    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
      updatedCourse,
    });
  } catch (error) {
    console.error("Error deleting section:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete section",
      error: error.message,
    });
  }
};


//update section with sectionId
exports.updateSection = async (req, res) => {
  try {
    const { sectionId, sectionName, courseId } = req.body;

    if (!sectionId || !sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: sectionId, sectionName, or courseId",
      });
    }

    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    if (!updatedSection) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    await Course.findByIdAndUpdate(courseId, {
      $addToSet: { courseContent: updatedSection._id },
    });

    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subsection",
        },
      });

    return res.status(200).json({
      success: true,
      message: "Section updated successfully",
      course: course,
      updatedSection: updatedSection,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to update section",
      error: error.message,
    });
  }
};
