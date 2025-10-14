import { createContext, useState, useEffect, useCallback, useRef } from "react";
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
  const [loading, setLoading] = useState(true);
  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);


  const loadUserData = useCallback(async () => {
    try {
      const userData = await getCurrentUserData();
      setUser(userData);
      return userData;
    } catch (err) {
      if (err.message === "SERVER_ERROR") {
        console.warn("Mantendo sessão devido a erro temporário do servidor");
        return userRef.current;
      }
      console.error("Erro ao carregar dados do usuário:", err);
      setUser(null);
      return null;
    }
  }, []);

  const logout = useCallback(async ({ skipServer = false } = {}) => {
    try {
      if (!skipServer) {
        await logoutUser();
      }
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    }
    setUser(null);
    setUserTeam(null);
    navigate("/login");
  }, [navigate]); // ✅ Apenas navigate

  const login = useCallback(async ({ email, password }) => {
    try {
      await loginUser({ email, password });
      const userData = await getCurrentUserData();
      setUser(userData);
      navigate("/dashboard");
      return userData;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  }, [navigate]);

  // Carregar time do usuário
  const loadUserTeam = useCallback(async (teamId = null) => {
    const targetTeamId = teamId || userRef.current?.teamId;
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
  }, []);

  const updateUser = useCallback(async () => {
    try {
      const userData = await getCurrentUserData();
      setUser(userData);
      return userData;
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      return null;
    }
  }, []);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const userData = await getCurrentUserData();
        setUser(userData || null);
      } catch (error) {
        if (error?.response?.status !== 401 && error?.response?.status !== 403) {
          console.error("Erro inesperado ao verificar autenticação:", error);
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initializeUser();
  }, []);

  useEffect(() => {
    let logoutDebounceTimer = null;

    const handleUnauthorized = () => {
      if (logoutDebounceTimer) {
        clearTimeout(logoutDebounceTimer);
      }

      logoutDebounceTimer = setTimeout(() => {
        if (userRef.current) {
          console.log("Sessão expirada - fazendo logout automático");
          logout({ skipServer: true });
        }
      }, 200);
    };

    window.addEventListener("unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("unauthorized", handleUnauthorized);
      if (logoutDebounceTimer) {
        clearTimeout(logoutDebounceTimer);
      }
    };
  }, [logout]);

  useEffect(() => {
    if (!user) return;

    const checkSession = async () => {
      if (!userRef.current) return;

      try {
        await getCurrentUserData();
      } catch (error) {
        if (error?.response?.status === 401) {
          console.log("Sessão expirada detectada na verificação periódica");
        }
      }
    };

    const sessionCheckInterval = setInterval(checkSession, 10 * 60 * 1000);

    let lastActivity = Date.now();

    const updateActivity = () => {
      lastActivity = Date.now();
    };

    const events = ['mousedown', 'keypress', 'click'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    const activityCheckInterval = setInterval(() => {
      if (!userRef.current) return;

      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity;

      if (timeSinceLastActivity < 30 * 60 * 1000) {
        getCurrentUserData().catch(() => {
        });
      }
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(sessionCheckInterval);
      clearInterval(activityCheckInterval);
      events.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });
    };
  }, []);

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