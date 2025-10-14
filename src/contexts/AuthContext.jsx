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
      } catch {
        setUser(null);
      } finally {
        setLoading(false); // redenriza após a checagem
      }
    };
    initializeUser();
  }, []);

  // Logout automático ao expirar o token
  useEffect(() => {
    const handleUnauthorized = () => {
      logout({ skipServer: true }); // já sabe que o backend invalidou o cookie
    };
    window.addEventListener("unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("unauthorized", handleUnauthorized);
    };
  }, [logout]);

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