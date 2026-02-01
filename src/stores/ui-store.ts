import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RoleName, UIState, SyncStatus, ConnectionState } from '@/types/financial';

interface UIStore extends UIState {
  // Connection state
  connectionState: ConnectionState;
  
  // Actions
  setSelectedRole: (role: RoleName | 'all') => void;
  setCurrentWeek: (week: string) => void;
  setViewMode: (mode: 'dashboard' | 'transactions' | 'analytics') => void;
  setSidebarOpen: (open: boolean) => void;
  setDarkMode: (dark: boolean) => void;
  
  // Connection actions
  setConnectionState: (state: Partial<ConnectionState>) => void;
  setOnlineStatus: (isOnline: boolean) => void;
  setSyncStatus: (status: SyncStatus) => void;
  updateLastSyncTime: () => void;
  incrementPendingOperations: () => void;
  decrementPendingOperations: () => void;
  
  // Utility methods
  resetToDefaults: () => void;
}

const defaultUIState: UIState = {
  selectedRole: 'all',
  currentWeek: new Date().toISOString().split('T')[0], // Today's date
  viewMode: 'dashboard',
  sidebarOpen: false,
  darkMode: false,
};

const defaultConnectionState: ConnectionState = {
  isOnline: navigator.onLine,
  syncStatus: 'synced',
  lastSyncTime: undefined,
  pendingOperations: 0,
};

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      ...defaultUIState,
      connectionState: defaultConnectionState,
      
      // UI Actions
      setSelectedRole: (selectedRole) => set({ selectedRole }),
      setCurrentWeek: (currentWeek) => set({ currentWeek }),
      setViewMode: (viewMode) => set({ viewMode }),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      setDarkMode: (darkMode) => set({ darkMode }),
      
      // Connection Actions
      setConnectionState: (connectionStateUpdate) => 
        set((state) => ({
          connectionState: { ...state.connectionState, ...connectionStateUpdate }
        })),
      
      setOnlineStatus: (isOnline) => 
        set((state) => ({
          connectionState: { ...state.connectionState, isOnline }
        })),
      
      setSyncStatus: (syncStatus) => 
        set((state) => ({
          connectionState: { ...state.connectionState, syncStatus }
        })),
      
      updateLastSyncTime: () => 
        set((state) => ({
          connectionState: { 
            ...state.connectionState, 
            lastSyncTime: new Date() 
          }
        })),
      
      incrementPendingOperations: () => 
        set((state) => ({
          connectionState: { 
            ...state.connectionState, 
            pendingOperations: state.connectionState.pendingOperations + 1 
          }
        })),
      
      decrementPendingOperations: () => 
        set((state) => ({
          connectionState: { 
            ...state.connectionState, 
            pendingOperations: Math.max(0, state.connectionState.pendingOperations - 1) 
          }
        })),
      
      // Utility
      resetToDefaults: () => set({
        ...defaultUIState,
        connectionState: defaultConnectionState,
      }),
    }),
    {
      name: 'ui-store',
      partialize: (state) => ({
        selectedRole: state.selectedRole,
        viewMode: state.viewMode,
        darkMode: state.darkMode,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);

// Initialize online/offline event listeners
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useUIStore.getState().setOnlineStatus(true);
  });
  
  window.addEventListener('offline', () => {
    useUIStore.getState().setOnlineStatus(false);
  });
}
