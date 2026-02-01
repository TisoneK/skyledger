'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DollarSign,
  BarChart3,
  Download,
  Menu
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface QuickActionsProps {
  className?: string;
  variant?: 'header' | 'card';
}

export function QuickActions({ className, variant = 'header' }: QuickActionsProps) {
  const handleAddTransaction = () => {
    // TODO: Implement add transaction functionality
    console.log('Add Transaction clicked');
  };

  const handleViewAnalytics = () => {
    // TODO: Implement view analytics functionality
    console.log('View Analytics clicked');
  };

  const handleExportReport = () => {
    // TODO: Implement export report functionality
    console.log('Export Report clicked');
  };

  // Header variant - responsive with dropdown on mobile
  if (variant === 'header') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {/* Desktop: Show all buttons */}
        <div className="hidden sm:flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleAddTransaction}
            aria-label="Add Transaction"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            <span className="hidden lg:inline">Add Transaction</span>
            <span className="lg:hidden">Add</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleViewAnalytics}
            aria-label="View Analytics"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            <span className="hidden lg:inline">View Analytics</span>
            <span className="lg:hidden">Analytics</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportReport}
            aria-label="Export Report"
          >
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden lg:inline">Export Report</span>
            <span className="lg:hidden">Export</span>
          </Button>
        </div>

        {/* Mobile: Show dropdown */}
        <div className="sm:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" aria-label="Quick Actions">
                <Menu className="h-4 w-4 mr-2" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleAddTransaction}>
                <DollarSign className="h-4 w-4 mr-2" />
                Add Transaction
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleViewAnalytics}>
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportReport}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }

  // Card variant - original layout for weekly snapshot (will be removed)
  return (
    <div className={`space-y-3 ${className}`}>
      <Button variant="outline" className="w-full justify-start" onClick={handleAddTransaction}>
        <DollarSign className="h-4 w-4 mr-2" />
        Add Transaction
      </Button>
      <Button variant="outline" className="w-full justify-start" onClick={handleViewAnalytics}>
        <BarChart3 className="h-4 w-4 mr-2" />
        View Analytics
      </Button>
      <Button variant="ghost" className="w-full justify-start" onClick={handleExportReport}>
        <Download className="h-4 w-4 mr-2" />
        Export Report
      </Button>
    </div>
  );
}
