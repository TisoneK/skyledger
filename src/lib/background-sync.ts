// Background sync for SkyLedger offline operations

import React from 'react';

export interface SyncOperation {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  endpoint: string;
  method: 'POST' | 'PUT' | 'DELETE';
  headers: Record<string, string>;
  body: string;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
}

export interface SyncQueue {
  operations: SyncOperation[];
  isProcessing: boolean;
  lastSyncTime: number | null;
}

class BackgroundSyncManager {
  private dbName = 'skyledger-sync';
  private storeName = 'sync-queue';
  private db: IDBDatabase | null = null;
  private isProcessing = false;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp');
          store.createIndex('type', 'type');
        }
      };
    });
  }

  async addToQueue(operation: Omit<SyncOperation, 'id' | 'timestamp' | 'retryCount'>): Promise<string> {
    if (!this.db) await this.init();

    const syncOperation: SyncOperation = {
      ...operation,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries: 3,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.add(syncOperation);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        // Trigger background sync if supported
        this.triggerBackgroundSync();
        resolve(syncOperation.id);
      };
    });
  }

  async getQueue(): Promise<SyncOperation[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async removeFromQueue(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async updateRetryCount(id: string, retryCount: number): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const getRequest = store.get(id);

      getRequest.onerror = () => reject(getRequest.error);
      getRequest.onsuccess = () => {
        const operation = getRequest.result;
        if (operation) {
          operation.retryCount = retryCount;
          const updateRequest = store.put(operation);
          updateRequest.onerror = () => reject(updateRequest.error);
          updateRequest.onsuccess = () => resolve();
        } else {
          reject(new Error('Operation not found'));
        }
      };
    });
  }

  async processQueue(): Promise<void> {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      const operations = await this.getQueue();
      const failedOperations: SyncOperation[] = [];

      for (const operation of operations) {
        try {
          await this.executeOperation(operation);
          await this.removeFromQueue(operation.id);
        } catch (error) {
          console.error(`Failed to sync operation ${operation.id}:`, error);

          if (operation.retryCount < operation.maxRetries) {
            await this.updateRetryCount(operation.id, operation.retryCount + 1);
            // Exponential backoff
            await this.delay(Math.pow(2, operation.retryCount) * 1000);
          } else {
            failedOperations.push(operation);
            await this.removeFromQueue(operation.id);
          }
        }
      }

      if (failedOperations.length > 0) {
        // Re-add failed operations for manual retry
        for (const operation of failedOperations) {
          await this.addToQueue({
            type: operation.type,
            endpoint: operation.endpoint,
            method: operation.method,
            headers: operation.headers,
            body: operation.body,
            maxRetries: operation.maxRetries,
          });
        }
      }

      this.updateLastSyncTime();
    } finally {
      this.isProcessing = false;
    }
  }

  private async executeOperation(operation: SyncOperation): Promise<void> {
    const response = await fetch(operation.endpoint, {
      method: operation.method,
      headers: operation.headers,
      body: operation.body,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }

  private async triggerBackgroundSync(): Promise<void> {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        if ('sync' in registration) {
          await (registration as any).sync.register('background-sync');
        }
      } catch (error) {
        console.log('Background sync not supported, using manual sync');
        this.processQueue();
      }
    } else {
      // Fallback to manual sync
      this.processQueue();
    }
  }

  private async updateLastSyncTime(): Promise<void> {
    try {
      localStorage.setItem('skyledger-last-sync', Date.now().toString());
    } catch (error) {
      console.warn('Failed to update last sync time:', error);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getQueueStatus(): Promise<{ count: number; lastSync: number | null }> {
    const operations = await this.getQueue();
    const lastSync = localStorage.getItem('skyledger-last-sync');
    
    return {
      count: operations.length,
      lastSync: lastSync ? parseInt(lastSync) : null,
    };
  }

  async clearQueue(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

// Singleton instance
export const backgroundSyncManager = new BackgroundSyncManager();

// Hook for using background sync in components
export function useBackgroundSync() {
  const [queueStatus, setQueueStatus] = React.useState({ count: 0, lastSync: null as number | null });

  React.useEffect(() => {
    const updateStatus = async () => {
      const status = await backgroundSyncManager.getQueueStatus();
      setQueueStatus(status);
    };

    updateStatus();
    
    const interval = setInterval(updateStatus, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  const addToQueue = React.useCallback(async (operation: Omit<SyncOperation, 'id' | 'timestamp' | 'retryCount'>) => {
    await backgroundSyncManager.addToQueue(operation);
    const status = await backgroundSyncManager.getQueueStatus();
    setQueueStatus(status);
  }, []);

  const processQueue = React.useCallback(async () => {
    await backgroundSyncManager.processQueue();
    const status = await backgroundSyncManager.getQueueStatus();
    setQueueStatus(status);
  }, []);

  return {
    queueStatus,
    addToQueue,
    processQueue,
  };
}
