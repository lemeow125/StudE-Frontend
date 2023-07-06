import { createSlice } from "@reduxjs/toolkit";

export const AuthSlice = createSlice({
  name: "Auth",
  initialState: {
    creds: {
      logged_in: false,
    },
  },
  reducers: {
    login: (state) => {
      state.creds.logged_in = true;
    },
    logout: (state) => {
      state.creds.logged_in = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout } = AuthSlice.actions;

export default AuthSlice.reducer;
