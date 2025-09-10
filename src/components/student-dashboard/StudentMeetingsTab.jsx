import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { fetchAppointments } from "../../api.js/schedule";
import { fetchTeams } from "../../api.js/teams";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";

export const StudentMeetingsTab = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        let allAppointments = [];

        // 1. Buscar appointments individuais do usuário
        const individualAppointments = await fetchAppointments(user.id, "student");
        allAppointments.push(...individualAppointments);

        // 2. Buscar appointments do time (se faz parte de um)
        const teams = await fetchTeams();
        const userTeam = teams.find(team =>
          team.members && team.members.some(member => member.userId.toString() === user.id.toString())
        );

        if (userTeam) {
          try {
            // Tentar buscar appointments por teamId
            const teamAppointments = await api.get(`/appointments?teamId=${userTeam.id}`);
            allAppointments.push(...teamAppointments.data);
          } catch {
            // Fallback: buscar de todos os membros
            for (const member of userTeam.members) {
              if (member.userId.toString() !== user.id.toString()) {
                try {
                  const memberAppts = await fetchAppointments(member.userId, "student");
                  allAppointments.push(...memberAppts.filter(appt => appt.teamId === userTeam.id));
                } catch (err) {
                  console.warn("Erro ao buscar appointments do membro:", err);
                }
              }
            }
          }
        }

        // Remover duplicatas por ID
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

  return (
    <div className="w-full text-dark">
      <h3 className="text-lg font-semibold mb-4">Minhas Reuniões</h3>

      <div className="grid gap-2">
        {appointments
          .sort((a, b) => dayjs(a.date + " " + a.time) - dayjs(b.date + " " + b.time))
          .map((appt, idx) => {
            // Status do appointment
            const status = appt.status || 'SCHEDULED';
            const isPast = dayjs(`${appt.date} ${appt.time}`).isBefore(dayjs());

            let statusText = 'Agendado';
            let statusColor = 'text-green-600 bg-green-50';

            if (status === 'CANCELLED' || status === 'CANCELED') {
              statusText = 'Cancelado';
              statusColor = 'text-red-600 bg-red-50';
            } else if (status === 'COMPLETED') {
              statusText = 'Concluído';
              statusColor = 'text-blue-600 bg-blue-50';
            } else if (isPast && status !== 'COMPLETED') {
              statusText = 'Expirado';
              statusColor = 'text-gray-600 bg-gray-50';
            }

            return (
              <div
                key={idx}
                className={`p-3 rounded-lg text-sm border border-gray-200 bg-white flex justify-between items-center hover:shadow-sm transition-shadow ${status === 'CANCELLED' || status === 'CANCELED' ? 'opacity-60' : ''
                  }`}
              >
                <div className="flex flex-col">
                  <span className="font-medium text-dark">
                    {dayjs(appt.date).format("DD/MM/YY")} - {appt.time}
                  </span>
                  {appt.teamName && (
                    <span className="text-xs text-blue-logo font-semibold">
                      {appt.teamName}
                    </span>
                  )}
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor}`}>
                  {statusText}
                </span>
              </div>
            );
          })}
      </div>

      {appointments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhuma reunião encontrada</p>
          <p className="text-sm mt-2">Use o calendário para agendar uma reunião</p>
        </div>
      )}

      {/* Legenda - agora apenas informativa, já que o agendamento é feito pelo calendário */}
      <div className="flex items-center justify-center gap-6 mt-6 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 text-center">
          Para agendar novas reuniões, clique em um dia no calendário lateral
        </p>
      </div>
    </div>
  );
};
