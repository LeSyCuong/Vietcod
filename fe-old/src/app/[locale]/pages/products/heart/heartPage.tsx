"use client";

import { useEffect, useState } from "react";
import Header from "@/app/[locale]/modules/header/page";
import Footer from "@/app/[locale]/modules/footer/footer";
import ProductGrid from "../components/products/ProductGrid";
import Pagination from "../components/Pagination";

type Product = {
  id: number;
  name: string;
  localImage: string;
  price: number;
  category: string;
};

export default function HeartPage() {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const totalPages = Math.ceil(favorites.length / itemsPerPage);
  const paginatedItems = favorites.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <Header />
      <main className="max-w-[1240px] mx-auto px-4 pt-20">
        <h1 className="text-2xl font-bold text-[var(--primary)]">
          Danh sách yêu thích
        </h1>

        <ProductGrid products={paginatedItems} isLoading={loading} />

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </main>
      <Footer />
    </>
  );
}
