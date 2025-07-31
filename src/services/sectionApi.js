import toast from "react-hot-toast";
import { setLoading, setSection } from "../slices/courseSlice";
import { apiconnector } from "./apiConnector";
import { sectionEndpoints } from "../services/apis";

const { CREATE_SECTION_API, UPDATE_SECTION_API, DELETE_SECTION_API } =
  sectionEndpoints;

export function createNewSection({ sectionName, courseId }, token) {
  return async (dispatch) => {
    try {
      console.log(
        "aa gya create course api mein ",
        sectionName,
        courseId,
        token
      );
      dispatch(setLoading(true));

      const response = await apiconnector(
        "POST",
        CREATE_SECTION_API,
        { sectionName, courseId },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "create section api error");
      }

      // console.log(
      //   "create new section response",
      //   response.data.data.courseContent
      // );
      dispatch(setSection(response.data.data.courseContent));
    } catch (error) {
      toast.error(error.message || "Failed to create section");
      console.log("failed to create section", error);
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function deleteSection({ sectionId, courseId }, token) {
  return async (dispatch) => {
    try {
      // console.log("section id and course id", sectionId, courseId);
      dispatch(setLoading(true));
      const response = await apiconnector(
        "DELETE",
        DELETE_SECTION_API,
        { sectionId, courseId },
        {
          Authorization: `Bearer ${token}`,
        }
      );
      if (!response.data.success) {
        throw new Error("delete section api error", response.data.message);
      }

      // console.log(
      //   "delete section response",
      //   response.data.updatedCourse.courseContent
      // );
      dispatch(setSection(response.data.updatedCourse.courseContent));
      toast.success("Section deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete section");
      console.log("failed to delete section", error);
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function updateSection({ sectionName, sectionId, courseId }, token) {
  return async (dispatch) => {
    try {
      // console.log(
      //   "sectionName, sectionId, courseId",
      //   sectionName,
      //   sectionId,
      //   courseId
      // );
      dispatch(setLoading(true));

      const response = await apiconnector(
        "PUT",
        UPDATE_SECTION_API,
        { sectionName, sectionId, courseId },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Update section API error");
      }

      // console.log(
      //   "Updated courseContent from backend:",
      //   response.data.course.courseContent
      // );

      dispatch(setSection(response.data.course.courseContent));
      toast.success("Section updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update section");
      console.log("Failed to update section", error);
    } finally {
      dispatch(setLoading(false));
    }
  };
}
