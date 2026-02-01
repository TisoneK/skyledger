'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  Lightbulb,
  Target,
  DollarSign,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { getRoleCardClasses, getRoleBadgeClasses } from '@/lib/role-colors';
import { RoleIsolation, type RoleName } from '@/lib/role-isolation';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  categoryId: string;
  categoryName: string;
  date: string;
  roleId: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

interface RoleBasedInsightsProps {
  roleId: RoleName;
  transactions: Transaction[];
  period?: 'week' | 'month' | 'quarter' | 'year';
  showRecommendations?: boolean;
}

interface Insight {
  id: string;
  type: 'positive' | 'negative' | 'neutral' | 'warning';
  title: string;
  description: string;
  value?: number;
  trend?: 'up' | 'down' | 'stable';
  recommendation?: string;
  icon: React.ReactNode;
  category?: 'health' | 'spending' | 'income';
}

export function RoleBasedInsights({ 
  roleId, 
  transactions, 
  period = 'week',
  showRecommendations = true 
}: RoleBasedInsightsProps) {
  const roleConfig = getRoleCardClasses(roleId);
  const badgeConfig = getRoleBadgeClasses(roleId);

  // Calculate insights based on transactions
  const insights = useMemo(() => {
    const roleTransactions = transactions.filter(t => t.roleId === roleId);
    const income = roleTransactions.filter(t => t.type === 'INCOME');
    const expenses = roleTransactions.filter(t => t.type === 'EXPENSE');
    
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const netIncome = totalIncome - totalExpenses;
    
    // Calculate period comparisons
    const currentPeriod = getCurrentPeriodTransactions(roleTransactions, period);
    const previousPeriod = getPreviousPeriodTransactions(roleTransactions, period);
    
    const currentIncome = currentPeriod.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
    const currentExpenses = currentPeriod.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
    const previousIncome = previousPeriod.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
    const previousExpenses = previousPeriod.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
    
    const incomeTrend = calculateTrend(previousIncome, currentIncome);
    const expenseTrend = calculateTrend(previousExpenses, currentExpenses);
    
    // Get top categories
    const topExpenseCategories = getTopCategories(expenses, 3);
    const topIncomeCategories = getTopCategories(income, 3);
    
    // Generate role-specific insights
    const roleInsights = generateRoleSpecificInsights(
      roleId,
      currentIncome,
      currentExpenses,
      netIncome,
      incomeTrend,
      expenseTrend,
      topExpenseCategories,
      topIncomeCategories,
      period
    );
    
    return roleInsights;
  }, [roleId, transactions, period]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <ArrowDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getInsightIcon = (type: 'positive' | 'negative' | 'neutral' | 'warning') => {
    switch (type) {
      case 'positive':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'negative':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      default:
        return <Lightbulb className="h-5 w-5 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className={`p-3 rounded-lg ${roleConfig}`}>
          <BarChart3 className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Role-Based Insights</h2>
          <p className="text-muted-foreground">
            Financial insights for {roleId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Income</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(insights.find(i => i.id === 'total-income')?.value || 0)}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  {getTrendIcon(insights.find(i => i.id === 'income-trend')?.trend || 'stable')}
                  <span className="text-sm text-muted-foreground">
                    {insights.find(i => i.id === 'income-trend')?.description}
                  </span>
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(insights.find(i => i.id === 'total-expenses')?.value || 0)}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  {getTrendIcon(insights.find(i => i.id === 'expense-trend')?.trend || 'stable')}
                  <span className="text-sm text-muted-foreground">
                    {insights.find(i => i.id === 'expense-trend')?.description}
                  </span>
                </div>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Net Income</p>
                <p className={`text-2xl font-bold ${
                  (insights.find(i => i.id === 'net-income')?.value || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(insights.find(i => i.id === 'net-income')?.value || 0)}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  {getInsightIcon(insights.find(i => i.id === 'net-income')?.type || 'neutral')}
                  <span className="text-sm text-muted-foreground">
                    {insights.find(i => i.id === 'net-income')?.description}
                  </span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Savings Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {insights.find(i => i.id === 'savings-rate')?.value || 0}%
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  {getInsightIcon(insights.find(i => i.id === 'savings-rate')?.type || 'neutral')}
                  <span className="text-sm text-muted-foreground">
                    {insights.find(i => i.id === 'savings-rate')?.description}
                  </span>
                </div>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Health Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Financial Health</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights
              .filter(i => i.category === 'health')
              .map((insight) => (
                <div key={insight.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                  <div className="mt-1">{getInsightIcon(insight.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{insight.title}</h4>
                      <Badge variant={insight.type === 'positive' ? 'default' : insight.type === 'negative' ? 'destructive' : 'secondary'}>
                        {insight.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                    {insight.recommendation && showRecommendations && (
                      <div className="mt-2 p-2 bg-blue-50 rounded-md">
                        <p className="text-sm text-blue-800">
                          <strong>Recommendation:</strong> {insight.recommendation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Spending Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Spending Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights
              .filter(i => i.category === 'spending')
              .map((insight) => (
                <div key={insight.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                  <div className="mt-1">{getInsightIcon(insight.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{insight.title}</h4>
                      {insight.value && (
                        <span className="text-sm font-medium">{formatCurrency(insight.value)}</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                    {insight.recommendation && showRecommendations && (
                      <div className="mt-2 p-2 bg-blue-50 rounded-md">
                        <p className="text-sm text-blue-800">
                          <strong>Recommendation:</strong> {insight.recommendation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      {showRecommendations && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5" />
              <span>Personalized Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights
                .filter(i => i.recommendation)
                .map((insight) => (
                  <div key={insight.id} className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      {getInsightIcon(insight.type)}
                      <h4 className="font-medium">{insight.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{insight.recommendation}</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper functions
function getCurrentPeriodTransactions(transactions: Transaction[], period: string): Transaction[] {
  const now = new Date();
  let startDate = new Date();
  
  switch (period) {
    case 'week':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'quarter':
      startDate.setMonth(now.getMonth() - 3);
      break;
    case 'year':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
  }
  
  return transactions.filter(t => new Date(t.date) >= startDate);
}

function getPreviousPeriodTransactions(transactions: Transaction[], period: string): Transaction[] {
  const now = new Date();
  let startDate = new Date();
  let endDate = new Date();
  
  switch (period) {
    case 'week':
      endDate.setDate(now.getDate() - 7);
      startDate.setDate(now.getDate() - 14);
      break;
    case 'month':
      endDate.setMonth(now.getMonth() - 1);
      startDate.setMonth(now.getMonth() - 2);
      break;
    case 'quarter':
      endDate.setMonth(now.getMonth() - 3);
      startDate.setMonth(now.getMonth() - 6);
      break;
    case 'year':
      endDate.setFullYear(now.getFullYear() - 1);
      startDate.setFullYear(now.getFullYear() - 2);
      break;
  }
  
  return transactions.filter(t => {
    const date = new Date(t.date);
    return date >= startDate && date < endDate;
  });
}

function calculateTrend(previous: number, current: number): 'up' | 'down' | 'stable' {
  if (previous === 0) return 'stable';
  const change = ((current - previous) / previous) * 100;
  if (Math.abs(change) < 5) return 'stable';
  return change > 0 ? 'up' : 'down';
}

function getTopCategories(transactions: Transaction[], limit: number): Array<{ name: string; amount: number; count: number }> {
  const categoryTotals = transactions.reduce((acc, t) => {
    if (!acc[t.categoryName]) {
      acc[t.categoryName] = { amount: 0, count: 0 };
    }
    acc[t.categoryName].amount += t.amount;
    acc[t.categoryName].count += 1;
    return acc;
  }, {} as Record<string, { amount: number; count: number }>);
  
  return Object.entries(categoryTotals)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
}

function generateRoleSpecificInsights(
  roleId: RoleName,
  income: number,
  expenses: number,
  netIncome: number,
  incomeTrend: 'up' | 'down' | 'stable',
  expenseTrend: 'up' | 'down' | 'stable',
  topExpenseCategories: Array<{ name: string; amount: number; count: number }>,
  topIncomeCategories: Array<{ name: string; amount: number; count: number }>,
  period: string
): Insight[] {
  const insights: Insight[] = [];
  const savingsRate = income > 0 ? Math.round((netIncome / income) * 100) : 0;
  
  // Basic metrics
  insights.push({
    id: 'total-income',
    type: 'neutral',
    title: 'Total Income',
    description: `Total income for this ${period}`,
    value: income,
    trend: incomeTrend,
    icon: <TrendingUp className="h-5 w-5" />,
    category: 'health'
  });
  
  insights.push({
    id: 'total-expenses',
    type: 'neutral',
    title: 'Total Expenses',
    description: `Total expenses for this ${period}`,
    value: expenses,
    trend: expenseTrend,
    icon: <TrendingDown className="h-5 w-5" />,
    category: 'health'
  });
  
  insights.push({
    id: 'net-income',
    type: netIncome >= 0 ? 'positive' : 'negative',
    title: 'Net Income',
    description: netIncome >= 0 ? 'Positive cash flow' : 'Negative cash flow',
    value: netIncome,
    icon: <DollarSign className="h-5 w-5" />,
    category: 'health'
  });
  
  insights.push({
    id: 'savings-rate',
    type: savingsRate >= 20 ? 'positive' : savingsRate >= 10 ? 'neutral' : 'negative',
    title: 'Savings Rate',
    description: savingsRate >= 20 ? 'Excellent savings rate' : savingsRate >= 10 ? 'Good savings rate' : 'Low savings rate',
    value: savingsRate,
    icon: <Target className="h-5 w-5" />,
    category: 'health'
  });
  
  // Role-specific insights
  switch (roleId) {
    case 'personal':
      if (topExpenseCategories.length > 0) {
        insights.push({
          id: 'top-expense-category',
          type: 'neutral',
          title: 'Top Expense Category',
          description: `${topExpenseCategories[0].name}: ${topExpenseCategories[0].count} transactions`,
          value: topExpenseCategories[0].amount,
          icon: <PieChart className="h-5 w-5" />,
          category: 'spending'
        });
      }
      
      if (savingsRate < 15) {
        insights.push({
          id: 'low-savings',
          type: 'warning',
          title: 'Low Savings Rate',
          description: 'Consider increasing your savings rate to at least 15%',
          recommendation: 'Try to reduce non-essential expenses or increase income sources',
          icon: <AlertTriangle className="h-5 w-5" />,
          category: 'health'
        });
      }
      break;
      
    case 'sky-tech':
      if (incomeTrend === 'down') {
        insights.push({
          id: 'declining-revenue',
          type: 'negative',
          title: 'Declining Revenue',
          description: 'Business revenue is trending downward',
          recommendation: 'Review pricing strategy and explore new revenue streams',
          icon: <TrendingDown className="h-5 w-5" />,
          category: 'health'
        });
      }
      
      if (expenses > income * 0.8) {
        insights.push({
          id: 'high-expenses',
          type: 'warning',
          title: 'High Operating Costs',
          description: 'Operating costs are consuming more than 80% of revenue',
          recommendation: 'Review expense categories and identify cost-cutting opportunities',
          icon: <AlertTriangle className="h-5 w-5" />,
          category: 'spending'
        });
      }
      break;
      
    case 'chama':
      const weeklyTarget = 250;
      const weeklyContribution = income / (period === 'week' ? 1 : period === 'month' ? 4 : 13);
      
      if (weeklyContribution < weeklyTarget) {
        insights.push({
          id: 'below-target',
          type: 'negative',
          title: 'Below Weekly Target',
          description: `Weekly contribution is Ksh ${weeklyContribution.toFixed(0)}, below target of Ksh ${weeklyTarget}`,
          recommendation: 'Increase weekly contributions to meet the group savings goal',
          icon: <AlertTriangle className="h-5 w-5" />,
          category: 'health'
        });
      }
      
      if (weeklyContribution >= weeklyTarget) {
        insights.push({
          id: 'meeting-target',
          type: 'positive',
          title: 'Meeting Weekly Target',
          description: `Weekly contribution of Ksh ${weeklyContribution.toFixed(0)} exceeds target`,
          recommendation: 'Consider increasing the target or investing surplus funds',
          icon: <CheckCircle className="h-5 w-5" />,
          category: 'health'
        });
      }
      break;
      
    case 'side-income':
      if (incomeTrend === 'up') {
        insights.push({
          id: 'growing-side-income',
          type: 'positive',
          title: 'Growing Side Income',
          description: 'Side income streams are showing positive growth',
          recommendation: 'Continue diversifying income sources and consider scaling successful ventures',
          icon: <TrendingUp className="h-5 w-5" />,
          category: 'health'
        });
      }
      
      if (topIncomeCategories.length > 0 && topIncomeCategories[0].amount > income * 0.7) {
        insights.push({
          id: 'income-concentration',
          type: 'warning',
          title: 'Income Concentration Risk',
          description: `${topIncomeCategories[0].name} represents over 70% of side income`,
          recommendation: 'Diversify income sources to reduce dependency on a single stream',
          icon: <AlertTriangle className="h-5 w-5" />,
          category: 'spending'
        });
      }
      break;
  }
  
  return insights;
}
