"use client";

import dynamic from "next/dynamic";

const HeaderClient = dynamic(() => import("./HeaderClient"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center p-4 text-gray-500">
      <span className="animate-spin h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full mr-2" />
      <span>Đang tải header...</span>
    </div>
  ),
});

export default function HeaderWrapper() {
  return <HeaderClient />;
}
