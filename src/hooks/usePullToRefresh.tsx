import { useState, useEffect, useCallback, useRef } from 'react';

export const usePullToRefresh = (onRefresh: () => Promise<void>) => {
  const [isPWA, setIsPWA] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const threshold = 80;

  useEffect(() => {
    // Check if running as installed PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone 
      || document.referrer.includes('android-app://');
    setIsPWA(isStandalone);
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!isPWA || window.scrollY > 0) return;
    startY.current = e.touches[0].clientY;
    setIsPulling(true);
  }, [isPWA]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPulling || !isPWA || window.scrollY > 0) return;
    
    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, currentY - startY.current);
    
    if (distance > 0) {
      e.preventDefault();
      setPullDistance(Math.min(distance * 0.5, threshold * 1.5));
    }
  }, [isPulling, isPWA]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPWA) return;
    
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(threshold);
      
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    
    setIsPulling(false);
    setPullDistance(0);
  }, [isPWA, pullDistance, isRefreshing, onRefresh]);

  useEffect(() => {
    if (!isPWA) return;

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPWA, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return { isPWA, pullDistance, isRefreshing, threshold };
};
