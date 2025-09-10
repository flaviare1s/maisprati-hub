import { useDrag } from "react-dnd";
import { useRef } from "react";
import { FaUsers, FaClock, FaCheckCircle, FaLock } from "react-icons/fa";

export const ProjectPhaseCard = ({
  phase,
  userTeam,
  canDrag = true
}) => {
  const dragRef = useRef(null);

  const [{ opacity, isDragging }, drag] = useDrag({
    type: "PROJECT_PHASE",
    item: { id: phase.id },
    canDrag: () => canDrag,
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 1,
      isDragging: monitor.isDragging(),
    }),
  });

  if (canDrag) {
    drag(dragRef);
  }

  const getStatusIcon = () => {
    switch (phase.status) {
      case "done":
        return <FaCheckCircle className="text-green-500" />;
      case "in_progress":
        return <FaClock className="text-blue-logo" />;
      default:
        return <FaClock className="text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (phase.status) {
      case "done":
        return "border-l-green-500 bg-green-50";
      case "in_progress":
        return "border-l-blue-logo bg-blue-50";
      default:
        return "border-l-gray-400 bg-gray-50";
    }
  };

  const getCursorClass = () => {
    if (!canDrag) return "cursor-default";
    if (isDragging) return "cursor-grabbing";
    return "cursor-grab";
  };

  return (
    <div
      ref={dragRef}
      className={`p-4 rounded-lg border-l-4 shadow-sm transition-all duration-200 ${getStatusColor()} ${getCursorClass()} ${isDragging ? 'rotate-2 scale-105' : ''
        } ${!canDrag ? 'opacity-75' : ''}`}
      style={{ opacity }}
      title={!canDrag ? "Apenas estudantes podem mover cards" : "Arraste para mover"}
    >
      <div className={`flex items-start justify-between ${phase.description ? 'mb-2' : 'mb-3'}`}>
        <h4 className="font-semibold text-gray-800">{phase.title}</h4>
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          {!canDrag && <FaLock className="text-gray-400 text-xs" />}
        </div>
      </div>

      {phase.description && (
        <p className="text-sm text-gray-600 mb-3">
          {phase.description}
        </p>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <FaUsers />
          <span>{userTeam.name}</span>
        </div>
      </div>

      <div className="mt-2 flex justify-between items-center">
        {(phase.startedAt || phase.completedAt) && (
          <div className="text-xs text-gray-500">
            {phase.completedAt
              ? `Concluído em ${new Date(phase.completedAt).toLocaleDateString()}`
              : phase.startedAt
                ? `Iniciado em ${new Date(phase.startedAt).toLocaleDateString()}`
                : ''
            }
          </div>
        )}
      </div>
    </div>
  );
};
