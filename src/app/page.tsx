'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { WeeklySnapshot } from '@/components/dashboard/weekly-snapshot';
import { QuickTransactionEntry } from '@/components/dashboard/quick-transaction-entry';
import { AmIMovingForward } from '@/components/am-i-moving-forward';
import { ChamaTargetTracker } from '@/components/chama-target-tracker';
import { WeeklyTrends } from '@/components/charts/weekly-trends';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';
import { KeyboardNav } from '@/components/ui/keyboard-nav';
import { Card, CardContent } from '@/components/ui/card';
import { serviceWorkerManager } from '@/lib/offline-detection';

export default function Home() {
  React.useEffect(() => {
    // Register service worker for PWA functionality
    serviceWorkerManager.register();
  }, []);

  return (
    <ThemeProvider>
      <KeyboardNav>
        <MainLayout>
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">+Ksh 12,450</div>
                  <div className="text-sm text-muted-foreground">Total Income</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-red-600">Ksh 8,200</div>
                  <div className="text-sm text-muted-foreground">Total Expenses</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">+Ksh 4,250</div>
                  <div className="text-sm text-muted-foreground">Net Income</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-purple-600">28</div>
                  <div className="text-sm text-muted-foreground">Transactions</div>
                </CardContent>
              </Card>
            </div>

            {/* Main Dashboard Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Main Dashboard */}
              <div className="lg:col-span-2 space-y-6">
                <WeeklySnapshot />
                <QuickTransactionEntry />
              </div>

              {/* Right Column - Assessment & Tracking */}
              <div className="space-y-6">
                <AmIMovingForward />
                <ChamaTargetTracker />
              </div>
            </div>

            {/* Charts Section */}
            <div className="space-y-6">
              <WeeklyTrends />
            </div>
          </div>
        </MainLayout>
      </KeyboardNav>
    </ThemeProvider>
  );
}
