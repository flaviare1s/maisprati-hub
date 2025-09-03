import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { fetchActiveTeams, getTeamWithMembers, checkUserTeamStatus } from "../api.js/teams";
import { CustomLoader } from "../components/CustomLoader";
import { TeamInformation } from "../components/TeamInformation";
import { MdManageAccounts } from "react-icons/md";
import { TeamManagmentModal } from "../components/student-dashboard/TeamManagmentModal";
import { Link } from "react-router-dom";

export const StudentDashboardPage = () => {
  const { user, loadUserData } = useAuth();
  const [userTeam, setUserTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  useEffect(() => {
    const loadUserTeam = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Primeiro, recarrega os dados atualizados do usuário
        const updatedUser = await loadUserData();
        const currentUser = updatedUser || user;

        // Verifica se o usuário está em algum time ativo
        const teamStatus = await checkUserTeamStatus(currentUser.id);

        if (teamStatus.isInActiveTeam) {
          // Se está em um time, busca todos os times ativos para encontrar o dele
          const teams = await fetchActiveTeams();
          const userTeamData = teams.find((team) =>
            team.members && team.members.some(
              (member) => member.userId === currentUser.id
            )
          );

          if (userTeamData) {
            const teamWithDetails = await getTeamWithMembers(userTeamData.id);
            setUserTeam(teamWithDetails);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar time do usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserTeam();
  }, [user, loadUserData]);

  if (loading) {
    return <CustomLoader />;
  }

  if (!user) {
    return (
      <div className="w-full p-4">
        <p>Erro ao carregar dados do usuário</p>
      </div>
    );
  }

  return (
    <div className="w-full p-0 text-dark">
      <div className="flex justify-start items-center gap-2 mb-5">
        {user.avatar && (
          <img className="w-10 h-10 rounded-full object-cover" src={user.avatar} alt="Avatar" />
        )}
        <h2 className="text-2xl font-bold">{user.codename || user.name}</h2>
      </div>

      <div className="rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold mb-3">Informações do Usuário:</h3>
          <Link to="/edit-profile">
            <MdManageAccounts className="text-orange-logo text-3xl hover:text-orange-500 cursor-pointer" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm">Nome:</p>
            <p className="font-semibold">{user.name}</p>
          </div>
          <div>
            <p className="text-sm">E-mail:</p>
            <p className="font-semibold">{user.email}</p>
          </div>
          {user.groupClass && (
            <div>
              <p className="font-semibold">{user.groupClass}</p>
            </div>
          )}
          <div>
            <p className="text-sm">Grupo:</p>
            <p className="text-lg font-semibold text-blue-logo">
              {userTeam?.name || (user.hasGroup ? "Carregando..." : "Nenhum")}
            </p>
          </div>
        </div>
      </div>

      {userTeam ? (
        <div className="rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Grupo{" "}
              <span className="font-semibold text-blue-logo">
                {userTeam.name}
              </span>
            </h3>
            <button onClick={() => setIsTeamModalOpen(true)} className="cursor-pointer">
              <MdManageAccounts className="text-orange-logo text-3xl hover:text-orange-500" />
            </button>
          </div>

          <TeamInformation userTeam={userTeam} setUserTeam={setUserTeam} />
        </div>
      ) : user.hasGroup ? (
        <div className="rounded-lg shadow-md p-4">
          <p className="text-center text-gray-600">
            Você indicou que possui grupo, mas ainda não foi encontrado nenhum time ativo.
          </p>
        </div>
      ) : user.wantsGroup ? (
        <div className="rounded-lg shadow-md p-4">
          <p className="text-center text-gray-600">
            Você ainda não faz parte de nenhum grupo.{" "}
            <Link to="/common-room" className="text-blue-logo hover:underline">
              Acesse a Sala Comum para encontrar ou criar um grupo.
            </Link>
          </p>
        </div>
      ) : (
        <div className="rounded-lg shadow-md p-4">
          <p className="text-center text-gray-600">
            Você optou por trabalhar individualmente.
          </p>
        </div>
      )}

      {isTeamModalOpen && userTeam && (
        <TeamManagmentModal
          team={userTeam}
          onClose={() => setIsTeamModalOpen(false)}
          setUserTeam={setUserTeam}
        />
      )}
    </div>
  );
};
