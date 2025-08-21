import { useState } from 'react';
import { Calendar } from '../components/Calendar';
import { StudentDashboard } from '../components/StudentDashboard';
import { TeacherDashboard } from '../components/TeacherDashboard';
import { useAuth } from '../hooks/useAuth';
import { isAdmin } from '../utils/permissions';
import { Meetings } from '../components/Meetings';
import { Forbidden } from './Forbidden';
import { TbLayoutKanban } from 'react-icons/tb';
import { FaRegCalendarAlt, FaRegUser } from 'react-icons/fa';
import { DashboardStudentTab } from '../components/DashboardStudentTab';
import { ProjectBoard } from '../components/project/ProjectBoard';

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

  const canAccessDashboard = isAdmin(user) || (user.type === 'student' && user.hasGroup);

  if (!canAccessDashboard) {
    return (
      <Forbidden />
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
              <DashboardStudentTab
                icon={<TbLayoutKanban />}
                title="Projeto"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
              <DashboardStudentTab
                icon={<FaRegCalendarAlt />}
                title="Reuniões"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </nav>
          </div>

          <div>
            {activeTab === 'perfil' && <StudentDashboard />}
            {activeTab === 'projeto' && <ProjectBoard />}
            {activeTab === 'reuniões' && <Meetings />}
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
              : 'Dashboard (Estudante)'
            }
          </h1>
          {renderDashboardContent()}
        </div>
      </div>

    </div>
  );
};
