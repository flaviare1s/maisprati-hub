/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [lightMode, setLightMode] = useState(() => {
    return localStorage.getItem("theme") !== "dark";
  });

  useEffect(() => {
    if (!lightMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [lightMode]);

  return (
    <ThemeContext.Provider value={{ lightMode, setLightMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
