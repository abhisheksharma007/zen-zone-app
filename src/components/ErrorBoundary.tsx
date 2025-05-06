
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, NavigateFunction } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: React.ComponentType<{ error: Error | null }>;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      const CustomFallback = this.props.fallback;
      
      if (CustomFallback) {
        return <CustomFallback error={this.state.error} />;
      }
      
      return <DefaultErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

// A fallback that doesn't depend on routing
const DefaultErrorFallback = ({ error }: { error: Error | null }) => {
  // Safely check if we're in a Router context
  const navigate = safeUseNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-6 bg-card rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-destructive mb-4">Something went wrong</h2>
        <p className="text-muted-foreground mb-4">
          {error?.message || 'An unexpected error occurred'}
        </p>
        <div className="flex gap-4">
          <Button
            variant="default"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
          {navigate && (
            <Button
              variant="outline"
              onClick={() => navigate('/')}
            >
              Go Home
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to safely use navigate
const safeUseNavigate = (): NavigateFunction | null => {
  try {
    return useNavigate();
  } catch (e) {
    // Return null if useNavigate throws an error
    return null;
  }
};

export default ErrorBoundary;
