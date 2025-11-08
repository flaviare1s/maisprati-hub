import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { CustomLoader } from "../components/CustomLoader";
import { DashboardTab } from "../components/DashboardTab";
import {
  FaRegUser,
  FaUsers,
  FaRegCalendarAlt,
  FaBell,
  FaUserCog,
} from "react-icons/fa";
import { fetchTeams } from "../api.js/teams";
import { fetchUsers } from "../api.js/users";
import { TeacherProfileTab } from "../components/teacher-dashboard/TeacherProfileTab";
import { TeacherTeamsTab } from "../components/teacher-dashboard/TeacherTeamsTab";
import { TeacherMeetingsTab } from "../components/teacher-dashboard/TeacherMeetingsTab";
import { TeacherNotificationsTab } from "../components/teacher-dashboard/TeacherNotificationTab";
import { UsersManagementTab } from "../components/teacher-dashboard/UsersManagementTab";
import { getUserNotifications } from "../api.js/notifications";

export const TeacherDashboardPage = () => {
  const { user, loadUserData } = useAuth();
  const [activeTab, setActiveTab] = useState("perfil");
  const [teams, setTeams] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);

  // Função para atualizar dados de usuários e times
  const updateDashboardData = async () => {
    try {
      const allTeams = await fetchTeams();
      setTeams(allTeams);

      const allUsers = await fetchUsers();
      const studentsOnly = allUsers.filter(user => user.type === "student");

      // Lógica simples: só é inativo se isActive for explicitamente false
      const activeStudents = studentsOnly.filter(user => user.isActive !== false);

      setTotalUsers(studentsOnly.length);
      setActiveUsers(activeStudents.length);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await loadUserData();
        await updateDashboardData();
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [loadUserData]);

  // Polling para atualizar dados do dashboard
  useEffect(() => {
    let intervalId;

    if (user) {
      // Atualiza a cada 3 segundos para resposta mais rápida
      intervalId = setInterval(() => {
        updateDashboardData();
      }, 3000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [user]);

  // Listener para atualizações imediatas quando status de usuário mudar
  useEffect(() => {
    const handleUserStatusChange = () => {
      updateDashboardData();
    };

    window.addEventListener('userStatusChanged', handleUserStatusChange);

    return () => {
      window.removeEventListener('userStatusChanged', handleUserStatusChange);
    };
  }, []);

  useEffect(() => {
    let intervalId;

    const fetchNotifications = async () => {
      try {
        const userId = user?.id || user?._id;
        if (userId) {
          const notifications = await getUserNotifications(userId);
          setNotificationCount(notifications?.length || 0);
        }
      } catch (error) {
        setNotificationCount(0);
        console.error("Erro ao carregar notificações:", error);
      }
    };

    if (user) {
      fetchNotifications();
      intervalId = setInterval(() => {
        fetchNotifications();
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [user]);

  // Pooling para atualizar times quando estiver na aba times
  useEffect(() => {
    let teamsIntervalId;

    const fetchTeamsData = async () => {
      try {
        const allTeams = await fetchTeams();
        setTeams(allTeams);
      } catch (error) {
        console.error("Erro ao carregar times:", error);
      }
    };

    if (activeTab === "times") {
      teamsIntervalId = setInterval(() => {
        fetchTeamsData();
      }, 500); // 500ms = meio segundo
    }

    return () => {
      if (teamsIntervalId) {
        clearInterval(teamsIntervalId);
      }
    };
  }, [activeTab]);

  if (loading) return <CustomLoader />;

  if (!user) {
    return (
      <div className="w-full p-4">
        <p>Erro ao carregar dados do usuário</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex justify-start items-center gap-2 mb-4">
          {user.avatar && (
            <img
              className="w-10 h-10 rounded-full object-cover"
              src={user.avatar}
              alt="Avatar"
            />
          )}
          <div>
            <h2 className="text-2xl font-bold">{user.codename || user.name}</h2>
            <p className="text-sm text-gray-600">Administrador</p>
          </div>
        </div>
      </div>

      <div className="border-b mb-6">
        <nav className="-mb-px flex sm:flex-row flex-col w-full overflow-x-auto space-x-0 sm:space-x-8">
          <DashboardTab
            icon={<FaRegUser />}
            title="Perfil"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <DashboardTab
            icon={<FaUserCog />}
            title="Usuários"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <DashboardTab
            icon={<FaUsers />}
            title="Times"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <DashboardTab
            icon={<FaRegCalendarAlt />}
            title="Reuniões"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <div className="flex items-center">
            <DashboardTab
              icon={<FaBell />}
              title="Notificações"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
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

      <div>
        {activeTab === "perfil" && (
          <TeacherProfileTab user={user} teams={teams} totalUsers={totalUsers} activeUsers={activeUsers} />
        )}
        {activeTab === "times" && (
          <TeacherTeamsTab teams={teams} />
        )}
        {activeTab === "usuários" && <UsersManagementTab />}
        {activeTab === "reuniões" && <TeacherMeetingsTab adminId={user.id} />}
        {activeTab === "notificações" && <TeacherNotificationsTab />}
      </div>
    </div>
  );
};
