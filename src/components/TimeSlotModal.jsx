// TimeSlotModal.jsx
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import {
  bookTimeSlot,
  fetchTimeSlots,
  updateTimeSlotAvailability // import da função nova
} from "../api.js/schedule";

const generateDaySlots = (existingSlots = [], interval = 30) => {
  const startHour = 6;
  const endHour = 23;
  const slots = [];

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

export const TimeSlotModal = ({ open, onClose, selectedDate, teacherId, studentId }) => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const isStudent = !!studentId;

  useEffect(() => {
    if (!open || !selectedDate) return;

    const loadSlots = async () => {
      setLoading(true);
      try {
        const existingSlots = await fetchTimeSlots(teacherId, selectedDate.format("YYYY-MM-DD"));
        setTimeSlots(generateDaySlots(existingSlots));
      } catch (error) {
        toast.error("Erro ao carregar horários");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadSlots();
  }, [open, selectedDate, teacherId]);

  const handleTimeSlotClick = async (slot) => {
    if (isStudent) {
      // aluno só pode agendar horários disponíveis e não reservados
      if (!slot.available || slot.booked) return;

      try {
        await bookTimeSlot(studentId, teacherId, selectedDate.format("YYYY-MM-DD"), slot.time);
        toast.success(`Horário ${slot.time} reservado com sucesso!`);
        setTimeSlots((prev) =>
          prev.map((s) =>
            s.time === slot.time ? { ...s, booked: true, available: false } : s
          )
        );
        onClose();
      } catch (error) {
        toast.error(error.message || "Erro ao reservar horário");
      }
    } else {
      // professor alterna disponibilidade
      if (slot.booked) return; // não pode mudar horários já agendados

      const newAvailability = !slot.available;
      try {
        await updateTimeSlotAvailability(teacherId, selectedDate.format("YYYY-MM-DD"), slot.time, newAvailability);
        setTimeSlots((prev) =>
          prev.map((s) =>
            s.time === slot.time ? { ...s, available: newAvailability } : s
          )
        );
      } catch (error) {
        toast.error("Erro ao atualizar disponibilidade");
        console.error(error);
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[80vh] border overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-dark">
            {selectedDate ? selectedDate.format("DD/MM/YYYY") : ""}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-center text-gray-500 text-sm mb-6">
            {loading
              ? "Carregando horários..."
              : isStudent
                ? "Selecione um horário disponível para agendar"
                : "Selecione os horários disponíveis para os alunos"}
          </p>

          {!loading && (
            <>
              <div className="grid grid-cols-3 gap-3 max-h-80 overflow-y-auto">
                {timeSlots.map((slot, idx) => {
                  let bgClass = "";
                  let cursorClass = "cursor-pointer";

                  if (slot.booked) {
                    bgClass = "bg-red-50 text-red-500 border border-red-200 opacity-90";
                    cursorClass = "cursor-not-allowed";
                  } else if (!slot.available && isStudent) {
                    bgClass = "bg-gray-100 text-gray-500 border border-gray-300 opacity-70";
                    cursorClass = "cursor-not-allowed";
                  } else if (!slot.available && !isStudent) {
                    bgClass = "bg-gray-100 text-gray-500 border border-gray-300 opacity-70";
                    cursorClass = "cursor-pointer"; // professor pode clicar
                  } else {
                    bgClass = "text-blue-600 hover:shadow-md hover:-translate-y-0.5 border border-blue-300";
                    cursorClass = "cursor-pointer";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleTimeSlotClick(slot)}
                      disabled={slot.booked || (!slot.available && isStudent)}
                      className={`py-3 px-2 rounded-lg text-sm font-medium transition-all duration-200 ${bgClass} ${cursorClass}`}
                    >
                      {slot.time}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-center gap-6 mt-6 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full" />
                  <span className="text-xs text-gray-500">Disponível</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span className="text-xs text-gray-500">Agendado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full" />
                  <span className="text-xs text-gray-500">Indisponível</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
