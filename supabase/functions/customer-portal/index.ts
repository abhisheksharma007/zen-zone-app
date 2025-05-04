
import { serve } from "https://deno.land/std@0.170.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.4.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Get the user from the auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: { headers: { Authorization: authHeader } },
      }
    );
    
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      throw new Error('Error getting user');
    }
    
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });
    
    // Get customer ID
    const { data: subscription } = await supabaseClient
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .eq('active', true)
      .single();
      
    if (!subscription?.stripe_customer_id) {
      throw new Error('No active subscription found');
    }
    
    // Create portal session
    const origin = req.headers.get('origin');
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${origin}/account`,
    });
    
    return new Response(
      JSON.stringify({ url: portalSession.url }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});

// Helper function to create a supabase client (same as in create-checkout)
function createClient(supabaseUrl, supabaseKey, options = {}) {
  return {
    auth: {
      getUser: async () => {
        const token = options.global?.headers?.Authorization?.replace('Bearer ', '') || '';
        try {
          const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
            headers: {
              Authorization: `Bearer ${token}`,
              apikey: supabaseKey,
            },
          });
          const data = await response.json();
          return { data: { user: data }, error: null };
        } catch (error) {
          return { data: { user: null }, error };
        }
      },
    },
    from: (table) => ({
      select: (columns) => ({
        eq: (column, value) => ({
          eq: (anotherColumn, anotherValue) => ({
            single: async () => {
              try {
                const response = await fetch(
                  `${supabaseUrl}/rest/v1/${table}?select=${columns}&${column}=eq.${value}&${anotherColumn}=eq.${anotherValue}&limit=1`,
                  {
                    headers: {
                      Authorization: options.global?.headers?.Authorization || `Bearer ${supabaseKey}`,
                      apikey: supabaseKey,
                      'Content-Type': 'application/json',
                    },
                  }
                );
                const data = await response.json();
                return { data: data[0] || null, error: null };
              } catch (error) {
                return { data: null, error };
              }
            },
          }),
        }),
      }),
    }),
  };
}
