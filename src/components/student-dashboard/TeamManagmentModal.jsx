import { useForm } from "react-hook-form";
import { SubmitButton } from "../SubmitButton"
import { updateMemberRole, updateTeam, fetchTeamById } from "../../api.js/teams";
import toast from "react-hot-toast";

export const TeamManagmentModal = ({ team, onClose, setUserTeam }) => {
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      teamName: team.name,
      teamDescription: team.description || "",
      members: team.members.map((m) => ({
        ...m,
        role: m.role?.toLowerCase() || "member",
        subLeaderType: m.subLeaderType || "",
      })),
    },
  });

  const members = watch("members");

  const onSubmit = async (data) => {
    try {
      await updateTeam(team.id, {
        name: data.teamName,
        description: data.teamDescription
      });

      for (const member of data.members) {
        await updateMemberRole(
          team.id,
          member.userId,
          member.role,
          member.role === "subleader" ? member.subLeaderType : null
        );
      }

      const updatedTeam = await fetchTeamById(team.id);

      setUserTeam(updatedTeam);

      toast.success("Time atualizado com sucesso!");
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar time:", error);
      toast.error("Erro ao atualizar time");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-blue-logo">Gerenciar {team.name}</h3>
          <button type="button" onClick={onClose} className="text-red-primary cursor-pointer text-3xl hover:text-shadow-red-secondary">
            ×
          </button>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Nome do Time</label>
          <input
            type="text"
            {...register("teamName", { required: true })}
            className="w-full border px-3 py-2 rounded mb-2"
          />

          <label className="block font-medium mb-1">Descrição</label>
          <textarea
            {...register("teamDescription")}
            className="w-full border px-3 py-2 rounded mb-2"
            rows={3}
          />

          <p className="text-sm text-gray-500">
            Membros: {members.length}/{team.maxMembers || 10}
          </p>
        </div>

        <div className="space-y-4">
          {members.map((member, index) => {
            const alreadyHasLeader = members.some(
              (m, i) => m.role === "leader" && i !== index
            );

            return (
              <div key={member.userId} className="p-4 border rounded-lg flex flex-col gap-2">
                <p className="font-medium">
                  {member.user?.name || `Usuário #${member.userId}`}
                </p>

                <label className="text-sm">Role</label>
                <select
                  {...register(`members.${index}.role`)}
                  className="border px-2 py-1 rounded"
                >
                  {!alreadyHasLeader && (
                    <option value="leader">Líder</option>
                  )}
                  <option value="subleader">Sub-líder</option>
                  <option value="member">Membro</option>
                </select>

                {members[index].role === "subleader" && (
                  <>
                    <label className="text-sm">Tipo de Sub-líder</label>
                    <input
                      type="text"
                      {...register(`members.${index}.subLeaderType`)}
                      className="border px-2 py-1 rounded"
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <SubmitButton label="Salvar" />
        </div>
      </form>
    </div>
  );
};
