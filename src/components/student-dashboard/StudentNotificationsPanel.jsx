import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { useAuth } from "../../hooks/useAuth";
import {
  getUserNotifications,
  deleteNotification,
  createNotification,
} from "../../api.js/notifications";
import { SendNotificationModal } from "./SendNotificationModal";
import { Pagination } from "../Pagination";

export const StudentNotificationsPanel = ({ refreshNotificationCount }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (user) loadNotifications();
  }, [user]);

  const loadNotifications = async () => {
    try {
      const data = await getUserNotifications(user.id);
      setNotifications(data);
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (refreshNotificationCount) {
        refreshNotificationCount();
      }
    } catch (error) {
      console.error("Erro ao deletar notificação:", error);
    }
  };

  const handleSendNotification = async (message) => {
    try {
      const newNotification = {
        userId: 1,
        title: `Nova mensagem do aluno ${user.name}`,
        message: `${user.name}: ${message}`,
        createdAt: new Date().toISOString(),
        isRead: false,
      };

      await createNotification(newNotification);
      setModalOpen(false);
    } catch (error) {
      console.error(error);
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


  // Calcular paginação
  const totalPages = Math.ceil(notifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNotifications = notifications.slice(startIndex, endIndex);

  return (
    <div className="max-w-2xl mx-auto text-dark">
      <style>{`
        .notification-message-text {
          color: #000000 !important;
        }
        .dark .notification-message-text {
          color: #ffffff !important;
        }
        .notification-message-text strong {
          color: #000000 !important;
          font-weight: 700 !important;
        }
        .dark .notification-message-text strong {
          color: #ffffff !important;
        }
      `}</style>
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
        <h2 className="text-xl font-semibold mb-2">Notificações</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-logo text-light px-4 py-2 rounded text-sm hover:bg-blue-600 cursor-pointer"
        >
          Enviar notificação ao Professor
        </button>
      </div>

      <div className="space-y-3">
        {currentNotifications.map((notification) => (
          <div
            key={notification.id}
            className="relative p-4 rounded-lg border bg-blue-50"
          >
            <button
              onClick={() => handleDelete(notification.id)}
              className="absolute top-2 right-2 text-gray-muted hover:text-red-primary cursor-pointer"
            >
              <MdClose size={18} />
            </button>

            <h3 className="font-medium text-gray-900 dark:text-white">{notification.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-200 mt-1">
              {notification.senderName ? `${notification.senderName}: ` : ""}
              <span
                className="notification-message-text"
                dangerouslySetInnerHTML={{
                  __html: formatMessage(notification.message)
                }}
              />
            </p>
            <span className="text-xs text-gray-700 dark:text-gray-300">
              {new Date(notification.createdAt).toLocaleString("pt-BR")}
            </span>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <FaBell className="mx-auto text-3xl mb-2" />
            <p>Nenhuma notificação no momento</p>
          </div>
        )}
      </div>

      {/* Controles de Paginação */}
      {notifications.length > 0 && totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            totalItems={notifications.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
            showCounts={true}
            className=""
          />
        </div>
      )}


      <SendNotificationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSend={handleSendNotification}
      />
    </div>
  );
};
