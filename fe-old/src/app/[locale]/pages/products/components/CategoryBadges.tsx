import React from "react";

const categoryColorMap: Record<string, { text: string; bg: string }> = {
  th: { text: "text-red-700", bg: "bg-red-100" },
  kh: { text: "text-blue-700", bg: "bg-blue-100" },
  h5: { text: "text-yellow-700", bg: "bg-yellow-100" },
  "3d": { text: "text-indigo-700", bg: "bg-indigo-100" },
  "2d": { text: "text-pink-700", bg: "bg-pink-100" },
  "3q": { text: "text-green-700", bg: "bg-green-100" },
  tb: { text: "text-purple-700", bg: "bg-purple-100" },
};

const categoryMap: Record<string, string> = {
  th: "Tiên hiệp",
  kh: "Kiếm hiệp",
  h5: "Game H5",
  "3d": "Game 3D",
  "2d": "Game 2D",
  "3q": "Game Tam Quốc",
  tb: "Game Thẻ Bài",
};

export default function CategoryBadges({ codes }: { codes: string[] }) {
  return (
    <div className="mt-2 mb-2 flex flex-wrap gap-1">
      {codes.map((code) => {
        const color = categoryColorMap[code] || {
          text: "text-gray-700",
          bg: "bg-gray-100",
        };
        return (
          <span
            key={code}
            className={`text-xs font-medium px-2 py-0.5 rounded ${color.text} ${color.bg}`}
          >
            {categoryMap[code] || code}
          </span>
        );
      })}
    </div>
  );
}
