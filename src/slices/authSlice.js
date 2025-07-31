import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signupData: (() => {
    const signUpData = localStorage.getItem("signupData");
    try {
      return signUpData ? JSON.parse(signUpData) : null;
    } catch {
      return null;
    }
  })(),
  loading: false,
  token: localStorage.getItem("token") || null,
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
      localStorage.setItem("token", action.payload); 
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setSignupData(state, action) {
      state.signupData = action.payload;
      localStorage.setItem("signupData", JSON.stringify(action.payload)); // Optional
    },
  },
});

export const { setToken, setLoading, setSignupData } = AuthSlice.actions;
export default AuthSlice.reducer;
