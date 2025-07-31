require("dotenv").config();
const { razorpayInstance } = require("../config/razorpay");
const { mailSender } = require("../utils/mailSender");
const Course = require("../models/Course");
const User = require("../models/User");
const crypto = require("crypto");
// console.log("env", process.env);
//create order
exports.createOrder = async (req, res) => {
  try {
    let { courseId, courseIds } = req.body;
    const userId = req.user.id;

    let selectedCourses = [];

    if (courseId) courseIds = [courseId];

    if (!courseIds || courseIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No course ID(s) provided",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //already purchased courses
    const alreadyEnrolledCourses = courseIds.filter((id) =>
      user.courses.some((enrolledId) => enrolledId.equals(id))
    );

    if (alreadyEnrolledCourses.length > 0) {
      return res.status(409).json({
        success: false,
        message: `${user.firstName}, you are already enrolled in the course.`,
      });
    }

    //Fetch course details
    for (const id of courseIds) {
      const course = await Course.findById(id);
      if (!course) {
        return res.status(400).json({
          success: false,
          message: `Course not found for ID: ${id}`,
        });
      }
      selectedCourses.push(course);
    }

    const totalAmount =
      selectedCourses.reduce((total, course) => total + course.price, 0) * 100;

    const options = {
      amount: totalAmount,
      currency: "INR",
      receipt: `receipt_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      notes: {
        courses: selectedCourses.map((c) => c._id.toString()).join(", "),
      },
    };

    const order = await razorpayInstance.orders.create(options);

    if (!order) {
      return res.status(400).json({
        success: false,
        message: "Order not created",
      });
    }

    return res.status(200).json({
      success: true,
      order: order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//verify payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification fields",
      });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error("RAZORPAY_SECRET is undefined");
      return res.status(500).json({
        success: false,
        message: "Server misconfiguration: Missing Razorpay secret",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//confirm enrollment and send email
exports.confirmEnrollment = async (req, res) => {
  try {
    let { courseId, courseIds } = req.body;
    const userId = req.user.id;

    if (courseId) courseIds = [courseId];

    if (!courseIds || courseIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No course ID provided",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const courses = await Course.find({ _id: { $in: courseIds } });

    for (const course of courses) {
      if (!course) {
        return res
          .status(404)
          .json({ success: false, message: "Course not found" });
      }

      if (
        !course.studentsEnrolled.some(
          (id) => id.toString() === user._id.toString()
        )
      ) {
        course.studentsEnrolled.push(user._id);
      }
      await course.save();

      if (!user.courses.some((id) => id.toString() === course._id.toString())) {
        user.courses.push(course._id);
      }
      await user.save();
    }

    const updatedUser = await User.findById(userId).populate("courses");

    return res.status(200).json({
      success: true,
      message: "Enrollment process completed",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error in confirmEnrollment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//create order
// capture the payment and initiate the Razorpay order
// exports.capturePayment = async (req, res) => {
//   try {
//     const { courseId } = req.body;
//     const userId = req.user.id;

//     // Get course details
//     const courseDetails = await Course.findById(courseId);

//     // Check if course exists
//     if (!courseDetails) {
//       return res.status(404).json({
//         success: false,
//         message: "Course details not found, check the ID.",
//       });
//     }

//     // Check if user has already enrolled
//     const uid = new mongoose.Types.ObjectId(userId);
//     if (courseDetails.studentsEnrolled.includes(uid)) {
//       return res.status(400).json({
//         success: false,
//         message: "User already enrolled.",
//       });
//     }

//     // Create Razorpay order
//     const amount = courseDetails.price;
//     const currency = "INR";

//     const options = {
//       amount: amount * 100,
//       currency,
//       receipt: `receipt_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
//       notes: {
//         courseId: courseDetails._id.toString(),
//         userId,
//       },
//     };

//     const paymentResponse = await razorpayInstance.orders.create(options);
//     console.log("Razorpay order created:", paymentResponse);

//     return res.status(200).json({
//       success: true,
//       courseName: courseDetails.courseName,
//       courseDescription: courseDetails.courseDescription,
//       thumbnail: courseDetails.thumbnail,
//       orderId: paymentResponse.id,
//       currency: paymentResponse.currency,
//       amount: paymentResponse.amount,
//     });
//   } catch (error) {
//     console.error("Error in capturePayment:", error.message);
//     return res.status(500).json({
//       success: false,
//       message: "Unable to capture the payment",
//     });
//   }
// };

// Verify Razorpay signature and enroll user
// exports.verifySignature = async (req, res) => {
//   try {
//     const webhookSecret = process.env.WEBHOOK_SECRET;
//     const signature = req.headers["x-razorpay-signature"];
//     const generatedSignature = crypto
//       .createHmac("sha256", webhookSecret)
//       .update(JSON.stringify(req.body))
//       .digest("hex");

//     if (signature === generatedSignature) {
//       console.log("Payment is authorised");

//       const { courseId, userId } = req.body.payload.entity.notes;

//       // Enroll user in course
//       const course = await Course.findByIdAndUpdate(
//         { _id: courseId },
//         {
//           $push: {
//             studentsEnrolled: userId,
//           },
//         },
//         { new: true }
//       );

//       if (!course) {
//         return res.status(404).json({
//           success: false,
//           message: "Course with this ID doesn't exist",
//         });
//       }

//       console.log("Course with new student enrolled:", course);

//       // Add course to user's course list
//       const user = await User.findByIdAndUpdate(
//         { _id: userId },
//         {
//           $push: {
//             courses: course._id,
//           },
//         },
//         { new: true }
//       );

//       console.log("New course added to user's course list:", user);

//       // Send enrollment email
//       await mailSender(
//         user.email,
//         "Congratulations from Anshu Yadav",
//         "Congratulations! You are onboarded to our new course."
//       );

//       return res.status(200).json({
//         success: true,
//         message: "Signature verified and course enrolled successfully.",
//       });
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid signature, request not authorized.",
//       });
//     }
//   } catch (error) {
//     console.error("Error in verifySignature:", error.message);
//     return res.status(500).json({
//       success: false,
//       message: "Unable to verify signature",
//     });
//   }
// };
