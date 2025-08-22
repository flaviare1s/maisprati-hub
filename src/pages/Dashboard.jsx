/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Calendar } from '../components/Calendar';
import { TeacherDashboard } from '../components/teacher-dashboard/TeacherDashboard';
import { useAuth } from '../hooks/useAuth';
import { isAdmin } from '../utils/permissions';
import { StudentMeetingsTab } from '../components/student-dashboard/StudentMeetingsTab';
import { TbLayoutKanban } from 'react-icons/tb';
import { FaRegCalendarAlt, FaRegUser, FaBell } from 'react-icons/fa';
import { DashboardTab } from '../components/DashboardTab';
import { ProjectBoard } from '../components/project/ProjectBoard';
import { StudentNotificationsPanel } from '../components/student-dashboard/StudentNotificationsPanel';
import { fetchTeams, isUserInActiveTeam } from '../api.js/teams';
import { StudentDashboard } from '../components/student-dashboard/StudentDashboard';

export const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('perfil');
  const [teams, setTeams] = useState([]);
  const [userInTeam, setUserInTeam] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(true);

  useEffect(() => {
    if (!user) return;

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

  if (!user) {
    return (
      <div className="p-4 text-center">
        <p>Usuário não autenticado. Por favor, faça login.</p>
      </div>
    );
  }

  const renderDashboardContent = () => {
    if (isAdmin(user)) {
      return (
        <div>
          <TeacherDashboard />
        </div>
      );
    }

    if (loadingTeams) {
      return <p>Carregando informações do time...</p>;
    }

    return (
      <div>
        <div className="w-full">
          <div className="border-b mb-6">
            <nav className="-mb-px flex sm:flex-row flex-col w-full overflow-x-auto space-x-0 sm:space-x-8">
              <DashboardTab
                icon={<FaRegUser />}
                title="Perfil"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />

              {(userInTeam || (!user.hasGroup && !user.wantsGroup)) && (
                <DashboardTab
                  icon={<TbLayoutKanban />}
                  title="Projeto"
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              )}

              {(userInTeam || (!user.hasGroup && !user.wantsGroup)) && (
                <DashboardTab
                  icon={<FaRegCalendarAlt />}
                  title="Reuniões"
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              )}

              <DashboardTab
                icon={<FaBell />}
                title="Notificações"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </nav>
          </div>

          <div>
            {activeTab === 'perfil' && <StudentDashboard />}
            {activeTab === 'projeto' && (userInTeam || (!user.hasGroup && !user.wantsGroup)) && <ProjectBoard />}
            {activeTab === 'reuniões' && (userInTeam || (!user.hasGroup && !user.wantsGroup)) && <StudentMeetingsTab />}
            {activeTab === 'notificações' && <StudentNotificationsPanel />}
          </div>
        </div>
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
            {isAdmin(user) ? 'Dashboard (Administrador)' : 'Dashboard'}
          </h1>
          {renderDashboardContent()}
        </div>
      </div>
    </div>
  );
};
