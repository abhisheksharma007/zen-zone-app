import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle, Leaf, Zap, Clock, Shield } from 'lucide-react';
import { EnvTest } from '@/components/EnvTest';

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Mindful Meditation',
      description: 'Guided meditation sessions to help you find your inner peace',
      icon: Leaf,
    },
    {
      title: 'Quick Sessions',
      description: '5-minute mindfulness exercises for busy schedules',
      icon: Clock,
    },
    {
      title: 'Track Progress',
      description: 'Monitor your meditation journey and achievements',
      icon: Zap,
    },
    {
      title: 'Secure & Private',
      description: 'Your meditation data is always protected',
      icon: Shield,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Environment Test Component - Remove in production */}
      {import.meta.env.DEV && <EnvTest />}
      
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              Find Your Zen
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover inner peace through guided meditation and mindfulness exercises.
              Start your journey to a calmer, more focused life today.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Button size="lg" onClick={() => navigate('/auth')}>
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/pricing')}>
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight">Why Choose Zen Zone</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Experience the benefits of regular meditation with our comprehensive platform
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="h-8 w-8 text-primary mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Choose the plan that works best for your meditation journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-primary">
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>Perfect for beginners</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    Basic meditation sessions
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    Daily mindfulness reminders
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    Progress tracking
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-primary">
              <CardHeader>
                <CardTitle>Premium</CardTitle>
                <CardDescription>For dedicated practitioners</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    All Free features
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    Advanced meditation programs
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    Personalized guidance
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-primary">
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>For meditation professionals</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    All Premium features
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    Custom meditation programs
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    Priority support
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          <div className="mt-10 text-center">
            <Button size="lg" onClick={() => navigate('/pricing')}>
              View Detailed Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Ready to Start Your Journey?</h2>
          <p className="mt-4 text-lg">
            Join thousands of people who have found peace through Zen Zone
          </p>
          <div className="mt-10">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/auth')}
            >
              Get Started Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
} 