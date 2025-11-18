import { useEffect, useState } from "react";
import { MdClose, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { useAuth } from "../../hooks/useAuth";
import { getUserNotifications, deleteNotification } from "../../api/notifications";

export const TeacherNotificationsTab = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await getUserNotifications(user.id);
        setNotifications(data);
      } catch (error) {
        console.error("Erro ao carregar notificações:", error);
      }
    };

    if (user && user.type === "admin") {
      loadNotifications();
    }
  }, [user]);

  // Cálculos da paginação
  const totalPages = Math.ceil(notifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNotifications = notifications.slice(startIndex, endIndex);

  // Funções de navegação
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      const updatedNotifications = notifications.filter((n) => n.id !== id);
      setNotifications(updatedNotifications);

      // Se a página atual ficou vazia após a exclusão, volta para a página anterior
      const newTotalPages = Math.ceil(updatedNotifications.length / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      } else if (updatedNotifications.length === 0) {
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Erro ao deletar notificação:", error);
    }
  };

  // Função para formatar mensagem com data e hora em negrito
  const formatMessage = (message) => {
    // Regex para capturar data no formato dd/mm/yyyy ou dd/mm/aaaa
    const dateRegex = /(\d{1,2}\/\d{1,2}\/\d{4})/g;
    // Regex para capturar hora no formato HH:mm ou H:mm
    const timeRegex = /(\d{1,2}:\d{2})/g;

    let formattedMessage = message;

    // Substituir datas por versão em negrito
    formattedMessage = formattedMessage.replace(dateRegex, '<strong>$1</strong>');

    // Substituir horas por versão em negrito
    formattedMessage = formattedMessage.replace(timeRegex, '<strong>$1</strong>');

    return formattedMessage;
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4 text-dark">Notificações</h3>

      <div className="space-y-3">
        {notifications.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            Nenhuma notificação no momento
          </div>
        )}

        {currentNotifications.map((notification) => (
          <div
            key={notification.id}
            className="relative p-4 rounded-lg border border-black bg-soft"
          >
            <button
              onClick={() => handleDelete(notification.id)}
              aria-label="Deletar notificação"
              className="absolute top-2 right-2 text-gray-400 hover:text-red-primary cursor-pointer"
            >
              <MdClose size={18} />
            </button>

            <h4 className="font-medium text-dark dark:text-white">{notification.title}</h4>
            <p
              className="text-sm text-gray-600 dark:text-gray-200 mt-1"
              dangerouslySetInnerHTML={{
                __html: formatMessage(notification.message)
              }}
            />
            <span className="text-xs text-gray-muted dark:text-gray-300">
              {new Date(notification.createdAt).toLocaleString("pt-BR")}
            </span>
          </div>
        ))}
      </div>

      {/* Controles de Paginação */}
      {notifications.length > 0 && totalPages > 1 && (
        <div className="flex flex-col items-center mt-8 space-y-3">
          <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden">
            {/* Botão Página Anterior */}
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              aria-label="Página anterior"
              className={`px-4 py-2 text-sm font-medium cursor-pointer transition-colors border-r border-gray-200 ${currentPage === 1
                ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-logo'
                }`}
            >
              <MdChevronLeft size={18} />
            </button>

            {/* Indicador de Página */}
            <div className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-50 border-r border-gray-200 min-w-[120px] text-center">
              {currentPage} de {totalPages}
            </div>

            {/* Botão Próxima Página */}
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              aria-label="Próxima página"
              className={`px-4 py-2 text-sm font-medium cursor-pointer transition-colors ${currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-logo'
                }`}
            >
              <MdChevronRight size={18} />
            </button>
          </div>

          {/* Contador de registros */}
          <div className="text-xs text-gray-500">
            Mostrando {startIndex + 1}-{Math.min(endIndex, notifications.length)} de {notifications.length} notificações
          </div>
        </div>
      )}
    </div>
  );
};

