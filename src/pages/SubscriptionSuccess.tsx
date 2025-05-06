
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { LoadingCard } from '@/components/Loading';
import ErrorBoundary from '@/components/ErrorBoundary';
import { SubscriptionTier } from '@/types';

export default function SubscriptionSuccess() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: subscription, isLoading: isLoadingSubscription } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*, tier_id')
          .eq('user_id', user?.id)
          .single();

        if (error) throw error;
        
        // Get subscription tier details
        const { data: tierData, error: tierError } = await supabase
          .from('subscription_tiers')
          .select('*')
          .eq('id', data.tier_id)
          .single();
          
        if (tierError) throw tierError;
        
        return {
          ...data,
          subscription_tier: tierData as SubscriptionTier,
        };
      } catch (error) {
        console.error('Error fetching subscription:', error);
        throw error;
      }
    },
    enabled: !!user,
  });

  if (isLoadingSubscription) {
    return (
      <div className="container mx-auto py-8">
        <LoadingCard />
      </div>
    );
  }

  if (!subscription) {
    toast({
      variant: 'destructive',
      title: 'Error',
      description: 'No subscription found',
    });
    navigate('/pricing');
    return null;
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Subscription Successful!</CardTitle>
            <CardDescription>
              Thank you for subscribing to {subscription.subscription_tier.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Subscription Details</h3>
                <p className="text-muted-foreground">
                  You are now subscribed to the {subscription.subscription_tier.name} plan.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium">Next Steps</h3>
                <p className="text-muted-foreground">
                  You can now access all premium features. Your subscription will automatically renew on{' '}
                  {new Date(subscription.current_period_end).toLocaleDateString()}.
                </p>
              </div>
              <Button
                className="w-full"
                onClick={() => navigate('/achievements')}
              >
                Start Using Premium Features
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}
