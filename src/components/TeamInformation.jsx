import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { sendNotificationToTeacher } from "../api.js/notifications";
import toast from "react-hot-toast";
import { LeaveTeamModal } from "./student-dashboard/LeaveTeamModal";
import { deleteTeamMember } from "../api.js/teams";

export const TeamInformation = ({ userTeam, setUserTeam }) => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");

  const handleLeaveTeam = async () => {
    if (!reason.trim()) {
      toast.error("Por favor, informe um motivo antes de sair do time.");
      return;
    }

    try {
      await sendNotificationToTeacher(
        user.name,
        `Solicitação de saída do time ${userTeam.name}. Motivo: ${reason}`
      );

      await deleteTeamMember(userTeam.id, user.id);

      setUserTeam((prev) => ({
        ...prev,
        members: prev.members.filter((m) => m.userId !== user.id),
        currentMembers: prev.currentMembers - 1,
      }));

      toast.success("Você saiu do time com sucesso!");
      setShowModal(false);
      setReason("");
      window.location.reload();

    } catch (error) {
      toast.error("Erro ao sair do time.");
      console.error(error);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {userTeam.description && (
          <div>
            <p className="text-sm ">Descrição:</p>
            <p className="font-medium">{userTeam.description}</p>
          </div>
        )}
        <div>
          <p className="text-sm ">Membros:</p>
          <p className="font-medium">
            {userTeam.currentMembers}/{userTeam.maxMembers}
          </p>
        </div>
      </div>

      <div>
        <h4 className="text-md font-semibold mb-3">Membros do Time</h4>
        <div className="space-y-2">
          {userTeam.members.map((member) => {
            const currentUserMember =
              member.userId.toString() === user.id.toString();
            return (
              <div
                key={member.userId}
                className={`flex items-center justify-between p-3 rounded-lg border border-gray-muted`}
              >
                <div className="flex items-center justify-center">
                  <p className="font-medium">
                    {member.user
                      ? member.user.name
                      : `Usuário #${member.userId}`}{" "}
                    {currentUserMember && <span className="text-xs text-gray-500 dark:text-gray-400">(Você)</span>} • <span className="text-xs text-gray-muted">{member.class}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-[9px] font-medium ${member.role === "leader"
                      ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                      : member.role === "subleader"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        : "bg-gray-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                      }`}
                  >
                    {member.role === "leader"
                      ? "Líder"
                      : member.role === "subleader"
                        ? "Sub-líder"
                        : "Membro"}
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

      <div className="mt-6">
        <button
          onClick={() => setShowModal(true)}
          className="w-full bg-red-secondary hover:bg-red-600 text-light font-bold py-2 px-4 rounded-lg shadow-lg transition-all"
        >
          Sair do Time
        </button>
      </div>

      <LeaveTeamModal
        open={showModal}
        onClose={() => setShowModal(false)}
        reason={reason}
        setReason={setReason}
        onConfirm={handleLeaveTeam}
      />
    </div>
  );
};
