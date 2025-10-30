/* eslint-disable no-unused-vars */
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Calendar } from "../components/Calendar";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect, useCallback } from 'react';
import { TbLayoutKanban } from 'react-icons/tb';
import { FaRegCalendarAlt, FaRegUser, FaBell } from 'react-icons/fa';
import { DashboardTab } from '../components/DashboardTab';
import { fetchActiveTeams, isUserInActiveTeam } from '../api.js/teams';
import { isAdmin } from '../utils/permissions';
import { getUserNotifications } from "../api.js/notifications";

export const DashboardLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [activeTeams, setActiveTeams] = useState([]);
  const [userInTeam, setUserInTeam] = useState(false);
  const [userInActiveTeam, setUserInActiveTeam] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userId = user?.id || user?._id;
        if (userId) {
          const notifications = await getUserNotifications(userId);
          setNotificationCount(notifications?.length || 0);
        }
      } catch (error) {
        setNotificationCount(0);
      }
    };
    if (user) fetchNotifications();
  }, [user]);

  const refreshNotificationCount = useCallback(async () => {
    const userId = user?.id || user?._id;
    if (userId) {
      const notifications = await getUserNotifications(userId);
      setNotificationCount(notifications?.length || 0);
    }
  }, [user]);

  const getTabNameFromPath = (pathname) => {
    if (pathname.includes('/profile')) return 'perfil';
    if (pathname.includes('/project')) return 'projeto';
    if (pathname.includes('/meetings')) return 'reuniões';
    if (pathname.includes('/notifications')) return 'notificações';
    if (pathname.includes('/admin')) return 'perfil';
    return 'perfil';
  };

  const [activeTab, setActiveTab] = useState(() => getTabNameFromPath(location.pathname));

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

          <div className="flex items-center">
            <DashboardTab
              icon={<FaBell />}
              title="Notificações"
              activeTab={activeTab}
              setActiveTab={handleTabClick}
              refreshNotificationCount={refreshNotificationCount}
            />
            {notificationCount > 0 && (
              <span
                className={`ml-2 rounded-full text-[9px] h-fit border px-[3px] font-semibold
                    ${activeTab === "notificações"
                    ? "bg-blue-logo text-light border-blue-logo"
                    : "text-gray-muted border-gray-muted"
                  }`}
              >
                {notificationCount}
              </span>
            )}
          </div>
        </nav>
      </div>
    );
  };

  useEffect(() => {
    let intervalId;

    if (user) {
      console.log("Starting polling for notification count in DashboardLayout...");
      intervalId = setInterval(() => {
        console.log("Polling: Calling refreshNotificationCount...");
        refreshNotificationCount();
      }, 5000);
    }

    return () => {
      if (intervalId) {
        console.log("Clearing polling interval in DashboardLayout...");
        clearInterval(intervalId);
      }
    };
  }, [user, refreshNotificationCount]);

  return (
    <div className="p-4 md:px-6 my-auto overflow-x-hidden text-dark dark:text-gray-100">
      <div className="flex flex-col-reverse md:flex-row gap-6 justify-center items-start">
        <div className="w-full md:w-[240px] order-2 md:order-1">
          <Calendar />
        </div>
        <div className="dashboard-main w-full md:flex-1 rounded-lg p-6 shadow-lg order-1 md:order-2">
          <h1 className="text-2xl font-bold mb-4 text-dark dark:text-gray-100">
            {user?.type === "admin" ? "Dashboard (Administrador)" : "Dashboard"}
          </h1>

          {renderTabs()}

          {!isAdmin(user) && loadingTeams && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-logo"></div>
              <p>Carregando informações do time...</p>
            </div>
          )}

          <Outlet />
        </div>
      </div>
    </div>
  );
};
