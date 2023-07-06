import { createSlice } from "@reduxjs/toolkit";

export const StatusSlice = createSlice({
  name: "Status",
  initialState: {
    logged_in: false,
    onboarding: false,
  },
  reducers: {
    login: (state) => {
      state.logged_in = true;
    },
    logout: (state) => {
      state.logged_in = false;
    },
    setOnboarding: (state) => {
      state.onboarding = true;
    },
    unsetOnboarding: (state) => {
      state.onboarding = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout, setOnboarding, unsetOnboarding } =
  StatusSlice.actions;

export default StatusSlice.reducer;
