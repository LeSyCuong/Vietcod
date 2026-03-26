"use client";

import { useEffect, useState } from "react";
import { authAxiosInstance } from "@/app/[locale]/utils/axiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";

type ChatbotHistory = {
  id: number;
  userId: number;
  role: string;
  text: string;
  created_at: string;
};

export default function ChatbotHistoryPage() {
  const [items, setItems] = useState<ChatbotHistory[]>([]);
  const [filter, setFilter] = useState({
    id: "",
    userId: "",
    role: "",
    text: "",
  });

  const [viewing, setViewing] = useState<ChatbotHistory | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchData = async () => {
    try {
      const res = await authAxiosInstance.get("/chatbot-history/all");
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

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn xoá?")) return;

    try {
      await authAxiosInstance.delete(`/chatbot-history/${id}`);
      fetchData();
    } catch (err: any) {
      if (err.response?.status === 403) {
        alert("Chỉ admin mới có thể thực hiện");
      } else {
        console.error("Delete failed:", err);
      }
    }
  };

  const filtered = items.filter(
    (item) =>
      (!filter.id || String(item.id).includes(filter.id)) &&
      (!filter.userId || String(item.userId).includes(filter.userId)) &&
      (!filter.role ||
        item.role.toLowerCase().includes(filter.role.toLowerCase())) &&
      (!filter.text ||
        item.text.toLowerCase().includes(filter.text.toLowerCase()))
  );

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
            Lịch sử hội thoại Chatbot
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <div className="">
            <table className="min-w-[1000px] w-full text-sm table-fixed border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-3 min-w-[60px]">
                    <input
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                      placeholder="ID"
                      value={filter.id}
                      onChange={(e) =>
                        setFilter({ ...filter, id: e.target.value })
                      }
                    />
                  </th>
                  <th className="p-3 min-w-[220px]">
                    <input
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                      placeholder="User ID"
                      value={filter.userId}
                      onChange={(e) =>
                        setFilter({ ...filter, userId: e.target.value })
                      }
                    />
                  </th>
                  <th className="p-3 min-w-[220px]">
                    <input
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                      placeholder="Role"
                      value={filter.role}
                      onChange={(e) =>
                        setFilter({ ...filter, role: e.target.value })
                      }
                    />
                  </th>
                  <th className="text-gray-400 px-4 py-3 min-w-[300px]">
                    Nội dung
                  </th>
                  <th className="text-gray-400 px-4 py-3 min-w-[140px] text-center">
                    Thời gian
                  </th>
                  <th className="text-gray-400 px-4 py-3 text-center">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-200 hover:bg-blue-50 transition"
                  >
                    <td className="p-3 font-medium text-gray-800 text-center">
                      {item.id}
                    </td>
                    <td className="p-3 font-medium text-gray-800 text-center">
                      {item.userId}
                    </td>
                    <td className="p-3 font-medium text-gray-800 text-center">
                      {item.role}
                    </td>
                    <td className="p-3 font-medium text-gray-800 text-center max-w-[400px] overflow-hidden text-xs text-gray-600 line-clamp-4">
                      {item.text}
                    </td>
                    <td className="p-3 font-medium text-gray-800 text-center text-center text-gray-500">
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                    <td className="p-3 font-medium text-gray-800 text-center flex justify-center gap-2">
                      <button
                        onClick={() => setViewing(item)}
                        className="cursor-pointer p-2 rounded-full bg-blue-600 hover:bg-blue-800 text-white"
                        title="Xem chi tiết"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="cursor-pointer p-2 rounded-full bg-red-600 hover:bg-red-700 text-white"
                        title="Xoá"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-4 text-gray-400 italic"
                    >
                      Không có dữ liệu.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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

      {/* Modal */}
      {viewing && (
        <Modal title="Chi tiết hội thoại" onClose={() => setViewing(null)}>
          <div className="space-y-2 text-sm">
            <p>
              <strong>ID:</strong> {viewing.id}
            </p>
            <p>
              <strong>User ID:</strong> {viewing.userId}
            </p>
            <p>
              <strong>Vai trò:</strong> {viewing.role}
            </p>
            <p>
              <strong>Nội dung:</strong> {viewing.text}
            </p>
            <p>
              <strong>Thời gian:</strong>{" "}
              {new Date(viewing.created_at).toLocaleString()}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
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
    <div className="fixed text-black inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg relative">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-2xl"
        >
          &times;
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
}
