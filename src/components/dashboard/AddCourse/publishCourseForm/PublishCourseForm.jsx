import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrStep } from "../../../../slices/stepsSlice";
import { toast } from "react-hot-toast";
import { publishCourse } from "../../../../services/courseDetailsAPI";
import { useNavigate } from "react-router-dom";

const PublishCourseForm = () => {
  const [checked, setChecked] = useState(false);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { courseData } = useSelector((state) => state.course);
  const courseId = courseData?._id;
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    if (!checked) return toast.error("Please confirm to submit the course");
    if (!courseId || !token) return toast.error("Missing course or token");

    dispatch(publishCourse(courseId, navigate, token));
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 sm:p-8 bg-gray-900 text-white rounded-lg shadow-lg mt-6">
      <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6">
        Publish Course
      </h2>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Confirmation Checkbox */}
        <label
          htmlFor="checkbox"
          className="flex items-start gap-3 cursor-pointer group hover:scale-[1.01] transition-transform duration-200"
        >
          <input
            id="checkbox"
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-1 h-5 w-5 text-yellow-500 bg-gray-800 border-gray-600 rounded focus:ring-yellow-500 transition-all"
          />
          <span className="text-sm leading-relaxed text-gray-200">
            I confirm that the course content, structure, and media are complete
            and ready for publishing.
          </span>
        </label>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <button
            type="button"
            onClick={() => dispatch(setCurrStep(2))}
            className="w-full sm:w-auto px-4 py-2 border border-yellow-500 text-yellow-500 rounded-md hover:bg-yellow-500 hover:text-black transition-all"
          >
            Back
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 border border-yellow-500 text-yellow-500 rounded-md hover:bg-yellow-500 hover:text-black transition-all"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default PublishCourseForm;
