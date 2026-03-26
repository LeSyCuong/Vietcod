"use client";

import { useEffect, useState, useRef } from "react";
import ProductItem from "./ProductItem";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

type Product = {
  id: number;
  name: string;
  img: string;
  price: number;
  category: string;
  localImage?: string;
};

export default function LatestProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const url_backend = process.env.NEXT_PUBLIC_URL_BACKEND!;

  const resolveImageUrl = (img: string) => {
    if (!img) return "/uploads/images/fallback.jpg";
    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    return `${url_backend}${img.startsWith("/") ? img : `/${img}`}`;
  };

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch(
          `${url_backend}/sanpham-game?limit=10&desc=true`
        );
        const data: Product[] = await res.json();

        // Chuyển đổi URL trực tiếp
        const resolved = data.map((item) => ({
          ...item,
          localImage: resolveImageUrl(item.img),
        }));

        setProducts(resolved);
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatest();
  }, [url_backend]);

  const ITEM_WIDTH = 304;
  const scrollLeft = () =>
    containerRef.current?.scrollBy({ left: -ITEM_WIDTH, behavior: "smooth" });
  const scrollRight = () =>
    containerRef.current?.scrollBy({ left: ITEM_WIDTH, behavior: "smooth" });

  return (
    <div>
      <div className="flex items-center justify-between px-10 py-5">
        <div>
          <h2 className="text-2xl font-bold text-black">Sản phẩm tương tự</h2>
          <p className="text-gray-600 mt-2">
            Khám phá thêm các server game mới nhất
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={scrollLeft}
            className="w-12 h-12 cursor-pointer border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <FaChevronLeft className="w-5 h-5 text-black" />
          </button>
          <button
            onClick={scrollRight}
            className="w-12 h-12 cursor-pointer border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <FaChevronRight className="w-5 h-5 text-black" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/3] bg-gray-200 rounded-2xl mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-10 bg-gray-200 rounded-xl" />
            </div>
          ))}
        </div>
      ) : (
        <div className="relative bg-gradient-to-tr from-black via-gray-600 to-gray-50">
          <div className="px-10">
            <div
              ref={containerRef}
              className="flex p-15 gap-4 overflow-x-auto scroll-smooth px-2"
              style={{ scrollbarWidth: "none" }}
            >
              {products.map((p) => (
                <ProductItem key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
