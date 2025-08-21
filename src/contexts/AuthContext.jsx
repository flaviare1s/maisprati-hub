import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../api.js/users";

const AuthContext = createContext();

export { AuthContext };

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
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
          // Primeiro acesso: redirecionar baseado no grupo
          if (userData.hasGroup) {
            // Estudantes com grupo vão para seleção de time
            navigate("/team-select");
          } else {
            // Estudantes sem grupo vão para escolher nome de guerra
            navigate("/warname");
          }
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

        // Atualizar no backend
        await updateUser(user.id, updatedUser);

        // Atualizar no localStorage e estado local
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);

        console.log("Primeiro login marcado como completo");
      } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        // Mesmo com erro na API, mantém funcionando localmente
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

  return (
    <AuthContext.Provider value={{ user, login, logout, completeFirstLogin, updateUserData }}>
      {children}
    </AuthContext.Provider>
  );
};
