import { createSlice } from "@reduxjs/toolkit";

export const AuthSlice = createSlice({
  name: "Auth",
  initialState: {
    creds: {
      email: "",
      uid: "",
      username: "",
      full_name: "",
      refresh_token: "",
      access_token: "",
    },
  },
  reducers: {
    setToken: (state, action) => {
      state.creds.access_token = action.payload.access_token;
      state.creds.refresh_token = action.payload.refresh_token;
    },
    setUser: (state, action) => {
      state.creds = {
        email: action.payload.email,
        uid: action.payload.uid,
        username: action.payload.username,
        full_name: action.payload.full_name,
        access_token: action.payload.access_token,
        refresh_token: action.payload.refresh_token,
      };
    },
    clear: (state) => {
      state.creds = {
        email: "",
        uid: "",
        username: "",
        full_name: "",
        refresh_token: "",
        access_token: "",
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setToken, setUser, clear } = AuthSlice.actions;

export default AuthSlice.reducer;
