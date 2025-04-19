
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star, Trophy, ArrowUp, Clock } from "lucide-react";
import { getAchievements } from "@/utils/achievementUtils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const UsageStats = () => {
  const navigate = useNavigate();
  const achievements = getAchievements();
  const earnedAchievements = achievements.filter(a => a.earned);
  
  // This would normally be fetched from local storage or a backend
  const mockStats = {
    dailyGoal: 30, // 30 minutes as the goal
    todayUsage: 18, // 18 minutes used today
    weeklyAverage: 25, // 25 minutes daily average for the week
    streakDays: 5, // 5 days streak of meeting goals
    scrollBreaks: 4, // 4 mindful breaks taken
    zenPoints: earnedAchievements.reduce((sum, a) => sum + a.points, 0),
    comparison: -12, // 12% less than last week
    moodImprovement: 15, // 15% mood improvement this week
  };
  
  const dailyProgress = (mockStats.todayUsage / mockStats.dailyGoal) * 100;
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-zenpurple-500" />
          Your Mindful Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-zenblue-50 p-3 rounded-lg">
              <div className="text-sm text-muted-foreground">Streak</div>
              <div className="text-xl font-semibold text-zenblue-700">
                {mockStats.streakDays} days
              </div>
            </div>
            
            <div 
              className="bg-zenpurple-50 p-3 rounded-lg cursor-pointer hover:bg-zenpurple-100 transition-colors"
              onClick={() => navigate("/achievements")}
            >
              <div className="text-sm text-muted-foreground">Zen Points</div>
              <div className="text-xl font-semibold text-zenpurple-700">
                {mockStats.zenPoints} pts
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">This Week's Progress</h3>
            
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-zenpurple-600" />
                  <span className="text-sm font-medium">Scroll Time</span>
                </div>
                <span className="text-sm text-green-600 flex items-center">
                  <ArrowUp className="h-3 w-3 rotate-180" /> 
                  {Math.abs(mockStats.comparison)}% less
                </span>
              </div>
              <Progress value={dailyProgress} className="h-2 mb-1" />
              <div className="text-xs text-muted-foreground">
                {mockStats.todayUsage} minutes today vs {mockStats.weeklyAverage} daily average
              </div>
            </div>
            
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Smile className="h-4 w-4 text-zenpurple-600" />
                  <span className="text-sm font-medium">Mood Improvement</span>
                </div>
                <span className="text-sm text-green-600 flex items-center">
                  <ArrowUp className="h-3 w-3" /> 
                  {mockStats.moodImprovement}%
                </span>
              </div>
              <Progress value={mockStats.moodImprovement * 4} className="h-2" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Recent Achievements</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/achievements")}
                className="text-xs h-7 text-zenpurple-600"
              >
                View All
              </Button>
            </div>
            
            {earnedAchievements.slice(0, 2).map((achievement) => (
              <div 
                key={achievement.id}
                className="flex items-center justify-between p-2 bg-muted rounded-lg"
              >
                <div>
                  <div className="font-medium text-sm">{achievement.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {achievement.description}
                  </div>
                </div>
                <div className="text-sm font-medium text-zenpurple-600">
                  +{achievement.points}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsageStats;
