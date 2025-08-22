import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { CustomLoader } from './CustomLoader';
import { DashboardStudentTab } from './DashboardStudentTab';
import { FaRegUser, FaUsers, FaRegCalendarAlt, FaBell, FaPlus, FaEye, FaEdit, FaTrash, FaCopy, FaCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { fetchTeams } from '../api.js/teams';

export const TeacherDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('perfil');
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      const allTeams = await fetchTeams();
      setTeams(allTeams);
    } catch (error) {
      console.error('Erro ao carregar times:', error);
    } finally {
      setLoading(false);
    }
  };

  const copySecurityCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const renderProfileTab = () => (
    <div className="w-full p-0">
      <div className="rounded-lg shadow-md p-4 mb-6">
        <h3 className="text-lg font-semibold mb-3">
          Informações gerais:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm">Username:</p>
            <p className="font-semibold">{user.username}</p>
          </div>
          <div>
            <p className="text-sm">Email:</p>
            <p className="font-semibold">{user.email}</p>
          </div>
          <div>
            <p className="text-sm">Tipo de Usuário:</p>
            <p className="font-semibold text-blue-logo">Administrador</p>
          </div>
          <div>
            <p className="text-sm">Times Criados:</p>
            <p className="text-xl text-blue-logo">{teams.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="rounded-lg shadow-md p-4">
          <h4 className="font-semibold mb-2">Total de Times</h4>
          <p className="text-2xl font-bold text-blue-logo">{teams.length}</p>
        </div>
        <div className="rounded-lg shadow-md p-4">
          <h4 className="font-semibold mb-2">Alunos Cadastrados</h4>
          <p className="text-2xl font-bold text-green-600">
            {teams.reduce((total, team) => total + team.members.length, 0)}
          </p>
        </div>
        <div className="rounded-lg shadow-md p-4">
          <h4 className="font-semibold mb-2">Times Ativos</h4>
          <p className="text-2xl font-bold text-orange-500">
            {teams.filter(team => team.isActive).length}
          </p>
        </div>
      </div>
    </div>
  );

  const renderTeamsTab = () => (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Gerenciar Times</h3>
        <Link
          to="/teams/create"
          className="bg-blue-logo hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <FaPlus /> Criar Novo Time
        </Link>
      </div>

      <div className="grid gap-4">
        {teams.map((team) => (
          <div key={team.id} className="rounded-lg shadow-md p-4 border">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-blue-logo">{team.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{team.description}</p>
                {team.area && (
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {team.area}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedTeam(team)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                  title="Visualizar Time"
                >
                  <FaEye />
                </button>
                <button
                  className="p-2 text-green-600 hover:bg-green-50 rounded-md"
                  title="Editar Time"
                >
                  <FaEdit />
                </button>
                <button
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                  title="Remover Time"
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Membros:</span> {team.members?.length || 0}/{team.maxMembers}
              </div>
              <div>
                <span className="font-medium">Código:</span>
                <button
                  onClick={() => copySecurityCode(team.securityCode)}
                  className="ml-1 px-2 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200 inline-flex items-center gap-1"
                >
                  {team.securityCode}
                  {copiedCode === team.securityCode ? <FaCheck className="text-green-600" /> : <FaCopy />}
                </button>
              </div>
              <div>
                <span className="font-medium">Status:</span>
                <span className={`ml-1 px-2 py-1 rounded text-xs ${team.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {team.isActive ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-blue-logo">{selectedTeam.name}</h3>
                <button
                  onClick={() => setSelectedTeam(null)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Informações do Time</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Descrição:</span> {selectedTeam.description}</p>
                    <p><span className="font-medium">Área:</span> {selectedTeam.area || 'Não especificada'}</p>
                    <p><span className="font-medium">Código:</span> {selectedTeam.securityCode}</p>
                    <p><span className="font-medium">Membros:</span> {selectedTeam.members?.length || 0}/{selectedTeam.maxMembers}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Membros do Time</h4>
                  <div className="space-y-2">
                    {selectedTeam.members?.length > 0 ? (
                      selectedTeam.members.map((member, index) => (
                        <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                          <p className="font-medium">{member.user?.codename || 'Usuário não encontrado'}</p>
                          <p className="text-gray-600">
                            {member.role === 'leader' ? 'Líder' :
                              member.role === 'subleader' ? 'Sublíder' : 'Membro'}
                            {member.specialization && ` - ${member.specialization}`}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">Nenhum membro cadastrado</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderMeetingsTab = () => (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Gerenciar Reuniões</h3>
      <div className="rounded-lg shadow-md p-4">
        <p className="text-gray-600">
          Aqui você pode agendar horários disponíveis para reuniões com os times,
          visualizar reuniões marcadas e fazer alterações conforme necessário.
        </p>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Notificações</h3>
      <div className="rounded-lg shadow-md p-4">
        <p className="text-gray-600">
          Central de notificações para comunicação com os times e alunos.
        </p>
      </div>
    </div>
  );

  if (loading) {
    return <CustomLoader />;
  }

  return (
    <div className="w-full">
      <div className="border-b mb-6">
        <nav className="-mb-px flex sm:flex-row flex-col w-full overflow-x-auto space-x-0 sm:space-x-8">
          <DashboardStudentTab icon={<FaRegUser />} title="Perfil" activeTab={activeTab} setActiveTab={setActiveTab} />
          <DashboardStudentTab icon={<FaUsers />} title="Times" activeTab={activeTab} setActiveTab={setActiveTab} />
          <DashboardStudentTab icon={<FaRegCalendarAlt />} title="Reuniões" activeTab={activeTab} setActiveTab={setActiveTab} />
          <DashboardStudentTab icon={<FaBell />} title="Notificações" activeTab={activeTab} setActiveTab={setActiveTab} />
        </nav>
      </div>

      <div>
        {activeTab === 'perfil' && renderProfileTab()}
        {activeTab === 'times' && renderTeamsTab()}
        {activeTab === 'reuniões' && renderMeetingsTab()}
        {activeTab === 'notificações' && renderNotificationsTab()}
      </div>
    </div>
  );
};
