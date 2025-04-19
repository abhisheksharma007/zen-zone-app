
import AppHeader from "@/components/AppHeader";
import ScrollTimer from "@/components/ScrollTimer";
import MindfulBreak from "@/components/MindfulBreak";
import UsageStats from "@/components/UsageStats";
import PlatformTimers from "@/components/PlatformTimers";
import MoodTracker from "@/components/MoodTracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlarmClock, Clock, Timer } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zenblue-50 p-4 md:p-6">
      <div className="max-w-md mx-auto">
        <AppHeader />
        
        <div className="mb-6">
          <h2 className="text-xl font-medium mb-2 text-center">Break the doomscrolling cycle</h2>
          <p className="text-muted-foreground text-center">
            Set timers, track platforms, and improve your digital wellbeing
          </p>
        </div>

        <Tabs defaultValue="timer" className="w-full mb-6">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="timer" className="flex items-center gap-1">
              <AlarmClock className="h-4 w-4" /> Timers
            </TabsTrigger>
            <TabsTrigger value="break" className="flex items-center gap-1">
              <Clock className="h-4 w-4" /> Break
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-1">
              <Timer className="h-4 w-4" /> Stats
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="timer" className="mt-0 space-y-4">
            <MoodTracker />
            <PlatformTimers />
            <ScrollTimer />
          </TabsContent>
          
          <TabsContent value="break" className="mt-0">
            <MindfulBreak />
          </TabsContent>
          
          <TabsContent value="stats" className="mt-0">
            <UsageStats />
          </TabsContent>
        </Tabs>

        <footer className="text-center text-sm text-muted-foreground">
          <p>Zen Zone - Take back control of your scrolling</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
