import { render, screen, waitFor } from "@testing-library/react";
import { StudentNotificationsPanel } from "../../../../components/student-dashboard/StudentNotificationsPanel";
import * as notificationsApi from "../../../../api.js/notifications";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { AuthContext } from "../../../../contexts/AuthContext";
import userEvent from "@testing-library/user-event";

// Mock das APIs de notificações
vi.mock("../../../../api.js/notifications", () => ({
  getUserNotifications: vi.fn(),
  deleteNotification: vi.fn(),
  createNotification: vi.fn(),
}));

// Mock do componente SendNotificationModal (apenas para simular o envio)
vi.mock("../../../../components/modals/SendNotificationModal", () => ({
  SendNotificationModal: ({ open, onClose, onSend }) => {
    if (!open) return null;
    return (
      <div data-testid="send-modal">
        <h3>Enviar Notificação ao Professor</h3>
        <input data-testid="message-input" defaultValue="Teste de Mensagem" readOnly />
        <button onClick={() => onSend("Teste de Mensagem")}>Enviar</button>
        <button onClick={onClose} aria-label="Fechar Modal">Fechar Modal</button>
      </div>
    );
  },
}));

// Mock do componente Pagination (simplificado para testes)
vi.mock("../../../../components/Pagination", () => ({
  Pagination: ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;

    return (
      <div data-testid="pagination-component">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Página anterior"
        >
          Anterior
        </button>
        <span data-testid="page-indicator">{currentPage} de {totalPages}</span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Próxima página"
        >
          Próxima
        </button>
      </div>
    );
  },
}));


// --- Mock de Dados ---
const STUDENT_USER = {
  id: "student456",
  name: "Aluno Teste",
  type: "student",
};

const createMockNotifications = (count) => {
  const notifications = [];
  const baseDate = new Date(2025, 10, 15);
  for (let i = 1; i <= count; i++) {
    const createdAt = new Date(baseDate);
    createdAt.setHours(i, 30);

    notifications.push({
      id: `notif${i}`,
      title: `Notificação ${i} do Professor`,
      senderName: "Professor",
      message: `Mensagem ${i} em 15/11/2025 às ${i < 10 ? '0' + i : i}:30.`,
      createdAt: createdAt.toISOString(),
      isRead: false,
    });
  }
  return notifications.reverse(); // Garante que as mais recentes vêm primeiro
};

const mockNotifications15 = createMockNotifications(15);

// Mock do contexto de autenticação
// NOTE: O componente StudentNotificationsPanel NÃO USA refreshNotificationCount do AuthContext.
const MockAuthProvider = ({ children, user }) => {
  const mockContext = { user, updateUser: vi.fn(), refreshNotificationCount: vi.fn() };
  return <AuthContext.Provider value={mockContext}>{children}</AuthContext.Provider>;
};

describe("StudentNotificationsPanel - Testes Abrangentes", () => {
  const userObj = userEvent.setup();

  // Declaração do mock refreshCount para o teste
  let mockRefreshCount;

  beforeEach(() => {
    vi.clearAllMocks();
    notificationsApi.getUserNotifications.mockResolvedValue(mockNotifications15);
    // Reinicializa o mock refreshCount para o beforeEach
    mockRefreshCount = vi.fn();
  });

  // --- 1. Testes de Carregamento e Renderização ---

  describe("Carregamento Inicial", () => {
    it("deve carregar e exibir as notificações do usuário logado", async () => {
      render(
        <MockAuthProvider user={STUDENT_USER}>
          <StudentNotificationsPanel />
        </MockAuthProvider>
      );

      await waitFor(() => {
        expect(notificationsApi.getUserNotifications).toHaveBeenCalledWith(STUDENT_USER.id);
      });

      // Verifica se a primeira notificação (a mais recente, após o reverse) é exibida
      expect(screen.getByText("Notificação 15 do Professor")).toBeInTheDocument();
      // Verifica se a última notificação da primeira página (10ª) é exibida
      expect(screen.getByText("Notificação 6 do Professor")).toBeInTheDocument();
      // Verifica se uma notificação da segunda página não é exibida
      expect(screen.queryByText("Notificação 5 do Professor")).not.toBeInTheDocument();
    });

    it("deve exibir mensagem de 'Nenhuma notificação' se a lista estiver vazia", async () => {
      notificationsApi.getUserNotifications.mockResolvedValue([]);

      render(
        <MockAuthProvider user={STUDENT_USER}>
          <StudentNotificationsPanel />
        </MockAuthProvider>
      );

      expect(
        await screen.findByText("Nenhuma notificação no momento")
      ).toBeInTheDocument();
    });

    it("deve lidar com erro ao carregar notificações (log no console)", async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
      notificationsApi.getUserNotifications.mockRejectedValue(new Error("Erro de conexão"));

      render(
        <MockAuthProvider user={STUDENT_USER}>
          <StudentNotificationsPanel />
        </MockAuthProvider>
      );

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Erro ao carregar notificações:",
          expect.any(Error)
        );
      });

      consoleErrorSpy.mockRestore();
    });
  });

  // --- 2. Testes de Paginação ---

  describe("Paginação", () => {
    it("deve navegar para a próxima página corretamente", async () => {
      render(
        <MockAuthProvider user={STUDENT_USER}>
          <StudentNotificationsPanel />
        </MockAuthProvider>
      );

      // Aguarda a paginação aparecer (15 itens -> 2 páginas)
      await screen.findByTestId('pagination-component');

      // Verifica página inicial
      expect(screen.getByTestId('page-indicator')).toHaveTextContent('1 de 2');

      // Clica no botão Próxima
      const nextButton = screen.getByRole('button', { name: "Próxima página" });
      await userObj.click(nextButton);

      // Verifica se mudou para a página 2
      expect(screen.getByTestId('page-indicator')).toHaveTextContent('2 de 2');

      // Verifica o conteúdo da P2 (Notificações 1 a 5)
      expect(screen.getByText("Notificação 5 do Professor")).toBeInTheDocument();
      expect(screen.queryByText("Notificação 6 do Professor")).not.toBeInTheDocument();

      // O botão anterior deve estar habilitado, e o próximo desabilitado
      expect(screen.getByRole('button', { name: "Página anterior" })).not.toBeDisabled();
      expect(nextButton).toBeDisabled();
    });

    it("deve navegar de volta para a página anterior", async () => {
      render(
        <MockAuthProvider user={STUDENT_USER}>
          <StudentNotificationsPanel />
        </MockAuthProvider>
      );

      await screen.findByTestId('pagination-component');
      const nextButton = screen.getByRole('button', { name: "Próxima página" });
      const prevButton = screen.getByRole('button', { name: "Página anterior" });

      // Vai para P2
      await userObj.click(nextButton);
      expect(screen.getByTestId('page-indicator')).toHaveTextContent('2 de 2');

      // Volta para P1
      await userObj.click(prevButton);
      expect(screen.getByTestId('page-indicator')).toHaveTextContent('1 de 2');

      // Verifica conteúdo da P1
      expect(screen.getByText("Notificação 15 do Professor")).toBeInTheDocument();
    });
  });

  // --- 3. Testes de Exclusão (Delete) ---

  describe("Exclusão de Notificações", () => {
    it("deve deletar uma notificação e atualizar a lista e a contagem", async () => {
      // Mock de 12 notificações (para testar paginação)
      notificationsApi.getUserNotifications.mockResolvedValue(createMockNotifications(12));
      notificationsApi.deleteNotification.mockResolvedValue({});

      // CORREÇÃO: Passa mockRefreshCount como prop direta para StudentNotificationsPanel
      render(
        <MockAuthProvider user={STUDENT_USER}>
          <StudentNotificationsPanel refreshNotificationCount={mockRefreshCount} />
        </MockAuthProvider>
      );

      await screen.findByText("Notificação 12 do Professor");

      // Usa o nome acessível "Deletar notificação" (que você deve adicionar ao componente)
      const deleteButton = screen.getAllByRole("button", { name: "Deletar notificação" })[0];

      await userObj.click(deleteButton);

      // 2. Verifica a chamada da API de delete E a chamada do refresh (SINCRONIZAÇÃO)
      await waitFor(() => {
        expect(notificationsApi.deleteNotification).toHaveBeenCalledWith("notif12");
        // CORRIGIDO: A asserção do mockRefreshCount agora está garantida de ser chamada.
        expect(mockRefreshCount).toHaveBeenCalledTimes(1);
      });

      // 3. Verifica se o item sumiu da lista
      expect(screen.queryByText("Notificação 12 do Professor")).not.toBeInTheDocument();

      // 4. Verifica se a próxima notificação (11) apareceu na primeira posição
      expect(screen.getByText("Notificação 11 do Professor")).toBeInTheDocument();
    });
  });
});
