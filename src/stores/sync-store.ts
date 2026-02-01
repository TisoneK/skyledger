import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SyncOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: 'transaction' | 'chama_contribution' | 'category';
  data: any;
  timestamp: Date;
  retryCount: number;
}

interface SyncStore {
  // Sync queue
  syncQueue: SyncOperation[];
  
  // Sync state
  isSyncing: boolean;
  lastSyncTime?: Date;
  syncError?: string;
  
  // Actions
  addToSyncQueue: (operation: Omit<SyncOperation, 'id' | 'timestamp' | 'retryCount'>) => void;
  removeFromSyncQueue: (id: string) => void;
  clearSyncQueue: () => void;
  
  // Sync control
  setSyncing: (isSyncing: boolean) => void;
  setSyncError: (error?: string) => void;
  updateLastSyncTime: () => void;
  
  // Retry logic
  incrementRetryCount: (id: string) => void;
  getFailedOperations: () => SyncOperation[];
  removeFailedOperations: () => void;
  
  // Utility
  getQueueSize: () => number;
  hasPendingOperations: () => boolean;
}

export const useSyncStore = create<SyncStore>()(
  persist(
    (set, get) => ({
      // Initial state
      syncQueue: [],
      isSyncing: false,
      lastSyncTime: undefined,
      syncError: undefined,
      
      // Queue management
      addToSyncQueue: (operationData) => {
        const newOperation: SyncOperation = {
          ...operationData,
          id: crypto.randomUUID(),
          timestamp: new Date(),
          retryCount: 0,
        };
        
        set((state) => ({
          syncQueue: [...state.syncQueue, newOperation],
          syncError: undefined, // Clear previous errors when new operation is added
        }));
      },
      
      removeFromSyncQueue: (id) => {
        set((state) => ({
          syncQueue: state.syncQueue.filter((op) => op.id !== id),
        }));
      },
      
      clearSyncQueue: () => {
        set({ syncQueue: [] });
      },
      
      // Sync control
      setSyncing: (isSyncing) => set({ isSyncing }),
      setSyncError: (syncError) => set({ syncError }),
      updateLastSyncTime: () => set({ lastSyncTime: new Date() }),
      
      // Retry logic
      incrementRetryCount: (id) => {
        set((state) => ({
          syncQueue: state.syncQueue.map((op) =>
            op.id === id ? { ...op, retryCount: op.retryCount + 1 } : op
          ),
        }));
      },
      
      getFailedOperations: () => {
        return get().syncQueue.filter((op) => op.retryCount >= 3);
      },
      
      removeFailedOperations: () => {
        const failedIds = get().getFailedOperations().map((op) => op.id);
        set((state) => ({
          syncQueue: state.syncQueue.filter((op) => !failedIds.includes(op.id)),
        }));
      },
      
      // Utility
      getQueueSize: () => get().syncQueue.length,
      hasPendingOperations: () => get().syncQueue.length > 0,
    }),
    {
      name: 'sync-store',
      partialize: (state) => ({
        syncQueue: state.syncQueue.slice(-50), // Keep last 50 operations
        lastSyncTime: state.lastSyncTime,
      }),
    }
  )
);
