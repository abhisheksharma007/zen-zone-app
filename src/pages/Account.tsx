
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { LogOut, CreditCard, User as UserIcon } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

const Account = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, subscription, isSubscribed } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    navigate("/auth");
    setLoading(false);
  };

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");

      if (error || !data?.url) {
        throw new Error(error?.message || "Could not create portal session");
      }

      window.location.href = data.url;
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zenblue-50 p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        <AppHeader />

        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Account Settings</h1>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" /> Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <Button
                  variant="destructive"
                  onClick={handleSignOut}
                  disabled={loading}
                  className="mt-4"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" /> Subscription
              </CardTitle>
              <CardDescription>
                Manage your subscription plan and billing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <p className="text-sm text-muted-foreground">Current Plan</p>
                    <p className="font-medium">
                      {subscription?.subscription_tier?.name || "Free"}
                    </p>
                  </div>

                  {subscription?.subscription_tier?.price > 0 && (
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <p className="text-sm text-muted-foreground">
                        Current Period Ends
                      </p>
                      <p className="font-medium">
                        {formatDate(subscription?.current_period_end)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => navigate("/pricing")}
                    variant="outline"
                    className="flex-1"
                  >
                    View Plans
                  </Button>
                  {isSubscribed && subscription?.subscription_tier?.price > 0 && (
                    <Button
                      onClick={handleManageSubscription}
                      disabled={loading}
                      className="flex-1"
                    >
                      Manage Subscription
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Account;
