"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { User, Lock, ShoppingBag, CreditCard, History } from "lucide-react";
import { useUserStore } from "@/app/[locale]/stores/userStore";

export default function Sidebar() {
  const { user } = useUserStore();
  const [openProfile, setOpenProfile] = useState(true);
  const pathname = usePathname();
  const img = "/uploads/images/logo.png";

  return (
    <aside className="w-full md:w-72 border border-r-gray-300 border-t-[var(--background)] border-l-[var(--background)] p-5 mt-25 flex flex-col h-auto md:h-full">
      <div className="flex items-center gap-4 mb-6 mt-5">
        <img
          src={img}
          alt="User avatar"
          className="w-12 h-12 rounded-full border-1 border-gray-400"
        />
        <div>
          <div className="font-semibold text-[var(--primary)]">
            {user?.username || "User"}
          </div>
          <div className="text-xs text-green-500">● Online</div>
          <div className="text-sm text-[var(--primary)]">
            Điểm Credit:{" "}
            <span className="font-semibold text-blue-500">
              {user?.vnd?.toLocaleString("vi-VN")}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}

      <div className="space-y-4">
        <div>
          <button
            onClick={() => setOpenProfile(!openProfile)}
            className="cursor-pointer flex items-center justify-between w-full px-2 py-2 rounded-md "
          >
            <span className="flex items-center gap-2 ">
              <User size={18} /> Profile
            </span>
            <span>{openProfile ? "▾" : "▸"}</span>
          </button>

          {openProfile && (
            <div className="ml-4 mt-2 space-y-2 text-sm">
              <Link
                href="/pages/users"
                className={`flex items-center gap-2 px-2 py-2 rounded-md hover:bg-[var(--primary)] hover:text-[var(--background)] ${
                  pathname.endsWith("/pages/users")
                    ? "bg-[var(--primary)] text-[var(--background)]"
                    : ""
                }`}
              >
                <User size={16} /> Thông tin
              </Link>

              <Link
                href="/pages/change"
                className={`flex items-center gap-2 px-2 py-2 rounded-md hover:bg-[var(--primary)] hover:text-[var(--background)] ${
                  pathname.endsWith("/pages/change")
                    ? "bg-[var(--primary)] text-[var(--background)]"
                    : ""
                }`}
              >
                <Lock size={16} /> Đổi mật khẩu
              </Link>

              <Link
                href="/pages/users/payment"
                className={`flex items-center gap-2 px-2 py-2 rounded-md hover:bg-[var(--primary)] hover:text-[var(--background)] ${
                  pathname.endsWith("/pages/users/payment")
                    ? "bg-[var(--primary)] text-[var(--background)]"
                    : ""
                }`}
              >
                <CreditCard size={16} /> Nạp Credit
              </Link>

              <Link
                href="/pages/users/payment/history"
                className={`flex items-center gap-2 px-2 py-2 rounded-md hover:bg-[var(--primary)] hover:text-[var(--background)] ${
                  pathname.endsWith("/pages/users/payment/history")
                    ? "bg-[var(--primary)] text-[var(--background)]"
                    : ""
                }`}
              >
                <History size={16} /> Lịch sử giao dịch
              </Link>
            </div>
          )}
        </div>

        <Link
          href="/pages/users/orders"
          className={`flex items-center gap-2 px-2 py-2 rounded-md hover:bg-[var(--primary)] hover:text-[var(--background)] ${
            pathname.endsWith("/pages/users/orders")
              ? "bg-[var(--primary)] text-[var(--background)]"
              : ""
          }`}
        >
          <ShoppingBag size={18} /> Download
        </Link>
      </div>
    </aside>
  );
}
