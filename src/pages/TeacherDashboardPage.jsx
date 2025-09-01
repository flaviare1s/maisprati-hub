// TeacherDashboard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { CustomLoader } from '../components/CustomLoader';
import { DashboardTab } from '../components/DashboardTab';
import { FaRegUser, FaUsers, FaRegCalendarAlt, FaBell, FaUserCog } from 'react-icons/fa';
import { fetchTeams } from '../api.js/teams';
import { TeacherProfileTab } from '../components/teacher-dashboard/TeacherProfileTab';
import { TeacherTeamsTab } from '../components/teacher-dashboard/TeacherTeamsTab';
import { TeacherMeetingsTab } from '../components/teacher-dashboard/TeacherMeetingsTab';
import { TeacherNotificationsTab } from '../components/teacher-dashboard/TeacherNotificationTab';
import { UsersManagementTab } from '../components/teacher-dashboard/UsersManagementTab';

export const TeacherDashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('perfil');
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const allTeams = await fetchTeams();
        setTeams(allTeams);
      } catch (error) {
        console.error('Erro ao carregar times:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTeams();
  }, []);

  if (loading) return <CustomLoader />;

  return (
    <div className="w-full">
      <div className="border-b mb-6">
        <nav className="-mb-px flex sm:flex-row flex-col w-full overflow-x-auto space-x-0 sm:space-x-8">
          <DashboardTab icon={<FaRegUser />} title="Perfil" activeTab={activeTab} setActiveTab={setActiveTab} />
          <DashboardTab icon={<FaUsers />} title="Times" activeTab={activeTab} setActiveTab={setActiveTab} />
          <DashboardTab icon={<FaUserCog />} title="Usuários" activeTab={activeTab} setActiveTab={setActiveTab} />
          <DashboardTab icon={<FaRegCalendarAlt />} title="Reuniões" activeTab={activeTab} setActiveTab={setActiveTab} />
          <DashboardTab icon={<FaBell />} title="Notificações" activeTab={activeTab} setActiveTab={setActiveTab} />
        </nav>
      </div>

      <div>
        {activeTab === 'perfil' && <TeacherProfileTab user={user} teams={teams} />}
        {activeTab === 'times' && <TeacherTeamsTab teams={teams} />}
        {activeTab === 'usuários' && <UsersManagementTab />}
        {activeTab === 'reuniões' && <TeacherMeetingsTab />}
        {activeTab === 'notificações' && <TeacherNotificationsTab />}
      </div>
    </div>
  );
};
