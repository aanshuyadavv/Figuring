import { apiconnector } from "./apiConnector";
import {
  setCourseData,
  setCourseDetails,
  setCourses,
} from "../slices/courseSlice";
import { categories } from "./apis";
import { setCourseCategories } from "../slices/courseSlice";
import { courseEndpoints } from "./apis";
import toast from "react-hot-toast";
import { setLoading } from "../slices/courseSlice";
import { resetCourseState } from "../slices/courseSlice";
import { resetCurrStep } from "../slices/stepsSlice";
const { CATEGORIES_URL } = categories;
const {
  PUBLISH_COURSE_API,
  GET_INSTRUCTOR_COURSES_API,
  DELETE_COURSE_API,
  GET_COURSE_DETAILS_API,
} = courseEndpoints;

export function getCourseCatgories() {
  return async (dispatch) => {
    try {
      const response = await apiconnector("GET", CATEGORIES_URL);
      if (!response.data.success) {
        return console.log("error in fetching categories");
      }
      //   response.data.map((categoryName))
      //   console.log("response of course categories api", response.data)
      dispatch(setCourseCategories(response.data));
      toast.success("Categories fetched successfully");
    } catch (error) {
      console.log("error in fetching categories", error);
      toast.error(error.message);
    }
  };
}

export function publishCourse(courseId, navigate, token) {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));

      const response = await apiconnector(
        "POST",
        PUBLISH_COURSE_API,
        { courseId },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Publish course API error");
      }

      console.log("response from publish course api", response);
      dispatch(setCourseData(response.data.course));
      toast.success("Course published successfully");
      dispatch(resetCourseState());
      dispatch(resetCurrStep());
      navigate("/dashboard/my-courses");
    } catch (error) {
      toast.error(error.message || "Failed to publish course");
      console.log("failed to publish course", error);
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function fetchInstructorCourses(token) {
  return async (dispatch) => {
    try {
      console.log("token in fetch instructor courses", token);
      dispatch(setLoading(true));
      const response = await apiconnector(
        "GET",
        GET_INSTRUCTOR_COURSES_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch courses");
      }
      // console.log("response from instructor courses api", response.data.data);
      dispatch(setCourses(response.data.data));
      toast.success("Courses fetched successfully");
    } catch (error) {
      toast.error(error.message || "Failed to fetch courses");
      console.log("error in fetching courses", error);
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function deleteTheCourse(courseId, token) {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));

      const response = await apiconnector(
        "DELETE",
        DELETE_COURSE_API,
        { courseId },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "delete course api error");
      }

      console.log("response from delete course api", response);
      dispatch(setCourses(response.data.updatedUser.courses));
      toast.success("Course deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete course");
      console.error("Error deleting course:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };
}
export function getCourseDetails(courseId, token) {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await apiconnector(
        "POST",
        GET_COURSE_DETAILS_API,
        { courseId },
        {
          Authorization: `Bearer ${token}`,
        }
      );
      if (!response.data.success) {
        throw new Error("GET_COURSE_DETAILS_API error");
      }
      // console.log("response from get course details api", response.data.course);
      dispatch(setCourseDetails(response.data.course));
      toast.success("Course details fetched successfully");
    } catch (error) {
      console.log("error in getting course details", error);
      toast.error(error.message || "Failed to get course details");
    } finally {
      dispatch(setLoading(false));
    }
  };
}
