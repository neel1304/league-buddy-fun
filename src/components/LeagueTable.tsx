
import React from 'react';
import { useLeague } from '@/context/LeagueContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal } from 'lucide-react';

const LeagueTable: React.FC = () => {
  const { leagueTable, league } = useLeague();
  
  if (!league || leagueTable.length === 0) {
    return null;
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="table-header py-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy size={20} />
            <span>League Table</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left">
                <th className="p-3 pl-4 font-medium">Pos</th>
                <th className="p-3 font-medium">Team</th>
                <th className="p-3 text-center font-medium">MP</th>
                <th className="p-3 text-center font-medium hidden sm:table-cell">W</th>
                <th className="p-3 text-center font-medium hidden sm:table-cell">D</th>
                <th className="p-3 text-center font-medium hidden sm:table-cell">L</th>
                <th className="p-3 text-center font-medium">GF</th>
                <th className="p-3 text-center font-medium">GA</th>
                <th className="p-3 text-center font-medium">GD</th>
                <th className="p-3 text-center font-medium">Pts</th>
              </tr>
            </thead>
            <tbody>
              {leagueTable.map((entry, index) => (
                <tr 
                  key={entry.teamId} 
                  className={`border-b hover:bg-gray-50 ${
                    index === 0 ? 'bg-green-50' : 
                    index === 1 ? 'bg-blue-50' : ''
                  }`}
                >
                  <td className="p-3 pl-4 font-medium flex items-center">
                    {index === 0 ? (
                      <span className="flex items-center">
                        <Trophy size={16} className="mr-1 text-fifa-accent" />
                        {index + 1}
                      </span>
                    ) : index === 1 ? (
                      <span className="flex items-center">
                        <Medal size={16} className="mr-1 text-gray-500" />
                        {index + 1}
                      </span>
                    ) : (
                      index + 1
                    )}
                  </td>
                  <td className="p-3 font-medium">
                    <div>
                      <span>{entry.teamName}</span>
                      {entry.owner && (
                        <span className="text-xs text-gray-500 block">
                          {entry.owner}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-center">{entry.played}</td>
                  <td className="p-3 text-center hidden sm:table-cell">{entry.won}</td>
                  <td className="p-3 text-center hidden sm:table-cell">{entry.drawn}</td>
                  <td className="p-3 text-center hidden sm:table-cell">{entry.lost}</td>
                  <td className="p-3 text-center">{entry.goalsFor}</td>
                  <td className="p-3 text-center">{entry.goalsAgainst}</td>
                  <td className="p-3 text-center font-medium">
                    {entry.goalDifference > 0 ? `+${entry.goalDifference}` : entry.goalDifference}
                  </td>
                  <td className="p-3 text-center font-bold">{entry.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeagueTable;
