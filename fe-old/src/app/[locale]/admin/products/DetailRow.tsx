import React from "react";

interface DetailRowProps {
  label: string;
  value?: string;
  type?: "text" | "image" | "html";
}

export default function DetailRow({
  label,
  value = "",
  type = "text",
}: DetailRowProps) {
  const url_backend = process.env.NEXT_PUBLIC_URL_BACKEND!;

  /**
   * Hàm chuẩn hóa URL ảnh
   * Nếu là type image và không có http/https thì gắn thêm url_backend
   */
  const resolveImageUrl = (val: string) => {
    if (!val) return "";
    if (val.startsWith("http://") || val.startsWith("https://")) return val;
    return `${url_backend}${val.startsWith("/") ? val : `/${val}`}`;
  };

  let content;

  if (!value) {
    content = <span className="italic text-gray-400">(Trống)</span>;
  } else if (type === "image") {
    // Sử dụng resolveImageUrl để hiển thị ảnh từ Backend
    const fullImageUrl = resolveImageUrl(value);
    content = (
      <div className="flex flex-col gap-2">
        <img
          src={fullImageUrl}
          alt={label}
          className="max-w-[300px] h-auto rounded-lg border border-gray-200 shadow-sm bg-white object-contain"
        />
        <a
          href={fullImageUrl}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-blue-600 hover:underline inline-block"
        >
          Mở ảnh trong tab mới
        </a>
      </div>
    );
  } else if (type === "html") {
    content = (
      <div
        className="prose prose-sm max-w-none text-gray-900 border p-3 rounded-lg bg-gray-50"
        dangerouslySetInnerHTML={{ __html: value }}
      />
    );
  } else {
    content = (
      <span className="break-words text-gray-900 font-medium">{value}</span>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-5 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
      <strong className="min-w-[140px] text-gray-600 text-sm uppercase tracking-wider">
        {label}
      </strong>
      <div className="flex-1 overflow-hidden">{content}</div>
    </div>
  );
}
