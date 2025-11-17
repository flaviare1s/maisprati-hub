import { render, screen } from "@testing-library/react";
import { PrivateRoute } from "../../../components/PrivateRoute";
import { describe, expect, it, vi, beforeEach } from "vitest";

// --- Mocks Essenciais ---

// 1. Mock do useAuth (para controlar user e loading)
const mockUseAuth = vi.fn();
vi.mock("../../../hooks/useAuth", () => ({
  useAuth: () => mockUseAuth(),
}));

// 2. Mock do useLocation
const mockUseLocation = vi.fn();
vi.mock("react-router-dom", () => ({
  useLocation: () => mockUseLocation(),
  // O componente Navigate precisa ser mockado, mas deve retornar seu estado (props) para asserção
  Navigate: ({ to, state, replace }) => (
    <div data-testid="navigate" data-to={to} data-state={JSON.stringify(state)} data-replace={replace}>
      NAVIGATE_REDIRECT
    </div>
  ),
}));

// 3. Mock do utilitário de permissões
const mockIsAdmin = vi.fn();
vi.mock("../../../../utils/permissions", () => ({
  isAdmin: (user) => mockIsAdmin(user),
}));


// CORREÇÃO CRÍTICA: Componente Wrapper para simular o Provedor de Contexto.
// Embora o mockUseAuth já forneça os dados, o componente PrivateRoute espera
// ser aninhado dentro de um <AuthProvider> real, por isso usamos este wrapper.
const MockProvider = ({ children }) =>
  <div data-testid="mock-provider">{children}</div>;


describe("PrivateRoute - Testes Abrangentes de Redirecionamento", () => {
  // Mocks de dados
  const MOCK_LOCATION = { pathname: "/secure" };
  const CHILD_TEXT = "Conteúdo Protegido";

  // Tipos de usuários
  const USER_STUDENT_NO_GROUP = { id: "s1", type: "student", hasGroup: false };
  const USER_STUDENT_WITH_GROUP = { id: "s2", type: "student", hasGroup: true };
  const USER_ADMIN = { id: "a1", type: "admin", hasGroup: false };
  const USER_TEACHER = { id: "t1", type: "teacher", hasGroup: false };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseLocation.mockReturnValue(MOCK_LOCATION);
    mockIsAdmin.mockReturnValue(false);

    // Adiciona o role progressbar no DOM para o teste do loader
    document.body.innerHTML = `
      <div id="root">
        <div role="progressbar" aria-label="Carregando" class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-logo"></div>
      </div>
    `;
  });

  // --- 1. Testes de Estado de Carregamento ---

  it("deve exibir um loader (spinner) enquanto os dados do usuário estão carregando", () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true });

    render(
      <MockProvider>
        <PrivateRoute>{CHILD_TEXT}</PrivateRoute>
      </MockProvider>
    );

    // Verifica a presença do spinner (que está no beforeEach do DOM)
    // O PrivateRoute deve renderizar o spinner condicionalmente
    expect(screen.getByRole('progressbar', { name: "Carregando" })).toBeInTheDocument();
    expect(screen.queryByText(CHILD_TEXT)).not.toBeInTheDocument();
  });

  // Adiciona um teste para garantir que o loader tem o role progressbar
  it("deve garantir que o loader tem o role progressbar", () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true });

    render(
      <MockProvider>
        <PrivateRoute>{CHILD_TEXT}</PrivateRoute>
      </MockProvider>
    );

    // O elemento de loading é verificado pela sua função (role) e label
    const spinner = screen.getByRole('progressbar', { name: "Carregando" });
    expect(spinner).toBeInTheDocument();
  });


  // --- 2. Testes de Autenticação (Não Logado) ---

  it("deve redirecionar para /login se o usuário não estiver autenticado", () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false });

    render(
      <MockProvider>
        <PrivateRoute>{CHILD_TEXT}</PrivateRoute>
      </MockProvider>
    );

    const navigateElement = screen.getByTestId("navigate");

    // Verifica o redirecionamento
    expect(navigateElement).toBeInTheDocument();
    expect(navigateElement).toHaveAttribute("data-to", "/login");

    // Verifica se o estado 'from' foi passado (para redirecionar de volta após o login)
    expect(navigateElement).toHaveAttribute("data-state", JSON.stringify({ from: MOCK_LOCATION }));
  });

  // --- 3. Testes de Regras de Grupo (requireGroup) ---

  it("deve bloquear o acesso e redirecionar para / se for aluno e 'requireGroup' for true sem time", () => {
    mockUseAuth.mockReturnValue({ user: USER_STUDENT_NO_GROUP, loading: false });

    render(
      <MockProvider>
        <PrivateRoute requireGroup={true}>{CHILD_TEXT}</PrivateRoute>
      </MockProvider>
    );

    const navigateElement = screen.getByTestId("navigate");

    // Deve redirecionar para a página inicial (/)
    expect(navigateElement).toHaveAttribute("data-to", "/");
    expect(screen.queryByText(CHILD_TEXT)).not.toBeInTheDocument();
  });

  it("deve conceder acesso se 'requireGroup' for true e o aluno tiver time", () => {
    mockUseAuth.mockReturnValue({ user: USER_STUDENT_WITH_GROUP, loading: false });

    render(
      <MockProvider>
        <PrivateRoute requireGroup={true}>{CHILD_TEXT}</PrivateRoute>
      </MockProvider>
    );

    // Deve renderizar o conteúdo (acesso concedido)
    expect(screen.getByText(CHILD_TEXT)).toBeInTheDocument();
  });

  it("deve conceder acesso se 'requireGroup' for true, mas o usuário for Admin (bypass)", () => {
    mockUseAuth.mockReturnValue({ user: USER_ADMIN, loading: false });
    mockIsAdmin.mockReturnValue(true); // Admin bypassa a regra de grupo

    render(
      <MockProvider>
        <PrivateRoute requireGroup={true}>{CHILD_TEXT}</PrivateRoute>
      </MockProvider>
    );

    // Deve renderizar o conteúdo (admin bypassa)
    expect(screen.getByText(CHILD_TEXT)).toBeInTheDocument();
  });

  // --- 4. Testes de Tipo de Usuário (requiredType) ---

  it("deve bloquear o acesso e redirecionar para /401 se o tipo de usuário for incorreto", () => {
    mockUseAuth.mockReturnValue({ user: USER_TEACHER, loading: false });

    // Rota requer admin, mas o usuário é teacher
    render(
      <MockProvider>
        <PrivateRoute requiredType="admin">{CHILD_TEXT}</PrivateRoute>
      </MockProvider>
    );

    const navigateElement = screen.getByTestId("navigate");

    // Verifica o redirecionamento para a página 401
    expect(navigateElement).toHaveAttribute("data-to", "/401");
    expect(screen.queryByText(CHILD_TEXT)).not.toBeInTheDocument();
  });

  it("deve conceder acesso se o tipo de usuário for correto", () => {
    mockUseAuth.mockReturnValue({ user: USER_ADMIN, loading: false });

    // Rota requer admin, usuário é admin
    render(
      <MockProvider>
        <PrivateRoute requiredType="admin">{CHILD_TEXT}</PrivateRoute>
      </MockProvider>
    );

    // Deve renderizar o conteúdo
    expect(screen.getByText(CHILD_TEXT)).toBeInTheDocument();
  });

  // --- 5. Teste de Acesso Padrão Concedido ---

  it("deve conceder acesso se o usuário estiver logado e não houver restrições", () => {
    mockUseAuth.mockReturnValue({ user: USER_STUDENT_NO_GROUP, loading: false });

    // Não há requiredType nem requireGroup
    render(
      <MockProvider>
        <PrivateRoute>{CHILD_TEXT}</PrivateRoute>
      </MockProvider>
    );

    // Deve renderizar o conteúdo
    expect(screen.getByText(CHILD_TEXT)).toBeInTheDocument();
  });
});
