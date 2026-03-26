import MenuLinks from "../components/header/Desktop/MenuLinks";
import MenuUser from "../components/header/Desktop/MenuUser";
import MenuActions from "../components/header/Desktop/MenuActions";

interface Props {
  user: any;
  openMenu: string | null;
  setOpenMenu: React.Dispatch<React.SetStateAction<string | null>>;
  dropdownRef?: React.RefObject<HTMLDivElement | null>;
  dropdownOpenStyle: React.CSSProperties;
  dropdownStyle: React.CSSProperties;
  router: any;
  isDark: boolean;
  handleLogout: () => void;
  showSearch: boolean;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

const Menu_PC: React.FC<Props> = ({
  user,
  openMenu,
  setOpenMenu,
  dropdownRef,
  dropdownStyle,
  dropdownOpenStyle,
  router,
  isDark,
  handleLogout,
  showSearch,
  setShowSearch,
}) => {
  return (
    <div className="hidden md:flex items-center w-full justify-between">
      <nav
        ref={dropdownRef}
        className="flex items-center w-full text-sm text-gray-500"
      >
        <div className="flex-[0.37]" />
        <MenuLinks
          openMenu={openMenu}
          setOpenMenu={setOpenMenu}
          dropdownStyle={dropdownStyle}
          dropdownOpenStyle={dropdownOpenStyle}
          isDark={isDark}
        />
        <div className="flex-1 flex justify-end items-center gap-4 whitespace-nowrap">
          <MenuActions setShowSearch={setShowSearch} />
          <MenuUser
            user={user}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
            isDark={isDark}
            handleLogout={handleLogout}
            router={router}
          />
        </div>
      </nav>
    </div>
  );
};

export default Menu_PC;
