import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import cartReducer from "../slices/cartSlice";
import profileReducer from "../slices/profileeSlice"
import courseReducer from "../slices/courseSlice"
import stepsReducer from "../slices/stepsSlice";
import paymentReducer from "../slices/paymentSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  profile: profileReducer,
  course : courseReducer,
  steps : stepsReducer,
  payment: paymentReducer,

});
