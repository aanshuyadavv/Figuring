const express = require("express");
const {
  createOrder,
  verifyPayment,
  confirmEnrollment,
} = require("../controllers/Payment");
const { auth, isStudent } = require("../middlewares/Auth");

const router = express.Router();

router.post("/payment/create-order", auth, isStudent, createOrder);
router.post("/payment/verify-payment", auth, isStudent, verifyPayment);
router.post("/courses/enroll", auth, isStudent, confirmEnrollment);

module.exports = router;
