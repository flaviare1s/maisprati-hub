/* eslint-disable no-unused-vars */
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Calendar } from "../components/Calendar";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from 'react';
import { TbLayoutKanban } from 'react-icons/tb';
import { FaRegCalendarAlt, FaRegUser, FaBell } from 'react-icons/fa';
import { DashboardTab } from '../components/DashboardTab';
import { fetchActiveTeams, isUserInActiveTeam } from '../api.js/teams';
import { isAdmin } from '../utils/permissions';

export const DashboardLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [activeTeams, setActiveTeams] = useState([]);
  const [userInTeam, setUserInTeam] = useState(false);
  const [userInActiveTeam, setUserInActiveTeam] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(true);

  // Função para converter pathname em nome da aba
  const getTabNameFromPath = (pathname) => {
    if (pathname.includes('/profile')) return 'perfil';
    if (pathname.includes('/project')) return 'projeto';
    if (pathname.includes('/meetings')) return 'reuniões';
    if (pathname.includes('/notifications')) return 'notificações';
    if (pathname.includes('/admin')) return 'perfil'; // admin usa perfil como padrão
    return 'perfil';
  };

  // Estado sempre sincronizado com a URL atual
  const [activeTab, setActiveTab] = useState(() => getTabNameFromPath(location.pathname));

  // Atualizar tab quando URL mudar
  useEffect(() => {
    const newTab = getTabNameFromPath(location.pathname);
    setActiveTab(newTab);
  }, [location.pathname]);

  useEffect(() => {
    if (!user || isAdmin(user)) {
      setLoadingTeams(false);
      return;
    }

    const loadTeams = async () => {
      try {
        if (user?.role === 'student') {
          const teams = await fetchActiveTeams();
          setActiveTeams(teams);

          // Extrai o ID do usuário de forma robusta
          const userId = user?.id || user?._id;
          if (userId && (typeof userId === 'string' || typeof userId === 'number')) {
            const userIdString = String(userId);
            const userInTeam = await isUserInActiveTeam(userIdString);
            setUserInActiveTeam(userInTeam);
          } else {
            console.warn('ID do usuário não encontrado ou inválido:', user);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar times:', error);
      } finally {
        setLoadingTeams(false);
      }
    };

    loadTeams();
  }, [user]);

  // Função que navega e automaticamente atualizará o activeTab via useEffect
  const handleTabClick = (tabName) => {
    switch (tabName) {
      case 'perfil':
        navigate('/dashboard/profile');
        break;
      case 'projeto':
        navigate('/dashboard/project');
        break;
      case 'reuniões':
        navigate('/dashboard/meetings');
        break;
      case 'notificações':
        navigate('/dashboard/notifications');
        break;
    }
  };

  const shouldShowProjectTabs = () => {
    if (loadingTeams || isAdmin(user)) return false;
    return userInTeam || user?.hasGroup || (!user?.hasGroup && !user?.wantsGroup);
  };

  const renderTabs = () => {
    if (isAdmin(user)) return null;

    const showProjectTabs = shouldShowProjectTabs();

    return (
      <div className="border-b mb-6">
        <nav className="-mb-px flex sm:flex-row flex-col w-full overflow-x-auto space-x-0 sm:space-x-8">
          <DashboardTab
            icon={<FaRegUser />}
            title="Perfil"
            activeTab={activeTab}
            setActiveTab={handleTabClick}
          />

          {showProjectTabs && (
            <DashboardTab
              icon={<TbLayoutKanban />}
              title="Projeto"
              activeTab={activeTab}
              setActiveTab={handleTabClick}
            />
          )}

          {showProjectTabs && (
            <DashboardTab
              icon={<FaRegCalendarAlt />}
              title="Reuniões"
              activeTab={activeTab}
              setActiveTab={handleTabClick}
            />
          )}

          <DashboardTab
            icon={<FaBell />}
            title="Notificações"
            activeTab={activeTab}
            setActiveTab={handleTabClick}
          />
        </nav>
      </div>
    );
  };

  return (
    <div className="p-4 md:px-6 my-auto overflow-x-hidden text-dark">
      <div className="flex flex-col-reverse md:flex-row gap-6 justify-center items-start">
        <div className="w-full md:w-[240px] order-2 md:order-1">
          <Calendar />
        </div>
        <div className="w-full md:flex-1 rounded-lg p-6 shadow-lg order-1 md:order-2 bg-light">
          <h1 className="text-2xl font-bold mb-4 text-dark">
            {user?.type === "admin" ? "Dashboard (Administrador)" : "Dashboard"}
          </h1>

          {renderTabs()}

          {!isAdmin(user) && loadingTeams && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <p>Carregando informações do time...</p>
            </div>
          )}

          <Outlet />
        </div>
      </div>
    </div>
  );
};
