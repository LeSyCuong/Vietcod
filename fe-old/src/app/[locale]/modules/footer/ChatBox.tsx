"use client";

import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { FaCommentDots } from "react-icons/fa";
import { ChevronRight } from "lucide-react";
import { FaEnvelope, FaPhone } from "react-icons/fa";
import { EventSourcePolyfill } from "event-source-polyfill";

const icons = [
  {
    id: "zalo",
    el: (
      <span className="font-bold sm:text-sm md:text-md lg:text-lg xl:text-xl 2xl:text-2xl">
        Zalo
      </span>
    ),
    color: "text-blue-500",
  },
  {
    id: "email",
    el: (
      <FaEnvelope
        className="w-6 h-6 sm:w-7 sm:h-7 md:w-[2.2vw] md:h-[2.2vw] 2xl:w-[2vw] 2xl:h-[2vw]"
        size={20}
      />
    ),
    color: "text-blue-500",
  },
  {
    id: "phone",
    el: (
      <FaPhone
        className="w-6 h-6 sm:w-7 sm:h-7 md:w-[2.2vw] md:h-[2.2vw] 2xl:w-[2vw] 2xl:h-[2vw]"
        size={20}
      />
    ),
    color: "text-green-500",
  },
];

export default function ChatBox() {
  const t = useTranslations("footer.chatbot");
  const [messages, setMessages] = useState<{ role: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const link_img = "/uploads/images/logo.png";
  const [userId, setUserId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const url_backend = process.env.NEXT_PUBLIC_URL_BACKEND;
  const [isSending, setIsSending] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % icons.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = icons[index];

  const scrollToBottom = () => {
    const container = messagesEndRef.current?.parentElement;
    if (!container) return;

    const target = container.scrollHeight;
    const start = container.scrollTop;
    const distance = target - start;
    const duration = 600;
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      container.scrollTop = start + distance * easeInOutQuad(progress);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    const easeInOutQuad = (t: number) =>
      t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    requestAnimationFrame(animateScroll);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUserId(parsedUser.id);
        } catch (error) {
          console.error("Lỗi parse user:", error);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.id) {
            setUserId(parsedUser.id);
            return;
          }
        } catch (error) {
          console.error("Lỗi parse user:", error);
        }
      }

      const randomIntId = Math.floor(Math.random() * 9000000) + 1000000;
      const newUser = { id: randomIntId };
      localStorage.setItem("user", JSON.stringify(newUser));
      setUserId(randomIntId);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowButtons(window.scrollY > 150);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || !userId || isSending) return;

    setIsSending(true);
    const currentInput = input;
    setMessages((prev) => [...prev, { role: "user", text: currentInput }]);
    setInput("");
    setLoading(true);

    try {
      const eventSource = new EventSource(
        `${url_backend}/chatbot/stream?userId=${userId}&message=${encodeURIComponent(
          currentInput
        )}`
      );

      let botReply = "";
      let firstChunkReceived = false;

      eventSource.onmessage = (event: MessageEvent) => {
        if (!event.data) return;
        botReply += event.data;

        setMessages((prev) => {
          const copy = [...prev];
          if (copy[copy.length - 1]?.role === "bot") {
            copy[copy.length - 1].text = botReply;
          } else {
            copy.push({ role: "bot", text: botReply });
          }
          return copy;
        });

        if (!firstChunkReceived) {
          firstChunkReceived = true;
          setLoading(false);
        }
      };

      eventSource.addEventListener("done", () => {
        setLoading(false);
        setIsSending(false);
        eventSource.close();
      });

      eventSource.addEventListener("error", () => {
        setMessages((prev) => [
          ...prev,
          { role: "bot", text: "Lỗi khi kết nối đến chatbot." },
        ]);
        setLoading(false);
        setIsSending(false);
        eventSource.close();
      });
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Lỗi khi gửi tin nhắn." },
      ]);
      setLoading(false);
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const defaultBotMessages = [t("1"), t("2"), t("3")];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div
        ref={wrapperRef}
        className={`fixed right-6 z-50 top-1/2 -translate-y-1/2 transition-all duration-500 ease-in-out 
          ${
            showButtons
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-10 pointer-events-none"
          }`}
      >
        <div className="relative ">
          {" "}
          <span className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping pointer-events-none"></span>
          {/* Nút chính */}
          <button
            onClick={() => setOpen(!open)}
            className={`w-14 h-14 sm:w-14 sm:h-14 md:w-[4.3vw] md:h-[4.3vw] 2xl:w-[4.3vw] 2xl:h-[4.3vw] cursor-pointer rounded-full bg-white border-1  border-blue-500 shadow-xl flex items-center justify-center hover:scale-110 transition-all duration-500`}
          >
            {open ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 sm:w-7 sm:h-7 md:w-[2.2vw] md:h-[2.2vw] 2xl:w-[2vw] 2xl:h-[2vw] text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </svg>
            ) : (
              <span className={`transition-colors ${current.color}`}>
                {current.el}
              </span>
            )}
          </button>
          <a
            href="https://zalo.me/0865811722"
            target="_blank"
            className={`w-14 h-14 sm:w-14 sm:h-14 md:w-[4.3vw] md:h-[4.3vw] 2xl:w-[4.3vw] 2xl:h-[4.3vw] absolute top-1/2 left-1/2  rounded-full flex bg-white items-center justify-center text-blue-600 border border-blue-600 shadow-lg transition-all duration-500 ${
              open
                ? "translate-x-[-100px] translate-y-[-100px] 2xl:translate-x-[-150px] 2xl:translate-y-[-140px] opacity-100"
                : "translate-x-[-25px] translate-y-[-25px] opacity-0 pointer-events-none"
            }`}
          >
            <span className="font-bold sm:text-sm md:text-md lg:text-lg xl:text-xl 2xl:text-2xl">
              Zalo
            </span>
          </a>
          <a
            href="mailto:vinaelastic@gmail.com"
            className={`p-4 md:p-[1vw] absolute top-1/2 left-1/2  rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg transition-all duration-500 delay-100 ${
              open
                ? "translate-x-[-120px] 2xl:translate-x-[-190px] translate-y-[-28px] 2xl:translate-y-[-40px] translate-y-0 opacity-100"
                : "translate-x-[-25px] translate-y-[-25px] opacity-0 pointer-events-none"
            }`}
          >
            <FaEnvelope
              className="w-6 h-6 sm:w-7 sm:h-7 md:w-[2.2vw] md:h-[2.2vw] 2xl:w-[2vw] 2xl:h-[2vw]"
              size={20}
            />
          </a>
          <a
            href="tel:0865811722"
            className={`p-4 md:p-[1vw] absolute top-1/2 left-1/2 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg transition-all duration-500 delay-200 ${
              open
                ? "translate-x-[-100px] translate-y-[45px] 2xl:translate-x-[-150px] 2xl:translate-y-[60px] opacity-100"
                : "translate-x-[-25px] translate-y-[-25px] opacity-0 pointer-events-none"
            }`}
          >
            <FaPhone
              className="w-6 h-6 sm:w-7 sm:h-7 md:w-[2.2vw] md:h-[2.2vw] 2xl:w-[2vw] 2xl:h-[2vw]"
              size={20}
            />
          </a>
        </div>
      </div>
      <button
        onClick={scrollToTop}
        className={`cursor-pointer border border-white fixed bottom-23 2xl:bottom-[13vh] right-6 z-40 p-4 md:p-[1vw] rounded-full shadow-xl transition-all duration-500 ease-in-out bg-gradient-to-tr from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 hover:scale-110 hover:shadow-2xl ${
          showButtons
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-10 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 md:w-[2.2vw] md:h-[2.2vw] 2xl:w-[2vw] 2xl:h-[2vw] text-white drop-shadow-lg rotate-[-90deg]" />
      </button>
      {!isOpen && (
        <div
          className={`fixed bottom-5 right-6 z-40 cursor-pointer transition-all duration-500 ease-in-out ${
            showButtons
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-10 pointer-events-none"
          }`}
          onClick={() => {
            setIsOpen(true);
            setMessages((prev) =>
              prev.length === 0
                ? defaultBotMessages.map((msg) => ({ role: "bot", text: msg }))
                : prev
            );
          }}
        >
          <button
            className="cursor-pointer bg-gradient-to-r from-blue-800 via-blue-500 to-cyan-300 
            text-white p-4 rounded-full md:p-[1vw]
            shadow-md border border-white 
            transition duration-500 ease-in-out 
            hover:scale-110 hover:shadow-2xl"
          >
            <FaCommentDots className="w-6 h-6 sm:w-7 sm:h-7 md:w-[2.2vw] md:h-[2.2vw] 2xl:h-[2vw] 2xl:w-[2vw]" />
          </button>
        </div>
      )}
      <div
        className={clsx(
          `
      fixed bottom-8 right-6
      w-[90vw] h-[65vh]      
      sm:w-[400px] sm:h-[500px] 
      md:w-[25vw] md:h-[70vh] 
      2xl:w-[20vw] 2xl:h-[50vh] 
      bg-white border border-gray-200
      shadow-lg rounded-xl flex flex-col
      z-50 overflow-hidden
      transform transition-all duration-800 ease-out
    `,
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-8 pointer-events-none"
        )}
      >
        <div className="p-1 pl-2 pr-3 font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm flex justify-start items-center space-x-3">
          <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-white">
            <img
              src={link_img}
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <span>{t("name")}</span>
          <button
            onClick={() => setIsOpen(false)}
            className="cursor-pointer text-white hover:text-gray-300 -mt-1 text-3xl transition-transform duration-300 ml-auto"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 text-sm">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              } items-end`}
            >
              {msg.role !== "user" && (
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 mr-2">
                  <img
                    src={link_img}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div
                className={`max-w-[75%] p-3 rounded-2xl transition-all duration-300 ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-900 rounded-bl-none"
                }`}
              >
                {msg.text
                  ? msg.text
                      .replace(/[\*\[\]\(\)]/g, "")
                      .split(/(\/pages\/products\/view\/\d+)/g)
                      .map((part, index) => {
                        const gameLinkRegex = /\/pages\/products\/view\/\d+/;
                        if (gameLinkRegex.test(part)) {
                          return (
                            <span key={index} className="inline-block ml-1">
                              <a
                                href={part}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block px-3 py-1 rounded-xl font-medium text-blue-600 border border-blue-400 bg-blue-50 hover:bg-blue-100 transition-all shadow-sm"
                              >
                                Xem game
                              </a>
                            </span>
                          );
                        } else {
                          return part;
                        }
                      })
                  : ""}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-end space-x-2">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200">
                <img
                  src={link_img}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-gray-200 text-gray-800 px-3 py-2 rounded-2xl rounded-bl-none max-w-[75%]">
                <div className="flex space-x-1 justify-center items-center h-5">
                  <span className="dot dot1" />
                  <span className="dot dot2" />
                  <span className="dot dot3" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="h-[48px] flex border-t bg-white">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("input")}
            className="flex-1 text-black px-4 py-3 text-sm outline-none rounded-l-xl shadow-md focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 rounded-r-xl hover:bg-blue-700 transition duration-300 ease-in-out"
          >
            {t("button")}
          </button>
        </div>
      </div>
    </>
  );
}
