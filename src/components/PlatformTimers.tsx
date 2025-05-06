import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

interface Platform {
  name: string;
  timeLimit: number;
  timeSpent: number;
}

const DEFAULT_PLATFORMS: Platform[] = [
  { name: "Instagram", timeLimit: 15, timeSpent: 0 },
  { name: "Twitter", timeLimit: 10, timeSpent: 0 },
  { name: "Reddit", timeLimit: 5, timeSpent: 0 },
];

const PlatformTimers = () => {
  const { user } = useAuth();
  const [platforms, setPlatforms] = useState<Platform[]>(DEFAULT_PLATFORMS);
  const [isTracking, setIsTracking] = useState(false);

  // Load saved platforms on mount
  useEffect(() => {
    const loadPlatforms = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('platform_timers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setPlatforms(data.platforms);
      }
    };

    loadPlatforms();
  }, [user]);

  // Save platforms when they change
  useEffect(() => {
    const savePlatforms = async () => {
      if (!user) return;

      const { error } = await supabase
        .from('platform_timers')
        .upsert({
          user_id: user.id,
          platforms,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error saving platforms:', error);
      }
    };

    savePlatforms();
  }, [platforms, user]);

  // Track time spent
  useEffect(() => {
    let interval: number | null = null;

    if (isTracking) {
      interval = window.setInterval(() => {
        setPlatforms(prev => prev.map(platform => ({
          ...platform,
          timeSpent: platform.timeSpent + 1/60 // Increment by 1 second (1/60 minute)
        })));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking]);

  const totalBudget = platforms.reduce((acc, curr) => acc + curr.timeLimit, 0);
  const totalSpent = platforms.reduce((acc, curr) => acc + curr.timeSpent, 0);
  const overallProgress = (totalSpent / totalBudget) * 100;

  const handleLimitChange = (index: number, newLimit: number) => {
    const updatedPlatforms = [...platforms];
    updatedPlatforms[index] = {
      ...updatedPlatforms[index],
      timeLimit: Math.max(1, newLimit), // Ensure minimum of 1 minute
    };
    setPlatforms(updatedPlatforms);
  };

  const resetTimeSpent = () => {
    setPlatforms(prev => prev.map(platform => ({
      ...platform,
      timeSpent: 0
    })));
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
                {Math.round(totalSpent)} / {totalBudget} min
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
                  {Math.round(platform.timeSpent)} / {platform.timeLimit} minutes used
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setIsTracking(!isTracking)}
              className="text-sm text-zenpurple-600 hover:text-zenpurple-700"
            >
              {isTracking ? 'Pause Tracking' : 'Start Tracking'}
            </button>
            <button
              onClick={resetTimeSpent}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Reset Time
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlatformTimers;
