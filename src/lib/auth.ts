import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  features: string[];
}

interface Subscription {
  id: string;
  user_id: string;
  tier_id: string;
  active: boolean;
  current_period_end: string;
  subscription_tier: SubscriptionTier;
}

export const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const queryClient = useQueryClient();

  // Fetch subscription data
  const { data: subscriptionData } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      if (!user) return null;
      
      // First get the subscription
      const { data: subscription, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (subscriptionError) throw subscriptionError;
      if (!subscription) return null;

      // Then get the subscription tier
      const { data: tier, error: tierError } = await supabase
        .from('subscription_tiers')
        .select('*')
        .eq('id', subscription.tier_id)
        .single();
      
      if (tierError) throw tierError;
      if (!tier) return null;

      return {
        ...subscription,
        subscription_tier: tier,
      } as Subscription;
    },
    enabled: !!user,
  });

  useEffect(() => {
    // Set subscription data when it changes
    if (subscriptionData) {
      setSubscription(subscriptionData);
      setIsSubscribed(subscriptionData.active && subscriptionData.subscription_tier.price > 0);
    }
  }, [subscriptionData]);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Invalidate subscription query when auth state changes
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsSubscribed(false);
      setSubscription(null);
      queryClient.clear();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    user,
    session,
    loading,
    isSubscribed,
    subscription,
    signOut,
  };
};
