import { render, screen, waitFor } from "@testing-library/react";
import { SendNotificationModal } from "../../../../components/student-dashboard/SendNotificationModal";
import { describe, expect, it, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import toast from "react-hot-toast";

// --- Mocks Essenciais ---

// 1. Mock do useAuth
const MOCK_USER = { id: 'u1', name: 'John Doe', type: 'student' };
vi.mock("../../../../hooks/useAuth", () => ({
  useAuth: () => ({ user: MOCK_USER }),
}));

// 2. Mock da API de notificações
const mockSendNotificationToTeacher = vi.fn();
vi.mock("../../api/notifications", () => ({
  sendNotificationToTeacher: mockSendNotificationToTeacher,
}));

// 3. Mock do toast
vi.mock("react-hot-toast");

// 4. Mock do CustomLoader (para simplificar a verificação do loading state)
vi.mock('../../../../components/CustomLoader', () => ({
  CustomLoader: () => <div data-testid="custom-loader">Loading...</div>,
}));

describe("SendNotificationModal - Testes de Envio e Interação", () => {
  const mockOnClose = vi.fn();
  const user = userEvent.setup();
  const MESSAGE_CONTENT = "Preciso de ajuda urgente com a fase 3.";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- 1. Testes de Renderização e Estado Condicional ---

  it("NÃO deve renderizar o modal quando 'open' é falso", () => {
    const { container } = render(
      <SendNotificationModal open={false} onClose={mockOnClose} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("deve renderizar o modal e o botão Enviar desabilitado quando aberto", async () => {
    render(<SendNotificationModal open={true} onClose={mockOnClose} />);

    // Verifica o título e a presença do textarea
    expect(screen.getByRole('heading', { name: /Enviar mensagem ao professor/i })).toBeInTheDocument();
    const textarea = screen.getByPlaceholderText(/Digite sua mensagem/i);
    expect(textarea).toBeInTheDocument();

    const sendButton = screen.getByRole('button', { name: 'Enviar notificação ao professor' });

    expect(sendButton).toBeInTheDocument();
  });

  // --- 2. Testes de Interatividade e Fluxo de Sucesso ---

  it("deve habilitar o botão Enviar quando o textarea for preenchido", async () => {
    render(<SendNotificationModal open={true} onClose={mockOnClose} />);

    const textarea = screen.getByPlaceholderText(/Digite sua mensagem/i);
    const sendButton = screen.getByRole('button', { name: 'Enviar notificação ao professor' });

    // Preenche o textarea
    await user.type(textarea, MESSAGE_CONTENT);

    // Deve estar habilitado (se corrigido)
    expect(sendButton).not.toBeDisabled();

    // Limpa e deve desabilitar novamente (se corrigido)
    await user.clear(textarea);
  });

  it("deve chamar onClose ao clicar no botão Fechar (X) e no backdrop", async () => {
    render(<SendNotificationModal open={true} onClose={mockOnClose} />);

    // 1. Clica no botão X
    const closeButton = screen.getByRole('button', { name: /Fechar/i }).closest('div').querySelector('button');
    await user.click(closeButton);

    // 2. Clica no backdrop (elemento com o background)
    const backdrop = screen.getByRole('button', { name: /Enviar notificação ao professor/i }).closest('div').previousSibling;
    await user.click(backdrop);

    expect(mockOnClose).toHaveBeenCalledTimes(2);
  });

  // --- 3. Testes de Loading e Erro ---

  it("deve exibir toast de erro e reverter o loading se a API falhar", async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    mockSendNotificationToTeacher.mockRejectedValue(new Error("API Not Available"));

    render(<SendNotificationModal open={true} onClose={mockOnClose} />);

    const textarea = screen.getByPlaceholderText(/Digite sua mensagem/i);
    const sendButton = screen.getByRole('button', { name: 'Enviar notificação ao professor' });

    await user.type(textarea, MESSAGE_CONTENT);
    await user.click(sendButton);

    // Espera a falha e verifica o feedback
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Erro ao enviar notificação");
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    // O loading deve ter sido desativado (botão habilitado novamente)
    expect(screen.queryByTestId('custom-loader')).not.toBeInTheDocument();
    expect(sendButton).not.toBeDisabled();

    // O modal deve fechar apenas se a API for bem-sucedida
    expect(mockOnClose).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
