import { createSlice } from "@reduxjs/toolkit";

export const AuthSlice = createSlice({
  name: "Auth",
  initialState: {
    creds: {
      email: "",
      uid: "",
      username: "",
      full_name: "",
      token: "",
    },
  },
  reducers: {
    setToken: (state, action) => {
      state.creds.token = action.payload;
    },
    setUser: (state, action) => {
      state.creds = {
        email: action.payload.email,
        uid: action.payload.uid,
        username: action.payload.username,
        full_name: action.payload.full_name,
        token: action.payload.token,
      };
    },
    clear: (state) => {
      state.creds = {
        email: "",
        uid: "",
        username: "",
        full_name: "",
        token: "",
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setToken, setUser, clear } = AuthSlice.actions;

export default AuthSlice.reducer;
