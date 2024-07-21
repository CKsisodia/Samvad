import axios, { AxiosInstance, AxiosResponse } from "axios";
import { jwtDecode } from "jwt-decode";

class ApiHelper {
  private static instance: ApiHelper;
  private client!: AxiosInstance;

  private constructor() {
    if (!ApiHelper.instance) {
      this.client = axios.create({
        baseURL: "http://localhost:3000",
        headers: {
          "Content-Type": "application/json",
        },
      });

      this.client.interceptors.request.use(
        (config: any) => {
          const accessToken = localStorage.getItem("accessToken");
          if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );

      this.client.interceptors.response.use(
        (response: AxiosResponse) => response,
        async (error) => {
          const originalRequest = error.config;

          if (error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;
            const newAccessToken = await this.refreshAccessToken();

            if (newAccessToken) {
              localStorage.setItem("accessToken", newAccessToken);
              this.client.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${newAccessToken}`;
              return this.client(originalRequest);
            }
          }
          return Promise.reject(error);
        }
      );

      ApiHelper.instance = this;
    }

    return ApiHelper.instance;
  }

  public static getInstance(): ApiHelper {
    if (!ApiHelper.instance) {
      ApiHelper.instance = new ApiHelper();
    }
    return ApiHelper.instance;
  }

  private async refreshAccessToken(): Promise<string> {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token available");
      }
      const decodedToken: { email: string } = jwtDecode(accessToken);
      const userEmail = decodedToken.email;

      const refreshToken = await this.getRefreshToken();

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await this.client.post<{
        data: { accessToken: string };
      }>("http://localhost:3000/auth/refresh", {
        refreshToken: refreshToken,
        email: userEmail,
      });

      return response.data.data.accessToken;
    } catch (error) {
      throw new Error("Failed to refresh access token");
    }
  }

  private getRefreshToken(): string {
    const name = "refreshToken=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  public get(url: string, params = {}): Promise<any> {
    return this.client.get(url, { params });
  }

  public post(url: string, data?: any): Promise<any> {
    return this.client.post(url, data);
  }

  public put(url: string, data: any): Promise<any> {
    return this.client.put(url, data);
  }

  public delete(url: string, data?: any): Promise<any> {
    return this.client.delete(url, { data });
  }
}

const instance = ApiHelper.getInstance();
Object.freeze(instance);

export default instance;
