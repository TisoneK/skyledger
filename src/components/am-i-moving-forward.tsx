'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useFinancialStore } from '@/stores/financial-store';
import { useUIStore } from '@/stores/ui-store';
import { WeeklyAssessment } from '@/types/financial';
import { cn } from '@/lib/utils';

export function AmIMovingForward() {
  const { transactions, weeklySummaries } = useFinancialStore();
  const { currentWeek } = useUIStore();
  const [assessment, setAssessment] = useState<WeeklyAssessment | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateAssessment = (): WeeklyAssessment => {
    // Mock calculation - in real implementation, this would analyze actual data
    const currentWeekData = {
      income: 12450,
      expenses: 8200,
      savings: 250, // Chama contribution
      consistency: 0.85, // 85% consistency in weekly tracking
    };

    const previousWeekData = {
      income: 11000,
      expenses: 9500,
      savings: 200,
      consistency: 0.75,
    };

    const factors = {
      income: currentWeekData.income > previousWeekData.income,
      expenses: currentWeekData.expenses < previousWeekData.expenses,
      savings: currentWeekData.savings >= 250, // Met Chama target
      consistency: currentWeekData.consistency >= 0.8,
    };

    const positiveFactors = Object.values(factors).filter(Boolean).length;
    const overallScore = (positiveFactors / 4) * 100;

    const recommendations = [];
    
    if (!factors.income) {
      recommendations.push("Focus on increasing income streams this week");
    }
    if (!factors.expenses) {
      recommendations.push("Review and reduce unnecessary expenses");
    }
    if (!factors.savings) {
      recommendations.push("Prioritize Chama contribution - it's your financial foundation");
    }
    if (!factors.consistency) {
      recommendations.push("Maintain daily tracking habits for better insights");
    }

    return {
      week: currentWeek,
      overallScore,
      movingForward: overallScore >= 50,
      factors,
      recommendations,
    };
  };

  useEffect(() => {
    setIsCalculating(true);
    // Simulate calculation time
    const timer = setTimeout(() => {
      const result = calculateAssessment();
      setAssessment(result);
      setIsCalculating(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentWeek, transactions]);

  if (isCalculating) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Am I Moving Forward?</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">Analyzing your week...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!assessment) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-primary';
    if (score >= 50) return 'text-foreground';
    return 'text-destructive';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 75) return 'Excellent progress!';
    if (score >= 50) return 'Good progress, room for improvement';
    return 'Needs attention this week';
  };

  const FactorIcon = ({ factor, label }: { factor: boolean; label: string }) => {
    const Icon = factor ? CheckCircle : AlertTriangle;
    return (
      <div className="flex items-center space-x-2">
        <Icon className={cn(
          "h-4 w-4",
          factor ? "text-primary" : "text-destructive"
        )} />
        <span className="text-sm">{label}</span>
      </div>
    );
  };

  return (
    <Card className="border-2 border-border bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Target className={cn("h-5 w-5", getScoreColor(assessment.overallScore))} />
            <span>Am I Moving Forward?</span>
          </CardTitle>
          <div className="text-right">
            <div className={cn("text-2xl font-bold", getScoreColor(assessment.overallScore))}>
              {assessment.overallScore}%
            </div>
            <div className="text-xs text-muted-foreground">{getScoreMessage(assessment.overallScore)}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">
              {assessment.movingForward ? "Moving Forward" : "Needs Attention"}
            </span>
          </div>
          <Progress 
            value={assessment.overallScore} 
            className="bg-secondary"
          />
        </div>

        {/* Key Factors */}
        <div>
          <h4 className="text-sm font-medium mb-3">Key Factors This Week</h4>
          <div className="space-y-2">
            <FactorIcon factor={assessment.factors.income} label="Income Growth" />
            <FactorIcon factor={assessment.factors.expenses} label="Expense Control" />
            <FactorIcon factor={assessment.factors.savings} label="Savings Goals Met" />
            <FactorIcon factor={assessment.factors.consistency} label="Tracking Consistency" />
          </div>
        </div>

        {/* Recommendations */}
        {assessment.recommendations.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3">Recommendations</h4>
            <div className="space-y-2">
              {assessment.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <ArrowRight className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4 border-t">
          <Button className="w-full" variant={assessment.movingForward ? "default" : "destructive"}>
            {assessment.movingForward ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Keep Up the Great Work!
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4 mr-2" />
                Take Action This Week
              </>
            )}
          </Button>
        </div>

        {/* Week Context */}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          Assessment for week {assessment.week} • Updated daily
        </div>
      </CardContent>
    </Card>
  );
}
