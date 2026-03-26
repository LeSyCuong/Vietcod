"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFloppyDisk,
  faUpload,
  faPen,
  faPlus,
  faTrashCan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import dynamic from "next/dynamic";
import { DataItem } from "@/app/[locale]/types/items";
import LangTabs from "./LangTabs";
import { authAxiosInstance } from "../../utils/axiosInstance";

const RichTextEditor = dynamic(
  () => import("@/app/[locale]/admin/components/RichTextEditor"),
  { ssr: false }
);

const LANGUAGES = ["vi", "en", "ja", "ko", "zh"];

type MultiLangForm = {
  [lang: string]: Partial<DataItem>;
};

type Props = {
  componentId: number;
  data: DataItem[];
  editing: DataItem | null;
  en_point: string;
  onClose: () => void;
  onUpdate: () => void;
};

export default function Modal({
  componentId,
  data,
  editing,
  en_point,
  onClose,
  onUpdate,
}: Props) {
  const [multiLangForm, setMultiLangForm] = useState<MultiLangForm>({});
  const [activeLang, setActiveLang] = useState("vi");
  const imgRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null); // Dùng ref riêng cho video
  const [showAddButton, setShowAddButton] = useState(false);
  const [showVideoInput, setShowVideoInput] = useState(false);

  const url_backend = process.env.NEXT_PUBLIC_URL_BACKEND!;

  /**
   * Hàm chuẩn hóa URL để hiển thị preview
   */
  const resolveImageUrl = (path: string | undefined | null) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `${url_backend}${path.startsWith("/") ? path : `/${path}`}`;
  };

  // ===== Xử lý giao diện theo componentId =====
  useEffect(() => {
    const url = window.location.href;

    if (
      componentId === 5 &&
      (url.includes("page=services") ||
        url.includes("page=materials") ||
        url.includes("page=equipment"))
    ) {
      setShowAddButton(true);
    } else {
      setShowAddButton(false);
    }

    if (componentId === 4 && url.includes("page=white_top")) {
      setShowVideoInput(true);
    } else {
      setShowVideoInput(false);
    }
  }, [componentId]);

  // ===== Gán dữ liệu ban đầu =====
  useEffect(() => {
    const initial: MultiLangForm = {};

    LANGUAGES.forEach((lang) => {
      if (editing) {
        const matched = data.find(
          (d) =>
            d.componentId === componentId &&
            d.lang === lang &&
            d.index === editing.index
        );
        initial[lang] = matched
          ? { ...matched }
          : { componentId, lang, index: editing.index };
      } else {
        initial[lang] = { componentId, lang, index: 0 };
      }
    });

    setMultiLangForm(initial);
    setActiveLang("vi");
  }, [editing, componentId, data]);

  const handleChange = (lang: string, key: keyof DataItem, value: any) => {
    setMultiLangForm((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], [key]: value },
    }));
  };

  // ===== Upload file lên Backend =====
  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await authAxiosInstance.post(`/config/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 403) {
        alert("Chỉ có admin mới có thể thực hiện!");
        return null;
      }
      const result = res.data;
      // Trả về relative path từ Backend
      return result.success && result.filePath ? result.filePath : null;
    } catch (err) {
      console.error("Upload failed", err);
      return null;
    }
  };

  // ===== Xóa ảnh hiển thị =====
  const handleDeleteImage = () => {
    setMultiLangForm((prev) => {
      const updated = { ...prev };
      LANGUAGES.forEach((lang) => {
        updated[lang] = { ...updated[lang], img: undefined };
      });
      return updated;
    });
  };

  // ===== Chọn ảnh upload =====
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const path = await uploadFile(file);
    if (path) {
      setMultiLangForm((prev) => {
        const updated = { ...prev };
        LANGUAGES.forEach((lang) => {
          updated[lang] = { ...updated[lang], img: path };
        });
        return updated;
      });
    }
  };

  // ===== Lưu dữ liệu =====
  const handleSave = async () => {
    const method = editing ? "PATCH" : "POST";

    try {
      await Promise.all(
        LANGUAGES.map(async (lang) => {
          // Chỉ lưu relative path vào Database
          const payload = {
            ...multiLangForm[lang],
            componentId,
            lang,
            img: multiLangForm["vi"].img || null,
            video: multiLangForm["vi"].video || null,
          };

          const url =
            method === "POST"
              ? en_point
              : `${en_point}/${multiLangForm[lang].id}`;

          if (method === "POST") {
            await authAxiosInstance.post(url, payload);
          } else {
            await authAxiosInstance.patch(url, payload);
          }
        })
      );

      onUpdate();
      onClose();
    } catch (err) {
      console.error("Save failed:", err);
      alert("Lưu thất bại, vui lòng kiểm tra console!");
    }
  };

  return (
    <div className="text-gray-800 fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative p-6">
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
        >
          <FontAwesomeIcon icon={faXmark} size="lg" />
        </button>
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          {editing ? (
            <>
              <FontAwesomeIcon icon={faPen} /> Chỉnh sửa
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faPlus} /> Thêm mới
            </>
          )}
        </h3>
        <LangTabs
          activeLang={activeLang}
          setActiveLang={setActiveLang}
          languages={LANGUAGES}
        />

        {!showVideoInput && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 mt-4">
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Ảnh
              </label>
              <div className="flex items-center gap-4">
                {multiLangForm["vi"]?.img && (
                  <div className="relative group">
                    <Image
                      src={resolveImageUrl(multiLangForm["vi"].img)}
                      alt="preview"
                      width={100}
                      height={60}
                      className="rounded-lg border object-cover shadow"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={handleDeleteImage}
                      className="cursor-pointer absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white text-[10px] w-5 h-5 rounded-full shadow flex items-center justify-center"
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  ref={imgRef}
                  className="hidden"
                />
                <button
                  onClick={() => imgRef.current?.click()}
                  className="cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow flex items-center gap-2 transition"
                >
                  <FontAwesomeIcon icon={faUpload} />
                  {multiLangForm["vi"]?.img ? "Thay ảnh" : "Chọn ảnh"}
                </button>
              </div>
            </div>
          </div>
        )}

        {showVideoInput && (
          <div className="col-span-2 mt-4">
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Video
            </label>
            <div className="flex flex-col gap-4">
              {multiLangForm["vi"]?.video && (
                <div className="relative group w-full max-w-[300px]">
                  <video
                    src={resolveImageUrl(multiLangForm["vi"].video)}
                    controls
                    className="rounded-lg border object-cover shadow w-full"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setMultiLangForm((prev) => {
                        const updated = { ...prev };
                        LANGUAGES.forEach((lang) => {
                          updated[lang] = {
                            ...updated[lang],
                            video: undefined,
                          };
                        });
                        return updated;
                      });
                    }}
                    className="cursor-pointer absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white text-[10px] w-5 h-5 rounded-full shadow flex items-center justify-center"
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </div>
              )}

              <input
                type="file"
                accept="video/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const path = await uploadFile(file);
                  if (path) {
                    setMultiLangForm((prev) => {
                      const updated = { ...prev };
                      LANGUAGES.forEach((lang) => {
                        updated[lang] = { ...updated[lang], video: path };
                      });
                      return updated;
                    });
                  }
                }}
                ref={videoRef}
                className="hidden"
              />

              <button
                onClick={() => videoRef.current?.click()}
                className="cursor-pointer w-fit px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow flex items-center gap-2 transition"
              >
                <FontAwesomeIcon icon={faUpload} />
                {multiLangForm["vi"]?.video ? "Thay video" : "Chọn video"}
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Title ({activeLang})
            </label>
            <input
              value={multiLangForm[activeLang]?.title || ""}
              onChange={(e) =>
                handleChange(activeLang, "title", e.target.value)
              }
              className="w-full border border-gray-300 px-3 py-2 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          <div className="col-span-2">
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Content ({activeLang})
            </label>
            <RichTextEditor
              value={multiLangForm[activeLang]?.content || ""}
              onChange={(val) => handleChange(activeLang, "content", val)}
            />
          </div>

          {showAddButton && (
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Description ({activeLang})
              </label>
              <RichTextEditor
                value={multiLangForm[activeLang]?.description || ""}
                onChange={(val) => handleChange(activeLang, "description", val)}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={handleSave}
            className="cursor-pointer px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow flex items-center gap-2 transition"
          >
            <FontAwesomeIcon icon={faFloppyDisk} />
            Lưu tất cả
          </button>
          <button
            onClick={onClose}
            className="cursor-pointer px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg shadow transition"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}
