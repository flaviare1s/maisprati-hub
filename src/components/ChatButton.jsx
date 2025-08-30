import { useState, useEffect } from "react";
import chatIcon from "../assets/images/chat-icon.png";

export const ChatButton = () => {
  const [botpressLoaded, setBotpressLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.botpress.cloud/webchat/v1/inject.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.botpressWebChat) {
        window.botpressWebChat.init({
          clientId: import.meta.env.VITE_BOTPRESS_CLIENT_ID,
          botName: "ConectaBot",
          composerPlaceholder: "Digite sua mensagem...",
          hideWidget: true,
          hostUrl: "https://cdn.botpress.cloud/webchat/v1",
          messagingUrl: "https://messaging.botpress.cloud",
        });
        setBotpressLoaded(true);
      }
    };

    return () => document.body.removeChild(script);
  }, []);

  const toggleChat = () => {
    if (!botpressLoaded) return;
    window.botpressWebChat.sendEvent({ type: "toggle" });
  };

  if (!botpressLoaded) return null;

  return (
    <button
      onClick={toggleChat}
      className="fixed bottom-4 right-4 w-14 h-14 bg-orange-logo hover:bg-orange-500 rounded-full flex items-center justify-center shadow-lg z-50 cursor-pointer"
      aria-label="Abrir Chat"
    >
      <img src={chatIcon} alt="Ícone do chat" />
    </button>
  );
};
