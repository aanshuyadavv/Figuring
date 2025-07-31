import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchInstructorCourses,
  deleteTheCourse,
} from "../../../services/courseDetailsAPI";
import { useNavigate } from "react-router-dom";
import { setEditCourse } from "../../../slices/courseSlice";
import {
  MdModeEdit,
  MdDelete,
  MdOutlinePublishedWithChanges,
} from "react-icons/md";

const Courses = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { courses, loading } = useSelector((state) => state.course);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) dispatch(fetchInstructorCourses(token));
  }, [dispatch, token]);

  const clickHandler = (index) => {
    const selectedCourse = courses[index];
    if (!selectedCourse) return;
    const courseId = selectedCourse?._id;

    setConfirmationModal({
      title: "Confirm deletion",
      message: "Are you sure you want to delete this course?",
      onConfirm: () => {
        dispatch(deleteTheCourse(courseId, token));
        setConfirmationModal(null);
      },
      onCancel: () => setConfirmationModal(null),
    });
  };

  const editCourseHandler = (index) => {
    const course = courses?.[index];
    if (!course?._id) return;
    dispatch(setEditCourse(true));
    navigate(`/dashboard/course/edit/${course._id}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-3 text-gray-300">
        <div className="flex gap-2">
          <div className="w-4 h-4 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-gray-400 rounded-full animate-bounce delay-150"></div>
          <div className="w-4 h-4 bg-gray-400 rounded-full animate-bounce delay-300"></div>
        </div>
        <p className="text-sm">Loading your courses...</p>
      </div>
    );
  }

  return (
    <div className="text-white p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-4">Your Courses</h1>

      <div className="w-full overflow-x-auto">
        <table className="w-full border border-gray-700 rounded-md min-w-[600px] hidden lg:table">
          <thead>
            <tr className="bg-gray-800 text-sm uppercase text-left">
              <th className="p-3 border-b border-gray-600 w-1/2">Course</th>
              <th className="p-3 border-b border-gray-600 w-1/6">Duration</th>
              <th className="p-3 border-b border-gray-600 w-1/6">Price</th>
              <th className="p-3 border-b border-gray-600 w-1/6">Actions</th>
            </tr>
          </thead>

          <tbody>
            {courses?.length > 0 ? (
              courses.map((course, index) => (
                <tr
                  key={course._id}
                  className="hover:bg-gray-900 transition-all duration-200 align-top"
                >
                  <td className="p-4 border-b border-gray-700">
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                      <img
                        src={course.thumbnail}
                        alt="Thumbnail"
                        className="w-full sm:w-32 h-20 object-cover rounded-md shadow-md"
                      />
                      <div className="space-y-1 text-left">
                        <h2 className="font-semibold text-lg">
                          {course.courseName}
                        </h2>
                        <p className="text-sm text-gray-300 line-clamp-2">
                          {course.courseDescription}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(course.createdAt).toLocaleDateString()}
                        </p>
                        <p
                          className={`text-xs font-medium flex items-center gap-1 ${
                            course.status === "Published"
                              ? "text-green-400"
                              : "text-yellow-400"
                          }`}
                        >
                          <MdOutlinePublishedWithChanges className="text-lg" />
                          {course.status}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 border-b border-gray-700 text-sm text-gray-300 align-top">
                    60 mins
                  </td>
                  <td className="p-4 border-b border-gray-700 text-sm text-gray-300 align-top">
                    ₹{course.price}
                  </td>
                  <td className="p-4 border-b border-gray-700 text-sm align-top">
                    <div className="flex gap-4">
                      <button
                        onClick={() => editCourseHandler(index)}
                        className="text-blue-500 hover:text-blue-300"
                        title="Edit"
                      >
                        <MdModeEdit className="text-xl" />
                      </button>
                      <button
                        onClick={() => clickHandler(index)}
                        className="text-red-500 hover:text-red-300"
                        title="Delete"
                      >
                        <MdDelete className="text-xl" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-6 text-gray-400">
                  No courses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Mobile and tablet view */}
        <div className="lg:hidden flex flex-col gap-6">
          {courses?.length > 0 ? (
            courses.map((course, index) => (
              <div
                key={course._id}
                className="bg-gray-800 p-4 md:p-6 rounded-md shadow-md border border-gray-700"
              >
                <div className="flex flex-col gap-2">
                  <img
                    src={course.thumbnail}
                    alt="Thumbnail"
                    className="w-full h-40 object-cover rounded-md"
                  />
                  <h2 className="text-lg font-semibold">{course.courseName}</h2>
                  <p className="text-sm text-gray-300">
                    {course.courseDescription}
                  </p>
                  <p className="text-xs text-gray-400">
                    Created: {new Date(course.createdAt).toLocaleDateString()}
                  </p>
                  <p
                    className={`text-xs font-medium flex items-center gap-1 ${
                      course.status === "Published"
                        ? "text-green-400"
                        : "text-yellow-400"
                    }`}
                  >
                    <MdOutlinePublishedWithChanges className="text-lg" />
                    {course.status}
                  </p>
                  <p className="text-sm text-gray-300">Duration: 60 mins</p>
                  <p className="text-sm text-gray-300">
                    Price: ₹{course.price}
                  </p>
                  <div className="flex gap-4 mt-2">
                    <button
                      onClick={() => editCourseHandler(index)}
                      className="text-blue-500 hover:text-blue-300"
                    >
                      <MdModeEdit className="text-xl" />
                    </button>
                    <button
                      onClick={() => clickHandler(index)}
                      className="text-red-500 hover:text-red-300"
                    >
                      <MdDelete className="text-xl" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 py-6">No courses found.</p>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-sm mx-auto">
            <h2 className="text-xl font-semibold mb-4">
              {confirmationModal.title}
            </h2>
            <p className="mb-6">{confirmationModal.message}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={confirmationModal.onCancel}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmationModal.onConfirm}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;
