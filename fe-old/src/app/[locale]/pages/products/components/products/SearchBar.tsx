import { FaSearch } from "react-icons/fa";

export default function SearchBar({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (val: string) => void;
}) {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-2xl ">
      <div className="relative">
        <input
          type="text"
          className="w-full border border-gray-300 rounded-lg py-3 pl-4 pr-12 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200"
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700"
        >
          <FaSearch size={18} />
        </button>
      </div>
    </form>
  );
}
