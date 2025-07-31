import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { apiconnector } from "../../../services/apiConnector";
import toast from "react-hot-toast";
import { setCart } from "../../../slices/cartSlice";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const RenderCartCourses = () => {
  const { cart } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const removeHandler = async (courseId) => {
    try {
      const res = await apiconnector(
        "DELETE",
        `${BASE_URL}/cart/remove`,
        { courseId },
        { Authorization: `Bearer ${token}` }
      );
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to remove course from cart");
      }
      dispatch(setCart(res.data.updatedCart.items));
      toast.success("Course removed from cart");
    } catch (error) {
      console.error("Error removing course from cart:", error);
      toast.error(
        error.response?.data?.message || "Failed to remove course from cart"
      );
    }
  };

  return (
    <div className="text-white px-4 md:px-16 py-8 w-full">
      {cart.length > 0 ? (
        <div className="space-y-6">
          {cart.map((item) => {
            const course = item.courseId;
            return (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 bg-[#1f1f2e] p-4 rounded-lg shadow-md"
              >
                {/* Thumbnail */}
                <div className="w-full sm:w-[180px] h-[160px] sm:h-[100px] overflow-hidden rounded-md mx-auto sm:mx-0">
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 text-left sm:text-left space-y-2">
                  <p className="text-lg sm:text-xl font-semibold">{course.courseName}</p>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {course.courseDescription}
                  </p>
                </div>

                {/* Price + Remove */}
                <div className="flex flex-row sm:flex-col items-center justify-between sm:items-end sm:justify-center gap-2 sm:gap-3">
                  <p className="text-lg font-semibold text-yellow-400">
                    ₹{course.price}
                  </p>
                  <button
                    onClick={() => removeHandler(course._id)}
                    className="text-sm text-red-400 hover:text-red-300 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-400 text-lg mt-10">
          No courses added to cart
        </p>
      )}
    </div>
  );
};

export default RenderCartCourses;
