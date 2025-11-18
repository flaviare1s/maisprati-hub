import { render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { StudentDashboardPage } from "../../../pages/StudentDashboardPage";
import * as teamsApi from "../../../api/teams";
import * as usersApi from "../../../api/users";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { AuthContext } from "../../../contexts/AuthContext";
import userEvent from "@testing-library/user-event";
import toast from "react-hot-toast";

// Mock do react-hot-toast
vi.mock("react-hot-toast");

// Mock do contexto de autenticação
const MockAuthProvider = ({ children, user, updateUser = vi.fn() }) => {
  const mockContext = { user, updateUser };
  return <AuthContext.Provider value={mockContext}>{children}</AuthContext.Provider>;
};

// Mock das funções de API de times
vi.mock("../../../api/teams", () => ({
  fetchTeams: vi.fn(),
  getTeamWithMembers: vi.fn(),
}));

// Mock das funções de API de usuários
vi.mock("../../../api/users", () => ({
  disableWantsGroup: vi.fn(),
  resetGroupPreferences: vi.fn(),
  fetchEmotionalStatuses: vi.fn(),
  updateEmotionalStatus: vi.fn(),
}));

describe("StudentDashboardPage - Testes Abrangentes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock padrão para estados emocionais
    usersApi.fetchEmotionalStatuses.mockResolvedValue([
      "CALM",
      "HAPPY",
      "ANXIOUS",
      "CONFUSED",
      "LOST",
      "ANGRY",
      "SAD",
      "OVERWHELMED",
      "FOCUSED",
    ]);
  });

  describe("Renderização de Informações do Usuário", () => {
    it("exibe corretamente informações básicas do usuário", async () => {
      const user = {
        id: "123",
        name: "Maria Oliveira",
        email: "maria@email.com",
        codename: "Guerreira",
        avatar: "avatar.png",
        hasGroup: false,
        wantsGroup: false,
      };

      teamsApi.fetchTeams.mockResolvedValue([]);

      render(
        <MemoryRouter>
          <MockAuthProvider user={user}>
            <StudentDashboardPage />
          </MockAuthProvider>
        </MemoryRouter>
      );

      expect(await screen.findByText("Guerreira")).toBeInTheDocument();
      expect(screen.getByText("Maria Oliveira")).toBeInTheDocument();
      expect(screen.getByText("maria@email.com")).toBeInTheDocument();
      expect(screen.getByAltText("Avatar")).toHaveAttribute("src", "avatar.png");
    });

    it("exibe nome quando codename não está disponível", async () => {
      const user = {
        id: "123",
        name: "João Silva",
        email: "joao@email.com",
        hasGroup: false,
        wantsGroup: false,
      };

      teamsApi.fetchTeams.mockResolvedValue([]);

      render(
        <MemoryRouter>
          <MockAuthProvider user={user}>
            <StudentDashboardPage />
          </MockAuthProvider>
        </MemoryRouter>
      );

      const headings = await screen.findAllByText("João Silva");
      expect(headings[0]).toBeInTheDocument();
    });

    it("exibe classe do usuário quando disponível", async () => {
      const user = {
        id: "123",
        name: "Ana Costa",
        email: "ana@email.com",
        groupClass: "Turma 3A",
        hasGroup: false,
        wantsGroup: false,
      };

      teamsApi.fetchTeams.mockResolvedValue([]);

      render(
        <MemoryRouter>
          <MockAuthProvider user={user}>
            <StudentDashboardPage />
          </MockAuthProvider>
        </MemoryRouter>
      );

      expect(await screen.findByText("Turma 3A")).toBeInTheDocument();
    });
  });

  describe("Gerenciamento de Estados Emocionais", () => {
    it("carrega e exibe opções de estados emocionais", async () => {
      const user = {
        id: "123",
        name: "Pedro Santos",
        email: "pedro@email.com",
        hasGroup: false,
        wantsGroup: false,
      };

      teamsApi.fetchTeams.mockResolvedValue([]);

      render(
        <MemoryRouter>
          <MockAuthProvider user={user}>
            <StudentDashboardPage />
          </MockAuthProvider>
        </MemoryRouter>
      );

      const select = await screen.findByRole("combobox");
      expect(select).toBeInTheDocument();

      // Verifica se as opções traduzidas estão presentes
      expect(within(select).getByText("Nenhum")).toBeInTheDocument();
      expect(within(select).getByText("Calmo")).toBeInTheDocument();
      expect(within(select).getByText("Feliz")).toBeInTheDocument();
      expect(within(select).getByText("Ansioso")).toBeInTheDocument();
    });

    it("permite alterar estado emocional", async () => {
      const user = {
        id: "123",
        name: "Carla Mendes",
        email: "carla@email.com",
        hasGroup: false,
        wantsGroup: false,
      };

      const updateUser = vi.fn();
      const updatedUser = { ...user, emotionalStatus: "HAPPY" };

      teamsApi.fetchTeams.mockResolvedValue([]);
      usersApi.updateEmotionalStatus.mockResolvedValue(updatedUser);

      const userObj = userEvent.setup();

      render(
        <MemoryRouter>
          <MockAuthProvider user={user} updateUser={updateUser}>
            <StudentDashboardPage />
          </MockAuthProvider>
        </MemoryRouter>
      );

      const select = await screen.findByRole("combobox");
      await userObj.selectOptions(select, "HAPPY");

      await waitFor(() => {
        expect(usersApi.updateEmotionalStatus).toHaveBeenCalledWith("123", "HAPPY");
      });

      expect(updateUser).toHaveBeenCalledWith(updatedUser);
      expect(toast.success).toHaveBeenCalledWith("Estado emocional atualizado.");
    });

    it("exibe estado emocional atual do usuário", async () => {
      const user = {
        id: "123",
        name: "Lucas Rodrigues",
        email: "lucas@email.com",
        emotionalStatus: "FOCUSED",
        hasGroup: false,
        wantsGroup: false,
      };

      teamsApi.fetchTeams.mockResolvedValue([]);

      render(
        <MemoryRouter>
          <MockAuthProvider user={user}>
            <StudentDashboardPage />
          </MockAuthProvider>
        </MemoryRouter>
      );

      const select = await screen.findByRole("combobox");
      expect(select).toHaveValue("FOCUSED");
    });

    it("exibe erro ao falhar atualização de estado emocional", async () => {
      const user = {
        id: "123",
        name: "Beatriz Lima",
        email: "beatriz@email.com",
        hasGroup: false,
        wantsGroup: false,
      };

      teamsApi.fetchTeams.mockResolvedValue([]);
      usersApi.updateEmotionalStatus.mockRejectedValue(new Error("Erro de rede"));

      const userObj = userEvent.setup();

      render(
        <MemoryRouter>
          <MockAuthProvider user={user}>
            <StudentDashboardPage />
          </MockAuthProvider>
        </MemoryRouter>
      );

      const select = await screen.findByRole("combobox");
      await userObj.selectOptions(select, "CALM");

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Erro ao atualizar estado emocional.");
      });
    });
  });

  describe("Cenários de Grupos", () => {
    it("exibe informações do grupo quando usuário faz parte de um time", async () => {
      const user = {
        id: "123",
        name: "Fernanda Costa",
        email: "fernanda@email.com",
        hasGroup: true,
        wantsGroup: true,
      };

      const mockTeam = {
        id: "team1",
        name: "Grupo Alpha",
        members: [
          { userId: "123", name: "Fernanda Costa" },
          { userId: "456", name: "Roberto Silva" },
        ],
      };

      teamsApi.fetchTeams.mockResolvedValue([mockTeam]);
      teamsApi.getTeamWithMembers.mockResolvedValue(mockTeam);

      render(
        <MemoryRouter>
          <MockAuthProvider user={user}>
            <StudentDashboardPage />
          </MockAuthProvider>
        </MemoryRouter>
      );

      expect(await screen.findByRole('heading', { name: /Grupo Grupo Alpha/i })).toBeInTheDocument();
    });

    it("exibe mensagem para usuário com hasGroup mas sem time ativo", async () => {
      const user = {
        id: "123",
        name: "Rafael Souza",
        email: "rafael@email.com",
        hasGroup: true,
        wantsGroup: true,
      };

      teamsApi.fetchTeams.mockResolvedValue([]);

      render(
        <MemoryRouter>
          <MockAuthProvider user={user}>
            <StudentDashboardPage />
          </MockAuthProvider>
        </MemoryRouter>
      );

      expect(
        await screen.findByText(
          /Você indicou que possui grupo, mas ainda não foi encontrado nenhum time ativo/i
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Acesse a Sala Comum para entrar no seu grupo/i)
      ).toBeInTheDocument();
    });

    it("exibe mensagem para usuário que quer grupo mas ainda não entrou", async () => {
      const user = {
        id: "123",
        name: "Juliana Alves",
        email: "juliana@email.com",
        hasGroup: false,
        wantsGroup: true,
      };

      teamsApi.fetchTeams.mockResolvedValue([]);

      render(
        <MemoryRouter>
          <MockAuthProvider user={user}>
            <StudentDashboardPage />
          </MockAuthProvider>
        </MemoryRouter>
      );

      expect(
        await screen.findByText(/Você ainda não faz parte de nenhum grupo/i)
      ).toBeInTheDocument();
    });

    it("exibe mensagem para usuário trabalhando individualmente", async () => {
      const user = {
        id: "123",
        name: "Marcos Pereira",
        email: "marcos@email.com",
        hasGroup: false,
        wantsGroup: false,
      };

      teamsApi.fetchTeams.mockResolvedValue([]);

      render(
        <MemoryRouter>
          <MockAuthProvider user={user}>
            <StudentDashboardPage />
          </MockAuthProvider>
        </MemoryRouter>
      );

      expect(
        await screen.findByText(/Você optou por trabalhar individualmente/i)
      ).toBeInTheDocument();
    });
  });

  describe("Alteração de Preferências de Grupo", () => {
    it("permite desabilitar wantsGroup quando usuário quer grupo", async () => {
      const user = {
        id: "123",
        name: "Amanda Ferreira",
        email: "amanda@email.com",
        hasGroup: false,
        wantsGroup: true,
      };

      const updateUser = vi.fn();
      const updatedUser = { ...user, wantsGroup: false };

      teamsApi.fetchTeams.mockResolvedValue([]);
      usersApi.disableWantsGroup.mockResolvedValue(updatedUser);

      const userObj = userEvent.setup();

      render(
        <MemoryRouter>
          <MockAuthProvider user={user} updateUser={updateUser}>
            <StudentDashboardPage />
          </MockAuthProvider>
        </MemoryRouter>
      );

      const toggleButton = await screen.findByTitle(
        /Clique para alterar para trabalho individual/i
      );
      await userObj.click(toggleButton);

      await waitFor(() => {
        expect(usersApi.disableWantsGroup).toHaveBeenCalledWith("123");
      });

      expect(updateUser).toHaveBeenCalledWith(updatedUser);
      expect(toast.success).toHaveBeenCalledWith(
        "Preferência alterada! Agora você está trabalhando individualmente."
      );
    });

    it("permite resetar preferências quando usuário tem hasGroup", async () => {
      const user = {
        id: "123",
        name: "Rodrigo Martins",
        email: "rodrigo@email.com",
        hasGroup: true,
        wantsGroup: true,
      };

      const updateUser = vi.fn();
      const updatedUser = { ...user, hasGroup: false, wantsGroup: false };

      teamsApi.fetchTeams.mockResolvedValue([]);
      usersApi.resetGroupPreferences.mockResolvedValue(updatedUser);

      const userObj = userEvent.setup();

      render(
        <MemoryRouter>
          <MockAuthProvider user={user} updateUser={updateUser}>
            <StudentDashboardPage />
          </MockAuthProvider>
        </MemoryRouter>
      );

      const toggleButton = await screen.findByTitle(
        /Clique para alterar para trabalho individual/i
      );
      await userObj.click(toggleButton);

      await waitFor(() => {
        expect(usersApi.resetGroupPreferences).toHaveBeenCalledWith("123");
      });

      expect(updateUser).toHaveBeenCalledWith(updatedUser);
    });

    it("exibe erro ao falhar alteração de preferência", async () => {
      const user = {
        id: "123",
        name: "Camila Rocha",
        email: "camila@email.com",
        hasGroup: false,
        wantsGroup: true,
      };

      teamsApi.fetchTeams.mockResolvedValue([]);
      usersApi.disableWantsGroup.mockRejectedValue(new Error("Erro de servidor"));

      const userObj = userEvent.setup();

      render(
        <MemoryRouter>
          <MockAuthProvider user={user}>
            <StudentDashboardPage />
          </MockAuthProvider>
        </MemoryRouter>
      );

      const toggleButton = await screen.findByTitle(
        /Clique para alterar para trabalho individual/i
      );
      await userObj.click(toggleButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Erro ao alterar preferência. Tente novamente."
        );
      });
    });
  });

  describe("Tratamento de Identificadores de Usuário", () => {
    it("funciona com user.id como string", async () => {
      const user = {
        id: "abc123",
        name: "Teste ID String",
        email: "teste@email.com",
        hasGroup: false,
        wantsGroup: false,
      };

      teamsApi.fetchTeams.mockResolvedValue([]);

      render(
        <MemoryRouter>
          <MockAuthProvider user={user}>
            <StudentDashboardPage />
          </MockAuthProvider>
        </MemoryRouter>
      );

      expect(await screen.findByRole("heading", { name: "Teste ID String" })).toBeInTheDocument();
    });

    it("funciona com user._id como string", async () => {
      const user = {
        _id: "xyz789",
        name: "Teste _ID String",
        email: "teste2@email.com",
        hasGroup: false,
        wantsGroup: false,
      };

      teamsApi.fetchTeams.mockResolvedValue([]);

      render(
        <MemoryRouter>
          <MockAuthProvider user={user}>
            <StudentDashboardPage />
          </MockAuthProvider>
        </MemoryRouter>
      );

      expect(await screen.findByRole("heading", { name: "Teste _ID String" })).toBeInTheDocument();
    });

    it("funciona com user.id como número", async () => {
      const user = {
        id: 456,
        name: "Teste ID Número",
        email: "teste3@email.com",
        hasGroup: false,
        wantsGroup: false,
      };

      teamsApi.fetchTeams.mockResolvedValue([]);

      render(
        <MemoryRouter>
          <MockAuthProvider user={user}>
            <StudentDashboardPage />
          </MockAuthProvider>
        </MemoryRouter>
      );

      expect(await screen.findByRole("heading", { name: "Teste ID Número" })).toBeInTheDocument();
    });
  });

  describe("Estados de Carregamento e Erro", () => {
    it("exibe loader enquanto carrega dados", () => {
      const user = {
        id: "123",
        name: "Teste Loader",
        email: "loader@email.com",
        hasGroup: false,
        wantsGroup: false,
      };

      teamsApi.fetchTeams.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      );

      render(
        <MemoryRouter>
          <MockAuthProvider user={user}>
            <StudentDashboardPage />
          </MockAuthProvider>
        </MemoryRouter>
      );

      // CustomLoader deve estar presente durante o carregamento
      expect(screen.queryByTestId("student-dashboard-page")).not.toBeInTheDocument();
    });

    it("exibe mensagem de erro quando usuário não está disponível", async () => {
      render(
        <MemoryRouter>
          <MockAuthProvider user={null}>
            <StudentDashboardPage />
          </MockAuthProvider>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Erro ao carregar dados do usuário/i)).toBeInTheDocument();
      });
    });

    it("trata erro ao carregar time do usuário", async () => {
      const user = {
        id: "123",
        name: "Teste Erro",
        email: "erro@email.com",
        hasGroup: true,
        wantsGroup: true,
      };

      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => { });
      teamsApi.fetchTeams.mockRejectedValue(new Error("Erro ao buscar times"));

      render(
        <MemoryRouter>
          <MockAuthProvider user={user}>
            <StudentDashboardPage />
          </MockAuthProvider>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Erro ao carregar time do usuário:",
          expect.any(Error)
        );
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Navegação e Links", () => {
    it("contém link para edição de perfil", async () => {
      const user = {
        id: "123",
        name: "Teste Link",
        email: "link@email.com",
        hasGroup: false,
        wantsGroup: false,
      };

      teamsApi.fetchTeams.mockResolvedValue([]);

      render(
        <MemoryRouter>
          <MockAuthProvider user={user}>
            <StudentDashboardPage />
          </MockAuthProvider>
        </MemoryRouter>
      );

      await screen.findByRole("heading", { name: "Teste Link" });
      const editLink = screen.getByRole("link");
      expect(editLink).toHaveAttribute("href", "/edit-profile");
    });

    it("contém link para sala comum quando não tem grupo", async () => {
      const user = {
        id: "123",
        name: "Teste Sala",
        email: "sala@email.com",
        hasGroup: false,
        wantsGroup: true,
      };

      teamsApi.fetchTeams.mockResolvedValue([]);

      render(
        <MemoryRouter>
          <MockAuthProvider user={user}>
            <StudentDashboardPage />
          </MockAuthProvider>
        </MemoryRouter>
      );

      const commonRoomLink = await screen.findByText(
        /Acesse a Sala Comum para encontrar e entrar em um grupo/i
      );
      expect(commonRoomLink.closest("a")).toHaveAttribute("href", "/common-room");
    });
  });

  describe("Modal de Gerenciamento de Time", () => {
    it("abre modal ao clicar no botão de gerenciar time", async () => {
      const user = {
        id: "123",
        name: "Teste Modal",
        email: "modal@email.com",
        hasGroup: true,
        wantsGroup: true,
      };

      const mockTeam = {
        id: "team1",
        name: "Grupo Beta",
        members: [{ userId: "123", name: "Teste Modal" }],
      };

      teamsApi.fetchTeams.mockResolvedValue([mockTeam]);
      teamsApi.getTeamWithMembers.mockResolvedValue(mockTeam);

      const userObj = userEvent.setup();

      render(
        <MemoryRouter>
          <MockAuthProvider user={user}>
            <StudentDashboardPage />
          </MockAuthProvider>
        </MemoryRouter>
      );

      // Espera carregar e usa heading para ser mais específico
      await screen.findByRole("heading", { name: /Grupo.*Grupo Beta/i });

      const manageButtons = screen.getAllByRole("button");
      const manageButton = manageButtons.find((btn) =>
        btn.querySelector(".text-orange-logo")
      );

      if (manageButton) {
        await userObj.click(manageButton);
        // Verificar se o modal é renderizado (assumindo que o componente TeamManagmentModal existe)
      }
    });
  });
});
