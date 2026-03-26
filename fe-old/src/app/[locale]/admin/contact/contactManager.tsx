"use client";

import { useEffect, useState } from "react";
import { authAxiosInstance } from "../../utils/axiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPen,
  faTrash,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

type Contact = {
  id: number;
  user: string;
  name?: string;
  email: string;
  phone?: string;
  message?: string;
  service?: string;
  ip?: string;
  createdAt: string;
};

type Props = {
  title: string;
  filterMode: "full" | "emailOnly";
};

const ITEMS_PER_PAGE = 10;

export default function ContactManager({ title, filterMode }: Props) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [viewing, setViewing] = useState<Contact | null>(null);
  const [form, setForm] = useState<Partial<Contact>>({});
  const [creating, setCreating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [filter, setFilter] = useState({
    id: "",
    user: "",
    name: "",
    email: "",
    phone: "",
    service: "",
    ip: "",
  });

  const fetchContacts = async () => {
    try {
      const res = await authAxiosInstance.post("/contact/all");
      setContacts(res.data?.data || []);
    } catch (err: any) {
      if (err.response?.status === 403) {
        alert("Chỉ admin mới có thể thực hiện");
      } else {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Xác nhận xoá?")) return;

    try {
      await authAxiosInstance.delete(`/contact/${id}`);
      fetchContacts();
    } catch (err: any) {
      if (err.response?.status === 403) {
        alert("Chỉ admin mới có thể thực hiện");
      } else {
        console.error(err);
      }
    }
  };

  const handleUpdate = async () => {
    if (!editing) return;

    try {
      await authAxiosInstance.put(`/contact/${editing.id}`, form);
      setEditing(null);
      fetchContacts();
    } catch (err: any) {
      if (err.response?.status === 403) {
        alert("Chỉ admin mới có thể thực hiện");
      } else {
        console.error(err);
      }
    }
  };

  const handleCreate = async () => {
    try {
      await authAxiosInstance.post("/contact/send", form);
      setCreating(false);
      setForm({});
      fetchContacts();
    } catch (err: any) {
      if (err.response?.status === 403) {
        alert("Chỉ admin mới có thể thực hiện");
      } else {
        console.error(err);
      }
    }
  };

  const filtered = contacts
    .filter(
      (c) =>
        (!filter.name ||
          (c.name &&
            c.name.toLowerCase().includes(filter.name.toLowerCase()))) &&
        (!filter.email ||
          c.email.toLowerCase().includes(filter.email.toLowerCase())) &&
        (!filter.phone || (c.phone && c.phone.includes(filter.phone))) &&
        (!filter.ip || (c.ip && c.ip.includes(filter.ip))) &&
        (!filter.service ||
          (c.service && c.service.includes(filter.service))) &&
        (!filter.user ||
          (c.user &&
            c.user
              .toString()
              .toLowerCase()
              .includes(filter.user.toLowerCase())))
    )
    .filter((c) =>
      filterMode === "full"
        ? c.name || c.phone || c.message || c.service || c.user
        : !c.name && !c.phone && !c.message && !c.service && !c.user
    );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-full py-6 mt-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          {title}
        </h1>
        <button
          onClick={() => {
            setCreating(true);
            setForm({});
          }}
          className="cursor-pointer inline-flex items-center gap-2 rounded-full border border-blue-600 bg-white text-blue-600 font-semibold px-5 py-2 shadow-md hover:bg-blue-600 hover:text-white transition"
          aria-label="Thêm liên hệ mới"
        >
          <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
          <span>Thêm</span>
        </button>
      </div>

      {/* Bảng */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <table className="min-w-[1000px] w-full text-sm table-fixed border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="bg-gray-100 text-xs text-gray-600 select-none">
              {[
                "user",
                "name",
                "email",
                "phone",
                "service",
                "message",
                "ip",
              ].map((field) => (
                <th key={field} className="px-4 py-3">
                  <input
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder={field.toUpperCase()}
                    value={filter[field as keyof typeof filter]}
                    onChange={(e) =>
                      setFilter({
                        ...filter,
                        [field]: e.target.value,
                      })
                    }
                    aria-label={`Lọc theo ${field}`}
                  />
                </th>
              ))}
              <th className="px-4 py-3">Ngày</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length > 0 ? (
              paginated.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-gray-200 hover:bg-blue-50 transition"
                >
                  <td className="p-3 font-medium text-gray-800 text-center">
                    {c.user || "-"}
                  </td>
                  <td className="p-3 font-medium text-gray-800 text-center">
                    {c.name || "-"}
                  </td>
                  <td className="p-3 font-medium text-blue-600 text-center break-all">
                    {c.email}
                  </td>
                  <td className="p-3 font-medium text-gray-800 text-center">
                    {c.phone || "-"}
                  </td>
                  <td className="p-3 font-medium text-gray-800 text-center">
                    {c.service || "-"}
                  </td>
                  <td className="p-3 font-medium text-gray-800 text-center truncate max-w-[150px]">
                    {c.message || "-"}
                  </td>
                  <td className="p-3 font-medium text-gray-800 text-center">
                    {c.ip || "-"}
                  </td>
                  <td className="p-3 font-medium text-gray-800 text-center text-gray-500 whitespace-nowrap">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 flex justify-center gap-3 text-lg">
                    <button
                      onClick={() => setViewing(c)}
                      className="p-2 cursor-pointer rounded-full bg-blue-600 hover:bg-blue-800 text-white shadow-md transition"
                      aria-label="Xem chi tiết"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button
                      onClick={() => {
                        setEditing(c);
                        setForm(c);
                      }}
                      className="p-2 cursor-pointer rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md transition"
                      aria-label="Chỉnh sửa"
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-2 cursor-pointer rounded-full bg-red-600 hover:bg-red-700 text-white shadow-md transition"
                      aria-label="Xoá"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="text-center py-8 text-gray-400 italic select-none"
                >
                  Không tìm thấy dữ liệu.
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

      {/* Modal Xem */}
      {viewing && (
        <Modal onClose={() => setViewing(null)} title="Chi tiết liên hệ">
          <div className="text-gray-900 space-y-4 text-base">
            <DetailRow label="Họ tên" value={viewing.name || "(Không có)"} />
            <DetailRow label="Email" value={viewing.email} />
            <DetailRow
              label="Số điện thoại"
              value={viewing.phone || "(Không có)"}
            />
            <DetailRow label="Dịch vụ" value={viewing.service || "(Trống)"} />
            <DetailRow label="Nội dung" value={viewing.message || "(Trống)"} />
            <DetailRow label="IP" value={viewing.ip || "(Không có)"} />
            <DetailRow
              label="Ngày tạo"
              value={new Date(viewing.createdAt).toLocaleString()}
            />
          </div>
        </Modal>
      )}

      {/* Modal Sửa */}
      {editing && (
        <Modal onClose={() => setEditing(null)} title="Chỉnh sửa liên hệ">
          <FormFields form={form} setForm={setForm} />
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setEditing(null)}
              className="cursor-pointer px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Huỷ
            </button>
            <button
              onClick={handleUpdate}
              className="cursor-pointer px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md transition"
            >
              Lưu
            </button>
          </div>
        </Modal>
      )}

      {/* Modal Thêm */}
      {creating && (
        <Modal onClose={() => setCreating(false)} title="Thêm liên hệ mới">
          <FormFields form={form} setForm={setForm} />
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setCreating(false)}
              className="cursor-pointer px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Huỷ
            </button>
            <button
              onClick={handleCreate}
              className="cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition"
            >
              Thêm
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// Modal component nâng cấp hiện đại, dễ nhìn, chuẩn doanh nghiệp
function Modal({
  children,
  onClose,
  title,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-8 relative">
        <h2
          id="modal-title"
          className="text-2xl font-extrabold text-gray-900 mb-6 select-none"
        >
          {title}
        </h2>
        <button
          onClick={onClose}
          aria-label="Đóng modal"
          className="cursor-pointer absolute top-5 right-5 text-gray-400 hover:text-gray-800 text-3xl font-bold focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
        >
          &times;
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
}

// Form nhập liệu với style đồng bộ
function FormFields({
  form,
  setForm,
}: {
  form: Partial<Contact>;
  setForm: (f: Partial<Contact>) => void;
}) {
  const inputClass =
    "w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition";

  return (
    <div className="space-y-5">
      <input
        type="text"
        className={inputClass}
        placeholder="Họ tên"
        value={form.name || ""}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        aria-label="Họ tên"
      />
      <input
        type="email"
        className={inputClass}
        placeholder="Email"
        value={form.email || ""}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        aria-label="Email"
      />
      <input
        type="tel"
        className={inputClass}
        placeholder="Số điện thoại"
        value={form.phone || ""}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        aria-label="Số điện thoại"
      />
      <input
        type="text"
        className={inputClass}
        placeholder="Dịch vụ yêu cầu"
        value={form.service || ""}
        onChange={(e) => setForm({ ...form, service: e.target.value })}
        aria-label="Dịch vụ yêu cầu"
      />
      <textarea
        className={inputClass}
        placeholder="Nội dung"
        rows={3}
        value={form.message || ""}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        aria-label="Nội dung"
      />
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex gap-2">
      <strong className="min-w-[100px] text-gray-700">{label}:</strong>
      <span className="break-words text-gray-900">{value}</span>
    </p>
  );
}
