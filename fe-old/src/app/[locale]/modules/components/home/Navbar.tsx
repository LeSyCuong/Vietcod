"use client";

import { useState, useContext, useEffect } from "react";
import { HiMenu, HiX, HiChevronDown } from "react-icons/hi";
import { useRouter } from "next/navigation";
import LanguageMenu from "./LanguageMenu";
import { useTranslations } from "next-intl";
import { useUserStore } from "@/app/[locale]/stores/userStore";
import { AuthContext } from "@/app/[locale]/Auth/context/AuthContext";
import Image from "next/image";

export default function Navbar() {
  const { logout } = useContext(AuthContext);
  const router = useRouter();
  const { user, checkUser } = useUserStore();
  const [open, setOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("VI");
  const [servicesOpen, setServicesOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const t = useTranslations("header");

  useEffect(() => {
    checkUser();
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, [checkUser]);

  const handleLogout = () => {
    logout();
    router.replace("/pages/login");
  };

  return (
    <header className="w-full absolute top-0 left-0 z-99 bg-transparent transition-all">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
        {/* Left: Logo + menu */}
        <div className="flex items-center gap-10">
          <Image
            src="/uploads/images/name.png"
            alt="Logo"
            width={128}
            height={40}
            className="h-10 w-auto"
          />

          {/* Desktop menu */}
          <ul className="hidden md:flex ml-10 gap-6 text-white font-medium">
            <a
              href="/pages/products"
              className="hover:text-blue-400 transition"
            >
              {t("nav.source")}
            </a>
            <a
              href="https://zalo.me/0865811722"
              className="hover:text-blue-400 transition"
            >
              {t("nav.webGame")}
            </a>
            {/* Services */}
            <li className="relative group">
              <button className="cursor-pointer flex items-center gap-1 transition">
                {t("nav.services")}
                <HiChevronDown
                  className="transition-transform duration-300 group-hover:rotate-180"
                  size={16}
                />
              </button>
              <div className="absolute left-0 top-full w-full h-2 bg-transparent group-hover:block hidden"></div>
              <ul
                className="absolute left-0 top-full mt-2 min-w-max whitespace-nowrap bg-black text-white border border-white/40 rounded-lg shadow-lg 
                opacity-0 -translate-y-2 pointer-events-none 
                group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto
                transform transition-all duration-200 ease-out origin-top z-99"
              >
                <li>
                  <a
                    href="https://portal.vietnix.vn/aff.php?aff=2857&url=https://vietnix.vn/hosting-gia-re/"
                    target="_blank"
                    className="block px-4 py-2 hover:bg-white hover:text-black rounded-t-lg"
                  >
                    {t("nav.hosting")}
                  </a>
                </li>
                <li>
                  <a
                    href="https://vpssieutoc.vn/aff.php?aff=218&gid=5"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 hover:bg-white hover:text-black"
                  >
                    {t("nav.vpsCheap")}
                  </a>
                </li>
                <li>
                  <a
                    href="https://portal.vietnix.vn/aff.php?aff=2857&url=https://vietnix.vn/vps-gia-re/"
                    target="_blank"
                    className="block px-4 py-2 hover:bg-white hover:text-black rounded-b-lg"
                  >
                    {t("nav.vpsSSD")}
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        {/* Right desktop */}
        <nav className="hidden md:flex items-center gap-6 font-medium text-white relative">
          <a href="#community" className="hover:text-blue-400 mr-4 transition">
            {t("nav.blog")}
          </a>
          <LanguageMenu
            selectedLang={selectedLang}
            setSelectedLang={setSelectedLang}
          />

          {!user ? (
            <>
              <a
                href="/pages/login"
                className="px-4 py-[6.5px] bg-black text-white rounded-4xl border border-white/40 hover:border-white/60 transition"
              >
                {t("nav.login")}
              </a>
              <a
                href="/pages/register"
                className="px-5 py-[6.5px] bg-white text-black rounded-4xl border border-black transition"
              >
                {t("nav.register")}
              </a>
            </>
          ) : (
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-[6px] rounded-3xl border border-white/40 hover:border-white/60 transition">
                <span>{user.username}</span>
                <HiChevronDown
                  size={16}
                  className="transition-transform duration-300 group-hover:rotate-180"
                />
              </button>
              <div className="absolute left-0 top-full w-full h-2 bg-transparent group-hover:block hidden"></div>

              <ul
                className="absolute right-0 mt-2 min-w-[160px] bg-black text-white border border-white/40 rounded-lg shadow-lg z-50 
                opacity-0 -translate-y-2 pointer-events-none 
                group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto
                transform transition-all duration-200 ease-out origin-top"
              >
                <li>
                  <a
                    href="/pages/users"
                    className="block px-4 py-2 hover:bg-white hover:text-black rounded-t-lg"
                  >
                    {t("nav.info")}
                  </a>
                </li>
                <li>
                  <a
                    href="/pages/users/orders"
                    className="block px-4 py-2 hover:bg-white hover:text-black"
                  >
                    Download
                  </a>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-white hover:text-black rounded-b-lg"
                  >
                    {t("nav.logout")}
                  </button>
                </li>
              </ul>
            </div>
          )}
        </nav>

        <div className="md:hidden">
          <button onClick={() => setOpen((v) => !v)} className="p-2 text-white">
            {open ? <HiX size={26} /> : <HiMenu size={26} />}
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[99] flex md:hidden transition-all duration-500 ease-in-out ${
          open ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-500 ${
            open ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        />
        <div
          className={`relative ml-auto h-full w-full bg-gradient-to-tl from-gray-900 to-black text-white shadow-2xl transform transition-transform duration-500 ease-in-out ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full px-6 py-6">
            <div className="flex justify-between items-center mb-8">
              <Image
                src="/uploads/images/name.png"
                alt="Logo"
                width={128}
                height={40}
                className="h-12 w-auto"
              />
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 transition"
              >
                <HiX size={28} />
              </button>
            </div>

            <nav className="flex flex-col gap-2 text-lg">
              <a
                href="/pages/products"
                onClick={() => setOpen(false)}
                className="px-2 py-3 text-xl rounded-md hover:bg-white/10 transition"
              >
                {t("nav.source")}
              </a>
              <a
                href="https://zalo.me/0865811722"
                onClick={() => setOpen(false)}
                className="px-2 py-3  text-xl rounded-md hover:bg-white/10 transition"
              >
                {t("nav.webGame")}
              </a>

              <div>
                <button
                  onClick={() => setServicesOpen((v) => !v)}
                  className="flex items-center justify-between w-full px-2 py-3 rounded-md hover:bg-white/10 transition"
                >
                  {t("nav.services")}
                  <HiChevronDown
                    className={`transition-transform duration-300 ${
                      servicesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {servicesOpen && (
                  <ul className="ml-4 mt-1 flex flex-col border-l border-white/20 pl-3 animate-fadeIn">
                    <li>
                      <a
                        href="https://portal.vietnix.vn/aff.php?aff=2857&url=https://vietnix.vn/hosting-gia-re/"
                        onClick={() => setOpen(false)}
                        target="_blank"
                        className="block py-2 hover:text-blue-400 transition"
                      >
                        {t("nav.hosting")}
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://vpssieutoc.vn/aff.php?aff=218&gid=5"
                        onClick={() => setOpen(false)}
                        target="_blank"
                        className="block py-2 hover:text-blue-400 transition"
                      >
                        {t("nav.vpsCheap")}
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://portal.vietnix.vn/aff.php?aff=2857&url=https://vietnix.vn/vps-gia-re/"
                        onClick={() => setOpen(false)}
                        target="_blank"
                        className="block py-2 hover:text-blue-400 transition"
                      >
                        {t("nav.vpsSSD")}
                      </a>
                    </li>
                  </ul>
                )}
              </div>
            </nav>

            <div className="mt-8">
              <LanguageMenu
                selectedLang={selectedLang}
                setSelectedLang={setSelectedLang}
              />
            </div>

            <div className="mt-auto flex flex-col gap-4 pb-8">
              {!user ? (
                <>
                  <a
                    href="/pages/login"
                    onClick={() => setOpen(false)}
                    className="w-full py-3 rounded-xl border border-white/30 text-center hover:bg-white hover:text-black transition"
                  >
                    {t("nav.login")}
                  </a>
                  <a
                    href="/pages/register"
                    onClick={() => setOpen(false)}
                    className="w-full py-3 rounded-xl border border-white/30 bg-white text-black text-center hover:bg-gray-200 transition"
                  >
                    {t("nav.register")}
                  </a>
                </>
              ) : (
                <div className="flex flex-col border border-white/30 rounded-lg overflow-hidden mt-4">
                  <button
                    onClick={() => setUserOpen((v) => !v)}
                    className="flex items-center justify-between px-4 py-3 border-b border-white/20 hover:bg-white/10 transition"
                  >
                    {user.username}
                    <HiChevronDown
                      className={`transition-transform duration-300 ${
                        userOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {userOpen && (
                    <ul className="animate-fadeIn py-2">
                      <li>
                        <a
                          href="/pages/users"
                          onClick={() => setOpen(false)}
                          className="block py-3 text-center hover:bg-white hover:text-black transition"
                        >
                          {t("nav.info")}
                        </a>
                      </li>
                      <li>
                        <a
                          href="/pages/users/orders"
                          onClick={() => setOpen(false)}
                          className="block py-3 text-center hover:bg-white hover:text-black transition"
                        >
                          Download
                        </a>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            handleLogout();
                            setOpen(false);
                          }}
                          className="block w-full py-3 text-center hover:bg-white hover:text-black transition"
                        >
                          {t("nav.logout")}
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
