
import React from 'react';
import { useLeague } from '@/context/LeagueContext';
import LeagueHeader from './LeagueHeader';
import LeagueTable from './LeagueTable';
import MatchList from './MatchList';

const Dashboard: React.FC = () => {
  const { league } = useLeague();
  
  if (!league) return null;
  
  return (
    <div className="container mx-auto py-6 px-4 animate-fade-in">
      <LeagueHeader />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:order-2">
          <LeagueTable />
        </div>
        <div className="lg:order-1">
          <MatchList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
