"use client";
import Link from "next/link";

interface Props {
  user: any;
  openMenu: string | null;
  setOpenMenu: React.Dispatch<React.SetStateAction<string | null>>;
  isDark: boolean;
  handleLogout: () => void;
  router: any;
}

const MenuUser: React.FC<Props> = ({
  user,
  openMenu,
  setOpenMenu,
  isDark,
  handleLogout,
  router,
}) => {
  const dropdownBg = isDark ? "rgba(19, 19, 19, 1)" : "rgba(255, 255, 255, 1)";
  const dropdownBorder = isDark
    ? "rgba(255, 255, 255, 1)"
    : "rgba(160, 160, 160, 1)";

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/pages/login"
          className="login-btn font-medium mr-2 cursor-pointer"
        >
          Đăng nhập
        </Link>
        <button
          onClick={() => router.push("/pages/register")}
          className="btn-head"
        >
          Đăng ký
        </button>
      </div>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpenMenu("user")}
      onMouseLeave={() => setOpenMenu(null)}
    >
      <Link href="/pages/users/profile" className="btn-head bg-white ">
        <i className="mr-2 fa-solid fa-user-tie" />
        {user.username || "User"}
        <span
          className={`ml-2 inline-block text-white transition-transform duration-300 ${
            openMenu === "user" ? "rotate-180" : "rotate-0"
          }`}
        ></span>
      </Link>

      {openMenu === "user" && (
        <>
          <div
            style={{
              position: "absolute",
              top: "100%",
              height: "15px",
              width: "150px",
              zIndex: 1000,
            }}
          />
          <div
            style={{
              backgroundColor: dropdownBg,
              position: "absolute",
              top: "calc(100% + 15px)",
              width: "150px",
              borderRadius: "10px",
              padding: "2px 0",
              border: `${dropdownBorder} 1px solid`,
              zIndex: 1000,
            }}
          >
            <Link
              href="/pages/products/heart"
              className="text-nav block py-2 text-black hover:scale-103 transaction duration-500"
            >
              Yêu thích
            </Link>
            <Link
              href="/pages/users/orders"
              className="text-nav block py-2 text-black hover:scale-103 transaction duration-500"
            >
              Download
            </Link>
            <Link
              href="/pages/users"
              className="text-nav block py-2 text-black hover:scale-103 transaction duration-500"
            >
              Xem
            </Link>

            <Link
              href="/pages/login"
              onClick={handleLogout}
              className="text-nav block py-2 text-black hover:scale-103 transaction duration-500"
            >
              Đăng xuất
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default MenuUser;
