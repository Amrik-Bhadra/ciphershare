import { useState } from "react";
import ThemeButton from "./ThemeButton";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { getInitials } from "../../utils/helperFunctions";
import { useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";

interface AvtarComponentProps {
  name: string;
  email: string;
  logout: () => Promise<void>;
}

const AvtarComponent = ({ name, email, logout }: AvtarComponentProps) => {
  const [option, setOption] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };
  return (
    <div className="flex items-center gap-x-3">
      <div className="relative flex flex-col sm:flex-row gap-2 sm:gap-4 items-end sm:items-center">
        <div className="flex items-center gap-3">
          <span className="h-8 w-8 bg-primary text-white rounded-full flex items-center justify-center text-lg font-semibold">
            {getInitials(name)}
          </span>
          <div className="hidden sm:flex flex-col">
            <p className="font-semibold text-[#333] dark:text-gray-light2 text-sm">
              {name || "John Doe"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-dark1">
              {email || "john.doe@example.com"}
            </p>
          </div>
          <button
            className="dark:text-white"
            onClick={() => setOption(!option)}
          >
            {option ? <FaCaretUp /> : <FaCaretDown />}
          </button>
        </div>

        {option && (
          <div className="absolute top-full mt-2 right-0 w-48 bg-white dark:bg-dark-ter-bg border dark:border-[#484848] rounded-md shadow-lg z-50 p-3 flex flex-col gap-y-2">
            <ThemeButton />

            {/* <SolidIconBtn
              icon={MdLogout}
              text="Logout"
              className="bg-primary hover:bg-blue-700 text-white"
              onClick={() => {
                logout();
                navigate("/auth/login");
              }}
            /> */}

            <button
              onClick={handleLogout}
              className="bg-primary px-3 py-2 rounded-md text-white font-semibold flex items-center justify-center gap-2"
            >
              Logout
              <MdLogout />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvtarComponent;
