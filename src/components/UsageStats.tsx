
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Timer } from "lucide-react";

// This would normally be fetched from local storage or a backend
const mockStats = {
  dailyGoal: 30, // 30 minutes as the goal
  todayUsage: 18, // 18 minutes used today
  weeklyAverage: 25, // 25 minutes daily average for the week
  streakDays: 3, // 3 days streak of meeting goals
  scrollBreaks: 4, // 4 mindful breaks taken
  comparison: -12, // 12% less than last week
};

const UsageStats = () => {
  const dailyProgress = (mockStats.todayUsage / mockStats.dailyGoal) * 100;
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5 text-zenpurple-500" />
          Your Mindful Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Daily Goal</span>
              <span className="text-sm text-muted-foreground">{mockStats.todayUsage} / {mockStats.dailyGoal} min</span>
            </div>
            <Progress value={dailyProgress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-zenblue-50 p-3 rounded-lg">
              <div className="text-sm text-muted-foreground">Weekly Avg</div>
              <div className="text-xl font-semibold text-zenblue-700">{mockStats.weeklyAverage} min</div>
            </div>
            
            <div className="bg-zenpurple-50 p-3 rounded-lg">
              <div className="text-sm text-muted-foreground">Day Streak</div>
              <div className="text-xl font-semibold text-zenpurple-700">{mockStats.streakDays} days</div>
            </div>
            
            <div className="bg-zenblue-50 p-3 rounded-lg">
              <div className="text-sm text-muted-foreground">Mindful Breaks</div>
              <div className="text-xl font-semibold text-zenblue-700">{mockStats.scrollBreaks} today</div>
            </div>
            
            <div className="bg-zenpurple-50 p-3 rounded-lg">
              <div className="text-sm text-muted-foreground">vs. Last Week</div>
              <div className={`text-xl font-semibold ${mockStats.comparison < 0 ? 'text-green-600' : 'text-amber-600'}`}>
                {mockStats.comparison < 0 ? '' : '+'}
                {mockStats.comparison}%
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsageStats;
