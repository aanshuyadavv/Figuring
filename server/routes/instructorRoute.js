const express = require("express");
const { fetchInstructorDetails } = require("../controllers/Instructor");
const { auth, isInstructor } = require("../middlewares/Auth");
const router = express.Router();

router.get(
  "/fetchInstructorDetails",
  auth,
  isInstructor,
  fetchInstructorDetails
);

module.exports = router;
