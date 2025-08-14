import { Link } from "react-router-dom";
import img from "../assets/images/not_found.png";
export const NotFound = () => {
  return (
 <div className="flex flex-col items-center justify-center min-h-screen bg-light p-6">
      
      {/* Título 1 */}
      <h1 className="text-2xl md:text-4xl font-extrabold gray-muted mb-6">
        401
      </h1>

      {/* Imagem alta e fina */}
      <img
        src={img}
        alt="Página não encontrada"
        className="w-32 h-48 md:w-40 md:h-64 mb-8"
      />

      {/* Título 2 */}
      <h1 className="text-2xl md:text-4xl font-extrabold gray-muted mb-6 text-center">
        Ops! Página não encontrada
      </h1>

      
      {/* Botão */}
      <Link
        to="/"
        className="bg-red-logo hover:bg-red-secondary text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105"
      >
        Voltar ao Início
      </Link>

    </div>
  );
};
