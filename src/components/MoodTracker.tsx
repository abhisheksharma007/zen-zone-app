
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smile } from "lucide-react";

type Mood = "great" | "good" | "neutral" | "bad" | "terrible";

const MoodTracker = () => {
  const [currentMood, setCurrentMood] = useState<Mood | null>(null);
  const [showingPostScroll, setShowingPostScroll] = useState(false);

  const moods: { value: Mood; emoji: string; label: string }[] = [
    { value: "great", emoji: "😊", label: "Great" },
    { value: "good", emoji: "🙂", label: "Good" },
    { value: "neutral", emoji: "😐", label: "Neutral" },
    { value: "bad", emoji: "😕", label: "Bad" },
    { value: "terrible", emoji: "😢", label: "Terrible" },
  ];

  const handleMoodSelect = (mood: Mood) => {
    setCurrentMood(mood);
    if (!showingPostScroll) {
      setShowingPostScroll(true);
    }
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
          <p className="text-sm text-muted-foreground">
            {showingPostScroll
              ? "How do you feel after scrolling?"
              : "How do you feel before starting?"}
          </p>
          <div className="flex justify-between gap-2">
            {moods.map((mood) => (
              <Button
                key={mood.value}
                variant={currentMood === mood.value ? "default" : "outline"}
                className="flex-1 flex-col py-3"
                onClick={() => handleMoodSelect(mood.value)}
              >
                <span className="text-xl mb-1">{mood.emoji}</span>
                <span className="text-xs">{mood.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodTracker;
