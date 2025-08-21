import { useState, useEffect } from "react";
import { ProjectColumn } from "./ProjectColumn";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useAuth } from "../../hooks/useAuth";
import { fetchTeams, getTeamWithMembers } from "../../api.js/teams";
import { CustomLoader } from "../CustomLoader";
import { HiOutlineUserGroup } from "react-icons/hi";

const PROJECT_PHASES = [
  {
    id: 1,
    title: "Frontend",
    status: "todo"
  },
  {
    id: 2,
    title: "Backend",
    status: "todo"
  },
  {
    id: 3,
    title: "Design",
    status: "todo"
  },
  {
    id: 4,
    title: "Banco de Dados",
    status: "todo"
  },
  {
    id: 5,
    title: "Testes",
    status: "todo"
  },
  {
    id: 6,
    title: "Deploy",
    status: "todo"
  },
  {
    id: 7,
    title: "Documentação",
    status: "todo"
  }
];

const COLUMN_STATUSES = [
  { key: "todo", title: "A Fazer", color: "#6B7280" },
  { key: "in_progress", title: "Em Progresso", color: "#3B82F6" },
  { key: "done", title: "Concluído", color: "#10B981" }
];

export const ProjectBoard = () => {
  const { user } = useAuth();
  const [userTeam, setUserTeam] = useState(null);
  const [projectPhases, setProjectPhases] = useState(PROJECT_PHASES);
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

            const savedProgress = localStorage.getItem(`project-progress-${team.id}`);
            if (savedProgress) {
              const parsedProgress = JSON.parse(savedProgress);
              // Verificar se as fases salvas têm descrições mas as novas não têm
              // Se sim, limpar o cache e usar as novas fases
              const hasOldDescriptions = parsedProgress.some(phase => phase.description);
              const hasNewDescriptions = PROJECT_PHASES.some(phase => phase.description);
              
              if (hasOldDescriptions && !hasNewDescriptions) {
                // Limpar cache antigo e usar fases atualizadas
                localStorage.removeItem(`project-progress-${team.id}`);
                setProjectPhases(PROJECT_PHASES);
              } else {
                setProjectPhases(parsedProgress);
              }
            }
          }
        } catch (error) {
          console.error('Erro ao carregar time do usuário:', error);
        }
      }
      setLoading(false);
    };

    loadUserTeam();
  }, [user]);

  const handleDropPhase = (phaseId, newStatus) => {
    const updatedPhases = projectPhases.map((phase) =>
      phase.id === phaseId
        ? { ...phase, status: newStatus }
        : phase
    );

    setProjectPhases(updatedPhases);

    if (userTeam) {
      localStorage.setItem(`project-progress-${userTeam.id}`, JSON.stringify(updatedPhases));
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
      <div className="flex flex-col">
        <div className="mb-6 flex items-center gap-3">
          <HiOutlineUserGroup className="text-orange-logo text-2xl" />
          <h2 className="text-2xl font-bold text-blue-logo">
            {userTeam.name}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[400px]">
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

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
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
