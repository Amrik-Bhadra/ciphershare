import React from "react";
import { useState } from "react";
import InputComponent from "../../components/form/InputComponent";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../../apis/auth.api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

//   const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: forgotPass, isPending: isLoading } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (response) => {
      if (response.status === 200) {
        toast.success("Email Sent!");
        navigate("/auth/login");
      } else {
        toast.error("Failed to send email!");
      }
    },
    onError: (error) => {
      console.error("Forgot password Error:", error);
      toast.error("Internal Server Error");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    forgotPass(email);
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-light2">
        Forgot Password
      </h1>
      <p className="text-center text-gray-500">Please enter your credentials</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <InputComponent
          name="email"
          id="email"
          placeholder="eg: abc@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="Email"
          required
          error=""
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-primary text-white py-2 font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? "Sendig Email..." : "Send Email"}
        </button>
      </form>
    </>
  );
};

export default ForgotPassword;
