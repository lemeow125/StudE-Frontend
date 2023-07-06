import { configureStore } from "@reduxjs/toolkit";
import StatusReducer from "../slices/StatusSlice/StatusSlice";
import UserReducer from "../slices/UserSlice/UserSlice";

const store = configureStore({
  reducer: {
    status: StatusReducer,
    user: UserReducer,
  },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
