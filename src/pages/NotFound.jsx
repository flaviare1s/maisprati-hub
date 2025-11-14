import { Link } from "react-router-dom";
import img from "../assets/images/not_found.png";

export const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6" data-testid="not-found-page">
      {/* Título 1 */}
      <h2 className="text-5xl font-extrabold text-orange-logo mb-6">
        404
      </h2>

      <img
        src={img}
        alt="Página não encontrada"
        className="w-32 sm:w-64 mb-8"
      />

      {/* Título 2 */}
      <h3 className="text-2xl font-extrabold text-orange-logo mb-6 text-center">
        Ops! Página não encontrada
      </h3>

      {/* Botão */}
      <Link
        to="/"
        className="bg-blue-logo hover:bg-orange-logo text-light font-bold  px-6 py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105"
      >
        Voltar ao Início
      </Link>
    </div>
  );
};
