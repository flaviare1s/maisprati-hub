import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../contexts/ThemeContext";

export const ThemeToggle = () => {
  const { lightMode, setLightMode } = useTheme();

  return (
    <button
      onClick={() => setLightMode(!lightMode)}
      className="p-2 text-2xl rounded bg-transparent cursor-pointer"
    >
      {lightMode ? <FiSun className="md:text-orange-logo" /> : <FiMoon />}
    </button>
  );
};
