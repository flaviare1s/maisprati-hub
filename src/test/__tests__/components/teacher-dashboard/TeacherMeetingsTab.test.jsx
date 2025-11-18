import { render, screen, waitFor } from "@testing-library/react";
import { TeacherMeetingsTab } from "../../../../components/teacher-dashboard/TeacherMeetingsTab.jsx";
import * as scheduleApi from "../../../../api/schedule";
import api from "../../../../services/api";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import toast from "react-hot-toast";
import dayjs from "dayjs";

// Mock do react-hot-toast
vi.mock("react-hot-toast");

// Mock das APIs
vi.mock("../../../../api/schedule", () => ({
  fetchAppointments: vi.fn(),
}));

vi.mock("../../../../services/api", () => ({
  default: {
    patch: vi.fn(),
  },
}));

describe("TeacherMeetingsTab - Testes Abrangentes", () => {
  let adminId;
  let unmountFn;

  // Helper para renderizar e guardar unmount
  const renderWithCleanup = (component) => {
    const result = render(component);
    unmountFn = result.unmount;
    return result;
  };

  beforeEach(() => {
    vi.clearAllMocks();

    adminId = "admin123";

    // Mocks padrão
    scheduleApi.fetchAppointments.mockResolvedValue([]);
  });

  afterEach(() => {
    // Cleanup componente se foi renderizado
    if (unmountFn) {
      try {
        unmountFn();
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        // Ignora erros no unmount
      }
      unmountFn = null;
    }
    // Cleanup timers
    vi.clearAllTimers();
  });

  describe("Renderização Inicial", () => {
    it("renderiza o componente com título e instruções", async () => {
      renderWithCleanup(<TeacherMeetingsTab adminId={adminId} />);

      expect(screen.getByText("Gerenciar Reuniões")).toBeInTheDocument();
      expect(
        screen.getByText(/Clique em um dia no calendário lateral/i)
      ).toBeInTheDocument();

      await waitFor(() => {
        expect(scheduleApi.fetchAppointments).toHaveBeenCalledWith(adminId, "admin");
      });
    });

    it("renderiza o filtro de agendamentos", async () => {
      renderWithCleanup(<TeacherMeetingsTab adminId={adminId} />);

      expect(screen.getByText(/Filtrar:/i)).toBeInTheDocument();
      const select = screen.getByRole("combobox");
      expect(select).toHaveValue("proximos");

      await waitFor(() => {
        expect(scheduleApi.fetchAppointments).toHaveBeenCalled();
      });
    });

    it("exibe mensagem quando não há agendamentos", async () => {
      renderWithCleanup(<TeacherMeetingsTab adminId={adminId} />);

      expect(
        await screen.findByText(/Nenhum agendamento encontrado para o filtro "próximos"/i)
      ).toBeInTheDocument();
    });

    it("renderiza a legenda de cores", () => {
      renderWithCleanup(<TeacherMeetingsTab adminId={adminId} />);

      expect(screen.getByText("Disponível")).toBeInTheDocument();
      expect(screen.getByText("Agendado")).toBeInTheDocument();
      expect(screen.getByText("Indisponível")).toBeInTheDocument();
    });

    it("não carrega agendamentos quando adminId não é fornecido", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => { });

      renderWithCleanup(<TeacherMeetingsTab adminId={null} />);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith("AdminId não fornecido!");
      });

      expect(scheduleApi.fetchAppointments).not.toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe("Carregamento de Agendamentos", () => {
    it("carrega e exibe agendamentos individuais", async () => {
      const mockAppointments = [
        {
          id: "1",
          date: dayjs().add(1, "day").format("YYYY-MM-DD"),
          time: "10:00",
          studentName: "Maria Silva",
          status: "SCHEDULED",
        },
      ];

      scheduleApi.fetchAppointments.mockResolvedValue(mockAppointments);

      renderWithCleanup(<TeacherMeetingsTab adminId={adminId} />);

      await waitFor(() => {
        expect(screen.getByText(/10:00/i)).toBeInTheDocument();
      });

      expect(screen.getByText(/Maria Silva \(solo\)/i)).toBeInTheDocument();
    });

    it("carrega e exibe agendamentos de equipe", async () => {
      const mockAppointments = [
        {
          id: "2",
          date: dayjs().add(2, "day").format("YYYY-MM-DD"),
          time: "14:00",
          teamName: "Grupo Alpha",
          status: "SCHEDULED",
        },
      ];

      scheduleApi.fetchAppointments.mockResolvedValue(mockAppointments);

      renderWithCleanup(<TeacherMeetingsTab adminId={adminId} />);

      await waitFor(() => {
        expect(screen.getByText(/14:00/i)).toBeInTheDocument();
      });

      expect(screen.getByText("Grupo Alpha")).toBeInTheDocument();
    });

    it("remove duplicatas de agendamentos baseado em time, data e hora", async () => {
      const duplicateAppointments = [
        {
          id: "1",
          date: dayjs().add(1, "day").format("YYYY-MM-DD"),
          time: "10:00",
          teamName: "Grupo Beta",
          status: "SCHEDULED",
        },
        {
          id: "2",
          date: dayjs().add(1, "day").format("YYYY-MM-DD"),
          time: "10:00",
          teamName: "Grupo Beta",
          status: "SCHEDULED",
        },
      ];

      scheduleApi.fetchAppointments.mockResolvedValue(duplicateAppointments);

      renderWithCleanup(<TeacherMeetingsTab adminId={adminId} />);

      await waitFor(() => {
        const timeElements = screen.getAllByText(/10:00/i);
        // Deve aparecer apenas uma vez (sem duplicata)
        expect(timeElements).toHaveLength(1);
      });
    });
  });

  describe("Filtros de Agendamentos", () => {
    const setupAppointments = () => {
      const appointments = [
        {
          id: "1",
          date: dayjs().add(1, "day").format("YYYY-MM-DD"),
          time: "10:00",
          status: "SCHEDULED",
          studentName: "João",
        },
        {
          id: "2",
          date: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
          time: "11:00",
          status: "COMPLETED",
          studentName: "Maria",
        },
        {
          id: "3",
          date: dayjs().add(2, "day").format("YYYY-MM-DD"),
          time: "15:00",
          status: "CANCELLED",
          studentName: "Pedro",
        },
        {
          id: "4",
          date: dayjs().subtract(2, "day").format("YYYY-MM-DD"),
          time: "09:00",
          status: "SCHEDULED",
          studentName: "Ana",
        },
      ];

      scheduleApi.fetchAppointments.mockResolvedValue(appointments);
    };

    it("filtra agendamentos próximos (padrão)", async () => {
      setupAppointments();

      renderWithCleanup(<TeacherMeetingsTab adminId={adminId} />);

      await waitFor(() => {
        expect(screen.getByText(/10:00/i)).toBeInTheDocument();
      });

      // Não deve mostrar reuniões passadas ou canceladas
      expect(screen.queryByText(/11:00/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/15:00/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/09:00/i)).not.toBeInTheDocument();
    });

    it("filtra agendamentos cancelados", async () => {
      setupAppointments();

      const userObj = userEvent.setup({ delay: null });

      renderWithCleanup(<TeacherMeetingsTab adminId={adminId} />);

      const select = await screen.findByRole("combobox");
      await userObj.selectOptions(select, "cancelados");

      await waitFor(() => {
        expect(screen.getByText(/15:00/i)).toBeInTheDocument();
      });

      expect(screen.queryByText(/10:00/i)).not.toBeInTheDocument();
    });

    it("filtra agendamentos concluídos", async () => {
      setupAppointments();

      const userObj = userEvent.setup({ delay: null });

      renderWithCleanup(<TeacherMeetingsTab adminId={adminId} />);

      const select = await screen.findByRole("combobox");
      await userObj.selectOptions(select, "completados");

      await waitFor(() => {
        expect(screen.getByText(/11:00/i)).toBeInTheDocument();
      });

      // Agendamento passado também deve aparecer como concluído
      expect(screen.getByText(/09:00/i)).toBeInTheDocument();
    });

    it("mostra todos os agendamentos quando filtro é 'todos'", async () => {
      setupAppointments();

      const userObj = userEvent.setup({ delay: null });

      renderWithCleanup(<TeacherMeetingsTab adminId={adminId} />);

      const select = await screen.findByRole("combobox");
      await userObj.selectOptions(select, "todos");

      await waitFor(() => {
        expect(screen.getByText(/10:00/i)).toBeInTheDocument();
        expect(screen.getByText(/11:00/i)).toBeInTheDocument();
        expect(screen.getByText(/15:00/i)).toBeInTheDocument();
        expect(screen.getByText(/09:00/i)).toBeInTheDocument();
      });
    });
  });

  describe("Status dos Agendamentos", () => {
    it("exibe badge 'Agendado' para reuniões futuras", async () => {
      scheduleApi.fetchAppointments.mockResolvedValue([
        {
          id: "1",
          date: dayjs().add(1, "day").format("YYYY-MM-DD"),
          time: "10:00",
          status: "SCHEDULED",
          studentName: "João",
        },
      ]);

      renderWithCleanup(<TeacherMeetingsTab adminId={adminId} />);

      expect(await screen.findByText("Agendado")).toBeInTheDocument();
    });

    it("exibe badge 'Cancelado' para reuniões canceladas", async () => {
      scheduleApi.fetchAppointments.mockResolvedValue([
        {
          id: "1",
          date: dayjs().add(1, "day").format("YYYY-MM-DD"),
          time: "10:00",
          status: "CANCELLED",
          studentName: "João",
        },
      ]);

      const userObj = userEvent.setup({ delay: null });

      renderWithCleanup(<TeacherMeetingsTab adminId={adminId} />);

      const select = await screen.findByRole("combobox");
      await userObj.selectOptions(select, "cancelados");

      expect(await screen.findByText("Cancelado")).toBeInTheDocument();
    });

    it("exibe badge 'Concluído' para reuniões com status COMPLETED", async () => {
      scheduleApi.fetchAppointments.mockResolvedValue([
        {
          id: "1",
          date: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
          time: "10:00",
          status: "COMPLETED",
          studentName: "João",
        },
      ]);

      const userObj = userEvent.setup({ delay: null });

      renderWithCleanup(<TeacherMeetingsTab adminId={adminId} />);

      const select = await screen.findByRole("combobox");
      await userObj.selectOptions(select, "completados");

      expect(await screen.findByText("Concluído")).toBeInTheDocument();
    });

    it("exibe badge 'Concluído' para reuniões passadas não canceladas", async () => {
      scheduleApi.fetchAppointments.mockResolvedValue([
        {
          id: "1",
          date: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
          time: "10:00",
          status: "SCHEDULED",
          studentName: "João",
        },
      ]);

      const userObj = userEvent.setup({ delay: null });

      renderWithCleanup(<TeacherMeetingsTab adminId={adminId} />);

      const select = await screen.findByRole("combobox");
      await userObj.selectOptions(select, "completados");

      expect(await screen.findByText("Concluído")).toBeInTheDocument();
    });
  });

  describe("Cancelamento de Agendamentos", () => {
    it("exibe botão cancelar apenas para reuniões futuras não canceladas", async () => {
      scheduleApi.fetchAppointments.mockResolvedValue([
        {
          id: "1",
          date: dayjs().add(1, "day").format("YYYY-MM-DD"),
          time: "10:00",
          status: "SCHEDULED",
          studentName: "João",
        },
      ]);

      renderWithCleanup(<TeacherMeetingsTab adminId={adminId} />);

      expect(await screen.findByRole("button", { name: /Cancelar/i })).toBeInTheDocument();
    });

    it("não exibe botão cancelar para reuniões passadas", async () => {
      scheduleApi.fetchAppointments.mockResolvedValue([
        {
          id: "1",
          date: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
          time: "10:00",
          status: "SCHEDULED",
          studentName: "João",
        },
      ]);

      const userObj = userEvent.setup({ delay: null });

      renderWithCleanup(<TeacherMeetingsTab adminId={adminId} />);

      const select = await screen.findByRole("combobox");
      await userObj.selectOptions(select, "completados");

      await waitFor(() => {
        expect(screen.queryByRole("button", { name: /Cancelar/i })).not.toBeInTheDocument();
      });
    });

    it("abre modal de confirmação ao clicar em cancelar (estudante individual)", async () => {
      scheduleApi.fetchAppointments.mockResolvedValue([
        {
          id: "1",
          date: dayjs().add(1, "day").format("YYYY-MM-DD"),
          time: "10:00",
          status: "SCHEDULED",
          studentName: "João Silva",
        },
      ]);

      const userObj = userEvent.setup({ delay: null });

      renderWithCleanup(<TeacherMeetingsTab adminId={adminId} />);

      const cancelButton = await screen.findByRole("button", { name: /Cancelar/i });
      await userObj.click(cancelButton);

      expect(
        await screen.findByText(/Tem certeza que deseja cancelar o agendamento de João Silva/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/O estudante será notificado sobre o cancelamento/i)
      ).toBeInTheDocument();
    });

    it("abre modal de confirmação ao clicar em cancelar (time)", async () => {
      scheduleApi.fetchAppointments.mockResolvedValue([
        {
          id: "1",
          date: dayjs().add(1, "day").format("YYYY-MM-DD"),
          time: "10:00",
          status: "SCHEDULED",
          teamName: "Grupo Alpha",
        },
      ]);

      const userObj = userEvent.setup({ delay: null });

      renderWithCleanup(<TeacherMeetingsTab adminId={adminId} />);

      const cancelButton = await screen.findByRole("button", { name: /Cancelar/i });
      await userObj.click(cancelButton);

      expect(
        await screen.findByText(/Tem certeza que deseja cancelar o agendamento de time Grupo Alpha/i)
      ).toBeInTheDocument();
    });

    it("cancela agendamento com sucesso", async () => {
      const mockAppointments = [
        {
          id: "1",
          date: dayjs().add(1, "day").format("YYYY-MM-DD"),
          time: "10:00",
          status: "SCHEDULED",
          studentName: "João",
        },
      ];

      scheduleApi.fetchAppointments.mockResolvedValue(mockAppointments);
      api.patch.mockResolvedValue({ data: { success: true } });

      const userObj = userEvent.setup({ delay: null });

      renderWithCleanup(<TeacherMeetingsTab adminId={adminId} />);

      const cancelButton = await screen.findByRole("button", { name: /Cancelar/i });
      await userObj.click(cancelButton);

      const confirmButton = await screen.findByRole("button", { name: /SIM/i });

      // Mock para segunda chamada após cancelamento
      scheduleApi.fetchAppointments.mockResolvedValue([
        { ...mockAppointments[0], status: "CANCELLED" },
      ]);

      await userObj.click(confirmButton);

      await waitFor(() => {
        expect(api.patch).toHaveBeenCalledWith("/appointments/1/cancel");
        expect(scheduleApi.fetchAppointments).toHaveBeenCalledWith(adminId, "admin");
        expect(toast.success).toHaveBeenCalledWith(
          expect.stringContaining("Agendamento de João cancelado!")
        );
      });
    });

    it("exibe erro ao falhar cancelamento", async () => {
      scheduleApi.fetchAppointments.mockResolvedValue([
        {
          id: "1",
          date: dayjs().add(1, "day").format("YYYY-MM-DD"),
          time: "10:00",
          status: "SCHEDULED",
          studentName: "João",
        },
      ]);

      api.patch.mockRejectedValue(new Error("Erro de rede"));

      const userObj = userEvent.setup({ delay: null });

      renderWithCleanup(<TeacherMeetingsTab adminId={adminId} />);

      const cancelButton = await screen.findByRole("button", { name: /Cancelar/i });
      await userObj.click(cancelButton);

      const confirmButton = await screen.findByRole("button", { name: /SIM/i });
      await userObj.click(confirmButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Erro ao cancelar agendamento");
      });
    });
  });

  describe("Paginação", () => {
    it("exibe paginação quando há mais de 10 agendamentos", async () => {
      const manyAppointments = Array.from({ length: 15 }, (_, i) => ({
        id: `${i}`,
        date: dayjs().add(i + 1, "day").format("YYYY-MM-DD"),
        time: "10:00",
        status: "SCHEDULED",
        studentName: "João",
      }));

      scheduleApi.fetchAppointments.mockResolvedValue(manyAppointments);

      renderWithCleanup(<TeacherMeetingsTab adminId={adminId} />);

      await waitFor(() => {
        expect(screen.getByText(/Mostrando/i)).toBeInTheDocument();
      });

      expect(screen.getByText(/Mostrando 1-10 de 15/i)).toBeInTheDocument();
    });

    it("não exibe paginação quando há 10 ou menos agendamentos", async () => {
      const fewAppointments = Array.from({ length: 5 }, (_, i) => ({
        id: `${i}`,
        date: dayjs().add(i + 1, "day").format("YYYY-MM-DD"),
        time: "10:00",
        status: "SCHEDULED",
        studentName: "João",
      }));

      scheduleApi.fetchAppointments.mockResolvedValue(fewAppointments);

      renderWithCleanup(<TeacherMeetingsTab adminId={adminId} />);

      await waitFor(() => {
        expect(screen.getAllByText(/10:00/i)).toHaveLength(5);
      });

      expect(screen.queryByText(/Mostrando/i)).not.toBeInTheDocument();
    });
  });

  describe("Contador de Agendamentos", () => {
    it("exibe contador quando há agendamentos filtrados", async () => {
      scheduleApi.fetchAppointments.mockResolvedValue([
        {
          id: "1",
          date: dayjs().add(1, "day").format("YYYY-MM-DD"),
          time: "10:00",
          status: "SCHEDULED",
          studentName: "João",
        },
        {
          id: "2",
          date: dayjs().add(2, "day").format("YYYY-MM-DD"),
          time: "11:00",
          status: "SCHEDULED",
          studentName: "Maria",
        },
      ]);

      renderWithCleanup(<TeacherMeetingsTab adminId={adminId} />);

      expect(await screen.findByText("2")).toBeInTheDocument();
    });

    it("não exibe contador quando não há agendamentos", async () => {
      renderWithCleanup(<TeacherMeetingsTab adminId={adminId} />);

      await waitFor(() => {
        expect(screen.queryByText("0")).not.toBeInTheDocument();
      });
    });
  });

  describe("Tratamento de Erros", () => {
    it("trata erro ao carregar agendamentos", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => { });
      scheduleApi.fetchAppointments.mockRejectedValue(new Error("Erro de rede"));

      renderWithCleanup(<TeacherMeetingsTab adminId={adminId} />);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Erro ao carregar agendamentos",
          expect.any(Error)
        );
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Ordenação", () => {
    it("ordena agendamentos próximos do mais próximo para o mais distante", async () => {
      scheduleApi.fetchAppointments.mockResolvedValue([
        {
          id: "1",
          date: dayjs().add(3, "day").format("YYYY-MM-DD"),
          time: "15:00",
          status: "SCHEDULED",
          studentName: "João",
        },
        {
          id: "2",
          date: dayjs().add(1, "day").format("YYYY-MM-DD"),
          time: "10:00",
          status: "SCHEDULED",
          studentName: "Maria",
        },
        {
          id: "3",
          date: dayjs().add(2, "day").format("YYYY-MM-DD"),
          time: "12:00",
          status: "SCHEDULED",
          studentName: "Pedro",
        },
      ]);

      renderWithCleanup(<TeacherMeetingsTab adminId={adminId} />);

      await waitFor(() => {
        const times = screen.getAllByText(/\d{2}:\d{2}/);
        expect(times[0]).toHaveTextContent("10:00");
        expect(times[1]).toHaveTextContent("12:00");
        expect(times[2]).toHaveTextContent("15:00");
      });
    });

    it("ordena agendamentos concluídos do mais recente para o mais antigo", async () => {
      scheduleApi.fetchAppointments.mockResolvedValue([
        {
          id: "1",
          date: dayjs().subtract(3, "day").format("YYYY-MM-DD"),
          time: "09:00",
          status: "COMPLETED",
          studentName: "João",
        },
        {
          id: "2",
          date: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
          time: "15:00",
          status: "COMPLETED",
          studentName: "Maria",
        },
        {
          id: "3",
          date: dayjs().subtract(2, "day").format("YYYY-MM-DD"),
          time: "12:00",
          status: "COMPLETED",
          studentName: "Pedro",
        },
      ]);

      const userObj = userEvent.setup({ delay: null });

      renderWithCleanup(<TeacherMeetingsTab adminId={adminId} />);

      const select = await screen.findByRole("combobox");
      await userObj.selectOptions(select, "completados");

      await waitFor(() => {
        const times = screen.getAllByText(/\d{2}:\d{2}/);
        expect(times[0]).toHaveTextContent("15:00");
        expect(times[1]).toHaveTextContent("12:00");
        expect(times[2]).toHaveTextContent("09:00");
      });
    });
  });
});
