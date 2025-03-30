
import React, { useState } from 'react';
import { useLeague } from '@/context/LeagueContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Calendar, CheckCircle2, ChevronDown, ChevronUp, Save, X } from 'lucide-react';
import { getTeamById } from '@/services/leagueService';

const MatchCard: React.FC<{
  matchId: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number | null;
  awayScore: number | null;
  isCompleted: boolean;
  round?: number;
}> = ({ matchId, homeTeamId, awayTeamId, homeScore, awayScore, isCompleted, round }) => {
  const { league, updateMatchScore } = useLeague();
  const [isEditing, setIsEditing] = useState(false);
  const [localHomeScore, setLocalHomeScore] = useState<string>(homeScore !== null ? homeScore.toString() : '');
  const [localAwayScore, setLocalAwayScore] = useState<string>(awayScore !== null ? awayScore.toString() : '');

  if (!league) return null;

  const homeTeam = getTeamById(league, homeTeamId);
  const awayTeam = getTeamById(league, awayTeamId);
  
  if (!homeTeam || !awayTeam) return null;
  
  const handleSave = () => {
    const parsedHomeScore = localHomeScore ? parseInt(localHomeScore, 10) : null;
    const parsedAwayScore = localAwayScore ? parseInt(localAwayScore, 10) : null;
    
    if ((parsedHomeScore !== null && parsedAwayScore !== null) || 
        (parsedHomeScore === null && parsedAwayScore === null)) {
      updateMatchScore(matchId, parsedHomeScore, parsedAwayScore, parsedHomeScore !== null && parsedAwayScore !== null);
      setIsEditing(false);
    }
  };
  
  const handleCancel = () => {
    setLocalHomeScore(homeScore !== null ? homeScore.toString() : '');
    setLocalAwayScore(awayScore !== null ? awayScore.toString() : '');
    setIsEditing(false);
  };

  return (
    <div className="match-card">
      {round && (
        <div className="text-xs text-gray-500 mb-1 flex items-center">
          <Calendar size={14} className="mr-1" />
          Round {round}
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex-1 text-left">
          <p className="font-medium">{homeTeam.name}</p>
          {homeTeam.owner && <p className="text-xs text-gray-500">{homeTeam.owner}</p>}
        </div>
        
        {isEditing ? (
          <div className="flex items-center mx-2 space-x-1">
            <Input 
              value={localHomeScore}
              onChange={e => setLocalHomeScore(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-16 text-center"
              placeholder="0"
              type="number"
              min="0"
              autoFocus
            />
            <span className="mx-1 text-gray-500">:</span>
            <Input 
              value={localAwayScore}
              onChange={e => setLocalAwayScore(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-16 text-center"
              placeholder="0"
              type="number"
              min="0"
            />
          </div>
        ) : (
          <div className="flex items-center mx-2">
            <span className={`text-xl font-bold ${isCompleted ? 'text-black' : 'text-gray-300'}`}>
              {homeScore !== null ? homeScore : '-'}
            </span>
            <span className="mx-2 text-gray-500">:</span>
            <span className={`text-xl font-bold ${isCompleted ? 'text-black' : 'text-gray-300'}`}>
              {awayScore !== null ? awayScore : '-'}
            </span>
          </div>
        )}
        
        <div className="flex-1 text-right">
          <p className="font-medium">{awayTeam.name}</p>
          {awayTeam.owner && <p className="text-xs text-gray-500">{awayTeam.owner}</p>}
        </div>
      </div>
      
      <div className="mt-3 flex justify-end">
        {isEditing ? (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCancel}
              className="flex items-center"
            >
              <X size={16} className="mr-1" />
              Cancel
            </Button>
            <Button 
              size="sm" 
              onClick={handleSave}
              className="bg-fifa-blue hover:bg-fifa-dark flex items-center"
            >
              <Save size={16} className="mr-1" />
              Save
            </Button>
          </div>
        ) : (
          <Button
            variant={isCompleted ? "ghost" : "outline"}
            size="sm"
            onClick={() => setIsEditing(true)}
            className={`${isCompleted ? 'text-green-600' : ''}`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 size={16} className="mr-1" /> 
                Completed
              </>
            ) : (
              'Enter Score'
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

const MatchList: React.FC = () => {
  const { league } = useLeague();
  const [showCompleted, setShowCompleted] = useState(false);
  
  if (!league) return null;
  
  const pendingMatches = league.matches.filter(match => !match.isCompleted);
  const completedMatches = league.matches.filter(match => match.isCompleted);

  return (
    <Card>
      <CardHeader className="bg-fifa-blue text-white py-4">
        <CardTitle className="flex items-center justify-between">
          <span>Fixtures</span>
          <div className="text-sm font-normal">
            {pendingMatches.length} pending / {completedMatches.length} played
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {pendingMatches.length > 0 ? (
          <>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Upcoming Matches</h3>
            {pendingMatches.map(match => (
              <MatchCard
                key={match.id}
                matchId={match.id}
                homeTeamId={match.homeTeamId}
                awayTeamId={match.awayTeamId}
                homeScore={match.homeScore}
                awayScore={match.awayScore}
                isCompleted={match.isCompleted}
                round={match.round}
              />
            ))}
          </>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <CheckCircle2 size={40} className="mx-auto mb-2 text-green-500" />
            <p>All matches have been played!</p>
          </div>
        )}
      </CardContent>
      
      {completedMatches.length > 0 && (
        <CardFooter className="flex-col p-0">
          <Button
            variant="ghost"
            onClick={() => setShowCompleted(!showCompleted)}
            className="w-full flex items-center justify-center py-3 border-t"
          >
            {showCompleted ? (
              <>
                <ChevronUp size={16} className="mr-1" />
                Hide Completed Matches
              </>
            ) : (
              <>
                <ChevronDown size={16} className="mr-1" />
                Show Completed Matches ({completedMatches.length})
              </>
            )}
          </Button>
          
          {showCompleted && (
            <div className="p-4 pt-0">
              <h3 className="text-sm font-medium text-gray-500 mt-4 mb-3">Completed Matches</h3>
              {completedMatches.map(match => (
                <MatchCard
                  key={match.id}
                  matchId={match.id}
                  homeTeamId={match.homeTeamId}
                  awayTeamId={match.awayTeamId}
                  homeScore={match.homeScore}
                  awayScore={match.awayScore}
                  isCompleted={match.isCompleted}
                  round={match.round}
                />
              ))}
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default MatchList;
