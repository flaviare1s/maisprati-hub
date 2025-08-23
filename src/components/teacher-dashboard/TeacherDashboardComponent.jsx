// TeacherDashboard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { CustomLoader } from '../CustomLoader';
import { DashboardTab } from '../DashboardTab';
import { FaRegUser, FaUsers, FaRegCalendarAlt, FaBell } from 'react-icons/fa';
import { fetchTeams } from '../../api.js/teams';
import { TeacherProfileTab } from './TeacherProfileTab';
import { TeacherTeamsTab } from './TeacherTeamsTab';
import { TeacherMeetingsTab } from './TeacherMeetingsTab';
import { TeacherNotificationsTab } from './TeacherNotificationTab';

export const TeacherDashboardComponent = () => {
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
          <DashboardTab icon={<FaRegCalendarAlt />} title="Reuniões" activeTab={activeTab} setActiveTab={setActiveTab} />
          <DashboardTab icon={<FaBell />} title="Notificações" activeTab={activeTab} setActiveTab={setActiveTab} />
        </nav>
      </div>

      <div>
        {activeTab === 'perfil' && <TeacherProfileTab user={user} teams={teams} />}
        {activeTab === 'times' && <TeacherTeamsTab teams={teams} />}
        {activeTab === 'reuniões' && <TeacherMeetingsTab />}
        {activeTab === 'notificações' && <TeacherNotificationsTab />}
      </div>
    </div>
  );
};
