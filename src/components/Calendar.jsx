import { useState, useCallback, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AdminTimeSlotModal } from "./teacher-dashboard/AdminTimeSlotModal";
import { StudentTimeSlotModal } from "./student-dashboard/StudentTimeSlotModal";
import { useAuth } from "../hooks/useAuth";
import { fetchMonthSlots } from "../api.js/schedule";
import api from "../services/api";

dayjs.locale("pt-br");

export const Calendar = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [modalOpen, setModalOpen] = useState(false);
  const [monthSlots, setMonthSlots] = useState([]);

  const startOfMonth = currentMonth.startOf("month");
  const endOfMonth = currentMonth.endOf("month");
  const startOfWeek = startOfMonth.startOf("week");
  const endOfWeek = endOfMonth.endOf("week");
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const handlePrevMonth = useCallback(() => {
    setCurrentMonth((prev) => prev.subtract(1, "month"));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth((prev) => prev.add(1, "month"));
  }, []);

  const isAdmin = user?.type === "admin";

  const handleDateClick = useCallback(
    (date) => {
      if (date.isBefore(dayjs(), "day")) return;
      setSelectedDate(dayjs(date));
      setModalOpen(true);
    },
    [setSelectedDate, setModalOpen]
  );

  const loadMonthSlots = useCallback(async () => {
    if (!user?.id) return;

    try {
      const year = currentMonth.year();
      const month = currentMonth.month() + 1;

      let adminId = user.id;

      // Se é student, buscar o admin (professor)
      if (!isAdmin) {
        const usersRes = await api.get("/users");
        const admin = usersRes.data.find(u => u.type === 'admin');
        adminId = admin?.id || user.id;
      }

      const slots = await fetchMonthSlots(adminId, year, month);
      setMonthSlots(slots);
    } catch (error) {
      console.error("Erro ao carregar slots do mês:", error);
    }
  }, [currentMonth, user?.id, isAdmin]);

  const renderCalendarDays = () => {
    const days = [];
    let day = startOfWeek;

    while (day.isBefore(endOfWeek) || day.isSame(endOfWeek)) {
      const isCurrentMonth = day.isSame(currentMonth, "month");
      const isToday = day.isSame(dayjs(), "day");
      const isSelected = selectedDate && day.isSame(selectedDate, "day");
      const isPast = day.isBefore(dayjs(), "day");
      const currentDay = dayjs(day);

      const hasSlotsAvailable = monthSlots.some(slotDay => {
        const dayMatch = day.isSame(dayjs(slotDay.date), "day");
        const hasAvailableSlots = slotDay.slots.some(slot => slot.available && !slot.booked);
        return dayMatch && hasAvailableSlots;
      });

      days.push(
        <button
          key={currentDay.format("YYYY-MM-DD")}
          onClick={() => handleDateClick(currentDay)}
          disabled={isPast}
          className={`
            w-8 h-8 flex items-center justify-center text-sm rounded-lg transition-all duration-200
            ${!isCurrentMonth ? "text-gray-300" : ""}
            ${isToday ? "bg-blue-100 text-blue-600 font-semibold" : ""}
            ${isSelected && !isToday ? "bg-blue-logo text-white" : ""}
            ${isPast ? "text-gray-300 cursor-not-allowed" : "hover:bg-blue-50 cursor-pointer"}
            ${hasSlotsAvailable ? "text-blue-600 font-bold" : ""}
          `}
        >
          {currentDay.date()}
        </button>
      );
      day = day.add(1, "day");
    }

    return days;
  };

  useEffect(() => {
    loadMonthSlots();
  }, [loadMonthSlots]);

  const handleModalClose = () => {
    setModalOpen(false);
    loadMonthSlots();
  };

  return (
    <div className="calendar-container w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <ChevronLeft size={16} />
        </button>
        <h2 className="font-semibold text-dark dark:text-gray-100">
          {capitalize(currentMonth.format("MMMM"))} {currentMonth.format("YYYY")}
        </h2>
        <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
          <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>

      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
        Data selecionada: {selectedDate ? selectedDate.format("DD/MM/YYYY") : "Nenhuma"}
      </div>

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
