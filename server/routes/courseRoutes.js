const express = require("express");
const router = express.Router();
const {
  createCourse,
  showAllCourses,
  getCourseDetails,
  deleteAllCourse,
  publishCourse,
  getInstructorCourses,
  deleteCourse,
  editCourse,
} = require("../controllers/Course");

const {
  createSection,
  deleteSection,
  updateSection,
} = require("../controllers/Section");
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/SubSection");
const {
  createRating,
  getAverageRating,
  getAllRating,
  alreadyReviewed,
  fetchRatingAndReviews,
} = require("../controllers/RatingAndReviews");
const { createCategory, getAllCategory } = require("../controllers/Category");

const { getCategoryPageDetails } = require("../controllers/Category");

const { auth, isStudent, isInstructor } = require("../middlewares/Auth");

router.post("/course/createCourse", auth, createCourse);
router.get("/course/allCourses", auth, showAllCourses);
router.post("/course/getCourseDetails", auth, getCourseDetails);
router.delete("/delete/Allcourse", deleteAllCourse);
router.post("/course/publishCourse", auth, isInstructor, publishCourse);
router.get(
  "/course/getInstructorCourses",
  auth,
  isInstructor,
  getInstructorCourses
);
router.delete("/course/delete", auth, isInstructor, deleteCourse);
router.post("/course/edit/:id", auth, isInstructor, editCourse);

router.post("/course/createSection", auth, isInstructor, createSection);
router.put("/course/updateSection", auth, isInstructor, updateSection);
router.delete("/course/deleteSection", auth, isInstructor, deleteSection);

router.post("/course/createSubSection", auth, isInstructor, createSubSection);
router.put("/course/updateSubSection", auth, isInstructor, updateSubSection);
router.delete("/course/deleteSubSection", auth, isInstructor, deleteSubSection);

router.post("/add-rating", auth, isStudent, createRating);
router.get("/course/getAverageRating", auth, getAverageRating);
router.get("/course/getAllRating", auth, getAllRating);
router.post("/alreadyReviewed", auth, isStudent, alreadyReviewed);
router.post("/fetchRatingAndReviews", auth, isStudent, fetchRatingAndReviews);

router.post("/course/createCategory", auth, isInstructor, createCategory);
router.get("/course/getAllCategory", getAllCategory);
router.post("/course/getCategoryPageDetails", auth, getCategoryPageDetails);

module.exports = router;
