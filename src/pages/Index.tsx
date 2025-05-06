import ScrollTimer from "@/components/ScrollTimer";
import MindfulBreak from "@/components/MindfulBreak";
import UsageStats from "@/components/UsageStats";
import PlatformTimers from "@/components/PlatformTimers";
import MoodTracker from "@/components/MoodTracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlarmClock, Clock, Timer } from "lucide-react";

const Index = () => {
  return (
    <div className="container mx-auto py-6 sm:py-8 md:py-12 px-4">
      <div className="max-w-md sm:max-w-xl md:max-w-2xl mx-auto">
        <Tabs defaultValue="timer" className="w-full mb-6 sm:mb-8">
          <TabsList className="grid grid-cols-3 mb-4 sm:mb-6 p-1">
            <TabsTrigger value="timer" className="flex items-center gap-1 sm:gap-2 py-1.5 sm:py-2 text-sm sm:text-base">
              <AlarmClock className="h-4 w-4 sm:h-5 sm:w-5" /> 
              <span className="hidden sm:inline">Timers</span>
              <span className="sm:hidden">Timer</span>
            </TabsTrigger>
            <TabsTrigger value="break" className="flex items-center gap-1 sm:gap-2 py-1.5 sm:py-2 text-sm sm:text-base">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5" /> 
              <span className="hidden sm:inline">Break</span>
              <span className="sm:hidden">Break</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-1 sm:gap-2 py-1.5 sm:py-2 text-sm sm:text-base">
              <Timer className="h-4 w-4 sm:h-5 sm:w-5" /> 
              <span className="hidden sm:inline">Stats</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="timer" className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
            <MoodTracker />
            <PlatformTimers />
            <ScrollTimer />
          </TabsContent>
          
          <TabsContent value="break" className="mt-4 sm:mt-6">
            <MindfulBreak />
          </TabsContent>
          
          <TabsContent value="stats" className="mt-4 sm:mt-6">
            <UsageStats />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
