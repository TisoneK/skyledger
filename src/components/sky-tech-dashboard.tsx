'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Briefcase,
  Target,
  Users,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  Calendar,
  AlertTriangle,
  Plus
} from 'lucide-react';
import { useFinancialStore } from '@/stores/financial-store';
import { getRoleColor } from '@/lib/role-colors';
import { cn } from '@/lib/utils';

export function SkyTechDashboard() {
  const { transactions, categories } = useFinancialStore();
  
  // Mock data for demonstration
  const mockData = {
    currentMonth: {
      income: 15000,
      expenses: 8500,
      netIncome: 6500,
      projects: 3,
      clients: 2,
    },
    previousMonth: {
      income: 12000,
      expenses: 9000,
      netIncome: 3000,
      projects: 2,
      clients: 1,
    },
    projects: [
      {
        name: "E-commerce Platform",
        client: "ABC Retail",
        status: "active",
        income: 8000,
        expenses: 2000,
        net: 6000,
        deadline: "2024-02-15",
      },
      {
        name: "Mobile App Development",
        client: "XYZ Tech",
        status: "active",
        income: 5000,
        expenses: 1500,
        net: 3500,
        deadline: "2024-03-01",
      },
      {
        name: "Website Redesign",
        client: "Local Business",
        status: "completed",
        income: 2000,
        expenses: 500,
        net: 1500,
        deadline: "2024-01-15",
      },
    ],
    expenses: [
      { category: "Software Tools", amount: 1200, trend: "up" },
      { category: "Internet & Hosting", amount: 800, trend: "stable" },
      { category: "Marketing", amount: 1500, trend: "down" },
      { category: "Office Supplies", amount: 500, trend: "stable" },
      { category: "Business Development", amount: 3000, trend: "up" },
      { category: "Professional Services", amount: 1500, trend: "stable" },
    ],
  };

  const data = mockData;
  const businessRole = getRoleColor('business');

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    trend, 
    description 
  }: {
    title: string;
    value: string;
    change?: number;
    icon: React.ComponentType<any>;
    trend?: 'up' | 'down' | 'stable';
    description?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn("h-4 w-4", businessRole.text)} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div className={cn(
            "flex items-center text-xs",
            trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'
          )}>
            {trend === 'up' && <ArrowUpRight className="h-3 w-3 mr-1" />}
            {trend === 'down' && <ArrowDownRight className="h-3 w-3 mr-1" />}
            {trend === 'stable' && <div className="h-3 w-3 mr-1" />}
            {Math.abs(change)}% from last month
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );

  const ProjectCard = ({ project }: { project: any }) => {
    const isOverdue = new Date(project.deadline) < new Date();
    const daysUntilDeadline = Math.ceil((new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    return (
      <Card className={cn(
        "relative overflow-hidden",
        project.status === 'completed' ? "border-green-200" : 
        isOverdue ? "border-red-200" : "border-gray-200"
      )}>
        <div className={cn(
          "absolute top-0 left-0 w-1 h-full",
          project.status === 'completed' ? "bg-green-500" : 
          isOverdue ? "bg-red-500" : "bg-blue-500"
        )} />
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium truncate">{project.name}</CardTitle>
            <span className={cn(
              "text-xs px-2 py-1 rounded-full",
              project.status === 'completed' ? "bg-green-100 text-green-800" :
              project.status === 'active' ? "bg-blue-100 text-blue-800" :
              "bg-gray-100 text-gray-800"
            )}>
              {project.status}
            </span>
          </div>
          <CardDescription className="text-xs">{project.client}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <div className="text-muted-foreground">Income</div>
              <div className="font-semibold text-green-600">+Ksh {project.income.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Expenses</div>
              <div className="font-semibold text-red-600">-Ksh {project.expenses.toLocaleString()}</div>
            </div>
          </div>
          <div className="border-t pt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Net Profit</span>
              <span className={cn(
                "font-bold",
                project.net >= 0 ? "text-green-600" : "text-red-600"
              )}>
                Ksh {Math.abs(project.net).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Deadline</span>
            <span className={cn(
              isOverdue ? "text-red-500" : daysUntilDeadline <= 7 ? "text-amber-500" : "text-gray-500"
            )}>
              {isOverdue ? "Overdue" : `${daysUntilDeadline} days`}
            </span>
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
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <Briefcase className={cn("h-8 w-8", businessRole.text)} />
            Sky Tech Solutions
          </h1>
          <p className="text-muted-foreground">
            Business performance dashboard • Track your growth engine
          </p>
        </div>
        <Button variant="outline" size="sm">
          <BarChart3 className="h-4 w-4 mr-2" />
          View Analytics
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Monthly Revenue"
          value={`Ksh ${data.currentMonth.income.toLocaleString()}`}
          change={25}
          icon={DollarSign}
          trend="up"
          description="Total income this month"
        />
        <MetricCard
          title="Net Profit"
          value={`Ksh ${data.currentMonth.netIncome.toLocaleString()}`}
          change={116.7}
          icon={TrendingUp}
          trend="up"
          description="After expenses"
        />
        <MetricCard
          title="Active Projects"
          value={data.currentMonth.projects.toString()}
          change={50}
          icon={Target}
          trend="up"
          description="Currently running"
        />
        <MetricCard
          title="Active Clients"
          value={data.currentMonth.clients.toString()}
          change={100}
          icon={Users}
          trend="up"
          description="Paying customers"
        />
      </div>

      {/* Business Health Indicator */}
      <Card className={cn(
        "border-2",
        data.currentMonth.netIncome > 5000 ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"
      )}>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <CardTitle className="text-lg">Business Health</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Monthly Profit Margin</span>
              <span className={cn(
                "text-sm font-bold",
                data.currentMonth.netIncome > 5000 ? "text-green-600" : "text-amber-600"
              )}>
                {((data.currentMonth.netIncome / data.currentMonth.income) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Growth Rate</span>
              <span className="text-sm font-bold text-green-600">
                +116.7% vs last month
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Profit Target</span>
              <span className={cn(
                "text-sm font-bold",
                data.currentMonth.netIncome >= 5000 ? "text-green-600" : "text-amber-600"
              )}>
                {data.currentMonth.netIncome >= 5000 ? "✅ On track" : "⚠️ Below target"}
              </span>
            </div>
          </div>
          <div className={cn(
            "p-3 rounded-lg text-center",
            data.currentMonth.netIncome > 5000 ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
          )}>
            <div className="flex items-center justify-center space-x-2">
              {data.currentMonth.netIncome > 5000 ? (
                <>
                  <TrendingUp className="h-5 w-5" />
                  <span className="font-medium">Business is thriving! 🚀</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-medium">Focus on growth this month</span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Overview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Active Projects</h2>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </div>

      {/* Expense Breakdown */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Expense Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.expenses.map((expense, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{expense.category}</CardTitle>
                  <div className="flex items-center space-x-1">
                    {expense.trend === 'up' && <ArrowUpRight className="h-3 w-3 text-red-500" />}
                    {expense.trend === 'down' && <ArrowDownRight className="h-3 w-3 text-green-500" />}
                    {expense.trend === 'stable' && <div className="h-3 w-3 text-gray-500" />}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Ksh {expense.amount.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {expense.trend === 'up' && "Increased from last month"}
                  {expense.trend === 'down' && "Decreased from last month"}
                  {expense.trend === 'stable' && "Same as last month"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Business Actions</CardTitle>
          <CardDescription>
            Common business management tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button variant="outline" className="w-full justify-start">
              <Briefcase className="h-4 w-4 mr-2" />
              New Project
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <PieChart className="h-4 w-4 mr-2" />
              Financial Report
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Review
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
