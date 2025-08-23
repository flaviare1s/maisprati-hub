import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { fetchTeams, getTeamWithMembers } from "../api.js/teams";
import { CustomLoader } from "../components/CustomLoader";
import { TeamInformation } from "../components/TeamInformation";
import { MdManageAccounts } from "react-icons/md";
import { TeamManagmentModal } from "../components/student-dashboard/TeamManagmentModal";

export const StudentDashboardPage = () => {
  const { user } = useAuth();
  const [userTeam, setUserTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  useEffect(() => {
    const loadUserTeam = async () => {
      if (user && user.hasGroup) {
        try {
          const teams = await fetchTeams();
          const team = teams.find((team) =>
            team.members.some(
              (member) => member.userId.toString() === user.id.toString()
            )
          );

          if (team) {
            const teamWithDetails = await getTeamWithMembers(team.id);
            setUserTeam(teamWithDetails);
          }
        } catch (error) {
          console.error("Erro ao carregar time do usuário:", error);
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
    <div className="w-full p-0 text-dark">
      <div className="flex justify-start items-center gap-2 mb-5">
        <img className="w-10 h-10" src={user.avatar} alt="Avatar" />
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
            <p className="text-xl text-blue-logo">{userTeam?.name || "-"}</p>
          </div>
        </div>
      </div>

      {userTeam ? (
        <div className="rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Grupo {" "}
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
      ) : null}

      {isTeamModalOpen && (
        <TeamManagmentModal
          team={userTeam}
          onClose={() => setIsTeamModalOpen(false)}
          setUserTeam={setUserTeam}
        />
      )}
    </div>
  );
};
