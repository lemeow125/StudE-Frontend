import { createSlice } from "@reduxjs/toolkit";

export const UserSlice = createSlice({
  name: "User",
  initialState: {
    user: {
      email: "",
      uid: "",
      username: "",
      first_name: "",
      last_name: "",
      full_name: "",
      year_level: "",
      semester: " ",
      course: "",
    },
  },
  reducers: {
    setUser: (state, action) => {
      state.user = {
        email: action.payload.email,
        uid: action.payload.uid,
        username: action.payload.username,
        first_name: action.payload.first_name,
        last_name: action.payload.last_name,
        full_name: action.payload.first_name + " " + action.payload.last_name,
        year_level: action.payload.year_level,
        semester: action.payload.semester,
        course: action.payload.course,
      };
    },
    clear: (state) => {
      state.user = {
        email: "",
        uid: "",
        username: "",
        first_name: "",
        last_name: "",
        full_name: "",
        year_level: "",
        semester: " ",
        course: "",
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser, clear } = UserSlice.actions;

export default UserSlice.reducer;
