import { useState, useEffect } from 'react';
import { FaTimes, FaUserFriends } from 'react-icons/fa';
import { fetchTeamById } from '../../api.js/teams';
import { CustomLoader } from '../CustomLoader';

export const TeamMembersModal = ({ team, onClose }) => {
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const fullTeamData = await fetchTeamById(team.id);
        setTeamData(fullTeamData);
      } catch (err) {
        console.error('Erro ao carregar dados da equipe:', err);
        setError('Erro ao carregar membros da equipe');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [team]);

  const getMemberName = (member) => {
    if (member?.user?.name) return member.user.name;
    return 'Membro sem nome';
  };

  const getRoleName = (role) => {
    if (!role) return 'Membro';

    switch (role.toLowerCase()) {
      case 'leader':
        return 'Líder';
      case 'subleader':
        return 'Sub-líder';
      default:
        return 'Membro';
    }
  };

  const getRoleOrder = (role) => {
    if (!role) return 3;

    switch (role.toLowerCase()) {
      case 'leader':
        return 1;
      case 'subleader':
        return 2;
      default:
        return 3;
    }
  };

  const getSortedMembers = (members) => {
    if (!members) return [];

    return [...members].sort((a, b) => {
      const orderA = getRoleOrder(a.role);
      const orderB = getRoleOrder(b.role);

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      // Se mesmo role, ordena por nome
      const nameA = getMemberName(a);
      const nameB = getMemberName(b);
      return nameA.localeCompare(nameB);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#000000ac]"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-md w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <FaUserFriends className="text-blue-logo text-lg" />
            <h3 className="text-lg font-semibold">{team.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
          >
            <FaTimes size={16} />
          </button>
        </div>

        <div className="p-4">
          {loading ? (
            <CustomLoader />
          ) : error ? (
            <div className="text-center py-4">
              <p className="text-red-500">{error}</p>
            </div>
          ) : teamData?.members && teamData.members.length > 0 ? (
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-3">
                {teamData.members.length} membro(s) encontrado(s)
              </p>

              <div className="space-y-2">
                {getSortedMembers(teamData.members).map((member, index) => (
                  <div
                    key={member.id || member.userId || index}
                    className="flex items-center justify-between p-2"
                  >
                    <div>
                      <p className="text-sm sm:text-base font-medium text-gray-800">
                        {getMemberName(member)}
                      </p>
                    </div>
                    <div>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${member.role?.toLowerCase() === "leader"
                        ? "bg-purple-100 text-purple-800"
                        : member.role?.toLowerCase() === "subleader"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                        }`}>
                        {getRoleName(member.role)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600">Nenhum membro encontrado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
