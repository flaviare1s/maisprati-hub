export const NotificationsPanel = () => {
  const mockNotifications = [
    {
      id: 1,
      type: 'team_invitation',
      title: 'Convite para Time A',
      message: 'Você recebeu um convite para se juntar ao Time A!',
      time: '5 min atrás',
      isRead: false
    },
    {
      id: 2,
      type: 'forum_reply',
      title: 'Nova resposta no fórum',
      message: 'Alguém respondeu seu post sobre React',
      time: '1 hora atrás',
      isRead: true
    }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Notificações</h2>
      <div className="space-y-3">
        {mockNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg border ${notification.isRead ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
              }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{notification.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                <span className="text-xs text-gray-500">{notification.time}</span>
              </div>
              {!notification.isRead && (
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              )}
            </div>
          </div>
        ))}
        {mockNotifications.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <FaBell className="mx-auto text-3xl mb-2" />
            <p>Nenhuma notificação no momento</p>
          </div>
        )}
      </div>
    </div>
  );
};
