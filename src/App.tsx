
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import { useAuth } from "@/lib/auth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Achievements from "./pages/Achievements";
import Pricing from "./pages/Pricing";
import Account from "./pages/Account";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import { LoadingPage } from '@/components/Loading';
import ErrorBoundary from '@/components/ErrorBoundary';
import Landing from '@/pages/Landing';
import { EnvTest } from '@/components/EnvTest';
import PageLayout from "@/components/PageLayout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingPage />;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
}

function PremiumRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isSubscribed, subscription } = useAuth();
  
  if (loading) {
    return <LoadingPage />;
  }
  
  // Check if user has a paid subscription
  if (!isSubscribed || (subscription && subscription.subscription_tier?.price === 0)) {
    return <Navigate to="/pricing" replace />;
  }
  
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ErrorBoundary>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/pricing" element={
                <PageLayout>
                  <Pricing />
                </PageLayout>
              } />
              {import.meta.env.DEV && (
                <Route path="/env-test" element={<EnvTest />} />
              )}
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <PageLayout>
                    <Index />
                  </PageLayout>
                </PrivateRoute>
              } />
              <Route path="/achievements" element={
                <PremiumRoute>
                  <PageLayout>
                    <Achievements />
                  </PageLayout>
                </PremiumRoute>
              } />
              <Route path="/account" element={
                <PrivateRoute>
                  <PageLayout>
                    <Account />
                  </PageLayout>
                </PrivateRoute>
              } />
              <Route path="/subscription-success" element={
                <PrivateRoute>
                  <PageLayout>
                    <SubscriptionSuccess />
                  </PageLayout>
                </PrivateRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
