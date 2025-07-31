const express = require("express");
const router = express.Router();
const { login } = require("../controllers/Login");
const { signUp } = require("../controllers/SignUp");
const { auth } = require("../middlewares/Auth");
const { resetPasswordToken, resetPassword } = require("../controllers/ResetPassword");


router.post("/auth/login", login);
router.post("/auth/signup", signUp);

router.post("/auth/reset-password-token", resetPasswordToken);
router.post("/auth/reset-password", resetPassword);


module.exports = router;
