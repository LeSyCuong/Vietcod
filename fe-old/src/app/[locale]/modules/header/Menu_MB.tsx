import React from "react";
import MenuLinks from "../components/header/Mobile/MenuLinks";
import MenuUser from "../components/header/Mobile/MenuUser";

interface MenuProps {
  user: any;
  showMenu: boolean;
  openMenu: string | null;
  setOpenMenu: React.Dispatch<React.SetStateAction<string | null>>;
  openSubMenu: string | null;
  setOpenSubMenu: React.Dispatch<React.SetStateAction<string | null>>;
  handleLogout: () => void;
  router: any;
}

const Menu_MB: React.FC<MenuProps> = ({
  user,
  showMenu,
  openMenu,
  setOpenMenu,
  openSubMenu,
  setOpenSubMenu,
  handleLogout,
  router,
}) => {
  return (
    <div className="center">
      <div
        className={`overflow-hidden transition-all duration-1000 ease-in-out md:hidden ${
          showMenu ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="w-full flex justify-center">
          <div className="mt-4 flex flex-col items-center text-center gap-3 text-sm text-gray-300 max-w-xs mx-auto">
            <MenuLinks
              openSubMenu={openSubMenu}
              setOpenSubMenu={setOpenSubMenu}
            />
            <div className="w-full border-t border-gray-600 my-3" />
            <MenuUser
              user={user}
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
              handleLogout={handleLogout}
              router={router}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu_MB;
