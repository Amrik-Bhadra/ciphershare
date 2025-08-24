import { useState } from "react";
import InputComponent from "../../components/form/InputComponent";
import PasswordComponent from "../../components/form/PasswordComponent";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";

interface LoginFormProps {
  email: string;
  password: string;
}

const Login = () => {
  const [loginData, setLoginData] = useState<LoginFormProps>({
    email: "",
    password: "",
  });

  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(loginData.email, loginData.password);
      toast.success("Login Successful!");
      navigate("/");
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.response?.status === 401) {
        toast.error("Invalid credentials");
      } else {
        toast.error("Failed to login. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-light2">
        Login
      </h1>
      <p className="text-center text-gray-500">Please enter your credentials</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <InputComponent
          name="email"
          id="email"
          placeholder="eg: abc@example.com"
          value={loginData.email}
          onChange={handleChange}
          label="Email"
          required
          error=""
        />

        <PasswordComponent
          name="password"
          id="password"
          placeholder="min 8 characters"
          value={loginData.password}
          onChange={handleChange}
          label="Password"
          required
          error=""
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 text-sm text-gray-600">
            <input
              type="checkbox"
              className="h-4 w-4 text-primary border-gray-300 rounded"
            />
            <span>Remember me</span>
          </label>
          <Link
            to="/auth/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-primary text-white py-2 font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-400">
        Don’t have an account?{" "}
        <Link
          to="/auth/register"
          className="text-primary hover:underline font-medium"
        >
          Sign up
        </Link>
      </p>
    </>
  );
};

export default Login;
