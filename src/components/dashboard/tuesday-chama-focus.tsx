'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Calendar, 
  Bell, 
  Target, 
  TrendingUp, 
  Users, 
  Clock,
  CheckCircle,
  AlertCircle,
  PiggyBank,
  DollarSign
} from 'lucide-react';
import { getRoleCardClasses, getTuesdayAlertClasses } from '@/lib/role-colors';

interface ChamaContribution {
  id: string;
  amount: number;
  week: string;
  date: string;
  note?: string;
  status: 'pending' | 'completed' | 'missed';
}

interface TuesdayChamaFocusProps {
  currentWeek: string;
  currentWeekContribution?: number;
  weeklyTarget: number;
  onContribution?: (amount: number, note?: string) => void;
}

export function TuesdayChamaFocus({ 
  currentWeek, 
  currentWeekContribution = 0, 
  weeklyTarget = 250,
  onContribution 
}: TuesdayChamaFocusProps) {
  const [isTuesday, setIsTuesday] = useState(false);
  const [daysUntilTuesday, setDaysUntilTuesday] = useState(0);
  const [showReminder, setShowReminder] = useState(false);
  const [contributionAmount, setContributionAmount] = useState('');
  const [contributionNote, setContributionNote] = useState('');

  useEffect(() => {
    const checkTuesday = () => {
      const now = new Date();
      const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 2 = Tuesday
      const isTodayTuesday = dayOfWeek === 2;
      
      setIsTuesday(isTodayTuesday);
      
      // Calculate days until next Tuesday
      let daysUntil = 0;
      if (dayOfWeek < 2) {
        daysUntil = 2 - dayOfWeek;
      } else if (dayOfWeek > 2) {
        daysUntil = 7 - (dayOfWeek - 2);
      }
      
      setDaysUntilTuesday(daysUntil);
      
      // Show reminder on Tuesday
      if (isTodayTuesday && !currentWeekContribution) {
        setShowReminder(true);
      }
    };

    checkTuesday();
    const interval = setInterval(checkTuesday, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [currentWeekContribution]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressPercentage = () => {
    return Math.min(100, (currentWeekContribution / weeklyTarget) * 100);
  };

  const getRemainingAmount = () => {
    return Math.max(0, weeklyTarget - currentWeekContribution);
  };

  const handleContribution = () => {
    const amount = parseFloat(contributionAmount);
    if (amount > 0) {
      onContribution?.(amount, contributionNote || undefined);
      setContributionAmount('');
      setContributionNote('');
      setShowReminder(false);
    }
  };

  const getTuesdayMessage = () => {
    if (isTuesday) {
      if (currentWeekContribution >= weeklyTarget) {
        return {
          title: "🎉 Chama Day Complete!",
          message: "You've met your weekly target. Great job!",
          type: "success" as const
        };
      } else if (currentWeekContribution > 0) {
        return {
          title: "⚡ Chama Day in Progress",
          message: `You've contributed ${formatCurrency(currentWeekContribution)}. ${formatCurrency(getRemainingAmount())} to go!`,
          type: "warning" as const
        };
      } else {
        return {
          title: "🔔 Today is Chama Day!",
          message: "Don't forget to make your weekly Ksh 250 contribution.",
          type: "alert" as const
        };
      }
    } else {
      return {
        title: "📅 Chama Day Coming Soon",
        message: daysUntilTuesday === 1 
          ? "Tomorrow is Chama Day - prepare your Ksh 250 contribution!"
          : `Chama Day is in ${daysUntilTuesday} days`,
        type: "info" as const
      };
    }
  };

  const tuesdayMessage = getTuesdayMessage();
  const roleConfig = getRoleCardClasses('chama');
  const alertConfig = getTuesdayAlertClasses();

  // Mock recent contributions for demonstration
  const recentContributions: ChamaContribution[] = [
    {
      id: '1',
      amount: 250,
      week: '2024-W04',
      date: '2024-01-23',
      status: 'completed'
    },
    {
      id: '2',
      amount: 250,
      week: '2024-W03',
      date: '2024-01-16',
      status: 'completed'
    },
    {
      id: '3',
      amount: 200,
      week: '2024-W02',
      date: '2024-01-09',
      status: 'completed'
    },
    {
      id: '4',
      amount: 250,
      week: '2024-W01',
      date: '2024-01-02',
      status: 'completed'
    },
  ];

  const getConsecutiveWeeks = () => {
    // Count consecutive completed weeks
    let consecutive = 0;
    for (const contribution of recentContributions) {
      if (contribution.status === 'completed') {
        consecutive++;
      } else {
        break;
      }
    }
    return consecutive;
  };

  const consecutiveWeeks = getConsecutiveWeeks();

  return (
    <div className="space-y-6">
      {/* Main Chama Focus Card */}
      <Card className={roleConfig}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PiggyBank className="h-5 w-5" />
              <CardTitle className="text-xl">Chama Tuesday Focus</CardTitle>
              {isTuesday && (
                <Badge className="bg-orange-500 text-white animate-pulse">
                  Today is Chama Day!
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Week {currentWeek}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tuesday Message Alert */}
          <Alert className={alertConfig}>
            <div className="flex items-start space-x-3">
              {tuesdayMessage.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
              {tuesdayMessage.type === 'warning' && <AlertCircle className="h-5 w-5 text-orange-500" />}
              {tuesdayMessage.type === 'alert' && <Bell className="h-5 w-5 text-red-500" />}
              {tuesdayMessage.type === 'info' && <Clock className="h-5 w-5 text-blue-500" />}
              <div className="flex-1">
                <AlertDescription className="font-medium">
                  {tuesdayMessage.title}
                </AlertDescription>
                <AlertDescription className="text-sm mt-1">
                  {tuesdayMessage.message}
                </AlertDescription>
              </div>
            </div>
          </Alert>

          {/* Progress Tracker */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Weekly Target Progress</span>
              <span className="text-sm text-muted-foreground">
                {formatCurrency(currentWeekContribution)} / {formatCurrency(weeklyTarget)}
              </span>
            </div>
            <Progress value={getProgressPercentage()} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{getProgressPercentage().toFixed(1)}% Complete</span>
              <span>{formatCurrency(getRemainingAmount())} remaining</span>
            </div>
          </div>

          {/* Quick Contribution */}
          {isTuesday && currentWeekContribution < weeklyTarget && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span>Quick Contribution</span>
              </h4>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Amount"
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md text-sm"
                    min="0"
                    step="50"
                  />
                  <Button onClick={handleContribution} disabled={!contributionAmount}>
                    Contribute
                  </Button>
                </div>
                <input
                  type="text"
                  placeholder="Note (optional)"
                  value={contributionNote}
                  onChange={(e) => setContributionNote(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>
            </div>
          )}

          {/* Consecutive Weeks Streak */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
                <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <div className="font-medium">Consecutive Weeks</div>
                <div className="text-sm text-muted-foreground">
                  {consecutiveWeeks} week streak
                </div>
              </div>
            </div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-300">
              {consecutiveWeeks}
            </div>
          </div>

          {/* Recent Contributions */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Recent Contributions</span>
            </h4>
            <div className="space-y-2">
              {recentContributions.slice(0, 3).map((contribution) => (
                <div key={contribution.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      contribution.status === 'completed' 
                        ? 'bg-green-500' 
                        : contribution.status === 'pending'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`} />
                    <div>
                      <div className="font-medium text-sm">
                        {formatCurrency(contribution.amount)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(contribution.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Badge variant={contribution.status === 'completed' ? 'default' : 'secondary'}>
                    {contribution.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Chama Tips */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Chama Tips</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="font-medium text-sm text-blue-800 dark:text-blue-200 mb-1">
                  💡 Consistency is Key
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-300">
                  Regular contributions build trust and maximize returns
                </div>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="font-medium text-sm text-green-800 dark:text-green-200 mb-1">
                  📈 Track Your Progress
                </div>
                <div className="text-xs text-green-600 dark:text-green-300">
                  Monitor your contributions and watch your savings grow
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chama Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Total Contributed</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(recentContributions.reduce((sum, c) => sum + c.amount, 0))}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Across {recentContributions.length} weeks
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Success Rate</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {Math.round((recentContributions.filter(c => c.status === 'completed').length / recentContributions.length) * 100)}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Weeks with contributions
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Average Weekly</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(recentContributions.reduce((sum, c) => sum + c.amount, 0) / recentContributions.length)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Per week average
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
