import { useState, useEffect } from "react";
import { ProjectColumn } from "./ProjectColumn";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useAuth } from "../../hooks/useAuth";
import { fetchTeams, getTeamWithMembers } from "../../api.js/teams";
import { fetchProjectProgress, createProjectProgress, updatePhaseStatus } from "../../api.js/projectProgress";
import { CustomLoader } from "../CustomLoader";
import { HiOutlineUserGroup } from "react-icons/hi";
import toast from 'react-hot-toast';

const COLUMN_STATUSES = [
  { key: "todo", title: "A Fazer", color: "#6B7280" },
  { key: "in_progress", title: "Em Progresso", color: "#3B82F6" },
  { key: "done", title: "Concluído", color: "#10B981" }
];

export const ProjectBoard = () => {
  const { user } = useAuth();
  const [userTeam, setUserTeam] = useState(null);
  const [projectPhases, setProjectPhases] = useState([]);
  const [projectProgress, setProjectProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserTeam = async () => {
      if (user && user.hasGroup) {
        try {
          const teams = await fetchTeams();
          const team = teams.find(team =>
            team.members.some(member => member.userId.toString() === user.id.toString())
          );

          if (team) {
            const teamWithDetails = await getTeamWithMembers(team.id);
            setUserTeam(teamWithDetails);

            // Buscar progresso do projeto da API
            let progress = await fetchProjectProgress(team.id);

            // Se não existir progresso, criar um novo
            if (!progress) {
              progress = await createProjectProgress(team.id);
            }

            setProjectProgress(progress);
            setProjectPhases(progress.phases || []);
          }
        } catch (error) {
          console.error('Erro ao carregar time do usuário:', error);
          toast.error('Erro ao carregar dados do projeto');
        }
      }
      setLoading(false);
    };

    loadUserTeam();
  }, [user]);

  const handleDropPhase = async (phaseId, newStatus) => {
    if (!projectProgress) return;

    try {
      // Atualizar na API
      const updatedProgress = await updatePhaseStatus(
        projectProgress.id,
        phaseId,
        newStatus,
        user.id
      );

      // Atualizar estado local
      setProjectProgress(updatedProgress);
      setProjectPhases(updatedProgress.phases);

      toast.success('Status da fase atualizado!');
    } catch (error) {
      console.error('Erro ao atualizar fase:', error);
      toast.error('Erro ao atualizar status da fase');
    }
  };

  if (loading) {
    return (
      <CustomLoader />
    );
  }

  if (!userTeam) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-muted">Você precisa estar em um time para acessar o projeto.</p>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-full">
        <div className="mb-6 flex items-center gap-3 flex-shrink-0">
          <HiOutlineUserGroup className="text-orange-logo text-2xl" />
          <h2 className="text-2xl font-bold text-blue-logo">
            {userTeam.name}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 overflow-hidden">
          {COLUMN_STATUSES.map((column) => (
            <ProjectColumn
              key={column.key}
              status={column.key}
              title={column.title}
              color={column.color}
              phases={projectPhases.filter((phase) => phase.status === column.key)}
              onDropPhase={handleDropPhase}
              userTeam={userTeam}
            />
          ))}
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg flex-shrink-0">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-logo h-3 rounded-full transition-all duration-300"
              style={{
                width: `${(projectPhases.filter(p => p.status === 'done').length / projectPhases.length) * 100}%`
              }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {projectPhases.filter(p => p.status === 'done').length} de {projectPhases.length} fases concluídas
          </p>
        </div>
      </div>
    </DndProvider>
  );
};
