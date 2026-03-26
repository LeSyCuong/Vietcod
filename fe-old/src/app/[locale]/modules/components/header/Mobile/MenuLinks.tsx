"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  openSubMenu: string | null;
  setOpenSubMenu: React.Dispatch<React.SetStateAction<string | null>>;
}

const MenuLinks: React.FC<Props> = ({ openSubMenu, setOpenSubMenu }) => {
  const pathname = usePathname();

  const isHome = pathname === "/" || pathname === "/vi" || pathname === "/en";

  const textClass = isHome ? "text-white" : "text-[var(--primary)]";

  const toggleSub = (key: string) => {
    setOpenSubMenu(openSubMenu === key ? null : key);
  };

  return (
    <>
      <Link className={`${textClass} transition`} href="/pages/products">
        Mã nguồn
      </Link>
      <Link className={`${textClass} transition`} href="/developers">
        Thiết kế web game
      </Link>

      {/* Dịch vụ */}
      <div className="w-full">
        <button
          onClick={() => toggleSub("dichvu")}
          className={`${textClass} transition w-full text-center`}
        >
          Dịch vụ
          <span
            className={`inline-block ml-2 transition-transform duration-300 ${
              openSubMenu === "dichvu" ? "rotate-180" : "rotate-0"
            }`}
          >
            <i className="fa-solid fa-chevron-down text-xs relative -top-[1px]" />
          </span>
        </button>
        <ul
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            openSubMenu === "dichvu" ? "max-h-[200px] mt-1" : "max-h-0"
          }`}
        >
          <li>
            <Link
              href="/thue-vps"
              className={`block py-1 text-sm ${textClass}`}
            >
              Thuê VPS
            </Link>
          </li>
          <li>
            <Link
              href="/thue-hosting"
              className={`block py-1 text-sm ${textClass}`}
            >
              Thuê Hosting
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default MenuLinks;
