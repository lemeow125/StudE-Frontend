import { createSlice } from "@reduxjs/toolkit";

export const AuthSlice = createSlice({
  name: "Auth",
  initialState: {
    creds: {
      email: "",
      uid: "",
      username: "",
      full_name: "",
      logged_in: false,
    },
  },
  reducers: {
    login: (state) => {
      state.creds.logged_in = true;
    },
    setUser: (state, action) => {
      state.creds = {
        email: action.payload.email,
        uid: action.payload.uid,
        username: action.payload.username,
        full_name: action.payload.full_name,
        logged_in: true,
      };
    },
    clear: (state) => {
      state.creds = {
        email: "",
        uid: "",
        username: "",
        full_name: "",
        logged_in: false,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, setUser, clear } = AuthSlice.actions;

export default AuthSlice.reducer;
