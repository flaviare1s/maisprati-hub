import { useState, useCallback } from "react";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AdminTimeSlotModal } from "./teacher-dashboard/AdminTimeSlotModal";
import { StudentTimeSlotModal } from "./student-dashboard/StudentTimeSlotModal";
import { useAuth } from "../hooks/useAuth";

export const Calendar = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(null); // Iniciar como null
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [modalOpen, setModalOpen] = useState(false);

  const startOfMonth = currentMonth.startOf("month");
  const endOfMonth = currentMonth.endOf("month");
  const startOfWeek = startOfMonth.startOf("week");
  const endOfWeek = endOfMonth.endOf("week");

  const handlePrevMonth = useCallback(() => {
    setCurrentMonth((prev) => prev.subtract(1, "month"));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth((prev) => prev.add(1, "month"));
  }, []);

  const isAdmin = user?.type === "admin";

  const handleDateClick = useCallback(
    (date) => {
      // Só permite datas futuras ou hoje
      if (date.isBefore(dayjs(), "day")) {
        return;
      }


      // Forçar atualização da data
      setSelectedDate(dayjs(date)); // Criar novo objeto dayjs
      setModalOpen(true);


    },
    [setSelectedDate, setModalOpen]
  );

  const renderCalendarDays = () => {
    const days = [];
    let day = startOfWeek;

    while (day.isBefore(endOfWeek) || day.isSame(endOfWeek)) {
      const isCurrentMonth = day.isSame(currentMonth, "month");
      const isToday = day.isSame(dayjs(), "day");
      const isSelected = selectedDate && day.isSame(selectedDate, "day");
      const isPast = day.isBefore(dayjs(), 'day');

      const currentDay = dayjs(day); // Criar cópia para não ter referência compartilhada

      days.push(
        <button
          key={currentDay.format("YYYY-MM-DD")}
          onClick={() => {
            handleDateClick(currentDay);
          }}
          disabled={isPast}
          className={`
            w-8 h-8 flex items-center justify-center text-sm rounded-lg transition-all duration-200
            ${!isCurrentMonth ? "text-gray-300" : ""}
            ${isToday ? "bg-blue-100 text-blue-600 font-semibold" : ""}
            ${isSelected && !isToday ? "bg-blue-500 text-white" : ""}
            ${isPast ? "text-gray-300 cursor-not-allowed" : "hover:bg-blue-50 cursor-pointer"}
            ${!isToday && !isSelected && isCurrentMonth && !isPast ? "text-gray-700" : ""}
          `}
        >
          {currentDay.date()}
        </button>
      );
      day = day.add(1, "day");
    }

    return days;
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4">
      {/* Header do Calendário */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <h2 className="text-lg font-semibold text-gray-800">
          {currentMonth.format("MMMM YYYY")}
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Dias da Semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
          <div
            key={day}
            className="h-8 flex items-center justify-center text-xs font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Dias do Calendário */}
      <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>

      {/* Debug */}
      <div className="mt-2 text-xs text-gray-500 text-center">
        Data selecionada:{" "}
        {selectedDate ? selectedDate.format("DD/MM/YYYY") : "Nenhuma"}
      </div>

      {/* Modais - só renderiza se selectedDate existir */}
      {modalOpen && selectedDate && (
        <>
          {isAdmin ? (
            <AdminTimeSlotModal
              open={modalOpen}
              onClose={handleModalClose}
              selectedDate={selectedDate}
              adminId={user?.id}
            />
          ) : (
            <StudentTimeSlotModal
              open={modalOpen}
              onClose={handleModalClose}
              selectedDate={selectedDate}
              studentId={user?.id}
            />
          )}
        </>
      )}

      {/* Legenda */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          {isAdmin
            ? "Clique em uma data para gerenciar horários"
            : "Clique em uma data para agendar"}
        </p>
      </div>
    </div>
  );
};
