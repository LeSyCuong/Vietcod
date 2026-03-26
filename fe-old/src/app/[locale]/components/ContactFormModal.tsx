"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ButtonContact from "./ButtonContact";
import { useTranslations } from "next-intl";
import { useConfigStore } from "../stores/useConfigStore";

// Helpers
const getClientIP = async (): Promise<string | null> => {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    return data.ip;
  } catch {
    return null;
  }
};

const getDeviceInfo = () => navigator.userAgent;

type ContactFormModalProps = {
  visible: boolean;
  onClose: () => void;
};

const ContactFormModal = ({ visible, onClose }: ContactFormModalProps) => {
  const t = useTranslations("home");
  const phone = useConfigStore((s) => s.phone);
  const email = useConfigStore((s) => s.email);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    message: "",
  });

  const [user, setUser] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load user ID
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

  // Escape to close
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setShowSuccess(false);

    // Basic validation
    if (!form.email || !form.name || !form.message) {
      setErrorMessage("Vui lòng điền đầy đủ thông tin bắt buộc.");
      setIsLoading(false);
      return;
    }

    try {
      const ip = await getClientIP();
      const device = getDeviceInfo();

      const response = await fetch(
        process.env.NEXT_PUBLIC_URL_BACKEND + "/contact/send",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            type: "contact",
            user,
            ip,
            device,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || data.success === false) {
        const error = data?.message || "Gửi không thành công.";
        setErrorMessage(error);
        return;
      }

      setShowSuccess(true);
      setForm({ name: "", phone: "", email: "", service: "", message: "" });

      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 3000);
    } catch (err) {
      setErrorMessage("Lỗi hệ thống. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-49 "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -40 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="
    border border-blue-400 fixed z-50 top-1/2 left-1/2
    w-[95%] sm:w-[90%] md:w-[85%] lg:w-[75%] xl:max-w-5xl
    -translate-x-1/2 -translate-y-1/2
    bg-white rounded-3xl shadow-2xl
    p-[clamp(1rem,4vw,2.5rem)]
    max-h-[90vh] overflow-y-auto  scrollbar-hide
  "
          >
            <div className="flex flex-col md:flex-row gap-10">
              {/* LEFT */}
              <div className="md:w-1/2 space-y-5 text-center md:text-left">
                <h2
                  className="text-[clamp(1.5rem,2.5vw,2.8rem)] font-bold text-gray-900"
                  dangerouslySetInnerHTML={{
                    __html: t("ContactForm.h2") || "",
                  }}
                />
                <p
                  className="text-gray-700 text-[clamp(0.95rem,1.2vw,1.3rem)] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: t("ContactForm.p") || "" }}
                />
                <Image
                  src="/assets/images/logo.png"
                  alt="logo"
                  width={220}
                  height={80}
                  className="mx-auto md:mx-0 pt-2 object-contain"
                />
                <div className="flex flex-col gap-4 text-sm pt-2">
                  {/* hotline */}
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-7 h-7 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.6a1 1 0 01.97.757l1.125 4.5a1 1 0 01-.516 1.116l-2.222 1.11a11.042 11.042 0 005.292 5.292l1.11-2.222a1 1 0 011.116-.516l4.5 1.125a1 1 0 01.757.97V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">
                        {t("ContactForm.hotline")}
                      </p>
                      <a
                        href={`tel:${phone}`}
                        className="text-base font-medium text-gray-800"
                      >
                        {phone}
                      </a>
                    </div>
                  </div>
                  {/* email */}
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-7 h-7 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m0 8V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">
                        {t("ContactForm.email")}
                      </p>
                      <a
                        href={`mailto:${email}`}
                        className="text-base font-medium text-gray-800"
                      >
                        {email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* FORM */}
              <form
                onSubmit={handleSubmit}
                className="md:w-1/2 w-full space-y-4 text-black"
              >
                {["name", "phone", "email", "service"].map((field) => (
                  <input
                    key={field}
                    type="text"
                    name={field}
                    placeholder={t(`ContactForm.${field}`)}
                    value={form[field as keyof typeof form]}
                    onChange={handleChange}
                    className="
            w-full text-[clamp(0.9rem,1vw,1.15rem)]
            rounded-full border border-gray-300
            px-4 py-3 bg-white/80
            outline-none focus:ring-1 focus:ring-blue-400
            transition duration-300
          "
                    required
                  />
                ))}

                <textarea
                  name="message"
                  placeholder={t("ContactForm.message")}
                  value={form.message}
                  onChange={handleChange}
                  className="
          w-full rounded-xl border border-gray-300
          px-4 py-3 h-28 bg-white/90
          outline-none focus:ring-1 focus:ring-blue-400
          resize-none text-[clamp(0.9rem,1vw,1.1rem)]
        "
                  required
                />

                <div className="w-full">
                  <ButtonContact isLoading={isLoading} />
                </div>

                {showSuccess && (
                  <div className="mt-4 w-full rounded-lg bg-green-100 text-green-800 px-4 py-3 text-sm font-medium shadow-inner transition duration-300">
                    {t("ContactForm.thankyou")}
                  </div>
                )}

                {errorMessage && (
                  <div className="mt-4 w-full rounded-lg bg-red-100 text-red-800 px-4 py-3 text-sm font-medium shadow-inner transition duration-300">
                    {errorMessage}
                  </div>
                )}
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ContactFormModal;
