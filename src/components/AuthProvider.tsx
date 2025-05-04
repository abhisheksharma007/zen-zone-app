
import React, { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContext, Subscription, SubscriptionTier } from '@/lib/auth';
import { toast } from '@/components/ui/sonner';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Fetch user subscription
  async function fetchSubscription(userId: string) {
    try {
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select(`
          id,
          tier_id,
          active,
          current_period_end,
          subscription_tiers (
            id,
            name,
            description,
            price,
            features
          )
        `)
        .eq('user_id', userId)
        .eq('active', true)
        .single();

      if (subscriptionError && subscriptionError.code !== 'PGRST116') {
        console.error('Error fetching subscription:', subscriptionError);
        return;
      }

      if (subscriptionData) {
        // Parse the features JSON to ensure it matches our expected format
        const rawSubscriptionTier = subscriptionData.subscription_tiers;
        const parsedFeatures = typeof rawSubscriptionTier.features === 'string' 
          ? JSON.parse(rawSubscriptionTier.features) 
          : rawSubscriptionTier.features;
        
        const subscription_tier: SubscriptionTier = {
          id: rawSubscriptionTier.id,
          name: rawSubscriptionTier.name,
          description: rawSubscriptionTier.description,
          price: rawSubscriptionTier.price,
          features: parsedFeatures
        };
        
        const formattedSubscription = {
          id: subscriptionData.id,
          tier_id: subscriptionData.tier_id,
          active: subscriptionData.active,
          current_period_end: subscriptionData.current_period_end,
          subscription_tier
        };
        
        setSubscription(formattedSubscription);
        setIsSubscribed(formattedSubscription.active);
      } else {
        // If no paid subscription, check if we have a free tier
        const { data: freeTier } = await supabase
          .from('subscription_tiers')
          .select('*')
          .eq('name', 'Free')
          .single();
          
        if (freeTier) {
          // Parse the features JSON for the free tier as well
          const parsedFeatures = typeof freeTier.features === 'string' 
            ? JSON.parse(freeTier.features) 
            : freeTier.features;
          
          const formattedFreeTier: SubscriptionTier = {
            id: freeTier.id,
            name: freeTier.name,
            description: freeTier.description,
            price: freeTier.price,
            features: parsedFeatures
          };
          
          // Create a free subscription for the user
          const { data: newSubscription, error: createError } = await supabase
            .from('subscriptions')
            .insert({
              user_id: userId,
              tier_id: freeTier.id,
              active: true
            })
            .select(`
              id,
              tier_id,
              active,
              current_period_end
            `)
            .single();
            
          if (createError) {
            console.error('Error creating free subscription:', createError);
          } else if (newSubscription) {
            setSubscription({
              ...newSubscription,
              subscription_tier: formattedFreeTier,
            });
            setIsSubscribed(true);
          }
        }
      }
    } catch (error) {
      console.error('Error in subscription logic:', error);
    }
  }

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        const newUser = session?.user ?? null;
        setUser(newUser);
        
        if (newUser) {
          fetchSubscription(newUser.id);
        } else {
          setSubscription(null);
          setIsSubscribed(false);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        fetchSubscription(currentUser.id);
      }
      
      setLoading(false);
    });

    return () => authSubscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, subscription, isSubscribed }}>
      {children}
    </AuthContext.Provider>
  );
}
