import { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import { Calendar } from "lucide-react";
import { fetchAppointments } from "../../api.js/schedule";
import api from "../../services/api";
import toast from "react-hot-toast";
import { ConfirmationModal } from "../ConfirmationModal";
import { Pagination } from "../Pagination";

export const TeacherMeetingsTab = ({ adminId }) => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('proximos');
  const [confirmationModal, setConfirmationModal] = useState({ open: false, message: "", onConfirm: null });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getFilteredAppointments = () => {
    const now = dayjs();

    const filtered = appointments.filter(appt => {
      const appointmentDateTime = dayjs(`${appt.date} ${appt.time}`);
      const isPast = appointmentDateTime.isBefore(now);
      const status = appt.status || 'SCHEDULED';

      switch (filter) {
        case 'proximos':
          return !isPast && status !== 'CANCELLED' && status !== 'CANCELED' && status !== 'COMPLETED';
        case 'cancelados':
          return status === 'CANCELLED' || status === 'CANCELED';
        case 'completados':
          return status === 'COMPLETED';
        case 'passados':
          return isPast && status !== 'COMPLETED';
        case 'todos':
          return true;
        default:
          return true;
      }
    });

    const uniqueAppointments = Object.values(
      filtered
        .sort((a, b) => {
          if (filter === 'passados') {
            return dayjs(b.date + " " + b.time) - dayjs(a.date + " " + a.time);
          }
          return dayjs(a.date + " " + a.time) - dayjs(b.date + " " + b.time);
        })
        .reduce((acc, appt) => {
          const key = `${appt.teamName || 'Sem time'}_${appt.date}_${appt.time}`;
          if (!acc[key]) acc[key] = appt;
          return acc;
        }, {})
    );

    return uniqueAppointments;
  };

  const filteredAppointments = getFilteredAppointments();
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const currentAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // Função para carregar appointments usando useCallback
  const loadAppointments = useCallback(async () => {
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
  }, [adminId]);

  // Effect para carregar appointments inicialmente
  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  // Effect para polling automático a cada meio segundo
  useEffect(() => {
    if (!adminId) return;

    const interval = setInterval(() => {
      loadAppointments();
    }, 500);

    // Cleanup do interval quando o componente for desmontado
    return () => clearInterval(interval);
  }, [adminId, loadAppointments]);

  const handleCancelAppointment = async (appointment) => {
    const studentName = appointment.studentName || 'estudante';
    const teamName = appointment.teamName && appointment.teamName !== 'Sem time' ? appointment.teamName : null;
    const displayName = teamName ? `time ${teamName}` : studentName;

    setConfirmationModal({
      open: true,
      message: `Tem certeza que deseja cancelar o agendamento de ${displayName} para ${dayjs(appointment.date).format("DD/MM/YYYY")} às ${appointment.time}?\n\nO estudante será notificado sobre o cancelamento.`,
      onConfirm: async () => {
        try {
          await api.patch(`/appointments/${appointment.id}/cancel`);

          const data = await fetchAppointments(adminId, "admin");
          setAppointments(data);

          toast.success(`Agendamento de ${displayName} cancelado! O estudante foi notificado.`);
        } catch (error) {
          toast.error("Erro ao cancelar agendamento");
          console.error("ERRO:", error);
        } finally {
          setConfirmationModal({ open: false, message: "", onConfirm: null });
        }
      },
    });
  };

  return (
    <div className="w-full">
      <h3 className="text-lg text-dark font-semibold mb-1">Gerenciar Reuniões</h3>
      <p className="text-gray-muted mb-6">
        Clique em um dia no calendário lateral para gerenciar os horários disponíveis para os alunos agendarem.
      </p>

      {/* Lista de Agendamentos */}
      <div className="mb-6">
        <style>{`
          .meeting-text-black {
            color: #000000 !important;
            font-weight: 700 !important;
          }
          .dark .meeting-text-black {
            color: #ffffff !important;
          }
        `}</style>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h4 className="text-sm sm:text-md font-medium text-dark">Agendamentos</h4>
            {filteredAppointments.length > 0 && (
              <span className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-logo font-bold dark:text-blue-300 px-2 py-1 rounded-full">
                {filteredAppointments.length}
              </span>
            )}
          </div>

          {/* Filtro Select */}
          <div className="flex items-center gap-2">
            <label className="text-xs md:text-sm text-gray-800 dark:text-gray-300 font-medium">Filtrar:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-logo focus:border-blue-logo outline-none transition-all text-gray-800 dark:text-gray-100"
            >
              <option value="proximos">Próximos</option>
              <option value="todos">Todos</option>
              <option value="cancelados">Cancelados</option>
              <option value="completados">Concluídos</option>
              <option value="passados">Passados</option>
            </select>
          </div>
        </div>
        <div className="grid gap-2">
          {currentAppointments.length > 0 ? (
            currentAppointments.map((appt, idx) => (
              <div
                key={idx}
                className="meeting-card p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 flex justify-between items-center hover:shadow-sm transition-shadow"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-sm meeting-text-black">
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
                        <span className="text-red-700 dark:text-red-300 font-semibold text-xs px-2 py-1 bg-red-50 dark:bg-red-900/30 rounded-full">
                          Cancelado
                        </span>
                      );
                    }

                    if (status === 'COMPLETED') {
                      return (
                        <span className="text-blue-700 dark:text-blue-300 font-semibold text-xs px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-full">
                          Concluído
                        </span>
                      );
                    }

                    if (isPast && status !== 'COMPLETED') {
                      return (
                        <span className="text-gray-700 dark:text-gray-300 font-semibold text-xs px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded-full badge-expirado">
                          Expirado
                        </span>
                      );
                    }

                    return (
                      <span className="text-green-700 dark:text-green-300 font-semibold text-xs px-2 py-1 bg-green-50 dark:bg-green-900/30 rounded-full">
                        Agendado
                      </span>
                    );
                  })()}

                  {/* Botão para cancelar apenas se não estiver cancelado/completado e não for passado */}
                  {(() => {
                    const status = appt.status || 'SCHEDULED';
                    const isPast = dayjs(`${appt.date} ${appt.time}`).isBefore(dayjs());

                    // Só permite cancelar se: não está cancelado, não está completo e não passou
                    const canCancel = status !== 'CANCELLED' &&
                      status !== 'CANCELED' &&
                      status !== 'COMPLETED' &&
                      !isPast;

                    return canCancel ? (
                      <button
                        onClick={() => handleCancelAppointment(appt)}
                        className="text-red-primary hover:text-red-secondary transition-colors text-[10px] font-bold cursor-pointer"
                        title="Cancelar agendamento"
                      >
                        Cancelar
                      </button>
                    ) : null;
                  })()}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-muted">
              <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-2" />
              <p>Nenhum agendamento encontrado para o filtro "{filter === 'proximos' ? 'próximos' : filter === 'todos' ? 'todos' : filter === 'cancelados' ? 'cancelados' : filter === 'completados' ? 'concluídos' : 'passados'}"</p>
            </div>
          )}
        </div>

        {/* Componente de Paginação */}
        {filteredAppointments.length > 0 && totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <Pagination
              totalItems={filteredAppointments.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={(page) => setCurrentPage(page)}
              showCounts={true}
              className=""
            />
          </div>
        )}
      </div>

      {/* Legenda */}
      <div className="flex items-center justify-center gap-6 mt-6 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-logo rounded-full" />
          <span className="text-[9px] sm:text-xs text-gray-800 dark:text-gray-300">Disponível</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-primary rounded-full" />
          <span className="text-[9px] sm:text-xs text-gray-800 dark:text-gray-300">Agendado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-400 rounded-full" />
          <span className="text-[9px] sm:text-xs text-gray-800 dark:text-gray-300">Indisponível</span>
        </div>
      </div>

      <ConfirmationModal
        open={confirmationModal.open}
        message={confirmationModal.message}
        onClose={() => setConfirmationModal({ open: false, message: "", onConfirm: null })}
        onConfirm={confirmationModal.onConfirm}
      />
    </div>
  );
};
