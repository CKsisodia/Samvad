import { createAsyncThunk } from "@reduxjs/toolkit";
import { authApiServices } from "../services/authService";
import { userLogin, userSignup } from "../../types/user";

export const userSignupAction = createAsyncThunk(
  "userSignupAction",
  async (signupData: userSignup) => {
    const response = await authApiServices.userSignup(signupData);
    return response;
  }
);

export const userLoginAction = createAsyncThunk(
  "userLoginAction",
  async (loginData: userLogin) => {
    const response = await authApiServices.userLogin(loginData);
    return response;
  }
);

export const getUserInfoAction = createAsyncThunk(
  "userInfoAction",
  async () => {
    const response = await authApiServices.userInfo();
    return response;
  }
);
