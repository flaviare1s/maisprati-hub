import { render, screen, waitFor } from "@testing-library/react";
import { StudentMeetingsTab } from "../../../../components/student-dashboard/StudentMeetingsTab.jsx";
import * as scheduleApi from "../../../../api.js/schedule";
import * as teamsApi from "../../../../api.js/teams";
import api from "../../../../services/api";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { AuthContext } from "../../../../contexts/AuthContext";
import userEvent from "@testing-library/user-event";
import toast from "react-hot-toast";
import dayjs from "dayjs";

// Mock do react-hot-toast
vi.mock("react-hot-toast");

// Mock do contexto de autenticação
const MockAuthProvider = ({ children, user }) => {
  const mockContext = { user };
  return <AuthContext.Provider value={mockContext}>{children}</AuthContext.Provider>;
};

// Mock das APIs
vi.mock("../../../../api.js/schedule", () => ({
  fetchAppointments: vi.fn(),
}));

vi.mock("../../../../api.js/teams", () => ({
  fetchTeams: vi.fn(),
}));

vi.mock("../../../../services/api", () => ({
  default: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

describe("StudentMeetingsTab - Testes Abrangentes", () => {
  let user;
  let unmountFn;

  // Helper para renderizar e guardar unmount
  const renderWithCleanup = (component) => {
    const result = render(component);
    unmountFn = result.unmount;
    return result;
  };

  beforeEach(() => {
    vi.clearAllMocks();

    user = {
      id: "123",
      name: "João Silva",
      email: "joao@email.com",
    };

    // Mocks padrão
    scheduleApi.fetchAppointments.mockResolvedValue([]);
    teamsApi.fetchTeams.mockResolvedValue([]);
    api.get.mockResolvedValue({ data: [] });
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
    it("renderiza o componente com título", async () => {
      renderWithCleanup(
        <MockAuthProvider user={user}>
          <StudentMeetingsTab />
        </MockAuthProvider>
      );

      expect(screen.getByText("Reuniões")).toBeInTheDocument();

      await waitFor(() => {
        expect(scheduleApi.fetchAppointments).toHaveBeenCalled();
      });
    });

    it("exibe mensagem quando não há reuniões", async () => {
      renderWithCleanup(
        <MockAuthProvider user={user}>
          <StudentMeetingsTab />
        </MockAuthProvider>
      );

      expect(
        await screen.findByText(/Nenhuma reunião encontrada para o filtro "próximos"/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Use o calendário para agendar uma reunião/i)
      ).toBeInTheDocument();
    });

    it("renderiza o filtro de reuniões", async () => {
      renderWithCleanup(
        <MockAuthProvider user={user}>
          <StudentMeetingsTab />
        </MockAuthProvider>
      );

      // Busca o label pelo texto
      expect(screen.getByText(/Filtrar:/i)).toBeInTheDocument();
      // Busca o select diretamente por role
      const select = screen.getByRole("combobox");
      expect(select).toHaveValue("proximos");

      await waitFor(() => {
        expect(scheduleApi.fetchAppointments).toHaveBeenCalled();
      });
    });
  });

  describe("Carregamento de Reuniões", () => {
    it("carrega e exibe reuniões individuais", async () => {
      const mockAppointments = [
        {
          id: "1",
          date: dayjs().add(1, "day").format("YYYY-MM-DD"),
          time: "10:00",
          studentName: "João Silva",
          status: "SCHEDULED",
        },
      ];

      scheduleApi.fetchAppointments.mockResolvedValue(mockAppointments);

      renderWithCleanup(
        <MockAuthProvider user={user}>
          <StudentMeetingsTab />
        </MockAuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/10:00/i)).toBeInTheDocument();
      });

      // O componente mostra "Você" quando não há studentName ou usa o studentName
      expect(screen.getByText(/João Silva/i)).toBeInTheDocument();
    });

    it("carrega e exibe reuniões de equipe", async () => {
      const mockTeam = {
        id: "team1",
        name: "Grupo Alpha",
        members: [{ userId: "123" }],
      };

      const mockTeamAppointments = [
        {
          id: "2",
          date: dayjs().add(2, "day").format("YYYY-MM-DD"),
          time: "14:00",
          teamName: "Grupo Alpha",
          status: "SCHEDULED",
        },
      ];

      scheduleApi.fetchAppointments.mockResolvedValue([]);
      teamsApi.fetchTeams.mockResolvedValue([mockTeam]);
      api.get.mockResolvedValue({ data: mockTeamAppointments });

      renderWithCleanup(
        <MockAuthProvider user={user}>
          <StudentMeetingsTab />
        </MockAuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/14:00/i)).toBeInTheDocument();
      });

      expect(screen.getByText("Grupo Alpha")).toBeInTheDocument();
    });

    it("remove duplicatas de reuniões", async () => {
      const duplicateAppointment = {
        id: "1",
        date: dayjs().add(1, "day").format("YYYY-MM-DD"),
        time: "10:00",
        studentName: "João Silva",
        status: "SCHEDULED",
      };

      scheduleApi.fetchAppointments.mockResolvedValue([duplicateAppointment]);
      teamsApi.fetchTeams.mockResolvedValue([
        { id: "team1", members: [{ userId: "123" }] },
      ]);
      api.get.mockResolvedValue({ data: [duplicateAppointment] });

      renderWithCleanup(
        <MockAuthProvider user={user}>
          <StudentMeetingsTab />
        </MockAuthProvider>
      );

      await waitFor(() => {
        const timeElements = screen.getAllByText(/10:00/i);
        expect(timeElements).toHaveLength(1);
      });
    });

    it("não carrega reuniões quando usuário não está disponível", async () => {
      renderWithCleanup(
        <MockAuthProvider user={null}>
          <StudentMeetingsTab />
        </MockAuthProvider>
      );

      await waitFor(() => {
        expect(scheduleApi.fetchAppointments).not.toHaveBeenCalled();
      }, { timeout: 1000 });
    });
  });

  describe("Filtros de Reuniões", () => {
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
          studentName: "João",
        },
        {
          id: "3",
          date: dayjs().add(2, "day").format("YYYY-MM-DD"),
          time: "15:00",
          status: "CANCELLED",
          studentName: "João",
        },
        {
          id: "4",
          date: dayjs().subtract(2, "day").format("YYYY-MM-DD"),
          time: "09:00",
          status: "SCHEDULED",
          studentName: "João",
        },
      ];

      scheduleApi.fetchAppointments.mockResolvedValue(appointments);
    };

    it("filtra reuniões próximas (padrão)", async () => {
      setupAppointments();

      renderWithCleanup(
        <MockAuthProvider user={user}>
          <StudentMeetingsTab />
        </MockAuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/10:00/i)).toBeInTheDocument();
      });

      expect(screen.queryByText(/11:00/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/15:00/i)).not.toBeInTheDocument();
    });

    it("filtra reuniões canceladas", async () => {
      setupAppointments();

      const userObj = userEvent.setup({ delay: null });

      renderWithCleanup(
        <MockAuthProvider user={user}>
          <StudentMeetingsTab />
        </MockAuthProvider>
      );

      const select = await screen.findByRole("combobox");
      await userObj.selectOptions(select, "cancelados");

      await waitFor(() => {
        expect(screen.getByText(/15:00/i)).toBeInTheDocument();
      });

      expect(screen.queryByText(/10:00/i)).not.toBeInTheDocument();
    });

    it("filtra reuniões concluídas", async () => {
      setupAppointments();

      const userObj = userEvent.setup({ delay: null });

      renderWithCleanup(
        <MockAuthProvider user={user}>
          <StudentMeetingsTab />
        </MockAuthProvider>
      );

      const select = await screen.findByRole("combobox");
      await userObj.selectOptions(select, "completados");

      await waitFor(() => {
        expect(screen.getByText(/11:00/i)).toBeInTheDocument();
      });

      expect(screen.getByText(/09:00/i)).toBeInTheDocument();
    });

    it("mostra todas as reuniões quando filtro é 'todos'", async () => {
      setupAppointments();

      const userObj = userEvent.setup({ delay: null });

      renderWithCleanup(
        <MockAuthProvider user={user}>
          <StudentMeetingsTab />
        </MockAuthProvider>
      );

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

  describe("Status das Reuniões", () => {
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

      renderWithCleanup(
        <MockAuthProvider user={user}>
          <StudentMeetingsTab />
        </MockAuthProvider>
      );

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

      renderWithCleanup(
        <MockAuthProvider user={user}>
          <StudentMeetingsTab />
        </MockAuthProvider>
      );

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

      renderWithCleanup(
        <MockAuthProvider user={user}>
          <StudentMeetingsTab />
        </MockAuthProvider>
      );

      const select = await screen.findByRole("combobox");
      await userObj.selectOptions(select, "completados");

      expect(await screen.findByText("Concluído")).toBeInTheDocument();
    });
  });

  describe("Cancelamento de Reuniões", () => {
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

      renderWithCleanup(
        <MockAuthProvider user={user}>
          <StudentMeetingsTab />
        </MockAuthProvider>
      );

      expect(await screen.findByRole("button", { name: /Cancelar/i })).toBeInTheDocument();
    });

    it("abre modal de confirmação ao clicar em cancelar", async () => {
      scheduleApi.fetchAppointments.mockResolvedValue([
        {
          id: "1",
          date: dayjs().add(1, "day").format("YYYY-MM-DD"),
          time: "10:00",
          status: "SCHEDULED",
          studentName: "João",
        },
      ]);

      const userObj = userEvent.setup({ delay: null });

      renderWithCleanup(
        <MockAuthProvider user={user}>
          <StudentMeetingsTab />
        </MockAuthProvider>
      );

      const cancelButton = await screen.findByRole("button", { name: /Cancelar/i });
      await userObj.click(cancelButton);

      expect(
        await screen.findByText(/Tem certeza que deseja cancelar a reunião/i)
      ).toBeInTheDocument();
    });

    it("cancela reunião com sucesso", async () => {
      scheduleApi.fetchAppointments.mockResolvedValue([
        {
          id: "1",
          date: dayjs().add(1, "day").format("YYYY-MM-DD"),
          time: "10:00",
          status: "SCHEDULED",
          studentName: "João",
        },
      ]);

      api.patch.mockResolvedValue({ data: { success: true } });

      const userObj = userEvent.setup({ delay: null });

      renderWithCleanup(
        <MockAuthProvider user={user}>
          <StudentMeetingsTab />
        </MockAuthProvider>
      );

      const cancelButton = await screen.findByRole("button", { name: /Cancelar/i });
      await userObj.click(cancelButton);

      // O modal usa "SIM" como texto do botão de confirmação
      const confirmButton = await screen.findByRole("button", { name: /SIM/i });
      await userObj.click(confirmButton);

      await waitFor(() => {
        expect(api.patch).toHaveBeenCalledWith("/appointments/1/cancel");
        expect(toast.success).toHaveBeenCalledWith("Reunião cancelada com sucesso!");
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

      renderWithCleanup(
        <MockAuthProvider user={user}>
          <StudentMeetingsTab />
        </MockAuthProvider>
      );

      const cancelButton = await screen.findByRole("button", { name: /Cancelar/i });
      await userObj.click(cancelButton);

      // O modal usa "SIM" como texto do botão de confirmação
      const confirmButton = await screen.findByRole("button", { name: /SIM/i });
      await userObj.click(confirmButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Erro ao cancelar reunião");
      });
    });
  });

  describe("Paginação", () => {
    it("exibe paginação quando há mais de 10 reuniões", async () => {
      const manyAppointments = Array.from({ length: 15 }, (_, i) => ({
        id: `${i}`,
        date: dayjs().add(i + 1, "day").format("YYYY-MM-DD"),
        time: "10:00",
        status: "SCHEDULED",
        studentName: "João",
      }));

      scheduleApi.fetchAppointments.mockResolvedValue(manyAppointments);

      renderWithCleanup(
        <MockAuthProvider user={user}>
          <StudentMeetingsTab />
        </MockAuthProvider>
      );

      // Verifica se a paginação está presente
      await waitFor(() => {
        expect(screen.getByText(/Mostrando/i)).toBeInTheDocument();
      });

      // Verifica o texto completo da paginação que está em um único elemento
      expect(screen.getByText(/Mostrando 1-10 de 15/i)).toBeInTheDocument();
    });

    it("não exibe paginação quando há 10 ou menos reuniões", async () => {
      const fewAppointments = Array.from({ length: 5 }, (_, i) => ({
        id: `${i}`,
        date: dayjs().add(i + 1, "day").format("YYYY-MM-DD"),
        time: "10:00",
        status: "SCHEDULED",
        studentName: "João",
      }));

      scheduleApi.fetchAppointments.mockResolvedValue(fewAppointments);

      renderWithCleanup(
        <MockAuthProvider user={user}>
          <StudentMeetingsTab />
        </MockAuthProvider>
      );

      await waitFor(() => {
        expect(screen.getAllByText(/10:00/i)).toHaveLength(5);
      });

      expect(screen.queryByText(/Mostrando/i)).not.toBeInTheDocument();
    });
  });

  describe("Contador de Reuniões", () => {
    it("exibe contador quando há reuniões filtradas", async () => {
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
          studentName: "João",
        },
      ]);

      renderWithCleanup(
        <MockAuthProvider user={user}>
          <StudentMeetingsTab />
        </MockAuthProvider>
      );

      expect(await screen.findByText("2")).toBeInTheDocument();
    });

    it("não exibe contador quando não há reuniões", async () => {
      renderWithCleanup(
        <MockAuthProvider user={user}>
          <StudentMeetingsTab />
        </MockAuthProvider>
      );

      await waitFor(() => {
        expect(screen.queryByText("0")).not.toBeInTheDocument();
      });
    });
  });

  describe("Tratamento de Erros", () => {
    it("trata erro ao carregar reuniões", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => { });
      scheduleApi.fetchAppointments.mockRejectedValue(new Error("Erro de rede"));

      renderWithCleanup(
        <MockAuthProvider user={user}>
          <StudentMeetingsTab />
        </MockAuthProvider>
      );

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Erro ao carregar agendamentos",
          expect.any(Error)
        );
      });

      consoleErrorSpy.mockRestore();
    });
  });
});
