"use client";

import React from "react";
import { useUserStore } from "@/app/[locale]/stores/userStore";
import { User, Mail, Shield, Wallet } from "lucide-react";

const ProfileContent = () => {
  const { user } = useUserStore();

  // UserLayout đã kiểm tra login, nên ở đây đảm bảo user tồn tại
  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-xl text-gray-500">Vui lòng đăng nhập...</p>
      </div>
    );
  }

  const profileData = [
    {
      icon: User,
      label: "Họ và tên",
      value: user.username,
      color: "bg-blue-100 text-blue-700",
    },
    {
      icon: Mail,
      label: "Email",
      value: user.email,
      color: "bg-purple-100 text-purple-700",
    },
    {
      icon: Shield,
      label: "Vai trò",
      value: user.role || "Người dùng",
      color: "bg-orange-100 text-orange-700",
    },
    {
      icon: Wallet,
      label: "Số dư",
      value: `${user.vnd?.toLocaleString() || 0} Credits`,
      color: "bg-green-100 text-green-700",
    },
  ];

  return (
    <div className="max-w-screen-lg mx-auto p-5 py-10">
      <h2 className="text-3xl font-extrabold text-[var(--primary)] border-b border-b-gray-300 pb-4 mb-4">
        Thông tin người dùng
      </h2>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {profileData.map(({ icon: Icon, label, value, color }, idx) => (
          <div
            key={idx}
            className={`flex flex-col justify-between bg-white border border-gray-300 rounded-xl p-5 hover:shadow-xl transition cursor-default`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-full ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-gray-500">{label}</span>
            </div>
            <div className="text-xl font-semibold text-gray-900 truncate">
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileContent;
