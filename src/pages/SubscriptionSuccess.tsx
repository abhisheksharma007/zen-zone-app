
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import AppHeader from "@/components/AppHeader";

const SubscriptionSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Auto-redirect after countdown
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      navigate("/");
    }
  }, [countdown, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zenblue-50 p-4 md:p-6">
      <div className="max-w-md mx-auto">
        <AppHeader />

        <Card className="mt-8 border-green-200 shadow-md">
          <CardHeader className="text-center">
            <div className="mx-auto bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Subscription Successful!
            </CardTitle>
            <CardDescription>
              Thank you for subscribing to Zen Zone.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <p className="text-muted-foreground">
              Your account has been updated with your new subscription benefits.
            </p>
            <div className="space-y-2">
              <p>Redirecting to the app in {countdown} seconds...</p>
              <Button onClick={() => navigate("/")} className="w-full">
                Go to Dashboard Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;
