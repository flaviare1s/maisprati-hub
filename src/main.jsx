import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { TeamProvider } from "./contexts/TeamContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <TeamProvider>
          <Toaster position="top-center" />
          <App />
          </TeamProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
