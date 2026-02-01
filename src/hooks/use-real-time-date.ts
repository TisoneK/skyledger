import { useState, useEffect } from 'react';
import { getChamaDayDisplay } from '@/lib/date-utils';

/**
 * Hook that provides real-time date updates for Chama Day display
 * Updates when the date rolls over at midnight
 */
export function useRealTimeDate() {
  const [chamaDayDisplay, setChamaDayDisplay] = useState(() => getChamaDayDisplay());

  useEffect(() => {
    // Calculate milliseconds until next midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    // Set up timeout to update at midnight
    const timeoutId = setTimeout(() => {
      setChamaDayDisplay(getChamaDayDisplay());
      
      // Set up interval to check every minute after midnight
      const intervalId = setInterval(() => {
        setChamaDayDisplay(getChamaDayDisplay());
      }, 60000); // Check every minute
      
      // Store interval ID for cleanup
      return () => clearInterval(intervalId);
    }, msUntilMidnight);

    return () => clearTimeout(timeoutId);
  }, []);

  return chamaDayDisplay;
}
