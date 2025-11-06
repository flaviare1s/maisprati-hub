import { useLocation } from "react-router-dom";
import { ProjectBoard } from "./ProjectBoard";
import { Calendar } from "../Calendar";

export const ProjectBoardWithLayout = () => {
  const location = useLocation();

  // Se estamos na rota /teams/:teamId/board, precisamos adicionar o layout manualmente
  const needsLayout = location.pathname.startsWith('/teams/') && location.pathname.endsWith('/board');

  if (needsLayout) {
    return (
      <div className="px-2 py-4 md:px-6 my-auto overflow-x-hidden text-dark dark:text-gray-100">
        <div className="flex flex-col-reverse md:flex-row gap-6 justify-center items-start">
          <div className="w-full md:w-[240px] order-2 md:order-1">
            <Calendar />
          </div>
          <div className="dashboard-main w-full md:flex-1 rounded-lg py-6 px-2 sm:px-6 shadow-lg order-1 md:order-2">
            <h1 className="text-2xl font-bold mb-4 text-dark dark:text-gray-100">
              Projeto da Equipe
            </h1>
            <ProjectBoard />
          </div>
        </div>
      </div>
    );
  }

  // Se não precisa do layout, renderiza apenas o ProjectBoard
  return <ProjectBoard />;
};