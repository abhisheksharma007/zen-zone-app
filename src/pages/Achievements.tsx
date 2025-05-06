
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { LoadingCard, LoadingSpinner } from '@/components/Loading';
import ErrorBoundary from '@/components/ErrorBoundary';
import { getAchievements } from '@/utils/achievementUtils';
import BackButton from '@/components/BackButton';
import { Achievement, UserAchievement, AchievementWithCompletion } from '@/types';

export default function Achievements() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [achievements, setAchievements] = useState<AchievementWithCompletion[]>([]);

  // Use mock achievements from the utility until we have real database tables
  useEffect(() => {
    // Convert mock achievements to the expected format
    const mockAchievements = getAchievements();
    
    const formattedAchievements = mockAchievements.map(achievement => ({
      id: achievement.id,
      name: achievement.name,
      description: achievement.description,
      points: achievement.points,
      completed: achievement.earned,
      completed_at: achievement.date ? achievement.date.toISOString() : null,
      created_at: new Date().toISOString()
    })) as AchievementWithCompletion[];
    
    setAchievements(formattedAchievements);
  }, []);

  const handleCompleteAchievement = async (achievementId: string) => {
    setIsLoading(true);
    try {
      // In a real app, this should validate if the user has actually earned this achievement
      // For demo purposes, we'll just mark it as completed
      const updatedAchievements = achievements.map((achievement) => {
        if (achievement.id === achievementId) {
          return {
            ...achievement,
            completed: true,
            completed_at: new Date().toISOString(),
          };
        }
        return achievement;
      });

      setAchievements(updatedAchievements);

      toast({
        title: "Achievement unlocked!",
        description: "Congratulations on your progress!",
      });
    } catch (error) {
      console.error('Error completing achievement:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to complete achievement',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!achievements.length) {
    return (
      <div className="container mx-auto py-8">
        <BackButton to="/" label="Back to Home" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  const totalPoints = achievements
    .filter((achievement) => achievement.completed)
    .reduce((acc, achievement) => acc + achievement.points, 0);

  return (
    <ErrorBoundary>
      <div className="container mx-auto py-8">
        <BackButton to="/" label="Back to Home" />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Achievements</h1>
          <p className="text-muted-foreground">
            You have earned {totalPoints} points from {achievements.filter(a => a.completed).length} achievements
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <Card key={achievement.id} className={achievement.completed ? "border-green-500" : ""}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{achievement.name}</CardTitle>
                  <Badge variant={achievement.completed ? "default" : "outline"}>
                    {achievement.points} pts
                  </Badge>
                </div>
                <p className="text-muted-foreground">{achievement.description}</p>
              </CardHeader>
              <CardContent>
                {!achievement.completed ? (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    disabled={isLoading}
                    onClick={() => handleCompleteAchievement(achievement.id)}
                  >
                    {isLoading ? <LoadingSpinner size="sm" /> : "Complete"}
                  </Button>
                ) : (
                  <div className="text-center text-green-500 font-medium">
                    Completed on {new Date(achievement.completed_at!).toLocaleDateString()}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
}
