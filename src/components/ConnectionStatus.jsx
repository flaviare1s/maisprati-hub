import { useState, useEffect } from 'react';
import { MdWifiOff, MdWifi } from 'react-icons/md';

export const ConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineWarning, setShowOfflineWarning] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineWarning(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineWarning(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Esconde o aviso após 5 segundos quando volta online
    if (isOnline && showOfflineWarning) {
      const timer = setTimeout(() => {
        setShowOfflineWarning(false);
      }, 5000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOnline, showOfflineWarning]);

  if (!showOfflineWarning && isOnline) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 p-3 text-center text-white font-medium transition-all duration-300 ${isOnline ? 'bg-green-600' : 'bg-red-600'
      }`}>
      <div className="flex items-center justify-center gap-2">
        {isOnline ? <MdWifi size={20} /> : <MdWifiOff size={20} />}
        <span>
          {isOnline
            ? 'Conexão restaurada!'
            : 'Sem conexão com a internet. Algumas funcionalidades podem não funcionar.'
          }
        </span>
      </div>
    </div>
  );
};
