import { CustomLoader } from "./CustomLoader";

export const SubmitButton = ({ label, isLoading = false, disabled = false, ...props }) => {
  return (
    <button
      type="submit"
      disabled={isLoading || disabled}
      className={`uppercase text-light font-bold text-sm py-2 px-4 rounded-md transition-colors duration-75 font-montserrat focus:outline-none focus:shadow-outline w-full ${isLoading || disabled
        ? 'bg-gray-400 cursor-not-allowed'
        : 'bg-blue-logo hover:bg-blue-600 cursor-pointer'
        }`}
      {...props}
    >
      {isLoading ? <CustomLoader /> : label}
    </button>
  );
};
