import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./reducers/authSlice";
import chatSlice from "./reducers/chatSlice";
export const store = configureStore({
  reducer: {
    user: userSlice,
    chats: chatSlice,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
