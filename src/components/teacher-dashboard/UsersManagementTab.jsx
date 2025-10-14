import { useState, useEffect } from 'react';
import { fetchUsers } from '../../api.js/users';
import { MdPerson } from 'react-icons/md';
import { CustomLoader } from '../CustomLoader';
import { Pagination } from '../Pagination';

export const UsersManagementTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 30;

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await fetchUsers();
        const students = usersData.filter(user => user.type === 'student');
        students.sort((a, b) => a.name.localeCompare(b.name));
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

  useEffect(() => {
    if (sortOption) {
      const sortedUsers = [...users];
      if (sortOption === 'name') {
        sortedUsers.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortOption === 'groupClass') {
        sortedUsers.sort((a, b) => {
          if (!a.groupClass) return 1;
          if (!b.groupClass) return -1;
          return a.groupClass.localeCompare(b.groupClass);
        });
      }
      setUsers(sortedUsers);
      setCurrentPage(1);
    }
  }, [sortOption]);

  if (loading) {
    return <CustomLoader />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-PRIMARY">{error}</p>
      </div>
    );
  }

  // Lógica de filtro para a busca
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.codename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginação agora usa a lista filtrada
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  return (
    <div className="w-full p-0 text-dark">
      <div className="rounded-lg shadow-md p-1 sm:p-4 mb-6">
        <h3 className="text-lg font-semibold mb-4">Usuários</h3>
        <p className="text-gray-600 mb-4">
          Lista de estudantes cadastrados na plataforma.
        </p>

        {/* 🔹 Contador de usuários */}
        <div className="mb-4 text-sm text-gray-500">
          Total de usuários: <span className="font-semibold">{filteredUsers.length}</span>
        </div>

        {/* 🔹 Campo de busca */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar por nome, codinome ou email..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reseta a página ao buscar
            }}
          />
        </div>

        {/* 🔹 Botões de ordenação */}
        <div className="flex space-x-2 mb-4">
          <button
            className={`px-4 py-2 rounded transition-colors cursor-pointer ${sortOption === 'name'
              ? 'bg-blue-logo text-white'
              : 'bg-gray-100 hover:bg-blue-200 hover:text-blue-800 dark:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-500'
              }`}
            onClick={() => setSortOption('name')}
          >
            Ordenar por Nome
          </button>
          <button
            className={`px-4 py-2 rounded transition-colors cursor-pointer ${sortOption === 'groupClass'
              ? 'bg-orange-logo text-white'
              : 'bg-gray-100 hover:bg-orange-200 hover:text-orange-800 dark:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-500'
              }`}
            onClick={() => setSortOption('groupClass')}
          >
            Ordenar por Turma
          </button>
        </div>

        <div className="grid gap-4">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <MdPerson className="mx-auto text-2xl md:text-4xl text-gray-muted mb-4" />
              <p className="text-gray-muted">Nenhum estudante encontrado com o termo de busca.</p>
            </div>
          ) : (
            currentUsers.map((user) => (
              <div key={user.id} className="user-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-2 sm:px-4 py-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={user.avatar || '/images/avatar/avatares 1.png'}
                      alt={`Avatar de ${user.name}`}
                      className="w-12 h-12 rounded-full border-2 border-blue-logo"
                    />
                    <div>
                      <h4 className="font-semibold">{user.name}</h4>
                      <p className="text-sm text-gray-muted">{user.codename}</p>
                      <p className="text-sm text-gray-muted">{user.email}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-blue-logo">{user.groupClass || 'Não definida'}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Paginação */}
        {filteredUsers.length > 0 && totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <Pagination
              totalItems={filteredUsers.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={(page) => setCurrentPage(page)}
              showCounts={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};