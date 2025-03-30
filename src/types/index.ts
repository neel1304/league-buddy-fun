
// League format types
export type LeagueFormat = 
  | "round-robin-single" 
  | "round-robin-double" 
  | "best-of-2" 
  | "home-away";

export interface Team {
  id: string;
  name: string;
  owner: string;
}

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number | null;
  awayScore: number | null;
  isCompleted: boolean;
  round?: number;
}

export interface LeagueTableEntry {
  teamId: string;
  teamName: string;
  owner: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface League {
  id: string;
  name: string;
  format: LeagueFormat;
  teams: Team[];
  matches: Match[];
  createdAt: string;
  isComplete: boolean;
}
