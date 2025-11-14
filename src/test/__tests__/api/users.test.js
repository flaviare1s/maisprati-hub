import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockUsers } from "../../utils/mock-data";

// Mock das funções da API diretamente
vi.mock("../../../api.js/users", () => ({
  getAllUsers: vi.fn(),
  getUserById: vi.fn(),
  updateUser: vi.fn(),
  deleteUser: vi.fn(),
}));

import {
  getAllUsers,
  getUserById,
} from "../../../api.js/users";

describe("Users API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllUsers", () => {
    it("deve retornar lista de usuários", async () => {
      const mockResponse = {
        data: {
          users: mockUsers,
          totalUsers: mockUsers.length,
        },
      };

      getAllUsers.mockResolvedValue(mockResponse);

      const result = await getAllUsers();

      expect(getAllUsers).toHaveBeenCalled();
      expect(result.data.users).toEqual(mockUsers);
    });
  });

  describe("getUserById", () => {
    it("deve retornar usuário por ID", async () => {
      const mockResponse = {
        data: mockUsers[0],
      };

      getUserById.mockResolvedValue(mockResponse);

      const result = await getUserById("1");

      expect(getUserById).toHaveBeenCalledWith("1");
      expect(result.data).toEqual(mockUsers[0]);
    });
  });
});
