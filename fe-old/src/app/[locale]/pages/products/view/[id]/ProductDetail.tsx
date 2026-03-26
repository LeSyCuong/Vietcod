"use client";

import { useEffect, useState } from "react";
import Header from "@/app/[locale]/modules/header/page";
import Footer from "@/app/[locale]/modules/footer/footer";
import LatestProducts from "../../components/views/LatestProducts";
import ProductInfo from "../../components/views/ProductInfo";
import ProductImage from "../../components/views/ProductImage";
import ProductVideo from "../../components/views/ProductVideo";
import ProductDescription from "../../components/views/ProductDescription";
import ProductSupport from "../../components/views/ProductSupport";
import CartModal from "../../components/views/CartModal";
import CheckoutModal from "../../components/views/CheckoutModel";
import { Product, CartItem } from "@/app/[locale]/types/items";
import { useLocale } from "next-intl";

export default function ProductDetail({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
  const [showModal, setShowModal] = useState(0);
  const url_backend = process.env.NEXT_PUBLIC_URL_BACKEND!;
  const local = useLocale();

  /**
   * Hàm chuẩn hóa URL để hiển thị trên UI.
   * Nếu là link tương đối, sẽ nối thêm URL Backend.
   */
  const resolveImageUrl = (img: string) => {
    if (!img) return "/uploads/images/fallback.jpg";
    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    return `${url_backend}${img.startsWith("/") ? img : `/${img}`}`;
  };

  /**
   * Hàm thực hiện Migration cho một trường ảnh cụ thể.
   * Gọi API Server-side để đọc file local và đẩy lên Backend.
   */
  const migrateLegacyImage = async (
    url: string,
    productId: number,
    key: "img" | "img_demo"
  ) => {
    if (url && url.includes("/api/media/items/")) {
      try {
        const res = await fetch(`/${local}/api/migrate-image`, {
          method: "POST",
          body: JSON.stringify({ url, id: productId, key }),
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (data.status === "success" && data.newUrl) {
          console.log(`[Migration] Success for ${key}:`, data.newUrl);
          return data.newUrl;
        }
      } catch (err) {
        console.error(`[Migration] Failed for ${key}:`, err);
      }
    }
    return url;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${url_backend}/sanpham-game/${id}`);
        const data = await res.json();

        // Thực hiện migration song song cho cả img và img_demo nếu cần
        const [migratedImg, migratedImgDemo] = await Promise.all([
          migrateLegacyImage(data.img, data.id, "img"),
          migrateLegacyImage(data.img_demo, data.id, "img_demo"),
        ]);

        // Cập nhật lại dữ liệu đã migrate vào state
        const updatedData = {
          ...data,
          img: migratedImg,
          img_demo: migratedImgDemo,
          // Ưu tiên hiển thị img_demo, nếu không có thì dùng img
          localImage: resolveImageUrl(migratedImgDemo || migratedImg),
        };

        setProduct(updatedData);
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, url_backend]);

  const handleAddToFavorites = () => {
    if (!product) return;

    const existing = localStorage.getItem("favorites");
    const favorites: CartItem[] = existing ? JSON.parse(existing) : [];

    const already = favorites.find((item) => item.id === product.id);
    if (!already) {
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        localImage: product.localImage || "/uploads/images/fallback.jpg",
      };
      favorites.push(newItem);
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }

    setCartItems(favorites);
    setShowModal(1);
  };

  const handleCheckout = () => {
    if (!product) return;

    const newItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      localImage: product.localImage || "/uploads/images/fallback.jpg",
    };

    setCheckoutItems([newItem]);
    setShowModal(2);
  };

  const handleRemoveCartModal = (id: number) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <>
      <Header />
      <div className="relative w-full pb-20 bg-gradient-to-tr from-black via-gray-600 to-gray-50">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-40">
          {loading ? (
            <div className="flex justify-center items-center gap-2 text-gray-500 py-20">
              <div className="animate-spin h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full" />
              <span>Đang tải sản phẩm...</span>
            </div>
          ) : product ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-10">
              <div className="order-2 lg:order-1 lg:col-span-5 flex justify-center lg:justify-start">
                <ProductInfo
                  name={product.name}
                  price={product.price}
                  onAddToCart={handleAddToFavorites}
                  onCheckout={handleCheckout}
                />
              </div>

              <div className="order-1 lg:order-2 lg:col-span-7 flex justify-center">
                <ProductImage
                  src={product.localImage || "/uploads/images/fallback.jpg"}
                  alt={product.name}
                />
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 py-20 text-lg">
              Không tìm thấy sản phẩm.
            </div>
          )}
        </div>
      </div>

      {!loading && product && (
        <div className=" mx-auto mt-20 container px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
            <div className="lg:col-span-2 space-y-12">
              {product.link_youtube && (
                <ProductVideo
                  title={product.name}
                  youtubeId={product.link_youtube}
                />
              )}
              {product.content && (
                <ProductDescription content={product.content} />
              )}

              <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-2xl p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Hỗ trợ tận tay
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Chúng tôi cam kết hỗ trợ setup và sửa lỗi trong suốt quá
                      trình vận hành server game.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <ProductSupport
                img="/uploads/images/webapi.png"
                title="Tích hợp Web API"
                content="Xây dựng hệ thống Web User, Admin Dashboard, tích hợp Auto Bank, Giftcode, Shop Item tự động"
                button="Liên hệ thiết kế"
              />
              <ProductSupport
                img="/uploads/images/app.jpg"
                title="Ứng dụng đa nền tảng"
                content="Hỗ trợ đầy đủ Android, iOS, Web H5 với trải nghiệm tối ưu trên mọi thiết bị"
                button="Tư vấn tích hợp"
              />
              <div className="bg-white w-full text-black border border-gray-200 rounded-2xl p-6">
                <h4 className="font-semibold text-lg mb-3">
                  Cần hỗ trợ nhanh?
                </h4>
                <a
                  href="https://zalo.me/0865811722"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
                >
                  Chat ngay với Zalo
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-gray-200 ">
        <LatestProducts />
      </div>
      <Footer />

      {showModal === 1 && (
        <CartModal
          title="Thêm vào yêu thích thành công"
          items={cartItems}
          onRemove={handleRemoveCartModal}
          onClose={() => setShowModal(0)}
        />
      )}

      {showModal === 2 && (
        <CheckoutModal
          title="Chọn gói kỹ thuật"
          items={checkoutItems}
          onClose={() => setShowModal(0)}
        />
      )}
    </>
  );
}
