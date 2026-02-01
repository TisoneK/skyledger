'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  Users, 
  Target, 
  TrendingUp, 
  Trophy,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { useFinancialStore } from '@/stores/financial-store';
import { cn } from '@/lib/utils';

export function ChamaProgress() {
  // Mock data for demonstration
  const weeklyData = [
    { week: 'W1', target: 250, contributed: 250, percentage: 100 },
    { week: 'W2', target: 250, contributed: 200, percentage: 80 },
    { week: 'W3', target: 250, contributed: 300, percentage: 120 },
    { week: 'W4', target: 250, contributed: 250, percentage: 100 },
    { week: 'W5', target: 250, contributed: 250, percentage: 100 },
  ];

  const monthlyData = [
    { month: 'Jan', target: 1000, contributed: 1250, percentage: 125 },
    { month: 'Feb', target: 1000, contributed: 950, percentage: 95 },
    { month: 'Mar', target: 1000, contributed: 1100, percentage: 110 },
    { month: 'Apr', target: 1000, contributed: 1000, percentage: 100 },
  ];

  const currentWeek = weeklyData[weeklyData.length - 1];
  const totalContributed = weeklyData.reduce((sum, week) => sum + week.contributed, 0);
  const totalTarget = weeklyData.reduce((sum, week) => sum + week.target, 0);
  const overallPercentage = (totalContributed / totalTarget) * 100;

  const consecutiveWeeksMet = weeklyData.slice(-4).filter(week => week.percentage >= 100).length;

  // Pie chart data for current week
  const pieData = [
    { name: 'Contributed', value: currentWeek.contributed, color: '#f59e0b' },
    { name: 'Remaining', value: Math.max(0, currentWeek.target - currentWeek.contributed), color: '#e5e7eb' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
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

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">Ksh {payload[0].value.toLocaleString()}</p>
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
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <Users className="h-6 w-6 text-amber-600" />
            <span>Chama Progress</span>
          </h2>
          <p className="text-muted-foreground">Weekly contribution tracking and trends</p>
        </div>
        <div className="flex items-center space-x-2">
          <Trophy className={cn(
            "h-5 w-5",
            consecutiveWeeksMet >= 4 ? "text-green-500" : "text-amber-500"
          )} />
          <span className="text-sm font-medium">
            {consecutiveWeeksMet}/4 weeks on target
          </span>
        </div>
      </div>

      {/* Current Week Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-amber-600" />
              <span>Current Week</span>
            </CardTitle>
            <CardDescription>
              Week {weeklyData.length} contribution progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-4">
              <div className="text-2xl font-bold text-amber-600">
                {currentWeek.percentage}%
              </div>
              <p className="text-sm text-muted-foreground">
                Ksh {currentWeek.contributed} / Ksh {currentWeek.target}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Breakdown</CardTitle>
            <CardDescription>
            Contribution amounts per week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="week" />
                  <YAxis tickFormatter={(value) => `Ksh ${value}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="contributed" fill="#f59e0b" name="Contributed" />
                  <Bar dataKey="target" fill="#e5e7eb" name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-amber-600" />
            <span>Monthly Trends</span>
          </CardTitle>
          <CardDescription>
            Monthly contribution totals and targets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `Ksh ${(value / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="contributed" 
                  stroke="#f59e0b" 
                  fill="#f59e0b" 
                  fillOpacity={0.3}
                  name="Contributed"
                />
                <Area 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#6b7280" 
                  fill="#6b7280" 
                  fillOpacity={0.1}
                  name="Target"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Saved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              Ksh {totalContributed.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {overallPercentage.toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Overall achievement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Best Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              W3
            </div>
            <p className="text-xs text-muted-foreground">
              Ksh 300 (120%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {consecutiveWeeksMet}
            </div>
            <p className="text-xs text-muted-foreground">
              Consecutive weeks on target
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Motivational Message */}
      <Card className={cn(
        "border-2",
        consecutiveWeeksMet >= 4 ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"
      )}>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              {consecutiveWeeksMet >= 4 ? (
                <>
                  <Trophy className="h-6 w-6 text-green-600" />
                  <span className="text-lg font-bold text-green-800">
                    Excellent Discipline! 🎉
                  </span>
                </>
              ) : (
                <>
                  <Target className="h-6 w-6 text-amber-600" />
                  <span className="text-lg font-bold text-amber-800">
                    Keep Going! 💪
                  </span>
                </>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {consecutiveWeeksMet >= 4 
                ? "You've hit your Chama target 4 weeks in a row! Your future self thanks you."
                : `You're ${4 - consecutiveWeeksMet} weeks away from a perfect month. Stay consistent!`
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
