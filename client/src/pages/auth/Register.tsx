import { useState } from "react";
import InputComponent from "../../components/form/InputComponent";
import PasswordComponent from "../../components/form/PasswordComponent";
import { Link, useNavigate } from "react-router-dom";
import DropdownComponent from "../../components/form/DropdownComponent";
import { registerUser } from "../../apis/auth.api";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

interface RegisterFormProps {
  username: string;
  email: string;
  role: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const roles = [
    { label: "User", value: "user" },
    { label: "Admin", value: "admin" },
  ];

  const [registerData, setRegisterData] = useState<RegisterFormProps>({
    username: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const { mutate: register, isPending: isLoading } = useMutation({
    mutationFn: registerUser,
    onSuccess: (response) => {
      if (response.status === 201) {
        toast.success(response.data.message || "User Registered Successfully!");
        navigate("/auth/login");
      }
    },
    onError: (error) => {
      console.error("Register Error:", error);
      toast.error("Internal Server Error");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleSelect = (val: string | number): void => {
    if (typeof val === "string") {
      setRegisterData({ ...registerData, role: val });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const userData = {
      username: registerData.username,
      email: registerData.email,
      role: registerData.role,
      password: registerData.password,
    };

    register(userData);
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-light1">
        Register
      </h1>
      <p className="text-center text-gray-500">Create a new account</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <InputComponent
          name="username"
          id="username"
          placeholder="eg: John Doe"
          value={registerData.username}
          onChange={handleChange}
          label="Username"
          required
          error=""
        />

        <InputComponent
          name="email"
          id="email"
          placeholder="eg: abc@example.com"
          value={registerData.email}
          onChange={handleChange}
          label="Email"
          required
          error=""
        />

        <DropdownComponent
          label="Role"
          value={registerData.role}
          options={roles}
          onChange={handleSelect}
          required
          error=""
        />

        <PasswordComponent
          name="password"
          id="password"
          placeholder="min 8 characters"
          value={registerData.password}
          onChange={handleChange}
          label="Password"
          required
          error=""
        />

        <PasswordComponent
          name="confirmPassword"
          id="confirmPassword"
          placeholder="re-enter your password"
          value={registerData.confirmPassword}
          onChange={handleChange}
          label="Confirm Password"
          required
          error=""
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-primary text-white py-2 font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-400">
        Already have an account?{" "}
        <Link
          to="/auth/login"
          className="text-primary hover:underline font-medium"
        >
          Login
        </Link>
      </p>
    </>
  );
};

export default Register;
