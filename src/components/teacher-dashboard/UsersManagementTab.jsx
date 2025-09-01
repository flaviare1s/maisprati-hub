import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchUsers } from '../../api.js/users';
import { MdEdit, MdPerson } from 'react-icons/md';
import { CustomLoader } from '../CustomLoader';

export const UsersManagementTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await fetchUsers();
        // Filtrar apenas estudantes para o admin gerenciar
        const students = usersData.filter(user => user.type === 'student');
        setUsers(students);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        setError('Erro ao carregar lista de usuários');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (loading) {
    return <CustomLoader />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full p-0 text-dark">
      <div className="rounded-lg shadow-md p-4 mb-6">
        <h3 className="text-lg font-semibold mb-4">Gerenciamento de Usuários</h3>
        <p className="text-gray-600 mb-4">
          Lista de estudantes cadastrados na plataforma. Clique no ícone de edição para gerenciar o perfil.
        </p>

        <div className="grid gap-4">
          {users.length === 0 ? (
            <div className="text-center py-8">
              <MdPerson className="mx-auto text-4xl text-gray-400 mb-4" />
              <p className="text-gray-500">Nenhum estudante cadastrado ainda.</p>
            </div>
          ) : (
            users.map((user) => (
              <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={user.avatar || '/images/avatar/avatares 1.png'}
                      alt={`Avatar de ${user.name}`}
                      className="w-12 h-12 rounded-full border-2 border-blue-logo"
                    />
                    <div>
                      <h4 className="font-semibold text-lg">{user.name}</h4>
                      <p className="text-sm text-gray-600">@{user.codename}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Turma:</p>
                      <p className="font-semibold text-blue-logo">{user.groupClass || 'Não definida'}</p>
                    </div>

                    <Link
                      to={`/edit-profile/${user.id}`}
                      className="p-2 text-orange-logo hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                      title="Editar perfil"
                    >
                      <MdEdit className="text-2xl" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
