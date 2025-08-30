import { useEffect, useRef } from "react";

export const ChatButton = () => {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const injectScript = document.createElement("script");
    injectScript.src = "https://cdn.botpress.cloud/webchat/v3.2/inject.js";
    injectScript.async = true;

    injectScript.onload = () => {
      console.log("Botpress inject.js carregado");

      const configScript = document.createElement("script");
      configScript.src = "https://files.bpcontent.cloud/2025/08/30/12/20250830120814-VEG0PHM8.js";
      configScript.defer = true;
      document.body.appendChild(configScript);
    };

    document.body.appendChild(injectScript);
  }, []);

  return null;
};
