"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPen,
  faTrash,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { authAxiosInstance } from "../../utils/axiosInstance";
import Modal from "./Modal";
import ProductForm from "./ProductForm";
import DetailRow from "./DetailRow";

export type Product = {
  id?: number;
  name: string;
  img: string;
  img_demo: string;
  price: number;
  category: string;
  content: string;
  link_youtube: string;
  link_source: string;
  link_view: string;
};

export default function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState({ id: "", name: "", category: "" });
  const [modal, setModal] = useState<{
    type: "create" | "edit" | "view" | null;
    data?: Product | null;
  }>({ type: null, data: null });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Lấy URL Backend từ biến môi trường
  const url_backend = process.env.NEXT_PUBLIC_URL_BACKEND!;

  /**
   * Hàm chuẩn hóa URL ảnh để hiển thị trong Table và Modal View
   * Distinguished Engineer Note: Luôn kiểm tra prefix để tránh lặp URL
   */
  const resolveImageUrl = (img: string) => {
    if (!img) return "/uploads/images/fallback.jpg";
    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    // Gắn url_backend cho các đường dẫn nội bộ (relative paths)
    return `${url_backend}${img.startsWith("/") ? img : `/${img}`}`;
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await authAxiosInstance.get("/sanpham-game/admin");
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Không thể tải danh sách sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSave = async (data: Product) => {
    try {
      if (modal.type === "edit" && modal.data?.id) {
        await authAxiosInstance.patch(`/sanpham-game/${modal.data.id}`, data);
      } else {
        await authAxiosInstance.post("/sanpham-game", data);
      }
      setModal({ type: null });
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Không thể lưu sản phẩm.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn xoá sản phẩm này?")) return;
    try {
      await authAxiosInstance.delete(`/sanpham-game/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Không thể xoá sản phẩm.");
    }
  };

  const filtered = products.filter(
    (p) =>
      (!filter.id || String(p.id).includes(filter.id)) &&
      (!filter.name ||
        p.name.toLowerCase().includes(filter.name.toLowerCase())) &&
      (!filter.category ||
        p.category.toLowerCase().includes(filter.category.toLowerCase()))
  );
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div>
      {/* Button Thêm */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>

        <button
          onClick={() => setModal({ type: "create" })}
          className="inline-flex items-center gap-2 rounded-full border border-blue-600 bg-white text-blue-600 px-5 py-2 hover:bg-blue-600 hover:text-white"
        >
          <FontAwesomeIcon icon={faPlus} />
          Thêm
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-auto">
        <table className="min-w-[1000px] w-full text-sm border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="bg-gray-100 text-xs text-gray-600 select-none">
              <th className="px-4 py-3">
                <input
                  placeholder="ID"
                  className="w-full border rounded-md px-4 py-1"
                  value={filter.id}
                  onChange={(e) => setFilter({ ...filter, id: e.target.value })}
                />
              </th>
              <th className="px-4 py-3">
                <input
                  placeholder="Tên sản phẩm"
                  className="w-full border rounded-md px-2 py-1"
                  value={filter.name}
                  onChange={(e) =>
                    setFilter({ ...filter, name: e.target.value })
                  }
                />
              </th>
              <th className="px-4 py-3">
                <input
                  placeholder="Danh mục"
                  className="w-full border rounded-md px-2 py-1"
                  value={filter.category}
                  onChange={(e) =>
                    setFilter({ ...filter, category: e.target.value })
                  }
                />
              </th>
              <th className="px-4 py-3 text-center">Giá</th>
              <th className="px-4 py-3 text-center">YouTube</th>
              <th className="px-4 py-3 text-center">Ảnh</th>
              <th className="px-4 py-3 text-center">Ảnh Demo</th>
              <th className="px-4 py-3">Mô tả</th>
              <th className="px-4 py-3 text-center">Link Source</th>
              <th className="px-4 py-3 text-center">Link View</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={11} className="text-center py-8 text-gray-400">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : paginated.length ? (
              paginated.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-gray-200 hover:bg-blue-50"
                >
                  <td className="p-5 font-medium">{p.id}</td>
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3 text-center font-semibold text-blue-600">
                    {p.price.toLocaleString("vi-VN")}₫
                  </td>
                  <td className="p-3 text-center">
                    {p.link_youtube ? (
                      <a
                        href={`https://www.youtube.com/watch?v=${p.link_youtube}`}
                        target="_blank"
                        className="text-blue-600 underline"
                      >
                        Xem
                      </a>
                    ) : (
                      "(Trống)"
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {p.img ? (
                      <img
                        src={resolveImageUrl(p.img)}
                        className="w-16 h-16 object-contain mx-auto rounded border bg-white"
                        alt="Product"
                      />
                    ) : (
                      "(Trống)"
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {p.img_demo ? (
                      <img
                        src={resolveImageUrl(p.img_demo)}
                        className="w-16 h-16 object-contain mx-auto rounded border bg-white"
                        alt="Demo"
                      />
                    ) : (
                      "(Trống)"
                    )}
                  </td>
                  <td className="p-3 max-w-[250px] truncate text-xs">
                    {p.content?.replace(/<[^>]*>/g, "").slice(0, 100)}...
                  </td>
                  <td className="p-3 text-center">
                    {p.link_source ? (
                      <a
                        href={p.link_source}
                        target="_blank"
                        className="text-blue-600"
                      >
                        Xem
                      </a>
                    ) : (
                      "(Trống)"
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {p.link_view ? (
                      <a
                        className="text-blue-700 underline"
                        href={p.link_view}
                        target="_blank"
                      >
                        Link
                      </a>
                    ) : (
                      "(Trống)"
                    )}
                  </td>
                  <td className="px-4 py-3 flex justify-center gap-2">
                    <button
                      onClick={() => setModal({ type: "view", data: p })}
                      className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button
                      onClick={() => setModal({ type: "edit", data: p })}
                      className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition"
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id!)}
                      className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={11}
                  className="text-center py-8 italic text-gray-400"
                >
                  Không tìm thấy sản phẩm.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-2 select-none">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="cursor-pointer px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Trước
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-semibold transition ${
                page === currentPage
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="cursor-pointer px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Sau
          </button>
        </div>
      )}

      {/* Modal */}
      {modal.type && (
        <Modal
          title={getModalTitle(modal.type)}
          onClose={() => setModal({ type: null })}
        >
          {modal.type === "view" && modal.data && (
            <>
              <DetailRow label="Tên" value={modal.data.name} />
              <DetailRow
                label="Ảnh"
                value={resolveImageUrl(modal.data.img)}
                type="image"
              />
              <DetailRow
                label="Ảnh Demo"
                value={resolveImageUrl(modal.data.img_demo)}
                type="image"
              />
              <DetailRow label="Danh mục" value={modal.data.category} />
              <DetailRow
                label="Giá"
                value={`${modal.data.price.toLocaleString()}₫`}
              />
              <DetailRow label="YouTube" value={modal.data.link_youtube} />
              <DetailRow label="Link Source" value={modal.data.link_source} />
              <DetailRow label="Link View" value={modal.data.link_view} />
              <DetailRow label="Mô tả" value={modal.data.content} type="html" />
            </>
          )}

          {(modal.type === "create" || modal.type === "edit") && (
            <ProductForm
              initial={modal.data}
              onSave={handleSave}
              onCancel={() => setModal({ type: null })}
            />
          )}
        </Modal>
      )}
    </div>
  );
}

function getModalTitle(type: string) {
  switch (type) {
    case "create":
      return "Thêm sản phẩm";
    case "edit":
      return "Chỉnh sửa sản phẩm";
    case "view":
      return "Chi tiết sản phẩm";
    default:
      return "";
  }
}
