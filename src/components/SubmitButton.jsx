export const SubmitButton = ({ label }) => {
  return (
    <button
      type="submit"
      className="uppercase text-light font-bold text-sm py-2 px-4 rounded-md transition-colors duration-75 font-montserrat focus:outline-none focus:shadow-outline w-full cursor-pointer mt-5 bg-blue-logo hover:bg-orange-logo hover:text-blue-logo"
    >
      {label}
    </button>
  );
};
