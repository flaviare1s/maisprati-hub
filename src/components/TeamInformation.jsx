import { useAuth } from "../hooks/useAuth";

export const TeamInformation = ({ userTeam }) => {
  const { user } = useAuth();
 
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm ">Nome do Time:</p>
          <p className="font-medium text-blue-logo text-lg">{userTeam.name}</p>
        </div>
        <div>
          <p className="text-sm ">Descrição:</p>
          <p className="font-medium">{userTeam.description}</p>
        </div>
        <div>
          <p className="text-sm ">Membros:</p>
          <p className="font-medium">
            {userTeam.currentMembers}/{userTeam.maxMembers}
          </p>
        </div>
        <div>
          <p className="text-sm ">Status:</p>
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${userTeam.isActive
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
            }`}>
            {userTeam.isActive ? 'Ativo' : 'Inativo'}
          </span>
        </div>
      </div>

      <div>
        <h4 className="text-md font-semibold mb-3">
          Membros do Time
        </h4>
        <div className="space-y-2">
          {userTeam.members.map((member) => {
            const currentUserMember = member.userId === user.id;
            return (
              <div
                key={member.userId}
                className={`flex items-center justify-between p-3 rounded-lg border border-gray-muted`}
              >
                <div>
                  <p className="font-medium">
                    {member.user ? member.user.username : `Usuário #${member.userId}`} {currentUserMember && '(Você)'}
                  </p>
                  <p className="text-sm ">
                    {member.specialization}
                  </p>
                  {member.user && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {member.user.email} • Turma: {member.user.turma}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${member.role === 'leader'
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                    : member.role === 'subleader'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                    }`}>
                    {member.role === 'leader' ? 'Líder' :
                      member.role === 'subleader' ? 'Sub-líder' : 'Membro'}
                  </span>
                  {member.subLeaderType && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {member.subLeaderType}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}
