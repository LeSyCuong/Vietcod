"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faMagnifyingGlass,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  return (
    <header className="w-full bg-white/60 backdrop-blur-md shadow-sm border-b border-gray-200 px-6 py-1 flex justify-between items-center sticky top-0 z-50">
      {/* Logo / Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
          F
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">Fyntech</h1>
      </div>

      {/* Search + Actions */}
      <div className="flex items-center gap-6">
        {/* Search box */}
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-gray-50"
          />
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute left-3 top-2.5 text-gray-500 w-4 h-4"
          />
        </div>

        {/* Notification */}
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
          <FontAwesomeIcon icon={faBell} className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-3 py-1.5 rounded-lg transition">
          <img
            src="https://ui-avatars.com/api/?name=C+Admin&background=0D8ABC&color=fff"
            alt="avatar"
            className="w-9 h-9 rounded-full shadow-sm"
          />
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800 leading-tight">
              Cường Admin
            </p>
            <p className="text-xs text-gray-500">Quản trị viên</p>
          </div>
          <FontAwesomeIcon
            icon={faChevronDown}
            className="text-gray-500 w-3 h-3 ml-1"
          />
        </div>
      </div>
    </header>
  );
}
