import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface PasswordComponentProps {
  label: string;
  name: string;
  id: string;
  placeholder: string;
  value: string | number;
  width?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required: boolean;
  error: string;
}

const PasswordComponent = ({
  label,
  name,
  id,
  placeholder,
  value,
  width,
  onChange,
  required,
  error,
}: PasswordComponentProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="mb-4" style={{ width }}>
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700 dark:text-gray-light2 flex gap-x-1"
      >
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`mt-2 w-full rounded-md border px-4 py-2 pr-10 focus:outline-none focus:ring-2 dark:bg-gray-50/10 dark:border-none dark:text-white ${
            error
              ? "border-red-500 focus:ring-red-400"
              : "border-gray-300 focus:ring-blue-500"
          }`}
        />
        <button
          onClick={handleShowPassword}
          className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default PasswordComponent;
