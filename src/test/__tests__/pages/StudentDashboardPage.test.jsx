import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { StudentDashboardPage } from "../../../pages/StudentDashboardPage";
import * as teamsApi from "../../../api.js/teams";
import { describe, expect, it, vi } from "vitest";
import { AuthContext } from "../../../contexts/AuthContext";

// Mock do contexto de autenticação para fornecer o usuário diretamente
const MockAuthProvider = ({ children, user }) => {
  const mockContext = { user };
  return <AuthContext.Provider value={mockContext}>{children}</AuthContext.Provider>;
};

// Mock das funções de API
vi.mock("../../../api.js/teams", () => ({
  fetchActiveTeams: vi.fn(),
  getTeamWithMembers: vi.fn(),
  checkUserTeamStatus: vi.fn(),
}));

describe("StudentDashboardPage - Testes Abrangentes", () => {
  it("exibe corretamente informações do usuário com grupo", async () => {
    const user = {
      name: "Maria Oliveira",
      email: "maria@email.com",
      avatar: "avatar.png",
      hasGroup: true,
      wantsGroup: true,
    };

    teamsApi.checkUserTeamStatus.mockResolvedValue({ isInActiveTeam: true });
    teamsApi.fetchActiveTeams.mockResolvedValue([
      { id: "1", name: "Grupo 1", members: [{ userId: "123" }] },
    ]);
    teamsApi.getTeamWithMembers.mockResolvedValue({ id: "1", name: "Grupo 1", members: [] });

    render(
      <MemoryRouter>
        <MockAuthProvider user={user}>
          <StudentDashboardPage />
        </MockAuthProvider>
      </MemoryRouter>
    );

    // findBy... já espera o elemento renderizar, sem precisar de waitFor
    const name = await screen.findByRole("heading", { name: /Maria Oliveira/i });
    expect(name).toBeInTheDocument();
    expect(screen.getByText(/maria@email.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Nenhum/i)).toBeInTheDocument();
  });

  it("exibe mensagem apropriada para usuário sem grupo", async () => {
    const user = {
      name: "Maria Oliveira",
      email: "maria@email.com",
      avatar: "avatar.png",
      hasGroup: false,
      wantsGroup: false,
    };

    teamsApi.checkUserTeamStatus.mockResolvedValue({ isInActiveTeam: false });

    render(
      <MemoryRouter>
        <MockAuthProvider user={user}>
          <StudentDashboardPage />
        </MockAuthProvider>
      </MemoryRouter>
    );

    const [userName] = await screen.findAllByText(/Maria Oliveira/i);
    expect(userName).toBeInTheDocument();
    expect(
      screen.getByText(/Você optou por trabalhar individualmente/i)
    ).toBeInTheDocument();
  });
});
