// Sync queue system for SkyLedger offline operations

import React from 'react';

export interface SyncQueueItem {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  entityType: 'transaction' | 'category' | 'chama_contribution';
  entityId: string;
  data: any;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
}

export interface SyncQueueStats {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
}

export class SyncQueueManager {
  private static instance: SyncQueueManager;
  private dbName = 'skyledger-sync-queue';
  private storeName = 'sync-queue';
  private db: IDBDatabase | null = null;
  private processing = false;
  private listeners: ((stats: SyncQueueStats) => void)[] = [];

  static getInstance(): SyncQueueManager {
    if (!SyncQueueManager.instance) {
      SyncQueueManager.instance = new SyncQueueManager();
    }
    return SyncQueueManager.instance;
  }

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
          store.createIndex('status', 'status');
          store.createIndex('timestamp', 'timestamp');
          store.createIndex('entityType', 'entityType');
        }
      };
    });
  }

  async addToQueue(item: Omit<SyncQueueItem, 'id' | 'timestamp' | 'retryCount' | 'status'>): Promise<string> {
    if (!this.db) await this.init();

    const queueItem: SyncQueueItem = {
      ...item,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      retryCount: 0,
      status: 'pending',
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.add(queueItem);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.notifyListeners();
        this.processQueue();
        resolve(queueItem.id);
      };
    });
  }

  async getQueue(filter?: { status?: SyncQueueItem['status']; entityType?: string }): Promise<SyncQueueItem[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      
      let request: IDBRequest;
      if (filter?.status) {
        request = store.index('status').getAll(filter.status);
      } else if (filter?.entityType) {
        request = store.index('entityType').getAll(filter.entityType);
      } else {
        request = store.getAll();
      }

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async updateItem(id: string, updates: Partial<SyncQueueItem>): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      const getRequest = store.get(id);
      getRequest.onerror = () => reject(getRequest.error);
      getRequest.onsuccess = () => {
        const item = getRequest.result;
        if (item) {
          const updatedItem = { ...item, ...updates };
          const updateRequest = store.put(updatedItem);
          updateRequest.onerror = () => reject(updateRequest.error);
          updateRequest.onsuccess = () => {
            this.notifyListeners();
            resolve();
          };
        } else {
          reject(new Error('Item not found'));
        }
      };
    });
  }

  async removeItem(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.notifyListeners();
        resolve();
      };
    });
  }

  async getStats(): Promise<SyncQueueStats> {
    const items = await this.getQueue();
    return {
      total: items.length,
      pending: items.filter(item => item.status === 'pending').length,
      processing: items.filter(item => item.status === 'processing').length,
      completed: items.filter(item => item.status === 'completed').length,
      failed: items.filter(item => item.status === 'failed').length,
    };
  }

  async processQueue(): Promise<void> {
    if (this.processing) return;
    this.processing = true;

    try {
      const pendingItems = await this.getQueue({ status: 'pending' });
      
      for (const item of pendingItems) {
        try {
          await this.updateItem(item.id, { status: 'processing' });
          await this.processItem(item);
          await this.updateItem(item.id, { status: 'completed' });
        } catch (error) {
          const errorMessage = (error as Error).message;
          const newRetryCount = item.retryCount + 1;
          
          if (newRetryCount < item.maxRetries) {
            await this.updateItem(item.id, {
              status: 'pending',
              retryCount: newRetryCount,
              error: errorMessage,
            });
            
            // Exponential backoff
            await this.delay(Math.pow(2, newRetryCount) * 1000);
          } else {
            await this.updateItem(item.id, {
              status: 'failed',
              retryCount: newRetryCount,
              error: errorMessage,
            });
          }
        }
      }
    } finally {
      this.processing = false;
    }
  }

  private async processItem(item: SyncQueueItem): Promise<void> {
    // This would typically make API calls to sync with the server
    // For now, we'll simulate the sync process
    
    console.log(`Processing ${item.type} ${item.entityType} ${item.entityId}`);
    
    // Simulate network delay
    await this.delay(1000);
    
    // Simulate occasional failures (10% failure rate)
    if (Math.random() < 0.1) {
      throw new Error('Simulated network error');
    }
    
    console.log(`Successfully processed ${item.id}`);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async clearCompleted(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('status');
      const request = index.openCursor(IDBKeyRange.only('completed'));

      request.onerror = () => reject(request.error);
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          this.notifyListeners();
          resolve();
        }
      };
    });
  }

  async retryFailed(): Promise<void> {
    const failedItems = await this.getQueue({ status: 'failed' });
    
    for (const item of failedItems) {
      await this.updateItem(item.id, {
        status: 'pending',
        retryCount: 0,
        error: undefined,
      });
    }
    
    this.processQueue();
  }

  subscribe(listener: (stats: SyncQueueStats) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.getStats().then(stats => {
      this.listeners.forEach(listener => listener(stats));
    });
  }

  // Conflict resolution utilities
  async resolveConflict(itemId: string, resolution: 'local' | 'remote' | 'merge'): Promise<void> {
    const item = await this.getQueue();
    const targetItem = item.find(i => i.id === itemId);
    
    if (!targetItem) {
      throw new Error('Item not found');
    }

    switch (resolution) {
      case 'local':
        // Keep local changes, mark as completed
        await this.updateItem(itemId, { status: 'completed' });
        break;
        
      case 'remote':
        // Discard local changes, remove from queue
        await this.removeItem(itemId);
        break;
        
      case 'merge':
        // Attempt to merge changes (implementation depends on entity type)
        await this.mergeChanges(targetItem);
        break;
    }
  }

  private async mergeChanges(item: SyncQueueItem): Promise<void> {
    // This would implement intelligent merging logic
    // For now, we'll just mark it as completed
    console.log(`Merging changes for ${item.entityType} ${item.entityId}`);
    await this.updateItem(item.id, { status: 'completed' });
  }

  // Export/Import utilities
  async exportQueue(): Promise<SyncQueueItem[]> {
    return await this.getQueue();
  }

  async importQueue(items: SyncQueueItem[]): Promise<void> {
    if (!this.db) await this.init();

    for (const item of items) {
      await this.addToQueue({
        type: item.type,
        entityType: item.entityType,
        entityId: item.entityId,
        data: item.data,
        maxRetries: item.maxRetries,
      });
    }
  }

  // Queue health monitoring
  async getHealthStatus(): Promise<{
    isHealthy: boolean;
    issues: string[];
    recommendations: string[];
  }> {
    const stats = await this.getStats();
    const issues: string[] = [];
    const recommendations: string[] = [];

    if (stats.failed > 0) {
      issues.push(`${stats.failed} failed items in queue`);
      recommendations.push('Retry failed items or resolve conflicts manually');
    }

    if (stats.pending > 100) {
      issues.push(`Large queue size: ${stats.pending} pending items`);
      recommendations.push('Check network connection and consider manual sync');
    }

    const oldItems = await this.getQueue();
    const veryOldItems = oldItems.filter(item => 
      Date.now() - item.timestamp > 24 * 60 * 60 * 1000 // 24 hours
    );

    if (veryOldItems.length > 0) {
      issues.push(`${veryOldItems.length} items older than 24 hours`);
      recommendations.push('Review old items and consider manual cleanup');
    }

    return {
      isHealthy: issues.length === 0,
      issues,
      recommendations,
    };
  }
}

// React hook for sync queue
export function useSyncQueue() {
  const [stats, setStats] = React.useState<SyncQueueStats>({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0,
  });

  const [isProcessing, setIsProcessing] = React.useState(false);

  React.useEffect(() => {
    const manager = SyncQueueManager.getInstance();
    
    const updateStats = async () => {
      const currentStats = await manager.getStats();
      setStats(currentStats);
      setIsProcessing(currentStats.processing > 0);
    };

    const unsubscribe = manager.subscribe(updateStats);
    updateStats();

    return () => unsubscribe();
  }, []);

  const addToQueue = React.useCallback(async (
    type: SyncQueueItem['type'],
    entityType: SyncQueueItem['entityType'],
    entityId: string,
    data: any
  ) => {
    const manager = SyncQueueManager.getInstance();
    return await manager.addToQueue({
      type,
      entityType,
      entityId,
      data,
      maxRetries: 3,
    });
  }, []);

  const processQueue = React.useCallback(async () => {
    const manager = SyncQueueManager.getInstance();
    await manager.processQueue();
  }, []);

  const retryFailed = React.useCallback(async () => {
    const manager = SyncQueueManager.getInstance();
    await manager.retryFailed();
  }, []);

  const clearCompleted = React.useCallback(async () => {
    const manager = SyncQueueManager.getInstance();
    await manager.clearCompleted();
  }, []);

  const getHealthStatus = React.useCallback(async () => {
    const manager = SyncQueueManager.getInstance();
    return await manager.getHealthStatus();
  }, []);

  return {
    stats,
    isProcessing,
    addToQueue,
    processQueue,
    retryFailed,
    clearCompleted,
    getHealthStatus,
  };
}
