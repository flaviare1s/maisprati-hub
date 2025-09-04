import { useState, useEffect } from "react";
import api from "../services/api";

export const useBackendStatus = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Tenta fazer uma requisição simples para verificar conectividade
        const response = await api.get("/health", { timeout: 5000 });

        if (response.status === 200) {
          setIsConnected(true);
        }
      } catch (error) {
        setIsConnected(false);
        setError(error.message);
        console.error("❌ Erro na conexão com o backend:", error);

        // Se não existir endpoint /health, tenta /users
        try {
          await api.get("/users", { timeout: 5000 });
          setIsConnected(true);
        } catch (secondError) {
          console.error("❌ Falha total na conexão:", secondError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkBackendConnection();
  }, []);

  return { isConnected, isLoading, error };
};
