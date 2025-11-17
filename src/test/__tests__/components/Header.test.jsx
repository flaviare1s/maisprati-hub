import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { Header } from '../../../components/Header';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';

// --- Mocks Essenciais ---

// Mocka o hook useNavigate (necessário para Link/BrowserRouter)
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
    BrowserRouter: ({ children }) => <div>{children}</div> // Simplifica o router
  };
});

// Mocka o useAuth (para controlar login/logout)
const mockUseAuth = vi.fn();
vi.mock('../../../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mocka os subcomponentes, ADICIONANDO um botão para testar o onLogout
vi.mock('../../../components/MenuDesktop', () => ({
  MenuDesktop: ({ user, onLogout }) => (
    <div data-testid="menu-desktop">
      Desktop Menu {user ? 'LOGGED_IN' : 'LOGGED_OUT'}
      {user && (
        <button onClick={onLogout} data-testid="desktop-logout-trigger" aria-label="Sair do Sistema">
          Logout Trigger
        </button>
      )}
    </div>
  )
}));
vi.mock('../../../components/MenuMobile', () => ({
  MenuMobile: ({ user }) => <div data-testid="menu-mobile">Mobile Menu {user ? 'LOGGED_IN' : 'LOGGED_OUT'}</div>
}));
vi.mock('../../../components/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle" />
}));


describe('Header - Testes de Estado e Navegação', () => {
  const mockLogout = vi.fn();
  const USER_LOGGED_IN = { id: 'u1', name: 'User Test' };
  const userObj = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  // --- 1. Cenário: Usuário DESLOGADO ---

  it('deve renderizar o MenuDesktop/Mobile para DESLOGADO e o link da logo deve ir para /', () => {
    // Configura o mock como deslogado
    mockUseAuth.mockReturnValue({ user: null, logout: mockLogout });

    render(<Header />);

    // 1. Verifica os menus (deve mostrar LOGGED_OUT)
    expect(screen.getByTestId('menu-desktop')).toHaveTextContent('LOGGED_OUT');
    expect(screen.getByTestId('menu-mobile')).toHaveTextContent('LOGGED_OUT');

    // 2. Verifica o link da logo (getRedirectPath() deve retornar "/")
    const logoLink = screen.getByAltText('Logo').closest('a');
    expect(logoLink).toHaveAttribute('href', '/');

    // 3. Verifica a presença do ThemeToggle
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
  });

  // --- 2. Cenário: Usuário LOGADO ---

  it('deve renderizar o MenuDesktop/Mobile para LOGADO e o link da logo deve ir para /dashboard', () => {
    // Configura o mock como logado
    mockUseAuth.mockReturnValue({ user: USER_LOGGED_IN, logout: mockLogout });

    render(<Header />);

    // 1. Verifica os menus (deve mostrar LOGGED_IN)
    expect(screen.getByTestId('menu-desktop')).toHaveTextContent('LOGGED_IN');
    expect(screen.getByTestId('menu-mobile')).toHaveTextContent('LOGGED_IN');

    // 2. Verifica o link da logo (getRedirectPath() deve retornar "/dashboard")
    const logoLink = screen.getByAltText('Logo').closest('a');
    expect(logoLink).toHaveAttribute('href', '/dashboard');
  });

  // --- 3. Teste de Funcionalidade (Logout) ---

  it('deve chamar a função logout com { skipServer: false }', async () => {
    // Configura o mock como logado
    mockUseAuth.mockReturnValue({ user: USER_LOGGED_IN, logout: mockLogout });

    render(<Header />);

    // 1. Encontra o botão de logout injetado no MenuDesktop mockado
    const logoutTrigger = screen.getByTestId('desktop-logout-trigger');

    // 2. Simula o clique
    await userObj.click(logoutTrigger);

    // 3. Verifica se a função 'logout' do useAuth foi chamada com o argumento correto.
    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
      expect(mockLogout).toHaveBeenCalledWith({ skipServer: false });
    });
  });
});
