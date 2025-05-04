
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
    const { tierId } = await req.json();
    
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
    
    // Get the subscription tier
    const { data: tier } = await supabaseClient
      .from('subscription_tiers')
      .select('*')
      .eq('id', tierId)
      .single();
      
    if (!tier) {
      throw new Error('Subscription tier not found');
    }
    
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });
    
    // Check if customer already exists
    const { data: existingCustomers } = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });
    
    let customerId;
    if (existingCustomers.length > 0) {
      customerId = existingCustomers[0].id;
    } else {
      // Create a new customer
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          user_id: user.id,
        },
      });
      customerId = customer.id;
    }
    
    // Create checkout session
    const origin = req.headers.get('origin');
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: tier.name,
              description: tier.description || undefined,
            },
            unit_amount: tier.price,
            recurring: tier.price > 0 ? { interval: 'month' } : undefined,
          },
          quantity: 1,
        },
      ],
      mode: tier.price > 0 ? 'subscription' : 'payment',
      success_url: `${origin}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
    });
    
    return new Response(
      JSON.stringify({ url: session.url }),
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

// Helper function to create a supabase client
function createClient(supabaseUrl, supabaseKey, options = {}) {
  return {
    auth: {
      getUser: async () => {
        // This is a simplified version - in a real app you'd validate the token
        const token = options.global?.headers?.Authorization?.replace('Bearer ', '') || '';
        try {
          // Simplified mock of auth validation
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
          single: async () => {
            try {
              const response = await fetch(
                `${supabaseUrl}/rest/v1/${table}?select=${columns}&${column}=eq.${value}&limit=1`,
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
  };
}
