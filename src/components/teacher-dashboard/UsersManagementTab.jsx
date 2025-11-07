import { useState, useEffect } from 'react';
import { fetchUsers } from '../../api.js/users';
import { MdPerson } from 'react-icons/md';
import { BsKanban } from "react-icons/bs";
import { Link } from 'react-router-dom';
import { CustomLoader } from '../CustomLoader';
import { Pagination } from '../Pagination';

export const UsersManagementTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSoloOnly, setShowSoloOnly] = useState('all');
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

  // Lógica de filtro para a busca e filtro de solo
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.codename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro por tipo de usuário
    let matchesTypeFilter = true;
    if (showSoloOnly === 'solo') {
      // Alunos solo: não tem grupo E não está procurando grupo
      matchesTypeFilter = !user.hasGroup && !user.wantsGroup;
    } else if (showSoloOnly === 'seeking') {
      // Procurando grupo: não tem grupo MAS está procurando grupo
      matchesTypeFilter = !user.hasGroup && user.wantsGroup;
    }
    // 'all' não aplica filtro adicional

    return matchesSearch && matchesTypeFilter;
  });

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
          {showSoloOnly === 'solo' ? (
            <>Alunos solo: <span className="font-semibold">{filteredUsers.length}</span></>
          ) : showSoloOnly === 'seeking' ? (
            <>Sem guilda: <span className="font-semibold">{filteredUsers.length}</span></>
          ) : (
            <>Total de usuários: <span className="font-semibold">{filteredUsers.length}</span></>
          )}
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

        {/* 🔹 Filtro de tipo de aluno */}
        <div className="mb-4">
          <select
            value={showSoloOnly}
            onChange={(e) => {
              setShowSoloOnly(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos os alunos</option>
            <option value="solo">Alunos solo</option>
            <option value="seeking">Heróis sem guilda</option>
          </select>
        </div>

        {/* 🔹 Botões de ordenação */}
        <div className="flex space-x-2 mb-4">
          <button
            className={`px-4 py-2 rounded transition-colors cursor-pointer ${sortOption === 'name'
              ? 'bg-blue-logo text-white'
              : 'bg-gray-100 hover:bg-blue-logo hover:text-white dark:bg-gray-600 text-gray-light dark:text-gray-200 border border-gray-300 dark:border-gray-500'
              }`}
            onClick={() => setSortOption('name')}
          >
            Ordenar por Nome
          </button>
          <button
            className={`px-4 py-2 rounded transition-colors cursor-pointer ${sortOption === 'groupClass'
              ? 'bg-orange-logo text-white'
              : 'bg-gray-100 hover:bg-orange-logo hover:text-light dark:bg-gray-600 text-gray-light dark:text-gray-200 border border-gray-300 dark:border-gray-500'
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
              <p className="text-gray-muted">
                {showSoloOnly === 'solo'
                  ? 'Nenhum aluno solo encontrado.'
                  : showSoloOnly === 'seeking'
                    ? 'Nenhum aluno procurando grupo encontrado.'
                    : 'Nenhum estudante encontrado com o termo de busca.'
                }
              </p>
            </div>
          ) : (
            currentUsers.map((user) => (
              <div key={user.id} className="user-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-2 sm:px-4 py-1 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={user.avatar || '/images/avatar/avatares 1.png'}
                      alt={`Avatar de ${user.name}`}
                      className="w-12 h-12 rounded-full border-2 border-blue-logo"
                    />
                    <div>
                      <h4 className="font-semibold">
                        {user.name}
                        {!user.hasGroup && !user.wantsGroup && (
                          <span className="text-xs text-blue-logo"> - Solo</span>
                        )}
                        {!user.hasGroup && user.wantsGroup && (
                          <span className="text-xs text-orange-logo"> - Sem guilda</span>
                        )}
                      </h4>
                      <p className="text-sm text-gray-muted">{user.codename}</p>
                      <p className="text-xs text-gray-muted">{user.email}</p>
                    </div>
                  </div>

                  <div className='flex'>
                    {!user.hasGroup && !user.wantsGroup && (
                      <Link
                        to={`/dashboard/project?viewUser=${user.id}`}
                        className="p-2 text-blue-logo hover:text-blue-600 transition-colors"
                        title="Visualizar progresso do projeto"
                      >
                        <BsKanban className='text-lg' />
                      </Link>
                    )}
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="font-semibold text-blue-logo">{user.groupClass || 'Não definida'}</p>
                      </div>
                    </div>
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
