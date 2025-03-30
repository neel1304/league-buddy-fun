
import React from 'react';
import { useLeague } from '@/context/LeagueContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PlusCircle, RefreshCw, Trophy } from 'lucide-react';
import { getLeagueFormatLabel } from '@/services/leagueService';

const LeagueHeader: React.FC = () => {
  const { league, resetLeague, startLeagueCreation } = useLeague();
  
  if (!league) return null;
  
  return (
    <Card className="mb-6">
      <div className="league-header">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Trophy size={32} className="text-fifa-accent" />
            <div>
              <h1 className="text-2xl font-bold">{league.name}</h1>
              <div className="flex items-center text-gray-300 text-sm">
                <span>{getLeagueFormatLabel(league.format)}</span>
                <span className="mx-2">•</span>
                <span>{league.teams.length} Teams</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="text-white border-white hover:text-white hover:bg-slate-700"
              onClick={resetLeague}
            >
              <RefreshCw size={16} className="mr-2" />
              Reset
            </Button>
            <Button 
              className="bg-fifa-green hover:bg-green-500 text-white"
              onClick={startLeagueCreation}
            >
              <PlusCircle size={16} className="mr-2" />
              New League
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LeagueHeader;
