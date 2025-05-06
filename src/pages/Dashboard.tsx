import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Flame, Target, Trophy, Clock, Heart } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    {
      title: 'Total Sessions',
      value: '12',
      icon: Clock,
      description: 'This month',
      color: 'text-blue-500',
    },
    {
      title: 'Current Streak',
      value: '5 days',
      icon: Flame,
      description: 'Keep it up!',
      color: 'text-orange-500',
    },
    {
      title: 'Goals Achieved',
      value: '3/5',
      icon: Target,
      description: 'This month',
      color: 'text-green-500',
    },
    {
      title: 'Achievements',
      value: '8',
      icon: Trophy,
      description: 'Total unlocked',
      color: 'text-purple-500',
    },
  ];

  const recentSessions = [
    {
      title: 'Morning Meditation',
      duration: '15 min',
      date: 'Today, 7:00 AM',
      type: 'Mindfulness',
    },
    {
      title: 'Stress Relief',
      duration: '20 min',
      date: 'Yesterday, 8:30 PM',
      type: 'Breathing',
    },
    {
      title: 'Deep Focus',
      duration: '25 min',
      date: '2 days ago, 6:00 PM',
      type: 'Concentration',
    },
  ];

  return (
    <ErrorBoundary>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col gap-8">
          {/* Welcome Section */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Welcome back, {user?.email?.split('@')[0]}</h1>
            <p className="text-muted-foreground">Track your meditation journey and find your inner peace.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Progress Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Progress</CardTitle>
                  <CardDescription>Your meditation journey this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Daily Goal</p>
                        <p className="text-2xl font-bold">15 min</p>
                      </div>
                      <Progress value={75} className="w-[60%]" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Weekly Goal</p>
                        <p className="text-2xl font-bold">105 min</p>
                      </div>
                      <Progress value={60} className="w-[60%]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Sessions */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Sessions</CardTitle>
                  <CardDescription>Your latest meditation practices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentSessions.map((session, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="space-y-1">
                          <p className="font-medium">{session.title}</p>
                          <p className="text-sm text-muted-foreground">{session.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{session.duration}</p>
                          <p className="text-sm text-muted-foreground">{session.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sessions">
              <Card>
                <CardHeader>
                  <CardTitle>Meditation Sessions</CardTitle>
                  <CardDescription>Start a new session or view your history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button className="h-32 flex flex-col items-center justify-center gap-2">
                      <Heart className="h-8 w-8" />
                      <span>Start New Session</span>
                    </Button>
                    {/* Add more session types here */}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="goals">
              <Card>
                <CardHeader>
                  <CardTitle>Your Goals</CardTitle>
                  <CardDescription>Track your meditation goals and achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="space-y-1">
                        <p className="font-medium">Daily Meditation</p>
                        <p className="text-sm text-muted-foreground">15 minutes every day</p>
                      </div>
                      <Progress value={75} className="w-[100px]" />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="space-y-1">
                        <p className="font-medium">Weekly Goal</p>
                        <p className="text-sm text-muted-foreground">5 sessions per week</p>
                      </div>
                      <Progress value={60} className="w-[100px]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ErrorBoundary>
  );
} 