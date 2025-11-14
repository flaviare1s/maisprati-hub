import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup/testSuppress.js"],
    globals: true,
    // Aumentar timeout para testes assíncronos
    testTimeout: 10000,
    // Suprimir warnings específicos
    silent: false,
    reporter: "verbose",
  },
});
