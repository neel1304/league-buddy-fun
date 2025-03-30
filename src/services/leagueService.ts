
import { League, LeagueFormat, LeagueTableEntry, Match, Team } from "../types";

// Generate unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Create matches based on league format
export const generateMatches = (teams: Team[], format: LeagueFormat): Match[] => {
  const matches: Match[] = [];
  
  // Helper function to create a match
  const createMatch = (homeTeam: Team, awayTeam: Team, round?: number): Match => {
    return {
      id: generateId(),
      homeTeamId: homeTeam.id,
      awayTeamId: awayTeam.id,
      homeScore: null,
      awayScore: null,
      isCompleted: false,
      round
    };
  };
  
  switch (format) {
    case "round-robin-single":
      // Each team plays against each other team once
      for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
          matches.push(createMatch(teams[i], teams[j]));
        }
      }
      break;
      
    case "round-robin-double":
      // Each team plays against each other team twice (home and away)
      for (let i = 0; i < teams.length; i++) {
        for (let j = 0; j < teams.length; j++) {
          if (i !== j) {
            matches.push(createMatch(teams[i], teams[j]));
          }
        }
      }
      break;
      
    case "best-of-2":
      // Each team plays against each other team twice
      for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
          matches.push(createMatch(teams[i], teams[j], 1));
          matches.push(createMatch(teams[j], teams[i], 2));
        }
      }
      break;
      
    case "home-away":
      // Same as round-robin-double but explicitly designated as home and away
      for (let i = 0; i < teams.length; i++) {
        for (let j = 0; j < teams.length; j++) {
          if (i !== j) {
            matches.push(createMatch(teams[i], teams[j], i < j ? 1 : 2));
          }
        }
      }
      break;
  }
  
  return matches;
};

// Calculate league table
export const calculateLeagueTable = (league: League): LeagueTableEntry[] => {
  const { teams, matches } = league;
  
  // Initialize table entries for all teams
  const tableEntries: LeagueTableEntry[] = teams.map(team => ({
    teamId: team.id,
    teamName: team.name,
    owner: team.owner,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0
  }));
  
  // Process completed matches
  matches.forEach(match => {
    if (match.isCompleted && match.homeScore !== null && match.awayScore !== null) {
      // Find table entries for both teams
      const homeTeamEntry = tableEntries.find(entry => entry.teamId === match.homeTeamId)!;
      const awayTeamEntry = tableEntries.find(entry => entry.teamId === match.awayTeamId)!;
      
      // Update matches played
      homeTeamEntry.played++;
      awayTeamEntry.played++;
      
      // Update goals
      homeTeamEntry.goalsFor += match.homeScore;
      homeTeamEntry.goalsAgainst += match.awayScore;
      homeTeamEntry.goalDifference = homeTeamEntry.goalsFor - homeTeamEntry.goalsAgainst;
      
      awayTeamEntry.goalsFor += match.awayScore;
      awayTeamEntry.goalsAgainst += match.homeScore;
      awayTeamEntry.goalDifference = awayTeamEntry.goalsFor - awayTeamEntry.goalsAgainst;
      
      // Update results based on score
      if (match.homeScore > match.awayScore) {
        // Home team wins
        homeTeamEntry.won++;
        homeTeamEntry.points += 3;
        awayTeamEntry.lost++;
      } else if (match.homeScore < match.awayScore) {
        // Away team wins
        homeTeamEntry.lost++;
        awayTeamEntry.won++;
        awayTeamEntry.points += 3;
      } else {
        // Draw
        homeTeamEntry.drawn++;
        homeTeamEntry.points += 1;
        awayTeamEntry.drawn++;
        awayTeamEntry.points += 1;
      }
    }
  });
  
  // Sort the table
  return tableEntries.sort((a, b) => {
    // First by points
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    // Then by goal difference
    if (b.goalDifference !== a.goalDifference) {
      return b.goalDifference - a.goalDifference;
    }
    // Then by goals for
    if (b.goalsFor !== a.goalsFor) {
      return b.goalsFor - a.goalsFor;
    }
    // Then alphabetically by team name
    return a.teamName.localeCompare(b.teamName);
  });
};

export const createNewLeague = (
  name: string, 
  teams: Team[], 
  format: LeagueFormat
): League => {
  const league: League = {
    id: generateId(),
    name: name || `FIFA League ${new Date().toLocaleDateString()}`,
    format,
    teams,
    matches: [],
    createdAt: new Date().toISOString(),
    isComplete: false
  };
  
  // Generate matches based on format
  league.matches = generateMatches(teams, format);
  
  return league;
};

export const updateMatch = (
  league: League,
  matchId: string,
  homeScore: number | null,
  awayScore: number | null,
  isCompleted: boolean
): League => {
  const updatedMatches = league.matches.map(match => {
    if (match.id === matchId) {
      return {
        ...match,
        homeScore,
        awayScore,
        isCompleted
      };
    }
    return match;
  });
  
  // Check if league is complete (all matches completed)
  const allMatchesCompleted = updatedMatches.every(match => match.isCompleted);
  
  return {
    ...league,
    matches: updatedMatches,
    isComplete: allMatchesCompleted
  };
};

export const checkLeagueCompletion = (league: League): boolean => {
  return league.matches.every(match => match.isCompleted);
};

export const getTeamById = (league: League, teamId: string): Team | undefined => {
  return league.teams.find(team => team.id === teamId);
};

export const getLeagueFormatLabel = (format: LeagueFormat): string => {
  switch (format) {
    case "round-robin-single":
      return "Round Robin (Single)";
    case "round-robin-double":
      return "Round Robin (Double)";
    case "best-of-2":
      return "Best of 2";
    case "home-away":
      return "Home & Away";
    default:
      return format;
  }
};
