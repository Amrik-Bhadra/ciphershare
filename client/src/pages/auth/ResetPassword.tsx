import React from "react";
import { useState } from "react";
import PasswordComponent from "../../components/form/PasswordComponent";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../../apis/auth.api";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

interface ResetPasswordProps {
  newPassword: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const [formData, setFormData] = useState<ResetPasswordProps>({
    newPassword: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const { token } = useParams();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const { mutate: resetPass, isPending: isLoading } = useMutation({
    mutationFn: resetPassword,
    onSuccess: (response) => {
      if (response.status === 200) {
        toast.success("Password changed successfully!");
        navigate("/auth/login");
      } else {
        toast.error("Faile to reset password");
      }
    },
    onError: (error) => {
      console.error("Reset Password Error:", error);
      toast.error("Internal Server Error");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      toast.error("Invalid reset token");
      return;
    }

    if(formData.newPassword !== formData.confirmPassword){
        toast.error('Both passwords doesnot match');
        return;
    }

    resetPass({ token, password: formData.newPassword });
  };
  return (
    <>
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-light2">
        Reset Password
      </h1>
      <p className="text-center text-gray-500">Please enter your credentials</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <PasswordComponent
          name="newPassword"
          id="newPassword"
          placeholder="min 8 characters"
          value={formData.newPassword}
          onChange={handleChange}
          label="New Password"
          required
          error=""
        />

        <PasswordComponent
          name="confirmPassword"
          id="confirmPassword"
          placeholder="min 8 characters"
          value={formData.confirmPassword}
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
          {isLoading ? "loading..." : "Reset Password"}
        </button>
      </form>
    </>
  );
};

export default ResetPassword;
