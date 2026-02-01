'use client';

import { useEffect, useState } from 'react';

export interface ConnectionStatus {
  isOnline: boolean;
  isSlow: boolean;
  connectionType?: string;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
}

export function useConnectionStatus(): ConnectionStatus {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    isOnline: navigator.onLine,
    isSlow: false,
  });

  useEffect(() => {
    const updateConnectionStatus = () => {
      const connection = (navigator as any).connection || 
                          (navigator as any).mozConnection || 
                          (navigator as any).webkitConnection;

      const isOnline = navigator.onLine;
      const isSlow = connection ? 
        (connection.effectiveType === 'slow-2g' || 
         connection.effectiveType === '2g' || 
         connection.effectiveType === '3g') : false;

      setConnectionStatus({
        isOnline,
        isSlow,
        connectionType: connection?.type,
        effectiveType: connection?.effectiveType,
        downlink: connection?.downlink,
        rtt: connection?.rtt,
      });
    };

    // Initial status
    updateConnectionStatus();

    // Listen for online/offline events
    const handleOnline = () => {
      console.log('Connection: Online');
      updateConnectionStatus();
    };

    const handleOffline = () => {
      console.log('Connection: Offline');
      updateConnectionStatus();
    };

    // Listen for connection changes
    const handleConnectionChange = () => {
      console.log('Connection: Changed');
      updateConnectionStatus();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const connection = (navigator as any).connection || 
                        (navigator as any).mozConnection || 
                        (navigator as any).webkitConnection;
    
    if (connection) {
      connection.addEventListener('change', handleConnectionChange);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if (connection) {
        connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, []);

  return connectionStatus;
}

export function useOfflineDetection() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [offlineTime, setOfflineTime] = useState<Date | null>(null);

  useEffect(() => {
    const handleOffline = () => {
      console.log('App: Going offline');
      setIsOffline(true);
      setOfflineTime(new Date());
    };

    const handleOnline = () => {
      console.log('App: Coming back online');
      setIsOffline(false);
      setOfflineTime(null);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return {
    isOffline,
    offlineTime,
    offlineDuration: offlineTime ? Date.now() - offlineTime.getTime() : 0,
  };
}

// Network quality indicator
export function getNetworkQuality(connection: ConnectionStatus): 'excellent' | 'good' | 'fair' | 'poor' {
  if (!connection.isOnline) return 'poor';
  if (connection.isSlow) return 'fair';
  
  if (connection.effectiveType === '4g' && connection.downlink && connection.downlink > 5) {
    return 'excellent';
  }
  
  if (connection.effectiveType === '4g' || connection.downlink && connection.downlink > 2) {
    return 'good';
  }
  
  return 'fair';
}

// Check if we should use offline mode
export function shouldUseOfflineMode(connection: ConnectionStatus): boolean {
  return !connection.isOnline || connection.isSlow;
}

// Retry mechanism for failed requests
export class RetryManager {
  private maxRetries: number;
  private retryDelay: number;
  private backoffMultiplier: number;

  constructor(maxRetries = 3, retryDelay = 1000, backoffMultiplier = 2) {
    this.maxRetries = maxRetries;
    this.retryDelay = retryDelay;
    this.backoffMultiplier = backoffMultiplier;
  }

  async executeWithRetry<T>(
    operation: () => Promise<T>,
    shouldRetry: (error: any) => boolean = () => true
  ): Promise<T> {
    let lastError: any;
    let delay = this.retryDelay;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === this.maxRetries || !shouldRetry(error)) {
          throw error;
        }

        console.warn(`Retry attempt ${attempt + 1}/${this.maxRetries} after ${delay}ms`, error);
        await this.delay(delay);
        delay *= this.backoffMultiplier;
      }
    }

    throw lastError;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Service Worker manager for offline functionality
export class ServiceWorkerManager {
  private swRegistration: ServiceWorkerRegistration | null = null;

  async register(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker not supported');
      return false;
    }

    try {
      this.swRegistration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', this.swRegistration);
      return true;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return false;
    }
  }

  async unregister(): Promise<boolean> {
    if (!this.swRegistration) {
      return true;
    }

    try {
      const result = await this.swRegistration.unregister();
      console.log('Service Worker unregistered:', result);
      this.swRegistration = null;
      return result;
    } catch (error) {
      console.error('Service Worker unregistration failed:', error);
      return false;
    }
  }

  async syncWhenOnline(): Promise<void> {
    if (!this.swRegistration) {
      return;
    }

    try {
      // Use the background sync API if available
      if ('sync' in this.swRegistration) {
        await (this.swRegistration as any).sync.register('background-sync');
        console.log('Background sync registered');
      } else {
        console.log('Background Sync API not supported, using manual sync');
        // Fallback to manual sync
        this.manualSync();
      }
    } catch (error) {
      console.error('Background sync registration failed:', error);
    }
  }

  private async manualSync(): Promise<void> {
    // Fallback manual sync implementation
    console.log('Performing manual sync');
    // This would trigger the sync logic in the service worker
    // via a message or direct API call
  }

  async showNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (!this.swRegistration) {
      return;
    }

    try {
      await this.swRegistration.showNotification(title, options);
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  }
}

// Singleton instance
export const serviceWorkerManager = new ServiceWorkerManager();
