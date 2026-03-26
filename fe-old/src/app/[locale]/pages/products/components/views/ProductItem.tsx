"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CategoryBadges from "../CategoryBadges";
import { HiOutlineHeart, HiHeart } from "react-icons/hi";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  localImage?: string;
};

export default function ProductItem({ product }: { product: Product }) {
  const router = useRouter();
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const fav = localStorage.getItem("favorites");
    if (fav) {
      setIsFav(JSON.parse(fav).some((item: Product) => item.id === product.id));
    }
  }, [product.id]);

  const toggleStorage = (
    key: "favorites" | "cart",
    value: Product,
    callback: (exists: boolean) => void
  ) => {
    const stored = localStorage.getItem(key);
    let list = stored ? JSON.parse(stored) : [];
    const exists = list.some((item: Product) => item.id === value.id);
    if (exists) {
      list = list.filter((item: Product) => item.id !== value.id);
    } else {
      list.push(value);
    }
    localStorage.setItem(key, JSON.stringify(list));
    callback(!exists);
  };

  const categories = product.category
    .split(",")
    .map((s) => s.trim().toLowerCase());

  return (
    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-[24%] flex-shrink-0 bg-white rounded-xl shadow-md transition transform cursor-pointer flex flex-col hover:shadow-xl">
      <div className="rounded-xl bg-white relative">
        <div className="absolute top-2 right-2 flex gap-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleStorage("favorites", product, setIsFav);
            }}
            className="cursor-pointer bg-white/70 backdrop-blur-[2px] p-1.5 rounded-md hover:scale-110 transition"
          >
            {isFav ? (
              <HiHeart className="text-red-500 w-5 h-5" />
            ) : (
              <HiOutlineHeart className="text-black w-5 h-5" />
            )}
          </button>
        </div>

        <div
          onClick={() => router.push(`/pages/products/view/${product.id}`)}
          className="overflow-hidden rounded-t-xl w-full h-45 relative"
        >
          <Image
            src={product.localImage || "/uploads/images/fallback.jpg"}
            alt={product.name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      </div>

      <div className="flex flex-col flex-1 p-3 gap-1">
        <h2 className="font-semibold text-sm leading-snug text-black text-[17px] line-clamp-2">
          {product.name}
        </h2>
        <div>
          <span className="inline-block bg-orange-100 text-orange-600 text-xs font-semibold px-2 py-0.5 rounded-md">
            {product.price.toLocaleString("vi-VN")} Credit
          </span>
        </div>
        <CategoryBadges codes={categories} />
        <button
          onClick={() => router.push(`/pages/products/view/${product.id}`)}
          className="cursor-pointer mt-auto w-full bg-black text-white text-sm py-2 rounded-md hover:bg-[#111111] active:scale-[0.98]"
        >
          Xem Ngay
        </button>
      </div>
    </div>
  );
}
