import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "../slices/AuthSlice/AuthSlice";
import UserReducer from "../slices/UserSlice/UserSlice";

const store = configureStore({
  reducer: {
    auth: AuthReducer,
    user: UserReducer,
  },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
