// Mock melhorado do AuthContext para evitar loops
import { vi } from "vitest";
import { createContext } from "react";

export const createAuthContextMock = (userData = null) => {
  const mockAuthContext = {
    user: userData,
    loading: false,
    isAuthenticated: !!userData,
    login: vi.fn(),
    logout: vi.fn(),
    checkAuth: vi.fn(),
    loadUserData: vi.fn(),
  };

  // Mock do provider
  const MockAuthProvider = ({ children }) => children;

  return {
    AuthContext: createContext(mockAuthContext),
    AuthProvider: MockAuthProvider,
    useAuth: () => mockAuthContext,
    authContextValue: mockAuthContext,
  };
};

// Mock específico para usuários
export const mockUserData = {
  student: {
    id: "1",
    name: "Test Student",
    email: "student@test.com",
    role: "STUDENT",
    hasGroup: false,
    wantsGroup: false,
  },
  teacher: {
    id: "2",
    name: "Test Teacher",
    email: "teacher@test.com",
    role: "TEACHER",
    hasGroup: false,
    wantsGroup: false,
  },
  admin: {
    id: "3",
    name: "Test Admin",
    email: "admin@test.com",
    role: "ADMIN",
    hasGroup: false,
    wantsGroup: false,
  },
};
