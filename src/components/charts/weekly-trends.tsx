'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useFinancialStore } from '@/stores/financial-store';
import { getRoleColor } from '@/lib/role-colors';
import { cn } from '@/lib/utils';

export function WeeklyTrends() {
  // Mock data for demonstration - in real implementation, this would come from the store
  const mockData = [
    { week: 'W1', income: 10000, expenses: 7500, net: 2500 },
    { week: 'W2', income: 12000, expenses: 8000, net: 4000 },
    { week: 'W3', income: 11000, expenses: 9000, net: 2000 },
    { week: 'W4', income: 13500, expenses: 8500, net: 5000 },
    { week: 'W5', income: 12450, expenses: 8200, net: 4250 },
  ];

  const roleData = [
    { week: 'W1', personal: 6000, business: 3000, chama: 250, sideincome: 750 },
    { week: 'W2', personal: 7000, business: 4000, chama: 250, sideincome: 750 },
    { week: 'W3', personal: 6500, business: 3500, chama: 250, sideincome: 750 },
    { week: 'W4', personal: 7500, business: 5000, chama: 250, sideincome: 750 },
    { week: 'W5', personal: 7000, business: 4500, chama: 250, sideincome: 700 },
  ];

  const totalIncome = mockData.reduce((sum, week) => sum + week.income, 0);
  const totalExpenses = mockData.reduce((sum, week) => sum + week.expenses, 0);
  const avgIncome = totalIncome / mockData.length;
  const avgExpenses = totalExpenses / mockData.length;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{`Week ${label} - All Roles`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: Ksh ${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Weekly Trends</h2>
          <p className="text-muted-foreground">Income and expense patterns over time</p>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span>Avg Income: Ksh {avgIncome.toFixed(0)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <TrendingDown className="h-4 w-4 text-red-500" />
            <span>Avg Expenses: Ksh {avgExpenses.toFixed(0)}</span>
          </div>
        </div>
      </div>

      {/* Income vs Expenses Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Income vs Expenses</CardTitle>
          <CardDescription>
            Weekly comparison of money coming in vs going out
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                <XAxis dataKey="week" />
                <YAxis 
                  tickFormatter={(value) => `Ksh ${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="line"
                />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  dot={{ fill: '#22c55e', r: 4 }}
                  name="Income"
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={{ fill: '#ef4444', r: 4 }}
                  name="Expenses"
                />
                <Line 
                  type="monotone" 
                  dataKey="net" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  name="Net"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Net Income Area Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Net Income Trend</CardTitle>
          <CardDescription>
            Weekly net income (income minus expenses)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                <XAxis dataKey="week" />
                <YAxis 
                  tickFormatter={(value) => `Ksh ${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="rect"
                />
                <Area 
                  type="monotone" 
                  dataKey="net" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.3}
                  strokeWidth={2}
                  name="Net Income"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Role-Based Income Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Income by Role</CardTitle>
          <CardDescription>
            How income is distributed across your financial roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roleData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="week" />
                <YAxis 
                  tickFormatter={(value) => `Ksh ${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="personal" stackId="a" fill="#3b82f6" name="Personal" />
                <Bar dataKey="business" stackId="a" fill="#22c55e" name="Sky Tech" />
                <Bar dataKey="sideincome" stackId="a" fill="#a855f7" name="Side Income" />
                <Bar dataKey="chama" stackId="a" fill="#f59e0b" name="Chama" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Role Legend */}
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded" />
              <span className="text-sm">Personal</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded" />
              <span className="text-sm">Sky Tech</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded" />
              <span className="text-sm">Side Income</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-amber-500 rounded" />
              <span className="text-sm">Chama</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Best Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">W4</div>
            <p className="text-xs text-muted-foreground">Ksh 5,000 net income</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Current Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">W5</div>
            <p className="text-xs text-muted-foreground">Ksh 4,250 net income</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+70%</div>
            <p className="text-xs text-muted-foreground">vs 4-week average</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
