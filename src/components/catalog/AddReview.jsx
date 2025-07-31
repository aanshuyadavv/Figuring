import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { FaStar } from "react-icons/fa";
import { apiconnector } from "../../services/apiConnector";
import toast from "react-hot-toast";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const AddReview = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [ratingGiven, setRatingGiven] = useState(false);
  const [ratingResponse, setReviewResponse] = useState([]);

  const { courseDetails } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { firstName, lastName, image, email } = user || {};
  const courseId = courseDetails?._id;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  async function onSubmit(data) {
    try {
      setLoading(true);
      const payload = { ...data, courseId };

      const res = await apiconnector(
        "POST",
        `${BASE_URL}/add-rating`,
        payload,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      fetchYourReview();
      toast.success("Review added successfully");
      setRatingGiven(true);
      reset();
      setRating(0);
      setIsModalOpen(false);
    } catch (error) {
      console.error("review error", error);
      toast.error(error.response?.data?.message || "Something went wrong");
      reset();
      setRating(0);
      setIsModalOpen(false);
    } finally {
      setLoading(false);
    }
  }

  async function fetchYourReview() {
    try {
      const res = await apiconnector(
        "POST",
        `${BASE_URL}/fetchRatingAndReviews`,
        { courseId },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (!res.data.success) throw new Error("fetch reviews api error");

      const reviews = res.data.ratingAndReviews;
      setReviewResponse(reviews);
      if (reviews.length > 0) {
        setRatingGiven(true);
        setRating(reviews[0].rating);
      } else {
        setRatingGiven(false);
      }
    } catch (error) {
      console.error("fetch review error", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  }

  useEffect(() => {
    if (courseId && token) {
      fetchYourReview();
    }
  }, [courseId, token]);

  return (
    <div>
      {ratingGiven ? (
        ratingResponse.map((review) => (
          <div
            key={review._id}
            className="mt-4 p-4 sm:p-5 border border-yellow-600 rounded-xl shadow-md bg-neutral-900"
          >
            <div className="flex items-center mb-2 gap-3">
              <img
                src={review.user.image}
                alt="Reviewer"
                className="w-10 h-10 rounded-full border-2 border-yellow-400"
              />
              <div>
                <h4 className="text-sm sm:text-lg font-semibold text-white">
                  {review.user.firstName} {review.user.lastName}
                </h4>
                <p className="text-xs sm:text-sm text-gray-400">{review.user.email}</p>
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-300">{review.review}</p>
            <div className="flex items-center mt-2">
              {[...Array(review.rating)].map((_, i) => (
                <FaStar key={i} className="text-yellow-400 text-lg" />
              ))}
            </div>
          </div>
        ))
      ) : (
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
        >
          Add Review
        </button>
      )}

      {/* Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 px-4">
          <div className="bg-neutral-900 p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md relative border border-yellow-600">
            <h2 className="text-xl sm:text-2xl font-bold text-center text-white mb-6">
              Add a Review
            </h2>

            <div className="text-center mb-6">
              <img
                src={image}
                alt="Reviewer"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-3 border-2 border-yellow-400"
              />
              <h3 className="text-sm sm:text-lg font-semibold text-white">
                {firstName} {lastName}
              </h3>
              <p className="text-xs sm:text-sm text-gray-400">{email}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <input
                type="hidden"
                {...register("rating", {
                  required: "Rating is required",
                  min: 1,
                })}
              />
              {errors.rating && (
                <p className="text-red-500 text-sm">{errors.rating.message}</p>
              )}

              <div className="flex justify-center gap-2">
                {[...Array(5)].map((_, i) => {
                  const starValue = i + 1;
                  return (
                    <FaStar
                      key={i}
                      className={`cursor-pointer text-2xl sm:text-3xl transition ${
                        starValue <= rating ? "text-yellow-400" : "text-gray-600"
                      }`}
                      onClick={() => {
                        setRating(starValue);
                        setValue("rating", starValue, {
                          shouldValidate: true,
                        });
                      }}
                    />
                  );
                })}
              </div>

              <textarea
                {...register("review", {
                  required: "Review is required",
                })}
                placeholder="Write your thoughts..."
                rows={4}
                className="w-full bg-neutral-800 border border-gray-700 focus:border-yellow-500 text-white rounded-lg p-3 focus:outline-none resize-none placeholder-gray-400 text-sm"
              />
              {errors.review && (
                <p className="text-red-500 text-sm">{errors.review.message}</p>
              )}

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white font-medium px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-5 py-2 text-sm rounded-lg transition duration-200"
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddReview;
