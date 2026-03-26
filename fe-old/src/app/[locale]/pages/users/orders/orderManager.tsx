"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/app/[locale]/utils/axiosInstance";
import { useUserStore } from "@/app/[locale]/stores/userStore";
import CheckoutModal from "../../products/components/views/CheckoutModel";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

type Order = {
  id: number;
  user_id: number;
  name: string;
  code: string;
  price: number;
  status: "pending" | "success" | "cancel";
  created_at: string;
  updated_at: string;
  link: string;
};

type Props = {
  title: string;
};

export default function OrdersManager({ title }: Props) {
  const { user } = useUserStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [search, setSearch] = useState({
    code: "",
    name: "",
    status: "",
    dateCreated: "",
    dateUpdated: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const ordersPerPage = 10;

  const loadOrders = async () => {
    if (!user) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await axiosInstance.get(`/orders/user/${user.id}`);
      const data = res.data;

      if (!Array.isArray(data)) {
        setOrders([]);
        if (data?.statusCode >= 400) {
          setErrorMsg(data?.message || "Không thể tải đơn hàng");
        }
      } else {
        setOrders(data);
      }
    } catch (error: any) {
      console.error("Lỗi loadOrders:", error);
      if (error.response?.data?.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg("Lỗi kết nối máy chủ");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadOrders();
  }, [user]);

  useEffect(() => {
    let filtered = orders.filter((order) => {
      return (
        order.code.toLowerCase().includes(search.code.toLowerCase()) &&
        order.name.toLowerCase().includes(search.name.toLowerCase()) &&
        (search.status === "" || order.status === search.status) &&
        (search.dateCreated === "" ||
          new Date(order.created_at)
            .toLocaleDateString()
            .includes(search.dateCreated)) &&
        (search.dateUpdated === "" ||
          new Date(order.updated_at)
            .toLocaleDateString()
            .includes(search.dateUpdated))
      );
    });

    filtered.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    setFilteredOrders(filtered);
  }, [orders, search, sortOrder]);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handleSearch = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: string
  ) => setSearch({ ...search, [field]: e.target.value });

  const handleSort = () => setSortOrder(!sortOrder);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <ArrowPathIcon className="w-6 h-6 animate-spin mr-2" />
        Đang tải tài nguyên...
      </div>
    );
  }

  return (
    <div className="max-w-full mt-10 px-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[var(--primary)]">{title}</h1>
        <button
          onClick={loadOrders}
          className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-4xl text-blue-600 hover:bg-blue-50 border border-blue-400 transition hover:scale-105"
        >
          <ArrowPathIcon className="w-5 h-5 animate-spin-slow hover:animate-spin" />
          Reload
        </button>
      </div>

      <div className="bg-white overflow-x-auto rounded-2xl shadow-lg border border-gray-200">
        <table className="min-w-[900px] w-full text-sm table-fixed border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-xs text-gray-600">
              <th className="p-3 min-w-[80px]">
                <input
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                  placeholder="Mã tài nguyên"
                  value={search.code}
                  onChange={(e) => handleSearch(e, "code")}
                />
              </th>
              <th className="p-3 min-w-[200px]">
                <input
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                  placeholder="Tên"
                  value={search.name}
                  onChange={(e) => handleSearch(e, "name")}
                />
              </th>
              <th className="p-3 text-center min-w-[120px]">Credit sử dụng</th>
              <th className="p-3 text-center min-w-[140px]">
                <select
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                  value={search.status}
                  onChange={(e) => handleSearch(e, "status")}
                >
                  <option value="">Tất cả</option>
                  <option value="pending">Chưa xác nhận</option>
                  <option value="success">Đã xác nhận</option>
                  <option value="cancel">Đã huỷ</option>
                </select>
              </th>
              <th
                className="p-3 text-center min-w-[140px] cursor-pointer"
                onClick={handleSort}
              >
                Ngày tạo {sortOrder ? "↑" : "↓"}
              </th>
              <th className="p-3 text-center min-w-[140px]">Ngày cập nhật</th>
              <th className="p-3 text-center min-w-[120px]">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {currentOrders.length ? (
              currentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-200 hover:bg-blue-50 transition"
                >
                  <td className="p-3 text-center font-medium text-gray-800">
                    {order.code}
                  </td>
                  <td className="p-3 font-semibold text-gray-900 truncate">
                    {order.name}
                  </td>
                  <td className="p-3 text-center font-semibold text-gray-800">
                    {order.price.toLocaleString()} VND
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "success"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.status === "pending"
                        ? "Chưa xác nhận"
                        : order.status === "success"
                        ? "Đã xác nhận"
                        : "Đã huỷ"}
                    </span>
                  </td>
                  <td className="p-3 text-center text-gray-600">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-center text-gray-600">
                    {new Date(order.updated_at).toLocaleDateString()}
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    {order.status === "pending" && (
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="cursor-pointer px-4 py-1 rounded-full bg-yellow-50 text-yellow-400 border border-yellow-400 hover:bg-yellow-100 transition whitespace-nowrap"
                      >
                        Nạp Credit
                      </button>
                    )}
                    {order.status === "success" && (
                      <a
                        href={`/pages/users/orders/${order.id}`}
                        className="px-4 py-1 rounded-full text-blue-600 border border-blue-400 bg-blue-50 hover:bg-blue-100 transition text-center whitespace-nowrap"
                      >
                        Xem file
                      </a>
                    )}
                    {order.status === "cancel" && (
                      <span className="px-4 py-1 rounded-full bg-red-500 text-white font-medium">
                        Đã huỷ
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="py-6 text-center text-gray-400 italic select-none"
                >
                  Không có tài nguyên.
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
            className="cursor-pointer px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
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
            className="cursor-pointer px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Sau
          </button>
        </div>
      )}

      {/* Modal */}
      {selectedOrder && (
        <CheckoutModal
          title="Thanh toán đơn hàng"
          items={[
            {
              id: selectedOrder.id,
              name: selectedOrder.name,
              price: selectedOrder.price,
            },
          ]}
          onClose={() => setSelectedOrder(null)}
          existingInvoiceCode={selectedOrder.code}
          onPaymentSuccess={loadOrders}
        />
      )}
    </div>
  );
}
