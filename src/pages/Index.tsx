
import React from 'react';
import { LeagueProvider } from '@/context/LeagueContext';
import { useLeague } from '@/context/LeagueContext';
import LeagueCreation from '@/components/LeagueCreation';
import Dashboard from '@/components/Dashboard';

const LeagueManager: React.FC = () => {
  const { league, isCreatingLeague } = useLeague();
  
  return (
    <>
      {isCreatingLeague ? (
        <LeagueCreation />
      ) : league ? (
        <Dashboard />
      ) : null}
    </>
  );
};

const Index: React.FC = () => {
  return (
    <LeagueProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-fifa-dark text-white py-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center px-4">
            <div className="flex items-center gap-2">
              <Trophy size={24} className="text-fifa-accent" />
              <h1 className="text-xl font-bold">FIFA League Manager</h1>
            </div>
            <div className="text-sm text-gray-300">FIFA 25</div>
          </div>
        </header>
        
        <main>
          <LeagueManager />
        </main>
        
        <footer className="mt-12 py-6 border-t">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            FIFA League Manager &copy; {new Date().getFullYear()} 
          </div>
        </footer>
      </div>
    </LeagueProvider>
  );
};

import { Trophy } from 'lucide-react';
export default Index;
