import { NavLink } from "react-router-dom";
import AvtarComponent from "./AvtarComponent";
import { useAuth } from "../../hooks/useAuth";

const Header = () => {
  const { user, logout } = useAuth();
  return (
    <header className="dark:bg-[#464646] bg-white p-3 shrink-0">
      <nav className="w-[90%] mx-auto flex justify-between items-center">
        <NavLink to="/">
          <p className="text-lg dark:text-gray-200 text-gray-800 font-semibold">
            The Vocab Deck
          </p>
        </NavLink>
        <AvtarComponent
          name={user?.username as string}
          email={user?.email as string}
          logout={logout}
        />
      </nav>
    </header>
  );
};

export default Header;
