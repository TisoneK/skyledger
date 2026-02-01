'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useUIStore } from '@/stores/ui-store';
import { useSyncStore } from '@/stores/sync-store';
import { cn } from '@/lib/utils';

export function SyncStatusIndicator() {
  const { connectionState } = useUIStore();
  const { isSyncing, syncError, updateLastSyncTime } = useSyncStore();
  const { isOnline, syncStatus, lastSyncTime, pendingOperations } = connectionState;

  const getSyncIcon = () => {
    if (isSyncing) return <Loader2 className="h-4 w-4 animate-spin" />;
    
    switch (syncStatus) {
      case 'offline':
        return <WifiOff className="h-4 w-4" />;
      case 'sync-error':
        return <AlertCircle className="h-4 w-4" />;
      case 'syncing':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      default:
        return <Wifi className="h-4 w-4" />;
    }
  };

  const getSyncColor = () => {
    if (isSyncing) return 'text-blue-500';
    
    switch (syncStatus) {
      case 'offline':
        return 'text-amber-500';
      case 'sync-error':
        return 'text-red-500';
      case 'syncing':
        return 'text-blue-500';
      default:
        return 'text-green-500';
    }
  };

  const getSyncText = () => {
    if (isSyncing) return 'Syncing...';
    
    switch (syncStatus) {
      case 'offline':
        return 'Offline';
      case 'sync-error':
        return 'Sync Error';
      case 'syncing':
        return 'Syncing...';
      default:
        return 'Synced';
    }
  };

  const handleManualSync = async () => {
    if (isSyncing || !isOnline) return;
    
    try {
      // Trigger manual sync logic here
      updateLastSyncTime();
      // This would integrate with your actual sync service
    } catch (error) {
      console.error('Manual sync failed:', error);
    }
  };

  const formatLastSyncTime = () => {
    if (!lastSyncTime) return 'Never';
    
    const now = new Date();
    const diff = now.getTime() - lastSyncTime.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Status Indicator */}
      <div className={cn(
        "flex items-center space-x-1 text-sm",
        getSyncColor()
      )}>
        {getSyncIcon()}
        <span className="hidden sm:inline">{getSyncText()}</span>
        
        {/* Pending operations indicator */}
        {pendingOperations > 0 && (
          <span className="bg-muted px-1.5 py-0.5 rounded text-xs font-medium">
            {pendingOperations}
          </span>
        )}
      </div>

      {/* Detailed Status (on hover or click) */}
      {(syncStatus === 'sync-error' || pendingOperations > 0) && (
        <Card className="absolute right-0 top-full mt-1 w-64 z-50 shadow-lg">
          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Connection Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Connection</span>
                <div className={cn(
                  "flex items-center space-x-1 text-sm",
                  isOnline ? "text-green-500" : "text-red-500"
                )}>
                  {isOnline ? (
                    <>
                      <Wifi className="h-3 w-3" />
                      <span>Online</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-3 w-3" />
                      <span>Offline</span>
                    </>
                  )}
                </div>
              </div>

              {/* Last Sync */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Sync</span>
                <span className="text-sm text-muted-foreground">
                  {formatLastSyncTime()}
                </span>
              </div>

              {/* Pending Operations */}
              {pendingOperations > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Pending</span>
                  <span className="text-sm text-muted-foreground">
                    {pendingOperations} operations
                  </span>
                </div>
              )}

              {/* Error Message */}
              {syncError && (
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-red-500">Sync Error</div>
                    <div className="text-xs text-muted-foreground">
                      {syncError}
                    </div>
                  </div>
                </div>
              )}

              {/* Manual Sync Button */}
              {isOnline && !isSyncing && (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={handleManualSync}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Sync Now
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success indicator */}
      {syncStatus === 'synced' && !pendingOperations && (
        <div className="flex items-center text-green-500">
          <CheckCircle className="h-3 w-3" />
        </div>
      )}
    </div>
  );
}
