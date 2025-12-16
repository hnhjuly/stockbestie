import { RefreshCw } from 'lucide-react';

interface PullToRefreshIndicatorProps {
  pullDistance: number;
  isRefreshing: boolean;
  threshold: number;
}

export const PullToRefreshIndicator = ({ 
  pullDistance, 
  isRefreshing, 
  threshold 
}: PullToRefreshIndicatorProps) => {
  if (pullDistance === 0 && !isRefreshing) return null;

  const progress = Math.min(pullDistance / threshold, 1);
  const rotation = progress * 180;

  return (
    <div 
      className="fixed top-0 left-0 right-0 flex justify-center z-50 pointer-events-none"
      style={{ 
        transform: `translateY(${Math.min(pullDistance, threshold) - 40}px)`,
        opacity: progress
      }}
    >
      <div className="bg-primary/20 backdrop-blur-sm rounded-full p-3 shadow-lg">
        <RefreshCw 
          className={`w-6 h-6 text-primary ${isRefreshing ? 'animate-spin' : ''}`}
          style={{ 
            transform: isRefreshing ? undefined : `rotate(${rotation}deg)`,
            transition: isRefreshing ? undefined : 'transform 0.1s ease-out'
          }}
        />
      </div>
    </div>
  );
};
