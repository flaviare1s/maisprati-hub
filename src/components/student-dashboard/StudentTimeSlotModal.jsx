import { useState, useEffect } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { fetchTimeSlots } from "../../api/schedule";
import api from "../../services/api";

const generateDaySlots = (existingSlots = []) => {
  const startHour = 6;
  const endHour = 23;
  const slots = [];
  const interval = 30;

  for (let hour = startHour; hour <= endHour; hour++) {
    for (let min = 0; min < 60; min += interval) {
      if (hour === endHour && min > 0) continue;
      const time = `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
      const existing = existingSlots.find((s) => s.time === time);
      slots.push(existing || { time, available: false, booked: false });
    }
  }

  return slots;
};

export const StudentTimeSlotModal = ({ open, onClose, selectedDate, studentId }) => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open || !selectedDate) return;

    const loadSlots = async () => {
      setLoading(true);
      try {
        // Buscar o admin (único professor) via API service
        const usersRes = await api.get("/users");
        const admin = usersRes.data.find(u => u.type === 'admin');

        if (!admin) {
          toast.error("Professor não encontrado");
          return;
        }

        const existingSlots = await fetchTimeSlots(admin.id, selectedDate.format("YYYY-MM-DD"));
        setTimeSlots(generateDaySlots(existingSlots));
      } catch (error) {
        toast.error("Erro ao carregar horários");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadSlots();
  }, [open, selectedDate]);

  const handleTimeSlotClick = async (slot) => {
    if (!slot.available || slot.booked) {
      toast.error("Este horário não está disponível");
      return;
    }

    try {
      // Buscar admin via API service
      const usersRes = await api.get("/users");
      const admin = usersRes.data.find(u => u.type === 'admin');

      if (!admin) {
        toast.error("Professor não encontrado");
        return;
      }

      // Buscar o time do usuário para incluir o teamId
      const teamsRes = await api.get("/teams");

      const userTeam = teamsRes.data.find(team =>
        team.members && team.members.some(member => member.userId.toString() === studentId.toString())
      );

      const appointmentData = {
        adminId: admin.id,
        studentId,
        teamId: userTeam?.id || null,
        date: selectedDate.format("YYYY-MM-DD"),
        time: slot.time + ":00"
      };

      await api.post("/appointments", appointmentData);

      // Atualizar o slot como agendado
      setTimeSlots(prev =>
        prev.map(s => (s.time === slot.time ? { ...s, booked: true } : s))
      );

      toast.success("Horário agendado com sucesso!");

      // Fechar modal após alguns segundos
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      toast.error("Erro ao agendar horário");
      console.error(error);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[80vh] border dark:border-gray-600 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-dark">
            Agendar Reunião - {selectedDate?.format("DD/MM/YYYY")}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-center text-gray-500 text-sm mb-6">
            {loading
              ? "Carregando horários disponíveis..."
              : "Selecione um horário disponível para agendar sua reunião"}
          </p>

          {!loading && (
            <div className="grid grid-cols-3 gap-3 max-h-80 overflow-y-auto">
              {timeSlots.map((slot, idx) => {
                let bgClass = "";
                let cursorClass = "cursor-pointer";
                let textClass = "";

                if (slot.booked) {
                  bgClass = "bg-red-50 border border-red-200";
                  textClass = "text-red-500";
                  cursorClass = "cursor-not-allowed";
                } else if (!slot.available) {
                  bgClass = "bg-gray-100 border border-gray-300";
                  textClass = "text-gray-400";
                  cursorClass = "cursor-not-allowed";
                } else {
                  bgClass = "bg-blue-50 border border-blue-300 hover:bg-blue-100 hover:shadow-md hover:-translate-y-0.5";
                  textClass = "text-blue-700";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleTimeSlotClick(slot)}
                    disabled={slot.booked || !slot.available}
                    className={`py-3 px-2 rounded-lg text-sm font-medium transition-all duration-200 ${bgClass} ${textClass} ${cursorClass}`}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
          )}

          {!loading && timeSlots.filter(slot => slot.available && !slot.booked).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum horário disponível para esta data</p>
              <p className="text-sm mt-2">Tente selecionar outra data</p>
            </div>
          )}

          {/* Legenda */}
          <div className="flex items-center justify-center gap-4 mt-6 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-logo rounded-full" />
              <span className="text-xs text-gray-600">Disponível</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-primary rounded-full" />
              <span className="text-xs text-gray-600">Agendado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full" />
              <span className="text-xs text-gray-600">Indisponível</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
