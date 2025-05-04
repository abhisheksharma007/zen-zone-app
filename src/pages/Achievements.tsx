import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { LoadingCard, LoadingSpinner } from '@/components/Loading';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Achievement, UserAchievement } from '@/integrations/supabase/types';

interface AchievementWithCompletion extends Achievement {
  completed: boolean;
  completed_at: string | null;
}

export default function Achievements() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { data: achievements, isLoading: isLoadingAchievements } = useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      // Get all achievements
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')
        .order('points', { ascending: false });

      if (achievementsError) throw achievementsError;

      // Get user's completed achievements
      const { data: userAchievementsData, error: userAchievementsError } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user?.id);

      if (userAchievementsError) throw userAchievementsError;

      // Combine the data
      const completedAchievementIds = new Set(
        userAchievementsData?.map((ua: UserAchievement) => ua.achievement_id) || []
      );

      return achievementsData?.map((achievement: Achievement) => ({
        ...achievement,
        completed: completedAchievementIds.has(achievement.id),
        completed_at: userAchievementsData?.find(
          (ua: UserAchievement) => ua.achievement_id === achievement.id
        )?.completed_at || null,
      })) as AchievementWithCompletion[];
    },
    enabled: !!user,
  });

  const handleCompleteAchievement = async (achievementId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: user?.id,
          achievement_id: achievementId,
          completed_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: 'Achievement completed!',
        description: 'You have earned points for completing this achievement',
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
