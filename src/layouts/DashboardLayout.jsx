/* eslint-disable no-unused-vars */
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Calendar } from "../components/Calendar";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from 'react';
import { TbLayoutKanban } from 'react-icons/tb';
import { FaRegCalendarAlt, FaRegUser, FaBell } from 'react-icons/fa';
import { DashboardTab } from '../components/DashboardTab';
import { fetchTeams, isUserInActiveTeam } from '../api.js/teams';
import { isAdmin } from '../utils/permissions';

export const DashboardLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [userInTeam, setUserInTeam] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(true);

  // Determinar a aba ativa baseada na rota atual
  const getActiveTabFromPath = (pathname) => {
    if (pathname.includes('/profile')) return 'perfil';
    if (pathname.includes('/project')) return 'projeto';
    if (pathname.includes('/meetings')) return 'reuniões';
    if (pathname.includes('/notifications')) return 'notificações';
    return 'perfil'; // default
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromPath(location.pathname));

  // Atualizar aba quando a rota mudar
  useEffect(() => {
    setActiveTab(getActiveTabFromPath(location.pathname));
  }, [location.pathname]);

  // Carregar dados dos times
  useEffect(() => {
    if (!user || isAdmin(user)) return;

    const loadTeams = async () => {
      try {
        const allTeams = await fetchTeams();
        setTeams(allTeams);
        setUserInTeam(isUserInActiveTeam(user, allTeams));
      } catch (error) {
        console.error("Erro ao carregar times:", error);
      } finally {
        setLoadingTeams(false);
      }
    };

    loadTeams();
  }, [user]);

  // Função para navegar quando clicar na aba
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);

    // Navegar para a rota correspondente
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

  const renderTabs = () => {
    // Se é admin, não mostrar abas
    if (isAdmin(user)) return null;

    // Se está carregando, não mostrar abas ainda
    if (loadingTeams) return null;

    return (
      <div className="border-b mb-6">
        <nav className="-mb-px flex sm:flex-row flex-col w-full overflow-x-auto space-x-0 sm:space-x-8">
          <DashboardTab
            icon={<FaRegUser />}
            title="Perfil"
            activeTab={activeTab}
            setActiveTab={handleTabClick}
          />

          {(userInTeam || (!user.hasGroup && !user.wantsGroup)) && (
            <DashboardTab
              icon={<TbLayoutKanban />}
              title="Projeto"
              activeTab={activeTab}
              setActiveTab={handleTabClick}
            />
          )}

          {(userInTeam || (!user.hasGroup && !user.wantsGroup)) && (
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
    <div className="p-4 md:px-6 my-auto overflow-x-hidden">
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
            <p>Carregando informações do time...</p>
          )}
          <Outlet />
        </div>
      </div>
    </div>
  );
};
