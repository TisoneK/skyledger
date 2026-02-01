'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  PieChart as RechartsPieChart,
  Cell,
  LineChart,
  LineChart as RechartsLineChart,
  Legend,
  Area,
  AreaChart as RechartsAreaChart,
} from 'recharts';
import { 
  DollarSign, 
  Briefcase, 
  PiggyBank, 
  TrendingUp,
  BarChart3,
  Target,
  Calendar,
  PieChart as PieChartIcon
} from 'lucide-react';
import { getRoleCardClasses } from '@/lib/role-colors';

interface RoleSpecificVisualizationProps {
  roleId: string;
  data: {
    monthlyData: Array<{
      month: string;
      income: number;
      expenses: number;
      netIncome: number;
      transactions: number;
    }>;
    categoryBreakdown: Array<{
      category: string;
      amount: number;
      percentage: number;
      count: number;
    }>;
    weeklyTrends: Array<{
      week: string;
      income: number;
      expenses: number;
      netIncome: number;
    }>;
    yearlyComparison: Array<{
      year: number;
      income: number;
      expenses: number;
      netIncome: number;
    }>;
  };
}

export function RoleSpecificVisualization({ roleId, data }: RoleSpecificVisualizationProps) {
  const roleConfig = getRoleCardClasses(roleId as any);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

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

  // Custom colors for each role
  const getRoleColors = (roleId: string) => {
    switch (roleId) {
      case 'personal':
        return {
          primary: '#10b981',
          secondary: '#059669',
          tertiary: '#047857',
          income: '#22c55e',
          expenses: '#ef4444',
          netIncome: '#10b981',
        };
      case 'sky-tech':
        return {
          primary: '#3b82f6',
          secondary: '#2563eb',
          tertiary: '#1d4ed8',
          income: '#3b82f6',
          expenses: '#ef4444',
          netIncome: '#3b82f6',
        };
      case 'chama':
        return {
          primary: '#8b5cf6',
          secondary: '#6366f1',
          tertiary: '#4f46e5',
          income: '#8b5cf6',
          expenses: '#ef4444',
          netIncome: '#8b5cf6',
        };
      case 'side-income':
        return {
          primary: '#f59e0b',
          secondary: '#d97706',
          tertiary: '#b45309',
          income: '#f59e0b',
          expenses: '#ef4444',
          netIncome: '#f59e0b',
        };
      default:
        return {
          primary: '#6b7280',
          secondary: '#4b5563',
          tertiary: '#374151',
          income: '#22c55e',
          expenses: '#ef4444',
          netIncome: '#22c55e',
        };
    }
  };

  const colors = getRoleColors(roleId);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border p-2 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex justify-between">
                <span>{entry.name}:</span>
                <span className="font-medium">{formatCurrency(entry.value)}</span>
              </div>
            ))}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${roleConfig}`}>
            {getRoleIcon(roleId)}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{getRoleName(roleId)} Analytics</h2>
            <p className="text-muted-foreground">
              Financial performance visualizations and insights
            </p>
          </div>
        </div>
        <Badge variant="outline">
          {data.monthlyData.length} months of data
        </Badge>
      </div>

      {/* Monthly Income vs Expenses Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart className="h-5 w-5" />
            <span>Monthly Income vs Expenses</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart data={data.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="income" fill={colors.income} />
              <Bar dataKey="expenses" fill={colors.expenses} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Net Income Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Net Income Trend</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsAreaChart data={data.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="netIncome"
                stroke={colors.netIncome}
                fill={colors.netIncome}
                fillOpacity={0.3}
              />
            </RechartsAreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChartIcon className="h-5 w-5" />
            <span>Category Breakdown</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={data.categoryBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${formatPercentage(percentage)}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
              >
                {data.categoryBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={Object.values(colors)[index % Object.values(colors).length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.categoryBreakdown.slice(0, 4).map((category, index) => (
              <div key={index} className="text-center">
                <div className="text-sm font-medium">{category.category}</div>
                <div className="text-xs text-muted-foreground">{formatCurrency(category.amount)}</div>
                <div className="text-xs text-muted-foreground">{formatPercentage(category.percentage)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Weekly Performance Trends</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsLineChart data={data.weeklyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="income" stroke={colors.income} strokeWidth={2} />
              <Line type="monotone" dataKey="expenses" stroke={colors.expenses} strokeWidth={2} />
              <Line type="monotone" dataKey="netIncome" stroke={colors.netIncome} strokeWidth={3} />
            </RechartsLineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Year-over-Year Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Year-over-Year Comparison</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart data={data.yearlyComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="income" fill={colors.income} />
              <Bar dataKey="expenses" fill={colors.expenses} />
              <Bar dataKey="netIncome" fill={colors.netIncome} />
            </RechartsBarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {data.yearlyComparison.slice(-3).map((year, index) => (
              <div key={index} className="text-center">
                <div className="text-sm font-medium">{year.year}</div>
                <div className="text-xs text-muted-foreground">
                  Net: {formatCurrency(year.netIncome)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Growth: {year.netIncome > 0 ? '+' : ''}{formatPercentage(
                    index === 0 ? 0 : ((year.netIncome - data.yearlyComparison[index + 1].netIncome) / Math.abs(data.yearlyComparison[index + 1].netIncome)) * 100
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Role-Specific Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Key Performance Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Income */}
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(data.monthlyData.reduce((sum, d) => sum + d.income, 0))}
              </div>
              <div className="text-sm text-muted-foreground">Total Income</div>
              <div className="text-xs text-muted-foreground">
                {data.monthlyData.length} months
              </div>
            </div>

            {/* Total Expenses */}
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(data.monthlyData.reduce((sum, d) => sum + d.expenses, 0))}
              </div>
              <div className="text-sm text-muted-foreground">Total Expenses</div>
              <div className="text-xs text-muted-foreground">
                {data.monthlyData.length} months
              </div>
            </div>

            {/* Net Income */}
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className={`text-2xl font-bold ${
                data.monthlyData.reduce((sum, d) => sum + d.netIncome, 0) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(data.monthlyData.reduce((sum, d) => sum + d.netIncome, 0))}
              </div>
              <div className="text-sm text-muted-foreground">Net Income</div>
              <div className="text-xs text-muted-foreground">
                {data.monthlyData.length} months
              </div>
            </div>

            {/* Average Transaction */}
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(
                  data.monthlyData.reduce((sum, d) => sum + d.income, 0) / data.monthlyData.reduce((sum, d) => sum + d.transactions, 0)
                )}
              </div>
              <div className="text-sm text-muted-foreground">Avg per Transaction</div>
              <div className="text-xs text-muted-foreground">
                {Math.round(data.monthlyData.reduce((sum, d) => sum + d.transactions, 0) / data.monthlyData.length)} per month
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Mock data for demonstration
export function useRoleSpecificVisualizationData(roleId: string): RoleSpecificVisualizationProps {
  const mockData = {
    personal: {
      monthlyData: [
        { month: 'Jan', income: 45000, expenses: 32000, netIncome: 13000, transactions: 15 },
        { month: 'Feb', income: 42000, expenses: 35000, netIncome: 7000, transactions: 12 },
        { month: 'Mar', income: 48000, expenses: 30000, netIncome: 18000, transactions: 18 },
        { month: 'Apr', income: 46000, expenses: 31000, netIncome: 15000, transactions: 14 },
        { month: 'May', income: 50000, expenses: 33000, netIncome: 17000, transactions: 16 },
        { month: 'Jun', income: 52000, expenses: 34000, netIncome: 18000, transactions: 20 },
      ],
      categoryBreakdown: [
        { category: 'Housing', amount: 12000, percentage: 37.5, count: 1 },
        { category: 'Food', amount: 8000, percentage: 25.0, count: 15 },
        { category: 'Transport', amount: 4000, percentage: 12.5, count: 8 },
        { category: 'Utilities', amount: 3000, percentage: 9.4, count: 3 },
        { category: 'Entertainment', amount: 2000, percentage: 6.3, count: 4 },
        { category: 'Healthcare', amount: 3000, percentage: 9.4, count: 2 },
      ],
      weeklyTrends: [
        { week: 'W1', income: 11250, expenses: 8000, netIncome: 3250 },
        { week: 'W2', income: 10500, expenses: 8750, netIncome: 1750 },
        { week: 'W3', income: 12000, expenses: 7500, netIncome: 4500 },
        { week: 'W4', income: 11500, expenses: 7750, netIncome: 3750 },
      ],
      yearlyComparison: [
        { year: 2021, income: 480000, expenses: 384000, netIncome: 96000 },
        { year: 2022, income: 540000, expenses: 432000, netIncome: 108000 },
        { year: 2023, income: 600000, expenses: 480000, netIncome: 120000 },
        { year: 2024, income: 624000, expenses: 499200, netIncome: 124800 },
      ]
    },
    'sky-tech': {
      monthlyData: [
        { month: 'Jan', income: 85000, expenses: 42000, netIncome: 43000, transactions: 8 },
        { month: 'Feb', income: 92000, expenses: 45000, netIncome: 47000, transactions: 10 },
        { month: 'Mar', income: 88000, expenses: 40000, netIncome: 48000, transactions: 7 },
        { month: 'Apr', income: 95000, expenses: 43000, netIncome: 52000, transactions: 9 },
        { month: 'May', income: 98000, expenses: 46000, netIncome: 52000, transactions: 11 },
        { month: 'Jun', income: 102000, expenses: 48000, netIncome: 54000, transactions: 12 },
      ],
      categoryBreakdown: [
        { category: 'Software Development', amount: 35000, percentage: 41.2, count: 2 },
        { category: 'Consulting', amount: 25000, percentage: 29.4, count: 3 },
        { category: 'Office Rent', amount: 15000, percentage: 17.6, count: 1 },
        { category: 'Marketing', amount: 7000, percentage: 8.2, count: 2 },
        { category: 'Software Licenses', amount: 5000, percentage: 5.9, count: 4 },
        { category: 'Equipment', amount: 3000, percentage: 3.5, count: 2 },
      ],
      weeklyTrends: [
        { week: 'W1', income: 21250, expenses: 10500, netIncome: 10750 },
        { week: 'W2', income: 23000, expenses: 11250, netIncome: 11750 },
        { week: 'W3', income: 22000, expenses: 10000, netIncome: 12000 },
        { week: 'W4', income: 23750, expenses: 11500, netIncome: 12250 },
      ],
      yearlyComparison: [
        { year: 2021, income: 960000, expenses: 504000, netIncome: 456000 },
        { year: 2022, income: 1104000, expenses: 540000, netIncome: 564000 },
        { year: 2023, income: 1056000, expenses: 480000, netIncome: 576000 },
        { year: 2024, income: 1224000, expenses: 576000, netIncome: 648000 },
      ]
    },
    chama: {
      monthlyData: [
        { month: 'Jan', income: 1000, expenses: 0, netIncome: 1000, transactions: 4 },
        { month: 'Feb', income: 1000, expenses: 0, netIncome: 1000, transactions: 4 },
        { month: 'Mar', income: 1000, expenses: 0, netIncome: 1000, transactions: 4 },
        { month: 'Apr', income: 1000, expenses: 0, netIncome: 1000, transactions: 4 },
        { month: 'May', income: 1000, expenses: 0, netIncome: 1000, transactions: 4 },
        { month: 'Jun', income: 1000, expenses: 0, netIncome: 1000, transactions: 4 },
      ],
      categoryBreakdown: [
        { category: 'Weekly Contributions', amount: 1000, percentage: 100.0, count: 4 },
      ],
      weeklyTrends: [
        { week: 'W1', income: 250, expenses: 0, netIncome: 250 },
        { week: 'W2', income: 250, expenses: 0, netIncome: 250 },
        { week: 'W3', income: 250, expenses: 0, netIncome: 250 },
        { week: 'W4', income: 250, expenses: 0, netIncome: 250 },
      ],
      yearlyComparison: [
        { year: 2021, income: 12000, expenses: 0, netIncome: 12000 },
        { year: 2022, income: 12000, expenses: 0, netIncome: 12000 },
        { year: 2023, income: 12000, expenses: 0, netIncome: 12000 },
        { year: 2024, income: 12000, expenses: 0, netIncome: 12000 },
      ]
    },
    'side-income': {
      monthlyData: [
        { month: 'Jan', income: 12000, expenses: 2000, netIncome: 10000, transactions: 4 },
        { month: 'Feb', income: 15000, expenses: 3000, netIncome: 12000, transactions: 6 },
        { month: 'Mar', income: 13000, expenses: 2500, netIncome: 10500, transactions: 5 },
        { month: 'Apr', income: 11000, expenses: 1500, netIncome: 9500, transactions: 3 },
        { month: 'May', income: 14000, expenses: 2000, netIncome: 12000, transactions: 7 },
        { month: 'Jun', income: 16000, expenses: 2500, netIncome: 13500, transactions: 8 },
      ],
      categoryBreakdown: [
        { category: 'Freelance Design', amount: 8000, percentage: 66.7, count: 2 },
        { category: 'Photography', amount: 4000, percentage: 33.3, count: 1 },
      ],
      weeklyTrends: [
        { week: 'W1', income: 3000, expenses: 500, netIncome: 2500 },
        { week: 'W2', income: 3750, expenses: 750, netIncome: 3000 },
        { week: 'W3', week: 'W3', income: 3250, expenses: 625, netIncome: 2625 },
        { week: 'W4', income: 4000, expenses: 500, netIncome: 3500 },
      ],
      yearlyComparison: [
        { year: 2021, income: 144000, expenses: 24000, netIncome: 120000 },
        { year: 2022, income: 168000, expenses: 30000, netIncome: 138000 },
        { year: 2023, income: 156000, expenses: 30000, netIncome: 126000 },
        { year: 2024, income: 192000, expenses: 30000, netIncome: 162000 },
      ]
    }
  };

  return mockData[roleId as keyof typeof mockData];
}
