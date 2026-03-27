"use client";
import { CTA } from "@/components/cta";
import { ChangelogLight } from "@/components/svg/changelog";
import { PageIntro } from "@/components/template/page-intro";
import { MeteorLinesAngular } from "@/components/ui/meteorLines";
import { SearchX, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { type GameProduct } from "./data";
import { GameCard } from "./card";
import { FilterSidebar, PRICE_RANGES } from "./filter";

const ITEMS_PER_PAGE = 12;

export function TemplatesClient({
  initialGames,
}: {
  initialGames: GameProduct[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("category")?.split(",").filter(Boolean) || [],
  );
  const [priceFilter, setPriceFilter] = useState(
    searchParams.get("price") || "all",
  );
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1,
  );

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategories.length > 0)
      params.set("category", selectedCategories.join(","));
    if (priceFilter !== "all") params.set("price", priceFilter);
    if (currentPage > 1) params.set("page", currentPage.toString());

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [
    searchQuery,
    selectedCategories,
    priceFilter,
    currentPage,
    pathname,
    router,
  ]);

  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    initialGames.forEach((game) => {
      if (game.category) {
        game.category.split(",").forEach((c) => cats.add(c.trim()));
      }
    });
    return Array.from(cats).sort();
  }, [initialGames]);

  const filteredGames = useMemo(() => {
    const filtered = initialGames.filter((game) => {
      const searchContent = (game.content || "").replace(/<[^>]*>?/gm, "");
      const matchesSearch =
        game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        searchContent.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesCategory = true;
      if (selectedCategories.length > 0) {
        const gameCats = game.category
          ? game.category.split(",").map((c) => c.trim())
          : [];
        matchesCategory = selectedCategories.some((cat) =>
          gameCats.includes(cat),
        );
      }

      let matchesPrice = true;
      const range = PRICE_RANGES.find((r) => r.id === priceFilter);
      if (range && range.id !== "all") {
        matchesPrice = game.price >= range.min && game.price <= range.max;
      }

      return matchesSearch && matchesCategory && matchesPrice;
    });

    return filtered.sort((a, b) => b.id - a.id);
  }, [initialGames, searchQuery, selectedCategories, priceFilter]);

  const totalPages = Math.ceil(filteredGames.length / ITEMS_PER_PAGE);
  const paginatedGames = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredGames.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredGames, currentPage]);

  // 4. Handlers
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };
  const handleToggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
    setCurrentPage(1);
  };
  const handlePriceChange = (id: string) => {
    setPriceFilter(id);
    setCurrentPage(1);
  };
  const getPaginationRange = (current: number, total: number) => {
    const delta = 1; 
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= total; i++) {
      if (
        i === 1 ||
        i === total ||
        (i >= current - delta && i <= current + delta)
      ) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <div className="flex flex-col mx-auto pt-28 lg:pt-16 text-white/60">
      <div>
        <div className="relative -z-100 max-w-[1000px] mx-auto">
          <ChangelogLight className="w-full -top-52" />
        </div>
        <div className="w-full h-full overflow-clip -z-20">
          <MeteorLinesAngular
            number={1}
            xPos={0}
            speed={10}
            delay={5}
            className="overflow-hidden"
          />
          <MeteorLinesAngular
            number={1}
            xPos={0}
            speed={10}
            delay={0}
            className="overflow-hidden"
          />
          <MeteorLinesAngular
            number={1}
            xPos={100}
            speed={10}
            delay={7}
            className="overflow-hidden sm:hidden"
          />
          <MeteorLinesAngular
            number={1}
            xPos={100}
            speed={10}
            delay={2}
            className="overflow-hidden sm:hidden"
          />
          <MeteorLinesAngular
            number={1}
            xPos={200}
            speed={10}
            delay={7}
            className="overflow-hidden"
          />
          <MeteorLinesAngular
            number={1}
            xPos={200}
            speed={10}
            delay={2}
            className="overflow-hidden"
          />
          <MeteorLinesAngular
            number={1}
            xPos={400}
            speed={10}
            delay={5}
            className="overflow-hidden sm:hidden md:block"
          />
          <MeteorLinesAngular
            number={1}
            xPos={400}
            speed={10}
            delay={0}
            className="overflow-hidden sm:hidden md:block"
          />
        </div>
      </div>

      <PageIntro title="Hệ Thống Server Game">
        <p className="mt-6 text-base about-founders-text-gradient ">
          Khám phá các giải pháp vận hành Game chuyên nghiệp sẵn sàng triển
          khai.
        </p>
      </PageIntro>

      <div className="container mx-auto mt-24 overflow-hidden text-white">
        <div className="flex flex-col mb-24 lg:space-x-8 lg:flex-row">
          <FilterSidebar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            availableCategories={availableCategories}
            selectedCategories={selectedCategories}
            onToggleCategory={handleToggleCategory}
            priceFilter={priceFilter}
            onPriceChange={handlePriceChange}
          />

          <div className="flex-grow block w-full lg:w-3/4 mt-12 lg:mt-0">
            {filteredGames.length === 0 ? (
              <div className="animate-in relative fade-in-50 w-full flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-white/60 p-8 text-center">
                <div className="flex items-center justify-center w-20 h-20 border rounded-full border-white/60">
                  <SearchX />
                </div>
                <h2 className="mt-6 text-xl font-semibold">
                  Không tìm thấy Server phù hợp
                </h2>
                <p className="mt-2 text-sm text-white/60">
                  Vui lòng thử điều chỉnh lại bộ lọc.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                  {paginatedGames.map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center w-full gap-2 mt-16 flex-wrap">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center justify-center w-10 h-10 border rounded-lg border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none duration-200"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {getPaginationRange(currentPage, totalPages).map(
                      (page, index) => {
                        if (page === "...") {
                          return (
                            <span
                              key={`dots-${index}`}
                              className="px-2 text-white/30"
                            >
                              ...
                            </span>
                          );
                        }

                        return (
                          <button
                            key={`page-${page}`}
                            onClick={() => setCurrentPage(Number(page))}
                            className={`w-10 h-10 rounded-lg text-sm font-medium duration-200 ${
                              currentPage === page
                                ? "bg-white/85 border-white text-black"
                                : "border border-white/10 hover:bg-white/10 text-white"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      },
                    )}

                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="flex items-center justify-center w-10 h-10 border rounded-lg border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none duration-200"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <CTA />
    </div>
  );
}
