"use client";

interface Props {
  show: boolean;
  isMobile?: boolean;
}

const SearchBar: React.FC<Props> = ({ show, isMobile = false }) => {
  const baseClass = `transition-all duration-500 ease-in-out overflow-hidden ${
    show ? "max-h-[100px] opacity-100 mt-2" : "max-h-0 opacity-0"
  }`;

  const wrapperClass = isMobile ? "md:hidden" : "hidden md:block";

  return (
    <div className={`${baseClass} ${wrapperClass}`}>
      <div className="px-4 flex gap-2 max-w-[800px] mx-auto">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
        <button
          className="px-4 py-2 bg-[var(--primary)] text-[var(--background)] rounded-md text-sm hover:opacity-90 transition"
          onClick={() => console.log("Searching...")}
        >
          Tìm
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
