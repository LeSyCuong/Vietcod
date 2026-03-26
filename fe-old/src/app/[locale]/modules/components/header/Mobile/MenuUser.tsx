"use client";
import Link from "next/link";

interface Props {
  user: any;
  openMenu: string | null;
  setOpenMenu: React.Dispatch<React.SetStateAction<string | null>>;
  handleLogout: () => void;
  router: any;
}

const MenuUser: React.FC<Props> = ({
  user,
  openMenu,
  setOpenMenu,
  handleLogout,
  router,
}) => {
  if (!user) {
    return (
      <div className="flex flex-col items-center gap-2 w-full max-w-[150px] mx-auto">
        <span
          className="font-medium cursor-pointer text-[var(--primary)] text-center w-full"
          onClick={() => router.push("/pages/login")}
        >
          Đăng nhập
        </span>
        <button
          onClick={() => router.push("/pages/register")}
          className="btn-head w-full"
        >
          Đăng ký
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[150px] mx-auto">
      <button
        onClick={() => setOpenMenu(openMenu === "user" ? null : "user")}
        className="flex items-center justify-center gap-2 w-full bg-white text-black text-sm px-4 py-1.5 rounded-md shadow-sm hover:bg-gray-200 transition"
      >
        <i className="fa-solid fa-user-tie" />
        <span>{user.username || "User"}</span>
        <span
          className={`inline-block ml-1 transition-transform duration-300 ${
            openMenu === "user" ? "rotate-180" : "rotate-0"
          }`}
        >
          <i className="fa-solid fa-chevron-down text-xs relative -top-[1px]" />
        </span>
      </button>

      <ul
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          openMenu === "user" ? "max-h-[200px] mt-1" : "max-h-0"
        }`}
      >
        <li className="mt-4">
          <Link
            href="/pages/users"
            className="block py-1 text-[var(--primary)] text-sm"
          >
            Xem
          </Link>
        </li>

        <li className="mt-5">
          <button onClick={handleLogout} className="btn-head w-full">
            Đăng xuất
          </button>
        </li>
      </ul>
    </div>
  );
};

export default MenuUser;
