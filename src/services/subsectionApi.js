import { setLoading, setSubSection } from "../slices/courseSlice";
import { apiconnector } from "./apiConnector";
import toast from "react-hot-toast";
import { subSectionEndpoints } from "../services/apis";
const { CREATE_SUBSECTION_API, DELETE_SUBSECTION_API, UPDATE_SUBSECTION_API } =
  subSectionEndpoints;
export function createSubSection(formData, token) {
  return async (dispatch) => {
    try {
      // console.log("formdata", formData);
      dispatch(setLoading(true));
      const response = await apiconnector(
        "POST",
        CREATE_SUBSECTION_API,
        formData,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      if (!response.data.success) {
        throw new Error(
          response.data.message || "create subsection api failed"
        );
      }
      // console.log("create subsection response", response);
      dispatch(
        setSubSection({
          sectionId: response.data.updateSection._id,
          subsections: response.data.updateSection.subsection,
        })
      );
      toast.success("subsection created successfully");
    } catch (error) {
      toast.error(error.message || "Failed to create subsection");
      console.log("failed to create subsection", error);
    }
    dispatch(setLoading(false));
  };
}

export function deleteSubSection({ subSectionId, sectionId }, token) {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await apiconnector(
        "DELETE",
        DELETE_SUBSECTION_API,
        {
          subsectionId: subSectionId,
          sectionId: sectionId,
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );
      if (!response.data.success) {
        throw new Error(
          response.data.message || "delete subsection api failed"
        );
      }
      // console.log("delete subsection api response", response);
      dispatch(
        setSubSection({
          sectionId: response.data.updateSection._id,
          subsections: response.data.updateSection.subsection,
        })
      );
      toast.success("subsection deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete subsection");
      console.log("failed to delete subsection", error);
    }
    dispatch(setLoading(false));
  };
}

export function updateSubSection(formData, token) {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await apiconnector(
        "PUT",
        UPDATE_SUBSECTION_API,
        formData,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      if (!response.data.success) {
        throw new Error(
          response.data.message || "update subsection api failed"
        );
      }
      // console.log("update subsection response", response);
      dispatch(
        setSubSection({
          sectionId: response.data.updatedSection._id,
          subsections: response.data.updatedSection.subsection,
        })
      );
      toast.success("subsection updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update subsection");
      console.log("failed to update subsection", error);
    }
    dispatch(setLoading(false));
  };
}
