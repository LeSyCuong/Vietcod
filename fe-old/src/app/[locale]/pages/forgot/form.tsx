"use client";

import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../Auth/context/AuthContext";
import { useRouter } from "next/navigation";
import LoginWithGoogle from "../../components/GoogleLogin";
import VantaNetScript from "../../components/VantaNetScript";
import Button from "../../components/Button";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function ForgotForm() {
  const router = useRouter();
  const { forgotPassword } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setErrors({});
    setSuccessMessage("");
    setLoading(true);

    try {
      const result = await forgotPassword(email);

      if (result.success) {
        setSuccessMessage("Gửi yêu cầu thành công. Vui lòng kiểm tra email.");
        setEmail("");
      } else {
        setErrors(result.errors || {});
      }
    } catch (err) {
      setErrors({
        global: "Không thể kết nối đến máy chủ. Vui lòng thử lại sau.",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
      <div className="min-h-screen flex items-center justify-center pl-5 pr-5 pt-20 pb-20">
        <form className="relative flex flex-col gap-3 p-5 w-[450px] rounded-2xl font-sans shadow-lg backdrop-blur-md bg-white/10 border border-white/20 overflow-visible">
          <h2 className="text-2xl font-bold text-center text-white mb-2">
            Quên mật khẩu
          </h2>

          <div className="flex flex-col py-2 gap-2">
            <label className="text-white font-semibold">Email</label>
            <div className="flex items-center border border-[#ecedec] rounded-xl h-12 pl-2 focus-within:border-[#2d79f3] transition">
              <input
                type="email"
                placeholder="Nhập email nhận mật khẩu mới"
                className="text-white ml-2 w-full h-full border-none focus:outline-none rounded-xl bg-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {errors.email && (
              <span className="text-red-400 text-sm mt-1">{errors.email}</span>
            )}
          </div>

          {errors.global && (
            <p className="text-red-500 text-sm text-center font-medium mt-2">
              {errors.global}
            </p>
          )}

          {successMessage && (
            <p className="text-green-500 text-sm text-center font-medium mt-2">
              {successMessage}
            </p>
          )}
          <Button
            svg={true}
            text="Nhận mật khẩu mới"
            onClick={handleSubmit}
            disabled={loading}
            width_PC="full"
            width_MB="full"
            style={{ fontSize: "15px" }}
            initialX_PC={180}
            initialX_MB={110}
          />

          <p className="text-center text-white text-sm">
            Chưa có tài khoản?
            <span
              className="ml-1 text-white font-medium cursor-pointer"
              onClick={() => router.push("/pages/register")}
            >
              Đăng ký
            </span>
          </p>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-white text-sm">
              Hoặc đăng nhập bằng
            </span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <LoginWithGoogle />
        </form>
      </div>
    </>
  );
}
