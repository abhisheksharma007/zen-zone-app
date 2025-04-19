
import AppHeader from "@/components/AppHeader";
import ScrollTimer from "@/components/ScrollTimer";
import MindfulBreak from "@/components/MindfulBreak";
import UsageStats from "@/components/UsageStats";
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
            Set timers, take mindful breaks, and track your progress
          </p>
        </div>

        <Tabs defaultValue="timer" className="w-full mb-6">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="timer" className="flex items-center gap-1">
              <AlarmClock className="h-4 w-4" /> Timer
            </TabsTrigger>
            <TabsTrigger value="break" className="flex items-center gap-1">
              <Clock className="h-4 w-4" /> Break
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-1">
              <Timer className="h-4 w-4" /> Stats
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="timer" className="mt-0">
            <ScrollTimer />
            <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border border-border">
              <h3 className="font-medium mb-2">How to use the timer:</h3>
              <ol className="text-sm text-muted-foreground list-decimal pl-5 space-y-1">
                <li>Start the timer when you begin scrolling</li>
                <li>The timer will alert you when you reach your limit</li>
                <li>Take a mindful break to reset your mind</li>
                <li>Resume with more awareness of your time</li>
              </ol>
            </div>
          </TabsContent>
          
          <TabsContent value="break" className="mt-0">
            <MindfulBreak />
            <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border border-border">
              <h3 className="font-medium mb-2">Benefits of mindful breaks:</h3>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>Reduce anxiety and stress from content overload</li>
                <li>Reset your attention span</li>
                <li>Reconnect with your surroundings</li>
                <li>Break the dopamine-seeking cycle</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="stats" className="mt-0">
            <UsageStats />
            <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border border-border">
              <h3 className="font-medium mb-2">Your progress matters:</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Track your habits to build awareness and celebrate improvements in your digital wellbeing journey.
              </p>
              <p className="text-sm text-muted-foreground">
                Small, consistent changes lead to significant improvements in focus and mental health over time.
              </p>
            </div>
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
