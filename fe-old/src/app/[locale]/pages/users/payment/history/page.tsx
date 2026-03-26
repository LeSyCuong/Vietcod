"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/app/[locale]/utils/axiosInstance";
import { useUserStore } from "@/app/[locale]/stores/userStore";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

type Transaction = {
  id: number;
  user_id: number;
  description: string;
  amount: number;
  transaction_id: number;
  created_at: string;
};

export default function TransactionHistory() {
  const { user } = useUserStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [search, setSearch] = useState({
    description: "",
    amount: "",
    dateCreated: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;
  const [sortOrder, setSortOrder] = useState(true);

  const loadTransactions = async () => {
    if (!user) return;

    try {
      const res = await axiosInstance.get("/bank/history");

      const mapped = (res.data || []).map((tx: any) => ({
        ...tx,
      }));

      setTransactions(mapped);
    } catch (error) {
      console.error("❌ Lỗi khi tải lịch sử giao dịch:", error);
    }
  };

  useEffect(() => {
    if (user) loadTransactions();
  }, [user]);

  const handleSearch = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => setSearch({ ...search, [field]: e.target.value });

  useEffect(() => {
    const filtered = transactions.filter((tx) => {
      return (
        tx.description
          .toLowerCase()
          .includes(search.description.toLowerCase()) &&
        (search.amount === "" ||
          tx.amount.toString().includes(search.amount)) &&
        (search.dateCreated === "" ||
          new Date(tx.created_at)
            .toLocaleDateString()
            .includes(search.dateCreated))
      );
    });

    filtered.sort((a, b) =>
      sortOrder
        ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    setFilteredTransactions(filtered);
  }, [transactions, search, sortOrder]);

  const indexOfLast = currentPage * transactionsPerPage;
  const indexOfFirst = indexOfLast - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirst,
    indexOfLast
  );
  const totalPages = Math.ceil(
    filteredTransactions.length / transactionsPerPage
  );

  const handleSort = () => setSortOrder(!sortOrder);

  return (
    <div className="max-w-full mt-10 px-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[var(--primary)]">
          Lịch sử giao dịch
        </h1>
        <button
          onClick={loadTransactions}
          className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-4xl text-blue-600 hover:bg-blue-50 border border-blue-400 transition hover:scale-105"
        >
          <ArrowPathIcon className="w-5 h-5 animate-spin-slow hover:animate-spin" />
          Reload
        </button>
      </div>

      <div className="bg-white overflow-x-auto rounded-2xl shadow-lg border border-gray-200">
        <table className="min-w-[800px] w-full text-sm table-fixed border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-xs text-gray-600">
              <th className="p-3 min-w-[200px]">
                <input
                  placeholder="Nội dung"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                  value={search.description}
                  onChange={(e) => handleSearch(e, "description")}
                />
              </th>
              <th className="p-3 text-center min-w-[120px]">
                <input
                  placeholder="Số Credit nhận"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                  value={search.amount}
                  onChange={(e) => handleSearch(e, "amount")}
                />
              </th>
              <th
                className="p-3 text-center min-w-[140px] cursor-pointer"
                onClick={handleSort}
              >
                Ngày tạo {sortOrder ? "↑" : "↓"}
              </th>
              <th className="p-3 text-center min-w-[140px]">ID giao dịch</th>
            </tr>
          </thead>

          <tbody>
            {currentTransactions.length ? (
              currentTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b border-gray-200 hover:bg-blue-50 transition"
                >
                  <td className="p-3 font-semibold text-gray-900 break-words whitespace-normal">
                    {tx.description}
                  </td>

                  <td className="p-3 text-center font-semibold text-gray-800">
                    {tx.amount.toLocaleString()} Credit
                  </td>
                  <td className="p-3 text-center text-gray-600">
                    {new Date(tx.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-center text-gray-600">
                    {tx.transaction_id}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="py-6 text-center text-gray-400 italic select-none"
                >
                  Không có giao dịch.
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
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Trước
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
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
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}
