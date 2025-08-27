export const TeacherProfileTab = ({ user, teams }) => (
  <div className="w-full p-0 text-dark">
    <div className="rounded-lg shadow-md p-4 mb-6">
      <h3 className="text-lg font-semibold mb-3">Informações gerais:</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><p className="text-sm">Nome:</p><p className="font-semibold">{user.name}</p></div>
        <div><p className="text-sm">E-mail:</p><p className="font-semibold">{user.email}</p></div>
        <div><p className="text-sm">Tipo de Usuário:</p><p className="font-semibold text-blue-logo">Administrador</p></div>
        <div><p className="text-sm">Times Criados:</p><p className="text-xl text-blue-logo">{teams.length}</p></div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="rounded-lg shadow-md p-4">
        <h4 className="font-semibold mb-2">Total de Times</h4>
        <p className="text-2xl font-bold text-blue-logo">{teams.length}</p>
      </div>
      <div className="rounded-lg shadow-md p-4">
        <h4 className="font-semibold mb-2">Alunos Cadastrados</h4>
        <p className="text-2xl font-bold text-green-600">{teams.reduce((total, t) => total + t.members.length, 0)}</p>
      </div>
      <div className="rounded-lg shadow-md p-4">
        <h4 className="font-semibold mb-2">Times Ativos</h4>
        <p className="text-2xl font-bold text-orange-500">{teams.filter(t => t.isActive).length}</p>
      </div>
    </div>
  </div>
);
