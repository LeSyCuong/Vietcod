"use client";

import React, { useState, useEffect } from "react";

interface SearchToggleProps {
  isMobile?: boolean;
  isPC?: boolean;
  onClick?: () => void;
}

const SearchToggle: React.FC<SearchToggleProps> = ({
  isMobile = false,
  isPC = false,
  onClick,
}) => {
  const [mounted, setMounted] = useState(false);
  const [isClientMobile, setIsClientMobile] = useState(false);
  const [isClientPC, setIsClientPC] = useState(false);

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

  return (
    <button
      onClick={onClick}
      className="text-[var(--primary)]"
      aria-label="Toggle Search"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M17.545 15.467l-3.779-3.779a6.15 6.15 0 0 0 .898-3.21c0-3.417-2.961-6.377-6.378-6.377A6.185 6.185 0 0 0 2.1 8.287c0 3.416 2.961 6.377 6.377 6.377a6.15 6.15 0 0 0 3.115-.844l3.799 3.801a.953.953 0 0 0 1.346 0l.943-.943c.371-.371.371-.973 0-1.344zM8.477 13.016c-2.613 0-4.729-2.116-4.729-4.729 0-2.613 2.116-4.729 4.729-4.729 2.613 0 4.729 2.116 4.729 4.729 0 2.613-2.116 4.729-4.729 4.729z" />
      </svg>
    </button>
  );
};

export default SearchToggle;
