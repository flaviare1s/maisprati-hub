import { useState, useEffect } from 'react';
import { fetchUsers, deactivateUser, activateUser } from '../../api.js/users';
import { fetchTeams } from '../../api.js/teams';
import { MdPerson } from 'react-icons/md';
import { BsKanban } from "react-icons/bs";
import { FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { CustomLoader } from '../CustomLoader';
import { Pagination } from '../Pagination';
import toast from 'react-hot-toast';
import { IoIosTimer } from "react-icons/io";

export const UsersManagementTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('active');
  const [togglingUsers, setTogglingUsers] = useState(new Set());
  const itemsPerPage = 30;

  const loadUsers = async () => {
    try {
      const [usersData, teamsData] = await Promise.all([
        fetchUsers(),
        fetchTeams()
      ]);

      const students = usersData.filter(user => user.type === 'student');

      // Criar mapeamento de usuários com times
      const studentsWithTeams = students.map(student => {
        // Encontrar o time do usuário
        const userTeam = teamsData.find(team =>
          team.members && team.members.some(member =>
            member.userId === student.id || member.id === student.id
          )
        );

        return {
          ...student,
          teamName: userTeam ? userTeam.name : null
        };
      });

      setUsers(studentsWithTeams);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      setError('Erro ao carregar lista de usuários');
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await loadUsers();
      setLoading(false);
    };
    initializeData();
  }, []);

  const handleToggleUserStatus = async (userId, currentIsActive) => {
    setTogglingUsers(prev => new Set([...prev, userId]));

    try {
      if (currentIsActive) {
        await deactivateUser(userId);
        toast.success('Usuário inativado com sucesso!');
      } else {
        await activateUser(userId);
        toast.success('Usuário reativado com sucesso!');
      }

      // Recarregar os dados para garantir que o estado esteja sincronizado
      await loadUsers();

      // Disparar evento customizado para atualizar dashboard
      window.dispatchEvent(new CustomEvent('userStatusChanged'));

    } catch (error) {
      console.error('Erro ao alterar status do usuário:', error);
      toast.error('Erro ao alterar status do usuário');
    } finally {
      setTogglingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

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

  // Lógica de filtro para a busca e filtro unificado
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.codename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.teamName && user.teamName.toLowerCase().includes(searchTerm.toLowerCase()));

    // Filtro simplificado
    let matchesFilter = true;
    switch (filterOption) {
      case 'active':
        matchesFilter = user.isActive !== false; // Todos os ativos (padrão)
        break;
      case 'solo':
        matchesFilter = (user.isActive !== false) && (!user.hasGroup && !user.wantsGroup); // Solo ativos
        break;
      case 'seeking':
        matchesFilter = (user.isActive !== false) && (!user.hasGroup && user.wantsGroup); // Sem guilda ativos
        break;
      case 'grouped':
        matchesFilter = (user.isActive !== false) && user.hasGroup; // Com guilda ativos
        break;
      case 'inactive':
        matchesFilter = user.isActive === false; // Apenas inativos
        break;
      case 'all':
        matchesFilter = true; // Todos (ativos e inativos)
        break;
      default:
        matchesFilter = user.isActive !== false;
    }

    return matchesSearch && matchesFilter;
  });

  // Aplicar ordenação
  const sortedUsers = [...filteredUsers];
  if (sortOption === 'name') {
    sortedUsers.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption === 'groupClass') {
    sortedUsers.sort((a, b) => {
      if (!a.groupClass) return 1;
      if (!b.groupClass) return -1;
      return a.groupClass.localeCompare(b.groupClass);
    });
  }

  // Paginação agora usa a lista filtrada e ordenada
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = sortedUsers.slice(startIndex, endIndex);

  return (
    <div className="w-full p-0 text-dark">
      <div className="rounded-lg shadow-md p-1 sm:p-4 mb-6">
        <h3 className="text-lg font-semibold mb-4">Usuários</h3>
        <p className="text-gray-600 mb-4">
          Lista de estudantes cadastrados na plataforma.
        </p>

        {/* 🔹 Contador de usuários */}
        <div className="mb-4 text-sm text-gray-500">
          Total de usuários: <span className="font-semibold">{sortedUsers.length}</span>
        </div>

        {/* 🔹 Campo de busca */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar por nome, codinome, email ou guilda..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reseta a página ao buscar
            }}
          />
        </div>

        {/* 🔹 Filtro simplificado */}
        <div className="mb-4">
          <select
            value={filterOption}
            onChange={(e) => {
              setFilterOption(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="active">Ativos</option>
            <option value="solo">Solo</option>
            <option value="seeking">Sem guilda</option>
            <option value="grouped">Com guilda</option>
            <option value="inactive">Inativos</option>
            <option value="all">Todos</option>
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
          {sortedUsers.length === 0 ? (
            <div className="text-center py-8">
              <MdPerson className="mx-auto text-2xl md:text-4xl text-gray-muted mb-4" />
              <p className="text-gray-muted">
                Nenhum estudante encontrado com os filtros aplicados.
              </p>
            </div>
          ) : (
            currentUsers.map((user) => (
              <div key={user.id} className={`user-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-2 sm:px-4 py-1 text-sm ${!user.isActive ? 'opacity-60' : ''
                }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={user.avatar || '/images/avatar/avatares 1.png'}
                      alt={`Avatar de ${user.name}`}
                      className={`hidden sm:block w-12 h-12 rounded-full border-2 border-blue-logo ${!user.isActive ? 'grayscale' : ''
                        }`}
                    />
                    <div>
                      <h4 className={`font-semibold ${!user.isActive ? 'line-through' : ''}`}>
                        {user.name}
                        {!user.hasGroup && !user.wantsGroup && (
                          <span className="text-xs text-blue-logo"> - Solo</span>
                        )}
                        {!user.hasGroup && user.wantsGroup && (
                          <span className="text-xs text-orange-logo"> - Sem guilda</span>
                        )}
                        {!user.isActive && (
                          <span className="text-xs text-red-500 ml-2">(Inativo)</span>
                        )}
                      </h4>
                      <p className={`text-xs sm:text-sm text-gray-muted ${!user.isActive ? 'line-through' : ''}`}>
                        {user.codename}
                      </p>
                      <p className={`text-xs text-gray-muted ${!user.isActive ? 'line-through' : ''}`}>
                        {user.email}
                      </p>
                      {user.teamName && (
                        <p className={`text-xs font-medium text-blue-logo ${!user.isActive ? 'line-through' : ''}`}>
                          {user.teamName}
                        </p>
                      )}
                      {!user.teamName && user.hasGroup && (
                        <p className={`text-xs font-medium text-orange-logo flex items-center gap-1 ${!user.isActive ? 'line-through' : ''}`}>
                          <IoIosTimer />
                          Aguardando entrada no time
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='flex items-center'>
                    {!user.hasGroup && !user.wantsGroup && user.isActive !== false && (
                      <Link
                        to={`/dashboard/project?viewUser=${user.id}`}
                        className="p-2 text-blue-logo hover:text-blue-600 transition-colors"
                        title="Visualizar progresso do projeto"
                      >
                        <BsKanban className='text-lg' />
                      </Link>
                    )}

                    {/* Toggle de ativar/inativar usuário */}
                    <button
                      onClick={() => handleToggleUserStatus(user.id, user.isActive)}
                      disabled={togglingUsers.has(user.id)}
                      className={`p-2 transition-colors ${togglingUsers.has(user.id)
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-orange-logo hover:text-orange-600 cursor-pointer'
                        }`}
                      title={togglingUsers.has(user.id) ? 'Alterando...' : (user.isActive ? "Inativar usuário" : "Ativar usuário")}
                    >
                      {togglingUsers.has(user.id) ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                      ) : (
                        user.isActive ? <FaToggleOn className="text-lg" /> : <FaToggleOff className="text-lg" />
                      )}
                    </button>

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
        {sortedUsers.length > 0 && totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <Pagination
              totalItems={sortedUsers.length}
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
