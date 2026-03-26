"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

const getClientIP = async () => {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch {
    return null;
  }
};

const getDeviceInfo = () => navigator.userAgent;

export default function Submit() {
  const t = useTranslations("footer.submit");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [errorCode, setErrorCode] = useState("");

  useEffect(() => {
    const checkUser = () => {
      const sessionUser = sessionStorage.getItem("user");
      const localUser = localStorage.getItem("user");

      const parsed = sessionUser || localUser;
      setUser(parsed ? JSON.parse(parsed).id : null);
    };

    checkUser();
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, []);

  const showMessage = (
    text: string,
    type: "success" | "error",
    code?: string
  ) => {
    setMessage(text);
    setMessageType(type);
    setErrorCode(code || "");

    setTimeout(() => {
      setMessage("");
      setMessageType("");
      setErrorCode("");
    }, 7000);
  };

  const getErrorMessage = (code: string, fallback: string): string => {
    try {
      return t(`error.${code}`);
    } catch {
      return fallback;
    }
  };

  const handleSubmit = async (): Promise<boolean> => {
    setMessage("");
    setMessageType("");
    setErrorCode("");

    if (!email) {
      showMessage(t("error.EMPTY_EMAIL"), "error", "EMPTY_EMAIL");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showMessage(
        t("error.INVALID_EMAIL_FORMAT"),
        "error",
        "INVALID_EMAIL_FORMAT"
      );
      return false;
    }

    setIsLoading(true);

    try {
      const ip = await getClientIP();
      const device = getDeviceInfo();

      const response = await fetch(
        process.env.NEXT_PUBLIC_URL_BACKEND + "/contact/send",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user, type: "submit", email, ip, device }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const code = data?.code || "UNKNOWN_ERROR";
        const message = getErrorMessage(
          code,
          data?.message || "Có lỗi xảy ra."
        );
        showMessage(message, "error", code);
        return false;
      }

      if (data.success === false) {
        const code = data.code || "UNKNOWN_ERROR";
        const message = getErrorMessage(code, data.message || "");
        showMessage(message, "error", code);
        return false;
      }

      showMessage(t("success"), "success", "SUCCESS");
      setEmail("");
      return true;
    } catch (error) {
      showMessage(
        getErrorMessage("SYSTEM_ERROR", "Có lỗi xảy ra!"),
        "error",
        "SYSTEM_ERROR"
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3 z-[1]">
      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("placeholder")}
          className="hover:white hover:ring-[0.5px] transition duration-400 w-full sm:basis-[70%] px-4 py-3 rounded-lg text-white placeholder-gray-150 border border-white focus:outline-none focus:ring-1 focus:ring-white focus:border-transparent text-base"
          disabled={isLoading}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="cursor-pointer w-full sm:basis-[30%] px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors duration-200 text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? t("button.loading") : t("button.default")}
        </button>
      </div>

      {message && (
        <div className="space-y-1">
          <div
            className={`text-sm font-medium transition-all duration-300 ${
              messageType === "success" ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </div>
        </div>
      )}
    </div>
  );
}
