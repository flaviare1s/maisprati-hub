import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Calendar } from "lucide-react";
import { fetchAppointments } from "../../api.js/schedule";
import api from "../../services/api";
import toast from "react-hot-toast";

export const TeacherMeetingsTab = ({ adminId }) => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('proximos'); // 'proximos', 'todos', 'cancelados', 'completados', 'passados'

  useEffect(() => {
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

    loadAppointments();
  }, [adminId]);

  const handleCancelAppointment = async (appointment) => {
    // Mostrar confirmação antes de cancelar
    const studentName = appointment.studentName || 'estudante';
    const teamName = appointment.teamName && appointment.teamName !== 'Sem time' ? appointment.teamName : null;
    const displayName = teamName ? `time ${teamName}` : studentName;

    const confirmMessage = `Tem certeza que deseja cancelar o agendamento de ${displayName} para ${dayjs(appointment.date).format("DD/MM/YYYY")} às ${appointment.time}?\n\nO estudante será notificado sobre o cancelamento.`;

    if (!window.confirm(confirmMessage)) {
      return; // Usuário cancelou a ação
    }

    try {
      await api.patch(`/appointments/${appointment.id}/cancel`);

      // Recarregar lista de agendamentos
      const data = await fetchAppointments(adminId, "admin");
      setAppointments(data);

      toast.success(`Agendamento de ${displayName} cancelado! O estudante foi notificado.`);

    } catch (error) {
      toast.error("Erro ao cancelar agendamento");
      console.error("ERRO:", error);
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-lg text-dark font-semibold mb-1">Gerenciar Reuniões</h3>
      <p className="text-gray-muted mb-6">
        Clique em um dia no calendário lateral para gerenciar os horários disponíveis para os alunos agendarem.
      </p>

      {/* Lista de Agendamentos */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm sm:text-md font-medium text-dark">Agendamentos</h4>

          {/* Filtro Select */}
          <div className="flex items-center gap-2">
            <label className="text-xs md:text-sm text-gray-600 font-medium">Filtrar:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-logo focus:border-blue-logo outline-none transition-all"
            >
              <option value="proximos">Próximos</option>
              <option value="todos">Todos</option>
              <option value="cancelados">Cancelados</option>
              <option value="completados">Concluídos</option>
              <option value="passados">Passados</option>
            </select>
          </div>
        </div>
        <div className="grid gap-2 max-h-60 overflow-y-auto">
          {appointments.length > 0 ? (
            // Filtrar e agrupar appointments
            Object.values(
              appointments
                .filter(appt => {
                  const now = dayjs();
                  const appointmentDateTime = dayjs(`${appt.date} ${appt.time}`);
                  const isPast = appointmentDateTime.isBefore(now);
                  const status = appt.status || 'SCHEDULED';

                  switch (filter) {
                    case 'proximos':
                      // Apenas futuros não cancelados/completados
                      return !isPast && status !== 'CANCELLED' && status !== 'CANCELED' && status !== 'COMPLETED';

                    case 'cancelados':
                      // Apenas cancelados
                      return status === 'CANCELLED' || status === 'CANCELED';

                    case 'completados':
                      // Apenas completados
                      return status === 'COMPLETED';

                    case 'passados':
                      // Apenas passados (não completados)
                      return isPast && status !== 'COMPLETED';

                    case 'todos':
                      // Todos os agendamentos
                      return true;

                    default:
                      return true;
                  }
                })
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
                <div className="flex items-center gap-2">
                  {/* Badge dinâmica baseada no status */}
                  {(() => {
                    const status = appt.status || 'SCHEDULED';
                    const isPast = dayjs(`${appt.date} ${appt.time}`).isBefore(dayjs());

                    if (status === 'CANCELLED' || status === 'CANCELED') {
                      return (
                        <span className="text-red-700 font-semibold text-xs px-2 py-1 bg-red-50 rounded-full">
                          Cancelado
                        </span>
                      );
                    }

                    if (status === 'COMPLETED') {
                      return (
                        <span className="text-blue-700 font-semibold text-xs px-2 py-1 bg-blue-50 rounded-full">
                          Concluído
                        </span>
                      );
                    }

                    if (isPast && status !== 'COMPLETED') {
                      return (
                        <span className="text-gray-700 font-semibold text-xs px-2 py-1 bg-gray-50 rounded-full">
                          Expirado
                        </span>
                      );
                    }

                    return (
                      <span className="text-green-700 font-semibold text-xs px-2 py-1 bg-green-50 rounded-full">
                        Agendado
                      </span>
                    );
                  })()}

                  {/* Botão para cancelar apenas se não estiver cancelado/completado */}
                  {appt.status !== 'CANCELLED' && appt.status !== 'CANCELED' && appt.status !== 'COMPLETED' && (
                    <button
                      onClick={() => handleCancelAppointment(appt)}
                      className="text-red-primary hover:text-red-secondary transition-colors text-[10px] font-bold cursor-pointer"
                      title="Cancelar agendamento"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-muted">
              <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-2" />
              <p>Nenhum agendamento encontrado</p>
            </div>
          )}
        </div>
      </div>

      {/* Legenda */}
      <div className="flex items-center justify-center gap-6 mt-6 p-3 bg-light rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-logo rounded-full" />
          <span className="text-[9px] sm:text-xs text-gray-muted">Disponível</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-primary rounded-full" />
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
