import { vi } from "vitest";

// Mock das APIs para testes
export const mockAuthApi = {
  login: vi.fn(),
  logout: vi.fn(),
  forgotPassword: vi.fn(),
  resetPassword: vi.fn(),
  verifyToken: vi.fn(),
};

export const mockUsersApi = {
  getAllUsers: vi.fn(),
  getUserById: vi.fn(),
  updateUser: vi.fn(),
  deleteUser: vi.fn(),
  getUserProfile: vi.fn(),
  updateUserProfile: vi.fn(),
};

export const mockTeamsApi = {
  getAllTeams: vi.fn(),
  getTeamById: vi.fn(),
  createTeam: vi.fn(),
  updateTeam: vi.fn(),
  deleteTeam: vi.fn(),
  joinTeam: vi.fn(),
  leaveTeam: vi.fn(),
};

export const mockNotificationsApi = {
  getNotifications: vi.fn(),
  markAsRead: vi.fn(),
  deleteNotification: vi.fn(),
};

// Respostas padrão para os mocks
export const apiResponses = {
  loginSuccess: {
    token: "mock-jwt-token",
    user: {
      id: "1",
      name: "João Silva",
      email: "joao@teste.com",
      type: "student",
      codename: "JOAO123",
    },
  },

  loginError: {
    message: "Credenciais inválidas",
  },

  forgotPasswordSuccess: {
    message: "Email enviado com sucesso",
  },

  resetPasswordSuccess: {
    message: "Senha alterada com sucesso",
  },

  usersListSuccess: {
    users: [
      {
        id: "1",
        name: "João Silva",
        email: "joao@teste.com",
        type: "student",
      },
      {
        id: "2",
        name: "Maria Santos",
        email: "maria@teste.com",
        type: "student",
      },
    ],
  },
};
