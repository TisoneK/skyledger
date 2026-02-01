// IndexedDB synchronization service for SkyLedger

import React from 'react';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

// Define IndexedDB schema matching SQLite structure
interface SkyLedgerDB extends DBSchema {
  transactions: {
    key: string;
    value: {
      id: string;
      amount: number;
      description: string;
      date: string;
      type: 'INCOME' | 'EXPENSE';
      roleId: string;
      categoryId: string;
      createdAt: string;
      updatedAt: string;
      syncedAt?: string;
      isDirty: boolean;
    };
    indexes: {
      'by-date': string;
      'by-role': string;
      'by-type': string;
      'by-sync-status': boolean;
    };
  };
  categories: {
    key: string;
    value: {
      id: string;
      name: string;
      type: 'INCOME' | 'EXPENSE';
      roleId: string;
      createdAt: string;
      updatedAt: string;
      syncedAt?: string;
      isDirty: boolean;
    };
    indexes: {
      'by-role': string;
      'by-type': string;
      'by-sync-status': boolean;
    };
  };
  chama_contributions: {
    key: string;
    value: {
      id: string;
      amount: number;
      week: string;
      note?: string;
      roleId: string;
      createdAt: string;
      updatedAt: string;
      syncedAt?: string;
      isDirty: boolean;
    };
    indexes: {
      'by-week': string;
      'by-role': string;
      'by-sync-status': boolean;
    };
  };
  sync_metadata: {
    key: string;
    value: {
      id: string;
      entityType: string;
      lastSyncAt: string;
      syncVersion: number;
      conflictResolution?: 'local' | 'remote' | 'merge';
    };
  };
}

export interface SyncResult {
  success: boolean;
  conflicts: Array<{
    entityId: string;
    entityType: string;
    localVersion: any;
    remoteVersion: any;
  }>;
  errors: Array<{
    entityId: string;
    entityType: string;
    error: string;
  }>;
}

export interface SyncOptions {
  forceSync?: boolean;
  conflictResolution?: 'local' | 'remote' | 'merge';
  batchSize?: number;
}

export class IndexedDBSyncManager {
  private static instance: IndexedDBSyncManager;
  private db: IDBPDatabase<SkyLedgerDB> | null = null;
  private dbName = 'skyledger-offline';
  private dbVersion = 1;
  private isInitialized = false;

  static getInstance(): IndexedDBSyncManager {
    if (!IndexedDBSyncManager.instance) {
      IndexedDBSyncManager.instance = new IndexedDBSyncManager();
    }
    return IndexedDBSyncManager.instance;
  }

  async init(): Promise<void> {
    if (this.isInitialized) return;

    this.db = await openDB<SkyLedgerDB>(this.dbName, this.dbVersion, {
      upgrade(db) {
        // Transactions store
        const transactionStore = db.createObjectStore('transactions', {
          keyPath: 'id',
        });
        transactionStore.createIndex('by-date', 'date');
        transactionStore.createIndex('by-role', 'roleId');
        transactionStore.createIndex('by-type', 'type');
        transactionStore.createIndex('by-sync-status', 'isDirty');

        // Categories store
        const categoryStore = db.createObjectStore('categories', {
          keyPath: 'id',
        });
        categoryStore.createIndex('by-role', 'roleId');
        categoryStore.createIndex('by-type', 'type');
        categoryStore.createIndex('by-sync-status', 'isDirty');

        // Chama contributions store
        const chamaStore = db.createObjectStore('chama_contributions', {
          keyPath: 'id',
        });
        chamaStore.createIndex('by-week', 'week');
        chamaStore.createIndex('by-role', 'roleId');
        chamaStore.createIndex('by-sync-status', 'isDirty');

        // Sync metadata store
        const metadataStore = db.createObjectStore('sync_metadata', {
          keyPath: 'id',
        });
      },
    });

    this.isInitialized = true;
  }

  // Transaction operations
  async addTransaction(transaction: Omit<SkyLedgerDB['transactions']['value'], 'id' | 'createdAt' | 'updatedAt' | 'isDirty'>): Promise<string> {
    if (!this.db) await this.init();

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    const fullTransaction: SkyLedgerDB['transactions']['value'] = {
      ...transaction,
      id,
      createdAt: now,
      updatedAt: now,
      isDirty: true,
    };

    await this.db!.add('transactions', fullTransaction);
    return id;
  }

  async updateTransaction(id: string, updates: Partial<SkyLedgerDB['transactions']['value']>): Promise<void> {
    if (!this.db) await this.init();

    const existing = await this.db!.get('transactions', id);
    if (!existing) throw new Error('Transaction not found');

    const updated: SkyLedgerDB['transactions']['value'] = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
      isDirty: true,
    };

    await this.db!.put('transactions', updated);
  }

  async deleteTransaction(id: string): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.delete('transactions', id);
  }

  async getTransactions(filter?: {
    roleId?: string;
    type?: 'INCOME' | 'EXPENSE';
    date?: string;
    isDirty?: boolean;
  }): Promise<SkyLedgerDB['transactions']['value'][]> {
    if (!this.db) await this.init();

    let transactions: SkyLedgerDB['transactions']['value'][] = [];

    if (filter?.isDirty !== undefined) {
      transactions = await this.db!.getAllFromIndex('transactions', 'by-sync-status', filter.isDirty);
    } else if (filter?.roleId) {
      transactions = await this.db!.getAllFromIndex('transactions', 'by-role', filter.roleId);
    } else if (filter?.type) {
      transactions = await this.db!.getAllFromIndex('transactions', 'by-type', filter.type);
    } else if (filter?.date) {
      transactions = await this.db!.getAllFromIndex('transactions', 'by-date', filter.date);
    } else {
      transactions = await this.db!.getAll('transactions');
    }

    // Apply additional filters
    return transactions.filter(transaction => {
      if (filter?.roleId && transaction.roleId !== filter.roleId) return false;
      if (filter?.type && transaction.type !== filter.type) return false;
      if (filter?.date && transaction.date !== filter.date) return false;
      if (filter?.isDirty !== undefined && transaction.isDirty !== filter.isDirty) return false;
      return true;
    });
  }

  // Category operations
  async addCategory(category: Omit<SkyLedgerDB['categories']['value'], 'id' | 'createdAt' | 'updatedAt' | 'isDirty'>): Promise<string> {
    if (!this.db) await this.init();

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    const fullCategory: SkyLedgerDB['categories']['value'] = {
      ...category,
      id,
      createdAt: now,
      updatedAt: now,
      isDirty: true,
    };

    await this.db!.add('categories', fullCategory);
    return id;
  }

  async getCategories(filter?: {
    roleId?: string;
    type?: 'INCOME' | 'EXPENSE';
    isDirty?: boolean;
  }): Promise<SkyLedgerDB['categories']['value'][]> {
    if (!this.db) await this.init();

    let categories: SkyLedgerDB['categories']['value'][] = [];

    if (filter?.isDirty !== undefined) {
      categories = await this.db!.getAllFromIndex('categories', 'by-sync-status', filter.isDirty);
    } else if (filter?.roleId) {
      categories = await this.db!.getAllFromIndex('categories', 'by-role', filter.roleId);
    } else if (filter?.type) {
      categories = await this.db!.getAllFromIndex('categories', 'by-type', filter.type);
    } else {
      categories = await this.db!.getAll('categories');
    }

    // Apply additional filters
    return categories.filter(category => {
      if (filter?.roleId && category.roleId !== filter.roleId) return false;
      if (filter?.type && category.type !== filter.type) return false;
      if (filter?.isDirty !== undefined && category.isDirty !== filter.isDirty) return false;
      return true;
    });
  }

  // Chama contribution operations
  async addChamaContribution(contribution: Omit<SkyLedgerDB['chama_contributions']['value'], 'id' | 'createdAt' | 'updatedAt' | 'isDirty'>): Promise<string> {
    if (!this.db) await this.init();

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    const fullContribution: SkyLedgerDB['chama_contributions']['value'] = {
      ...contribution,
      id,
      createdAt: now,
      updatedAt: now,
      isDirty: true,
    };

    await this.db!.add('chama_contributions', fullContribution);
    return id;
  }

  async getChamaContributions(filter?: {
    roleId?: string;
    week?: string;
    isDirty?: boolean;
  }): Promise<SkyLedgerDB['chama_contributions']['value'][]> {
    if (!this.db) await this.init();

    let contributions: SkyLedgerDB['chama_contributions']['value'][] = [];

    if (filter?.isDirty !== undefined) {
      contributions = await this.db!.getAllFromIndex('chama_contributions', 'by-sync-status', filter.isDirty);
    } else if (filter?.roleId) {
      contributions = await this.db!.getAllFromIndex('chama_contributions', 'by-role', filter.roleId);
    } else if (filter?.week) {
      contributions = await this.db!.getAllFromIndex('chama_contributions', 'by-week', filter.week);
    } else {
      contributions = await this.db!.getAll('chama_contributions');
    }

    // Apply additional filters
    return contributions.filter(contribution => {
      if (filter?.roleId && contribution.roleId !== filter.roleId) return false;
      if (filter?.week && contribution.week !== filter.week) return false;
      if (filter?.isDirty !== undefined && contribution.isDirty !== filter.isDirty) return false;
      return true;
    });
  }

  // Sync operations
  async getDirtyEntities(): Promise<{
    transactions: SkyLedgerDB['transactions']['value'][];
    categories: SkyLedgerDB['categories']['value'][];
    chama_contributions: SkyLedgerDB['chama_contributions']['value'][];
  }> {
    const [transactions, categories, chama_contributions] = await Promise.all([
      this.getTransactions({ isDirty: true }),
      this.getCategories({ isDirty: true }),
      this.getChamaContributions({ isDirty: true }),
    ]);

    return { transactions, categories, chama_contributions };
  }

  async markAsSynced(entityType: 'transactions' | 'categories' | 'chama_contributions', id: string): Promise<void> {
    if (!this.db) await this.init();

    const store = this.db!.transaction(entityType, 'readwrite').store;
    const entity = await store.get(id);
    
    if (entity) {
      entity.syncedAt = new Date().toISOString();
      entity.isDirty = false;
      await store.put(entity);
    }
  }

  async syncWithServer(options: SyncOptions = {}): Promise<SyncResult> {
    const {
      forceSync = false,
      conflictResolution = 'local',
      batchSize = 50,
    } = options;

    const dirtyEntities = await this.getDirtyEntities();
    const conflicts: SyncResult['conflicts'] = [];
    const errors: SyncResult['errors'] = [];

    // Sync transactions
    for (let i = 0; i < dirtyEntities.transactions.length; i += batchSize) {
      const batch = dirtyEntities.transactions.slice(i, i + batchSize);
      
      for (const transaction of batch) {
        try {
          // This would typically make an API call to sync with the server
          // For now, we'll simulate the sync process
          await this.simulateServerSync('transaction', transaction);
          await this.markAsSynced('transactions', transaction.id);
        } catch (error) {
          if ((error as Error).message.includes('conflict')) {
            conflicts.push({
              entityId: transaction.id,
              entityType: 'transaction',
              localVersion: transaction,
              remoteVersion: {}, // Would come from server
            });
          } else {
            errors.push({
              entityId: transaction.id,
              entityType: 'transaction',
              error: (error as Error).message,
            });
          }
        }
      }
    }

    // Sync categories
    for (let i = 0; i < dirtyEntities.categories.length; i += batchSize) {
      const batch = dirtyEntities.categories.slice(i, i + batchSize);
      
      for (const category of batch) {
        try {
          await this.simulateServerSync('category', category);
          await this.markAsSynced('categories', category.id);
        } catch (error) {
          if ((error as Error).message.includes('conflict')) {
            conflicts.push({
              entityId: category.id,
              entityType: 'category',
              localVersion: category,
              remoteVersion: {},
            });
          } else {
            errors.push({
              entityId: category.id,
              entityType: 'category',
              error: (error as Error).message,
            });
          }
        }
      }
    }

    // Sync chama contributions
    for (let i = 0; i < dirtyEntities.chama_contributions.length; i += batchSize) {
      const batch = dirtyEntities.chama_contributions.slice(i, i + batchSize);
      
      for (const contribution of batch) {
        try {
          await this.simulateServerSync('chama_contribution', contribution);
          await this.markAsSynced('chama_contributions', contribution.id);
        } catch (error) {
          if ((error as Error).message.includes('conflict')) {
            conflicts.push({
              entityId: contribution.id,
              entityType: 'chama_contribution',
              localVersion: contribution,
              remoteVersion: {},
            });
          } else {
            errors.push({
              entityId: contribution.id,
              entityType: 'chama_contribution',
              error: (error as Error).message,
            });
          }
        }
      }
    }

    return {
      success: conflicts.length === 0 && errors.length === 0,
      conflicts,
      errors,
    };
  }

  private async simulateServerSync(entityType: string, entity: any): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Simulate occasional conflicts (5% chance)
    if (Math.random() < 0.05) {
      throw new Error('conflict: Remote version differs from local version');
    }
    
    // Simulate occasional errors (2% chance)
    if (Math.random() < 0.02) {
      throw new Error('Network error: Failed to sync with server');
    }
    
    console.log(`Synced ${entityType} ${entity.id} with server`);
  }

  // Conflict resolution
  async resolveConflict(
    entityType: 'transactions' | 'categories' | 'chama_contributions',
    entityId: string,
    resolution: 'local' | 'remote' | 'merge',
    remoteVersion?: any
  ): Promise<void> {
    if (!this.db) await this.init();

    const store = this.db!.transaction(entityType, 'readwrite').store;
    const localVersion = await store.get(entityId);
    
    if (!localVersion) throw new Error('Entity not found');

    switch (resolution) {
      case 'local':
        // Keep local version, mark as synced
        localVersion.syncedAt = new Date().toISOString();
        localVersion.isDirty = false;
        await store.put(localVersion);
        break;

      case 'remote':
        // Replace with remote version
        if (remoteVersion) {
          const mergedVersion = {
            ...remoteVersion,
            syncedAt: new Date().toISOString(),
            isDirty: false,
          };
          await store.put(mergedVersion);
        }
        break;

      case 'merge':
        // Attempt to merge (implementation depends on entity type)
        const mergedVersion = await this.mergeEntities(localVersion, remoteVersion);
        await store.put(mergedVersion);
        break;
    }
  }

  private async mergeEntities(local: any, remote: any): Promise<any> {
    // Simple merge strategy - prefer newer timestamps
    const localDate = new Date(local.updatedAt);
    const remoteDate = new Date(remote.updatedAt);
    
    if (remoteDate > localDate) {
      return {
        ...remote,
        syncedAt: new Date().toISOString(),
        isDirty: false,
      };
    } else {
      return {
        ...local,
        syncedAt: new Date().toISOString(),
        isDirty: false,
      };
    }
  }

  // Data export/import
  async exportData(): Promise<{
    transactions: SkyLedgerDB['transactions']['value'][];
    categories: SkyLedgerDB['categories']['value'][];
    chama_contributions: SkyLedgerDB['chama_contributions']['value'][];
  }> {
    const [transactions, categories, chama_contributions] = await Promise.all([
      this.getTransactions(),
      this.getCategories(),
      this.getChamaContributions(),
    ]);

    return { transactions, categories, chama_contributions };
  }

  async importData(data: {
    transactions?: SkyLedgerDB['transactions']['value'][];
    categories?: SkyLedgerDB['categories']['value'][];
    chama_contributions?: SkyLedgerDB['chama_contributions']['value'][];
  }): Promise<void> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(['transactions', 'categories', 'chama_contributions'], 'readwrite');

    if (data.transactions) {
      for (const item of data.transactions) {
        await transaction.objectStore('transactions').put(item);
      }
    }

    if (data.categories) {
      for (const item of data.categories) {
        await transaction.objectStore('categories').put(item);
      }
    }

    if (data.chama_contributions) {
      for (const item of data.chama_contributions) {
        await transaction.objectStore('chama_contributions').put(item);
      }
    }
  }

  // Cleanup operations
  async clearSyncedData(olderThan?: Date): Promise<void> {
    if (!this.db) await this.init();

    const cutoffDate = olderThan || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

    const transaction = this.db!.transaction(['transactions', 'categories', 'chama_contributions'], 'readwrite');

    // Clear old synced transactions
    const transactions = await transaction.objectStore('transactions').index('by-sync-status').getAll(false);
    for (const item of transactions) {
      if (new Date(item.updatedAt) < cutoffDate) {
        await transaction.objectStore('transactions').delete(item.id);
      }
    }

    // Clear old synced categories
    const categories = await transaction.objectStore('categories').index('by-sync-status').getAll(false);
    for (const item of categories) {
      if (new Date(item.updatedAt) < cutoffDate) {
        await transaction.objectStore('categories').delete(item.id);
      }
    }

    // Clear old synced chama contributions
    const contributions = await transaction.objectStore('chama_contributions').index('by-sync-status').getAll(false);
    for (const item of contributions) {
      if (new Date(item.updatedAt) < cutoffDate) {
        await transaction.objectStore('chama_contributions').delete(item.id);
      }
    }
  }
}

// React hook for IndexedDB sync
export function useIndexedDBSync() {
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [syncStats, setSyncStats] = React.useState({
    dirtyTransactions: 0,
    dirtyCategories: 0,
    dirtyChamaContributions: 0,
  });

  React.useEffect(() => {
    const manager = IndexedDBSyncManager.getInstance();
    
    const initialize = async () => {
      await manager.init();
      setIsInitialized(true);
      
      // Update sync stats
      const dirtyEntities = await manager.getDirtyEntities();
      setSyncStats({
        dirtyTransactions: dirtyEntities.transactions.length,
        dirtyCategories: dirtyEntities.categories.length,
        dirtyChamaContributions: dirtyEntities.chama_contributions.length,
      });
    };

    initialize();
  }, []);

  const syncWithServer = React.useCallback(async (options?: SyncOptions) => {
    const manager = IndexedDBSyncManager.getInstance();
    const result = await manager.syncWithServer(options);
    
    // Update stats after sync
    const dirtyEntities = await manager.getDirtyEntities();
    setSyncStats({
      dirtyTransactions: dirtyEntities.transactions.length,
      dirtyCategories: dirtyEntities.categories.length,
      dirtyChamaContributions: dirtyEntities.chama_contributions.length,
    });
    
    return result;
  }, []);

  return {
    isInitialized,
    syncStats,
    syncWithServer,
  };
}
