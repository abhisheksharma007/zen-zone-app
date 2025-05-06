
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { LoadingCard, LoadingSpinner } from '@/components/Loading';
import ErrorBoundary from '@/components/ErrorBoundary';
import { AchievementWithCompletion } from '@/types';
import { getAchievements, unlockAchievement } from '@/utils/achievementUtils';

export default function Achievements() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [achievements, setAchievements] = useState<AchievementWithCompletion[]>([]);

  // Use mock achievements from the utility until we have real database tables
  const { data, isLoading: isLoadingAchievements } = useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      // Use the mock achievements utility
      const mockAchievements = getAchievements();
      
      // Convert to our expected format
      return mockAchievements.map(achievement => ({
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        points: achievement.points,
        completed: achievement.earned,
        completed_at: achievement.date ? achievement.date.toISOString() : null,
        created_at: new Date().toISOString()
      })) as AchievementWithCompletion[];
    },
    enabled: !!user,
  });

  useState(() => {
    if (data) {
      setAchievements(data);
    }
  }, [data]);

  const handleCompleteAchievement = async (achievementId: string) => {
    setIsLoading(true);
    try {
      // Use the mock achievement utility
      const unlockedAchievement = unlockAchievement(achievementId);
      
      if (unlockedAchievement) {
        // Update local state
        setAchievements(prev => 
          prev.map(achievement => 
            achievement.id === achievementId 
              ? { ...achievement, completed: true, completed_at: new Date().toISOString() } 
              : achievement
          )
        );

        toast({
          title: 'Achievement completed!',
          description: 'You have earned points for completing this achievement',
        });
      }
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

  if (isLoadingAchievements) {
    return (
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Achievements</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements?.map((achievement) => (
            <Card key={achievement.id}>
              <CardHeader>
                <CardTitle>{achievement.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{achievement.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {achievement.points} points
                  </span>
                  <Button
                    variant={achievement.completed ? 'outline' : 'default'}
                    disabled={achievement.completed || isLoading}
                    onClick={() => handleCompleteAchievement(achievement.id)}
                  >
                    {isLoading ? (
                      <LoadingSpinner size="sm" />
                    ) : achievement.completed ? (
                      'Completed'
                    ) : (
                      'Complete'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
}
