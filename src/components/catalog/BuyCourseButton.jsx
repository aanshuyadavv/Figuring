import React from "react";
import { loadRazorpayScript } from "../../utils/loadRazorpayScript";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { apiconnector } from "../../services/apiConnector";
import {
  setPaymentLoading,
  setPaymentSuccess,
  setEnrolledCourses,
  setPaymentError,
} from "../../slices/paymentSlice";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY;

const BuyCourseButton = ({ courses, user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const handleBuyCourse = async () => {
    if (!token || !user || !courses?.length) {
      toast.error("Missing required information");
      return;
    }

    try {
      dispatch(setPaymentLoading(true));

      // Load Razorpay SDK
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Razorpay SDK failed to load.");
        return;
      }

      // Create order
      const courseIds = courses.map((course) => course._id);
      const orderRes = await apiconnector(
        "POST",
        `${BASE_URL}/payment/create-order`,
        { courseIds },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      const { order } = orderRes.data;

      const options = {
        key: RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: "Figuring",
        description: "Course Enrollment",
        order_id: order.id,
        handler: async function (response) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;

          // Verify payment
          const verifyRes = await apiconnector(
            "POST",
            `${BASE_URL}/payment/verify-payment`,
            {
              razorpayPaymentId: razorpay_payment_id,
              razorpayOrderId: razorpay_order_id,
              razorpaySignature: razorpay_signature,
            },
            {
              Authorization: `Bearer ${token}`,
            }
          );

          if (!verifyRes.data.success) {
            toast.error("Payment verification failed");
            dispatch(setPaymentError("Payment verification failed"));
            return;
          }

          dispatch(setPaymentSuccess({
            success: true,
            paymentId: razorpay_payment_id,
          }));

          // Enroll the user
          const enrollRes = await apiconnector(
            "POST",
            `${BASE_URL}/courses/enroll`,
            { courseIds },
            {
              Authorization: `Bearer ${token}`,
            }
          );

          if (enrollRes.data.success) {
            toast.success("Enrollment successful!");
            dispatch(setEnrolledCourses(enrollRes.data.user.courses));
            navigate("/dashboard/enrolled-courses");
          } else {
            toast.error("Enrollment failed");
            dispatch(setPaymentError("Enrollment failed"));
          }
        },
        prefill: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
        },
        theme: {
          color: "#facc15", // yellow-400
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.response?.data?.message || "Payment failed");
      dispatch(setPaymentError(error.response?.data?.message || "Payment failed"));
    } finally {
      dispatch(setPaymentLoading(false));
    }
  };

  return (
    <button
      onClick={handleBuyCourse}
      className="mt-4 w-full bg-yellow-500 text-black py-2 px-4 rounded-lg font-semibold hover:bg-yellow-400 transition-all duration-200"
    >
      Buy This Course
    </button>
  );
};

export default BuyCourseButton;
