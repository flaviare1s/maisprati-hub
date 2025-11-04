import { useState } from "react";

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
            className="text-gray-muted hover:text-gray-600 focus:outline-none"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878A3 3 0 1012 6a3.001 3.001 0 00-2.122.878M9.878 9.878l-.637-.644m4.242 4.242l.637.644m0 0l1.415 1.414M14.12 14.12L15.536 15.536M14.12 14.12A3 3 0 1012 18a3.001 3.001 0 002.122-.878m-4.242-4.242L6.464 6.464" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.275 4.057-5.065 7-9.543 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>
      {error && <small className="text-red-secondary mt-1">{error}</small>}
    </div>
  );
};