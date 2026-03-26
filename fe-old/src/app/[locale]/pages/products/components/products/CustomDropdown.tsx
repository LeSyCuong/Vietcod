import { useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import clsx from "clsx";

type Option = { label: string; value: string | number | null };

type Props = {
  label: string;
  options: Option[];
  value: string | number | null;
  onChange: (value: string | number | null) => void;
};

export default function CustomDropdown({
  label,
  options,
  value,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);

  const selected = options.find((opt) => opt.value === value);

  return (
    <div className="w-full">
      <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
        {label}
      </label>

      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="w-full rounded-md flex items-center justify-between border border-gray-300 bg-white px-4 py-3 text-left hover:border-gray-400 transition-colors"
        >
          <span className="text-sm text-gray-900">
            {selected?.label || `-- Chọn --`}
          </span>
          <IoChevronDown
            className={`text-gray-500 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <div className="absolute rounded-md top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-lg z-50 max-h-64 overflow-y-auto">
            {options.map((opt) => (
              <button
                key={String(opt.value)}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                  opt.value === value
                    ? "bg-black text-white hover:bg-gray-900"
                    : "text-gray-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
