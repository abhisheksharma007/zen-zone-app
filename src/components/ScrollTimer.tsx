import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlarmClock, Pause, Timer, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

const DEFAULT_TIMER_LIMIT = 15 * 60; // 15 minutes in seconds

const ScrollTimer = () => {
  const { user } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerLimit, setTimerLimit] = useState(DEFAULT_TIMER_LIMIT);
  const [isEditingLimit, setIsEditingLimit] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const [shouldAlert, setShouldAlert] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load saved timer limit
  useEffect(() => {
    const loadTimerLimit = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('user_settings')
        .select('timer_limit')
        .eq('user_id', user.id)
        .single();

      if (data?.timer_limit) {
        setTimerLimit(data.timer_limit * 60); // Convert minutes to seconds
      }
    };

    loadTimerLimit();
  }, [user]);

  // Save timer limit when it changes
  useEffect(() => {
    const saveTimerLimit = async () => {
      if (!user || !isEditingLimit) return;

      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          timer_limit: Math.round(timerLimit / 60), // Convert seconds to minutes
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error saving timer limit:', error);
      }
    };

    saveTimerLimit();
  }, [timerLimit, user, isEditingLimit]);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('/notification.mp3');
  }, []);

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
      
      // Play notification sound
      if (audioRef.current) {
        audioRef.current.play().catch(error => {
          console.error('Error playing notification sound:', error);
        });
      }

      // Show browser notification if permitted
      if (Notification.permission === 'granted') {
        new Notification('Time to take a break!', {
          body: 'You\'ve reached your scrolling time limit.',
          icon: '/logo.svg'
        });
      }
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

  const handleTimerLimitChange = (minutes: number) => {
    const newLimit = Math.max(1, minutes) * 60; // Convert to seconds, minimum 1 minute
    setTimerLimit(newLimit);
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
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlarmClock className="h-5 w-5 text-zenpurple-500" />
            Scroll Timer
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditingLimit(!isEditingLimit)}
            className="h-8 w-8"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          {isEditingLimit ? (
            <div className="flex items-center gap-2 mb-4">
              <Input
                type="number"
                min={1}
                value={Math.round(timerLimit / 60)}
                onChange={(e) => handleTimerLimitChange(Number(e.target.value))}
                className="w-20"
              />
              <span className="text-sm text-muted-foreground">minutes</span>
            </div>
          ) : (
            <div className="text-4xl font-bold mb-3 text-zenblue-600">
              {formatTime(timeElapsed)}
            </div>
          )}
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
