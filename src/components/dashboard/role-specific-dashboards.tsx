'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  Briefcase, 
  PiggyBank, 
  TrendingUp,
  BarChart3,
  Calendar,
  Target,
  Users,
  FileText,
  Settings,
  Plus,
  Eye,
  TrendingDown
} from 'lucide-react';
import { getRoleCardClasses, getRoleBadgeClasses } from '@/lib/role-colors';

interface RoleSpecificDashboardProps {
  roleId: string;
  weekData: {
    income: number;
    expenses: number;
    netIncome: number;
    transactions: number;
    topCategories: Array<{ name: string; amount: number; count: number }>;
    recentTransactions: Array<{
      id: string;
      description: string;
      amount: number;
      type: 'INCOME' | 'EXPENSE';
      date: string;
      category: string;
    }>;
  };
  monthlyData?: {
    income: number;
    expenses: number;
    netIncome: number;
    transactions: number;
  };
  yearlyData?: {
    income: number;
    expenses: number;
    netIncome: number;
    transactions: number;
  };
}

export function RoleSpecificDashboard({ roleId, weekData, monthlyData, yearlyData }: RoleSpecificDashboardProps) {
  const roleConfig = getRoleCardClasses(roleId as any);
  const badgeConfig = getRoleBadgeClasses(roleId as any);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getRoleIcon = (roleId: string) => {
    switch (roleId) {
      case 'personal':
        return <DollarSign className="h-6 w-6" />;
      case 'sky-tech':
        return <Briefcase className="h-6 w-6" />;
      case 'chama':
        return <PiggyBank className="h-6 w-6" />;
      case 'side-income':
        return <TrendingUp className="h-6 w-6" />;
      default:
        return <BarChart3 className="h-6 w-6" />;
    }
  };

  const getRoleName = (roleId: string) => {
    switch (roleId) {
      case 'personal':
        return 'Personal Finance';
      case 'sky-tech':
        return 'Sky Tech Solutions';
      case 'chama':
        return 'Chama Group';
      case 'side-income':
        return 'Side Income';
      default:
        return 'Unknown Role';
    }
  };

  const getRoleDescription = (roleId: string) => {
    switch (roleId) {
      case 'personal':
        return 'Track your personal income, expenses, and savings goals';
      case 'sky-tech':
        return 'Monitor business performance, projects, and client relationships';
      case 'chama':
        return 'Manage group contributions, track progress, and build financial security';
      case 'side-income':
        return 'Track additional income streams and maximize earning potential';
      default:
        return 'Manage your financial activities';
    }
  };

  const getRoleSpecificMetrics = () => {
    switch (roleId) {
      case 'personal':
        return {
          primary: 'Savings Rate',
          primaryValue: weekData.income > 0 ? Math.round((weekData.netIncome / weekData.income) * 100) : 0,
          primaryUnit: '%',
          secondary: 'Average Transaction',
          secondaryValue: weekData.transactions > 0 ? weekData.income / weekData.transactions : 0,
          secondaryUnit: 'KES'
        };
      case 'sky-tech':
        return {
          primary: 'Profit Margin',
          primaryValue: weekData.income > 0 ? Math.round((weekData.netIncome / weekData.income) * 100) : 0,
          primaryUnit: '%',
          secondary: 'Average Project',
          secondaryValue: weekData.transactions > 0 ? weekData.income / weekData.transactions : 0,
          secondaryUnit: 'KES'
        };
      case 'chama':
        return {
          primary: 'Weekly Target',
          primaryValue: Math.round((weekData.income / 250) * 100),
          primaryUnit: '%',
          secondary: 'Member Count',
          secondaryValue: 12, // Mock data
          secondaryUnit: 'members'
        };
      case 'side-income':
        return {
          primary: 'Growth Rate',
          primaryValue: 15.5, // Mock data
          primaryUnit: '%',
          secondary: 'Avg per Source',
          secondaryValue: weekData.transactions > 0 ? weekData.income / weekData.transactions : 0,
          secondaryUnit: 'KES'
        };
      default:
        return {
          primary: 'Efficiency',
          primaryValue: 85,
          primaryUnit: '%',
          secondary: 'Transactions',
          secondaryValue: weekData.transactions,
          secondaryUnit: 'count'
        };
    }
  };

  const metrics = getRoleSpecificMetrics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-lg ${roleConfig}`}>
            {getRoleIcon(roleId)}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{getRoleName(roleId)}</h1>
            <p className="text-muted-foreground">{getRoleDescription(roleId)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={badgeConfig}>
            {weekData.transactions} transactions this week
          </Badge>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Income</span>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(weekData.income)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              This week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Expenses</span>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(weekData.expenses)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              This week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Net Income</span>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </div>
            <div className={`text-2xl font-bold ${
              weekData.netIncome >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(weekData.netIncome)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              This week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">{metrics.primary}</span>
              <Target className="h-4 w-4 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {metrics.primaryValue}{metrics.primaryUnit}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Performance metric
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role-Specific Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Charts and Analytics */}
        <div className="space-y-6">
          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Progress Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Weekly Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Weekly Performance</span>
                  <span className="font-medium">
                    {weekData.netIncome >= 0 ? '+' : ''}{formatCurrency(weekData.netIncome)}
                  </span>
                </div>
                <Progress 
                  value={Math.min(100, Math.abs((weekData.netIncome / Math.max(weekData.income, 1)) * 100))} 
                  className="h-2"
                />
              </div>

              {/* Monthly Progress */}
              {monthlyData && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Monthly Performance</span>
                    <span className="font-medium">
                      {monthlyData.netIncome >= 0 ? '+' : ''}{formatCurrency(monthlyData.netIncome)}
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(100, Math.abs((monthlyData.netIncome / Math.max(monthlyData.income, 1)) * 100))} 
                    className="h-2"
                  />
                </div>
              )}

              {/* Yearly Progress */}
              {yearlyData && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Yearly Performance</span>
                    <span className="font-medium">
                      {yearlyData.netIncome >= 0 ? '+' : ''}{formatCurrency(yearlyData.netIncome)}
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(100, Math.abs((yearlyData.netIncome / Math.max(yearlyData.income, 1)) * 100))} 
                    className="h-2"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Top Categories</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weekData.topCategories.slice(0, 5).map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {category.count} transactions
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(category.amount)}</div>
                      <div className="text-xs text-muted-foreground">
                        {((category.amount / weekData.expenses) * 100).toFixed(1)}% of expenses
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Recent Activity and Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button className="h-20 flex-col">
                  <Plus className="h-6 w-6 mb-2" />
                  <span>Add Transaction</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Eye className="h-6 w-6 mb-2" />
                  <span>View Reports</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <FileText className="h-6 w-6 mb-2" />
                  <span>Export Data</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Calendar className="h-6 w-6 mb-2" />
                  <span>Schedule Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Recent Transactions</span>
                </div>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weekData.recentTransactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        transaction.type === 'INCOME' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <div className="font-medium text-sm">{transaction.description}</div>
                        <div className="text-xs text-muted-foreground">
                          {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className={`font-medium ${
                      transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Role-Specific Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Role Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roleId === 'personal' && (
                  <>
                    <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div className="font-medium text-sm text-blue-800 dark:text-blue-200 mb-1">
                        💡 Savings Tip
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-300">
                        You're saving {metrics.primaryValue}% of your income. Consider increasing this to 20% for better financial security.
                      </div>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <div className="font-medium text-sm text-green-800 dark:text-green-200 mb-1">
                        📈 Positive Trend
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-300">
                        Your expenses are {weekData.expenses < monthlyData!.expenses / 4 ? 'below' : 'above'} your monthly average.
                      </div>
                    </div>
                  </>
                )}

                {roleId === 'sky-tech' && (
                  <>
                    <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                      <div className="font-medium text-sm text-purple-800 dark:text-purple-200 mb-1">
                        🚀 Business Health
                      </div>
                      <div className="text-xs text-purple-600 dark:text-purple-300">
                        Your profit margin is {metrics.primaryValue}%. Keep it above 20% for sustainable growth.
                      </div>
                    </div>
                    <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                      <div className="font-medium text-sm text-orange-800 dark:text-orange-200 mb-1">
                        📊 Client Focus
                      </div>
                      <div className="text-xs text-orange-600 dark:text-orange-300">
                        Average project value is {formatCurrency(metrics.secondaryValue)}. Consider focusing on higher-value clients.
                      </div>
                    </div>
                  </>
                )}

                {roleId === 'chama' && (
                  <>
                    <div className="p-3 bg-pink-50 dark:bg-pink-950 rounded-lg">
                      <div className="font-medium text-sm text-pink-800 dark:text-pink-200 mb-1">
                        🎯 Target Progress
                      </div>
                      <div className="text-xs text-pink-600 dark:text-pink-300">
                        You're at {metrics.primaryValue}% of your weekly target. Keep up the great work!
                      </div>
                    </div>
                    <div className="p-3 bg-teal-50 dark:bg-teal-950 rounded-lg">
                      <div className="font-medium text-sm text-teal-800 dark:text-teal-200 mb-1">
                        👥 Group Strength
                      </div>
                      <div className="text-xs text-teal-600 dark:text-teal-300">
                        {metrics.secondaryValue} active members contributing regularly. Strong group participation!
                      </div>
                    </div>
                  </>
                )}

                {roleId === 'side-income' && (
                  <>
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-950 rounded-lg">
                      <div className="font-medium text-sm text-indigo-800 dark:text-indigo-200 mb-1">
                        📈 Growth Opportunity
                      </div>
                      <div className="text-xs text-indigo-600 dark:text-indigo-300">
                        Your side income is growing at {metrics.primaryValue}% monthly. Consider diversifying income sources.
                      </div>
                    </div>
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                      <div className="font-medium text-sm text-yellow-800 dark:text-yellow-200 mb-1">
                        ⚡ Efficiency Tip
                      </div>
                      <div className="text-xs text-yellow-600 dark:text-yellow-300">
                        Average per source: {formatCurrency(metrics.secondaryValue)}. Focus on highest-yielding activities.
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Mock data for demonstration
export function useRoleSpecificDashboardData(roleId: string): RoleSpecificDashboardProps {
  const mockData: Record<string, RoleSpecificDashboardProps> = {
    personal: {
      roleId: 'personal',
      weekData: {
        income: 45000,
        expenses: 32000,
        netIncome: 13000,
        transactions: 15,
        topCategories: [
          { name: 'Groceries', amount: 8000, count: 5 },
          { name: 'Transport', amount: 3500, count: 8 },
          { name: 'Utilities', amount: 4500, count: 3 },
          { name: 'Entertainment', amount: 2000, count: 4 },
          { name: 'Healthcare', amount: 3000, count: 2 },
        ],
        recentTransactions: [
          {
            id: '1',
            description: 'Monthly Salary',
            amount: 40000,
            type: 'INCOME' as const,
            date: '2024-01-29',
            category: 'Salary'
          },
          {
            id: '2',
            description: 'Grocery Shopping',
            amount: 2500,
            type: 'EXPENSE' as const,
            date: '2024-01-28',
            category: 'Groceries'
          },
          {
            id: '3',
            description: 'Electric Bill',
            amount: 1500,
            type: 'EXPENSE' as const,
            date: '2024-01-27',
            category: 'Utilities'
          },
        ]
      },
      monthlyData: {
        income: 180000,
        expenses: 128000,
        netIncome: 52000,
        transactions: 60
      },
      yearlyData: {
        income: 2160000,
        expenses: 1536000,
        netIncome: 624000,
        transactions: 720
      }
    },
    'sky-tech': {
      roleId: 'sky-tech',
      weekData: {
        income: 85000,
        expenses: 42000,
        netIncome: 43000,
        transactions: 8,
        topCategories: [
          { name: 'Software Development', amount: 35000, count: 2 },
          { name: 'Consulting', amount: 25000, count: 3 },
          { name: 'Office Rent', amount: 15000, count: 1 },
          { name: 'Software Licenses', amount: 5000, count: 4 },
          { name: 'Marketing', amount: 7000, count: 2 },
        ],
        recentTransactions: [
          {
            id: '1',
            description: 'Client Project - Web App',
            amount: 35000,
            type: 'INCOME' as const,
            date: '2024-01-29',
            category: 'Software Development'
          },
          {
            id: '2',
            description: 'Office Rent Payment',
            amount: 15000,
            type: 'EXPENSE' as const,
            date: '2024-01-28',
            category: 'Office Rent'
          },
          {
            id: '3',
            description: 'Consulting Services',
            amount: 15000,
            type: 'INCOME' as const,
            date: '2024-01-27',
            category: 'Consulting'
          },
        ]
      },
      monthlyData: {
        income: 340000,
        expenses: 168000,
        netIncome: 172000,
        transactions: 32
      },
      yearlyData: {
        income: 4080000,
        expenses: 2016000,
        netIncome: 2064000,
        transactions: 384
      }
    },
    chama: {
      roleId: 'chama',
      weekData: {
        income: 250,
        expenses: 0,
        netIncome: 250,
        transactions: 1,
        topCategories: [
          { name: 'Weekly Contribution', amount: 250, count: 1 },
        ],
        recentTransactions: [
          {
            id: '1',
            description: 'Weekly Chama Contribution',
            amount: 250,
            type: 'INCOME' as const,
            date: '2024-01-30',
            category: 'Contribution'
          },
        ]
      },
      monthlyData: {
        income: 1000,
        expenses: 0,
        netIncome: 1000,
        transactions: 4
      },
      yearlyData: {
        income: 12000,
        expenses: 0,
        netIncome: 12000,
        transactions: 48
      }
    },
    'side-income': {
      roleId: 'side-income',
      weekData: {
        income: 12000,
        expenses: 2000,
        netIncome: 10000,
        transactions: 4,
        topCategories: [
          { name: 'Freelance Design', amount: 8000, count: 2 },
          { name: 'Photography', amount: 4000, count: 1 },
          { name: 'Equipment', amount: 2000, count: 1 },
        ],
        recentTransactions: [
          {
            id: '1',
            description: 'Logo Design Project',
            amount: 5000,
            type: 'INCOME' as const,
            date: '2024-01-29',
            category: 'Freelance Design'
          },
          {
            id: '2',
            description: 'Camera Equipment',
            amount: 2000,
            type: 'EXPENSE' as const,
            date: '2024-01-28',
            category: 'Equipment'
          },
        ]
      },
      monthlyData: {
        income: 48000,
        expenses: 8000,
        netIncome: 40000,
        transactions: 16
      },
      yearlyData: {
        income: 576000,
        expenses: 96000,
        netIncome: 480000,
        transactions: 192
      }
    }
  };

  return mockData[roleId as keyof typeof mockData];
}
