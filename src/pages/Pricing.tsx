
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { LoadingCard, LoadingSpinner } from '@/components/Loading';
import ErrorBoundary from '@/components/ErrorBoundary';
import PageLayout from '@/components/PageLayout';
import BackButton from '@/components/BackButton';

// Define SubscriptionTier type
interface SubscriptionTier {
  id: string;
  name: string;
  description: string | null;
  price: number;
  features: string[] | null;
  created_at: string;
}

export default function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { data: tiers, isLoading: isLoadingTiers } = useQuery({
    queryKey: ['subscription-tiers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_tiers')
        .select('*')
        .order('price', { ascending: true });

      if (error) throw error;
      return data as SubscriptionTier[];
    },
  });

  const handleSubscribe = async (tierId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, this would redirect to Stripe Checkout
      const { error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          tier_id: tierId,
          active: true,
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        });

      if (error) throw error;

      navigate('/subscription-success');
    } catch (error) {
      console.error('Error subscribing:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to subscribe',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (isLoadingTiers) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      );
    }

    return (
      <>
        <h1 className="text-3xl font-bold mb-8 text-center">Choose Your Plan</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers?.map((tier) => (
            <Card key={tier.id}>
              <CardHeader>
                <CardTitle>{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-3xl font-bold">
                    ${tier.price}/month
                  </div>
                  <ul className="space-y-2">
                    {Array.isArray(tier.features) && tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    disabled={isLoading}
                    onClick={() => handleSubscribe(tier.id)}
                  >
                    {isLoading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      'Subscribe'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </>
    );
  };

  return (
    <PageLayout>
      <ErrorBoundary>
        <div className="container mx-auto py-8">
          <BackButton to="/" label="Back to Home" />
          {renderContent()}
        </div>
      </ErrorBoundary>
    </PageLayout>
  );
}
