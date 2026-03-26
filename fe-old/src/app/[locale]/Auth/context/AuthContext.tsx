"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../stores/userStore";
import axiosInstance from "../../utils/axiosInstance";

export interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string,
    rememberMe: boolean,
    google?: boolean,
    accessToken?: string
  ) => Promise<{
    success: boolean;
    user?: string;
    errors?: Record<string, string | ReactNode>;
  }>;
  logout: () => void;
  register: (
    username: string,
    password: string,
    email: string,
    phone: string
  ) => Promise<{ success: boolean; errors?: Record<string, string> }>;
  forgotPassword: (
    email: string
  ) => Promise<{ success: boolean; errors?: Record<string, string> }>;
  changePassword: (
    newPassword: string,
    options?: {
      currentPassword?: string;
      email?: string;
      token?: string;
    }
  ) => Promise<{ success: boolean; errors?: Record<string, string> }>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => ({ success: false }),
  logout: () => {},
  register: async () => ({ success: false }),
  forgotPassword: async () => ({ success: false }),
  changePassword: async () => ({ success: false }),
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { setUser: setUserStore, checkUser } = useUserStore();
  const url_backend = process.env.NEXT_PUBLIC_URL_BACKEND;
  const router = useRouter();

  useEffect(() => {
    const initializeUser = async () => {
      const userFromStore = await checkUser();
      setUser(userFromStore);
      if (userFromStore) {
        await setUserStore(userFromStore);
      }
    };
    initializeUser();
  }, [checkUser, setUserStore]);

  const login = async (
    email: string,
    password: string,
    rememberMe: boolean,
    google?: boolean,
    accessToken?: string
  ): Promise<{
    success: boolean;
    user?: string;
    errors?: Record<string, string | React.ReactNode>;
  }> => {
    try {
      let res, data;

      if (google) {
        res = await fetch(`${url_backend}/auth/google-login`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: accessToken }),
        });
      } else {
        res = await fetch(`${url_backend}/auth/login`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
      }

      data = await res.json();

      if (!res.ok || data.status !== 0) {
        if (data.status === 3) {
          return {
            success: false,
            errors: {
              global: (
                <div className="text-center">
                  <span>
                    Tài khoản chưa được kích hoạt, vui lòng kiểm tra hộp thư.
                  </span>
                  <button
                    onClick={async () => {
                      const refresh = await fetch(
                        `${url_backend}/auth/refresh-access`,
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ email }),
                        }
                      );
                      const refreshRes = await refresh.json();
                      alert(
                        refreshRes.message || "Đã gửi yêu cầu gửi lại mail."
                      );
                    }}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
                  >
                    Gửi lại email kích hoạt
                  </button>
                </div>
              ),
            },
          };
        }

        const errorMessages: Record<number, string> = {
          1: "Tài khoản không tồn tại",
          2: "Thông tin tài khoản hoặc mật khẩu không chính xác",
          4: "Mật khẩu không đúng",
        };

        return {
          success: false,
          errors: {
            global:
              errorMessages[data.status] ||
              data.message ||
              "Đăng nhập thất bại",
          },
        };
      }

      if (rememberMe) {
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        sessionStorage.setItem("user", JSON.stringify(data.user));
      }

      setUser(data.user);
      setUserStore(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      return {
        success: false,
        errors: { global: "Lỗi kết nối máy chủ." },
      };
    }
  };

  const register = async (
    username: string,
    password: string,
    email: string,
    phone: string
  ): Promise<{ success: boolean; errors?: Record<string, string> }> => {
    if (password.length < 6) {
      return {
        success: false,
        errors: { password: "Mật khẩu phải ít nhất 6 ký tự." },
      };
    }

    try {
      const res = await fetch(`${url_backend}/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email, phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          errors: { global: data.message || "Đăng ký thất bại." },
        };
      }

      switch (data.status) {
        case 0:
          if (data.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);
            setUserStore(data.user);
          }
          return { success: true };

        case 1:
          return {
            success: false,
            errors: { global: data.message || "Tài khoản cần kích hoạt." },
          };

        case 2:
          return {
            success: false,
            errors: { email: data.message || "Email đã được sử dụng." },
          };

        default:
          return {
            success: false,
            errors: { global: "Lỗi không xác định. Vui lòng thử lại." },
          };
      }
    } catch (error) {
      return {
        success: false,
        errors: { global: "Không thể kết nối tới máy chủ." },
      };
    }
  };
  const logout = async () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    setUser(null);
    setUserStore(null);
    try {
      const response = await axiosInstance.post(`/auth/logout`, {});

      if (response.status !== 200) {
        throw new Error("Logout không thành công");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const forgotPassword = async (
    email: string
  ): Promise<{ success: boolean; errors?: Record<string, string> }> => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return {
        success: false,
        errors: { email: "Định dạng email không hợp lệ." },
      };
    }

    try {
      const checkResponse = await axiosInstance.get(
        `/account/check-email?email=${encodeURIComponent(email)}`
      );

      const forgotResponse = await axiosInstance.post(`/account/forgot`, {
        email,
      });

      const data = forgotResponse.data;
      if (!data.success) {
        return {
          success: false,
          errors: { global: "Không thể gửi yêu cầu quên mật khẩu." },
        };
      }

      return { success: true };
    } catch (error) {
      console.error("ForgotPassword error:", error);
      return {
        success: false,
        errors: { global: "Lỗi máy chủ, vui lòng thử lại sau." },
      };
    }
  };

  const changePassword = async (
    newPassword: string,
    options?: {
      email?: string;
      token?: string;
    }
  ): Promise<{ success: boolean; errors?: Record<string, string> }> => {
    const { email, token } = options || {};

    if (newPassword.length < 6) {
      return {
        success: false,
        errors: { newPassword: "Mật khẩu mới phải có ít nhất 6 ký tự." },
      };
    }

    if (email && token) {
      try {
        const response = await axiosInstance.post(
          `/account/reset-password-by-token`,
          { email, token, newPassword }
        );

        const data = response.data;

        if (!data.success) {
          return {
            success: false,
            errors: { global: data.message || "Đổi mật khẩu thất bại." },
          };
        }

        return { success: true };
      } catch (error) {
        return {
          success: false,
          errors: { global: "Lỗi máy chủ, vui lòng thử lại sau." },
        };
      }
    }

    if (!user) {
      return { success: false, errors: { global: "Bạn chưa đăng nhập." } };
    }

    try {
      const response = await axiosInstance.post(`/account/change-password`, {
        email: user.email,
        newPassword,
      });
      router.push("/pages/login");

      const data = response.data;

      if (!data.success) {
        return {
          success: false,
          errors: { global: data.message || "Đổi mật khẩu thất bại." },
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        errors: { global: "Lỗi máy chủ, vui lòng thử lại sau." },
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, forgotPassword, changePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}
