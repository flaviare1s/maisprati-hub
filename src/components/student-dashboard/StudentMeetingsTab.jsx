import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { fetchAppointments } from "../../api.js/schedule";
import { fetchTeams } from "../../api.js/teams";
import { useAuth } from "../../hooks/useAuth";

export const StudentMeetingsTab = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        // Buscar todos os agendamentos do aluno logado
        const allAppointments = await fetchAppointments(user.id, "student");

        // Buscar times para encontrar membros do time do usuário
        const teams = await fetchTeams();
        const userTeam = teams.find(team =>
          team.members && team.members.some(member => member.userId.toString() === user.id.toString())
        );

        let memberIds = [user.id.toString()];
        if (userTeam) {
          memberIds = userTeam.members.map(member => member.userId.toString());
        }

        // Filtrar agendamentos: só mostrar os do aluno logado ou dos membros do time
        const filteredAppointments = allAppointments.filter(appt =>
          memberIds.includes(appt.studentId.toString())
        );
        setAppointments(filteredAppointments);
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
          .map((appt, idx) => (
            <div key={idx} className="p-2 rounded text-sm border flex justify-between items-center">
              <span>{dayjs(appt.date).format("DD/MM/YY")} - {appt.time}</span>
              <span className="text-red-primary text-xs font-medium">Agendado</span>
            </div>
          ))}
      </div>

      {/* Legenda - agora apenas informativa, já que o agendamento é feito pelo calendário */}
      <div className="flex items-center justify-center gap-6 mt-6 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 text-center">
          Para agendar novas reuniões, clique em um dia no calendário lateral
        </p>
      </div>
    </div>
  );
};
