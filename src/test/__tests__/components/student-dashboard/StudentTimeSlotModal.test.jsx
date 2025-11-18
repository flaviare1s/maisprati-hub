import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { StudentTimeSlotModal } from "../../../../components/student-dashboard/StudentTimeSlotModal.jsx";
import { fetchTimeSlots } from "../../../../api/schedule.js";
import api from "../../../../services/api.js";
import toast from "react-hot-toast";

vi.mock("../../../../api/schedule.js", () => ({
  fetchTimeSlots: vi.fn(),
}));

vi.mock("../../../../services/api.js", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
  success: vi.fn(),
  error: vi.fn(),
}));

const MOCK_ADMIN = { id: 1, type: "admin" };
const MOCK_STUDENT = { id: 5 };
const MOCK_DATE = { format: () => "2025-11-10" };

const MOCK_SLOTS = [
  { time: "06:00", available: false, booked: false },
  { time: "06:30", available: true, booked: false }
];

describe("StudentTimeSlotModal (Vitest)", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("carrega slots chamando fetchTimeSlots com admin correto", async () => {
    api.get.mockResolvedValueOnce({ data: [MOCK_ADMIN] });
    fetchTimeSlots.mockResolvedValue(MOCK_SLOTS);

    render(
      <StudentTimeSlotModal
        open={true}
        onClose={() => { }}
        selectedDate={MOCK_DATE}
        studentId={MOCK_STUDENT.id}
      />
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith("/users");
      expect(fetchTimeSlots).toHaveBeenCalledWith(
        MOCK_ADMIN.id,
        "2025-11-10"
      );
    });
  });

  it("agenda horário com sucesso", async () => {
    api.get
      .mockResolvedValueOnce({ data: [MOCK_ADMIN] })
      .mockResolvedValueOnce({ data: [MOCK_ADMIN] })
      .mockResolvedValueOnce({
        data: [{ id: 10, members: [{ userId: MOCK_STUDENT.id }] }]
      });

    fetchTimeSlots.mockResolvedValue(MOCK_SLOTS);
    api.post.mockResolvedValue({});

    render(
      <StudentTimeSlotModal
        open
        onClose={() => { }}
        selectedDate={MOCK_DATE}
        studentId={MOCK_STUDENT.id}
      />
    );

    const button = await screen.findByText("06:30");
    fireEvent.click(button);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Horário agendado com sucesso!");
    });
  });

  it("exibe erro ao tentar agendar", async () => {
    api.get
      .mockResolvedValueOnce({ data: [MOCK_ADMIN] })
      .mockResolvedValueOnce({ data: [MOCK_ADMIN] })
      .mockResolvedValueOnce({ data: [] });

    fetchTimeSlots.mockResolvedValue(MOCK_SLOTS);
    api.post.mockRejectedValue(new Error("erro"));

    render(
      <StudentTimeSlotModal
        open
        onClose={() => { }}
        selectedDate={MOCK_DATE}
        studentId={MOCK_STUDENT.id}
      />
    );

    const button = await screen.findByText("06:30");
    fireEvent.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Erro ao agendar horário");
    });
  });
});
