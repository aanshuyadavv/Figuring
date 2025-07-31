import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  IoIosArrowDropupCircle,
  IoIosArrowDropdownCircle,
} from "react-icons/io";
import { FaLock } from "react-icons/fa6";
import { SlCamrecorder } from "react-icons/sl";

import AnimatedLoader from "../common/AnimatedLoader";
import BuyCourseButton from "./BuyCourseButton";
import AddReview from "./AddReview";

import { getCourseDetails } from "../../services/courseDetailsAPI";
import { apiconnector } from "../../services/apiConnector";
import { setLoading } from "../../slices/courseSlice";
import { setCartLoading, addToCart } from "../../slices/cartSlice";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 * i, duration: 0.6 },
  }),
};

const CourseDetails = () => {
  const [openSections, setOpenSections] = useState({});
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [addReview, setAddReview] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { courseId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { courseDetails, loading } = useSelector((state) => state.course);

  const isUserEnrolled = enrolledCourses?.some((c) => c._id === courseId);

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const fetchEnrolledCourses = async () => {
    try {
      dispatch(setLoading(true));
      const res = await apiconnector(
        "GET",
        `${BASE_URL}/profile/getUserEnrolledCourses`,
        null,
        { Authorization: `Bearer ${token}` }
      );
      setEnrolledCourses(res.data.data);
    } catch (err) {
      console.error("Fetch enrolled error:", err);
      toast.error("Failed to fetch enrolled courses");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (token) fetchEnrolledCourses();
  }, [token]);

  useEffect(() => {
    if (token && isValidObjectId(courseId)) {
      dispatch(getCourseDetails(courseId, token));
    }
  }, [courseId, token, dispatch]);

  const addToCartHandler = async () => {
    try {
      dispatch(setCartLoading(true));
      const response = await apiconnector(
        "POST",
        `${BASE_URL}/cart/add`,
        { courseId },
        { Authorization: `Bearer ${token}` }
      );

      if (!response.data.success) throw new Error("Add to cart API error");

      dispatch(addToCart(response.data?.cart?.items || []));
      toast.success("Course added to cart");
      navigate("/dashboard/cart");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    } finally {
      dispatch(setCartLoading(false));
    }
  };

  if (loading || !courseDetails) return <AnimatedLoader />;

  const {
    courseName,
    courseDescription,
    instructor,
    price,
    thumbnail,
    whatYouWillLearn,
    courseContent,
  } = courseDetails;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="p-6 text-white"
    >
      {/* Overview + Purchase */}
      <div className="bg-gray-900 flex flex-col lg:flex-row gap-10 justify-between items-start rounded-xl p-6 shadow-lg">
        {/* Course Info */}
        <motion.div
          className="max-w-3xl space-y-6"
          variants={fadeInUp}
        >
          <h1 className="text-4xl font-extrabold text-yellow-400">{courseName}</h1>
          <p className="text-lg text-gray-300">{courseDescription}</p>

          <div>
            <h2 className="text-xl font-semibold">Instructor</h2>
            <p>{instructor?.firstName} {instructor?.lastName}</p>
            <p className="text-sm text-gray-400">{instructor?.email}</p>
          </div>

          {whatYouWillLearn && (
            <div>
              <h2 className="text-xl font-semibold">What you'll learn</h2>
              <p className="text-gray-300">{whatYouWillLearn}</p>
            </div>
          )}

          {isUserEnrolled && <AddReview />}
        </motion.div>

        {/* Buy Card */}
        <motion.div
          className="w-[300px] border border-gray-700 rounded-2xl p-4 shadow-xl bg-[#1e1e2f]"
          variants={fadeInUp}
        >
          <img
            src={thumbnail || "/default-thumbnail.png"}
            onError={(e) => (e.target.src = "/default-thumbnail.png")}
            alt="Course Thumbnail"
            className="rounded-lg w-full h-48 object-cover"
          />
          <h2 className="text-2xl font-bold mt-4">₹{price}</h2>
          <BuyCourseButton courses={[courseDetails]} user={user} />
          <button
            onClick={addToCartHandler}
            className="mt-2 w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded transition"
          >
            Add to Cart
          </button>
        </motion.div>
      </div>

      {/* Course Content */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6">Course Content</h2>

        {courseContent?.length === 0 ? (
          <p className="text-gray-400 italic">No course content yet.</p>
        ) : (
          courseContent.map((section, index) => (
            <motion.div
              key={index}
              className="mb-6 border border-gray-700 rounded-lg"
              variants={fadeInUp}
              custom={index}
            >
              <div
                onClick={() => toggleSection(index)}
                className="flex items-center justify-between px-4 py-3 cursor-pointer bg-[#2b2b3f] hover:bg-[#32324a]"
              >
                <h3 className="text-xl font-semibold text-yellow-400">
                  Section {index + 1}: {section?.sectionName}
                </h3>
                {openSections[index] ? (
                  <IoIosArrowDropupCircle size={26} className="text-yellow-400" />
                ) : (
                  <IoIosArrowDropdownCircle size={26} className="text-yellow-400" />
                )}
              </div>

              {openSections[index] && (
                <div className="bg-[#1e1e2f] px-6 py-4 space-y-4">
                  {section?.subsection?.length ? (
                    section.subsection.map((sub, idx) => (
                      <motion.div
                        key={idx}
                        className="bg-[#2f2f45] p-4 rounded-md border border-gray-600 hover:scale-[1.01] transition"
                        variants={fadeInUp}
                        custom={idx}
                      >
                        <h4 className="text-lg font-semibold">{sub.title}</h4>
                        <p className="text-sm text-gray-400">{sub.description}</p>
                        {sub.duration && (
                          <p className="text-xs text-gray-500">Duration: {sub.duration}</p>
                        )}
                        {isUserEnrolled ? (
                          sub.videoUrl ? (
                            <a
                              href={sub.videoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm text-blue-400 hover:underline mt-2 flex items-center gap-2"
                            >
                              <SlCamrecorder /> Watch Video
                            </a>
                          ) : (
                            <p className="text-sm text-gray-400 mt-2">Video not available</p>
                          )
                        ) : (
                          <p className="text-sm text-blue-700 mt-2 flex items-center gap-2">
                            <FaLock /> Buy to watch
                          </p>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <p className="italic text-gray-400">No subsections available.</p>
                  )}
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default CourseDetails;
