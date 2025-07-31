import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { loadRazorpayScript } from "../../../utils/loadRazorpayScript";
import { apiconnector } from "../../../services/apiConnector";
import {
  setPaymentLoading,
  setPaymentSuccess,
  setEnrolledCourses,
  setPaymentError,
} from "../../../slices/paymentSlice";
import { resetCart } from "../../../slices/cartSlice";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY;

const RenderTotalAmount = () => {
  const { cart, totalItems } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const finalAmt = cart.reduce((sum, item) => {
    const price = Number(item.courseId?.price);
    return sum + (isNaN(price) ? 0 : price);
  }, 0);

  const handleBuyCourse = async () => {
    if (!token || !user || !cart?.length) {
      toast.error("Missing required information");
      return;
    }

    try {
      dispatch(setPaymentLoading(true));

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error("Razorpay SDK failed to load.");
        return;
      }

      const courseIds = cart.map((c) => c.courseId._id);

      const orderResponse = await apiconnector(
        "POST",
        `${BASE_URL}/payment/create-order`,
        { courseIds },
        { Authorization: `Bearer ${token}` }
      );

      const { order } = orderResponse.data;

      const options = {
        key: RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: "My Course Platform",
        description: "Course Enrollment",
        order_id: order.id,
        handler: async function (response) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
            response;

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

          dispatch(
            setPaymentSuccess({
              success: true,
              paymentId: razorpay_payment_id,
            })
          );

          const enrollmentRes = await apiconnector(
            "POST",
            `${BASE_URL}/courses/enroll`,
            { courseIds },
            {
              Authorization: `Bearer ${token}`,
            }
          );

          if (enrollmentRes.data.success) {
            toast.success("Enrollment successful!");
            dispatch(setEnrolledCourses(enrollmentRes.data.user.courses));
            dispatch(resetCart());

            await apiconnector("DELETE", `${BASE_URL}/cart/clear`, null, {
              Authorization: `Bearer ${token}`,
            });

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
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", function () {
        toast.error("Payment failed or cancelled");
        dispatch(setPaymentError("Payment was not completed"));
      });
    } catch (error) {
      console.error("Payment error:", error);
      const message =
        error?.response?.data?.message || "Something went wrong. Try again.";
      toast.error(message);
      dispatch(setPaymentError(message));
    } finally {
      dispatch(setPaymentLoading(false));
    }
  };

  return (
    <div className="text-white bg-[#1e1e2f] p-4 sm:p-6 rounded-lg shadow-md w-full max-w-sm  sm:mx-0">
      {cart?.length > 0 ? (
        <>
          <div className="flex justify-between text-base sm:text-lg mb-2 mx-auto">
            <span className="font-semibold">Total Items:</span>
            <span>{totalItems}</span>
          </div>
          <div className="flex justify-between text-base sm:text-lg mb-4">
            <span className="font-semibold">Total Amount:</span>
            <span className="text-yellow-400 font-bold">₹{finalAmt}</span>
          </div>

          <button
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-2 rounded transition"
            onClick={handleBuyCourse}
          >
            Buy Now
          </button>
        </>
      ) : (
        <h1 className="text-center text-gray-400 text-base sm:text-lg">
          Cart is empty
        </h1>
      )}
    </div>
  );
};

export default RenderTotalAmount;
