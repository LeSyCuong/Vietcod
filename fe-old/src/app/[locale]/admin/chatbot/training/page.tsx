"use client";

import { useEffect, useState } from "react";
import { authAxiosInstance } from "@/app/[locale]/utils/axiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPen,
  faTrash,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

type CompanyInfo = {
  id: number;
  title: string;
  content: string;
  img?: string;
  category?: string;
};

export default function CompanyInfoPage() {
  const [items, setItems] = useState<CompanyInfo[]>([]);
  const [filter, setFilter] = useState({
    id: "",
    title: "",
    category: "",
  });

  const [editing, setEditing] = useState<CompanyInfo | null>(null);
  const [viewing, setViewing] = useState<CompanyInfo | null>(null);
  const [form, setForm] = useState<Partial<CompanyInfo>>({});
  const [creating, setCreating] = useState(false);

  const fetchData = async () => {
    try {
      const res = await authAxiosInstance.get("/company-info/all");
      setItems(res.data?.data || res.data || []);
    } catch (err: any) {
      if (err.response?.status === 403) {
        alert("Chỉ admin mới có thể xem");
      } else {
        console.error("Fetch data failed:", err);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn xoá?")) return;

    try {
      await authAxiosInstance.delete(`/company-info/${id}`);
      fetchData();
    } catch (err: any) {
      if (err.response?.status === 403) {
        alert("Chỉ admin mới có thể thực hiện");
      } else {
        console.error("Delete failed:", err);
      }
    }
  };

  const handleUpdate = async () => {
    if (!editing) return;

    try {
      await authAxiosInstance.put(`/company-info/${editing.id}`, form);
      setEditing(null);
      fetchData();
    } catch (err: any) {
      if (err.response?.status === 403) {
        alert("Chỉ admin mới có thể thực hiện");
      } else {
        console.error("Update failed:", err);
      }
    }
  };

  const handleCreate = async () => {
    try {
      await authAxiosInstance.post("/company-info", form);
      setCreating(false);
      setForm({});
      fetchData();
    } catch (err: any) {
      if (err.response?.status === 403) {
        alert("Chỉ admin mới có thể thực hiện");
      } else {
        console.error("Create failed:", err);
      }
    }
  };

  const filtered = items.filter(
    (item) =>
      (!filter.id || String(item.id).includes(filter.id)) &&
      (!filter.title ||
        item.title.toLowerCase().includes(filter.title.toLowerCase())) &&
      (!filter.category ||
        (item.category || "")
          .toLowerCase()
          .includes(filter.category.toLowerCase()))
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div className="max-w-full mt-15">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Training thông tin công ty
          </h1>
          <button
            onClick={() => {
              setCreating(true);
              setForm({});
            }}
            className="cursor-pointer inline-flex items-center gap-2 rounded-full border border-blue-600 bg-white text-blue-600 font-semibold px-5 py-2 shadow-md hover:bg-blue-600 hover:text-white transition duration-300 focus:outline-none focus:ring-4 focus:ring-blue-400"
            aria-label="Thêm mục mới"
          >
            <FontAwesomeIcon icon={faPlus} className="w-5 h-5" />
            <span>Thêm</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <table className="min-w-[1000px] w-full text-sm table-fixed border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="bg-gray-100 text-xs text-gray-600">
                <th className="p-3 min-w-[60px]">
                  <input
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                    placeholder="ID"
                    value={filter.id}
                    onChange={(e) =>
                      setFilter({ ...filter, id: e.target.value })
                    }
                    aria-label="Lọc theo ID"
                  />
                </th>
                <th className="p-3 min-w-[220px]">
                  <input
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                    placeholder="Tiêu đề"
                    value={filter.title}
                    onChange={(e) =>
                      setFilter({ ...filter, title: e.target.value })
                    }
                    aria-label="Lọc theo Tiêu đề"
                  />
                </th>
                <th className="p-3 text-gray-400 text-center min-w-[320px]">
                  Nội dung
                </th>
                <th className="p-3 min-w-[180px]">
                  <input
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                    placeholder="Danh mục"
                    value={filter.category}
                    onChange={(e) =>
                      setFilter({ ...filter, category: e.target.value })
                    }
                    aria-label="Lọc theo Danh mục"
                  />
                </th>
                <th className="p-3 text-gray-400 text-center min-w-[140px]">
                  Hành động
                </th>
              </tr>
            </thead>

            <tbody>
              {paginated.length ? (
                paginated.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-200 hover:bg-blue-50 transition"
                  >
                    <td className="p-3 font-medium text-gray-800 text-center">
                      {item.id}
                    </td>
                    <td className="p-3 font-semibold text-gray-900 truncate">
                      {item.title}
                    </td>
                    <td className="py-5  max-w-[300px] text-gray-600 text-xs line-clamp-4 whitespace-normal">
                      {item.content}
                    </td>
                    <td className="p-3 text-gray-700 text-center">
                      {item.category || "-"}
                    </td>
                    <td className="p-3 flex justify-center gap-3">
                      <button
                        onClick={() => setViewing(item)}
                        className="cursor-pointer p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        title="Xem chi tiết"
                        aria-label={`Xem chi tiết mục ${item.title}`}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        onClick={() => {
                          setEditing(item);
                          setForm(item);
                        }}
                        className="cursor-pointer p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                        title="Chỉnh sửa"
                        aria-label={`Chỉnh sửa mục ${item.title}`}
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="cursor-pointer p-2 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-md focus:outline-none focus:ring-1 focus:ring-red-500"
                        title="Xoá"
                        aria-label={`Xoá mục ${item.title}`}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-6 text-center text-gray-400 italic select-none"
                  >
                    Không có dữ liệu.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-2 select-none">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="cursor-pointer px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            aria-label="Trang trước"
          >
            Trước
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-semibold transition 
          ${
            page === currentPage
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
          }`}
              aria-current={page === currentPage ? "page" : undefined}
              aria-label={`Trang ${page}`}
            >
              {page}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="cursor-pointer px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            aria-label="Trang sau"
          >
            Sau
          </button>
        </div>
      )}
      {/* Modals */}
      {viewing && (
        <Modal
          title="Chi tiết thông tin công ty"
          onClose={() => setViewing(null)}
        >
          <div className="space-y-2 text-sm">
            <p>
              <strong>ID:</strong> {viewing.id}
            </p>
            <p>
              <strong>Tiêu đề:</strong> {viewing.title}
            </p>
            <p>
              <strong>Nội dung:</strong> {viewing.content}
            </p>
            <p>
              <strong>Danh mục:</strong> {viewing.category || "(Không có)"}
            </p>
          </div>
        </Modal>
      )}

      {editing && (
        <Modal
          title="Chỉnh sửa thông tin công ty"
          onClose={() => setEditing(null)}
        >
          <CompanyForm form={form} setForm={setForm} />
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setEditing(null)}
              className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Huỷ
            </button>
            <button
              onClick={handleUpdate}
              className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Lưu
            </button>
          </div>
        </Modal>
      )}

      {creating && (
        <Modal
          title="Thêm thông tin công ty"
          onClose={() => setCreating(false)}
        >
          <CompanyForm form={form} setForm={setForm} />
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setCreating(false)}
              className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Huỷ
            </button>
            <button
              onClick={handleCreate}
              className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Thêm
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

{
  /* Modal */
}
function Modal({
  children,
  title,
  onClose,
}: {
  children: React.ReactNode;
  title: string;
  onClose: () => void;
}) {
  return (
    <div
      className="text-gray-800 fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white max-h-[85%] rounded-2xl shadow-2xl max-w-xl w-full relative p-8">
        <h2 id="modal-title" className="text-2xl font-bold text-gray-900 mb-6">
          {title}
        </h2>
        <button
          onClick={onClose}
          aria-label="Đóng modal"
          className="cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-3xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
        >
          &times;
        </button>

        {/* phần nội dung có scroll */}
        <div className="overflow-y-auto max-h-[60vh] pr-2">{children}</div>
      </div>
    </div>
  );
}

function CompanyForm({
  form,
  setForm,
}: {
  form: Partial<CompanyInfo>;
  setForm: (f: Partial<CompanyInfo>) => void;
}) {
  const inputClass =
    "w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

  return (
    <div className="space-y-5 max-h-[85%]">
      <input
        type="text"
        className={inputClass}
        placeholder="Tiêu đề"
        value={form.title || ""}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        aria-label="Tiêu đề"
      />
      <textarea
        className={inputClass}
        rows={4}
        placeholder="Nội dung"
        value={form.content || ""}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
        aria-label="Nội dung"
      />
      <input
        type="text"
        className={inputClass}
        placeholder="Danh mục"
        value={form.category || ""}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        aria-label="Danh mục"
      />
    </div>
  );
}
