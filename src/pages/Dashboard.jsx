import { Calendar } from '../components/Calendar';
import { StudentDashboard } from '../components/StudentDashboard';
import { TeacherDashboard } from '../components/TeacherDashboard';

export const Dashboard = () => {
  const user = {
    name: 'João',
    type: 'student'
  }

  const renderDashboardContent = () => {
    if (user.type === 'student') {
      return <StudentDashboard />;
    } else if (user.type === 'teacher') {
      return <TeacherDashboard />;
    }
    return <div>Tipo de usuário não identificado</div>;
  };

  return (
    <div className="p-4 md:px-6 my-auto overflow-x-hidden">
  
        <div className="mb-6 flex gap-4 justify-center">
          
      
        </div>
        <div className="flex gap-6 h-full">
          <div className="w-[280px]">
            <Calendar />
          </div>

          <div className="flex-1 rounded-lg p-6 shadow-lg">
            <h1 className="text-2xl font-bold mb-4">
              {user.type === 'student' ? 'Dashboard do Estudante' : 'Dashboard do Professor'}
            </h1>
            {renderDashboardContent()}
          </div>
        </div>
      
    </div>
  );
};
