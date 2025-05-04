import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Check } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { SubscriptionTier } from "@/lib/auth";

const Pricing = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, subscription, isSubscribed } = useAuth();
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchTiers();
  }, []);

  const fetchTiers = async () => {
    const { data, error } = await supabase
      .from("subscription_tiers")
      .select("*")
      .order("price");

    if (error) {
      toast({
        title: "Error",
        description: "Could not load subscription tiers",
        variant: "destructive",
      });
      return;
    }

    // Convert the raw data to SubscriptionTier format
    if (data) {
      const formattedTiers: SubscriptionTier[] = data.map(tier => ({
        id: tier.id,
        name: tier.name,
        description: tier.description,
        price: tier.price,
        features: typeof tier.features === 'string' 
          ? JSON.parse(tier.features) 
          : tier.features
      }));
      
      setTiers(formattedTiers);
    }
  };

  const handleSubscribe = async (tierId: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setLoading((prev) => ({ ...prev, [tierId]: true }));

    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { tierId },
      });

      if (error || !data?.url) {
        throw new Error(error?.message || "Could not create checkout session");
      }

      window.location.href = data.url;
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, [tierId]: false }));
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    return `$${(price / 100).toFixed(2)}/mo`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zenblue-50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <AppHeader />

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Choose Your Plan</h1>
          <p className="text-muted-foreground">
            Select the best plan for your mindful journey
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier) => {
            const isCurrentTier = subscription?.tier_id === tier.id;
            const features = tier.features?.feature_list || [];

            return (
              <Card
                key={tier.id}
                className={`flex flex-col ${
                  isCurrentTier ? "border-zenpurple-500 border-2" : ""
                }`}
              >
                <CardHeader>
                  {isCurrentTier && (
                    <div className="bg-zenpurple-100 text-zenpurple-700 text-xs font-medium px-2 py-1 rounded-full w-fit mb-2">
                      Current Plan
                    </div>
                  )}
                  <CardTitle className="flex items-baseline gap-2">
                    {tier.name}
                    <span className="text-2xl font-bold">
                      {formatPrice(tier.price)}
                    </span>
                  </CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-2">
                    {features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    disabled={
                      loading[tier.id] || 
                      (isCurrentTier && isSubscribed) || 
                      (!user && tier.name === "Free")
                    }
                    onClick={() => handleSubscribe(tier.id)}
                    variant={isCurrentTier ? "outline" : "default"}
                  >
                    {loading[tier.id]
                      ? "Loading..."
                      : isCurrentTier
                      ? "Current Plan"
                      : `Subscribe to ${tier.name}`}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
