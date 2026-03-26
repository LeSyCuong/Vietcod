"use client";

import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../Auth/context/AuthContext";
import { useRouter } from "next/navigation";
import LoginWithGoogle from "../../components/GoogleLogin";
import VantaNetScript from "../../components/VantaNetScript";
import Button from "../../components/Button";
import { useUserStore } from "../../stores/userStore";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function Loginform() {
  const { login } = useContext(AuthContext);
  const { user, checkUser, hasFetchedUser, isFetching } = useUserStore();
  const router = useRouter();

  const [rememberMe, setRememberMe] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, React.ReactNode>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!hasFetchedUser) {
      checkUser();
      window.addEventListener("storage", checkUser);
      return () => window.removeEventListener("storage", checkUser);
    }
  }, [checkUser, hasFetchedUser]);

  useEffect(() => {
    if (hasFetchedUser && !isFetching && user) {
      router.push("/");
    }
  }, [user, router, hasFetchedUser, isFetching]);

  const handleSubmit = async () => {
    setErrors({});
    setIsLoading(true);

    const result = await login(email, password, rememberMe);

    if (result.success) {
      const prevUrl = document.referrer;
      const currentHost = window.location.host;

      if (prevUrl && prevUrl.includes(currentHost)) {
        router.push(prevUrl);
      } else {
        router.push("/");
      }
    } else {
      setErrors(result.errors || {});
    }

    setIsLoading(false);
  };

  const LoadingBox = ({ text }: { text: string }) => (
    <div
      className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
        bg-white text-black rounded-[15px] px-6 py-4
        font-medium shadow-lg flex items-center gap-4 transition-all duration-300 ease-in-out
        text-center backdrop-blur-sm border border-gray-200 z-50"
      style={{ minWidth: "300px", borderRadius: "20px" }}
    >
      <div className="flex justify-center items-center p-5 text-gray-500 gap-2">
        <span className="animate-spin h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full" />
        <span className="text-sm">{text}</span>
      </div>
    </div>
  );

  if (!hasFetchedUser || isFetching) {
    return <LoadingBox text="Đang kiểm tra đăng nhập..." />;
  }

  if (user) {
    return <LoadingBox text="Đang chuyển hướng..." />;
  }

  return (
    <>
      <VantaNetScript />
      <button
        onClick={() => router.push("/")}
        className="cursor-pointer absolute top-8 left-5 md:left-20 text-white flex items-center gap-2 text-sm font-medium hover:text-blue-300 transition z-50"
      >
        <i className="fas fa-arrow-left"></i>
        Trang chủ
      </button>
      <div className="min-h-screen flex items-center justify-center px-5">
        <form className="relative flex flex-col gap-5 my-20 p-5 w-[450px] rounded-2xl font-sans shadow-lg backdrop-blur-md bg-white/10 border border-white/20 overflow-visible">
          <h2 className="text-2xl font-bold text-center text-white mb-2">
            Đăng nhập
          </h2>

          <div className="flex flex-col gap-2">
            <label className="text-white font-semibold">Tên email</label>
            <div className="flex items-center border border-[#ecedec] rounded-xl h-12 pl-2 focus-within:border-[#2d79f3] transition">
              <input
                type="text"
                placeholder="Nhập email"
                className="text-white ml-2 w-full h-full border-none focus:outline-none rounded-xl bg-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errors.email && (
              <span className="text-red-400 text-sm mt-1">{errors.email}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-white font-semibold">Mật khẩu</label>
            <div className="flex items-center border border-[#ecedec] rounded-xl h-12 pl-2 focus-within:border-[#2d79f3] transition">
              <input
                type="password"
                placeholder="Nhập mật khẩu"
                className="text-white ml-2 w-full h-full border-none focus:outline-none rounded-xl bg-transparent"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errors.password && (
              <span className="text-red-400 text-sm mt-1">
                {errors.password}
              </span>
            )}
          </div>

          <div className="flex justify-end mb-2 gap-2">
            <span
              className="text-sm text-white font-medium cursor-pointer"
              onClick={() => router.push("/pages/forgot")}
            >
              Quên mật khẩu?
            </span>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label className="text-white font-normal">Ghi nhớ tôi</label>
          </div>

          {errors.global && (
            <div className="text-red-500 text-sm text-center font-medium mt-1">
              {errors.global}
            </div>
          )}

          <Button
            svg={true}
            text="Đăng nhập"
            disabled={isLoading}
            onClick={() => handleSubmit()}
            style={{ fontSize: "15px" }}
            width_PC="full"
            width_MB="full"
            initialX_PC={180}
            initialX_MB={110}
          />

          {isLoading && <LoadingBox text="Đang đăng nhập..." />}

          <p className="text-center text-white text-sm">
            Chưa có tài khoản?
            <span
              className="ml-1 text-white font-medium cursor-pointer"
              onClick={() => router.push("/pages/register")}
            >
              Đăng ký
            </span>
          </p>

          <p className="text-center text-white text-sm border-t pt-2 mt-2">
            Hoặc đăng nhập bằng
          </p>
          <LoginWithGoogle />
        </form>
      </div>
    </>
  );
}
