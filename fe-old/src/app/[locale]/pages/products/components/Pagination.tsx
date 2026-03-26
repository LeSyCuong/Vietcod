type Props = {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  totalPages,
  currentPage,
  onPageChange,
}: Props) {
  const getPages = () => {
    const pages = [];
    const showPages = 3;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i <= showPages ||
        i > totalPages - showPages ||
        Math.abs(i - currentPage) <= 1
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  return (
    <div className="mt-10 flex justify-center items-center flex-wrap gap-2 text-sm font-medium text-[var(--primary)]">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="cursor-pointer px-3 py-1 border border-black/50 rounded-md hover:border-black hover:bg-gray-100 disabled:opacity-40 transition"
      >
        ← Trước
      </button>

      {getPages().map((p, idx) =>
        typeof p === "number" ? (
          <button
            key={idx}
            onClick={() => onPageChange(p)}
            className={`cursor-pointer px-3 py-1 rounded-md border transition-all duration-200 ${
              currentPage === p
                ? "text-[var(--primary)] bg-[var(--background)] border-[var(--primary)]/60 scale-105"
                : "bg-[var(--primary)] text-[var(--background)] hover:scale-105"
            }`}
          >
            {p}
          </button>
        ) : (
          <span key={idx} className="text-gray-400 px-2">
            ...
          </span>
        )
      )}

      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="cursor-pointer px-3 py-1 border border-black/50 rounded-md hover:border-black hover:bg-gray-100 disabled:opacity-40 transition"
      >
        Tiếp →
      </button>
    </div>
  );
}
