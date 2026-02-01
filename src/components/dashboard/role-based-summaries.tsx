'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getRoleCardClasses, getRoleBadgeClasses } from '@/lib/role-colors';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, PiggyBank, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoleSummaryProps {
  roleId: string;
  weekData: {
    income: number;
    expenses: number;
    netIncome: number;
    transactionCount: number;
    topCategories: Array<{ name: string; amount: number }>;
  };
  previousWeekData?: {
    income: number;
    expenses: number;
    netIncome: number;
  };
}

export function RoleBasedSummary({ roleId, weekData, previousWeekData }: RoleSummaryProps) {
  const roleConfig = getRoleCardClasses(roleId as any);
  const badgeConfig = getRoleBadgeClasses(roleId as any);

  const incomeChange = previousWeekData 
    ? ((weekData.income - previousWeekData.income) / previousWeekData.income) * 100
    : 0;

  const expenseChange = previousWeekData
    ? ((weekData.expenses - previousWeekData.expenses) / previousWeekData.expenses) * 100
    : 0;

  const netIncomeChange = previousWeekData
    ? ((weekData.netIncome - previousWeekData.netIncome) / Math.abs(previousWeekData.netIncome || 1)) * 100
    : 0;

  const getRoleIcon = (roleId: string) => {
    switch (roleId) {
      case 'personal':
        return <DollarSign className="h-5 w-5" />;
      case 'sky-tech':
        return <Briefcase className="h-5 w-5" />;
      case 'chama':
        return <PiggyBank className="h-5 w-5" />;
      case 'side-income':
        return <TrendingUp className="h-5 w-5" />;
      default:
        return <BarChart3 className="h-5 w-5" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  return (
    <Card className={cn(roleConfig, "p-0")}>
      <CardHeader className="pb-4 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getRoleIcon(roleId)}
            <CardTitle className="text-lg capitalize">
              {roleId.replace('-', ' ')}
            </CardTitle>
            <Badge className={badgeConfig}>
              {weekData.transactionCount} transactions
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-4 pb-4">
        {/* Main Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2 text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(weekData.income)}
            </div>
            <div className="text-sm text-muted-foreground">Income</div>
            {previousWeekData && (
              <div className={`text-xs flex items-center justify-center ${
                incomeChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {incomeChange >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {formatPercentage(incomeChange)}
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-2 text-center">
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(weekData.expenses)}
            </div>
            <div className="text-sm text-muted-foreground">Expenses</div>
            {previousWeekData && (
              <div className={`text-xs flex items-center justify-center ${
                expenseChange <= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {expenseChange <= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {formatPercentage(Math.abs(expenseChange))}
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-2 text-center border-t pt-2">
            <div className={`text-2xl font-bold ${
              weekData.netIncome >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(weekData.netIncome)}
            </div>
            <div className="text-sm text-muted-foreground">Net Income</div>
            {previousWeekData && (
              <div className={`text-xs flex items-center justify-center ${
                netIncomeChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {netIncomeChange >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {formatPercentage(netIncomeChange)}
              </div>
            )}
          </div>
        </div>

        {/* Savings Progress */}
        {roleId === 'personal' && weekData.income > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Savings Rate</span>
              <span>{Math.round((weekData.netIncome / weekData.income) * 100)}%</span>
            </div>
            <Progress 
              value={Math.max(0, (weekData.netIncome / weekData.income) * 100)} 
              className="h-2"
            />
          </div>
        )}

        {/* Chama Progress */}
        {roleId === 'chama' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Weekly Target (Ksh 250)</span>
              <span>{formatCurrency(weekData.income)}</span>
            </div>
            <Progress 
              value={Math.min(100, (weekData.income / 250) * 100)} 
              className="h-2"
            />
            {weekData.income < 250 && (
              <div className="text-xs text-muted-foreground">
                {formatCurrency(250 - weekData.income)} remaining to meet target
              </div>
            )}
          </div>
        )}

        {/* Top Categories */}
        {weekData.topCategories.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Top Categories</div>
            <div className="space-y-1">
              {weekData.topCategories.slice(0, 3).map((category, index) => (
                <div key={index} className="flex justify-between text-xs">
                  <span className="truncate">{category.name}</span>
                  <span className="font-medium">{formatCurrency(category.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Business Metrics for Sky Tech */}
        {roleId === 'sky-tech' && (
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="font-medium">Profit Margin</div>
              <div className={weekData.income > 0 ? 'text-green-600' : 'text-red-600'}>
                {weekData.income > 0 
                  ? `${Math.round((weekData.netIncome / weekData.income) * 100)}%`
                  : 'N/A'
                }
              </div>
            </div>
            <div>
              <div className="font-medium">Avg Transaction</div>
              <div>
                {weekData.transactionCount > 0 
                  ? formatCurrency(weekData.income / weekData.transactionCount)
                  : 'N/A'
                }
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface RoleBasedSummariesProps {
  currentWeek: string;
  selectedRole?: string;
}

export function RoleBasedSummaries({ currentWeek, selectedRole }: RoleBasedSummariesProps) {
  // Mock data - in a real implementation, this would come from your state management
  const mockWeekData = {
    personal: {
      income: 45000,
      expenses: 32000,
      netIncome: 13000,
      transactionCount: 15,
      topCategories: [
        { name: 'Groceries', amount: 8000 },
        { name: 'Transport', amount: 3500 },
        { name: 'Utilities', amount: 4500 },
      ],
    },
    'sky-tech': {
      income: 85000,
      expenses: 42000,
      netIncome: 43000,
      transactionCount: 8,
      topCategories: [
        { name: 'Software Development', amount: 35000 },
        { name: 'Consulting', amount: 25000 },
        { name: 'Office Supplies', amount: 7000 },
      ],
    },
    chama: {
      income: 250,
      expenses: 0,
      netIncome: 250,
      transactionCount: 1,
      topCategories: [
        { name: 'Weekly Contribution', amount: 250 },
      ],
    },
    'side-income': {
      income: 12000,
      expenses: 2000,
      netIncome: 10000,
      transactionCount: 4,
      topCategories: [
        { name: 'Freelance Design', amount: 8000 },
        { name: 'Photography', amount: 4000 },
      ],
    },
  };

  const mockPreviousWeekData = {
    personal: {
      income: 42000,
      expenses: 35000,
      netIncome: 7000,
    },
    'sky-tech': {
      income: 78000,
      expenses: 45000,
      netIncome: 33000,
    },
    chama: {
      income: 250,
      expenses: 0,
      netIncome: 250,
    },
    'side-income': {
      income: 15000,
      expenses: 3000,
      netIncome: 12000,
    },
  };

  const roles = ['personal', 'sky-tech', 'chama', 'side-income'] as const;
  const displayRoles = selectedRole ? [selectedRole as keyof typeof mockWeekData] : roles;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Role-Based Weekly Summaries</h2>
        <Badge variant="outline" className="text-sm">
          Week of {currentWeek}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayRoles.map((roleId) => (
          <RoleBasedSummary
            key={roleId}
            roleId={roleId}
            weekData={mockWeekData[roleId]}
            previousWeekData={mockPreviousWeekData[roleId]}
          />
        ))}
      </div>

      {/* Combined Summary */}
      {!selectedRole && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>All Roles Combined</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {new Intl.NumberFormat('en-KE', {
                    style: 'currency',
                    currency: 'KES',
                    minimumFractionDigits: 0,
                  }).format(
                    Object.values(mockWeekData).reduce((sum, data) => sum + data.income, 0)
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Total Income</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {new Intl.NumberFormat('en-KE', {
                    style: 'currency',
                    currency: 'KES',
                    minimumFractionDigits: 0,
                  }).format(
                    Object.values(mockWeekData).reduce((sum, data) => sum + data.expenses, 0)
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Total Expenses</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {new Intl.NumberFormat('en-KE', {
                    style: 'currency',
                    currency: 'KES',
                    minimumFractionDigits: 0,
                  }).format(
                    Object.values(mockWeekData).reduce((sum, data) => sum + data.netIncome, 0)
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Total Net Income</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {Object.values(mockWeekData).reduce((sum, data) => sum + data.transactionCount, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Transactions</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
