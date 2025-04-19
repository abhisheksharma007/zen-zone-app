
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Calendar, ArrowUp, Share } from "lucide-react";
import { Achievement, getAchievements } from "@/utils/achievementUtils";
import { formatDistanceToNow } from "date-fns";
import { toast } from "@/components/ui/sonner";

const Achievements = () => {
  const [achievements] = useState<Achievement[]>(getAchievements());
  const navigate = useNavigate();
  const totalEarned = achievements.filter(a => a.earned).length;
  const totalPoints = achievements.reduce((sum, a) => a.earned ? sum + a.points : sum, 0);

  const handleShare = () => {
    // In a real app, this would use the Web Share API
    toast.success("Share feature would open native sharing here!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zenblue-50 p-4 md:p-6">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            className="flex items-center gap-2" 
            onClick={() => navigate("/")}
          >
            Back
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleShare}
          >
            <Share className="h-4 w-4" />
            Share Progress
          </Button>
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" /> 
            Your Achievements
          </h1>
          <p className="text-muted-foreground">
            You've earned {totalPoints} points and {totalEarned}/{achievements.length} achievements
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-zenpurple-500" />
                Earned Achievements
              </span>
              <span className="text-sm font-normal text-muted-foreground">
                {totalEarned}/{achievements.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {achievements
                .filter(a => a.earned)
                .sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0))
                .map((achievement) => (
                  <div 
                    key={achievement.id}
                    className="flex items-center p-3 bg-muted rounded-lg animate-fade-in"
                  >
                    <div className="h-10 w-10 flex items-center justify-center bg-yellow-100 rounded-full mr-3">
                      {achievement.icon === "smile" && <Star className="h-5 w-5 text-yellow-500" />}
                      {achievement.icon === "trophy" && <Trophy className="h-5 w-5 text-yellow-500" />}
                      {achievement.icon === "star" && <Star className="h-5 w-5 text-yellow-500" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{achievement.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {achievement.date ? formatDistanceToNow(achievement.date, { addSuffix: true }) : "Recently"}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-zenpurple-600">
                      +{achievement.points}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Star className="h-5 w-5 text-muted-foreground" />
                Locked Achievements
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {achievements
                .filter(a => !a.earned)
                .map((achievement) => (
                  <div 
                    key={achievement.id}
                    className="flex items-center p-3 bg-muted/50 rounded-lg opacity-70"
                  >
                    <div className="h-10 w-10 flex items-center justify-center bg-muted rounded-full mr-3">
                      <Trophy className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{achievement.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {achievement.description}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-muted">
                      {achievement.points} pts
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Achievements;
