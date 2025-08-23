import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../api.js/users";
import { getTeamWithMembers } from "../api.js/teams";
import api from "../services/api";

const AuthContext = createContext();

export { AuthContext };

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [userTeam, setUserTeam] = useState(null);
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return null;

      const parsedUser = JSON.parse(storedUser);

      return {
        hasGroup: false,
        wantsGroup: false,
        ...parsedUser
      };
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
      localStorage.removeItem("user");
      return null;
    }
  });

  const login = async (userData) => {
    try {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      // Lógica de redirecionamento baseada no tipo de usuário e status
      if (userData.type === 'admin') {
        navigate("/dashboard");
      } else if (userData.type === 'student') {
        // Verificar se é primeiro acesso
        if (userData.isFirstLogin) {
          // Todos os estudantes vão primeiro escolher nome de guerra
          navigate("/warname");
        } else {
          // Não é primeiro acesso: direto para dashboard
          navigate("/dashboard");
        }
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const completeFirstLogin = async () => {
    if (user) {
      try {
        const updatedUser = { ...user, isFirstLogin: false };

        await updateUser(user.id, updatedUser);

        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);

      } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        const updatedUser = { ...user, isFirstLogin: false };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    }
  };

  const updateUserData = (newUserData) => {
    try {
      const updatedUser = { ...user, ...newUserData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      console.log("Dados do usuário atualizados:", updatedUser);
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error);
    }
  };

  const refreshUserData = async () => {
    if (user?.id) {
      try {
        const userResponse = await api.get(`/users/${user.id}`);
        const freshUserData = userResponse.data;

        localStorage.setItem("user", JSON.stringify(freshUserData));
        setUser(freshUserData);

        // Se o usuário tem um time, carregar os dados do time também
        if (freshUserData.hasGroup && freshUserData.teamId) {
          await loadUserTeam();
        }

        return freshUserData;
      } catch (error) {
        console.error("Erro ao atualizar dados do usuário:", error);
        return null;
      }
    }
    return null;
  };

  const loadUserTeam = async (teamId = null) => {
    const targetTeamId = teamId || user?.teamId;

    if (targetTeamId) {
      try {
        console.log("Carregando dados do time:", targetTeamId);
        const teamData = await getTeamWithMembers(targetTeamId);
        setUserTeam(teamData);
        console.log("Dados do time carregados:", teamData);
        return teamData;
      } catch (error) {
        console.error("Erro ao carregar time do usuário:", error);
        return null;
      }
    }
    return null;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, completeFirstLogin, updateUserData, loadUserTeam, userTeam, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
};
