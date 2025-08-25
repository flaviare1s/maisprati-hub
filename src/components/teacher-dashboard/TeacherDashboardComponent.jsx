import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
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
  const location = useLocation();
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função para converter URL em nome da aba
  const getTabFromURL = () => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');

    const validTabs = ['perfil', 'times', 'reuniões', 'notificações'];
    return validTabs.includes(tab) ? tab : 'perfil';
  };

  const [activeTab, setActiveTab] = useState(getTabFromURL);

  useEffect(() => {
    const newTab = getTabFromURL();
    setActiveTab(newTab);
  }, [location.search]);

  const handleTabChange = (tabName) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('tab', tabName);

    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
  };

  const loadTeams = async () => {
    setLoading(true);
    try {
      const allTeams = await fetchTeams();
      setTeams(allTeams);
    } catch (error) {
      console.error('Erro ao carregar times:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTeamUpdate = () => {
    loadTeams();
  };

  useEffect(() => {
    loadTeams();
  }, []);

  if (loading) return <CustomLoader />;

  return (
    <div className="w-full">
      <div className="border-b mb-6">
        <nav className="-mb-px flex sm:flex-row flex-col w-full overflow-x-auto space-x-0 sm:space-x-8">
          <DashboardTab
            icon={<FaRegUser />}
            title="Perfil"
            activeTab={activeTab}
            setActiveTab={handleTabChange}
          />
          <DashboardTab
            icon={<FaUsers />}
            title="Times"
            activeTab={activeTab}
            setActiveTab={handleTabChange}
          />
          <DashboardTab
            icon={<FaRegCalendarAlt />}
            title="Reuniões"
            activeTab={activeTab}
            setActiveTab={handleTabChange}
          />
          <DashboardTab
            icon={<FaBell />}
            title="Notificações"
            activeTab={activeTab}
            setActiveTab={handleTabChange}
          />
        </nav>
      </div>

      <div>
        {activeTab === 'perfil' && <TeacherProfileTab user={user} teams={teams} />}
        {activeTab === 'times' && (
          <TeacherTeamsTab
            teams={teams}
            onTeamUpdate={handleTeamUpdate}
          />
        )}
        {activeTab === 'reuniões' && <TeacherMeetingsTab />}
        {activeTab === 'notificações' && <TeacherNotificationsTab />}
      </div>
    </div>
  );
};
