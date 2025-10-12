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

  const logout = useCallback(async () => {
    try {
      // Chama backend para destruir sessão
      await logoutUser();
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

  const refreshUserData = async () => {
    try {
      const userData = await getCurrentUserData();
      setUser(userData);
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
    }
  };

  useEffect(() => {
    const initializeUser = async () => {
      const userData = await getCurrentUserData();
      if (userData) {
        setUser(userData);
      } else {
        setUser(null); // expresso, mesmo que já seja null
      }
    };
    initializeUser();
  }, []);  // não depender de logout

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        userTeam,
        loadUserTeam,
        refreshUserData,
        registerUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
