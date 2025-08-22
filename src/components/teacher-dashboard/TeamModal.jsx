export const TeamModal = ({ team, onClose }) => (
  <div className="fixed inset-0 bg-[#000000b7] flex items-center justify-center p-4 z-50">
    <div className="bg-light rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-blue-logo">{team.name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">×</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Informações do Time</h4>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Descrição:</span> {team.description}</p>
              <p><span className="font-medium">Área:</span> {team.area || 'Não especificada'}</p>
              <p><span className="font-medium">Código:</span> {team.securityCode}</p>
              <p><span className="font-medium">Membros:</span> {team.members?.length || 0}/{team.maxMembers}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Membros do Time</h4>
            <div className="space-y-2">
              {team.members?.length > 0 ? (
                team.members.map((member, index) => (
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
);
