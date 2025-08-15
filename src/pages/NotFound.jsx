import { Link } from "react-router-dom";
import img from "../assets/images/not_found.png";

export const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      {/* Título 1 */}
      <h1 className="text-2xl md:text-4xl font-extrabold text-[var(--color-gray-muted)] mb-6">
        404
      </h1>

      {/* Imagem */}
      <img
        src={img}
        alt="Página não encontrada"
        className="w-32 h-48 md:w-40 md:h-64 mb-8 object-contain"
      />

      {/* Título 2 */}
      <h1 className="text-2xl md:text-4xl font-extrabold text-[var(--color-gray-muted)] mb-6 text-center">
        Ops! Página não encontrada
      </h1>

      {/* Botão */}
      <Link
        to="/"
        className="bg-[var(--color-red-logo)] hover:bg-[var(--color-red-secondary)] text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105"
      >
        Voltar ao Início
      </Link>
    </div>
  );
};
