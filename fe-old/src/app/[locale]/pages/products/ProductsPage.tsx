"use client";

import { useEffect, useState } from "react";
import Header from "../../modules/header/page";
import Footer from "../../modules/footer/footer";
import CustomDropdown from "./components/products/CustomDropdown";
import ProductGrid from "./components/products/ProductGrid";
import Pagination from "./components/Pagination";
import SearchBar from "./components/products/SearchBar";
import SidebarFilters from "./components/products/SidebarFilters";
import { HiOutlineHeart } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

type PriceRange = {
  label: string;
  min?: number;
  max: number | null;
};

type Product = {
  id: number;
  name: string;
  img: string;
  price: number;
  category: string;
};

type DisplayProduct = Product & { displayImage: string };

const categories = [
  { label: "Tất cả", value: "all" },
  { label: "Tiên hiệp", value: "th" },
  { label: "Kiếm hiệp", value: "kh" },
  { label: "Game H5", value: "h5" },
  { label: "Game 3D", value: "3d" },
  { label: "Game 2D", value: "2d" },
  { label: "Game Thẻ Bài", value: "tb" },
  { label: "Game Tam Quốc", value: "3q" },
];

const priceRanges: PriceRange[] = [
  { label: "Tất cả", max: null },
  { label: "0 - 1,500,000", max: 1500000 },
  { label: "1,500,000 - 2,000,000", min: 1500000, max: 2000000 },
  { label: "2,000,000 - 3,000,000", min: 2000000, max: 3000000 },
  { label: "3,000,000 - 4,000,000", min: 3000000, max: 4000000 },
  { label: "4,000,000 - 5,000,000", min: 4000000, max: 5000000 },
  { label: "5,000,000 - 10,000,000", min: 5000000, max: 10000000 },
  { label: "10,000,000 - 20,000,000", min: 10000000, max: 20000000 },
  { label: "> 20,000,000", min: 20000000, max: 100000000000 },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedRange, setSelectedRange] = useState<PriceRange | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const router = useRouter();
  const url_backend = process.env.NEXT_PUBLIC_URL_BACKEND!;
  const local = useLocale();

  // Hàm chuẩn hóa URL để hiển thị
  const resolveImageUrl = (img: string) => {
    if (!img) return "/uploads/images/fallback.jpg";
    if (img.startsWith("http://") || img.startsWith("https://")) {
      return img;
    }
    // Nối URL Backend nếu là relative path
    return `${url_backend}${img.startsWith("/") ? img : `/${img}`}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${url_backend}/sanpham-game`);
        const raw: Product[] = await res.json();
        const sorted = raw.sort((a, b) => b.id - a.id);

        // Xử lý song song việc kiểm tra và migration
        const resolvedProducts = await Promise.all(
          sorted.map(async (p) => {
            let currentImg = p.img;

            // KIỂM TRA MIGRATION
            // Nếu link có dạng /en/api/media/items/... (Legacy URL)
            if (currentImg && currentImg.includes("/api/media/items/")) {
              try {
                // Gọi API Route để thực hiện migration phía Server
                // Lưu ý: Đường dẫn này không phụ thuộc locale nếu đặt trong app/api
                const migrateRes = await fetch(`/${local}/api/migrate-image`, {
                  method: "POST",
                  body: JSON.stringify({
                    url: currentImg,
                    id: p.id,
                    key: "img", // Field cần update trong DB
                  }),
                  headers: { "Content-Type": "application/json" },
                });

                const migrateData = await migrateRes.json();

                if (migrateData.status === "success" && migrateData.newUrl) {
                  currentImg = migrateData.newUrl;
                  console.log(`Migrated Product #${p.id}: ${currentImg}`);
                }
              } catch (e) {
                console.error(`Migration failed for product ${p.id}`, e);
                // Giữ nguyên ảnh cũ nếu lỗi, để vẫn hiển thị được (nếu API cũ còn sống)
              }
            }

            return {
              ...p,
              img: currentImg, // Cập nhật luôn vào object gốc nếu cần
              displayImage: resolveImageUrl(currentImg),
            };
          })
        );

        setProducts(resolvedProducts);
      } catch (error) {
        console.error("Lỗi khi tải danh sách sản phẩm:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url_backend]); // Bỏ local ra khỏi dependency để tránh re-fetch không cần thiết

  const normalize = (cat: string) =>
    cat.split(",").map((s) => s.trim().toLowerCase());

  const filtered = products.filter((p) => {
    const matchCategory =
      selectedCategory === "all" ||
      normalize(p.category).includes(selectedCategory);

    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());

    const matchPrice =
      !selectedRange ||
      ((selectedRange.min ?? 0) <= p.price &&
        p.price <= (selectedRange.max ?? Infinity));

    return matchCategory && matchSearch && matchPrice;
  });

  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <>
      <Header />

      <div className="p-5 mt-30">
        <div className="mb-4 lg:hidden space-y-4">
          <CustomDropdown
            label="Thể loại"
            options={categories}
            value={selectedCategory}
            onChange={(val) => setSelectedCategory(val as string)}
          />

          <CustomDropdown
            label="Mức Credit"
            options={priceRanges.map((r) => ({
              label: r.label,
              value: JSON.stringify(r),
            }))}
            value={selectedRange ? JSON.stringify(selectedRange) : ""}
            onChange={(val) => {
              if (val === "") setSelectedRange(null);
              else setSelectedRange(JSON.parse(val as string));
            }}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <SidebarFilters
            categories={categories}
            priceRanges={priceRanges}
            selectedCategory={selectedCategory}
            selectedRange={selectedRange}
            setSelectedCategory={setSelectedCategory}
            setSelectedRange={setSelectedRange}
          />

          <div className="flex-1">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex-1">
                <SearchBar search={search} setSearch={setSearch} />
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-gray-900">
                    {filtered.length}
                  </span>{" "}
                  sản phẩm
                </div>
                <button
                  onClick={() => router.push("/pages/products/heart")}
                  className="p-2.5 cursor-pointer border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <HiOutlineHeart size={26} className="text-gray-700" />
                </button>
              </div>
            </div>
            {/* Truyền đúng mảng DisplayProduct xuống Grid */}
            <ProductGrid products={paginated} isLoading={isLoading} />
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filtered.length / itemsPerPage)}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
