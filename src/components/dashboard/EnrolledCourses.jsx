import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { apiconnector } from "../../services/apiConnector";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { setLoading } from "../../slices/courseSlice";
import AnimatedLoader from "../common/AnimatedLoader";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const EnrolledCourses = () => {
  const { token } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.course);
  const dispatch = useDispatch();
  const [enrolledCourses, setEnrolledCourses] = useState([]);

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
    } catch (error) {
      console.error("Failed to fetch enrolled courses:", error);
      toast.error("Failed to fetch enrolled courses");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (token) fetchEnrolledCourses();
  }, [token]);

  if (loading) return <AnimatedLoader />;

  return (
    <div className="text-white w-11/12 max-w-6xl mx-auto py-6">
      <h2 className="text-2xl font-bold mb-6">Enrolled Courses</h2>

      {(!enrolledCourses || enrolledCourses.length === 0) ? (
        <p className="text-center text-gray-400 text-lg">
          No Courses Enrolled
        </p>
      ) : (
        <div className="space-y-6">
          {enrolledCourses.map((course) => (
            <Link to={`/course/${course._id}`} key={course._id}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center mb-2 justify-between gap-4 bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition">
                {/* Thumbnail */}
                <div className="w-full sm:w-[200px] h-[120px]">
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-semibold">{course.courseName}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {course.courseDescription}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex flex-col items-end text-sm text-gray-300 gap-1 sm:gap-2">
                  <p>
                    <span className="font-medium">Duration:</span>{" "}
                    {course.duration}
                  </p>
                  <p>
                    <span className="font-medium text-yellow-400">
                      {course.progress}%
                    </span>{" "}
                    Completed
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;
