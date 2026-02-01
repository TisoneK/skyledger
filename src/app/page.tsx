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
