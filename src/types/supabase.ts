export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string
          created_at: string
          id: string
          updated_at: string
          username: string
        }
        Insert: {
          avatar_url?: string
          created_at?: string
          id: string
          updated_at?: string
          username?: string
        }
        Update: {
          avatar_url?: string
          created_at?: string
          id?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      subscription_tiers: {
        Row: {
          created_at: string
          description: string
          features: Json
          id: string
          name: string
          price: number
        }
        Insert: {
          created_at?: string
          description?: string
          features?: Json
          id?: string
          name: string
          price: number
        }
        Update: {
          created_at?: string
          description?: string
          features?: Json
          id?: string
          name?: string
          price?: number
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string
          id: string
          status: string
          subscription_tier_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string
          id?: string
          status?: string
          subscription_tier_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string
          id?: string
          status?: string
          subscription_tier_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_subscription_tier_id_fkey"
            columns: ["subscription_tier_id"]
            referencedRelation: "subscription_tiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          timer_limit: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          timer_limit?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          timer_limit?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      platform_timers: {
        Row: {
          id: string
          user_id: string
          platforms: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          platforms?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          platforms?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_timers_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 