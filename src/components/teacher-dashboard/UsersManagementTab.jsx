

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchUsers } from '../../api.js/users';
import { MdEdit, MdPerson, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { CustomLoader } from '../CustomLoader';

export const UsersManagementTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2; // Número de usuários por página

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
        <p className="text-red-PRIMARY">{error}</p>
      </div>
    );
  }

  // Cálculos da paginação
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  return (
    <div className="w-full p-0 text-dark">
      <div className="rounded-lg shadow-md p-1 sm:p-4 mb-6">
        <h3 className="text-lg font-semibold mb-4">Usuários</h3>
        <p className="text-gray-600 mb-4">Lista de estudantes cadastrados na plataforma.</p>

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

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold text-blue-logo">{user.groupClass || 'Não definida'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Controles de Paginação */}
        {users.length > 0 && totalPages > 1 && (
          <div className="flex flex-col items-center mt-8 space-y-3">
            <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Botão Página Anterior */}
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 text-sm font-medium cursor-pointer transition-colors ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed bg-gray-50' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-logo'}`}
              >
                <MdChevronLeft size={18} />
              </button>

              {/* Indicador de Página */}
              <div className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-50 border-r border-gray-200 min-w-[120px] text-center">
                {currentPage} de {totalPages}
              </div>

              {/* Botão Próxima Página */}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 text-sm font-medium cursor-pointer transition-colors ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed bg-gray-50' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-logo'}`}
              >
                <MdChevronRight size={18} />
              </button>
            </div>

            {/* Contador de registros */}
            <div className="text-xs text-gray-500">
              Mostrando {startIndex + 1}-{Math.min(endIndex, users.length)} de {users.length} usuários
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
