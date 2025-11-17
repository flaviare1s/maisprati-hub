import { render, screen, waitFor } from "@testing-library/react";
import { TeacherNotificationsTab } from "../../../../components/teacher-dashboard/TeacherNotificationTab.jsx";
import * as notificationsApi from "../../../../api.js/notifications";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { AuthContext } from "../../../../contexts/AuthContext";
import userEvent from "@testing-library/user-event";

// Mock das funções de API de notificações
vi.mock("../../../../api.js/notifications", () => ({
  getUserNotifications: vi.fn(),
  deleteNotification: vi.fn(),
}));

// --- Mock de Dados ---
const createMockNotifications = (count) => {
  const notifications = [];
  // Ajustando a data para evitar problemas de fuso horário em diferentes ambientes de teste
  const baseDate = new Date(2025, 10, 15);
  for (let i = 1; i <= count; i++) {
    const createdAt = new Date(baseDate);
    createdAt.setHours(i, 30);

    notifications.push({
      id: `notif${i}`,
      title: `Título da Notificação ${i}`,
      // Inclui data e hora para testar o formatMessage
      message: `Ação realizada em 15/11/2025 às ${i < 10 ? '0' + i : i}:30.`,
      createdAt: createdAt.toISOString(),
    });
  }
  return notifications;
};

const mockNotifications15 = createMockNotifications(15);
const mockNotifications1 = createMockNotifications(1);


// Mock do contexto de autenticação
const MockAuthProvider = ({ children, user }) => {
  const mockContext = { user, updateUser: vi.fn() };
  return <AuthContext.Provider value={mockContext}>{children}</AuthContext.Provider>;
};

describe("TeacherNotificationsTab - Testes Abrangentes", () => {
  const adminUser = { id: "admin123", type: "admin" };
  const studentUser = { id: "student456", type: "student" };
  const userObj = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- 1. Testes de Carregamento e Autorização ---

  describe("Carregamento e Autorização", () => {
    it("deve carregar notificações se o usuário for 'admin'", async () => {
      notificationsApi.getUserNotifications.mockResolvedValue(mockNotifications15);

      render(
        <MockAuthProvider user={adminUser}>
          <TeacherNotificationsTab />
        </MockAuthProvider>
      );

      // Verifica se a API foi chamada com o ID correto
      await waitFor(() => {
        expect(notificationsApi.getUserNotifications).toHaveBeenCalledWith("admin123");
      });

      // Verifica se o conteúdo da primeira página (10 itens) é exibido
      expect(screen.getByText("Título da Notificação 1")).toBeInTheDocument();
      expect(screen.getByText("Título da Notificação 10")).toBeInTheDocument();
      expect(screen.queryByText("Título da Notificação 11")).not.toBeInTheDocument(); // Paginação
    });

    it("NÃO deve carregar notificações se o usuário NÃO for 'admin'", async () => {
      render(
        <MockAuthProvider user={studentUser}>
          <TeacherNotificationsTab />
        </MockAuthProvider>
      );

      // Verifica que a API não foi chamada
      expect(notificationsApi.getUserNotifications).not.toHaveBeenCalled();

      // Verifica se a lista está vazia
      expect(screen.queryByText(/Título da Notificação/i)).not.toBeInTheDocument();
    });

    it("deve exibir mensagem de 'Nenhuma notificação' se a API retornar lista vazia", async () => {
      notificationsApi.getUserNotifications.mockResolvedValue([]);

      render(
        <MockAuthProvider user={adminUser}>
          <TeacherNotificationsTab />
        </MockAuthProvider>
      );

      // Espera o carregamento e verifica a mensagem
      expect(
        await screen.findByText("Nenhuma notificação no momento")
      ).toBeInTheDocument();
    });

    it("deve lidar com erro ao carregar notificações (log no console)", async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
      notificationsApi.getUserNotifications.mockRejectedValue(new Error("Network Error"));

      render(
        <MockAuthProvider user={adminUser}>
          <TeacherNotificationsTab />
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

  describe("Paginação e Navegação", () => {
    beforeEach(() => {
      notificationsApi.getUserNotifications.mockResolvedValue(mockNotifications15);
    });

    it("deve calcular corretamente o total de páginas e a página inicial", async () => {
      render(
        <MockAuthProvider user={adminUser}>
          <TeacherNotificationsTab />
        </MockAuthProvider>
      );

      // 15 itens / 10 por página = 2 páginas
      expect(await screen.findByText("1 de 2")).toBeInTheDocument();
      expect(screen.getByText("Mostrando 1-10 de 15 notificações")).toBeInTheDocument();

      // O botão 'anterior' deve estar desabilitado na página 1
      expect(screen.getByRole('button', { name: /Página anterior/i })).toBeDisabled();
      // O botão 'próxima' deve estar habilitado
      expect(screen.getByRole('button', { name: /Próxima página/i })).not.toBeDisabled();
    });

    it("deve navegar para a próxima página", async () => {
      render(
        <MockAuthProvider user={adminUser}>
          <TeacherNotificationsTab />
        </MockAuthProvider>
      );

      const nextButton = await screen.findByRole('button', { name: /Próxima página/i });
      await userObj.click(nextButton);

      // Verifica se mudou para a página 2
      expect(screen.getByText("2 de 2")).toBeInTheDocument();
      expect(screen.getByText("Mostrando 11-15 de 15 notificações")).toBeInTheDocument();

      // Verifica o conteúdo da página 2
      expect(screen.getByText("Título da Notificação 11")).toBeInTheDocument();
      expect(screen.queryByText("Título da Notificação 10")).not.toBeInTheDocument();

      // O botão 'próxima' deve estar desabilitado na última página
      expect(nextButton).toBeDisabled();
    });

    it("deve navegar de volta para a página anterior", async () => {
      render(
        <MockAuthProvider user={adminUser}>
          <TeacherNotificationsTab />
        </MockAuthProvider>
      );

      const nextButton = await screen.findByRole('button', { name: /Próxima página/i });
      const prevButton = screen.getByRole('button', { name: /Página anterior/i });

      // Vai para a Página 2
      await userObj.click(nextButton);
      expect(screen.getByText("2 de 2")).toBeInTheDocument();

      // Volta para a Página 1
      await userObj.click(prevButton);
      expect(screen.getByText("1 de 2")).toBeInTheDocument();
      expect(screen.getByText("Título da Notificação 1")).toBeInTheDocument();
    });
  });

  // --- 3. Testes de Exclusão (Delete) ---

  describe("Exclusão de Notificações", () => {
    const mockNotifications = createMockNotifications(12); // 12 itens (P1: 1-10, P2: 11-12)

    it("deve deletar uma notificação e atualizar a lista", async () => {
      notificationsApi.getUserNotifications.mockResolvedValue(mockNotifications);
      notificationsApi.deleteNotification.mockResolvedValue({}); // Sucesso no delete

      render(
        <MockAuthProvider user={adminUser}>
          <TeacherNotificationsTab />
        </MockAuthProvider>
      );

      await screen.findByText("Título da Notificação 1"); // Espera carregar

      // Usa o nome acessível "Deletar notificação"
      const deleteButtons = screen.getAllByRole("button", { name: /Deletar notificação/i });

      const initialCount = deleteButtons.length;
      expect(initialCount).toBe(10); // 10 notificações na P1

      const deleteButton = deleteButtons[0]; // Botão do notif1
      await userObj.click(deleteButton);

      // Verifica se a API de delete foi chamada e espera que o elemento desapareça (CORREÇÃO)
      await waitFor(() => {
        expect(notificationsApi.deleteNotification).toHaveBeenCalledWith("notif1");

        // Asserção forte: o item deletado deve sumir do DOM
        expect(screen.queryByText("Título da Notificação 1")).not.toBeInTheDocument();

        // Verifica que o item 11 entrou na primeira página (confirma que 10 elementos continuam na view)
        expect(screen.getByText("Título da Notificação 11")).toBeInTheDocument();

        // Rechecagem da contagem para garantir que o número de botões visíveis é 10 (pois o item 11 entrou)
        const updatedButtons = screen.getAllByRole("button", { name: /Deletar notificação/i });
        expect(updatedButtons.length).toBe(10);
      });

      // Verifica se a lista e a contagem de paginação foram atualizadas
      expect(screen.getByText("Mostrando 1-10 de 11 notificações")).toBeInTheDocument();
    });

    it("deve lidar com erro ao deletar notificação", async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
      notificationsApi.getUserNotifications.mockResolvedValue(mockNotifications1);
      notificationsApi.deleteNotification.mockRejectedValue(new Error("DB Error"));

      render(
        <MockAuthProvider user={adminUser}>
          <TeacherNotificationsTab />
        </MockAuthProvider>
      );

      // Usa o nome acessível "Deletar notificação"
      const deleteButton = await screen.findByRole("button", { name: /Deletar notificação/i });
      await userObj.click(deleteButton);

      // Verifica se o erro foi logado
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Erro ao deletar notificação:",
          expect.any(Error)
        );
      });

      // Verifica se a notificação continua na tela (a lista NÃO deve ter mudado)
      expect(screen.getByText("Título da Notificação 1")).toBeInTheDocument();
      consoleErrorSpy.mockRestore();
    });
  });

  // --- 4. Testes de Formatação (dangerouslySetInnerHTML) ---

  describe("Formatação de Mensagens", () => {
    it("deve formatar data e hora com tags <strong> usando dangerouslySetInnerHTML", async () => {
      notificationsApi.getUserNotifications.mockResolvedValue([
        {
          id: 'html1',
          title: 'Relatório Final',
          message: 'O relatório foi submetido em 01/01/2025 às 09:30. Parabéns!',
          createdAt: new Date().toISOString(),
        }
      ]);

      render(
        <MockAuthProvider user={adminUser}>
          <TeacherNotificationsTab />
        </MockAuthProvider>
      );

      const notificationParagraph = await screen.findByText(/O relatório foi submetido/i);

      // O RTL não expõe o HTML diretamente, mas podemos verificar o innerHTML do elemento.
      // O texto literal deve incluir os spans do HTML
      expect(notificationParagraph).toHaveProperty(
        'innerHTML',
        'O relatório foi submetido em <strong>01/01/2025</strong> às <strong>09:30</strong>. Parabéns!'
      );
    });

    it("deve formatar horas com um dígito (e.g., 9:05)", async () => {
      notificationsApi.getUserNotifications.mockResolvedValue([
        {
          id: 'html2',
          title: 'Relatório Teste',
          message: 'Status atualizado em 02/02/2026 às 9:05.',
          createdAt: new Date().toISOString(),
        }
      ]);

      render(
        <MockAuthProvider user={adminUser}>
          <TeacherNotificationsTab />
        </MockAuthProvider>
      );

      const notificationParagraph = await screen.findByText(/Status atualizado/i);

      // O regex deve capturar 9:05 e formatar corretamente
      expect(notificationParagraph).toHaveProperty(
        'innerHTML',
        'Status atualizado em <strong>02/02/2026</strong> às <strong>9:05</strong>.'
      );
    });
  });
});

