import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { fetchAppointments } from "../../api.js/schedule";
import { fetchTeams } from "../../api.js/teams";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import toast from "react-hot-toast";
import { ConfirmationModal } from "../ConfirmationModal";
import { Pagination } from "../Pagination";

export const StudentMeetingsTab = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [confirmationModal, setConfirmationModal] = useState({ open: false, message: "", onConfirm: null });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(appointments.length / itemsPerPage);
  const currentAppointments = appointments
    .sort((a, b) => dayjs(a.date + " " + a.time) - dayjs(b.date + " " + b.time))
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


  useEffect(() => {
    const loadAppointments = async () => {
      try {
        let allAppointments = [];

        const individualAppointments = await fetchAppointments(user.id, "student");
        allAppointments.push(...individualAppointments);

        const teams = await fetchTeams();
        const userTeam = teams.find(team =>
          team.members && team.members.some(member => member.userId.toString() === user.id.toString())
        );

        if (userTeam) {
          const teamAppointments = await api.get(`/appointments?teamId=${userTeam.id}`);
          allAppointments.push(...teamAppointments.data);
        }

        const uniqueAppointments = allAppointments.filter((appt, index, self) =>
          index === self.findIndex(a => a.id === appt.id)
        );

        setAppointments(uniqueAppointments);
      } catch (error) {
        console.error("Erro ao carregar agendamentos", error);
      }
    };
    loadAppointments();
  }, [user]);

  const handleCancelAppointment = async (appointment) => {
    setConfirmationModal({
      open: true,
      message: `Tem certeza que deseja cancelar a reunião marcada para ${dayjs(appointment.date).format("DD/MM/YYYY")} às ${appointment.time}? O professor será notificado.`,
      onConfirm: async () => {
        try {
          await api.patch(`/appointments/${appointment.id}/cancel`);

          setAppointments(prev =>
            prev.map(a => a.id === appointment.id ? { ...a, status: "CANCELLED" } : a)
          );

          toast.success("Reunião cancelada com sucesso!");
        } catch (err) {
          console.error("Erro ao cancelar reunião:", err);
          toast.error("Erro ao cancelar reunião");
        } finally {
          setConfirmationModal({ open: false, message: "", onConfirm: null });
        }
      },
    });
  };

  return (
    <div className="w-full text-dark">
      <style>{`
        .meeting-text-black {
          color: #000000 !important;
          font-weight: 700 !important;
        }
        .dark .meeting-text-black {
          color: #ffffff !important;
        }
      `}</style>
      <h3 className="text-lg font-semibold mb-4">Minhas Reuniões</h3>

      {currentAppointments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhuma reunião encontrada</p>
          <p className="text-sm mt-2">Use o calendário para agendar uma reunião</p>
        </div>
      )}

      {currentAppointments.length > 0 && (
        <div className="grid gap-2">
          {currentAppointments.map((appt, idx) => {
            const status = appt.status || 'SCHEDULED';
            const isPast = dayjs(`${appt.date} ${appt.time}`).isBefore(dayjs());

            return (
              <div
                key={idx}
                className={`meeting-card p-3 rounded-lg text-sm border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 flex justify-between items-center hover:shadow-sm transition-shadow ${status === 'CANCELLED' ? 'opacity-60' : ''}`}
              >
                <div className="flex flex-col">
                  <span className="font-medium meeting-text-black">
                    {dayjs(appt.date).format("DD/MM/YY")} - {appt.time}
                  </span>
                  {appt.teamName ? (
                    <span className="text-xs text-blue-logo font-semibold">
                      {appt.teamName}
                    </span>
                  ) : (
                    <span className="text-xs text-blue-logo font-semibold">
                      {appt.studentName || 'Você'}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Badge dinâmica baseada no status */}
                  {(() => {
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
                        <span className="badge-expirado text-gray-700 dark:text-gray-300 font-semibold text-xs px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded-full">
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
                  {/* Botão cancelar se permitido */}
                  {status !== 'CANCELLED' && status !== 'COMPLETED' && !isPast && (
                    <button
                      onClick={() => handleCancelAppointment(appt)}
                      className="text-red-primary hover:text-red-secondary transition-colors text-[10px] font-bold cursor-pointer"
                      title="Cancelar reunião"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {appointments.length > 0 && totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            totalItems={appointments.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
            showCounts={true}
            className=""
          />
        </div>
      )}

      <ConfirmationModal
        open={confirmationModal.open}
        message={confirmationModal.message}
        onClose={() => setConfirmationModal({ open: false, message: "", onConfirm: null })}
        onConfirm={confirmationModal.onConfirm}
      />
    </div>
  );
};
