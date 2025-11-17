import { render, screen } from "@testing-library/react";
import { MenuDesktop } from "../../../components/MenuDesktop";
import { describe, expect, it, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";

// Mock do componente Link (para simular a tag <a>)
vi.mock('react-router-dom', () => ({
  Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
}));

describe("MenuDesktop - Testes de Navegação e Autenticação", () => {
  const mockOnLogout = vi.fn();
  const USER_LOGGED_IN = { id: 'u1', name: 'User Test' };
  const user = userEvent.setup();

  beforeEach(() => {
    mockOnLogout.mockClear();
  });

  // --- Cenário 1: Usuário DESLOGADO (user = null) ---

  it("deve exibir links de navegação para DESLOGADO e o botão 'Entrar'", () => {
    render(<MenuDesktop user={null} onLogout={mockOnLogout} />);

    // 1. Verifica links de navegação (toque em Home, Sobre, Faq)
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Sobre' })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('link', { name: 'Faq' })).toHaveAttribute('href', '/faq');

    // 2. Verifica botões de ação
    expect(screen.getByRole('link', { name: 'Cadastrar' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Entrar' })).toBeInTheDocument();

    // 3. Verifica que links logados NÃO aparecem
    expect(screen.queryByRole('link', { name: 'Dashboard' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'LOGOUT' })).not.toBeInTheDocument();
  });

  // --- Cenário 2: Usuário LOGADO (user = Objeto) ---

  it("deve exibir links de navegação logados e o botão 'LOGOUT'", () => {
    render(<MenuDesktop user={USER_LOGGED_IN} onLogout={mockOnLogout} />);

    // 1. Verifica links logados
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '/dashboard');
    expect(screen.getByRole('link', { name: 'Taverna dos Heróis' })).toHaveAttribute('href', '/common-room');

    // 2. Verifica a presença do botão de LOGOUT
    const logoutButton = screen.getByRole('button', { name: 'LOGOUT' });
    expect(logoutButton).toBeInTheDocument();

    // 3. Verifica que links deslogados NÃO aparecem
    expect(screen.queryByRole('link', { name: 'Home' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Cadastrar' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Entrar' })).not.toBeInTheDocument();
  });

  // --- Cenário 3: Interação (Logout) ---

  it("deve chamar onLogout quando o botão 'LOGOUT' é clicado", async () => {
    render(<MenuDesktop user={USER_LOGGED_IN} onLogout={mockOnLogout} />);

    const logoutButton = screen.getByRole('button', { name: 'LOGOUT' });
    await user.click(logoutButton);

    // Verifica se o callback foi disparado
    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });
});
