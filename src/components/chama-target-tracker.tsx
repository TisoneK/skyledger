'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Target, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  AlertTriangle,
  Plus,
  Trophy
} from 'lucide-react';
import { useFinancialStore } from '@/stores/financial-store';
import { useUIStore } from '@/stores/ui-store';
import { getRoleColor } from '@/lib/role-colors';
import { cn } from '@/lib/utils';

interface ChamaTargetTrackerProps {
  className?: string;
}

export function ChamaTargetTracker({ className }: ChamaTargetTrackerProps) {
  const { chamaContributions, addChamaContribution } = useFinancialStore();
  const { currentWeek } = useUIStore();
  const [isContributionDialogOpen, setIsContributionDialogOpen] = useState(false);
  const [contributionAmount, setContributionAmount] = useState('');

  const weeklyTarget = 250; // Ksh. 250 per week
  const currentWeekContributions = chamaContributions.filter(c => c.week === currentWeek);
  const currentWeekTotal = currentWeekContributions.reduce((sum, c) => sum + c.amount, 0);
  const progress = Math.min((currentWeekTotal / weeklyTarget) * 100, 100);
  const isTuesday = new Date().getDay() === 2;
  const isTargetMet = currentWeekTotal >= weeklyTarget;

  // Mock historical data for demonstration
  const mockHistory = [
    { week: '2024-W01', amount: 250, target: 250, met: true },
    { week: '2024-W02', amount: 200, target: 250, met: false },
    { week: '2024-W03', amount: 300, target: 250, met: true },
    { week: '2024-W04', amount: 250, target: 250, met: true },
    { week: currentWeek, amount: currentWeekTotal, target: weeklyTarget, met: isTargetMet },
  ];

  const history = mockHistory;
  const consecutiveWeeksMet = history.slice(-4).filter(w => w.met).length;
  const totalContributed = history.reduce((sum, w) => sum + w.amount, 0);
  const averageContribution = totalContributed / history.length;

  const handleAddContribution = () => {
    const amount = parseFloat(contributionAmount);
    if (isNaN(amount) || amount <= 0) return;

    addChamaContribution({
      week: currentWeek,
      amount,
      targetAmount: weeklyTarget,
      date: new Date(),
      note: isTuesday ? 'Tuesday contribution' : 'Additional contribution',
    });

    setContributionAmount('');
    setIsContributionDialogOpen(false);
  };

  const getStatusColor = () => {
    if (progress >= 100) return 'text-green-600';
    if (progress >= 75) return 'text-amber-600';
    return 'text-red-600';
  };

  const getStatusMessage = () => {
    if (progress >= 100) return '🎉 Target met! Excellent discipline!';
    if (progress >= 75) return 'Almost there! Keep going!';
    if (progress >= 50) return 'Halfway there. You can do it!';
    return 'Let\'s get started on your weekly goal!';
  };

  return (
    <Card className={cn(
      "relative overflow-hidden",
      isTuesday && "border-2 border-amber-200 bg-amber-50 animate-pulse",
      className
    )}>
      {/* Tuesday Indicator */}
      {isTuesday && (
        <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs px-2 py-1 rounded-bl-lg">
          🔥 Chama Day!
        </div>
      )}

      <CardHeader>
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-amber-600" />
          <CardTitle className="text-amber-800">Chama Target Tracker</CardTitle>
        </div>
        <CardDescription>
          Weekly target: Ksh {weeklyTarget} • {isTuesday ? "Today is Chama day!" : "Next Tuesday is Chama day"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Week Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">This Week's Progress</span>
            <span className={cn("text-sm font-bold", getStatusColor())}>
              Ksh {currentWeekTotal} / Ksh {weeklyTarget}
            </span>
          </div>
          <Progress 
            value={progress} 
            className={cn(
              "h-3",
              progress >= 100 ? "[&>div]:bg-green-500" : "[&>div]:bg-amber-500"
            )}
          />
          <p className={cn("text-xs mt-2", getStatusColor())}>
            {getStatusMessage()}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">
              {consecutiveWeeksMet}
            </div>
            <div className="text-xs text-muted-foreground">Weeks on track</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              Ksh {averageContribution.toFixed(0)}
            </div>
            <div className="text-xs text-muted-foreground">Average/week</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              Ksh {totalContributed.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Total saved</div>
          </div>
        </div>

        {/* Recent Contributions */}
        {currentWeekContributions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">This Week's Contributions</h4>
            <div className="space-y-1">
              {currentWeekContributions.map((contribution, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span>{contribution.note || 'Contribution'}</span>
                  <span className="font-medium">Ksh {contribution.amount}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Motivational Message */}
        <div className={cn(
          "p-3 rounded-lg text-center",
          isTargetMet 
            ? "bg-green-100 text-green-800" 
            : "bg-amber-100 text-amber-800"
        )}>
          <div className="flex items-center justify-center space-x-2">
            {isTargetMet ? (
              <>
                <Trophy className="h-5 w-5" />
                <span className="font-bold text-green-700">Target Achieved! 🎉</span>
              </>
            ) : (
              <>
                <Target className="h-5 w-5" />
                <span className="font-bold text-amber-700">
                  Ksh {weeklyTarget - currentWeekTotal} to go!
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button 
            onClick={() => setIsContributionDialogOpen(true)}
            className="flex-1 min-h-[44px] text-base"
            variant={isTargetMet ? "outline" : "default"}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Contribution
          </Button>
          <Button variant="outline" size="sm" className="min-h-[44px]">
            <Calendar className="h-4 w-4" />
          </Button>
        </div>

        {/* Contribution Dialog */}
        {isContributionDialogOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Add Chama Contribution</CardTitle>
                <CardDescription>
                  Enter the amount you want to contribute this week
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Amount (Ksh)</label>
                  <input
                    type="number"
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                    placeholder="250"
                    className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  Weekly target: Ksh {weeklyTarget}
                </div>
              </CardContent>
              <div className="flex space-x-2 px-6 pb-6">
                <Button 
                  variant="outline" 
                  onClick={() => setIsContributionDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddContribution}
                  className="flex-1"
                >
                  Add Contribution
                </Button>
              </div>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
