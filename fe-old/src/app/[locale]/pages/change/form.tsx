"use client";

import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../Auth/context/AuthContext";
import { useRouter } from "next/navigation";
import VantaNetScript from "../../components/VantaNetScript";
import Button from "../../components/Button";
import { useUserStore } from "../../stores/userStore";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function ChangeForm() {
  const router = useRouter();
  const { changePassword } = useContext(AuthContext);
  const { user, checkUser, hasFetchedUser } = useUserStore();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(false);

  const [emailParam, setEmailParam] = useState<string | null>(null);
  const [tokenParam, setTokenParam] = useState<string | null>(null);

  const url_backend = process.env.NEXT_PUBLIC_URL_BACKEND;

  useEffect(() => {
    checkUser();
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, [checkUser]);

  useEffect(() => {
    if (!hasFetchedUser) return;

    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");
    const token = params.get("token");

    setEmailParam(email);
    setTokenParam(token);

    if (email && token) {
      fetch(`${url_backend}/account/find-by-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.email === email) {
            setIsTokenValid(true);
          } else if (!user) {
            router.push("/pages/login");
          }
        })
        .catch(() => {
          if (!user) router.push("/pages/login");
        });
    } else if (!user) {
      router.push("/pages/login");
    }
  }, [user, hasFetchedUser, router, url_backend]);

  const handleSubmit = async () => {
    setErrors({});
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Mật khẩu mới không khớp.",
      }));
      return;
    }

    let result;

    if (isTokenValid && emailParam && tokenParam) {
      result = await changePassword(newPassword, {
        email: emailParam,
        token: tokenParam,
      });
    } else {
      result = await changePassword(newPassword, {
        currentPassword: oldPassword,
      });
    }

    if (result.success) {
      setSuccess("Đổi mật khẩu thành công.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setErrors(result.errors || {});
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
            Đổi mật khẩu
          </h2>

          {!isTokenValid && (
            <div className="flex flex-col">
              <label className="text-white font-semibold">Mật khẩu cũ</label>
              <div className="flex items-center border border-[#ecedec] rounded-xl h-12 pl-2 focus-within:border-[#2d79f3] transition">
                <input
                  type="password"
                  placeholder="Nhập mật khẩu cũ"
                  className="text-white ml-2 w-full h-full border-none focus:outline-none rounded-xl"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>
              {errors.currentPassword && (
                <p className="text-red-500 text-sm">{errors.currentPassword}</p>
              )}
            </div>
          )}

          <div className="flex flex-col">
            <label className="text-white font-semibold">Mật khẩu mới</label>
            <div className="flex items-center border border-[#ecedec] rounded-xl h-12 pl-2 focus-within:border-[#2d79f3] transition">
              <input
                type="password"
                placeholder="Nhập mật khẩu mới"
                className="text-white ml-2 w-full h-full border-none focus:outline-none rounded-xl"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-sm">{errors.newPassword}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-white font-semibold">
              Nhập lại mật khẩu mới
            </label>
            <div className="flex items-center border border-[#ecedec] rounded-xl h-12 pl-2 focus-within:border-[#2d79f3] transition">
              <input
                type="password"
                placeholder="Xác nhận mật khẩu mới"
                className="text-white ml-2 w-full h-full border-none focus:outline-none rounded-xl"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>

          {errors.global && (
            <p className="text-red-500 text-sm text-center font-medium mt-1">
              {errors.global}
            </p>
          )}
          {success && (
            <p className="text-green-500 text-sm text-center font-medium">
              {success}
            </p>
          )}
          <Button
            svg={true}
            text="Đổi mật khẩu"
            onClick={handleSubmit}
            style={{ fontSize: "15px" }}
            width_PC="full"
            width_MB="full"
            initialX_PC={180}
            initialX_MB={110}
          />
        </form>
      </div>
    </>
  );
}
