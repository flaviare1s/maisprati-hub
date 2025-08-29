import { useState, useEffect } from 'react';
import chatIcon from '../assets/images/chat-icon.png';

export const ChatButton = () => {
  const [isBotpressLoaded, setIsBotpressLoaded] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);

  useEffect(() => {
    const clientId = import.meta.env.VITE_BOTPRESS_CLIENT_ID;
    const encryptionKey = import.meta.env.VITE_BOTPRESS_ENCRYPTION_KEY;

    if (window.botpressWebChat && !window.__botpressInitialized) {
      window.botpressWebChat.init({
        clientId,
        botName: "ConectaBot",
        composerPlaceholder: "Digite sua mensagem...",
        showPoweredBy: false,
        chatId: "bp-web-widget",
        encryptionKey
      });
      window.__botpressInitialized = true;
      setIsBotpressLoaded(true);
      console.log('✅ Botpress pronto para uso!');
    } else {
      // Aguarda o script carregar
      const interval = setInterval(() => {
        if (window.botpressWebChat && !window.__botpressInitialized) {
          window.botpressWebChat.init({
            clientId,
            botName: "ConectaBot",
            composerPlaceholder: "Digite sua mensagem...",
            showPoweredBy: false,
            chatId: "bp-web-widget",
            encryptionKey
          });
          window.__botpressInitialized = true;
          setIsBotpressLoaded(true);
          console.log('✅ Botpress pronto para uso!');
          clearInterval(interval);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, []);

  const toggleChat = () => {
    if (!window.botpressWebChat || !isBotpressLoaded) {
      console.warn('Botpress ainda não está carregado');
      return;
    }

    try {
      if (chatVisible) {
        window.botpressWebChat.sendEvent({ type: 'hide' });
        setChatVisible(false);
        console.log('Chat escondido');
      } else {
        window.botpressWebChat.sendEvent({ type: 'show' });
        setChatVisible(true);
        console.log('Chat mostrado');
      }
    } catch (error) {
      console.error('Erro ao alternar chat:', error);
    }
  };

  return (
    <button
      onClick={toggleChat}
      className={`
        w-[55px] h-[55px] cursor-pointer rounded-full flex items-center justify-center 
        shadow-lg z-50 transition-all duration-200
        ${isBotpressLoaded
          ? 'bg-orange-logo hover:bg-orange-500'
          : 'bg-gray-400 cursor-not-allowed'
        }
        ${chatVisible ? 'ring-2 ring-orange-300' : ''}
      `}
      disabled={!isBotpressLoaded}
      aria-label={isBotpressLoaded ? "Abrir Chat" : "Chat carregando..."}
    >
      <img src={chatIcon} alt="Ícone do chat" />
      {!isBotpressLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </button>
  );
};
