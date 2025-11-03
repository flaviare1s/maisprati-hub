// Mock da API para testes que evita loops de requisições
import { vi } from "vitest";

// Mock mais robusto para a API
export const createApiMock = () => {
  const mockApi = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  };

  // Configurações padrão para respostas bem-sucedidas
  mockApi.get.mockResolvedValue({ data: {} });
  mockApi.post.mockResolvedValue({ data: {} });
  mockApi.put.mockResolvedValue({ data: {} });
  mockApi.patch.mockResolvedValue({ data: {} });
  mockApi.delete.mockResolvedValue({ data: {} });

  return mockApi;
};

// Mock específico para /auth/me que evita loops
export const mockAuthMe = (mockApi, userData = null) => {
  mockApi.get.mockImplementation((url) => {
    if (url.includes("/auth/me")) {
      if (userData) {
        return Promise.resolve({ data: userData });
      } else {
        return Promise.reject({ response: { status: 401 } });
      }
    }
    return Promise.resolve({ data: {} });
  });
};

// Mock para notificações
export const mockNotifications = (mockApi, notifications = []) => {
  mockApi.get.mockImplementation((url) => {
    if (url.includes("/notifications")) {
      return Promise.resolve({ data: notifications });
    }
    return Promise.resolve({ data: {} });
  });
};
