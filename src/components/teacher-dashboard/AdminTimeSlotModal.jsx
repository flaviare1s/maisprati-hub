import { useState, useEffect } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { fetchTimeSlots, createTimeSlots } from "../../api.js/schedule";

const generateDaySlots = (existingSlots = [], interval = 30, selectedDate) => {
  const startHour = 6;
  const endHour = 23;
  const slots = [];
  const now = dayjs();
  const isToday = selectedDate && selectedDate.isSame(now, 'day');

  for (let hour = startHour; hour <= endHour; hour++) {
    for (let min = 0; min < 60; min += interval) {
      if (hour === endHour && min > 0) continue;
      const time = `${hour.toString().padStart(2, "0")}:${min
        .toString()
        .padStart(2, "0")}`;

      // Verificar se o horário já passou (apenas para hoje)
      const isPastTime = isToday && now.isAfter(selectedDate.hour(hour).minute(min));

      const existing = existingSlots.find((s) => s.time === time);
      const slot = existing || { time, available: false, booked: false };

      // Se já passou, marcar como indisponível e não clicável
      if (isPastTime) {
        slot.available = false;
        slot.isPast = true;
      }

      slots.push(slot);
    }
  }

  return slots;
};

export const AdminTimeSlotModal = ({ open, onClose, selectedDate, adminId }) => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregar slots do dia
  useEffect(() => {
    if (!open || !selectedDate) return;

    const loadSlots = async () => {
      setLoading(true);
      try {
        const currentAdminId = adminId || JSON.parse(localStorage.getItem("user"))?.id;
        const dateString = selectedDate.format("YYYY-MM-DD");

        const existingSlots = await fetchTimeSlots(currentAdminId, dateString);

        setTimeSlots(generateDaySlots(existingSlots, 30, selectedDate));
      } catch (error) {
        toast.error("Erro ao carregar horários");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadSlots();
  }, [open, selectedDate, adminId]);

  const handleTimeSlotClick = async (slot) => {
    // Não permitir clicar em slots agendados ou horários passados
    if (slot.booked || slot.isPast) return;

    const newAvailability = !slot.available;

    try {
      const currentAdminId = adminId || JSON.parse(localStorage.getItem("user"))?.id;
      const dateString = selectedDate.format("YYYY-MM-DD");

      // Buscar slots existentes do banco para este dia específico
      const existingSlots = await fetchTimeSlots(currentAdminId, dateString);

      let updatedSlots;
      const slotExists = existingSlots.some(s => s.time === slot.time);

      if (slotExists) {
        if (newAvailability) {
          // Tornando disponível - atualizar slot existente
          updatedSlots = existingSlots.map(s =>
            s.time === slot.time ? { ...s, available: true } : s
          );
        } else {
          // Removendo disponibilidade - remover do array
          updatedSlots = existingSlots.filter(s => s.time !== slot.time || s.booked === true);
        }
      } else {
        // Adicionar novo slot (sempre disponível quando adicionado)
        updatedSlots = [...existingSlots, { time: slot.time, available: true, booked: false }];
      }

      // Salvar apenas slots que são disponíveis ou agendados
      await createTimeSlots(currentAdminId, dateString, updatedSlots);

      // Atualizar interface local
      setTimeSlots(prev =>
        prev.map(s => (s.time === slot.time ? { ...s, available: newAvailability } : s))
      );

      toast.success(newAvailability ? 'Horário disponibilizado!' : 'Horário removido!');

    } catch (error) {
      toast.error("Erro ao atualizar/criar slot");
      console.error("ERRO:", error);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[80vh] border overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-dark">
            Gerenciar Horários - {selectedDate?.format("DD/MM/YYYY")}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-center text-gray-500 text-sm mb-6">
            {loading
              ? "Carregando horários..."
              : `Clique nos horários para disponibilizar/remover para ${selectedDate.format(
                "DD/MM/YYYY"
              )}`}
          </p>

          {!loading && (
            <div className="grid grid-cols-3 gap-3 max-h-80 overflow-y-auto">
              {timeSlots.map((slot, idx) => {
                let bgClass = "";
                let cursorClass = "cursor-pointer";

                if (slot.booked) {
                  bgClass = "bg-red-50 text-red-500 border border-red-200 opacity-90";
                  cursorClass = "cursor-not-allowed";
                } else if (slot.isPast) {
                  bgClass = "bg-gray-50 text-gray-400 border border-gray-200 opacity-50";
                  cursorClass = "cursor-not-allowed";
                } else if (!slot.available) {
                  bgClass = "bg-gray-100 text-gray-500 border border-gray-300 hover:bg-gray-200";
                } else {
                  bgClass =
                    "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:shadow-md hover:-translate-y-0.5 border border-blue-300";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleTimeSlotClick(slot)}
                    disabled={slot.booked || slot.isPast}
                    className={`py-3 px-2 rounded-lg text-sm font-medium transition-all duration-200 ${bgClass} ${cursorClass}`}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
          )}

          {/* Legenda */}
          <div className="flex items-center justify-center gap-4 mt-6 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span className="text-xs text-gray-600">Disponível</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
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
