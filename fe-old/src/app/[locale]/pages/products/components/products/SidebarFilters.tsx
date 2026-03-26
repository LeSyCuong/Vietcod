type PriceRange = {
  label: string;
  min?: number;
  max: number | null;
};

type Props = {
  categories: { label: string; value: string }[];
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  priceRanges: PriceRange[];
  selectedRange: PriceRange | null;
  setSelectedRange: (val: PriceRange | null) => void;
};

export default function SidebarFilters({
  categories,
  selectedCategory,
  setSelectedCategory,
  priceRanges,
  selectedRange,
  setSelectedRange,
}: Props) {
  return (
    <div className="hidden lg:block w-64 pr-8 border-r border-gray-200">
      <div className="sticky top-8">
        <div className="mb-10">
          <h3 className="text-md font-medium text-gray-700 uppercase tracking-wider mb-4">
            Thể loại
          </h3>
          <div className="space-y-2">
            {categories.map((c: any) => (
              <button
                key={c.value}
                onClick={() => setSelectedCategory(c.value)}
                className={`w-full cursor-pointer text-left px-3 py-2.5 text-sm transition-colors rounded ${
                  selectedCategory === c.value
                    ? "bg-[var(--primary)] text-[var(--background)]"
                    : "text-[var(--primary)] hover:bg-gray-200"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-md font-medium text-gray-700 uppercase tracking-wider mb-4">
            Mức Credit
          </h3>
          <div className="space-y-2">
            {priceRanges.map((range, index) => (
              <button
                key={index}
                onClick={() =>
                  range.label === "Tất cả"
                    ? setSelectedRange(null)
                    : setSelectedRange(range)
                }
                className={`w-full cursor-pointer text-left px-3 py-2.5 text-sm transition-colors rounded ${
                  (range.label === "Tất cả" && selectedRange === null) ||
                  selectedRange?.label === range.label
                    ? "bg-[var(--primary)] text-[var(--background)]"
                    : "text-[var(--primary)] hover:bg-gray-200"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
