"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";

interface ThemeToggleProps {
  white?: boolean;
  isMobile?: boolean;
  isPC?: boolean; // Thêm thuộc tính isPC
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  white = false,
  isMobile = false,
  isPC = false, // Giá trị mặc định là false
}) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isClientMobile, setIsClientMobile] = useState(false); // <= 768px
  const [isClientPC, setIsClientPC] = useState(false); // > 768px

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setIsClientMobile(window.innerWidth <= 768);
      setIsClientPC(window.innerWidth > 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!mounted || (isMobile && !isClientMobile) || (isPC && !isClientPC)) {
    return null;
  }

  const isDark = resolvedTheme === "dark";
  const iconColor = white ? "#ffffff" : isDark ? "#ffffff" : "#000000";

  let buttonClassName = "";
  if (isMobile && isClientMobile) {
    buttonClassName = "";
  } else if (white) {
    buttonClassName = "theme-toggle-white";
  } else {
    buttonClassName = "theme-toggle-btn";
  }

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className={buttonClassName}
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke={iconColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke={iconColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;
