import { useAuth } from '../hooks/useAuth';

export const StudentProfile = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="p-6 text-center">Usuário não encontrado.</div>;
  }

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-8">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={user.avatar}
          alt={user.codename}
          className="w-20 h-20 rounded-full border-4 border-blue-400"
        />
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.codename}</h2>
          <p className="text-gray-600 dark:text-gray-300">{user.username}</p>
        </div>
      </div>
      <div className="space-y-2 text-sm">
        <p><strong>Nome:</strong> {user.profile?.fullName || '-'}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>WhatsApp:</strong> {user.whatsapp}</p>
        <p><strong>Turma:</strong> {user.turma}</p>
        <p><strong>Grupo:</strong> {user.hasGroup ? 'Sim' : 'Não'}</p>
      </div>
    </div>
  );
}
