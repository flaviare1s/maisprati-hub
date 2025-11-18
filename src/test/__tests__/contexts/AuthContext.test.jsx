import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { AuthProvider, AuthContext } from '../../../contexts/AuthContext';
import { useContext } from 'react';
import { mockUsers } from '../../utils/mock-data';

// Variáveis para as funções mockadas que precisam ser reatribuídas
let mockLoginUser = vi.fn();
let mockLogoutUser = vi.fn();
let mockGetCurrentUserData = vi.fn();
let mockRegisterUser = vi.fn();
let mockGetTeamWithMembers = vi.fn();
let mockNavigate = vi.fn();

// --- MOCKS DE API ---
// CORREÇÃO: Usando getters para evitar o erro de hoisting (ReferenceError)
vi.mock('../../../api/teams', () => ({
  get getTeamWithMembers() { return mockGetTeamWithMembers; } // Acesso adiado
}));

vi.mock('../../../api/auth', () => ({
  get loginUser() { return mockLoginUser; }, // Acesso adiado
  get registerUser() { return mockRegisterUser; }, // Acesso adiado
  get logoutUser() { return mockLogoutUser; }, // Acesso adiado
  forgotPassword: vi.fn(),
  resetPassword: vi.fn(),
}));

vi.mock('../../../api/users', () => ({
  get getCurrentUserData() { return mockGetCurrentUserData; } // Acesso adiado
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});


// --- MOCKS DE AMBIENTE E INICIALIZAÇÃO ---
beforeEach(() => {
  vi.clearAllMocks();

  // Redefine as funções mockadas para cada teste
  mockLoginUser = vi.fn();
  mockLogoutUser = vi.fn();
  mockGetCurrentUserData = vi.fn();
  mockRegisterUser = vi.fn();
  mockGetTeamWithMembers = vi.fn();
  mockNavigate = vi.fn();

  // 1. Solução para o erro "ReferenceError: window/document is not defined"
  // Simula as funções de Event Listener que o useEffect do AuthContext usa
  // Sem isso, o JSDOM (ambiente de teste) trava
  vi.spyOn(window, 'addEventListener').mockImplementation(() => { });
  vi.spyOn(window, 'removeEventListener').mockImplementation(() => { });
  vi.spyOn(document, 'addEventListener').mockImplementation(() => { });
  vi.spyOn(document, 'removeEventListener').mockImplementation(() => { });

  // Configuração de mocks iniciais para evitar erros na montagem
  mockGetCurrentUserData.mockResolvedValue(null);
  mockGetTeamWithMembers.mockResolvedValue(null);
});


// Componente de teste para acessar o contexto e expor as funções
const TestComponent = () => {
  const auth = useContext(AuthContext);
  return (
    <div>
      <div data-testid="user">{auth.user ? JSON.stringify(auth.user) : 'null'}</div>
      <div data-testid="authenticated">{auth.user ? 'true' : 'false'}</div>
      <button onClick={() => auth.login({ email: 'test@mail.com', password: '123' })}>Login Button</button>
      <button onClick={() => auth.logout({ skipServer: false })}>Logout Button</button>
      <button onClick={() => auth.registerUser({ email: 'new@mail.com', password: '123' })}>Register Button</button>
    </div>
  );
};

describe('AuthContext', () => {
  const mockUserData = mockUsers.find(u => u.type === 'student'); // Pega um usuário padrão para mock

  // Teste de inicialização (simula checagem via cookie)
  it('deve checar e carregar dados do usuário na inicialização (via getCurrentUserData)', async () => {
    mockGetCurrentUserData.mockResolvedValue(mockUserData);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(mockGetCurrentUserData).toHaveBeenCalled();
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    });
  });

  // Simula a falha de autenticação na inicialização (nenhum cookie válido)
  it('deve inicializar com usuário não autenticado se getCurrentUserData falhar', async () => {
    // Simula que getCurrentUserData retorna null ou lança erro 401/403
    mockGetCurrentUserData.mockRejectedValue({ response: { status: 401 } });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    });
  });

  // Teste de login bem-sucedido
  it('deve fazer login, definir o usuário e navegar para o dashboard', async () => {
    mockLoginUser.mockResolvedValue({});
    mockGetCurrentUserData.mockResolvedValue(mockUserData);

    const { getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(getByText('Login Button'));

    await waitFor(() => {
      expect(mockLoginUser).toHaveBeenCalledWith({ email: 'test@mail.com', password: '123' });
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    });
  });

  // Teste de logout bem-sucedido
  it('deve fazer logout, limpar o usuário e navegar para o login', async () => {
    // Inicia com o usuário logado
    mockGetCurrentUserData.mockResolvedValue(mockUserData);

    const { getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByTestId('authenticated')).toHaveTextContent('true'));

    fireEvent.click(getByText('Logout Button'));

    await waitFor(() => {
      expect(mockLogoutUser).toHaveBeenCalled();
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });
});
