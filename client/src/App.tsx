import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import UserLayout from "./layouts/UserLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import UserDashboard from "./pages/user/UserDashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./contexts/ThemeContext/ThemeContextProvider";
import { AuthProvider } from "./contexts/AuthContext/AuthContextProvider";
import { Toaster } from "react-hot-toast";

const App = () => {
  const queryClient = new QueryClient();
  const router = createBrowserRouter([
    {
      path: "/auth",
      element: <AuthLayout />,
      children: [
        {
          path: "login",
          element: <Login />,
          handle: { title: "Login | CipherShare" },
        },
        {
          path: "register",
          element: <Register />,
          handle: { title: "Register | CipherShare" },
        },
        {
          path: "forgot-password",
          element: <ForgotPassword />,
          handle: { title: "Forgot Password | CipherShare" },
        },
        {
          path: "reset-password/:token",
          element: <ResetPassword />,
          handle: { title: "Register | CipherShare" },
        },
      ],
    },
    {
      path: "",
      element: (
        <ProtectedRoute>
          <UserLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "",
          element: <UserDashboard />,
          handle: { title: "Dashboard | The Vocab Deck" },
        },
      ],
    },
  ]);
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster position="top-center" />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
