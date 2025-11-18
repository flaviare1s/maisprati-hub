import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../hooks/useAuth";
import { fetchTeams, getTeamWithMembers } from "../api/teams";
import { disableWantsGroup, resetGroupPreferences, fetchEmotionalStatuses, updateEmotionalStatus } from "../api/users";
import { CustomLoader } from "../components/CustomLoader";
import { TeamInformation } from "../components/TeamInformation";
import { MdManageAccounts, MdToggleOff } from "react-icons/md";
import { TeamManagmentModal } from "../components/student-dashboard/TeamManagmentModal";
import { Link } from "react-router-dom";
import toast from 'react-hot-toast';

export const StudentDashboardPage = () => {
  const { user, updateUser: updateUserContext } = useAuth();
  const [userTeam, setUserTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [changingPreference, setChangingPreference] = useState(false);
  const [emotionalStatuses, setEmotionalStatuses] = useState([]);
  const [selectedEmotionalStatus, setSelectedEmotionalStatus] = useState(null);
  const [savingStatus, setSavingStatus] = useState(false);

  // Memoiza o userId para evitar re-execuções desnecessárias
  const userId = useMemo(() => {
    if (!user) return null;

    if (user.id && typeof user.id === 'string') {
      return user.id;
    } else if (user._id && typeof user._id === 'string') {
      return user._id;
    } else if (user.id && typeof user.id === 'number') {
      return String(user.id);
    } else if (user._id && typeof user._id === 'number') {
      return String(user._id);
    }

    return null;
  }, [user]);

  useEffect(() => {
    const loadUserTeam = async () => {
      if (!user || !userId) {
        setLoading(false);
        return;
      }

      try {
        // Busca TODOS os times (não apenas ativos) para encontrar o time do usuário
        const teams = await fetchTeams();

        const userTeamData = teams.find((team) => {
          return team.members && team.members.some(
            (member) => {
              return member.userId === userId;
            }
          );
        });

        if (userTeamData) {
          const teamWithDetails = await getTeamWithMembers(userTeamData.id);
          setUserTeam(teamWithDetails);
        }
      } catch (error) {
        console.error("Erro ao carregar time do usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserTeam();
  }, [userId, user]); // Agora depende do userId estável e user

  // Carregar opções de estados emocionais
  useEffect(() => {
    const loadStatuses = async () => {
      try {
        const list = await fetchEmotionalStatuses();
        // API pode devolver objetos; normalizar para array de strings
        const normalized = list.map(item => (typeof item === 'string' ? item : item.name || item.code)).filter(Boolean);
        setEmotionalStatuses(normalized);
      } catch (err) {
        console.error('Erro ao carregar estados emocionais:', err);
      }
    };
    loadStatuses();
  }, []);

  // Sincronizar seleção com user quando user carregar
  useEffect(() => {
    if (user) {
      setSelectedEmotionalStatus(user.emotionalStatus || '');
    }
  }, [user]);

  const handleDisableWantsGroup = async () => {
    if (!user || !userId) return;

    setChangingPreference(true);
    try {
      const updatedUser = await disableWantsGroup(userId);
      updateUserContext(updatedUser);
      toast.success("Preferência alterada! Agora você está trabalhando individualmente.");
    } catch (error) {
      console.error("Erro ao alterar preferência:", error);
      toast.error("Erro ao alterar preferência. Tente novamente.");
    } finally {
      setChangingPreference(false);
    }
  };

  // Função para usuários que têm hasGroup = true
  const handleResetGroupPreferences = async () => {
    if (!user || !userId) return;

    setChangingPreference(true);
    try {
      const updatedUser = await resetGroupPreferences(userId);
      updateUserContext(updatedUser);
      toast.success("Preferência alterada! Agora você está trabalhando individualmente.");
    } catch (error) {
      console.error("Erro ao alterar preferência:", error);
      toast.error("Erro ao alterar preferência. Tente novamente.");
    } finally {
      setChangingPreference(false);
    }
  };

  const handleEmotionalStatusChange = async (e) => {
    const newStatus = e.target.value || null;
    setSelectedEmotionalStatus(newStatus || '');
    if (!user || !userId) return;

    setSavingStatus(true);
    try {
      const updatedUser = await updateEmotionalStatus(userId, newStatus);
      updateUserContext(updatedUser);
      toast.success('Estado emocional atualizado.');
    } catch (err) {
      console.error('Erro ao atualizar estado emocional:', err);
      toast.error('Erro ao atualizar estado emocional.');
    } finally {
      setSavingStatus(false);
    }
  };

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
    <div className="w-full p-0 text-dark" data-testid="student-dashboard-page">
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
            <p className="text-sm mb-1">Estado emocional (opcional):</p>
            <select
              value={selectedEmotionalStatus || ''}
              onChange={handleEmotionalStatusChange}
              disabled={savingStatus}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Nenhum</option>
              {emotionalStatuses.map((s) => (
                <option key={s} value={s}>{
                  // labels em português
                  (function () {
                    const map = {
                      CALM: 'Calmo',
                      HAPPY: 'Feliz',
                      ANXIOUS: 'Ansioso',
                      CONFUSED: 'Confuso',
                      LOST: 'Perdido',
                      ANGRY: 'Irritado',
                      SAD: 'Triste',
                      OVERWHELMED: 'Sobrecarregado',
                      FOCUSED: 'Focado'
                    };
                    return map[s] || (s.charAt(0).toUpperCase() + s.slice(1).toLowerCase());
                  })()
                }</option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-sm">Grupo:</p>
            <p className="text-lg font-semibold text-blue-logo">
              {userTeam?.name || (
                loading && user.hasGroup
                  ? "Verificando..."
                  : user.hasGroup
                    ? "Aguardando entrada"
                    : "Nenhum"
              )}
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
          <Link to="/common-room" className="text-blue-logo hover:underline text-center block mb-2">
            Acesse a Sala Comum para entrar no seu grupo.
          </Link>
          <div className="text-center pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-3">Mudou de ideia?</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-sm text-gray-600">
                Prefiro trabalhar individualmente
              </span>
              <button
                onClick={handleResetGroupPreferences}
                disabled={changingPreference}
                className="text-orange-logo hover:text-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                title="Clique para alterar para trabalho individual"
              >
                {changingPreference ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-logo"></div>
                ) : (
                  <MdToggleOff className="text-2xl" />
                )}
              </button>
            </div>
          </div>
        </div>
      ) : user.wantsGroup ? (
        <div className="rounded-lg shadow-md p-4">
          <p className="text-center text-gray-600 mb-4">
            Você ainda não faz parte de nenhum grupo.{" "}
            <Link to="/common-room" className="text-blue-logo hover:underline">
              Acesse a Sala Comum para encontrar e entrar em um grupo.
            </Link>
          </p>
          <div className="text-center pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-3">Mudou de ideia?</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-sm text-gray-600">
                Prefiro trabalhar individualmente
              </span>
              <button
                onClick={handleDisableWantsGroup}
                disabled={changingPreference}
                className="text-orange-logo hover:text-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                title="Clique para alterar para trabalho individual"
              >
                {changingPreference ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-logo"></div>
                ) : (
                  <MdToggleOff className="text-2xl" />
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg shadow-md p-4">
          <p className="text-center text-gray-700 dark:text-gray-300">
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
