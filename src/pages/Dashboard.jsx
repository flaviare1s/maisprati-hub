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
import { CommonRoom } from './CommonRoom';

// Componente de Notificações
const NotificationsPanel = () => {
  const mockNotifications = [
    {
      id: 1,
      type: 'team_invitation',
      title: 'Convite para Time A',
      message: 'Você recebeu um convite para se juntar ao Time A!',
      time: '5 min atrás',
      isRead: false
    },
    {
      id: 2,
      type: 'forum_reply',
      title: 'Nova resposta no fórum',
      message: 'Alguém respondeu seu post sobre React',
      time: '1 hora atrás',
      isRead: true
    }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Notificações</h2>
      <div className="space-y-3">
        {mockNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg border ${notification.isRead ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
              }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{notification.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                <span className="text-xs text-gray-500">{notification.time}</span>
              </div>
              {!notification.isRead && (
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              )}
            </div>
          </div>
        ))}
        {mockNotifications.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <FaBell className="mx-auto text-3xl mb-2" />
            <p>Nenhuma notificação no momento</p>
          </div>
        )}
      </div>
    </div>
  );
};

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

              {/* Taverna dos Hérois - disponível para quem quer grupo */}
              {user.wantsGroup && (
                <DashboardStudentTab
                  icon={<FaCrown />}
                  title="Taverna"
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              )}

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
            {activeTab === 'taverna' && user.wantsGroup && <CommonRoom />}
            {activeTab === 'notificações' && <NotificationsPanel />}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:px-6 my-auto overflow-x-hidden">
      <div className="flex flex-col-reverse sm:flex-row gap-6 justify-center items-start">
        <div className="w-full md:w-[280px] order-2 md:order-1">
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
