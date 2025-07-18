
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smile, Star, Trophy } from "lucide-react";
import { calculatePoints, unlockAchievement } from "@/utils/achievementUtils";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";

type Mood = "great" | "good" | "neutral" | "bad" | "terrible";

const MoodTracker = () => {
  const [beforeMood, setBeforeMood] = useState<Mood | null>(null);
  const [afterMood, setAfterMood] = useState<Mood | null>(null);
  const [showingPostScroll, setShowingPostScroll] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(1);
  const [totalPoints, setTotalPoints] = useState(0);
  const [showCongrats, setShowCongrats] = useState(false);
  const navigate = useNavigate();

  const moods: { value: Mood; emoji: string; label: string }[] = [
    { value: "great", emoji: "😊", label: "Great" },
    { value: "good", emoji: "🙂", label: "Good" },
    { value: "neutral", emoji: "😐", label: "Neutral" },
    { value: "bad", emoji: "😕", label: "Bad" },
    { value: "terrible", emoji: "😢", label: "Terrible" },
  ];

  const handleMoodSelect = (mood: Mood) => {
    if (!showingPostScroll) {
      setBeforeMood(mood);
      setShowingPostScroll(true);
    } else {
      setAfterMood(mood);
      // Calculate points when both moods are recorded
      const earnedPoints = calculatePoints(beforeMood!, mood, true);
      setTotalPoints(prev => prev + earnedPoints);
      setCurrentStreak(prev => prev + 1);
      
      if (earnedPoints > 30) {
        setShowCongrats(true);
        
        // Check for mood improvement achievement
        if (
          (beforeMood === "terrible" && ["neutral", "good", "great"].includes(mood)) ||
          (beforeMood === "bad" && ["good", "great"].includes(mood))
        ) {
          const achievement = unlockAchievement("mood-improver");
          if (achievement) {
            toast.success(`Achievement Unlocked: ${achievement.name}`, {
              description: `+${achievement.points} points`,
            });
          }
        }
      }
      
      // Check for streak achievements
      if (currentStreak + 1 >= 3) {
        const achievement = unlockAchievement("three-day-streak");
        if (achievement) {
          toast.success(`Achievement Unlocked: ${achievement.name}`, {
            description: `+${achievement.points} points`,
          });
        }
      }
    }
  };

  const resetMoodTracking = () => {
    setBeforeMood(null);
    setAfterMood(null);
    setShowingPostScroll(false);
    setShowCongrats(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smile className="h-5 w-5 text-zenpurple-500" />
          Mood Check-in
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <div 
              className="flex items-center gap-2 cursor-pointer hover:text-zenpurple-600 transition-colors"
              onClick={() => navigate("/achievements")}
            >
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">{totalPoints} points</span>
            </div>
            <div className="text-sm text-muted-foreground">
              🔥 {currentStreak} day streak
            </div>
          </div>

          {showCongrats && afterMood && (
            <div className="p-3 bg-green-50 border border-green-100 rounded-lg mb-4 animate-fade-in">
              <div className="font-medium text-green-700 mb-1">Great job!</div>
              <div className="text-sm text-green-600">
                You improved your mood from {moods.find(m => m.value === beforeMood)?.emoji} to {moods.find(m => m.value === afterMood)?.emoji}
              </div>
              <div className="mt-2 pt-2 border-t border-green-100 text-xs text-green-600">
                Tip: Check your achievements page to see your progress!
              </div>
            </div>
          )}

          <div className="space-y-2">
            {beforeMood && !afterMood && (
              <div className="mb-2">
                <div className="text-sm mb-1">Before mood:</div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{moods.find(m => m.value === beforeMood)?.emoji}</span>
                  <span className="text-sm">{moods.find(m => m.value === beforeMood)?.label}</span>
                </div>
              </div>
            )}

            <p className="text-sm text-muted-foreground">
              {showingPostScroll
                ? "How do you feel after scrolling?"
                : "How do you feel before starting?"}
            </p>

            <div className="flex justify-between gap-2">
              {moods.map((mood) => (
                <Button
                  key={mood.value}
                  variant={
                    (showingPostScroll ? afterMood : beforeMood) === mood.value
                      ? "default"
                      : "outline"
                  }
                  className="flex-1 flex-col py-3"
                  onClick={() => handleMoodSelect(mood.value)}
                >
                  <span className="text-xl mb-1">{mood.emoji}</span>
                  <span className="text-xs">{mood.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {afterMood && (
            <div className="pt-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={resetMoodTracking}
              >
                Start New Session
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodTracker;
