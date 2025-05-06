
import { Json } from "@/integrations/supabase/types";

export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  points: number;
  created_at?: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  completed_at: string;
  created_at?: string;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  description: string | null;
  price: number;
  features: string[] | null;
  created_at: string;
}

export interface AchievementWithCompletion extends Achievement {
  completed: boolean;
  completed_at: string | null;
}
