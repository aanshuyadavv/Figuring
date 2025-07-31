const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  currStep: 1,
  categoryCourses: [],
  otherCourses: [],
  topCourses: [],
};

const stepsSlice = createSlice({
  name: "steps",
  initialState,
  reducers: {
    setCurrStep(state, action) {
      state.currStep = action.payload;
    },
    setTopCourses(state, action) {
      state.topCourses = action.payload;
    },
    setOtherCourses(state, action) {
      state.otherCourses = action.payload;
    },
    setCategoryCourses(state, action) {
      state.categoryCourses = action.payload;
    },
    resetCurrStep: () => initialState,
  },
});

export const {
  setCurrStep,
  resetCurrStep,
  setTopCourses,
  setOtherCourses,
  setCategoryCourses,
} = stepsSlice.actions;
export default stepsSlice.reducer;
