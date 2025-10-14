import { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getTeamWithMembers } from "../api.js/teams";
import { loginUser, decodeJWT } from "../api.js/auth";
import { getCurrentUserData } from "../api.js/users";

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

  // Função para carregar dados completos do usuário
  const loadUserData = async () => {
    try {
      const userData = await getCurrentUserData();

      // Atualiza o user no estado e no localStorage
      const updatedUser = {
        ...user,
        ...userData,
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return updatedUser;
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
      return user;
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setUserTeam(null);
    navigate("/login");
  }, [navigate]);

  const login = async ({ email, password }) => {
    try {
      // Chama login no backend
      const response = await loginUser({ email, password });
      const { token } = response;

      // Salva token no localStorage
      localStorage.setItem("token", token);

      // Decodifica o payload do JWT
      const payload = decodeJWT(token);
      if (!payload) {
        throw new Error("Token inválido");
      }

      // Busca dados completos do usuário
      const userData = await getCurrentUserData();

      // Monta user completo
      const loggedUser = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        type: userData.type,
        whatsapp: userData.whatsapp,
        groupClass: userData.groupClass,
        hasGroup: userData.hasGroup,
        wantsGroup: userData.wantsGroup,
        codename: userData.codename,
        avatar: userData.avatar,
        token,
      };

      localStorage.setItem("user", JSON.stringify(loggedUser));
      setUser(loggedUser);

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
  const updateUser = (newUserData) => {
    const updatedUser = { ...user, ...newUserData };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  // Verificar se token ainda é válido no carregamento inicial
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && user) {
      try {
        const payload = decodeJWT(token);
        const now = Math.floor(Date.now() / 1000);

        // Se o token expirou, faz logout
        if (payload.exp < now) {
          logout();
        }
      } catch (error) {
        console.error("Erro ao validar token:", error);
        logout();
      }
    }
  }, [user, logout]);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      userTeam,
      loadUserTeam,
      loadUserData,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
