const BASE_URL = process.env.REACT_APP_BASE_URL;

export const fetchCart = { FETCH_CART_API: BASE_URL + "/fetch/cart" };

export const categories = {
  CATEGORIES_URL: BASE_URL + "/course/getAllCategory",
  CATEGORIES_PAGE_DETAILS_API: BASE_URL + "/course/getCategoryPageDetails",
};
export const profileEndpoints = {
  SET_PROFILE_IMAGE_API: BASE_URL + "/profile/updateProfileImage",
  UPDATEPROFILE_API: BASE_URL + "/profile/updateProfile",
  DELETEPROFILE_API: BASE_URL + "/profile/delete/account",
  RESETPROFILEPASSWORD_API: BASE_URL + "/profile/reset/password",
  GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getUserEnrolledCourses",
};

export const userEndpoints = {
  SENDOTP_API: BASE_URL + "/send-otp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  RESETPASSWORDTOKEN_API: BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
};

export const courseEndpoints = {
  CREATE_COURSE_API: BASE_URL + "/course/createCourse",
  PUBLISH_COURSE_API: BASE_URL + "/course/publishCourse",
  GET_INSTRUCTOR_COURSES_API: BASE_URL + "/course/getInstructorCourses",
  DELETE_COURSE_API: BASE_URL + "/course/delete",
  EDIT_COURSE_API: BASE_URL + "/course/edit",
  GET_COURSE_DETAILS_API: BASE_URL + "/course/getCourseDetails",
};

export const sectionEndpoints = {
  CREATE_SECTION_API: BASE_URL + "/course/createSection",
  UPDATE_SECTION_API: BASE_URL + "/course/updateSection",
  DELETE_SECTION_API: BASE_URL + "/course/deleteSection",
};

export const subSectionEndpoints = {
  CREATE_SUBSECTION_API: BASE_URL + "/course/createSubSection",
  UPDATE_SUBSECTION_API: BASE_URL + "/course/updateSubSection",
  DELETE_SUBSECTION_API: BASE_URL + "/course/deleteSubSection",
};
