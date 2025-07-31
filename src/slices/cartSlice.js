import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [],
    totalItems: localStorage.getItem("totalItems")
      ? JSON.parse(localStorage.getItem("totalItems"))
      : 0,
    totalAmount: localStorage.getItem("totalAmount")
      ? JSON.parse(localStorage.getItem("totalAmount"))
      : 0,
    cartLoading: false,
  },
  reducers: {
    addToCart(state, action) {
      const courses = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];

      courses.forEach((course) => {
        const courseId = course._id || course.courseId?._id;
        const exists = state.cart.find(
          (item) => (item._id || item.courseId?._id) === courseId
        );
        if (!exists) {
          state.cart.push(course);
          const price = Number(course.price || course.courseId?.price || 0);
          state.totalItems += 1;
          state.totalAmount += price;
        }
      });

      localStorage.setItem("cart", JSON.stringify(state.cart));
      localStorage.setItem("totalItems", JSON.stringify(state.totalItems));
      localStorage.setItem("totalAmount", JSON.stringify(state.totalAmount));
    },

    removeFromCart(state, action) {
      const courseIdToRemove = action.payload;
      const index = state.cart.findIndex(
        (item) =>
          item._id === courseIdToRemove ||
          item.courseId?._id === courseIdToRemove
      );

      if (index >= 0) {
        const removed = state.cart[index];
        const price = Number(removed.price || removed.courseId?.price || 0);
        state.cart.splice(index, 1);
        state.totalItems -= 1;
        state.totalAmount -= price;

        localStorage.setItem("cart", JSON.stringify(state.cart));
        localStorage.setItem("totalItems", JSON.stringify(state.totalItems));
        localStorage.setItem("totalAmount", JSON.stringify(state.totalAmount));
      }
    },

    resetCart(state) {
      state.cart = [];
      state.totalItems = 0;
      state.totalAmount = 0;
      localStorage.removeItem("cart");
      localStorage.removeItem("totalItems");
      localStorage.removeItem("totalAmount");
    },

    setCart(state, action) {
      state.cart = action.payload || [];
      state.totalItems = state.cart.length;
      state.totalAmount = state.cart.reduce((sum, item) => {
        const price = Number(item.price || item.courseId?.price || 0);
        return sum + (isNaN(price) ? 0 : price);
      }, 0);

      localStorage.setItem("cart", JSON.stringify(state.cart));
      localStorage.setItem("totalItems", JSON.stringify(state.totalItems));
      localStorage.setItem("totalAmount", JSON.stringify(state.totalAmount));
    },

    // Optional
    setCartLoading(state, action) {
      state.cartLoading = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  resetCart,
  setCart,
  setCartLoading,
} = cartSlice.actions;

export default cartSlice.reducer;
