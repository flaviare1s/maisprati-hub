import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getTeamWithMembers } from '../../api.js/teams';
import { CustomLoader } from '../CustomLoader';
import { TeamInformation } from '../TeamInformation';

export const StudentDashboard = () => {
  const { user, userTeam, updateUserData } = useAuth();
  const [loading, setLoading] = useState(!userTeam);

  useEffect(() => {
    const loadUserTeam = async () => {
      if (user && user.hasGroup && !userTeam && user.teamId) {
        try {
          const teamWithDetails = await getTeamWithMembers(user.teamId);

          updateUserData({ userTeam: teamWithDetails });
        } catch (error) {
          console.error('Erro ao carregar time do usuário:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadUserTeam();
  }, [user, userTeam, updateUserData]);

  if (loading) {
    return <CustomLoader />;
  }

  return (
    <div className="w-full p-0 text-dark">
      <div className='flex justify-start items-center gap-2 mb-5'>
        <img className='w-10 h-10' src={user.avatar} alt="Avatar" />
        <h2 className="text-2xl font-bold">{user.codename}</h2>
      </div>

      <div className="rounded-lg shadow-md p-4 mb-6">
        <h3 className="text-lg font-semibold mb-3">Informações do Usuário</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm">Username:</p>
            <p className="font-semibold">{user.username}</p>
          </div>
          <div>
            <p className="text-sm">Email:</p>
            <p className="font-semibold">{user.email}</p>
          </div>
          <div>
            <p className="text-sm">Turma:</p>
            <p className="font-semibold">{user.turma}</p>
          </div>
          <div>
            <p className="text-sm">Grupo:</p>
            <p className="text-xl text-blue-logo">{userTeam?.name || '-'}</p>
          </div>
        </div>
      </div>

      {userTeam && (
        <div className="rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-3">
            Informações do <span className='font-semibold text-blue-logo'>{userTeam.name}</span>
          </h3>
          <TeamInformation userTeam={userTeam} />
        </div>
      )}
    </div>
  );
};
