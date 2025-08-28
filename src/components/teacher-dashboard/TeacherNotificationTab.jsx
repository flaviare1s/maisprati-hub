import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { useAuth } from "../../hooks/useAuth";
import { getUserNotifications, deleteNotification } from "../../api.js/notifications";

export const TeacherNotificationsTab = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user && user.type === "admin") {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      // Buscar notificações do professor (id do professor, assumindo 1)
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

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4 text-dark">Notificações</h3>

      <div className="space-y-3">
        {notifications.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            Nenhuma notificação no momento
          </div>
        )}

        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="relative p-4 rounded-lg border border-black bg-soft"
          >

            <button
              onClick={() => handleDelete(notification.id)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-primary cursor-pointer"
            >
              <MdClose size={18} />
            </button>

            <h4 className="font-medium text-dark">{notification.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
            <span className="text-xs text-gray-muted">
              {new Date(notification.createdAt).toLocaleString("pt-BR")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
