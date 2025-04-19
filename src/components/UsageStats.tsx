
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";

// This would normally be fetched from local storage or a backend
const mockStats = {
  dailyGoal: 30, // 30 minutes as the goal
  todayUsage: 18, // 18 minutes used today
  weeklyAverage: 25, // 25 minutes daily average for the week
  streakDays: 5, // 5 days streak of meeting goals
  scrollBreaks: 4, // 4 mindful breaks taken
  zenPoints: 230, // Points earned
  comparison: -12, // 12% less than last week
  achievements: [
    { name: "Early Bird", description: "Started day with mindfulness", points: 50 },
    { name: "Break Master", description: "Took all scheduled breaks", points: 100 },
    { name: "Under Budget", description: "Stayed under time limit", points: 80 },
  ],
};

const UsageStats = () => {
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
            
            <div className="bg-zenpurple-50 p-3 rounded-lg">
              <div className="text-sm text-muted-foreground">Zen Points</div>
              <div className="text-xl font-semibold text-zenpurple-700">
                {mockStats.zenPoints} pts
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium mb-2">Today's Achievements</h3>
            {mockStats.achievements.map((achievement) => (
              <div 
                key={achievement.name}
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
