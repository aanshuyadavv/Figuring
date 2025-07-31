const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
require("dotenv").config();
const uploadVideoToCloudinary = require("../utils/videoUploader");

//create subsection
exports.createSubSection = async (req, res) => {
  try {
    // console.log("req.body create subsection ki", req.body);
    //fetch data
    const { title, description, sectionId } = req.body;

    //get video
    const video = req.files.videoFile;
    console.log("video backend se", video);
    if (!video) {
      return res.status(400).json({
        success: false,
        message: "Video file is missing",
      });
    }

    //validate
    if (!title || !description || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    
    //upload video to cloudinary and get url
    const uploadDetails = await uploadVideoToCloudinary(
      video,
      process.env.FOLDER_NAME,
      "video"
    );

    // console.log("uploadDetails", uploadDetails);
    //create subsection
    const subsectionDetails = await SubSection.create({
      title,
      description,
      videoUrl: uploadDetails.secure_url,
    });

    //update section
    const updateSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $push: {
          subsection: subsectionDetails._id,
        },
      },
      { new: true }
    ).populate("subsection");
    // console.log("updated section with subsection id", updateSection);

    //return response
    return res.status(200).json({
      success: true,
      message: "subsection created successfully",
      updateSection: updateSection,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "unable to create subsection",
    });
  }
};

//update subsection
exports.updateSubSection = async (req, res) => {
  try {
    //fetch data
    const {sectionId, subSectionId, title, description} = req.body;

    //get video
    const video = req.files.videoFile;

    //validate
    if (!title || !description || !subSectionId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //upload video to cloudinary and get url
    const uploadDetails = await uploadVideoToCloudinary(
      video,
      process.env.FOLDER_NAME,
      "video"

    );

    //update subsection
    const updateSubSection = await SubSection.findByIdAndUpdate(
      { _id: subSectionId },
      {
        title: title,
        description: description,
        videoUrl: uploadDetails.secure_url,
      },
      { new: true }
    );

    const updatedSection = await Section.findById(sectionId).populate("subsection");
    //return response
    return res.status(200).json({
      success: true,
      message: "subsection updated successfully",
      updateSubSection:updateSubSection,
      updatedSection:updatedSection
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "unable to update subsection",
    });
  }
};

//delete subsection

exports.deleteSubSection = async (req, res) => {
  try {
    console.log("req body delete subsection", req.body);
    const { subsectionId, sectionId } = req.body;
    const deleteSubSection = await SubSection.findByIdAndDelete(subsectionId);

    //if subsection details not found
    if (!deleteSubSection) {
      return res.status(404).json({
        success: false,
        message: "subsection details not found to delete",
      });
    }

    const updateSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        $pull: {
          subsection: deleteSubSection._id,
        },
      },
      {
        new: true,
      }
    ).populate("subsection");
    //return response
    return res.status(200).json({
      success: true,
      message: "subsection deleted successfully",
      updateSection: updateSection,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "unable to delete subsection",
    });
  }
};
