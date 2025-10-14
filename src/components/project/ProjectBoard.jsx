import { useState, useEffect } from "react";
import { ProjectColumn } from "./ProjectColumn";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useAuth } from "../../hooks/useAuth";
import { fetchTeams, getTeamWithMembers } from "../../api.js/teams";
import {
  fetchProjectProgress,
  createProjectProgress,
  updatePhaseStatus,
} from "../../api.js/projectProgress";
import { CustomLoader } from "../CustomLoader";
import { HiOutlineUserGroup } from "react-icons/hi";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const COLUMN_STATUSES = [
  { key: "todo", title: "A Fazer", color: "#6B7280" },
  { key: "in_progress", title: "Em Progresso", color: "#3B82F6" },
  { key: "done", title: "Concluído", color: "#10B981" },
];

const mapStatusToBackend = (frontendStatus) => {
  const statusMap = {
    'todo': 'TODO',
    'in_progress': 'IN_PROGRESS',
    'done': 'DONE'
  };
  return statusMap[frontendStatus] || frontendStatus;
};

const mapStatusToFrontend = (backendStatus) => {
  const statusMap = {
    'TODO': 'todo',
    'IN_PROGRESS': 'in_progress',
    'DONE': 'done'
  };
  return statusMap[backendStatus] || backendStatus.toLowerCase();
};

export const ProjectBoard = () => {
  const { user } = useAuth();
  const { teamId } = useParams();
  const [userTeam, setUserTeam] = useState(null);
  const [projectPhases, setProjectPhases] = useState([]);
  const [projectProgress, setProjectProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      try {
        let team = null;
        let progress = null;

        if (teamId) {
          team = await getTeamWithMembers(teamId);
          progress = await fetchProjectProgress(teamId);
          if (!progress) progress = await createProjectProgress(teamId);
        } else if (user.hasGroup) {
          const teams = await fetchTeams();
          team = teams.find((t) =>
            t.members.some((m) => m.userId.toString() === user.id.toString())
          );

          if (team) {
            team = await getTeamWithMembers(team.id);
            progress = await fetchProjectProgress(team.id);
            if (!progress) progress = await createProjectProgress(team.id);
          }
        } else {
          team = {
            id: `solo-${user.id}`,
            name: `${user.codename} (Trabalho Solo)`,
            members: [user],
          };
          progress = await fetchProjectProgress(team.id);
          if (!progress) progress = await createProjectProgress(team.id);
        }

        setUserTeam(team);
        setProjectProgress(progress);

        const mappedPhases = progress?.phases?.map(phase => ({
          ...phase,
          status: mapStatusToFrontend(phase.status)
        })) || [];

        setProjectPhases(mappedPhases);
      } catch (error) {
        console.error("Erro ao carregar projeto:", error);
        toast.error("Erro ao carregar dados do projeto");
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [teamId, user]);

  const handleDropPhase = async (phaseId, newStatus) => {
    if (!projectProgress || !userTeam) return;

    try {
      const phase = projectPhases.find(p => p.id === phaseId);
      if (!phase) {
        toast.error("Fase não encontrada");
        return;
      }

      const backendStatus = mapStatusToBackend(newStatus);

      const updatedProgress = await updatePhaseStatus(
        userTeam.id,
        phase.title,
        backendStatus,
        user.id
      );

      setProjectProgress(updatedProgress);

      const mappedPhases = updatedProgress?.phases?.map(phase => ({
        ...phase,
        status: mapStatusToFrontend(phase.status)
      })) || [];

      setProjectPhases(mappedPhases);

      toast.success("Status da fase atualizado!");
    } catch (error) {
      console.error("Erro ao atualizar fase:", error);
      toast.error("Erro ao atualizar status da fase");
    }
  };

  if (loading) {
    return <CustomLoader />;
  }

  if (!userTeam) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-muted">
          Você precisa estar vinculado a um time para acessar o projeto.
        </p>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-full p-2">
        <div className="mb-6 flex items-center gap-3 flex-shrink-0">
          <HiOutlineUserGroup className="text-orange-logo text-2xl" />
          <h2 className="text-2xl font-bold text-blue-logo">{userTeam.name}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 overflow-hidden">
          {COLUMN_STATUSES.map((column) => (
            <ProjectColumn
              key={column.key}
              status={column.key}
              title={column.title}
              color={column.color}
              phases={projectPhases.filter(
                (phase) => phase.status === column.key
              )}
              onDropPhase={handleDropPhase}
              userTeam={userTeam}
              user={user}
            />
          ))}
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg flex-shrink-0">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-logo h-3 rounded-full transition-all duration-300"
              style={{
                width: `${(projectPhases.filter((p) => p.status === "done").length /
                  projectPhases.length) *
                  100
                  }%`,
              }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {projectPhases.filter((p) => p.status === "done").length} de{" "}
            {projectPhases.length} fases concluídas
          </p>
        </div>
      </div>
    </DndProvider>
  );
};
