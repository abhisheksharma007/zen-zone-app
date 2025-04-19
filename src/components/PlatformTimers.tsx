
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star } from "lucide-react";

interface Platform {
  name: string;
  timeLimit: number;
  timeSpent: number;
}

const PlatformTimers = () => {
  const [platforms, setPlatforms] = useState<Platform[]>([
    { name: "Instagram", timeLimit: 15, timeSpent: 5 },
    { name: "Twitter", timeLimit: 10, timeSpent: 3 },
    { name: "Reddit", timeLimit: 5, timeSpent: 1 },
  ]);

  const totalBudget = platforms.reduce((acc, curr) => acc + curr.timeLimit, 0);
  const totalSpent = platforms.reduce((acc, curr) => acc + curr.timeSpent, 0);
  const overallProgress = (totalSpent / totalBudget) * 100;

  const handleLimitChange = (index: number, newLimit: number) => {
    const updatedPlatforms = [...platforms];
    updatedPlatforms[index] = {
      ...updatedPlatforms[index],
      timeLimit: newLimit,
    };
    setPlatforms(updatedPlatforms);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-zenpurple-500" />
          Platform Time Budget
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Overall Usage</span>
              <span className="text-sm text-muted-foreground">
                {totalSpent} / {totalBudget} min
              </span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>

          <div className="space-y-3">
            {platforms.map((platform, index) => (
              <div key={platform.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{platform.name}</span>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={1}
                      value={platform.timeLimit}
                      onChange={(e) => handleLimitChange(index, Number(e.target.value))}
                      className="w-20 h-8"
                    />
                    <span className="text-sm text-muted-foreground">min</span>
                  </div>
                </div>
                <Progress
                  value={(platform.timeSpent / platform.timeLimit) * 100}
                  className="h-2"
                />
                <div className="text-xs text-muted-foreground text-right">
                  {platform.timeSpent} / {platform.timeLimit} minutes used
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlatformTimers;
