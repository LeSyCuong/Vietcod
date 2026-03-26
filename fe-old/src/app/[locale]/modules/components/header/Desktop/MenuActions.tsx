import ThemeToggle from "../ThemeToggle";
import SearchToggle from "../SearchToggle";

interface Props {
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

const MenuActions: React.FC<Props> = ({ setShowSearch }) => {
  return (
    <>
      <div className="mr-2">
        <ThemeToggle />
      </div>
      <div className="mr-2 mt-2">
        <SearchToggle onClick={() => setShowSearch((prev) => !prev)} />
      </div>
    </>
  );
};

export default MenuActions;
