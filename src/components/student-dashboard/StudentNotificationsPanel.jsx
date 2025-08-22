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

export const StudentNotificationsPanel = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

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
    } catch (error) {
      console.error("Erro ao deletar notificação:", error);
    }
  };

  const handleSendNotification = async (message) => {
    try {
      const newNotification = {
        userId: 1,
        title: `Nova mensagem do aluno ${user.username}`,
        message: `${user.username}: ${message}`,
        createdAt: new Date().toISOString(),
        isRead: false,
      };

      await createNotification(newNotification);
      setModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-dark">
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
        {notifications.map((notification) => (
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

            <h3 className="font-medium text-gray-900">{notification.title}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {notification.senderName ? `${notification.senderName}: ` : ""}
              {notification.message}
            </p>
            <span className="text-xs text-gray-500">
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

      <SendNotificationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSend={handleSendNotification}
      />
    </div>
  );
};
