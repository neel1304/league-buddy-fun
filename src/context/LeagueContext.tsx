
import React, { createContext, useContext, useState, useEffect } from 'react';
import { League, LeagueFormat, LeagueTableEntry, Match, Team } from '../types';
import { 
  calculateLeagueTable, 
  createNewLeague, 
  updateMatch, 
  checkLeagueCompletion 
} from '../services/leagueService';
import { getStoredLeague, saveLeague, clearStoredLeague } from '../services/storageService';
import { useToast } from "@/hooks/use-toast";

interface LeagueContextType {
  league: League | null;
  leagueTable: LeagueTableEntry[];
  isCreatingLeague: boolean;
  startLeagueCreation: () => void;
  cancelLeagueCreation: () => void;
  createLeague: (name: string, teams: Team[], format: LeagueFormat) => void;
  updateMatchScore: (matchId: string, homeScore: number | null, awayScore: number | null, isCompleted: boolean) => void;
  resetLeague: () => void;
}

const LeagueContext = createContext<LeagueContextType | undefined>(undefined);

export const LeagueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [league, setLeague] = useState<League | null>(null);
  const [leagueTable, setLeagueTable] = useState<LeagueTableEntry[]>([]);
  const [isCreatingLeague, setIsCreatingLeague] = useState(false);
  const { toast } = useToast();

  // Load league from local storage on initial render
  useEffect(() => {
    const storedLeague = getStoredLeague();
    if (storedLeague) {
      setLeague(storedLeague);
      setLeagueTable(calculateLeagueTable(storedLeague));
    } else {
      setIsCreatingLeague(true);
    }
  }, []);

  // Save league to local storage whenever it changes
  useEffect(() => {
    if (league) {
      saveLeague(league);
      setLeagueTable(calculateLeagueTable(league));
      
      // Check if league just completed
      if (checkLeagueCompletion(league) && league.isComplete) {
        toast({
          title: "League Complete!",
          description: "All matches have been played. Final standings are now available.",
        });
      }
    }
  }, [league]);

  const startLeagueCreation = () => {
    setIsCreatingLeague(true);
  };

  const cancelLeagueCreation = () => {
    if (league) {
      setIsCreatingLeague(false);
    }
  };

  const createLeague = (name: string, teams: Team[], format: LeagueFormat) => {
    const newLeague = createNewLeague(name, teams, format);
    setLeague(newLeague);
    setIsCreatingLeague(false);
    toast({
      title: "League Created",
      description: `${newLeague.name} has been created with ${teams.length} teams.`,
    });
  };

  const updateMatchScore = (
    matchId: string, 
    homeScore: number | null, 
    awayScore: number | null, 
    isCompleted: boolean
  ) => {
    if (league) {
      const updatedLeague = updateMatch(league, matchId, homeScore, awayScore, isCompleted);
      setLeague(updatedLeague);
      
      if (isCompleted) {
        toast({
          title: "Match Result Saved",
          description: "The match result has been recorded.",
        });
      }
    }
  };

  const resetLeague = () => {
    clearStoredLeague();
    setLeague(null);
    setLeagueTable([]);
    setIsCreatingLeague(true);
    toast({
      title: "League Reset",
      description: "All league data has been cleared.",
    });
  };

  return (
    <LeagueContext.Provider
      value={{
        league,
        leagueTable,
        isCreatingLeague,
        startLeagueCreation,
        cancelLeagueCreation,
        createLeague,
        updateMatchScore,
        resetLeague
      }}
    >
      {children}
    </LeagueContext.Provider>
  );
};

export const useLeague = () => {
  const context = useContext(LeagueContext);
  if (context === undefined) {
    throw new Error('useLeague must be used within a LeagueProvider');
  }
  return context;
};
