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
  const [sortOption, setSortOption] = useState('name'); // <--- Defina 'name' como padrão
  const itemsPerPage = 30;

  // Efeito para carregar os usuários e ordená-los por nome
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await fetchUsers();
        const students = usersData.filter(user => user.type === 'student');

        // <--- Nova lógica de ordenação inicial
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

  // Efeito para reordenar a lista quando o usuário clicar nos botões
  useEffect(() => {
    let sortedUsers = [...users];

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
    setCurrentPage(1); // Reseta para a primeira página após a ordenação
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
  
  // Lógica de paginação
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  return (
    <div className="w-full p-0 text-dark">
      <div className="rounded-lg shadow-md p-1 sm:p-4 mb-6">
        <h3 className="text-lg font-semibold mb-4">Usuários</h3>
        <p className="text-gray-600 mb-4">Lista de estudantes cadastrados na plataforma.</p>

        {/* 🔹 Botões de ordenação */}
        <div className="flex space-x-2 mb-4">
          <button
            className={`px-4 py-2 rounded ${sortOption === 'name' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setSortOption('name')}
          >
            Ordenar por Nome
          </button>
          <button
            className={`px-4 py-2 rounded ${sortOption === 'groupClass' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setSortOption('groupClass')}
          >
            Ordenar por Turma
          </button>
        </div>

        <div className="grid gap-4">
          {users.length === 0 ? (
            <div className="text-center py-8">
              <MdPerson className="mx-auto text-2xl md:text-4xl text-gray-muted mb-4" />
              <p className="text-gray-muted">Nenhum estudante cadastrado ainda.</p>
            </div>
          ) : (
            currentUsers.map((user) => (
              <div key={user.id} className="bg-white border border-gray-200 rounded-lg px-2 sm:px-4 py-1">
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
        {users.length > 0 && totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <Pagination
              totalItems={users.length}
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