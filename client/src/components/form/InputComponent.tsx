import React from "react";

interface InputComponentProps {
  label: string;
  type?: string;
  name: string;
  id: string;
  placeholder: string;
  value: string | number;
  width?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required: boolean;
  error: string;
}

const InputComponent = ({
  label,
  type = "text",
  name,
  id,
  placeholder,
  value,
  width,
  onChange,
  required,
  error
}: InputComponentProps) => {
  return (
    <div className="mb-4" style={{ width: width }}>
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700 dark:text-gray-light2 flex gap-x-1"
      >
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <input
        type={type}
        name={name}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`mt-2 w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 dark:bg-gray-50/10 dark:border-none dark:text-white ${
          error
            ? "border-red-500 focus:ring-red-400"
            : "border-gray-300 focus:ring-blue-500"
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default InputComponent;
