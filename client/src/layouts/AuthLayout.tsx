import { Outlet } from "react-router-dom";
import ThemeButton from "../components/common/ThemeButton";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 dark:bg-gray-900 transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <ThemeButton/>
      </div>
      <div className="w-full max-w-md p-6 space-y-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <Outlet />        
      </div>
    </div>
  );
};

export default AuthLayout;