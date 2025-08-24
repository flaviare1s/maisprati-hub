import { Link, useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { TeamCard } from './TeamCard';

export const TeacherTeamsTab = ({ teams, onTeamUpdate }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg text-dark font-semibold">Gerenciar Times</h3>
        <Link
          to="/teams/create"
          className="bg-blue-logo hover:bg-blue-600 text-light px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
        >
          <FaPlus /> Criar Novo Time
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-muted">
        {teams.map(team => (
          <TeamCard
            key={team.id}
            team={team}
            onSelect={() => navigate(`/teams/${team.id}/board`)}
            onUpdate={onTeamUpdate}
          />
        ))}
      </div>

      {teams.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhum time encontrado.</p>
          <p className="text-sm mt-2">Clique em "Criar Novo Time" para começar.</p>
        </div>
      )}
    </div>
  );
};
