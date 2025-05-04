
import { createContext, useContext } from 'react';
import { User } from '@supabase/supabase-js';

export type SubscriptionTier = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  features: {
    feature_limit?: number;
    feature_list: string[];
  } | null;
};

export type Subscription = {
  id: string;
  tier_id: string;
  active: boolean;
  subscription_tier: SubscriptionTier | null;
  current_period_end: string | null;
};

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  subscription: Subscription | null;
  isSubscribed: boolean;
};

export const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  subscription: null,
  isSubscribed: false,
});

export const useAuth = () => useContext(AuthContext);
