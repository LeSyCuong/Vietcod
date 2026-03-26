"use client";

import Link from "next/link";

interface Props {
  openMenu: string | null;
  setOpenMenu: React.Dispatch<React.SetStateAction<string | null>>;
  dropdownStyle: React.CSSProperties;
  dropdownOpenStyle: React.CSSProperties;
  isDark: boolean;
}

const MenuLinks: React.FC<Props> = ({
  openMenu,
  setOpenMenu,
  dropdownStyle,
  dropdownOpenStyle,
  isDark,
}) => {
  const dropdownBg = isDark ? "rgba(19, 19, 19, 1)" : "rgba(255, 255, 255, 1)";
  const dropdownBorder = isDark
    ? "rgba(255, 255, 255, 1)"
    : "rgba(160, 160, 160, 1)";
  return (
    <div className="flex items-center space-x-6 justify-center flex-1 whitespace-nowrap">
      <Link
        href="/pages/products"
        className="text-nav text-black hover:scale-103 transaction duration-500"
      >
        Mã nguồn
      </Link>
      <Link
        target="_blank"
        rel="noopener noreferrer"
        href="https://zalo.me/0865811722"
        className="text-nav text-black hover:scale-103 transaction duration-500"
      >
        Thiết kế web game
      </Link>
      <div
        className="relative"
        onMouseEnter={() => setOpenMenu("dichvu")}
        onMouseLeave={() => setOpenMenu(null)}
      >
        <button className="text-nav flex items-center gap-1 text-black">
          Dịch vụ
          <span
            className={`inline-block ${
              openMenu === "dichvu" ? "rotate-180" : "rotate-0"
            }`}
          >
            <i className="fa-solid fa-chevron-down"></i>
          </span>
        </button>

        <div
          style={{
            position: "absolute",
            top: "100%",
            left: "15px",
            width: "150px",
            height: "10px",
            zIndex: 999,
          }}
        />

        {openMenu === "dichvu" && (
          <div
            style={{
              backgroundColor: dropdownBg,
              position: "absolute",
              top: "calc(100% + 5px)",
              left: "15px",
              width: "150px",
              borderRadius: "10px",
              padding: "2px 0",
              border: `${dropdownBorder} 1px solid`,
              zIndex: 1000,
              ...dropdownStyle,
              ...(openMenu === "dichvu" ? dropdownOpenStyle : {}),
            }}
          >
            <Link
              href="https://portal.vietnix.vn/aff.php?aff=2857&url=https://vietnix.vn/hosting-gia-re/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-nav block py-2 text-black hover:scale-103 transition duration-500"
            >
              Hosting
            </Link>

            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://vpssieutoc.vn/aff.php?aff=218&gid=5"
              className="text-nav block py-2 text-black hover:scale-103 transaction duration-1000"
            >
              VPS giá rẻ
            </Link>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://portal.vietnix.vn/aff.php?aff=2857&url=https://vietnix.vn/vps-gia-re/"
              className="text-nav block py-2 text-black hover:scale-103 transaction duration-1000"
            >
              VPS ổn định
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuLinks;
