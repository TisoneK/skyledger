'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Wallet,
  Users,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  DollarSign,
  BarChart3,
  Download
} from 'lucide-react';
import { useFinancialStore } from '@/stores/financial-store';
import { useUIStore } from '@/stores/ui-store';
import { RoleIcon } from '@/components/ui/role-icon';
import { getRoleColor, getRoleCardClasses, getTuesdayAlertClasses } from '@/lib/role-colors';
import { cn } from '@/lib/utils';

export function WeeklySnapshot() {
  const { currentDashboardData, roles } = useFinancialStore();
  const { selectedRole } = useUIStore();

  const isTuesday = new Date().getDay() === 2;
  const currentWeek = new Date().toISOString().split('T')[0];

  // Mock data for demonstration
  const mockData = {
    totalIncome: 12450,
    totalExpenses: 8200,
    netIncome: 4250,
    weekOverWeekChange: 12.5,
    roleSummaries: [
      {
        role: { name: 'personal', displayName: 'Personal', color: '#3b82f6' },
        income: 8000,
        expenses: 5500,
        netIncome: 2500,
        transactionCount: 12,
      },
      {
        role: { name: 'business', displayName: 'Sky Tech', color: '#22c55e' },
        income: 3500,
        expenses: 1800,
        netIncome: 1700,
        transactionCount: 5,
      },
      {
        role: { name: 'chama', displayName: 'Chama', color: '#f59e0b' },
        income: 0,
        expenses: 250,
        netIncome: -250,
        transactionCount: 1,
      },
      {
        role: { name: 'sideincome', displayName: 'Side Income', color: '#a855f7' },
        income: 950,
        expenses: 650,
        netIncome: 300,
        transactionCount: 8,
      },
    ],
    chamaContribution: {
      amount: 250,
      targetAmount: 250,
      progress: 100,
      week: '2024-W05',
    },
  };

  const data = mockData; // Use mock data for now

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    trend, 
    className 
  }: {
    title: string;
    value: string;
    change?: number;
    icon: React.ComponentType<any>;
    trend?: 'up' | 'down';
    className?: string;
  }) => (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="pt-2">
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div className={cn(
            "flex items-center text-xs mt-1",
            trend === 'up' ? 'text-green-500' : 'text-red-500'
          )}>
            {trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
            {Math.abs(change)}% from last week
          </div>
        )}
      </CardContent>
    </Card>
  );

  const RoleSummaryCard = ({ 
    role, 
    income, 
    expenses, 
    netIncome, 
    transactionCount 
  }: {
    role: any;
    income: number;
    expenses: number;
    netIncome: number;
    transactionCount: number;
  }) => {
    const roleConfig = getRoleColor(role.name);
    
    // Map role names to RoleIcon types
    const getRoleIconType = (roleName: string) => {
      switch (roleName) {
        case 'personal': return 'personal';
        case 'business': return 'sky-tech';
        case 'chama': return 'chama';
        case 'sideincome': return 'side-income';
        default: return 'personal';
      }
    };

    return (
      <Card className={cn("relative overflow-hidden", getRoleCardClasses(role.name))}>
        <div className={cn(
          "absolute top-0 left-0 w-1 h-full",
          roleConfig.background
        )} />
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <RoleIcon 
              type={getRoleIconType(role.name)}
              size={16}
              className={cn("h-4 w-4", roleConfig.text)}
            />
            <CardTitle className="text-sm font-medium">{role.displayName}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <div className="text-muted-foreground">Income</div>
              <div className="font-semibold text-green-600">+Ksh {income.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Expenses</div>
              <div className="font-semibold text-red-600">-Ksh {expenses.toLocaleString()}</div>
            </div>
          </div>
          <div className="border-t pt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Net</span>
              <span className={cn(
                "font-bold",
                netIncome >= 0 ? "text-green-600" : "text-red-600"
              )}>
                {netIncome >= 0 ? '+' : ''}Ksh {Math.abs(netIncome).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {transactionCount} transactions
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Weekly Snapshot</h1>
          <p className="text-muted-foreground">
            Week of {currentWeek} • {isTuesday ? "🔥 Chama Day!" : "Next Tuesday is Chama Day"}
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Calendar className="h-4 w-4 mr-2" />
          Change Week
        </Button>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Income"
          value={`Ksh ${data.totalIncome.toLocaleString()}`}
          change={data.weekOverWeekChange}
          icon={TrendingUp}
          trend="up"
        />
        <MetricCard
          title="Total Expenses"
          value={`Ksh ${data.totalExpenses.toLocaleString()}`}
          change={-8.3}
          icon={TrendingDown}
          trend="down"
        />
        <MetricCard
          title="Net Income"
          value={`Ksh ${data.netIncome.toLocaleString()}`}
          change={15.2}
          icon={DollarSign}
          trend="up"
        />
      </div>

      {/* Tuesday Chama Focus */}
      {isTuesday && (
        <Card className={cn("border-2 border-amber-200 bg-amber-50", getTuesdayAlertClasses(isTuesday))}>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-amber-600" />
              <CardTitle className="text-amber-800">Chama Tuesday! 🎯</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Weekly Target</span>
                <span className="text-sm">Ksh {data.chamaContribution.targetAmount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Contribution</span>
                <span className="text-sm font-bold text-green-600">
                  Ksh {data.chamaContribution.amount}
                </span>
              </div>
              <div className="w-full bg-amber-200 rounded-full h-2">
                <div 
                  className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${data.chamaContribution.progress}%` }}
                />
              </div>
              <p className="text-xs text-amber-700">
                {data.chamaContribution.progress >= 100 
                  ? "🎉 Target met! You're on track!" 
                  : `Ksh ${data.chamaContribution.targetAmount - data.chamaContribution.amount} to reach target`}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Role Summaries */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Role Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {data.roleSummaries.map((roleSummary) => (
            <RoleSummaryCard key={roleSummary.role.name} {...roleSummary} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks for this week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button variant="outline" className="w-full justify-start">
              <DollarSign className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
