import { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getTeamWithMembers } from "../api.js/teams";
import { loginUser, registerUser, logoutUser } from "../api.js/auth";
import { getCurrentUserData } from "../api.js/users";

const AuthContext = createContext();
export { AuthContext };

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [userTeam, setUserTeam] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // evitar flash inicial

  // Função para carregar dados completos do usuário
  const loadUserData = async () => {
    try {
      const userData = await getCurrentUserData(); // pega do backend via cookie
      setUser(userData);
      return userData;
    } catch (err) {
      // Se for erro de servidor, não faz logout
      if (err.message === "SERVER_ERROR") {
        console.warn("Mantendo sessão devido a erro temporário do servidor");
        return user; // Mantém o usuário atual
      }

      console.error("Erro ao carregar dados do usuário:", err);
      setUser(null);
      return null;
    }
  };

  const logout = useCallback(async ({ skipServer = false }) => {
    try {
      // Chama backend para destruir sessão - limpa cookies
      if (!skipServer) {
        await logoutUser(); // <-- só chama se ainda estiver logado
      }
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    }
    setUser(null);
    setUserTeam(null);
    navigate("/login");
  }, [navigate]);

  const login = async ({ email, password }) => {
    try {
      // Cookie de sessão será definido pelo backend
      await loginUser({ email, password });

      // Buscar dados do usuário
      const userData = await getCurrentUserData();
      setUser(userData);

      navigate("/dashboard");
      return userData;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  };

  // Carregar time do usuário
  const loadUserTeam = async (teamId = null) => {
    const targetTeamId = teamId || user?.teamId;
    if (targetTeamId) {
      try {
        const teamData = await getTeamWithMembers(targetTeamId);
        setUserTeam(teamData);
        return teamData;
      } catch (error) {
        console.error("Erro ao carregar time:", error);
        return null;
      }
    }
    return null;
  };

  // Função para atualizar dados do usuário no contexto
  const updateUser = async () => {
    try {
      const userData = await getCurrentUserData(); // pega do backend via cookie
      setUser(userData); // atualiza apenas o estado
      return userData;
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      return null;
    }
  };

  // Carregar usuário na inicialização
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const userData = await getCurrentUserData();
        setUser(userData || null);
      } catch (error) {
        // Só considera como erro se não for 401/403 (não autenticado)
        if (error?.response?.status !== 401 && error?.response?.status !== 403) {
          console.error("Erro inesperado ao verificar autenticação:", error);
        }
        setUser(null);
      } finally {
        setLoading(false); // renderiza após a checagem
      }
    };
    initializeUser();
  }, []);

  // Logout automático ao expirar o token
  useEffect(() => {
    let logoutDebounceTimer = null;

    const handleUnauthorized = () => {
      // Evita múltiplos logouts simultâneos
      if (logoutDebounceTimer) {
        clearTimeout(logoutDebounceTimer);
      }

      logoutDebounceTimer = setTimeout(() => {
        // Só faz logout se realmente há um usuário logado
        if (user) {
          console.log("Sessão expirada - fazendo logout automático");
          logout({ skipServer: true }); // já sabe que o backend invalidou o cookie
        }
      }, 200); // Debounce de 200ms
    };

    window.addEventListener("unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("unauthorized", handleUnauthorized);
      if (logoutDebounceTimer) {
        clearTimeout(logoutDebounceTimer);
      }
    };
  }, [logout, user]); // Dependência do user para evitar logout desnecessário

  // Verificação periódica da sessão para usuários logados
  useEffect(() => {
    if (!user) return;

    const checkSession = async () => {
      try {
        await getCurrentUserData();
      } catch (error) {
        // Se a sessão expirou, o interceptor já vai lidar com isso
        if (error?.response?.status === 401) {
          console.log("Sessão expirada detectada na verificação periódica");
        }
      }
    };

    // Verifica a sessão a cada 10 minutos para usuários logados
    const sessionCheckInterval = setInterval(checkSession, 10 * 60 * 1000);

    return () => {
      clearInterval(sessionCheckInterval);
    };
  }, [user]);

  // Verificação de atividade do usuário (para renovar sessão automaticamente)
  useEffect(() => {
    if (!user) return;

    let lastActivity = Date.now();

    const updateActivity = () => {
      lastActivity = Date.now();
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    // Verifica atividade a cada 5 minutos
    const activityCheckInterval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity;

      // Se houve atividade nos últimos 30 minutos, mantém a sessão ativa
      if (timeSinceLastActivity < 30 * 60 * 1000) {
        getCurrentUserData().catch(() => {
          // Se falhar, deixa o interceptor lidar
        });
      }
    }, 5 * 60 * 1000);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
      clearInterval(activityCheckInterval);
    };
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        userTeam,
        loadUserTeam,
        loadUserData,
        updateUser,
        registerUser,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
