import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { useAuth } from '../../hooks/useAuth'
import { getUserNotifications, markNotificationAsRead } from "../../api.js/notifications";

export const StudentNotificationsPanel = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const data = await getUserNotifications(user.id);
      setNotifications(data);
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Erro ao marcar como lida:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-dark">
      <h2 className="text-xl font-semibold mb-4">Notificações</h2>
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            onClick={() => handleMarkAsRead(notification.id)}
            className={`p-4 rounded-lg border cursor-pointer transition ${notification.isRead
              ? "bg-gray-50"
              : "bg-blue-50 border-blue-200 hover:bg-blue-100"
              }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{notification.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                <span className="text-xs text-gray-500">
                  {new Date(notification.createdAt).toLocaleString("pt-BR")}
                </span>
              </div>
              {!notification.isRead && (
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              )}
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <FaBell className="mx-auto text-3xl mb-2" />
            <p>Nenhuma notificação no momento</p>
          </div>
        )}
      </div>
    </div>
  );
};
