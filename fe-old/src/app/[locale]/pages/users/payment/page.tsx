"use client";

import { useState, useEffect } from "react";
import {
  BanknotesIcon,
  ArrowUpOnSquareIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { useUserStore } from "@/app/[locale]/stores/userStore";

const presetAmounts = [
  200000, 500000, 1000000, 2000000, 3000000, 5000000, 7000000, 10000000,
];

export default function RechargeDashboard() {
  const { user } = useUserStore();
  const [amount, setAmount] = useState<number>(1000000);
  const [selectedPreset, setSelectedPreset] = useState<number>(1000000);
  const [qrUrl, setQrUrl] = useState<string>("");

  const generateQR = (selectedAmount: number) => {
    const base = "https://img.vietqr.io/image/ACB-19433111-print.png";
    const query = `?amount=${selectedAmount}&addInfo=vietcod${
      user?.id ?? ""
    }&accountName=LE+SY+CUONG&invoiceCode=QR123`;
    setQrUrl(`${base}${query}`);
  };

  useEffect(() => {
    generateQR(amount);
  }, [amount]);

  return (
    <div className="w-full min-h-screen lg:pt-15 flex justify-center items-start">
      <div className="w-full flex flex-col lg:flex-row gap-10">
        <div className="lg:w-1/2 flex flex-col items-center">
          <h3 className="text-2xl font-semibold mb-4 text-[var(--primary)]">
            Quét mã QR để thanh toán
          </h3>

          {qrUrl ? (
            <img
              src={qrUrl}
              alt="Mã QR"
              className="w-80 sm:w-96 rounded-xl border shadow-inner"
            />
          ) : null}
        </div>

        <div className="lg:w-1/2 flex sm:mt-5 md:mt-0 flex-col gap-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <BanknotesIcon className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-extrabold text-[var(--primary)]">
              Nạp Credit / Hỗ trợ kỹ thuật
            </h1>
          </div>
          <p className="text-[var(--primary)] text-sm sm:text-base mb-4">
            Chọn mệnh giá hoặc nhập số Credit muốn nạp.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="number"
              value={amount || ""}
              onChange={(e) => {
                const val = Number(e.target.value);
                setAmount(val);
                setSelectedPreset(0);
              }}
              placeholder="Nhập số Credit"
              className="flex-1 px-5 py-3 rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-[var(--primary)] shadow-md"
            />
            <button
              onClick={() => generateQR(amount)}
              className="flex items-center gap-2 justify-center px-5 py-3 rounded-3xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold hover:scale-105 hover:shadow-xl transition transform"
            >
              <ArrowUpOnSquareIcon className="w-8 h-8" />
              Tạo QR
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {presetAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => {
                  setAmount(amt);
                  setSelectedPreset(amt);
                }}
                className={`flex flex-col items-center justify-center p-5 rounded-3xl font-bold shadow-lg transform transition-all duration-300
                ${
                  selectedPreset === amt
                    ? "bg-gradient-to-tr from-green-500 to-green-600 text-white scale-105 shadow-2xl"
                    : "bg-gradient-to-tr from-blue-500 to-blue-600 text-white hover:scale-105 hover:shadow-xl"
                }`}
              >
                <CurrencyDollarIcon className="w-7 h-7 mb-2" />
                {amt.toLocaleString("vi-VN")} Credit
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
