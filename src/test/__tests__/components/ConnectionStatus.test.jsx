import { render, screen, act } from "@testing-library/react";
import { ConnectionStatus } from "../../../components/ConnectionStatus";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

// Mock da função inicial do navegador (navigator.onLine)
const mockOnlineStatus = vi.fn();

// Spy e funções para simular eventos globais do navegador (offline)
const dispatchOffline = () => window.dispatchEvent(new Event('offline'));

describe("ConnectionStatus - Testes de Status de Conexão", () => {
  // Usamos timers falsos para controlar o delay de 5 segundos do setTimeout
  vi.useFakeTimers();

  beforeEach(() => {
    vi.clearAllMocks();
    // Assume que a conexão inicial está OK
    mockOnlineStatus.mockReturnValue(true);
    // Garante que o navegador está mockado
    Object.defineProperty(window, 'navigator', {
      value: { onLine: mockOnlineStatus() },
      writable: true,
      configurable: true
    });
  });

  afterEach(() => {
    vi.useRealTimers(); // Limpa os timers falsos após cada teste
  });

  // --- 1. Teste de Estado Inicial e Condicional ---

  it("NÃO deve renderizar nada se estiver online e não houver aviso pendente (Estado Padrão)", () => {
    // mockOnlineStatus já é true por padrão
    const { container } = render(<ConnectionStatus />);

    // O componente retorna null e o container deve estar vazio
    expect(container.firstChild).toBeNull();
    expect(screen.queryByText(/Conexão restaurada/i)).not.toBeInTheDocument();
  });

  // --- 2. Teste de Transição Offline ---

  it("deve exibir aviso de offline após o evento 'offline' ser disparado", async () => {
    // Inicializa o componente como online (não renderiza nada)
    render(<ConnectionStatus />);

    // 1. Simula a perda de conexão
    mockOnlineStatus.mockReturnValue(false);
    act(() => {
      dispatchOffline();
    });

    // 2. Verifica se a mensagem de offline está visível
    const offlineMessage = screen.getByText(/Sem conexão com a internet/i);
    expect(offlineMessage).toBeInTheDocument();

    // 3. Verifica a classe (deve ser vermelha/offline) no div mais externo
    expect(offlineMessage.closest('div').parentElement).toHaveClass('bg-red-600');
  });
});
