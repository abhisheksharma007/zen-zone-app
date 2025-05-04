import { cn } from '@/lib/utils';

interface LoadingProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner = ({ className, size = 'md' }: LoadingProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        sizeClasses[size],
        className
      )}
    />
  );
};

interface SkeletonProps {
  className?: string;
  height?: string;
  width?: string;
}

export const Skeleton = ({ className, height = '1.5rem', width = '100%' }: SkeletonProps) => {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      style={{ height, width }}
    />
  );
};

export const LoadingPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
};

export const LoadingCard = () => {
  return (
    <div className="p-6 space-y-4">
      <Skeleton height="2rem" width="60%" />
      <Skeleton height="1rem" />
      <Skeleton height="1rem" width="80%" />
      <div className="flex justify-end">
        <Skeleton height="2.5rem" width="6rem" />
      </div>
    </div>
  );
}; 