import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AdminTimeSlotModal } from "../../../../components/teacher-dashboard/AdminTimeSlotModal.jsx";
import { fetchTimeSlots, createTimeSlots } from "../../../../api/schedule";
import toast from "react-hot-toast";

vi.mock("../../../../api/schedule", () => ({
  fetchTimeSlots: vi.fn(),
  createTimeSlots: vi.fn(),
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const MOCK_ADMIN_ID = 99;
const MOCK_DATE = { format: () => "2025-11-10", isSame: () => false };

const EXISTING_SLOTS = [
  { time: "06:00", available: false, booked: false },
  { time: "06:30", available: true, booked: false },
];

describe("AdminTimeSlotModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("carrega slots chamando fetchTimeSlots corretamente", async () => {
    fetchTimeSlots.mockResolvedValue(EXISTING_SLOTS);

    render(
      <AdminTimeSlotModal
        open
        onClose={() => { }}
        selectedDate={MOCK_DATE}
        adminId={MOCK_ADMIN_ID}
      />
    );

    await waitFor(() => {
      expect(fetchTimeSlots).toHaveBeenCalledWith(
        MOCK_ADMIN_ID,
        "2025-11-10"
      );
    });
  });

  it("exibe erro ao falhar no carregamento dos horários", async () => {
    fetchTimeSlots.mockRejectedValue(new Error("erro"));

    render(
      <AdminTimeSlotModal
        open
        onClose={() => { }}
        selectedDate={MOCK_DATE}
        adminId={MOCK_ADMIN_ID}
      />
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Erro ao carregar horários");
    });
  });

  it("disponibiliza um horário ao clicar em um slot indisponível", async () => {
    fetchTimeSlots.mockResolvedValue(EXISTING_SLOTS);
    createTimeSlots.mockResolvedValue({});

    render(
      <AdminTimeSlotModal
        open
        onClose={() => { }}
        selectedDate={MOCK_DATE}
        adminId={MOCK_ADMIN_ID}
      />
    );

    const button = await screen.findByText("06:00"); // indisponível
    fireEvent.click(button);

    await waitFor(() => {
      expect(createTimeSlots).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Horário disponibilizado!");
    });
  });

  it("remove um horário ao clicar em um slot disponível", async () => {
    fetchTimeSlots.mockResolvedValue(EXISTING_SLOTS);
    createTimeSlots.mockResolvedValue({});

    render(
      <AdminTimeSlotModal
        open
        onClose={() => { }}
        selectedDate={MOCK_DATE}
        adminId={MOCK_ADMIN_ID}
      />
    );

    const button = await screen.findByText("06:30"); // disponível
    fireEvent.click(button);

    await waitFor(() => {
      expect(createTimeSlots).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Horário removido!");
    });
  });

  it("exibe erro caso falhe ao tentar salvar o slot", async () => {
    fetchTimeSlots.mockResolvedValue(EXISTING_SLOTS);
    createTimeSlots.mockRejectedValue(new Error("falhou"));

    render(
      <AdminTimeSlotModal
        open
        onClose={() => { }}
        selectedDate={MOCK_DATE}
        adminId={MOCK_ADMIN_ID}
      />
    );

    const button = await screen.findByText("06:30");
    fireEvent.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Erro ao atualizar/criar slot");
    });
  });
});
