"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { authAxiosInstance } from "../../utils/axiosInstance";

// --- Types
interface Order {
  id: number;
  code: string;
  name: string;
  price: number;
  user_id: number | null;
  product_id: number;
  created_at: string;
  updated_at?: string;
  status: string;
  link?: string;
}

// --- Helpers
const formatCurrency = (v: number) =>
  v.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const groupByDay = (orders: Order[]) => {
  const map = new Map<string, { date: string; total: number; count: number }>();
  orders.forEach((o) => {
    const key = o.created_at.slice(0, 10);
    const cur = map.get(key) || { date: key, total: 0, count: 0 };
    cur.total += o.price;
    cur.count += 1;
    map.set(key, cur);
  });
  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
};

const lastNDays = (n: number) => {
  const arr: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    arr.push(d.toISOString().slice(0, 10));
  }
  return arr;
};

const exportToCsv = (rows: any[], filename = "orders.csv") => {
  if (!rows || !rows.length) return;
  const keys = Object.keys(rows[0]);
  const csv = [
    keys.join(","),
    ...rows.map((r) => keys.map((k) => JSON.stringify(r[k] ?? "")).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// -----------------------------------------------------
// ⭐ MAIN PAGE UI
// -----------------------------------------------------
export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rangeDays, setRangeDays] = useState<number>(30);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const PAGE_SIZE = 10;

  // ---------------- Load API ----------------
  useEffect(() => {
    let mounted = true;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await authAxiosInstance.get("/orders");
        const data = res.data;
        // if API wraps data in { data: [...] }
        const list: Order[] = Array.isArray(data) ? data : data?.data ?? [];
        if (mounted) setOrders(list);
      } catch (err) {
        setError("Không thể tải API, đang dùng dữ liệu mẫu.");
        if (mounted) setOrders(generateDemoOrders(90));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchOrders();
    return () => {
      mounted = false;
    };
  }, []);

  // ---------------- Derived ----------------
  const ordersInRange = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - (rangeDays - 1));
    return orders.filter((o) => new Date(o.created_at) >= cutoff);
  }, [orders, rangeDays]);

  const totalRevenue = useMemo(
    () => ordersInRange.reduce((s, o) => s + o.price, 0),
    [ordersInRange]
  );
  const totalOrders = ordersInRange.length;
  const avgOrder = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;

  const byDay = useMemo(() => {
    const days = lastNDays(rangeDays);
    const grouped = groupByDay(ordersInRange);
    const map = new Map(grouped.map((g) => [g.date, g]));
    return days.map((d) => ({ date: d, total: map.get(d)?.total || 0 }));
  }, [ordersInRange, rangeDays]);

  const refundRate = useMemo(() => {
    if (!ordersInRange.length) return 0;
    const refunded = ordersInRange.filter(
      (o) => o.status === "refunded" || o.status === "cancelled"
    ).length;
    return Math.round((refunded / ordersInRange.length) * 1000) / 10;
  }, [ordersInRange]);

  // ---------------- Table: search + filter + pagination ----------------
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (!q) return true;
      return (
        o.code.toLowerCase().includes(q) ||
        o.name.toLowerCase().includes(q) ||
        String(o.product_id).includes(q)
      );
    });
  }, [orders, query, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ---------------- UI ----------------
  return (
    <main className="px-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
              Doanh thu
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Tổng quan doanh thu & đơn hàng
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-500">
              {loading ? "Đang tải..." : error ?? "Dữ liệu thật"}
            </div>
            <select
              className="px-4 py-2 rounded-xl border shadow-sm bg-white"
              value={rangeDays}
              onChange={(e) => setRangeDays(Number(e.target.value))}
            >
              <option value={7}>7 ngày</option>
              <option value={30}>30 ngày</option>
              <option value={90}>90 ngày</option>
            </select>
          </div>
        </header>

        {/* KPI CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <Kpi
            title="Tổng doanh thu"
            value={formatCurrency(totalRevenue)}
            sub={`Trong ${rangeDays} ngày`}
          />
          <Kpi
            title="Tổng đơn hàng"
            value={String(totalOrders)}
            sub={`Trong ${rangeDays} ngày`}
          />
          <Kpi title="Trung bình/đơn" value={formatCurrency(avgOrder)} />
          <div className="bg-white rounded-2xl p-4 shadow flex flex-col justify-between">
            <div>
              <div className="text-sm text-slate-500">Tỉ lệ hoàn</div>
              <div className="mt-2 text-2xl font-bold">{refundRate}%</div>
            </div>
            <div className="text-xs text-slate-400 mt-3">
              Đơn hoàn / tổng đơn
            </div>
          </div>
        </section>

        {/* CHART */}
        <section className="mt-8 bg-white rounded-3xl shadow-xl p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Doanh thu theo ngày</h3>
            <div className="text-sm text-slate-500">
              Từ {byDay[0]?.date ?? "-"} →{" "}
              {byDay[byDay.length - 1]?.date ?? "-"}
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={byDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis
                  tickFormatter={(v) =>
                    Number(v) >= 1000
                      ? `${Math.round(Number(v) / 1000)}k`
                      : String(v)
                  }
                />
                <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* TABLE */}
        <section className="mt-10 bg-white rounded-3xl shadow-lg p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Danh sách đơn hàng</h3>

            <div className="flex items-center gap-3">
              <input
                type="text"
                className="px-3 py-2 border rounded-lg"
                placeholder="Tìm mã, tên, product id..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
              />

              <select
                className="px-3 py-2 border rounded-lg"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="refunded">Refunded</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <button
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-teal-500 text-white rounded-lg shadow"
                onClick={() => exportToCsv(filtered, "orders.csv")}
              >
                Export CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl">
            <table className="w-full text-sm min-w-[800px]">
              <thead>
                <tr className="bg-slate-100 text-slate-700 text-left">
                  <th className="p-3">#</th>
                  <th className="p-3">Mã</th>
                  <th className="p-3">Tên</th>
                  <th className="p-3">Giá</th>
                  <th className="p-3">Ngày</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Sản phẩm</th>
                  <th className="p-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((o, idx) => (
                  <tr
                    key={o.id}
                    className="border-b hover:bg-slate-50 transition"
                  >
                    <td className="p-3 text-slate-500">
                      {(page - 1) * PAGE_SIZE + idx + 1}
                    </td>
                    <td className="p-3 font-medium">{o.code}</td>
                    <td className="p-3">{o.name}</td>
                    <td className="p-3">{formatCurrency(o.price)}</td>
                    <td className="p-3">
                      {new Date(o.created_at).toLocaleString()}
                    </td>
                    <td className="p-3">{o.user_id ?? "-"}</td>
                    <td className="p-3">{o.product_id}</td>
                    <td className="p-3 capitalize">
                      <StatusPill status={o.status} />
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-slate-500">
                      Không có đơn hàng phù hợp
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-slate-500">
              Hiển thị {(page - 1) * PAGE_SIZE + 1} -{" "}
              {Math.min(page * PAGE_SIZE, filtered.length)} / {filtered.length}{" "}
              đơn
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(1)}
                className="px-3 py-2 rounded-lg border"
                disabled={page === 1}
              >
                « Đầu
              </button>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-2 rounded-lg border"
                disabled={page === 1}
              >
                Trước
              </button>
              <div className="px-4 py-2 border rounded-lg font-semibold">
                {page} / {totalPages}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-2 rounded-lg border"
                disabled={page === totalPages}
              >
                Tiếp
              </button>
              <button
                onClick={() => setPage(totalPages)}
                className="px-3 py-2 rounded-lg border"
                disabled={page === totalPages}
              >
                Cuối »
              </button>
            </div>
          </div>
        </section>

        <footer className="mt-8 text-center text-sm text-slate-500">
          File component: <code>app/dashboard/page.tsx</code>
        </footer>
      </div>
    </main>
  );
}

// --- Small components
function Kpi({
  title,
  value,
  sub,
}: {
  title: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow flex flex-col justify-between">
      <div>
        <div className="text-sm text-slate-500">{title}</div>
        <div className="mt-2 text-2xl font-bold">{value}</div>
      </div>
      {sub && <div className="text-xs text-slate-400 mt-3">{sub}</div>}
    </div>
  );
}

function StatusPill({ status }: { status?: string }) {
  const s = (status || "unknown").toLowerCase();
  const map: Record<string, string> = {
    paid: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    refunded: "bg-rose-100 text-rose-800",
    cancelled: "bg-rose-50 text-rose-700",
  };
  const cls = map[s] || "bg-slate-100 text-slate-700";
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${cls}`}>
      {status}
    </span>
  );
}

// --- Utilities for demo data and top product
function generateDemoOrders(days = 30): Order[] {
  const list: Order[] = [];
  const now = new Date();
  let id = 1;
  for (let i = 0; i < days; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const ordersPerDay = Math.floor(Math.random() * 6); // 0..5
    for (let j = 0; j < ordersPerDay; j++) {
      const price = Math.floor((Math.random() * 5 + 1) * 100000); // 100k..600k
      list.push({
        id: id++,
        code: `ORD-${d.toISOString().slice(0, 10).replace(/-/g, "")}-${j}`,
        name: `Sản phẩm ${Math.floor(Math.random() * 12) + 1}`,
        price,
        user_id: Math.random() > 0.2 ? Math.floor(Math.random() * 1000) : null,
        product_id: Math.floor(Math.random() * 12) + 1,
        created_at: new Date(
          d.getFullYear(),
          d.getMonth(),
          d.getDate(),
          Math.floor(Math.random() * 23),
          Math.floor(Math.random() * 59)
        ).toISOString(),
        status: Math.random() > 0.95 ? "refunded" : "paid",
        link: undefined,
      });
    }
  }
  return list;
}

function topProduct(orders: Order[]) {
  if (!orders.length) return null;
  const count = new Map<number, number>();
  orders.forEach((o) =>
    count.set(o.product_id, (count.get(o.product_id) || 0) + 1)
  );
  const top = Array.from(count.entries()).sort((a, b) => b[1] - a[1])[0];
  return top ? `#${top[0]} (${top[1]} đơn)` : null;
}
