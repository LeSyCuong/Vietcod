"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import { AuthContext } from "../Auth/context/AuthContext";

const LoginWithGoogle = () => {
  const { login } = useContext(AuthContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const loginGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const accessToken = tokenResponse.access_token;

      const email = "";
      const rememberMe = true;
      const google = true;
      const password = "";

      const result = await login(
        email,
        password,
        rememberMe,
        google,
        accessToken
      );

      if (result.success) {
        setIsLoading(true);
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        console.error("Đăng nhập thất bại:", result.errors?.global);
      }
    },
    onError: (err) => {
      console.error("Đăng nhập Google thất bại:", err);
    },
  });

  return (
    <>
      <div className="flex flex-col gap-3 mt-2 cursor-pointer relative z-10">
        <span
          onClick={() => loginGoogle()}
          className="text-black btn border border-[#ededef] bg-white h-12 rounded-xl flex justify-center items-center font-medium gap-2 hover:border-[#2d79f3] transition"
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 533.5 544.3"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.4H272v95.3h147.4c-6.4 34.3-25.6 63.5-54.6 83.1v68.9h88.3c51.7-47.6 80.4-117.9 80.4-196.9z"
              fill="#4285F4"
            />
            <path
              d="M272 544.3c73.2 0 134.6-24.2 179.5-65.6l-88.3-68.9c-24.6 16.5-56.2 26.4-91.2 26.4-70 0-129.3-47.2-150.5-110.6H30.8v69.4c44.5 88.4 136 149.3 241.2 149.3z"
              fill="#34A853"
            />
            <path
              d="M121.5 325.6c-10.4-30.5-10.4-63.8 0-94.3V162H30.8c-42.4 84.8-42.4 184.5 0 269.3l90.7-69.7z"
              fill="#FBBC05"
            />
            <path
              d="M272 107.7c39.7 0 75.4 13.7 103.5 40.6l77.6-77.6C406.6 24.2 345.2 0 272 0 166.8 0 75.3 60.9 30.8 149.3l90.7 69.4c21.2-63.3 80.5-110.5 150.5-110.5z"
              fill="#EA4335"
            />
          </svg>
          Google
        </span>
      </div>

      {isLoading && (
        <div
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
    bg-white text-black rounded-[15px] px-6 py-4
    font-medium shadow-lg flex items-center gap-4 transition-all duration-300 ease-in-out
 text-center backdrop-blur-sm border border-gray-200"
          style={{ minWidth: "300px", borderRadius: "20px" }}
        >
          <div className="flex justify-center items-center p-5 text-gray-500 gap-2">
            <span className="animate-spin h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full" />
            <span className="text-sm">Đang đăng nhập...</span>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginWithGoogle;
