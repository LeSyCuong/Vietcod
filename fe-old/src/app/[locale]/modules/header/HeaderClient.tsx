"use client";

import { useTheme } from "next-themes";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef, useContext } from "react";
import { useUserStore } from "../../stores/userStore";
import "../../globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Logo from "../components/header/Logo";
import ThemeToggle from "../components/header/ThemeToggle";
import SearchToggle from "../components/header/SearchToggle";
import SearchBar from "../components/header/SearchBar";
import Menu_MB from "./Menu_MB";
import Menu_PC from "./Menu_PC";
import { AuthContext } from "../../Auth/context/AuthContext";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function HeaderClient() {
  const { logout } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { user, checkUser } = useUserStore();

  const [showMenu, setShowMenu] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const [showHeader, setShowHeader] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pathname !== "/") {
      setShowHeader(true);
      return;
    }

    const handleScroll = () => setShowHeader(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  useEffect(() => {
    checkUser();
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, [checkUser]);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/pages/login");
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setShowSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dropdownStyle: React.CSSProperties = {
    transition: "all 0.5s ease",
    overflow: "hidden",
    maxHeight: "0px",
    opacity: 0,
  };

  const dropdownOpenStyle: React.CSSProperties = {
    maxHeight: "500px",
    opacity: 1,
  };

  return (
    <header
      ref={headerRef}
      className={`header ${showHeader ? "header--visible" : "header--hidden"} ${
        showMenu ? "header--menu-open" : ""
      }`}
      style={{
        position: "fixed",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "90vw",
        zIndex: 50,
        pointerEvents: "auto",
      }}
    >
      <div className="flex md:hidden w-full">
        <div className="w-3/6 flex items-center -ml-2">
          <Logo />
        </div>
        <div className="w-1/4 flex justify-center items-center ml-2">
          <ThemeToggle isMobile />
        </div>
        <div className="w-1/4 flex justify-center items-center ml-2">
          <SearchToggle isMobile onClick={() => setShowSearch((p) => !p)} />
        </div>
        <div className="w-1/5 flex justify-end items-center -mr-2">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-[var(--primary)] text-xl transition-transform duration-500"
            style={{
              transform: showMenu ? "rotate(90deg)" : "rotate(0deg)",
            }}
            aria-label={showMenu ? "Close menu" : "Open menu"}
          >
            <i className={`fas ${showMenu ? "fa-times" : "fa-bars"}`} />
          </button>
        </div>
      </div>

      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden md:hidden ${
          showSearch ? "max-h-[100px] opacity-100 mt-2" : "max-h-0 opacity-0"
        }`}
      >
        <SearchBar show={showSearch} isMobile />
      </div>

      <div className="hidden md:flex items-center justify-start w-full gap-4">
        <Logo />
        <ThemeToggle isMobile />
        <Menu_PC
          user={user}
          openMenu={openMenu}
          setOpenMenu={setOpenMenu}
          dropdownRef={dropdownRef}
          dropdownStyle={dropdownStyle}
          dropdownOpenStyle={dropdownOpenStyle}
          isDark={isDark}
          router={router}
          handleLogout={handleLogout}
          showSearch={showSearch}
          setShowSearch={setShowSearch}
        />
      </div>

      <div
        className={`hidden md:block transition-all duration-500 ease-in-out overflow-hidden ${
          showSearch ? "max-h-[100px] opacity-100 mt-2" : "max-h-0 opacity-0"
        }`}
      >
        <SearchBar show={showSearch} />
      </div>

      <Menu_MB
        user={user}
        showMenu={showMenu}
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
        openSubMenu={openSubMenu}
        setOpenSubMenu={setOpenSubMenu}
        router={router}
        handleLogout={handleLogout}
      />
    </header>
  );
}
