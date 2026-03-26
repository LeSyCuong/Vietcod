import React from "react";
import { Heart } from "lucide-react";
import Button from "@/app/[locale]/components/Button";

export default function ProductInfo({
  name,
  price,
  onAddToCart,
  onCheckout,
}: {
  name: string;
  price: number;
  onAddToCart: () => void;
  onCheckout: () => void;
}) {
  return (
    <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full max-w-[450px] mx-auto">
      {/* Category Badge - Minimal */}
      <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-lg mb-6">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        Source Server Game
      </div>

      {/* Product Name */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 leading-snug">
        {name}
      </h1>

      <div className="relative flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-6 mb-10">
        {/* Price Display - Clean White */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold text-white">
              {price.toLocaleString("vi-VN")}
            </span>
            <span className="text-lg text-white/80">Credit</span>
          </div>
        </div>

        {/* Favorite Button - Clean White */}
        <button
          onClick={onAddToCart}
          className="w-17 h-17 cursor-pointer flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300"
          title="Thêm vào yêu thích"
        >
          <Heart className="w-9 h-9 text-white" />
        </button>
      </div>

      {/* Action Button - Keep the original button */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-md mt-2">
        <Button
          text="Nhận tài nguyên"
          svg={true}
          onClick={onCheckout}
          width_MB={230}
          width_PC={300}
          initialX_PC={115}
          initialX_MB={86}
          style={{ fontSize: "13px" }}
        />
      </div>

      {/* Features List - Subtle */}
    </div>
  );
}
