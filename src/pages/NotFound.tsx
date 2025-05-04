import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <ErrorBoundary>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Page Not Found</CardTitle>
            <CardDescription>
              The page you are looking for does not exist.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
              </p>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Go Back
                </Button>
                <Button
                  onClick={() => navigate('/')}
                >
                  Go Home
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}
