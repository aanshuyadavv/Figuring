import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import TagsInput from "./TagsInput";
import CourseThumbnail from "./CourseThumbnail";
import RequirementField from "./RequirementField";

import { getCourseCatgories } from "../../../services/courseDetailsAPI";
import { apiconnector } from "../../../services/apiConnector";

import {
  setCourseData,
  setEditLecture,
  setLoading,
} from "../../../slices/courseSlice";
import { courseEndpoints } from "../../../services/apis";
import { setCurrStep } from "../../../slices/stepsSlice";

const { EDIT_COURSE_API, CREATE_COURSE_API } = courseEndpoints;

const CourseInformationForm = ({ course }) => {
  console.log("course info se", course);
  const dispatch = useDispatch();
  const courseCategories = useSelector(
    (state) => state.course.courseCategories
  );
  const courseData = useSelector((state) => state.course.courseData);
  const token = useSelector((state) => state.auth.token);
  const { editCourse } = useSelector((state) => state.course);
  // console.log("edit lecture info se", editCourse);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      courseName: course?.courseName || "",
      courseDescription: course?.courseDescription || "",
      price: course?.price || "",
      category: course?.category || "choose a category",
      whatYouWillLearn: course?.whatYouWillLearn || "",
      tags: course?.tags || [],
      requirements: course?.requirements || [],
    },
  });

  useEffect(() => {
    dispatch(getCourseCatgories());
  }, [dispatch]);

  useEffect(() => {
    if (editCourse && course) {
      setValue("courseName", course.courseName);
      setValue("courseDescription", course.courseDescription);
      setValue("price", course.price);
      setValue("category", course.category);
      setValue("whatYouWillLearn", course.whatYouWillLearn);
      setValue("tags", course.tags || []);
      setValue("requirements", course.requirements || []);
    }
  }, [editCourse, course, setValue]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("courseName", data.courseName);
      formData.append("courseDescription", data.courseDescription);
      formData.append("price", data.price);
      formData.append("category", data.category);
      formData.append("whatYouWillLearn", data.whatYouWillLearn);
      formData.append("tags", JSON.stringify(data.tags));
      formData.append("requirements", JSON.stringify(data.requirements));

      if (data.thumbnail?.[0]) {
        formData.append("thumbnail", data.thumbnail[0]);
      }

      if (editCourse) {
        formData.append("courseId", course?._id || courseData?._id);
      }

      // Debug formData content
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      dispatch(setLoading(true));

      const apiUrl = editCourse
        ? `${EDIT_COURSE_API}/${course?._id}`
        : CREATE_COURSE_API;
      const method = "POST";

      const response = await apiconnector(method, apiUrl, formData, {
        Authorization: `Bearer ${token}`,
      });

      const msg = editCourse
        ? "Failed to update course"
        : "Failed to create course";

      if (!response?.data?.success) {
        toast.error(response.data.message || msg);
        return;
      }
      console.log("response", response);
      dispatch(setCourseData(response.data.data));
      dispatch(setEditLecture(true));
      dispatch(setCurrStep(2));
      toast.success(
        editCourse
          ? "Course updated successfully!"
          : "Course created successfully!"
      );
    } catch (error) {
      console.error("Error submitting course:", error);
      toast.error(error.response?.data?.message ||"Something went wrong while submitting the course.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="text-white max-w-3xl w-full px-4 sm:px-6 py-6 mx-auto bg-gray-900 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Course Title */}
        <div>
          <label
            htmlFor="courseName"
            className="block text-sm font-medium mb-1"
          >
            Course Title
          </label>
          <input
            {...register("courseName", { required: true })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          {errors.courseName && (
            <span className="text-red-500 text-sm">
              Course name is required
            </span>
          )}
        </div>

        {/* Course Description */}
        <div>
          <label
            htmlFor="courseDescription"
            className="block text-sm font-medium mb-1"
          >
            Course Short Description
          </label>
          <textarea
            {...register("courseDescription", { required: true })}
            rows={3}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          {errors.courseDescription && (
            <span className="text-red-500 text-sm">
              Course description is required
            </span>
          )}
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-1">
            Course Price
          </label>
          <input
            type="number"
            {...register("price", { required: true })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          {errors.price && (
            <span className="text-red-500 text-sm">
              Course price is required
            </span>
          )}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">
            Choose a Category
          </label>
          <select
            {...register("category", { required: "Please choose a category" })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="" disabled>
              -- Choose a Category --
            </option>
            {courseCategories?.data?.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Tags */}
        <TagsInput register={register} errors={errors} setValue={setValue} />

        {/* Thumbnail Upload */}
        <CourseThumbnail register={register} errors={errors} />

        {/* Course Benefits */}
        <div>
          <label
            htmlFor="whatYouWillLearn"
            className="block text-sm font-medium mb-1"
          >
            Course Benefits
          </label>
          <textarea
            {...register("whatYouWillLearn", { required: true })}
            rows={3}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          {errors.whatYouWillLearn && (
            <span className="text-red-500 text-sm">
              Course benefits are required
            </span>
          )}
        </div>

        {/* Requirements */}
        <RequirementField
          register={register}
          errors={errors}
          setValue={setValue}
        />

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2 bg-yellow-500 text-black font-semibold rounded hover:bg-yellow-400 transition"
          >
            {editCourse ? "Update Course" : "Create Course"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseInformationForm;
