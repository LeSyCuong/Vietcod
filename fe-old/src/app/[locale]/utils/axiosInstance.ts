import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { getCookie } from "cookies-next";

const BASE_URL = process.env.NEXT_PUBLIC_URL_BACKEND;

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authAxiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

authAxiosInstance.interceptors.request.use(
  (config) => {
    const csrfToken = (getCookie("csrf_token") as string) ?? "";
    if (csrfToken) {
      config.headers["x-csrf-token"] = csrfToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

authAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const csrfToken = (getCookie("csrf_token") as string) ?? "";
        await axiosInstance.post(
          "/auth/refresh-token",
          {},
          {
            headers: {
              "x-csrf-token": csrfToken,
            },
            withCredentials: true,
          }
        );

        const newCsrfToken = (getCookie("csrf_token") as string) ?? "";
        originalRequest.headers["x-csrf-token"] = newCsrfToken;
        return authAxiosInstance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authFetch = async (
  url: string,
  options?: {
    method?: string;
    headers?: Record<string, string>;
    body?: unknown;
    onAuthError?: () => void;
  }
): Promise<AxiosResponse> => {
  try {
    const { method = "GET", headers = {}, body } = options || {};

    const config: AxiosRequestConfig = {
      method: method.toLowerCase() as
        | "get"
        | "post"
        | "put"
        | "delete"
        | "patch",
      url,
      headers,
      data: body,
    };

    return await authAxiosInstance(config);
  } catch (error: unknown) {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 401 && options?.onAuthError) {
        options.onAuthError();
      }
    }
    throw error;
  }
};

export default axiosInstance;
