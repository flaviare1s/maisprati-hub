/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { isUserInActiveTeam } from "../api.js/teams";
import { useAuth } from "../hooks/useAuth";

const TeamContext = createContext();

export const TeamProvider = ({ children }) => {
  const { user } = useAuth();
  const [userInTeam, setUserInTeam] = useState(false);

  useEffect(() => {
    if (!user || !user.id) return;

    const loadTeams = async () => {
      try {
        const userInActiveTeam = await isUserInActiveTeam(user.id);
        setUserInTeam(userInActiveTeam);
      } catch (error) {
        console.error("Erro ao carregar status do time:", error);
        setUserInTeam(false);
      }
    };

    loadTeams();
  }, [user]);

  return (
    <TeamContext.Provider value={{ userInTeam }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => useContext(TeamContext);
