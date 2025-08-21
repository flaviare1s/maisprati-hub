import { useDrag } from "react-dnd";
import { useRef } from "react";
import { FaUsers, FaClock, FaCheckCircle } from "react-icons/fa";

export const ProjectPhaseCard = ({ phase, userTeam }) => {
  const dragRef = useRef(null);

  const [{ opacity, isDragging }, drag] = useDrag({
    type: "PROJECT_PHASE",
    item: { id: phase.id },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 1,
      isDragging: monitor.isDragging(),
    }),
  });

  drag(dragRef);

  const getStatusIcon = () => {
    switch (phase.status) {
      case "done":
        return <FaCheckCircle className="text-green-500" />;
      case "in_progress":
        return <FaClock className="text-blue-500" />;
      default:
        return <FaClock className="text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (phase.status) {
      case "done":
        return "border-l-green-500 bg-green-50";
      case "in_progress":
        return "border-l-blue-500 bg-blue-50";
      default:
        return "border-l-gray-400 bg-gray-50";
    }
  };

  return (
    <div
      ref={dragRef}
      className={`p-4 rounded-lg border-l-4 shadow-sm cursor-pointer transition-all duration-200 ${getStatusColor()} ${isDragging ? 'rotate-2 scale-105' : ''
        }`}
      style={{ opacity }}
    >
      <div className={`flex items-start justify-between ${phase.description ? 'mb-2' : 'mb-3'}`}>
        <h4 className="font-semibold text-gray-800">{phase.title}</h4>
        {getStatusIcon()}
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
        </div>        {phase.status === "done" && (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
            Concluído
          </span>
        )}

        {phase.status === "in_progress" && (
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
            Em Andamento
          </span>
        )}
      </div>
    </div>
  );
};
