import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { MenuMobile } from '../../../components/MenuMobile';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';

// Mock do componente Link (simulando a tag <a>)
vi.mock('react-router-dom', () => ({
  Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
}));

// --- Mocks de Ambiente ---
const setupThemeMock = () => {
  // Mocka o MutationObserver para controle total do teste
  const observerMock = {
    observe: vi.fn(),
    disconnect: vi.fn(),
    takeRecords: vi.fn(),
  };
  vi.stubGlobal('MutationObserver', vi.fn(() => observerMock));

  // Função para simular a mudança de tema (alterando a classe do <html>)
  const toggleTheme = (isDark) => {
    document.documentElement.classList.toggle('dark', isDark);
    // Simula o disparo do observer para o useEffect reagir
    if (observerMock.observe.mock.calls.length > 0) {
      // Chama o callback do MutationObserver se houver observadores
      const callback = vi.mocked(MutationObserver).mock.calls[0][0];
      callback();
    }
  };

  // Inicializa o tema como claro (padrão)
  document.documentElement.classList.remove('dark');
  return toggleTheme;
};

describe('MenuMobile - Testes de Interatividade e Conteúdo', () => {
  const mockOnLogout = vi.fn();
  const USER_LOGGED_IN = {
    id: 'u1',
    name: 'John Doe',
    codename: 'SwiftBlade',
    email: 'john@example.com',
    avatar: '/avatar.jpg'
  };
  const userObj = userEvent.setup();
  let toggleTheme;

  beforeEach(() => {
    vi.clearAllMocks();
    toggleTheme = setupThemeMock();
  });

  afterEach(() => {
    cleanup();
    // Garante que o ambiente DOM é limpo
    document.documentElement.classList.remove('dark');
  });

  // --- 1. Testes de Estado do Menu (Abrir/Fechar) ---

  it('deve estar fechado inicialmente e abrir ao clicar no botão Hamburger', async () => {
    render(<MenuMobile user={null} onLogout={mockOnLogout} />);

    // Verifica o estado inicial (fechado)
    const menuPanel = screen.getByText('Menu').closest('div').parentElement; // Encontra o painel pelo título
    expect(menuPanel).toHaveClass('translate-x-full');

    // 1. Clica no botão Hamburger
    const openButton = screen.getByRole('button', { name: /Abrir menu/i });
    await userObj.click(openButton);

    // 2. Verifica se o menu abriu (translate-x-0)
    expect(menuPanel).not.toHaveClass('translate-x-full');
    expect(menuPanel).toHaveClass('translate-x-0');
  });

  it('deve fechar ao clicar no botão Fechar (X)', async () => {
    render(<MenuMobile user={null} onLogout={mockOnLogout} />);

    const openButton = screen.getByRole('button', { name: /Abrir menu/i });
    await userObj.click(openButton); // Abre

    // Clica no botão Fechar (X)
    const closeButton = screen.getByRole('button', { name: /Fechar menu/i });
    await userObj.click(closeButton);

    // Verifica se o menu fechou
    const menuPanel = screen.getByText('Menu').closest('div').parentElement;
    expect(menuPanel).toHaveClass('translate-x-full');
  });

  it('deve fechar ao clicar no link de navegação (handleLinkClick)', async () => {
    render(<MenuMobile user={null} onLogout={mockOnLogout} />);

    await userObj.click(screen.getByRole('button', { name: /Abrir menu/i })); // Abre

    // Clica em um link de navegação
    const aboutLink = screen.getByRole('link', { name: 'Sobre' });
    await userObj.click(aboutLink);

    // Verifica se o menu fechou
    const menuPanel = screen.getByText('Menu').closest('div').parentElement;
    expect(menuPanel).toHaveClass('translate-x-full');
  });


  // --- 2. Testes de Conteúdo (Logado vs Deslogado) ---

  it('deve exibir links de navegação para DESLOGADO', async () => {
    render(<MenuMobile user={null} onLogout={mockOnLogout} />);

    await userObj.click(screen.getByRole('button', { name: /Abrir menu/i })); // Abre

    // Verifica a presença dos 5 links deslogados
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Entrar' })).toBeInTheDocument();

    // Verifica que links logados e botão Sair NÃO aparecem
    expect(screen.queryByRole('link', { name: 'Dashboard' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Sair' })).not.toBeInTheDocument();
  });

  it('deve exibir dados do usuário logado e botão Sair', async () => {
    render(<MenuMobile user={USER_LOGGED_IN} onLogout={mockOnLogout} />);

    await userObj.click(screen.getByRole('button', { name: /Abrir menu/i })); // Abre

    // 1. Verifica a informação do usuário logado
    expect(screen.getByText('SwiftBlade')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();

    // 2. Verifica os links logados
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Taverna dos Heróis' })).toBeInTheDocument();

    // 3. Verifica o botão Sair
    expect(screen.getByRole('button', { name: 'Sair' })).toBeInTheDocument();

    // 4. Verifica que links deslogados NÃO aparecem
    expect(screen.queryByRole('link', { name: 'Home' })).not.toBeInTheDocument();
  });

  it('deve chamar onLogout e fechar o menu ao clicar em Sair', async () => {
    render(<MenuMobile user={USER_LOGGED_IN} onLogout={mockOnLogout} />);

    await userObj.click(screen.getByRole('button', { name: /Abrir menu/i })); // Abre

    const logoutButton = screen.getByRole('button', { name: 'Sair' });
    const menuPanel = screen.getByText('Menu').closest('div').parentElement;

    await userObj.click(logoutButton);

    // 1. Verifica se o callback de logout foi chamado
    expect(mockOnLogout).toHaveBeenCalledTimes(1);

    // 2. Verifica se o menu fechou
    expect(menuPanel).toHaveClass('translate-x-full');
  });

  // --- 3. Testes de Tema (MutationObserver) ---

  it('deve atualizar o estilo para dark mode ao mudar o tema do body', async () => {
    render(<MenuMobile user={null} onLogout={mockOnLogout} />);

    // Estado inicial: Claro (white)
    await waitFor(() => {
      // A cor de fundo é o estilo inline (estilo de background é '#ffffff')
      expect(screen.getByText('Menu').closest('div').parentElement).toHaveStyle('background-color: rgb(255, 255, 255)');
    });

    // 1. Simula a mudança de tema para dark
    toggleTheme(true);

    // 2. Verifica se o estilo do painel foi atualizado (cor do dark mode #1f2937)
    // Usamos waitFor porque o MutationObserver e o setState são assíncronos
    await waitFor(() => {
      const menuPanel = screen.getByText('Menu').closest('div').parentElement;
      expect(menuPanel).toHaveStyle('background-color: rgb(31, 41, 55)'); // #1f2937 em RGB
    });

    // 3. Simula a volta para o tema claro
    toggleTheme(false);

    await waitFor(() => {
      const menuPanel = screen.getByText('Menu').closest('div').parentElement;
      expect(menuPanel).toHaveStyle('background-color: rgb(255, 255, 255)');
    });
  });
});
