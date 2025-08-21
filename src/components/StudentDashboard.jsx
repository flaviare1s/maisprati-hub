import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { fetchTeams, getTeamWithMembers } from '../api.js/teams';
import { CustomLoader } from './CustomLoader';
import { TeamInformation } from './TeamInformation';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [userTeam, setUserTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserTeam = async () => {
      if (user && user.hasGroup) {
        try {
          const teams = await fetchTeams();
          const team = teams.find(team =>
            team.members.some(member => member.userId.toString() === user.id.toString())
          );

          if (team) {
            const teamWithDetails = await getTeamWithMembers(team.id);
            setUserTeam(teamWithDetails);
          }
        } catch (error) {
          console.error('Erro ao carregar time do usuário:', error);
        }
      }
      setLoading(false);
    };

    loadUserTeam();
  }, [user]);

  if (loading) {
    return <CustomLoader />;
  }

  return (
    <div className="w-full p-0">
      <div className='flex justify-start items-center gap-2 mb-5'>
        <img className='w-10 h-10' src={user.avatar} alt="Avatar" />
        <h2 className="text-2xl font-bold">
          {user.codename}
        </h2>
      </div>

      <div className="rounded-lg shadow-md p-4 mb-6">
        <h3 className="text-lg font-semibold mb-3">
          Informações do Usuário
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm">Username:</p>
            <p className="font-medium">{user.username}</p>
          </div>
          <div>
            <p className="text-sm">Email:</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-sm">Turma:</p>
            <p className="font-medium">{user.turma}</p>
          </div>
          <div>
            <p className="text-sm">Grupo:</p>
            <p className="text-xl text-blue-logo">{userTeam?.name || '-'}</p>
          </div>
        </div>
      </div>

      {user.hasGroup ? (
        <div className="rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-3">
            Informações do <span className='font-semibold text-blue-logo'>{userTeam?.name || '-'}</span>
          </h3>

          {userTeam && (
            <TeamInformation userTeam={userTeam} />
          )}
        </div>
      ) : null}
    </div>
  );
};
