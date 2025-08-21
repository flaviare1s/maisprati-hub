import { useState } from 'react';
import { Calendar } from '../components/Calendar';
import { StudentDashboard } from '../components/StudentDashboard';
import { TeacherDashboard } from '../components/TeacherDashboard';
import { useAuth } from '../hooks/useAuth';
import { isAdmin } from '../utils/permissions';
import { Meetings } from '../components/Meetings';
import { TbLayoutKanban } from 'react-icons/tb';
import { FaRegCalendarAlt, FaRegUser, FaBell, FaCrown } from 'react-icons/fa';
import { DashboardStudentTab } from '../components/DashboardStudentTab';
import { ProjectBoard } from '../components/project/ProjectBoard';
import { NotificationsPanel } from '../components/NotificationsPanel';

export const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('perfil');

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
          <div className="mt-6 p-4 rounded-lg">
            <p className="text-sm text-blue-logo">
              <strong>Acesso Total</strong>
            </p>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="w-full">
          <div className="border-b mb-6">
            <nav className="-mb-px flex space-x-8">
              <DashboardStudentTab
                icon={<FaRegUser />}
                title="Perfil"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />

              {/* Mostrar aba Projeto apenas para quem tem grupo ou trabalha sozinho */}
              {(user.hasGroup || !user.wantsGroup) && (
                <DashboardStudentTab
                  icon={<TbLayoutKanban />}
                  title="Projeto"
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              )}

              <DashboardStudentTab
                icon={<FaRegCalendarAlt />}
                title="Reuniões"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />

              <DashboardStudentTab
                icon={<FaBell />}
                title="Notificações"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </nav>
          </div>

          <div>
            {activeTab === 'perfil' && <StudentDashboard />}
            {activeTab === 'projeto' && (user.hasGroup || !user.wantsGroup) && <ProjectBoard />}
            {activeTab === 'reuniões' && <Meetings />}
            {activeTab === 'notificações' && <NotificationsPanel />}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:px-6 my-auto overflow-x-hidden">
      <div className="flex flex-col-reverse md:flex-row gap-6 justify-center items-start">
        <div className="w-full md:w-[230px] order-2 md:order-1">
          <Calendar />
        </div>

        <div className="w-full md:flex-1 rounded-lg p-6 shadow-lg order-1 md:order-2">
          <h1 className="text-2xl font-bold mb-4">
            {isAdmin(user)
              ? 'Dashboard (Administrador)'
              : `Dashboard - ${user.codename || user.username}`
            }
          </h1>
          {renderDashboardContent()}
        </div>
      </div>

    </div>
  );
};
