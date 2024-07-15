import { toast } from "react-toastify";
import ApiHelper from "../../utils/apiHelper";
import { userLogin, userSignup } from "../../types/user";

class AuthApiServices {
  static getInstance() {
    return new AuthApiServices();
  }

  userSignup = async (signupData: userSignup) => {
    try {
      const response = await ApiHelper.post("/user/signup", signupData);
      toast.success(response?.data?.message);
      return response?.data;
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      throw error;
    }
  };

  userLogin = async (loginData: userLogin) => {
    try {
      const response = await ApiHelper.post("/user/login", loginData);
      toast.success(response?.data?.message);
      return response?.data;
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      throw error;
    }
  };

  userInfo = async () => {
    try {
      const response = await ApiHelper.get("/user/get-user-info");
      return response?.data;
    } catch (error) {
      throw error;
    }
  };
}

export const authApiServices = AuthApiServices.getInstance();
