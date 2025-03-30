
import { League } from "../types";

const LEAGUE_STORAGE_KEY = 'fifa-league-data';

export const saveLeague = (league: League): void => {
  localStorage.setItem(LEAGUE_STORAGE_KEY, JSON.stringify(league));
};

export const getStoredLeague = (): League | null => {
  const storedLeague = localStorage.getItem(LEAGUE_STORAGE_KEY);
  return storedLeague ? JSON.parse(storedLeague) : null;
};

export const clearStoredLeague = (): void => {
  localStorage.removeItem(LEAGUE_STORAGE_KEY);
};
