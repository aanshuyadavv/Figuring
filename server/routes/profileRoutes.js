const express = require("express");
const router = express.Router();
const {
  updateProfile,
  deleteAccount,
  getUserDetails,
  updateProfileImage,
  resetProfilePassword,
  getUserEnrolledCourses,
} = require("../controllers/Profile");
const { auth } = require("../middlewares/Auth");

router.put("/profile/updateProfile", auth, updateProfile);
router.delete("/profile/delete/account", auth, deleteAccount);
router.put("/profile/reset/password", auth, resetProfilePassword);
router.get("/profile/getUserDetails", auth, getUserDetails);
router.put("/profile/updateProfileImage", auth, updateProfileImage);
router.get("/profile/getUserEnrolledCourses", auth, getUserEnrolledCourses);

module.exports = router;
