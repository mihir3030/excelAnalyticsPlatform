import { createSlice } from "@reduxjs/toolkit";

// this file is a slice file like store values of Data State and Function to update

// get user from localStorage
const user = JSON.parse(localStorage.getItem("user"));

// create initialState for auth
const initialState = {
  user: user || null,
  token: user?.token || null,
  loading: false,
  error: null,
};

// create slice
const authSlice = createSlice({
  name: "auth",
  initialState,

  //reducer is a function
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    //Success
    loginSuccess: (state, action) => {
      state.user = action.payload; // payload is data. here we save user data in state.user
      state.token = action.payload.token;
      state.loading = false;
      localStorage.setItem("user", JSON.stringify(action.payload)); //store user data in localStorage
    },

    // Failed
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    //logout
    logout: (state, action) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
    },

    // for update Profile
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },

    // Add these admin-specific actions
    adminLoginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    adminLoginSuccess: (state, action) => {
      state.user = action.payload;
      state.token = action.payload.token;
      state.loading = false;
      localStorage.setItem("admin", JSON.stringify(action.payload));
    },
    adminLoginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateProfile,
  adminLoginStart,
  adminLoginSuccess,
  adminLoginFailure
} = authSlice.actions;
export default authSlice.reducer;
