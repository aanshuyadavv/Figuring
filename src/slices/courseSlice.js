import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  courseData: null,
  courseCategories: [],
  loading: false,
  section: [],
  subsection: {},
  editLecture: false,
  courses: [],
  editCourse: false,
  courseDetails: null,
};

const courseSlice = createSlice({
  name: "course",
  initialState: initialState,
  reducers: {
    setCourseCategories: (state, action) => {
      state.courseCategories = action.payload;
    },

    setCourseData: (state, action) => {
      state.courseData = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSection: (state, action) => {
      state.section = action.payload;
    },
    setEditLecture: (state, action) => {
      state.editLecture = action.payload;
    },
    setSubSection: (state, action) => {
      const { sectionId, subsections } = action.payload;
      state.subsection = {
        ...state.subsection,
        [sectionId]: subsections,
      };
    },
    setEditCourse: (state, action) => {
      state.editCourse = action.payload;
    },
    setCourses: (state, action) => {
      state.courses = action.payload;
    },
    setCourseDetails: (state, action) => {
      state.courseDetails = action.payload;
    },
    resetCourseState: () => initialState,
  },
});

export const {
  setCourseCategories,
  setLoading,
  setCourseData,
  setSection,
  setSubSection,
  setEditLecture,
  resetCourseState,
  setCourses,
  setEditCourse,
  setCourseDetails,
} = courseSlice.actions;

export default courseSlice.reducer;
