"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HiChevronDown } from "react-icons/hi";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { useTranslations } from "next-intl";

export default function LanguageMenu({
  selectedLang,
  setSelectedLang,
}: {
  selectedLang: string;
  setSelectedLang: (lang: string) => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("header");

  const [mobileOpen, setMobileOpen] = useState(false); // mobile menu state

  useEffect(() => {
    if (pathname) {
      const currentLocale = pathname.split("/")[1]?.toUpperCase() || "VI";
      setSelectedLang(currentLocale);
    }
  }, [pathname, setSelectedLang]);

  const langs = ["VI", "EN"];

  const handleSelect = (lang: string) => {
    setSelectedLang(lang);
    setMobileOpen(false); // close mobile dropdown when selecting
    if (!pathname) {
      router.push(`/${lang.toLowerCase()}`);
      return;
    }
    const segments = pathname.split("/");
    if (segments.length >= 2) {
      segments[1] = lang.toLowerCase();
    } else {
      segments[0] = "";
      segments[1] = lang.toLowerCase();
    }
    const newPath = segments.join("/") || `/${lang.toLowerCase()}`;
    router.push(newPath);
  };

  return (
    <>
      {/* Desktop */}
      <div className="hidden sm:inline-flex relative group px-4 py-2 cursor-pointer text-white rounded-full border border-white/40 hover:border-white/60 bg-black shadow-lg transition-all duration-300 ease-out">
        <div className="flex items-center gap-2 select-none">
          <FontAwesomeIcon icon={faGlobe} className="w-5 h-5" />
          <span className="text-sm">{selectedLang}</span>
          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="absolute left-0 top-full w-full h-2 bg-transparent group-hover:block hidden"></div>

        <ul
          className={`absolute right-0 top-full mt-2 min-w-max whitespace-nowrap bg-black text-white border border-white/40 rounded-lg shadow-lg transform transition-all duration-200 origin-top z-30
          opacity-0 -translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto`}
        >
          {langs.map((lang, idx) => {
            const first = idx === 0;
            const last = idx === langs.length - 1;
            return (
              <li key={lang} className="relative">
                <button
                  onClick={() => handleSelect(lang)}
                  className={`w-full text-left flex items-center justify-between gap-2 px-4 py-2 transition rounded-none
      ${first ? "rounded-t-lg" : ""} ${last ? "rounded-b-lg" : ""} group/item
      ${
        selectedLang === lang
          ? "bg-white text-black font-semibold"
          : "hover:bg-white hover:text-black"
      }`}
                  type="button"
                >
                  <span>{t(`languages.${lang}`)}</span>
                  <svg
                    style={{ width: "1vw", height: "1vw" }}
                    className="transition-transform duration-300 group-hover:rotate-180"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  ></svg>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Mobile */}
      <div className=" sm:hidden relative w-full">
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="flex items-center justify-between w-full px-2 py-2 text-white bg-black rounded"
        >
          <span>{selectedLang}</span>
          <HiChevronDown
            className={` transition-transform duration-200 ${
              mobileOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {mobileOpen && (
          <ul className="mt-1 bg-black w-full mb-5 flex flex-col rounded overflow-hidden">
            {langs.map((lang) => (
              <li key={lang}>
                <button
                  onClick={() => handleSelect(lang)}
                  className={`w-full text-left px-4 py-2 text-white transition hover:bg-gray-800 ${
                    selectedLang === lang ? "bg-gray-700 font-semibold" : ""
                  }`}
                >
                  {t(`languages.${lang}`)}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
