import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TeamSelect } from "../../../pages/TeamSelect";
import * as teamsApi from "../../../api/teams";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { AuthContext } from "../../../contexts/AuthContext";
import userEvent from "@testing-library/user-event";
import toast from "react-hot-toast";

// Mock do react-router-dom (useNavigate)
const mockedNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

// Mock do react-hot-toast
vi.mock("react-hot-toast");

// Mock do contexto de autenticação
const MOCK_USER = {
  id: "user123",
  name: "Aluno Teste",
  email: "aluno@teste.com",
  hasGroup: false,
};
const MOCK_UPDATE_USER = vi.fn();
const MockAuthProvider = ({ children }) => {
  const mockContext = { user: MOCK_USER, updateUser: MOCK_UPDATE_USER };
  return <AuthContext.Provider value={mockContext}>{children}</AuthContext.Provider>;
};

// Mock das funções de API de times
vi.mock("../../../api/teams", () => ({
  fetchTeams: vi.fn(),
  validateTeamCode: vi.fn(),
  addMemberToTeam: vi.fn(),
}));

// Mock do window.innerWidth (para testar desktop/mobile)
const mockWindowWidth = (width) => {
  vi.stubGlobal('innerWidth', width);
  fireEvent(window, new Event('resize'));
};


describe("TeamSelect - Testes Abrangentes", () => {
  const userObj = userEvent.setup();

  const mockTeams = [
    { id: "teamA", name: "Time Alpha", currentMembers: 1, maxMembers: 3 },
    { id: "teamB", name: "Time Beta", currentMembers: 2, maxMembers: 4 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    teamsApi.fetchTeams.mockResolvedValue(mockTeams);
    mockWindowWidth(1024); // Padrão: Desktop
  });

  // --- Testes de Carregamento e Renderização ---

  describe("Carregamento e Renderização Inicial", () => {
    it("deve exibir a lista de times após carregar", async () => {
      render(
        <MemoryRouter>
          <MockAuthProvider>
            <TeamSelect />
          </MockAuthProvider>
        </MemoryRouter>
      );

      // Espera pelos times carregados
      expect(await screen.findByText("Time Alpha")).toBeInTheDocument();
      expect(screen.getByText("Time Beta")).toBeInTheDocument();

      // Verifica as informações dos membros
      expect(screen.getByText("1/3 membros")).toBeInTheDocument();
      expect(screen.getByText("2/4 membros")).toBeInTheDocument();
    });

    it("deve exibir mensagem se não houver times", async () => {
      teamsApi.fetchTeams.mockResolvedValue([]);

      render(
        <MemoryRouter>
          <MockAuthProvider>
            <TeamSelect />
          </MockAuthProvider>
        </MemoryRouter>
      );

      // Espera pela mensagem
      expect(
        await screen.findByText("Nenhum time cadastrado!")
      ).toBeInTheDocument();
    });

    it("deve exibir erro se a API falhar ao carregar times", async () => {
      teamsApi.fetchTeams.mockRejectedValue(new Error("Erro de rede"));

      render(
        <MemoryRouter>
          <MockAuthProvider>
            <TeamSelect />
          </MockAuthProvider>
        </MemoryRouter>
      );

      // Verifica se o toast de erro foi chamado
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Erro ao carregar times");
      });
    });
  });

  // --- Testes de Interação (Modal) ---

  describe("Interação com o Modal de Código de Segurança", () => {

    it("deve abrir o modal ao selecionar um time (Desktop)", async () => {
      render(
        <MemoryRouter>
          <MockAuthProvider>
            <TeamSelect />
          </MockAuthProvider>
        </MemoryRouter>
      );

      const teamButton = await screen.findByText("Time Alpha");
      await userObj.click(teamButton);

      // Verifica se o título do modal é renderizado
      expect(await screen.findByText("Código de Segurança")).toBeInTheDocument();
      expect(screen.getByText(/Digite o código para entrar no Time Alpha/i)).toBeInTheDocument();

      // Verifica se o modal de Desktop está visível
      expect(screen.getByText("← Voltar")).toBeInTheDocument();
      expect(screen.getByRole('button', { name: "Confirmar" })).toBeInTheDocument();
    });

    it("deve abrir o modal ao selecionar um time (Mobile)", async () => {
      mockWindowWidth(500); // Força Mobile

      render(
        <MemoryRouter>
          <MockAuthProvider>
            <TeamSelect />
          </MockAuthProvider>
        </MemoryRouter>
      );

      const teamButton = await screen.findByText("Time Beta");
      await userObj.click(teamButton);

      // Verifica se o título do modal é renderizado
      expect(await screen.findByText("Código de Segurança")).toBeInTheDocument();
    });

    it("deve fechar o modal ao clicar em 'Voltar'", async () => {
      render(
        <MemoryRouter>
          <MockAuthProvider>
            <TeamSelect />
          </MockAuthProvider>
        </MemoryRouter>
      );

      const teamButton = await screen.findByText("Time Alpha");
      await userObj.click(teamButton);

      // Modal aberto
      const backButton = screen.getByText("← Voltar");
      await userObj.click(backButton);

      // Modal fechado
      await waitFor(() => {
        expect(screen.queryByText("Código de Segurança")).not.toBeInTheDocument();
      });
    });

    // CORREÇÃO DO ERRO: Teste usando o clique no backdrop, que requer o data-testid no componente.
    it("deve fechar o modal ao clicar no backdrop (Desktop)", async () => {
      mockWindowWidth(1024);
      render(
        <MemoryRouter>
          <MockAuthProvider>
            <TeamSelect />
          </MockAuthProvider>
        </MemoryRouter>
      );

      const teamButton = await screen.findByText("Time Alpha");
      await userObj.click(teamButton);

      // Modal aberto
      expect(screen.getByText("Código de Segurança")).toBeInTheDocument();

      // Busca pelo data-testid que deve ser adicionado no componente
      const backdrop = screen.getByTestId('backdrop-desktop');

      // Simula o clique no backdrop (o elemento que tem o evento)
      await userObj.click(backdrop);

      await waitFor(() => {
        expect(screen.queryByText("Código de Segurança")).not.toBeInTheDocument();
      });
    });
  });

  // --- Testes de Submissão de Formulário ---

  describe("Submissão do Formulário de Código", () => {
    const validCode = "1234";
    const updatedUserData = { ...MOCK_USER, hasGroup: true };
    const updatedTeam = { id: "teamA", name: "Time Alpha" };

    beforeEach(async () => {
      // Abre o modal
      render(
        <MemoryRouter>
          <MockAuthProvider>
            <TeamSelect />
          </MockAuthProvider>
        </MemoryRouter>
      );
      const teamButton = await screen.findByText("Time Alpha");
      await userObj.click(teamButton);
    });

    it("deve ter sucesso e navegar para o dashboard com código válido", async () => {
      teamsApi.validateTeamCode.mockResolvedValue(true);
      teamsApi.addMemberToTeam.mockResolvedValue({ updatedTeam, updatedUserData });

      const codeInput = screen.getByPlaceholderText("Código de segurança");
      const submitButton = screen.getByRole("button", { name: "Confirmar" });

      await userObj.type(codeInput, validCode);
      await userObj.click(submitButton);

      // 1. Verifica se a API de validação foi chamada
      await waitFor(() => {
        expect(teamsApi.validateTeamCode).toHaveBeenCalledWith("teamA", validCode);
      });

      // 2. Verifica se o membro foi adicionado
      expect(teamsApi.addMemberToTeam).toHaveBeenCalledWith("teamA", {
        userId: MOCK_USER.id,
        role: "member",
        specialization: "Desenvolvedor"
      });

      // 3. Verifica a atualização do contexto do usuário
      expect(MOCK_UPDATE_USER).toHaveBeenCalledWith(updatedUserData);

      // 4. Verifica o toast de sucesso e a navegação
      expect(toast.success).toHaveBeenCalledWith("Bem-vindo ao Time Alpha!");
      expect(mockedNavigate).toHaveBeenCalledWith("/dashboard");
    });

    it("deve exibir erro no formulário se o código for muito curto", async () => {
      const codeInput = screen.getByPlaceholderText("Código de segurança");
      const submitButton = screen.getByRole("button", { name: "Confirmar" });

      await userObj.type(codeInput, "123");
      await userObj.click(submitButton);

      // Verifica a mensagem de erro do react-hook-form
      expect(screen.getByText("Código deve ter pelo menos 4 caracteres")).toBeInTheDocument();
      expect(teamsApi.validateTeamCode).not.toHaveBeenCalled();
    });

    it("deve exibir erro se a validação do código falhar", async () => {
      teamsApi.validateTeamCode.mockRejectedValue({
        response: { data: { error: "Código inválido fornecido" } }
      });

      const codeInput = screen.getByPlaceholderText("Código de segurança");
      const submitButton = screen.getByRole("button", { name: "Confirmar" });

      await userObj.type(codeInput, validCode);
      await userObj.click(submitButton);

      await waitFor(() => {
        expect(teamsApi.validateTeamCode).toHaveBeenCalled();
      });

      expect(toast.error).toHaveBeenCalledWith("Código inválido fornecido");
      expect(teamsApi.addMemberToTeam).not.toHaveBeenCalled();
    });

    // CORREÇÃO DO ERRO: Espera a mensagem de erro real do mock (Error: Erro ao salvar dados)
    it("deve exibir erro se a adição do membro falhar", async () => {
      teamsApi.validateTeamCode.mockResolvedValue(true);
      teamsApi.addMemberToTeam.mockRejectedValue(new Error("Erro ao salvar dados"));

      const codeInput = screen.getByPlaceholderText("Código de segurança");
      const submitButton = screen.getByRole("button", { name: "Confirmar" });

      await userObj.type(codeInput, validCode);
      await userObj.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Erro ao salvar dados");
      });
    });
  });
});
