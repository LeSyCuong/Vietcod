"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Input from "./Input";
import { Product } from "./ProductTable";
import { authAxiosInstance } from "../../utils/axiosInstance";

const RichTextEditor = dynamic(
  () => import("@/app/[locale]/admin/components/RichTextEditor"),
  { ssr: false }
);

interface ProductFormProps {
  initial?: Product | null;
  onSave: (data: Product) => void;
  onCancel: () => void;
}

export default function ProductForm({
  initial,
  onSave,
  onCancel,
}: ProductFormProps) {
  const [form, setForm] = useState<Product>(
    initial || {
      name: "",
      img: "",
      img_demo: "",
      price: 0,
      category: "",
      content: "",
      link_youtube: "",
      link_source: "",
      link_view: "",
    }
  );
  const [uploading, setUploading] = useState(false);

  // Lấy URL Backend
  const url_backend = process.env.NEXT_PUBLIC_URL_BACKEND!;

  /**
   * Hàm chuẩn hóa URL chỉ dùng để HIỂN THỊ (Preview).
   * Không dùng hàm này khi lưu vào State, để tránh lưu cứng domain vào DB.
   */
  const resolveImageUrl = (val: string) => {
    if (!val) return "";
    if (val.startsWith("http://") || val.startsWith("https://")) return val;
    return `${url_backend}${val.startsWith("/") ? val : `/${val}`}`;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  // Upload ảnh
  const handleUploadImage = async (file: File, field: "img" | "img_demo") => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await authAxiosInstance.post(`/config/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 403) {
        alert("Chỉ có admin mới có thể thực hiện!");
        return;
      }

      const result = res.data;
      if (result.success && result.filePath) {
        // Lưu relative path vào state (để gửi lên server khi Save)
        setForm((prev) => ({ ...prev, [field]: result.filePath }));
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload ảnh thất bại!");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Tên sản phẩm"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <Input
          label="Danh mục (3d,2d,th,kh,3q,h5,tb)"
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        />
        <Input
          label="Giá"
          name="price"
          type="number"
          min="0"
          value={form.price}
          onChange={handleChange}
        />
        <Input
          label="Link YouTube"
          name="link_youtube"
          value={form.link_youtube}
          onChange={handleChange}
        />
        <Input
          label="Link Source"
          name="link_source"
          value={form.link_source}
          onChange={handleChange}
        />
        <Input
          label="Link View"
          name="link_view"
          value={form.link_view}
          onChange={handleChange}
        />

        {/* Ảnh chính */}
        <div className="col-span-2">
          <label className="block text-gray-500 mb-1">Link ảnh / Upload</label>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="URL ảnh"
              value={form.img}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, img: e.target.value }))
              }
              className="flex-1 border border-gray-300 rounded-lg p-2"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files?.[0] &&
                handleUploadImage(e.target.files[0], "img")
              }
              className="border border-gray-300 rounded-lg p-2 cursor-pointer"
            />
          </div>
          {form.img && (
            <div className="mt-2">
              <span className="text-xs text-gray-400 mb-1 block">Preview:</span>
              <img
                src={resolveImageUrl(form.img)} // SỬA: Dùng hàm resolve để hiển thị
                alt="Ảnh"
                className="max-w-[200px] h-auto rounded border bg-gray-50 object-contain"
              />
            </div>
          )}
        </div>

        {/* Ảnh demo */}
        <div className="col-span-2">
          <label className="block text-gray-500 mb-1">
            Link ảnh demo / Upload
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="URL ảnh demo"
              value={form.img_demo}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, img_demo: e.target.value }))
              }
              className="flex-1 border border-gray-300 rounded-lg p-2"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files?.[0] &&
                handleUploadImage(e.target.files[0], "img_demo")
              }
              className="border border-gray-300 rounded-lg p-2 cursor-pointer"
            />
          </div>
          {form.img_demo && (
            <div className="mt-2">
              <span className="text-xs text-gray-400 mb-1 block">Preview:</span>
              <img
                src={resolveImageUrl(form.img_demo)} // SỬA: Dùng hàm resolve để hiển thị
                alt="Ảnh demo"
                className="max-w-[200px] h-auto rounded border bg-gray-50 object-contain"
              />
            </div>
          )}
        </div>

        {/* Rich text */}
        <div className="col-span-2">
          <label className="block text-gray-500 mb-1">Nội dung chi tiết</label>
          <RichTextEditor
            value={form.content}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, content: value }))
            }
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={uploading}
          className={`px-5 py-2 rounded-lg text-white transition ${
            uploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {uploading ? "Đang upload..." : "Lưu"}
        </button>
      </div>
    </form>
  );
}
