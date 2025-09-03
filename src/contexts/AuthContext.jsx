import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
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
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
      localStorage.removeItem("user");
      return null;
    }
  });

  const login = async ({ email, password }) => {
    try {
      // Chama login no backend
      const { token } = await api.post("/auth/login", { email, password })
        .then(res => res.data);

      // Salva token no localStorage
      localStorage.setItem("token", token);

      // Decodifica o payload do JWT
      const payload = JSON.parse(atob(token.split(".")[1]));

      // Monta user básico
      const loggedUser = {
        email: payload.sub,
        type: payload.type,
        token,
      };

      localStorage.setItem("user", JSON.stringify(loggedUser));
      setUser(loggedUser);
      console.log("Usuário logado:", loggedUser);

      // Redirecionamento baseado no type
      if (loggedUser.type === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/dashboard");
      }

      return loggedUser;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setUserTeam(null);
    navigate("/login");
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

  return (
    <AuthContext.Provider value={{ user, login, logout, userTeam, loadUserTeam }}>
      {children}
    </AuthContext.Provider>
  );
};
