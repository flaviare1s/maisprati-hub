/* eslint-disable no-unused-vars */
import { render, screen, waitFor } from "@testing-library/react";
import { UsersManagementTab } from "../../../../components/teacher-dashboard/UsersManagementTab.jsx";
import * as usersApi from "../../../../api/users";
import * as teamsApi from "../../../../api/teams";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import toast from "react-hot-toast";

// Mock do react-hot-toast
vi.mock("react-hot-toast");

// Mock das APIs
vi.mock("../../../../api/users", () => ({
  fetchUsers: vi.fn(),
  deactivateUser: vi.fn(),
  activateUser: vi.fn(),
  fetchEmotionalStatuses: vi.fn(),
}));

vi.mock("../../../../api/teams", () => ({
  fetchTeams: vi.fn(),
}));

// Wrapper com Router
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("UsersManagementTab - Testes Abrangentes", () => {
  let unmountFn;

  const renderWithCleanup = (component) => {
    const result = renderWithRouter(component);
    unmountFn = result.unmount;
    return result;
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mocks padrão
    usersApi.fetchUsers.mockResolvedValue([]);
    teamsApi.fetchTeams.mockResolvedValue([]);
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

  afterEach(() => {
    if (unmountFn) {
      try {
        unmountFn();
      } catch (error) {
        // Ignora erros no unmount
      }
      unmountFn = null;
    }
    vi.clearAllTimers();
  });

  describe("Renderização Inicial", () => {
    // it("renderiza o componente com título e descrição", async () => {
    //   renderWithCleanup(<UsersManagementTab />);

    //   expect(screen.getByText("Usuários")).toBeInTheDocument();
    //   expect(
    //     screen.getByText(/Lista de estudantes cadastrados na plataforma/i)
    //   ).toBeInTheDocument();

    //   await waitFor(() => {
    //     expect(usersApi.fetchUsers).toHaveBeenCalled();
    //   });
    // });

    it("exibe loader durante carregamento", () => {
      usersApi.fetchUsers.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      );

      renderWithCleanup(<UsersManagementTab />);

      // Não deve mostrar o conteúdo imediatamente
      expect(screen.queryByText("Usuários")).not.toBeInTheDocument();
    });

    it("exibe mensagem de erro ao falhar carregamento", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => { });
      usersApi.fetchUsers.mockRejectedValue(new Error("Erro de rede"));

      renderWithCleanup(<UsersManagementTab />);

      expect(await screen.findByText(/Erro ao carregar lista de usuários/i)).toBeInTheDocument();

      consoleErrorSpy.mockRestore();
    });

    it("renderiza campo de busca", async () => {
      renderWithCleanup(<UsersManagementTab />);

      expect(
        await screen.findByPlaceholderText(/Buscar por nome, codinome, email ou guilda/i)
      ).toBeInTheDocument();
    });

    it("renderiza filtros", async () => {
      renderWithCleanup(<UsersManagementTab />);

      await waitFor(() => {
        const selects = screen.getAllByRole("combobox");
        expect(selects).toHaveLength(2); // Filtro principal e filtro emocional
      });
    });

    it("renderiza botões de ordenação", async () => {
      renderWithCleanup(<UsersManagementTab />);

      expect(await screen.findByText(/Ordenar por Nome/i)).toBeInTheDocument();
      expect(screen.getByText(/Ordenar por Turma/i)).toBeInTheDocument();
    });
  });

  describe("Carregamento de Usuários", () => {
    it("carrega e exibe lista de estudantes", async () => {
      const mockUsers = [
        {
          id: "1",
          type: "student",
          name: "João Silva",
          codename: "Guerreiro",
          email: "joao@email.com",
          isActive: true,
          hasGroup: false,
          wantsGroup: false,
        },
        {
          id: "2",
          type: "student",
          name: "Maria Santos",
          codename: "Maga",
          email: "maria@email.com",
          isActive: true,
          hasGroup: true,
          wantsGroup: true,
        },
      ];

      usersApi.fetchUsers.mockResolvedValue(mockUsers);

      renderWithCleanup(<UsersManagementTab />);

      expect(await screen.findByText("João Silva")).toBeInTheDocument();
      expect(screen.getByText("Maria Santos")).toBeInTheDocument();
      expect(screen.getByText("Guerreiro")).toBeInTheDocument();
      expect(screen.getByText("Maga")).toBeInTheDocument();
    });

    it("filtra apenas estudantes (type === 'student')", async () => {
      const mockUsers = [
        {
          id: "1",
          type: "student",
          name: "Aluno Teste",
          codename: "Test",
          email: "aluno@email.com",
          isActive: true,
        },
        {
          id: "2",
          type: "admin",
          name: "Admin Teste",
          codename: "Admin",
          email: "admin@email.com",
          isActive: true,
        },
      ];

      usersApi.fetchUsers.mockResolvedValue(mockUsers);

      renderWithCleanup(<UsersManagementTab />);

      await waitFor(() => {
        expect(screen.getByText("Aluno Teste")).toBeInTheDocument();
      });

      expect(screen.queryByText("Admin Teste")).not.toBeInTheDocument();
    });

    it("associa usuários aos seus times", async () => {
      const mockUsers = [
        {
          id: "1",
          type: "student",
          name: "Pedro Costa",
          codename: "Arqueiro",
          email: "pedro@email.com",
          isActive: true,
          hasGroup: true,
        },
      ];

      const mockTeams = [
        {
          id: "team1",
          name: "Grupo Alpha",
          members: [{ userId: "1" }],
        },
      ];

      usersApi.fetchUsers.mockResolvedValue(mockUsers);
      teamsApi.fetchTeams.mockResolvedValue(mockTeams);

      renderWithCleanup(<UsersManagementTab />);

      expect(await screen.findByText("Grupo Alpha")).toBeInTheDocument();
    });

    it("exibe indicador quando usuário tem grupo mas não está em time", async () => {
      const mockUsers = [
        {
          id: "1",
          type: "student",
          name: "Ana Lima",
          codename: "Curandeira",
          email: "ana@email.com",
          isActive: true,
          hasGroup: true,
        },
      ];

      usersApi.fetchUsers.mockResolvedValue(mockUsers);

      renderWithCleanup(<UsersManagementTab />);

      expect(await screen.findByText(/Aguardando entrada no time/i)).toBeInTheDocument();
    });
  });

  describe("Indicadores de Status do Usuário", () => {
    it("exibe indicador 'Solo' para usuários sem grupo", async () => {
      const mockUsers = [
        {
          id: "1",
          type: "student",
          name: "Carlos Solo",
          codename: "Lobo",
          email: "carlos@email.com",
          isActive: true,
          hasGroup: false,
          wantsGroup: false,
        },
      ];

      usersApi.fetchUsers.mockResolvedValue(mockUsers);

      renderWithCleanup(<UsersManagementTab />);

      await waitFor(() => {
        expect(screen.getByText("Carlos Solo")).toBeInTheDocument();
      });

      // Buscar especificamente o span com a classe text-blue-logo
      const soloIndicator = screen.getByText((content, element) => {
        return element.tagName === 'SPAN' &&
          element.classList.contains('text-blue-logo') &&
          content.includes('Solo');
      });
      expect(soloIndicator).toBeInTheDocument();
    });

    // it("exibe indicador 'Sem guilda' para usuários querendo grupo", async () => {
    //   const mockUsers = [
    //     {
    //       id: "1",
    //       type: "student",
    //       name: "Beatriz Buscadora",
    //       codename: "Exploradora",
    //       email: "beatriz@email.com",
    //       isActive: true,
    //       hasGroup: false,
    //       wantsGroup: true,
    //     },
    //   ];

    //   usersApi.fetchUsers.mockResolvedValue(mockUsers);

    //   renderWithCleanup(<UsersManagementTab />);

    //   // Precisa filtrar por "seeking" ou "all" para ver usuários querendo grupo
    //   const userObj = userEvent.setup({ delay: null });
    //   const filterSelect = await screen.findByDisplayValue("Ativos");
    //   await userObj.selectOptions(filterSelect, "seeking");

    //   expect(await screen.findByText(/Sem guilda/i)).toBeInTheDocument();
    // });

    it("exibe indicador '(Inativo)' para usuários inativos", async () => {
      const mockUsers = [
        {
          id: "1",
          type: "student",
          name: "Diego Inativo",
          codename: "Fantasma",
          email: "diego@email.com",
          isActive: false,
        },
      ];

      usersApi.fetchUsers.mockResolvedValue(mockUsers);

      renderWithCleanup(<UsersManagementTab />);

      // Precisa filtrar por "inactive" ou "all" para ver inativos
      const userObj = userEvent.setup({ delay: null });
      const filterSelect = await screen.findByDisplayValue("Ativos");
      await userObj.selectOptions(filterSelect, "inactive");

      expect(await screen.findByText(/\(Inativo\)/i)).toBeInTheDocument();
    });

    it("exibe emoji de estado emocional quando disponível", async () => {
      const mockUsers = [
        {
          id: "1",
          type: "student",
          name: "Elena Feliz",
          codename: "Radiante",
          email: "elena@email.com",
          isActive: true,
          emotionalStatus: "HAPPY",
        },
      ];

      usersApi.fetchUsers.mockResolvedValue(mockUsers);

      renderWithCleanup(<UsersManagementTab />);

      await waitFor(() => {
        expect(screen.getByText("Elena Feliz")).toBeInTheDocument();
      });

      // Verifica se o emoji está presente (😊)
      const emojiElement = screen.getByTitle("Feliz");
      expect(emojiElement).toBeInTheDocument();
    });
  });

  describe("Busca e Filtros", () => {
    const setupUsers = () => {
      const users = [
        {
          id: "1",
          type: "student",
          name: "Alice Santos",
          codename: "Ninja",
          email: "alice@email.com",
          isActive: true,
          hasGroup: false,
          wantsGroup: false,
          groupClass: "Turma A",
        },
        {
          id: "2",
          type: "student",
          name: "Bruno Lima",
          codename: "Samurai",
          email: "bruno@email.com",
          isActive: true,
          hasGroup: false,
          wantsGroup: true,
          groupClass: "Turma B",
        },
        {
          id: "3",
          type: "student",
          name: "Carla Dias",
          codename: "Maga",
          email: "carla@email.com",
          isActive: false,
          hasGroup: true,
          wantsGroup: true,
          groupClass: "Turma A",
        },
      ];

      usersApi.fetchUsers.mockResolvedValue(users);
    };

    it("busca por nome", async () => {
      setupUsers();

      const userObj = userEvent.setup({ delay: null });

      renderWithCleanup(<UsersManagementTab />);

      const searchInput = await screen.findByPlaceholderText(
        /Buscar por nome, codinome, email ou guilda/i
      );

      await userObj.type(searchInput, "Alice");

      await waitFor(() => {
        expect(screen.getByText("Alice Santos")).toBeInTheDocument();
        expect(screen.queryByText("Bruno Lima")).not.toBeInTheDocument();
      });
    });

    it("busca por codinome", async () => {
      setupUsers();

      const userObj = userEvent.setup({ delay: null });

      renderWithCleanup(<UsersManagementTab />);

      const searchInput = await screen.findByPlaceholderText(
        /Buscar por nome, codinome, email ou guilda/i
      );

      await userObj.type(searchInput, "Samurai");

      await waitFor(() => {
        expect(screen.getByText("Bruno Lima")).toBeInTheDocument();
        expect(screen.queryByText("Alice Santos")).not.toBeInTheDocument();
      });
    });

    it("busca por email", async () => {
      setupUsers();

      const userObj = userEvent.setup({ delay: null });

      renderWithCleanup(<UsersManagementTab />);

      // Mudar para "all" para ver usuários inativos também
      const filterSelect = await screen.findByDisplayValue("Ativos");
      await userObj.selectOptions(filterSelect, "all");

      const searchInput = await screen.findByPlaceholderText(
        /Buscar por nome, codinome, email ou guilda/i
      );

      await userObj.type(searchInput, "carla@email");

      await waitFor(() => {
        expect(screen.getByText("Carla Dias")).toBeInTheDocument();
        expect(screen.queryByText("Alice Santos")).not.toBeInTheDocument();
      });
    });

    it("filtra usuários ativos (padrão)", async () => {
      setupUsers();

      renderWithCleanup(<UsersManagementTab />);

      await waitFor(() => {
        expect(screen.getByText("Alice Santos")).toBeInTheDocument();
        expect(screen.getByText("Bruno Lima")).toBeInTheDocument();
        expect(screen.queryByText("Carla Dias")).not.toBeInTheDocument();
      });
    });

    it("filtra usuários solo", async () => {
      setupUsers();

      const userObj = userEvent.setup({ delay: null });

      renderWithCleanup(<UsersManagementTab />);

      const filterSelect = await screen.findByDisplayValue("Ativos");
      await userObj.selectOptions(filterSelect, "solo");

      await waitFor(() => {
        expect(screen.getByText("Alice Santos")).toBeInTheDocument();
        expect(screen.queryByText("Bruno Lima")).not.toBeInTheDocument();
      });
    });

    it("filtra usuários sem guilda", async () => {
      setupUsers();

      const userObj = userEvent.setup({ delay: null });

      renderWithCleanup(<UsersManagementTab />);

      const filterSelect = await screen.findByDisplayValue("Ativos");
      await userObj.selectOptions(filterSelect, "seeking");

      await waitFor(() => {
        expect(screen.getByText("Bruno Lima")).toBeInTheDocument();
        expect(screen.queryByText("Alice Santos")).not.toBeInTheDocument();
      });
    });

    it("filtra usuários inativos", async () => {
      setupUsers();

      const userObj = userEvent.setup({ delay: null });

      renderWithCleanup(<UsersManagementTab />);

      const filterSelect = await screen.findByDisplayValue("Ativos");
      await userObj.selectOptions(filterSelect, "inactive");

      await waitFor(() => {
        expect(screen.getByText("Carla Dias")).toBeInTheDocument();
        expect(screen.queryByText("Alice Santos")).not.toBeInTheDocument();
      });
    });

    it("mostra todos os usuários com filtro 'Todos'", async () => {
      setupUsers();

      const userObj = userEvent.setup({ delay: null });

      renderWithCleanup(<UsersManagementTab />);

      const filterSelect = await screen.findByDisplayValue("Ativos");
      await userObj.selectOptions(filterSelect, "all");

      await waitFor(() => {
        expect(screen.getByText("Alice Santos")).toBeInTheDocument();
        expect(screen.getByText("Bruno Lima")).toBeInTheDocument();
        expect(screen.getByText("Carla Dias")).toBeInTheDocument();
      });
    });

    it("filtra por estado emocional", async () => {
      const users = [
        {
          id: "1",
          type: "student",
          name: "Feliz User",
          codename: "Happy",
          email: "happy@email.com",
          isActive: true,
          emotionalStatus: "HAPPY",
        },
        {
          id: "2",
          type: "student",
          name: "Calmo User",
          codename: "Calm",
          email: "calm@email.com",
          isActive: true,
          emotionalStatus: "CALM",
        },
      ];

      usersApi.fetchUsers.mockResolvedValue(users);

      const userObj = userEvent.setup({ delay: null });

      renderWithCleanup(<UsersManagementTab />);

      await screen.findByText("Feliz User");

      const emotionalFilterSelect = screen.getByDisplayValue("Filtrar por estado emocional");
      await userObj.selectOptions(emotionalFilterSelect, "HAPPY");

      await waitFor(() => {
        expect(screen.getByText("Feliz User")).toBeInTheDocument();
        expect(screen.queryByText("Calmo User")).not.toBeInTheDocument();
      });
    });
  });

  describe("Ordenação", () => {
    const setupUsers = () => {
      const users = [
        {
          id: "1",
          type: "student",
          name: "Zilda Xavier",
          codename: "Z",
          email: "z@email.com",
          isActive: true,
          groupClass: "Turma B",
        },
        {
          id: "2",
          type: "student",
          name: "Alberto Costa",
          codename: "A",
          email: "a@email.com",
          isActive: true,
          groupClass: "Turma A",
        },
      ];

      usersApi.fetchUsers.mockResolvedValue(users);
    };

    it("ordena por nome (alfabética)", async () => {
      setupUsers();

      const userObj = userEvent.setup({ delay: null });

      renderWithCleanup(<UsersManagementTab />);

      await screen.findByText("Zilda Xavier");

      const nameButton = screen.getByText(/Ordenar por Nome/i);
      await userObj.click(nameButton);

      await waitFor(() => {
        const names = screen.getAllByRole("heading", { level: 4 });
        expect(names[0]).toHaveTextContent("Alberto Costa");
        expect(names[1]).toHaveTextContent("Zilda Xavier");
      });
    });

    it("ordena por turma", async () => {
      setupUsers();

      const userObj = userEvent.setup({ delay: null });

      renderWithCleanup(<UsersManagementTab />);

      await screen.findByText("Zilda Xavier");

      const classButton = screen.getByText(/Ordenar por Turma/i);
      await userObj.click(classButton);

      await waitFor(() => {
        // Pegar os parágrafos que contêm as turmas (último p de cada card)
        const userCards = screen.getAllByRole("heading", { level: 4 });
        // Alberto Costa (Turma A) deve vir primeiro
        expect(userCards[0]).toHaveTextContent("Alberto Costa");
        expect(userCards[1]).toHaveTextContent("Zilda Xavier");
      });
    });
  });

  describe("Ativar/Inativar Usuário", () => {
    it("abre modal de confirmação ao inativar usuário", async () => {
      const mockUsers = [
        {
          id: "1",
          type: "student",
          name: "Teste Inativar",
          codename: "Test",
          email: "test@email.com",
          isActive: true,
        },
      ];

      usersApi.fetchUsers.mockResolvedValue(mockUsers);

      const userObj = userEvent.setup({ delay: null });

      renderWithCleanup(<UsersManagementTab />);

      await screen.findByText("Teste Inativar");

      const toggleButton = screen.getByTitle("Inativar usuário");
      await userObj.click(toggleButton);

      expect(
        await screen.findByText(/Tem certeza que deseja inativar o usuário "Teste Inativar"/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Remover o aluno de seu time/i)
      ).toBeInTheDocument();
    });

    it("inativa usuário após confirmação", async () => {
      const mockUsers = [
        {
          id: "1",
          type: "student",
          name: "User Ativo",
          codename: "Active",
          email: "active@email.com",
          isActive: true,
        },
      ];

      usersApi.fetchUsers.mockResolvedValue(mockUsers);
      usersApi.deactivateUser.mockResolvedValue({});

      const userObj = userEvent.setup({ delay: null });

      renderWithCleanup(<UsersManagementTab />);

      await screen.findByText("User Ativo");

      const toggleButton = screen.getByTitle("Inativar usuário");
      await userObj.click(toggleButton);

      const confirmButton = await screen.findByRole("button", { name: /SIM/i });

      // Mock para segunda chamada após inativação
      usersApi.fetchUsers.mockResolvedValue([
        { ...mockUsers[0], isActive: false },
      ]);

      await userObj.click(confirmButton);

      await waitFor(() => {
        expect(usersApi.deactivateUser).toHaveBeenCalledWith("1");
        expect(toast.success).toHaveBeenCalledWith("Usuário inativado com sucesso!");
      });
    });

    it("ativa usuário diretamente sem confirmação", async () => {
      const mockUsers = [
        {
          id: "1",
          type: "student",
          name: "User Inativo",
          codename: "Inactive",
          email: "inactive@email.com",
          isActive: false,
        },
      ];

      usersApi.fetchUsers.mockResolvedValue(mockUsers);
      usersApi.activateUser.mockResolvedValue({});

      const userObj = userEvent.setup({ delay: null });

      renderWithCleanup(<UsersManagementTab />);

      // Filtrar por inativos primeiro
      const filterSelect = await screen.findByDisplayValue("Ativos");
      await userObj.selectOptions(filterSelect, "inactive");

      await screen.findByText("User Inativo");

      const toggleButton = screen.getByTitle("Ativar usuário");

      // Mock para chamada após ativação
      usersApi.fetchUsers.mockResolvedValue([
        { ...mockUsers[0], isActive: true },
      ]);

      await userObj.click(toggleButton);

      await waitFor(() => {
        expect(usersApi.activateUser).toHaveBeenCalledWith("1");
        expect(toast.success).toHaveBeenCalledWith("Usuário reativado com sucesso!");
      });
    });

    it("exibe erro ao falhar inativação", async () => {
      const mockUsers = [
        {
          id: "1",
          type: "student",
          name: "User Erro",
          codename: "Error",
          email: "error@email.com",
          isActive: true,
        },
      ];

      usersApi.fetchUsers.mockResolvedValue(mockUsers);
      usersApi.deactivateUser.mockRejectedValue(new Error("Erro de rede"));

      const userObj = userEvent.setup({ delay: null });

      renderWithCleanup(<UsersManagementTab />);

      await screen.findByText("User Erro");

      const toggleButton = screen.getByTitle("Inativar usuário");
      await userObj.click(toggleButton);

      const confirmButton = await screen.findByRole("button", { name: /SIM/i });
      await userObj.click(confirmButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Erro ao alterar status do usuário");
      });
    });
  });

  describe("Paginação", () => {
    it("exibe paginação quando há mais de 30 usuários", async () => {
      const manyUsers = Array.from({ length: 40 }, (_, i) => ({
        id: `${i}`,
        type: "student",
        name: `User ${i}`,
        codename: `Code ${i}`,
        email: `user${i}@email.com`,
        isActive: true,
      }));

      usersApi.fetchUsers.mockResolvedValue(manyUsers);

      renderWithCleanup(<UsersManagementTab />);

      await waitFor(() => {
        expect(screen.getByText(/Mostrando/i)).toBeInTheDocument();
      });
    });

    it("não exibe paginação quando há 30 ou menos usuários", async () => {
      const fewUsers = Array.from({ length: 10 }, (_, i) => ({
        id: `${i}`,
        type: "student",
        name: `User ${i}`,
        codename: `Code ${i}`,
        email: `user${i}@email.com`,
        isActive: true,
      }));

      usersApi.fetchUsers.mockResolvedValue(fewUsers);

      renderWithCleanup(<UsersManagementTab />);

      await waitFor(() => {
        expect(screen.getByText("User 0")).toBeInTheDocument();
      });

      expect(screen.queryByText(/Mostrando/i)).not.toBeInTheDocument();
    });
  });

  describe("Contador de Usuários", () => {
    it("exibe total de usuários", async () => {
      const mockUsers = [
        {
          id: "1",
          type: "student",
          name: "User 1",
          codename: "U1",
          email: "u1@email.com",
          isActive: true,
        },
        {
          id: "2",
          type: "student",
          name: "User 2",
          codename: "U2",
          email: "u2@email.com",
          isActive: true,
        },
      ];

      usersApi.fetchUsers.mockResolvedValue(mockUsers);

      renderWithCleanup(<UsersManagementTab />);

      expect(await screen.findByText(/Total de usuários:/i)).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
    });
  });

  describe("Mensagem quando não há usuários", () => {
    it("exibe mensagem quando não há usuários com filtros aplicados", async () => {
      usersApi.fetchUsers.mockResolvedValue([]);

      renderWithCleanup(<UsersManagementTab />);

      expect(
        await screen.findByText(/Nenhum estudante encontrado com os filtros aplicados/i)
      ).toBeInTheDocument();
    });
  });

  describe("Link para visualizar projeto", () => {
    it("exibe link de projeto apenas para usuários solo ativos", async () => {
      const mockUsers = [
        {
          id: "1",
          type: "student",
          name: "Solo User",
          codename: "Solo",
          email: "solo@email.com",
          isActive: true,
          hasGroup: false,
          wantsGroup: false,
        },
      ];

      usersApi.fetchUsers.mockResolvedValue(mockUsers);

      renderWithCleanup(<UsersManagementTab />);

      await screen.findByText("Solo User");

      const projectLink = screen.getByTitle("Visualizar progresso do projeto");
      expect(projectLink).toHaveAttribute("href", "/dashboard/project?viewUser=1");
    });

    it("não exibe link de projeto para usuários com grupo", async () => {
      const mockUsers = [
        {
          id: "1",
          type: "student",
          name: "Grouped User",
          codename: "Group",
          email: "group@email.com",
          isActive: true,
          hasGroup: true,
          wantsGroup: true,
        },
      ];

      usersApi.fetchUsers.mockResolvedValue(mockUsers);

      renderWithCleanup(<UsersManagementTab />);

      await screen.findByText("Grouped User");

      expect(
        screen.queryByTitle("Visualizar progresso do projeto")
      ).not.toBeInTheDocument();
    });
  });
});
