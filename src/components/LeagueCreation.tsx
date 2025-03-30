
import React, { useState } from 'react';
import { useLeague } from '@/context/LeagueContext';
import { LeagueFormat, Team } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Users, X, Plus, Save } from 'lucide-react';
import { generateId } from '@/services/leagueService';

const LeagueCreation: React.FC = () => {
  const { createLeague } = useLeague();
  const [leagueName, setLeagueName] = useState<string>('');
  const [format, setFormat] = useState<LeagueFormat>('round-robin-single');
  const [teams, setTeams] = useState<Team[]>([
    { id: generateId(), name: '', owner: '' },
    { id: generateId(), name: '', owner: '' },
  ]);

  const handleTeamChange = (id: string, field: keyof Team, value: string) => {
    setTeams(prevTeams => 
      prevTeams.map(team => 
        team.id === id ? { ...team, [field]: value } : team
      )
    );
  };

  const addTeam = () => {
    if (teams.length < 20) {
      setTeams([...teams, { id: generateId(), name: '', owner: '' }]);
    }
  };

  const removeTeam = (id: string) => {
    if (teams.length > 2) {
      setTeams(teams.filter(team => team.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate teams have names
    const validTeams = teams.filter(team => team.name.trim() !== '');
    
    if (validTeams.length < 2) {
      alert('You need at least 2 teams with names to create a league.');
      return;
    }
    
    // Use entered league name or generate a default one
    const name = leagueName.trim() || `FIFA League ${new Date().toLocaleDateString()}`;
    
    createLeague(name, validTeams, format);
  };

  return (
    <div className="container mx-auto max-w-3xl py-6 px-4 animate-fade-in">
      <Card>
        <CardHeader className="bg-fifa-dark text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy size={28} />
              <div>
                <CardTitle className="text-2xl">Create New FIFA League</CardTitle>
                <CardDescription className="text-gray-300">
                  Enter your league details to get started
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="leagueName">League Name (Optional)</Label>
                <Input
                  id="leagueName"
                  placeholder="Enter league name"
                  value={leagueName}
                  onChange={e => setLeagueName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="format">League Format</Label>
                <Select value={format} onValueChange={(value) => setFormat(value as LeagueFormat)}>
                  <SelectTrigger id="format" className="w-full">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="round-robin-single">Round Robin (Single Match)</SelectItem>
                    <SelectItem value="round-robin-double">Round Robin (Multiple Matches)</SelectItem>
                    <SelectItem value="best-of-2">Best of 2</SelectItem>
                    <SelectItem value="home-away">Home & Away</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Users size={18} />
                    Teams
                  </Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addTeam}
                    className="flex items-center gap-1"
                  >
                    <Plus size={16} /> Add Team
                  </Button>
                </div>
                
                <div className="space-y-3 mt-3">
                  {teams.map((team, index) => (
                    <div key={team.id} className="team-item">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="font-medium w-8 text-center">{index + 1}</span>
                        <div className="flex flex-col sm:flex-row gap-2 w-full">
                          <Input
                            placeholder="Team name"
                            value={team.name}
                            onChange={e => handleTeamChange(team.id, 'name', e.target.value)}
                            className="flex-1"
                            required
                          />
                          <Input
                            placeholder="Player name"
                            value={team.owner}
                            onChange={e => handleTeamChange(team.id, 'owner', e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      {teams.length > 2 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeTeam(team.id)}
                          className="ml-2"
                        >
                          <X size={16} />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <CardFooter className="flex justify-end pt-6 px-0">
              <Button type="submit" className="bg-fifa-blue hover:bg-fifa-dark flex items-center gap-2">
                <Save size={18} />
                Create League
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeagueCreation;
