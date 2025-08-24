import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { TeamCard } from './TeamCard';
import { TeamModal } from './TeamModal';

export const TeacherTeamsTab = ({ teams }) => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg text-dark font-semibold">Gerenciar Times</h3>
        <Link
          to="/teams/create"
          className="bg-blue-logo hover:bg-blue-600 text-light px-4 py-2 rounded-md flex items-center gap-2"
        >
          <FaPlus /> Criar Novo Time
        </Link>
      </div>

      <div className="grid gap-4 text-gray-muted">
        {teams.map(team => (
          <TeamCard key={team.id} team={team} onSelect={() => navigate(`/teams/${team.id}/board`)} />
        ))}
      </div>

      {selectedTeam && <TeamModal team={selectedTeam} onClose={() => setSelectedTeam(null)} />}
    </div>
  );
};
