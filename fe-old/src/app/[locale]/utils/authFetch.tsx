import { authAxiosInstance } from "./axiosInstance";
import { AxiosResponse } from "axios";

export const authFetch = async (
  input: string,
  init?: {
    method?: string;
    headers?: Record<string, string>;
    body?: any;
  },
  onAuthError?: () => void
): Promise<AxiosResponse> => {
  try {
    const { method = "GET", headers = {}, body } = init || {};

    const response = await authAxiosInstance({
      url: input,
      method: method.toLowerCase() as any,
      headers,
      data: body,
    });

    return response;
  } catch (error: any) {
    if (error.response?.status === 401 && onAuthError) {
      onAuthError();
    }
    console.error("authFetch error:", error);
    throw error;
  }
};
