import { useState, useEffect, useRef } from 'react';
import chatIcon from '../assets/images/chat-icon.png';

export const ChatButton = () => {
  const [isBotpressLoaded, setIsBotpressLoaded] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    // Previne inicialização múltipla
    if (initialized.current) return;

    const initBotpress = () => {
      if (window.botpressWebChat && !initialized.current) {
        try {
          console.log('Inicializando Botpress...');

          window.botpressWebChat.init({
            clientId: import.meta.env.VITE_BOTPRESS_CLIENT_ID,
            botName: "ConectaBot",
            composerPlaceholder: "Digite sua mensagem...",
            showPoweredBy: false,
            chatId: "bp-web-widget",
            encryptionKey: import.meta.env.VITE_BOTPRESS_ENCRYPTION_KEY,
            layout: { position: 'right' }
          });

          initialized.current = true;
          setIsBotpressLoaded(true);

          console.log('Botpress inicializado com sucesso');

        } catch (error) {
          console.error('Erro ao inicializar Botpress:', error);
        }
      } else if (!window.botpressWebChat) {
        setTimeout(initBotpress, 200);
      }
    };

    initBotpress();
  }, []);

  // Effect para controlar a visibilidade dos iframes
  useEffect(() => {
    const hideAllBotpressElements = () => {
      // Procura por todos os possíveis elementos do Botpress
      const selectors = [
        '[id*="bp-widget"]',
        '[id*="botpress"]',
        'iframe[src*="botpress"]',
        '.bp-chat-container',
        '.bp-web-widget',
        '[class*="bp-"]'
      ];

      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          if (chatVisible) {
            element.style.display = 'block';
            element.style.position = 'fixed';
            element.style.bottom = '80px';
            element.style.right = '20px';
            element.style.zIndex = '1000';
            element.style.maxWidth = '400px';
            element.style.maxHeight = '600px';
          } else {
            element.style.display = 'none';
          }
        });
      });
    };

    // Executa imediatamente
    hideAllBotpressElements();

    // Observa mudanças no DOM para capturar elementos criados dinamicamente
    const observer = new MutationObserver(() => {
      hideAllBotpressElements();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'id']
    });

    return () => observer.disconnect();
  }, [chatVisible]);

  // Effect inicial para esconder tudo
  useEffect(() => {
    const timer = setTimeout(() => {
      const allPossibleElements = document.querySelectorAll(`
        [id*="bp-widget"],
        [id*="botpress"],
        iframe[src*="botpress"],
        .bp-chat-container,
        .bp-web-widget,
        [class*="bp-"]
      `);

      allPossibleElements.forEach(element => {
        element.style.display = 'none';
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [isBotpressLoaded]);

  const toggleChat = () => {
    if (!isBotpressLoaded) {
      console.warn('Botpress ainda não está carregado');
      return;
    }

    try {
      if (chatVisible) {
        // Esconder chat
        setChatVisible(false);
        if (window.botpressWebChat?.sendEvent) {
          window.botpressWebChat.sendEvent({ type: 'hide' });
        }
        console.log('Chat escondido');
      } else {
        // Mostrar chat
        setChatVisible(true);
        if (window.botpressWebChat?.sendEvent) {
          window.botpressWebChat.sendEvent({ type: 'show' });
        }
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
