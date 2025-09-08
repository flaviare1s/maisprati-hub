import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Calendar } from "lucide-react";
import { fetchAppointments } from "../../api.js/schedule";
import { TimeSlotModal } from "../TimeSlotModal";

export const TeacherMeetingsTab = ({ adminId }) => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [appointments, setAppointments] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const loadAppointments = async () => {
    try {
      if (!adminId) {
        console.error("AdminId não fornecido!");
        return;
      }

      const data = await fetchAppointments(adminId, "admin");
      setAppointments(data);
    } catch (error) {
      console.error("Erro ao carregar agendamentos", error);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [adminId]);

  const handleDateChange = (e) => {
    const newDate = dayjs(e.target.value);
    setSelectedDate(newDate);
  };

  // Função para obter a data mínima (hoje)
  const getMinDate = () => {
    return dayjs().format("YYYY-MM-DD");
  };

  // Função para obter a data máxima (3 meses à frente)
  const getMaxDate = () => {
    return dayjs().add(3, "months").format("YYYY-MM-DD");
  };

  return (
    <div className="w-full">
      <h3 className="text-lg text-dark font-semibold mb-1">Gerenciar Reuniões</h3>
      <p className="text-gray-muted mb-3">
        Selecione uma data e configure os horários disponíveis para os alunos agendarem.
      </p>

      {/* Seletor de Data */}
      <div className="mb-4 space-y-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="date-picker" className="text-sm font-medium text-dark">
            Selecione a data:
          </label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <input
                id="date-picker"
                type="date"
                value={selectedDate.format("YYYY-MM-DD")}
                onChange={handleDateChange}
                min={getMinDate()}
                max={getMaxDate()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            <span className="text-xs text-gray-muted">
              {selectedDate.format("ddd, DD/MM")}
            </span>
          </div>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-logo text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors cursor-pointer flex items-center gap-1 m-auto sm:m-0"
        >
          <Calendar size={16} />
          Horários - {selectedDate.format("DD/MM/YYYY")}
        </button>
      </div>

      {/* Lista de Agendamentos */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-dark mb-3">Próximos Agendamentos</h4>
        <div className="grid gap-2 max-h-60 overflow-y-auto">
          {appointments.length > 0 ? (
            // Agrupar por time e horário
            Object.values(
              appointments
                .filter(appt => dayjs(appt.date).isAfter(dayjs(), 'day') || dayjs(appt.date).isSame(dayjs(), 'day'))
                .sort((a, b) => dayjs(a.date + " " + a.time) - dayjs(b.date + " " + b.time))
                .reduce((acc, appt) => {
                  // Chave: time + data + hora
                  const key = `${appt.teamName || 'Sem time'}_${appt.date}_${appt.time}`;
                  if (!acc[key]) acc[key] = appt;
                  return acc;
                }, {})
            ).map((appt, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-gray-200 bg-white flex justify-between items-center hover:shadow-sm transition-shadow"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-dark text-sm">
                    {dayjs(appt.date).format("DD/MM/YY")} - {appt.time}
                  </span>
                  {appt.teamName && appt.teamName !== 'Sem time' ? (
                    <span className="text-xs text-blue-logo font-semibold">
                      {appt.teamName}
                    </span>
                  ) : (
                    <span className="text-xs text-blue-logo font-semibold">
                      {appt.studentName} (solo)
                    </span>
                  )}
                </div>
                <span className="text-green-700 font-semibold text-xs px-2 py-1 bg-green-50 rounded-full">
                  Agendado
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-2" />
              <p>Nenhum agendamento encontrado</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Horários */}
      {modalOpen && (
        <TimeSlotModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          selectedDate={selectedDate}
          adminId={adminId}
          studentId={null}
        />
      )}

      {/* Legenda */}
      <div className="flex items-center justify-center gap-6 mt-6 p-3 bg-light rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-logo rounded-full" />
          <span className="text-[9px] sm:text-xs text-gray-muted">Disponível</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <span className="text-[9px] sm:text-xs text-gray-muted">Agendado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-400 rounded-full" />
          <span className="text-[9px] sm:text-xs text-gray-muted">Indisponível</span>
        </div>
      </div>
    </div>
  );
};
