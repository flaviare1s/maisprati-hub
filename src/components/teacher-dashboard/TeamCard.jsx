import { FaCopy, FaCheck, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { BsKanban } from "react-icons/bs";
import { HiOutlineUserGroup } from "react-icons/hi";
import { useState, useEffect } from 'react';
import { toggleTeamStatus } from '../../api.js/teams';
import { TeamMembersModal } from './TeamMembersModal';
import { ConfirmationModal } from '../ConfirmationModal';
import toast from 'react-hot-toast';

export const TeamCard = ({ team, onSelect }) => {
  const [copiedCode, setCopiedCode] = useState(null);
  const [localTeam, setLocalTeam] = useState(team);
  const [isToggling, setIsToggling] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  // Sincronizar estado local quando o prop team mudar
  useEffect(() => {
    setLocalTeam(team);
  }, [team]);

  const copySecurityCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggleStatus = async () => {
    // Se está inativando (team está ativo), mostra confirmação
    if (localTeam.isActive) {
      setShowConfirmationModal(true);
      return;
    }

    // Se está ativando, executa diretamente
    await executeToggleStatus();
  };

  const executeToggleStatus = async () => {
    const originalStatus = localTeam.isActive;
    setIsToggling(true);

    try {
      setLocalTeam(prev => ({ ...prev, isActive: !prev.isActive }));

      const updatedTeam = await toggleTeamStatus(localTeam.id, localTeam.isActive);

      setLocalTeam(updatedTeam);

      toast.success(`Time ${originalStatus ? 'inativado' : 'ativado'} com sucesso!`);

    } catch (error) {
      setLocalTeam(prev => ({ ...prev, isActive: originalStatus }));
      console.error("Erro ao alternar status:", error);
      toast.error("Erro ao alternar status do time");
    } finally {
      setIsToggling(false);
    }
  };

  const handleConfirmToggle = async () => {
    setShowConfirmationModal(false);
    await executeToggleStatus();
  };

  const handleCancelToggle = () => {
    setShowConfirmationModal(false);
  };

  return (
    <div className="rounded-lg shadow-md p-4 border">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-blue-logo">{localTeam.name}</h4>
          <p className="text-sm text-gray-600 mb-2">{localTeam.description}</p>
          {localTeam.area && (
            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {localTeam.area}
            </span>
          )}
        </div>
        <div className="flex gap-0">
          <button
            onClick={() => setShowMembersModal(true)}
            className="p-2 text-green-600 hover:text-green-800 cursor-pointer rounded-md"
            title="Visualizar membros"
          >
            <HiOutlineUserGroup />
          </button>
          <button
            onClick={onSelect}
            className="p-2 text-blue-logo hover:text-blue-600 transition-colors cursor-pointer rounded-md"
            title="Visualizar progresso do time"
          >
            <BsKanban />
          </button>
          <button
            onClick={handleToggleStatus}
            disabled={isToggling}
            className={`p-2 cursor-pointer rounded-md transition-colors ${isToggling
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-orange-logo hover:text-orange-600'
              }`}
            title={isToggling ? 'Alterando...' : (localTeam.isActive ? "Inativar time" : "Ativar time")}
          >
            {isToggling ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
            ) : (
              localTeam.isActive ? <FaToggleOn /> : <FaToggleOff />
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 text-sm">
        <div>
          <span className="font-medium">Membros:</span> {localTeam.members?.length || 0}/{localTeam.maxMembers}
        </div>
        <div>
          <span className="font-medium">Código:</span>
          <button
            onClick={() => copySecurityCode(localTeam.securityCode)}
            className="ml-1 px-2 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200 inline-flex items-center gap-1 transition-colors"
          >
            {localTeam.securityCode}
            {copiedCode === localTeam.securityCode ? <FaCheck className="text-green-600" /> : <FaCopy />}
          </button>
        </div>
      </div>

      {/* Team Members Modal */}
      {showMembersModal && (
        <TeamMembersModal
          team={localTeam}
          onClose={() => setShowMembersModal(false)}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={showConfirmationModal}
        message={`Tem certeza que deseja inativar o time "${localTeam.name}"?`}
        onClose={handleCancelToggle}
        onConfirm={handleConfirmToggle}
      />
    </div>
  );
};
