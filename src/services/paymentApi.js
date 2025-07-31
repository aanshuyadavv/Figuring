import { apiconnector } from "./apiConnector";
import toast from "react-hot-toast";
const BASE_URL = process.env.REACT_APP_BASE_URL;
export function createOrder(courseId, token) {
  return async (dispatch) => {
    try {
      const response = await apiconnector(
        "POST",
        `${BASE_URL}/payment/create-order`,
        { courseId },
        {
          Authorization: `Bearer ${token}`,
        }
      );
      // console.log("response from create order", response);
    } catch (error) {
      console.log("error in create order", error);
      toast.error("Failed to create order");
    }
  };
}

export function verifyPayment(data, token) {
  return async (dispatch) => {
    try {
      const response = await apiconnector(
        "POST",
        `${BASE_URL}/payment/verify-payment`,
        data,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      // console.log("response from verify payment", response);
    } catch (error) {
      console.log("error in verify payment", error);
      toast.error("Failed to verify payment");
    }
  };
}

export function confirmEnrollment(data, token) {
  return async (dispatch) => {
    try {
      const response = await apiconnector(
        "POST",
        `${BASE_URL}/courses/enroll`,
        data,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      // console.log("response from confirm enrollment", response);
    } catch (error) {
      console.log("error in confirm enrollment", error);
      toast.error("Failed to confirm enrollment");
    }
  };
}
