import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { LoadingSpinner } from '@/components/Loading';
import ErrorBoundary from '@/components/ErrorBoundary';
import { CheckCircle } from 'lucide-react';

const pricingTiers = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for beginners',
    price: 0,
    features: [
      'Basic meditation sessions',
      'Daily mindfulness reminders',
      'Progress tracking',
      'Community access',
      'Basic meditation guides'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'For dedicated practitioners',
    price: 9.99,
    features: [
      'All Free features',
      'Advanced meditation programs',
      'Personalized guidance',
      'Exclusive content',
      'Priority support',
      'Offline access'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For meditation professionals',
    price: 19.99,
    features: [
      'All Premium features',
      'Custom meditation programs',
      '1-on-1 coaching sessions',
      'Advanced analytics',
      'API access',
      'White-label solutions'
    ]
  }
];

export default function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (tierId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, this would redirect to Stripe Checkout
      toast({
        title: 'Coming Soon',
        description: 'Subscription payments will be available soon!',
      });
    } catch (error) {
      console.error('Error subscribing:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to subscribe',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="container mx-auto py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground">
            Choose the plan that works best for your meditation journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingTiers.map((tier) => (
            <Card key={tier.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow">
                <div className="space-y-4">
                  <div className="text-3xl font-bold">
                    {tier.price === 0 ? 'Free' : `$${tier.price}/month`}
                  </div>
                  <ul className="space-y-3">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full mt-6"
                    disabled={isLoading}
                    onClick={() => handleSubscribe(tier.id)}
                    variant={tier.price === 0 ? 'outline' : 'default'}
                  >
                    {isLoading ? (
                      <LoadingSpinner size="sm" />
                    ) : tier.price === 0 ? (
                      'Get Started'
                    ) : (
                      'Subscribe Now'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </ErrorBoundary>
  );
}
