// Setup de testes para desabilitar interceptors problemáticos
import { vi } from "vitest";

// Mock do console.warn para suprimir warnings de loop nos testes
const originalWarn = console.warn;
console.warn = vi.fn((message) => {
  // Só mostrar warnings que não são do sistema de detecção de loop
  if (!message.includes("LOOP DETECTADO")) {
    originalWarn(message);
  }
});

// Mock do window para evitar erros de ambiente
Object.defineProperty(window, "location", {
  value: {
    href: "http://localhost:3000",
    origin: "http://localhost:3000",
  },
  writable: true,
});

// Mock do dispatchEvent
window.dispatchEvent = vi.fn();

export {};
