import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "../slices/AuthSlice/AuthSlice";

const store = configureStore({
  reducer: {
    auth: AuthReducer,
  },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
