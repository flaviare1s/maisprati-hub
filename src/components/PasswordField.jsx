import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

export const PasswordField = ({
  label,
  name,
  register,
  error,
  validation,
  placeholder,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col w-full my-2">
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium mb-1 text-gray-muted"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          id={name}
          name={name}
          placeholder={placeholder}
          {...register(name, validation)}
          className="border border-border-input rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-logo placeholder:text-sm placeholder:text-gray-muted bg-bg-input text-gray-muted w-full"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-muted hover:text-gray-600 focus:outline-none cursor-pointer"
          >
            {showPassword ? (
              <FaRegEye />
            ) : (
              <FaRegEyeSlash />
            )}
          </button>
        </div>
      </div>
      {error && <small className="text-red-secondary mt-1">{error}</small>}
    </div>
  );
};