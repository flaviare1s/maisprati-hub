import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";

export const ThemeToggle = () => {
  const { lightMode, setLightMode } = useTheme();

  return (
    <button
      onClick={() => setLightMode(!lightMode)}
      className="p-2 text-2xl rounded bg-transparent cursor-pointer"
    >
      {lightMode ? <FaSun className="md:text-orange-logo" /> : <FaMoon />}
    </button>
  );
};
