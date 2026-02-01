'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar
} from 'lucide-react';
import { useFinancialStore } from '@/stores/financial-store';
import { useUIStore } from '@/stores/ui-store';
import { TransactionFormData, TransactionType } from '@/types/financial';
import { getRoleColor } from '@/lib/role-colors';
import { cn } from '@/lib/utils';

interface QuickTransactionEntryProps {
  className?: string;
}

export function QuickTransactionEntry({ className }: QuickTransactionEntryProps) {
  const { addTransaction, roles, categories } = useFinancialStore();
  const { selectedRole } = useUIStore();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState<TransactionFormData>({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    type: 'EXPENSE',
    roleId: selectedRole === 'all' ? roles[0]?.id || '' : selectedRole,
    categoryId: '',
  });

  const roleCategories = categories.filter(cat => cat.roleId === formData.roleId);
  const typeCategories = roleCategories.filter(cat => cat.type === formData.type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.categoryId || !formData.roleId) {
      return; // Show validation error
    }

    addTransaction({
      amount: parseFloat(formData.amount),
      description: formData.description,
      date: new Date(formData.date),
      type: formData.type,
      roleId: formData.roleId,
      categoryId: formData.categoryId,
    });

    // Reset form
    setFormData({
      ...formData,
      amount: '',
      description: '',
      categoryId: typeCategories[0]?.id || '',
    });
    
    setIsExpanded(false);
  };

  const handleTypeChange = (type: TransactionType) => {
    setFormData(prev => ({
      ...prev,
      type,
      categoryId: '', // Reset category when type changes
    }));
  };

  const handleRoleChange = (roleId: string) => {
    setFormData(prev => ({
      ...prev,
      roleId,
      categoryId: '', // Reset category when role changes
    }));
  };

  const selectedRoleConfig = getRoleColor(formData.roleId as any);
  const selectedCategory = categories.find(cat => cat.id === formData.categoryId);

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Quick Transaction</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '−' : '+'}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Transaction Type */}
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={formData.type === 'INCOME' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleTypeChange('INCOME')}
                className="flex-1"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Income
              </Button>
              <Button
                type="button"
                variant={formData.type === 'EXPENSE' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleTypeChange('EXPENSE')}
                className="flex-1"
              >
                <TrendingDown className="h-4 w-4 mr-2" />
                Expense
              </Button>
            </div>

            {/* Amount */}
            <div>
              <Label htmlFor="amount">Amount (Ksh)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="text-lg"
                required
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="What was this transaction for?"
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            {/* Date */}
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>

            {/* Role Selection */}
            <div>
              <Label htmlFor="role">Financial Role</Label>
              <Select value={formData.roleId} onValueChange={handleRoleChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role">
                    {selectedRoleConfig?.displayName || 'Select role'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      <div className="flex items-center space-x-2">
                        <div className={cn("w-3 h-3 rounded-full", selectedRoleConfig.background)} />
                        <span>{role.displayName}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Selection */}
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.categoryId} onValueChange={(value: string) => setFormData(prev => ({ ...prev, categoryId: value }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category">
                    {selectedCategory?.name || 'Select category'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {typeCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={!formData.amount || !formData.categoryId || !formData.roleId}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </form>
        </CardContent>
      )}
    </Card>
  );
}
