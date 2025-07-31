import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  enrolledCourses: [],
  lastPaymentId: null,
  paymentSuccess: false,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setPaymentLoading: (state, action) => {
      state.loading = action.payload;
    },
    setPaymentSuccess: (state, action) => {
      state.paymentSuccess = action.payload.success;
      state.lastPaymentId = action.payload.paymentId;
    },
    setEnrolledCourses: (state, action) => {
      state.enrolledCourses = action.payload;
    },
    setPaymentError: (state, action) => {
      state.error = action.payload;
    },
    clearPaymentState: (state) => {
      return initialState;
    },
  },
});

export const {
  setPaymentLoading,
  setPaymentSuccess,
  setEnrolledCourses,
  setPaymentError,
  clearPaymentState,
} = paymentSlice.actions;

export default paymentSlice.reducer;
