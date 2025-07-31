import EnrolledCourses from "../components/dashboard/EnrolledCourses";

const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  image: localStorage.getItem("image")
    ? JSON.parse(localStorage.getItem("image"))
    : null,
  loading: false,
  enrolledCourses: []
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setImage(state, action) {
      state.image = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setEnrolledCourses(state, action) {
      state.EnrolledCourses = action.payload;
    },
  },
});

export const { setUser, setImage, setLoading, setEnrolledCourses } = profileSlice.actions;
export default profileSlice.reducer;
