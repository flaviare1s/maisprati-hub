import { useDrop } from "react-dnd";
import { ProjectPhaseCard } from "./ProjectPhaseCard";
import { useRef } from "react";

export const ProjectColumn = ({
  status,
  title,
  color,
  phases,
  onDropPhase,
  userTeam
}) => {
  const dropRef = useRef(null);

  const [{ isOver }, drop] = useDrop({
    accept: "PROJECT_PHASE",
    drop: (item) => {
      onDropPhase(item.id, status);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drop(dropRef);

  return (
    <div
      ref={dropRef}
      className={`bg-light p-4 rounded-lg shadow-md border-t-4 transition-all duration-200 flex flex-col h-full ${isOver ? 'bg-gray-50 scale-105' : ''
        }`}
      style={{ borderTopColor: color }}
    >
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h3 className="text-lg font-semibold" style={{ color: color }}>
          {title}
        </h3>
        <span className="bg-gray-100 text-gray-muted px-2 py-1 rounded-full text-sm font-medium">
          {phases.length}
        </span>
      </div>

      <div className="space-y-3">
        {phases.map((phase) => (
          <ProjectPhaseCard
            key={phase.id}
            phase={phase}
            userTeam={userTeam}
          />
        ))}

        {phases.length === 0 && (
          <div className="text-gray-400 text-center py-8">
            <p>Nenhuma fase nesta coluna</p>
          </div>
        )}
      </div>
    </div>
  );
};
