"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiOutlineHeart, HiHeart } from "react-icons/hi";
import CategoryBadges from "../CategoryBadges";

type Props = {
  id: number;
  name: string;
  displayImage: string;
  price: number;
  category: string;
};

export default function ProductCard({
  id,
  name,
  displayImage,
  price,
  category,
}: Props) {
  const router = useRouter();
  const normalized = category.split(",").map((s) => s.trim().toLowerCase());
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const likedList: Props[] = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setLiked(likedList.some((item) => item.id === id));
  }, [id]);

  const toggleLike = () => {
    const list: Props[] = JSON.parse(localStorage.getItem("favorites") || "[]");
    const updated = liked
      ? list.filter((item) => item.id !== id)
      : [...list, { id, name, displayImage, price, category }];

    localStorage.setItem("favorites", JSON.stringify(updated));
    setLiked(!liked);
  };

  const handleView = () => router.push(`/pages/products/view/${id}`);

  return (
    <div className="bg-white rounded-xl shadow-md transition duration-500 ease-in-out transform hover:shadow-2xl hover:-translate-y-1 h-full flex flex-col">
      <div className="rounded-xl bg-white relative">
        <div className="absolute top-2 right-2 flex gap-2 z-10">
          <button
            onClick={toggleLike}
            className="cursor-pointer bg-white/70 backdrop-blur-[2px] p-1.5 rounded-md hover:scale-110 transition duration-500"
          >
            {liked ? (
              <HiHeart className="w-5 h-5 text-red-500" />
            ) : (
              <HiOutlineHeart className="w-5 h-5 text-black" />
            )}
          </button>
        </div>
        <div
          onClick={handleView}
          className="cursor-pointer overflow-hidden rounded-t-xl w-full h-45 relative group"
        >
          <Image
            src={displayImage || "/uploads/images/fallback.jpg"}
            alt={name}
            fill
            className="object-cover"
            unoptimized // Cần thiết nếu backend không hỗ trợ Next.js Image Optimization
          />
        </div>
      </div>

      <div className="flex flex-col flex-1 p-3 gap-1">
        <h2 className="font-semibold text-sm leading-snug text-black text-[17px] line-clamp-2">
          {name}
        </h2>

        <div>
          <span className="inline-block bg-orange-100 text-orange-600 text-xs font-semibold px-2 py-0.5 rounded-md">
            {price.toLocaleString("vi-VN")} Credit
          </span>
        </div>

        <CategoryBadges codes={normalized} />

        <button
          onClick={handleView}
          className="cursor-pointer mt-auto w-full bg-black text-white text-sm py-2 rounded-md hover:bg-[#111111] active:scale-[0.98]"
        >
          Xem Ngay
        </button>
      </div>
    </div>
  );
}
