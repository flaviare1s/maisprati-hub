/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { fetchTeams, isUserInActiveTeam } from "../api.js/teams";
import { useAuth } from "../hooks/useAuth";

const TeamContext = createContext();

export const TeamProvider = ({ children }) => {
  const { user } = useAuth();
  const [userInTeam, setUserInTeam] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadTeams = async () => {
      const teams = await fetchTeams();
      setUserInTeam(isUserInActiveTeam(user, teams));
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
