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

type Account = {
  id: number;
  username: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  lock: number;
  created: string;
  updated: string;
  updatepass: string;
};

export default function UserPage() {
  const [users, setUsers] = useState<Account[]>([]);
  const [filter, setFilter] = useState({
    id: "",
    username: "",
    email: "",
    role: "",
    phone: "",
    created: "",
    updated: "",
    updatepass: "",
    lock: "",
  });

  const [editing, setEditing] = useState<Account | null>(null);
  const [viewing, setViewing] = useState<Account | null>(null);
  const [form, setForm] = useState<Partial<Account> & { password?: string }>(
    {}
  );
  const [creating, setCreating] = useState(false);
  const [page, setPage] = useState(1);

  const fetchUsers = async () => {
    try {
      const res = await authAxiosInstance.get("/account/all");
      setUsers(res.data?.data || []);
    } catch (err: any) {
      if (err.response?.status === 403) {
        alert("Chỉ admin mới có thể thực hiện");
      } else {
        console.error("Fetch users failed:", err);
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn xoá?")) return;

    try {
      await authAxiosInstance.delete(`/account/${id}`);
      fetchUsers();
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
      await authAxiosInstance.put(`/account/${editing.id}`, form);
      setEditing(null);
      fetchUsers();
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
      await authAxiosInstance.post("/account", form);
      setCreating(false);
      setForm({});
      fetchUsers();
    } catch (err: any) {
      if (err.response?.status === 403) {
        alert("Chỉ admin mới có thể thực hiện");
      } else {
        console.error("Create failed:", err);
      }
    }
  };

  const getDateOnly = (s: string | null | undefined) =>
    s ? s.substring(0, 10) : "";

  const filtered = users.filter(
    (u) =>
      (!filter.id || String(u.id).includes(filter.id)) &&
      (!filter.username ||
        u.username.toLowerCase().includes(filter.username.toLowerCase())) &&
      (!filter.email ||
        u.email.toLowerCase().includes(filter.email.toLowerCase())) &&
      (!filter.phone ||
        (u.phone || "").toLowerCase().includes(filter.phone.toLowerCase())) &&
      (!filter.role || u.role === filter.role) &&
      (!filter.lock || String(u.lock) === filter.lock) &&
      (!filter.created || getDateOnly(u.created).includes(filter.created)) &&
      (!filter.updated || getDateOnly(u.updated).includes(filter.updated)) &&
      (!filter.updatepass ||
        getDateOnly(u.updatepass).includes(filter.updatepass))
  );

  const pageSize = 10;
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <div className="max-w-full text-black mb-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Quản lý tài khoản
        </h1>
        <button
          onClick={() => {
            setCreating(true);
            setForm({});
          }}
          className="cursor-pointer inline-flex items-center gap-2 rounded-full border border-blue-600 bg-white text-blue-600 font-semibold px-5 py-2 shadow-md hover:bg-blue-600 hover:text-white transition"
        >
          <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
          <span>Thêm</span>
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-[1200px] w-full text-sm table-fixed border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="bg-gray-100 text-xs text-gray-600 select-none">
                {["id", "username", "email", "phone", "role", "lock"].map(
                  (field) => (
                    <th key={field} className="px-4 py-3">
                      {field === "role" ? (
                        <select
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                          value={filter.role}
                          onChange={(e) =>
                            setFilter({ ...filter, role: e.target.value })
                          }
                        >
                          <option value="">Role</option>
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : field === "lock" ? (
                        <select
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                          value={filter.lock}
                          onChange={(e) =>
                            setFilter({ ...filter, lock: e.target.value })
                          }
                        >
                          <option value="">Trạng thái</option>
                          <option value="0">Mở</option>
                          <option value="1">Khoá</option>
                        </select>
                      ) : (
                        <input
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                          placeholder={field.toUpperCase()}
                          value={filter[field as keyof typeof filter]}
                          onChange={(e) =>
                            setFilter({
                              ...filter,
                              [field]: e.target.value,
                            })
                          }
                        />
                      )}
                    </th>
                  )
                )}
                <th className="px-4 py-3">Ngày tạo</th>
                <th className="px-4 py-3">Cập nhật</th>
                <th className="px-4 py-3">Update Pass</th>
                <th className="px-4 py-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length > 0 ? (
                paginated.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-gray-200 hover:bg-blue-50 transition"
                  >
                    <td className="p-3 text-center">{u.id}</td>
                    <td className="p-3 font-medium text-gray-800 text-center">
                      {u.username}
                    </td>
                    <td className="p-3 text-blue-600 text-center break-all">
                      {u.email}
                    </td>
                    <td className="p-3 text-center">{u.phone || "-"}</td>
                    <td className="p-3 text-center capitalize">{u.role}</td>
                    <td
                      className={`p-3 text-center font-semibold ${
                        u.lock === 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {u.lock === 0 ? "Mở" : "Khoá"}
                    </td>
                    <td className="p-3 text-gray-500 text-center">
                      {new Date(u.created).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-gray-500 text-center">
                      {new Date(u.updated).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-gray-500 text-center">
                      {new Date(u.updatepass).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 flex justify-center gap-2 text-lg">
                      <button
                        onClick={() => setViewing(u)}
                        className="cursor-pointer p-2 rounded-full bg-blue-600 hover:bg-blue-800 text-white shadow-md transition"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        onClick={() => {
                          setEditing(u);
                          setForm(u);
                        }}
                        className="cursor-pointer p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md transition"
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="cursor-pointer p-2 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-md transition"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={10}
                    className="text-center py-8 text-gray-400 italic select-none"
                  >
                    Không tìm thấy dữ liệu.
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
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="cursor-pointer px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 transition"
          >
            Trước
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-semibold transition ${
                p === page
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="cursor-pointer px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 transition"
          >
            Sau
          </button>
        </div>
      )}
      {viewing && (
        <Modal onClose={() => setViewing(null)} title="Chi tiết tài khoản">
          <DetailRow label="ID" value={String(viewing.id)} />
          <DetailRow label="Tên đăng nhập" value={viewing.username} />
          <DetailRow label="Email" value={viewing.email} />
          <DetailRow
            label="Số điện thoại"
            value={viewing.phone || "(Không có)"}
          />
          <DetailRow label="Vai trò" value={viewing.role} />
          <DetailRow
            label="Trạng thái"
            value={viewing.lock === 0 ? "Mở" : "Khoá"}
          />
          <DetailRow
            label="Ngày tạo"
            value={new Date(viewing.created).toLocaleString()}
          />
          <DetailRow
            label="Cập nhật"
            value={new Date(viewing.updated).toLocaleString()}
          />
          <DetailRow
            label="Update Pass"
            value={new Date(viewing.updatepass).toLocaleString()}
          />
        </Modal>
      )}

      {editing && (
        <Modal onClose={() => setEditing(null)} title="Chỉnh sửa tài khoản">
          <FormFields form={form} setForm={setForm} mode="edit" />
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

      {creating && (
        <Modal onClose={() => setCreating(false)} title="Thêm tài khoản mới">
          <FormFields form={form} setForm={setForm} mode="create" />
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-8 relative">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6">{title}</h2>
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-5 right-5 text-gray-400 hover:text-gray-800 text-3xl font-bold"
        >
          &times;
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
}

function FormFields({
  form,
  setForm,
  mode,
}: {
  form: Partial<Account> & { password?: string };
  setForm: (f: Partial<Account> & { password?: string }) => void;
  mode: "create" | "edit";
}) {
  const inputClass =
    "w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition";

  return (
    <div className="space-y-5">
      <input
        type="text"
        className={inputClass}
        placeholder="Tên đăng nhập"
        value={form.username || ""}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <input
        type="email"
        className={inputClass}
        placeholder="Email"
        value={form.email || ""}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        className={inputClass}
        placeholder={
          mode === "create" ? "Mật khẩu" : "Mật khẩu mới (bỏ qua nếu không đổi)"
        }
        value={form.password || ""}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <input
        type="tel"
        className={inputClass}
        placeholder="Số điện thoại"
        value={form.phone || ""}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
      <select
        className={inputClass}
        value={form.role || "user"}
        onChange={(e) =>
          setForm({ ...form, role: e.target.value as "user" | "admin" })
        }
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <select
        className={inputClass}
        value={form.lock ?? 0}
        onChange={(e) => setForm({ ...form, lock: parseInt(e.target.value) })}
      >
        <option value={0}>Mở</option>
        <option value={1}>Khoá</option>
      </select>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex gap-2">
      <strong className="min-w-[140px] text-gray-700">{label}:</strong>
      <span className="break-words text-gray-900">{value}</span>
    </p>
  );
}
