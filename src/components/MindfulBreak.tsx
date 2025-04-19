
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Timer } from "lucide-react";

const breathingPatterns = [
  { name: "4-7-8 Breathing", inhale: 4, hold: 7, exhale: 8 },
  { name: "Box Breathing", inhale: 4, hold: 4, exhale: 4, holdAfterExhale: 4 },
  { name: "Deep Calm", inhale: 5, hold: 2, exhale: 6 },
];

const affirmations = [
  "I am present in this moment.",
  "I choose to use technology mindfully.",
  "I am in control of my attention.",
  "I decide what deserves my focus.",
  "My time is valuable and limited.",
  "I can disconnect and reconnect with myself.",
  "I am more than my digital habits.",
  "I am creating healthy boundaries.",
];

const MindfulBreak = () => {
  const [activeBreak, setActiveBreak] = useState<'breathing' | 'affirmation' | null>(null);
  const [breathingPattern, setBreathingPattern] = useState(breathingPatterns[0]);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'holdAfterExhale'>('inhale');
  const [progress, setProgress] = useState(0);
  const [phaseTime, setPhaseTime] = useState(0);
  const [affirmation, setAffirmation] = useState(affirmations[0]);

  const startBreathing = () => {
    setActiveBreak('breathing');
    setBreathingPhase('inhale');
    setProgress(0);
    setPhaseTime(0);
    
    // In a real implementation, we would set up animation frames and timing
    // This is simplified for demonstration
  };

  const showAffirmation = () => {
    setActiveBreak('affirmation');
    // Pick a random affirmation
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    setAffirmation(affirmations[randomIndex]);
  };

  const endBreak = () => {
    setActiveBreak(null);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-zenpurple-500" />
          Mindful Break
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeBreak === null && (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              Take a moment to reset and reconnect with yourself
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={startBreathing}
                className="bg-zenpurple-500 hover:bg-zenpurple-600"
              >
                Breathing Exercise
              </Button>
              <Button 
                onClick={showAffirmation}
                className="bg-zenblue-500 hover:bg-zenblue-600"
              >
                Positive Affirmation
              </Button>
            </div>
          </div>
        )}

        {activeBreak === 'breathing' && (
          <div className="flex flex-col items-center py-4">
            <div className="text-xl font-medium mb-4">{breathingPattern.name}</div>
            <div className="relative w-36 h-36 rounded-full border-4 border-zenpurple-200 mb-4 flex items-center justify-center">
              <div 
                className="absolute w-full h-full rounded-full bg-zenpurple-100 opacity-60"
                style={{
                  transform: `scale(${breathingPhase === 'inhale' ? 0.7 + (progress / 100) * 0.3 : 
                               breathingPhase === 'exhale' ? 1 - (progress / 100) * 0.3 : 1})`,
                  transition: 'transform 1s ease-in-out'
                }}
              />
              <div className="text-2xl font-bold z-10">
                {breathingPhase === 'inhale' ? 'Inhale' : 
                 breathingPhase === 'exhale' ? 'Exhale' : 'Hold'}
              </div>
            </div>
            <Progress value={progress} className="w-full h-2 mb-4" />
            <Button onClick={endBreak} variant="outline" className="mt-2">
              End Break
            </Button>
          </div>
        )}

        {activeBreak === 'affirmation' && (
          <div className="flex flex-col items-center py-8">
            <div className="text-xl font-medium text-center px-4 mb-8 text-zenblue-700">
              "{affirmation}"
            </div>
            <Button onClick={showAffirmation} className="bg-zenblue-500 hover:bg-zenblue-600 mb-3">
              Next Affirmation
            </Button>
            <Button onClick={endBreak} variant="outline">
              End Break
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MindfulBreak;
