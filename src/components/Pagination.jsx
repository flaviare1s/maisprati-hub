import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import PropTypes from 'prop-types';

/**
 * Componente de paginação reutilizável
 * -------------------------------
 * Props:
 * - totalItems: número total de itens na lista
 * - itemsPerPage: quantidade de itens por página (padrão 5)
 * - currentPage: página atual (controlado pelo componente pai)
 * - onPageChange: função callback para alterar a página (recebe número da página)
 * - showCounts: mostra o texto "Mostrando X-Y de Z" (default true)
 * - className: classes adicionais para estilização do container
 */
export const Pagination = ({
  totalItems,
  itemsPerPage = 5,
  currentPage,
  onPageChange,
  showCounts = true,
  className = '',
}) => {
  // Calcula o número total de páginas
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Calcula o índice inicial e final para exibir no contador
  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(totalItems, currentPage * itemsPerPage);

  // Define se os botões de navegação estão desabilitados
  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;

  // Funções de navegação, chamando onPageChange passado pelo pai
  const goPrev = () => {
    if (!prevDisabled) onPageChange(currentPage - 1);
  };

  const goNext = () => {
    if (!nextDisabled) onPageChange(currentPage + 1);
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Controles de navegação */}
      <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Botão Página Anterior */}
        <button
          onClick={goPrev}
          disabled={prevDisabled}
          aria-label="Página anterior"
          className={`px-4 py-2 text-sm font-medium cursor-pointer transition-colors ${prevDisabled ? 'text-gray-400 cursor-not-allowed bg-gray-50' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-logo'}`}
        >
          <MdChevronLeft size={18} />
        </button>

        {/* Indicador da página atual / total de páginas */}
        <div className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-50 border-r border-gray-200 min-w-[120px] text-center">
          {currentPage} de {totalPages}
        </div>

        {/* Botão Próxima Página */}
        <button
          onClick={goNext}
          disabled={nextDisabled}
          aria-label="Próxima página"
          className={`px-4 py-2 text-sm font-medium cursor-pointer transition-colors ${nextDisabled ? 'text-gray-400 cursor-not-allowed bg-gray-50' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-logo'}`}
        >
          <MdChevronRight size={18} />
        </button>
      </div>

      {/* Contador de registros exibindo "Mostrando X-Y de Z" */}
      {showCounts && (
        <div className="text-xs text-gray-500 mt-3">
          {totalItems === 0 ? 'Nenhum registro' : `Mostrando ${startIndex}-${endIndex} de ${totalItems}`}
        </div>
      )}
    </div>
  );
};

// Validação de tipos das props
Pagination.propTypes = {
  totalItems: PropTypes.number.isRequired, // obrigatório
  itemsPerPage: PropTypes.number, // opcional, padrão 5
  currentPage: PropTypes.number.isRequired, // obrigatório, controlado pelo pai
  onPageChange: PropTypes.func.isRequired, // obrigatório, função para alterar a página
  showCounts: PropTypes.bool, // opcional, exibir contador
  className: PropTypes.string, // opcional, classes adicionais
};
