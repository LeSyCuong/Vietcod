"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/app/[locale]/utils/axiosInstance";
import { useUserStore } from "@/app/[locale]/stores/userStore";

type Product = {
  id: number;
  name: string;
  img: string;
  price: number;
  category: string;
  content: string;
  link_youtube: string;
  link_source: string;
  paid: boolean;
};

export default function OrderView() {
  const { user } = useUserStore();
  const params = useParams();
  const orderId = params.id;
  const url_backend = process.env.NEXT_PUBLIC_URL_BACKEND;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProduct = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.get(
        `${url_backend}/sanpham-game/by-order/${orderId}`
      );

      const data = res.data;

      // Kiểm tra lỗi từ backend (nếu backend trả về status code 200 nhưng message lỗi)
      if (
        data?.status === 400 &&
        data?.message === "Sản phẩm chưa thanh toán"
      ) {
        setError(
          "Quý khách vui lòng thanh toán sản phẩm trước khi nhận thông tin game."
        );
        setProduct(null);
        return;
      }

      setProduct(data);
    } catch (err: any) {
      // Axios sẽ ném lỗi nếu status >= 400
      if (err.response) {
        if (
          err.response.status === 400 &&
          err.response.data?.message === "Sản phẩm chưa thanh toán"
        ) {
          setError(
            "Quý khách vui lòng thanh toán sản phẩm trước khi nhận thông tin game."
          );
        } else {
          setError(err.response.data?.message || "Có lỗi xảy ra");
        }
      } else {
        setError(err.message || "Có lỗi xảy ra");
      }
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && orderId) loadProduct();
  }, [user, orderId]);

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500">
        Đang tải thông tin game...
      </div>
    );
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  if (!product)
    return (
      <div className="p-6 text-center text-gray-400 italic">
        Không tìm thấy game.
      </div>
    );

  return (
    <div className="mx-auto mt-10">
      <h1 className="text-3xl font-bold text-[var(--primary)] mb-6">
        {product.name}
      </h1>

      <div className="bg-white overflow-x-auto rounded-2xl shadow-lg border border-gray-200">
        <table className="min-w-[600px] w-full text-sm table-fixed border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-xs text-gray-600">
              <th className="p-3 text-left min-w-[150px]">Thuộc tính</th>
              <th className="p-3 text-left min-w-[400px]">Giá trị</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="p-3 font-semibold text-gray-900">Tên game</td>
              <td className="p-3 text-gray-800">{product.name}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 font-semibold text-gray-900">Credit</td>
              <td className="p-3 text-gray-800">
                {product.price.toLocaleString()} Credit
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 font-semibold text-gray-900">Mô tả</td>
              <td className="m-3 text-gray-800 line-clamp-3 break-words overflow-hidden">
                {product.content}
              </td>
            </tr>

            {product.link_youtube && (
              <tr className="border-b border-gray-200">
                <td className="p-3 font-semibold text-gray-900">
                  Video review
                </td>
                <td className="p-3 text-blue-600 underline">
                  <a
                    href={`https://youtu.be/${product.link_youtube}`}
                    target="_blank"
                  >
                    Xem trên YouTube
                  </a>
                </td>
              </tr>
            )}
            <tr className="border-b border-gray-200">
              <td className="p-3 font-semibold text-gray-900">Liên hệ</td>
              <td className="p-3 flex flex-col md:flex-row gap-2 items-start md:items-center">
                <span className="text-gray-700 italic">
                  Chúng tôi sẽ sớm liên hệ với quý khách để bàn giao bộ file
                  game và hỗ trợ setup.
                </span>
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 font-semibold text-gray-900">
                Tải xuống / Liên hệ
              </td>
              <td className="p-3 flex flex-col items-start gap-2">
                {product.link_source ? (
                  <a
                    href={product.link_source}
                    target="_blank"
                    className="px-4 py-2 rounded-xl bg-blue-50 border border-blue-400 text-blue-600 hover:bg-blue-100 transition"
                  >
                    Tải xuống
                  </a>
                ) : (
                  <>
                    <span className="text-gray-700 italic">
                      Chúng tôi sẽ sớm liên hệ với quý khách để gửi bộ file
                      game. Quý khách có thể liên hệ ngay thông qua:
                    </span>
                    <a
                      href="https://zalo.me/0865811722"
                      target="_blank"
                      className=" px-4 py-2 rounded-xl bg-blue-50 border border-blue-400 text-blue-600 hover:bg-blue-100 transition inline-block"
                    >
                      Liên hệ Zalo
                    </a>
                  </>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
