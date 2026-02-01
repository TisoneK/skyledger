import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { SkyLedgerIcon } from '@/components/ui/skyledger-icon';
import { RoleIcon } from '@/components/ui/role-icon';
import { QuickActions } from '@/components/ui/quick-actions';
import { 
  Wallet, 
  TrendingUp, 
  Users, 
  Zap, 
  Menu, 
  X,
  Wifi,
  WifiOff,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useUIStore } from '@/stores/ui-store';
import { cn } from '@/lib/utils';
import { useRealTimeDate } from '@/hooks/use-real-time-date';

const roleConfig = [
  { 
    name: 'personal', 
    displayName: 'Personal', 
    icon: 'personal', 
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  { 
    name: 'sky-tech', 
    displayName: 'Sky Tech', 
    icon: 'sky-tech', 
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  { 
    name: 'chama', 
    displayName: 'Chama', 
    icon: 'chama', 
    color: 'text-amber-500',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200'
  },
  { 
    name: 'side-income', 
    displayName: 'Side Income', 
    icon: 'side-income', 
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  },
];

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { 
    selectedRole, 
    setSelectedRole, 
    sidebarOpen, 
    setSidebarOpen,
    connectionState 
  } = useUIStore();

  const { isOnline, syncStatus, pendingOperations } = connectionState;
  const chamaDayDisplay = useRealTimeDate();

  const getSyncIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'offline':
        return <WifiOff className="h-4 w-4" />;
      case 'sync-error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Wifi className="h-4 w-4" />;
    }
  };

  const getSyncStatusColor = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'text-blue-500';
      case 'offline':
        return 'text-amber-500';
      case 'sync-error':
        return 'text-red-500';
      default:
        return 'text-green-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>

          {/* Enhanced Logo/Title */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <SkyLedgerIcon size={32} alt="SkyLedger" className="flex-shrink-0" />
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-green-600 leading-tight">SkyLedger</h1>
              <p className="text-xs text-muted-foreground hidden sm:block leading-tight">Your weekly financial mirror</p>
            </div>
          </div>

          {/* Quick Actions - Middle Section */}
          <div className="flex-1 flex items-center justify-center px-4">
            <QuickActions variant="header" />
          </div>

          {/* Right side with theme toggle and sync status */}
          <div className="ml-auto flex items-center space-x-2">
            <ThemeToggle />
            <div className={cn("flex items-center space-x-1 text-sm", getSyncStatusColor())}>
              {getSyncIcon()}
              <span className="hidden sm:inline">
                {syncStatus === 'syncing' && 'Syncing...'}
                {syncStatus === 'offline' && 'Offline'}
                {syncStatus === 'sync-error' && 'Sync Error'}
                {syncStatus === 'synced' && 'Synced'}
              </span>
              {pendingOperations > 0 && (
                <span className="bg-muted px-1 py-0.5 rounded text-xs">
                  {pendingOperations}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-40 w-52 transform border-r bg-background transition-transform duration-200 ease-in-out md:sticky md:top-16 md:translate-x-0 md:max-h-[calc(100vh-4rem)] md:w-48 lg:w-52 xl:w-56",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex h-full flex-col">
            {/* Role Selection */}
            <div className="p-3">
              <h2 className="text-base font-semibold mb-3">Financial Roles</h2>
              <div className="space-y-1.5">
                {/* All Roles Option */}
                <Button
                  variant={selectedRole === 'all' ? 'default' : 'outline'}
                  className="w-full justify-start h-11 px-2 text-sm"
                  onClick={() => setSelectedRole('all')}
                  aria-label="View all financial roles"
                >
                  <div className="flex items-center space-x-2">
                    <RoleIcon 
                      type="all-roles"
                      context="sidebar"
                      className={cn("sidebar", selectedRole === 'all' && "text-green-600")}
                    />
                    <span className="truncate">All Roles</span>
                  </div>
                </Button>

                {/* Individual Roles */}
                {roleConfig.map((role) => {
                  return (
                    <Button
                      key={role.name}
                      variant={selectedRole === role.name ? 'default' : 'outline'}
                      className={cn(
                        "w-full justify-start h-11 px-2 text-sm",
                        selectedRole === role.name && role.borderColor
                      )}
                      onClick={() => setSelectedRole(role.name as any)}
                      aria-label={`View ${role.displayName} financial role`}
                    >
                      <div className="flex items-center space-x-2">
                        <RoleIcon 
                          type={role.name as any}
                          context="sidebar"
                          className={cn("sidebar", selectedRole === role.name && role.color)}
                        />
                        <span className="truncate">{role.displayName}</span>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Tuesday Reminder */}
            <div className="p-3 border-t mt-auto">
              <Card className={cn(
                "border-2",
                chamaDayDisplay.isToday ? "border-amber-200 bg-amber-50" : ""
              )}>
                <CardContent className="p-3">
                  <div className="flex items-start space-x-2">
                    <Users className="h-6 w-6 text-amber-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Chama Day</div>
                      <div className="text-xs text-muted-foreground mb-1">
                        {chamaDayDisplay.statusText}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {chamaDayDisplay.date} • {chamaDayDisplay.time}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="container py-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
