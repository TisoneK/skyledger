'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp,
  TrendingDown,
  ArrowLeft, 
  ArrowRight,
  BarChart3,
  DollarSign,
  PiggyBank,
  Briefcase,
  Minus,
  Calendar
} from 'lucide-react';
import { RoleIcon } from '@/components/ui/role-icon';
import { getRoleCardClasses } from '@/lib/role-colors';

interface WeekData {
  week: string;
  income: number;
  expenses: number;
  netIncome: number;
  transactions: number;
}

interface ComparisonData {
  currentWeek: WeekData;
  previousWeek: WeekData;
  fourWeekAverage: WeekData;
  roleData: {
    [roleId: string]: {
      currentWeek: WeekData;
      previousWeek: WeekData;
      change: {
        income: number;
        expenses: number;
        netIncome: number;
      };
    };
  };
}

interface WeekOverWeekComparisonProps {
  data: ComparisonData;
  onWeekChange?: (direction: 'previous' | 'next') => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
}

export function WeekOverWeekComparison({ 
  data, 
  onWeekChange, 
  canGoPrevious = true, 
  canGoNext = false 
}: WeekOverWeekComparisonProps) {
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

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / Math.abs(previous)) * 100;
  };

  const overallIncomeChange = calculateChange(data.currentWeek.income, data.previousWeek.income);
  const overallExpenseChange = calculateChange(data.currentWeek.expenses, data.previousWeek.expenses);
  const overallNetIncomeChange = calculateChange(data.currentWeek.netIncome, data.previousWeek.netIncome);

  const getRoleIcon = (roleId: string) => {
    // Map role names to RoleIcon types
    const getRoleIconType = (roleName: string) => {
      switch (roleName) {
        case 'personal': return 'personal';
        case 'sky-tech': return 'sky-tech';
        case 'chama': return 'chama';
        case 'side-income': return 'side-income';
        default: return 'personal';
      }
    };

    return (
      <RoleIcon 
        type={getRoleIconType(roleId)}
        context="card"
        className="card"
      />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">Week-over-Week Comparison</h2>
          <Badge variant="outline" className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{data.currentWeek.week}</span>
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onWeekChange?.('previous')}
            disabled={!canGoPrevious}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onWeekChange?.('next')}
            disabled={!canGoNext}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Overall Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Overall Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Income Comparison */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Income</span>
                <div className="flex items-center space-x-2">
                  {getChangeIcon(overallIncomeChange)}
                  <span className={`text-sm font-medium ${getChangeColor(overallIncomeChange)}`}>
                    {formatPercentage(overallIncomeChange)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">This Week</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(data.currentWeek.income)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Week</span>
                  <span className="font-medium">
                    {formatCurrency(data.previousWeek.income)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">4-Week Avg</span>
                  <span className="font-medium">
                    {formatCurrency(data.fourWeekAverage.income)}
                  </span>
                </div>
              </div>
            </div>

            {/* Expenses Comparison */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Expenses</span>
                <div className="flex items-center space-x-2">
                  {getChangeIcon(-overallExpenseChange)}
                  <span className={`text-sm font-medium ${getChangeColor(-overallExpenseChange)}`}>
                    {formatPercentage(overallExpenseChange)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">This Week</span>
                  <span className="font-medium text-red-600">
                    {formatCurrency(data.currentWeek.expenses)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Week</span>
                  <span className="font-medium">
                    {formatCurrency(data.previousWeek.expenses)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">4-Week Avg</span>
                  <span className="font-medium">
                    {formatCurrency(data.fourWeekAverage.expenses)}
                  </span>
                </div>
              </div>
            </div>

            {/* Net Income Comparison */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Net Income</span>
                <div className="flex items-center space-x-2">
                  {getChangeIcon(overallNetIncomeChange)}
                  <span className={`text-sm font-medium ${getChangeColor(overallNetIncomeChange)}`}>
                    {formatPercentage(overallNetIncomeChange)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">This Week</span>
                  <span className={`font-medium ${
                    data.currentWeek.netIncome >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(data.currentWeek.netIncome)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Week</span>
                  <span className={`font-medium ${
                    data.previousWeek.netIncome >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(data.previousWeek.netIncome)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">4-Week Avg</span>
                  <span className={`font-medium ${
                    data.fourWeekAverage.netIncome >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(data.fourWeekAverage.netIncome)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Count */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Transaction Count</span>
              <div className="flex items-center space-x-2">
                {getChangeIcon(
                  calculateChange(data.currentWeek.transactions, data.previousWeek.transactions)
                )}
                <span className={`text-sm font-medium ${getChangeColor(
                  calculateChange(data.currentWeek.transactions, data.previousWeek.transactions)
                )}`}>
                  {formatPercentage(
                    calculateChange(data.currentWeek.transactions, data.previousWeek.transactions)
                  )}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-2">
              <div className="text-center">
                <div className="text-lg font-bold">{data.currentWeek.transactions}</div>
                <div className="text-xs text-muted-foreground">This Week</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{data.previousWeek.transactions}</div>
                <div className="text-xs text-muted-foreground">Last Week</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{data.fourWeekAverage.transactions}</div>
                <div className="text-xs text-muted-foreground">4-Week Avg</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role-Specific Comparisons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(data.roleData).map(([roleId, roleData]) => {
          const roleConfig = getRoleCardClasses(roleId as any);
          
          return (
            <Card key={roleId} className={roleConfig}>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  {getRoleIcon(roleId)}
                  <CardTitle className="text-lg capitalize">
                    {roleId.replace('-', ' ')}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Income */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Income</span>
                  <div className="flex items-center space-x-1">
                    {getChangeIcon(roleData.change.income)}
                    <span className={`text-xs font-medium ${getChangeColor(roleData.change.income)}`}>
                      {formatPercentage(roleData.change.income)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between text-xs">
                  <span>{formatCurrency(roleData.currentWeek.income)}</span>
                  <span className="text-muted-foreground">
                    {formatCurrency(roleData.previousWeek.income)}
                  </span>
                </div>

                {/* Expenses */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Expenses</span>
                  <div className="flex items-center space-x-1">
                    {getChangeIcon(-roleData.change.expenses)}
                    <span className={`text-xs font-medium ${getChangeColor(-roleData.change.expenses)}`}>
                      {formatPercentage(roleData.change.expenses)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-red-600">
                    {formatCurrency(roleData.currentWeek.expenses)}
                  </span>
                  <span className="text-muted-foreground">
                    {formatCurrency(roleData.previousWeek.expenses)}
                  </span>
                </div>

                {/* Net Income */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Net</span>
                  <div className="flex items-center space-x-1">
                    {getChangeIcon(roleData.change.netIncome)}
                    <span className={`text-xs font-medium ${getChangeColor(roleData.change.netIncome)}`}>
                      {formatPercentage(roleData.change.netIncome)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between text-xs">
                  <span className={
                    roleData.currentWeek.netIncome >= 0 ? 'text-green-600' : 'text-red-600'
                  }>
                    {formatCurrency(roleData.currentWeek.netIncome)}
                  </span>
                  <span className="text-muted-foreground">
                    {formatCurrency(roleData.previousWeek.netIncome)}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-green-600">Positive Trends</h4>
              <ul className="text-sm space-y-1">
                {overallIncomeChange > 0 && (
                  <li>• Income increased by {formatPercentage(overallIncomeChange)}</li>
                )}
                {overallExpenseChange < 0 && (
                  <li>• Expenses decreased by {formatPercentage(Math.abs(overallExpenseChange))}</li>
                )}
                {overallNetIncomeChange > 0 && (
                  <li>• Net income improved by {formatPercentage(overallNetIncomeChange)}</li>
                )}
                {overallIncomeChange <= 0 && overallExpenseChange >= 0 && overallNetIncomeChange <= 0 && (
                  <li>• No significant positive changes this week</li>
                )}
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-red-600">Areas for Attention</h4>
              <ul className="text-sm space-y-1">
                {overallIncomeChange < 0 && (
                  <li>• Income decreased by {formatPercentage(Math.abs(overallIncomeChange))}</li>
                )}
                {overallExpenseChange > 0 && (
                  <li>• Expenses increased by {formatPercentage(overallExpenseChange)}</li>
                )}
                {overallNetIncomeChange < 0 && (
                  <li>• Net income declined by {formatPercentage(Math.abs(overallNetIncomeChange))}</li>
                )}
                {overallIncomeChange >= 0 && overallExpenseChange <= 0 && overallNetIncomeChange >= 0 && (
                  <li>• No significant concerns this week</li>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Mock data for demonstration
export function useWeekOverWeekComparisonData(): ComparisonData {
  const mockData: ComparisonData = {
    currentWeek: {
      week: '2024-W05',
      income: 142250,
      expenses: 74000,
      netIncome: 68250,
      transactions: 28,
    },
    previousWeek: {
      week: '2024-W04',
      income: 135000,
      expenses: 78000,
      netIncome: 57000,
      transactions: 25,
    },
    fourWeekAverage: {
      week: 'Average',
      income: 138000,
      expenses: 76000,
      netIncome: 62000,
      transactions: 26,
    },
    roleData: {
      personal: {
        currentWeek: {
          week: '2024-W05',
          income: 45000,
          expenses: 32000,
          netIncome: 13000,
          transactions: 15,
        },
        previousWeek: {
          week: '2024-W04',
          income: 42000,
          expenses: 35000,
          netIncome: 7000,
          transactions: 12,
        },
        change: {
          income: 7.1,
          expenses: -8.6,
          netIncome: 85.7,
        },
      },
      'sky-tech': {
        currentWeek: {
          week: '2024-W05',
          income: 85000,
          expenses: 42000,
          netIncome: 43000,
          transactions: 8,
        },
        previousWeek: {
          week: '2024-W04',
          income: 78000,
          expenses: 45000,
          netIncome: 33000,
          transactions: 7,
        },
        change: {
          income: 9.0,
          expenses: -6.7,
          netIncome: 30.3,
        },
      },
      chama: {
        currentWeek: {
          week: '2024-W05',
          income: 250,
          expenses: 0,
          netIncome: 250,
          transactions: 1,
        },
        previousWeek: {
          week: '2024-W04',
          income: 250,
          expenses: 0,
          netIncome: 250,
          transactions: 1,
        },
        change: {
          income: 0.0,
          expenses: 0.0,
          netIncome: 0.0,
        },
      },
      'side-income': {
        currentWeek: {
          week: '2024-W05',
          income: 12000,
          expenses: 2000,
          netIncome: 10000,
          transactions: 4,
        },
        previousWeek: {
          week: '2024-W04',
          income: 15000,
          expenses: 3000,
          netIncome: 12000,
          transactions: 5,
        },
        change: {
          income: -20.0,
          expenses: -33.3,
          netIncome: -16.7,
        },
      },
    },
  };

  return mockData;
}
