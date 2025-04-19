
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlarmClock, Pause, Timer } from "lucide-react";

const ScrollTimer = () => {
  const [isActive, setIsActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerLimit, setTimerLimit] = useState(15 * 60); // 15 minutes in seconds
  const intervalRef = useRef<number | null>(null);
  const [shouldAlert, setShouldAlert] = useState(false);

  // Clear interval on component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (timeElapsed >= timerLimit && isActive) {
      setIsActive(false);
      setShouldAlert(true);
      
      // Play a gentle sound (would need implementation in a real app)
      const notification = new Audio();
      // In a real app, this would play a sound file
    }
  }, [timeElapsed, timerLimit, isActive]);

  const toggleTimer = () => {
    if (!isActive) {
      setIsActive(true);
      setShouldAlert(false);
      
      intervalRef.current = window.setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    } else {
      setIsActive(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeElapsed(0);
    setShouldAlert(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (timeElapsed / timerLimit) * 100;

  return (
    <Card className={`w-full ${shouldAlert ? 'border-destructive animate-pulse' : ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <AlarmClock className="h-5 w-5 text-zenpurple-500" />
          Scroll Timer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="text-4xl font-bold mb-3 text-zenblue-600">
            {formatTime(timeElapsed)}
          </div>
          <Progress 
            value={progressPercentage} 
            className={`w-full h-2 mb-4 ${progressPercentage > 80 ? "[&>div]:bg-destructive" : "[&>div]:bg-zenpurple-500"}`}
          />
          
          <div className="text-sm text-muted-foreground mb-4">
            {shouldAlert ? (
              <span className="text-destructive">Time to take a break!</span>
            ) : (
              <span>Scrolling limit: {formatTime(timerLimit)}</span>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center gap-3">
        <Button 
          onClick={toggleTimer} 
          variant="outline"
          className={`${isActive ? 'bg-zenpurple-100 text-zenpurple-700' : 'bg-zenblue-50 hover:bg-zenblue-100'}`}
        >
          {isActive ? (
            <>
              <Pause className="h-4 w-4 mr-2" /> Pause
            </>
          ) : (
            <>
              <Timer className="h-4 w-4 mr-2" /> Start
            </>
          )}
        </Button>
        <Button 
          onClick={resetTimer} 
          variant="outline"
          className="hover:bg-muted"
        >
          Reset
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ScrollTimer;
