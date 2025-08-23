import { FaEye, FaCopy, FaCheck, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { useState } from 'react';
import { toggleTeamStatus } from '../../api.js/teams';

export const TeamCard = ({ team, onSelect }) => {
  const [copiedCode, setCopiedCode] = useState(null);
  const [localTeam, setLocalTeam] = useState(team);

  const copySecurityCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggleStatus = async () => {
    try {
      const updatedTeam = await toggleTeamStatus(localTeam.id, localTeam.isActive);
      setLocalTeam(updatedTeam);
    } catch (error) {
      console.error("Erro ao alternar status:", error);
    }
  };

  return (
    <div className="rounded-lg shadow-md p-4 border">
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
        <div>
          <button onClick={onSelect} className="p-2 text-blue-logo hover:bg-text-blue-600 cursor-pointer rounded-md" title="Visualizar Time">
            <FaEye />
          </button>
          <button
            onClick={handleToggleStatus}
            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-md"
            title={localTeam.isActive ? "Inativar Time" : "Ativar Time"}
          >
            {localTeam.isActive ? <FaToggleOn /> : <FaToggleOff />}
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
  );
};
