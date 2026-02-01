'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  DollarSign, 
  Calendar, 
  Tag, 
  FileText,
  Save,
  X
} from 'lucide-react';
import { getRoleCardClasses } from '@/lib/role-colors';

interface TransactionEntryFormProps {
  roleId: string;
  onSubmit: (transaction: TransactionData) => void;
  onCancel?: () => void;
  initialData?: Partial<TransactionData>;
}

interface TransactionData {
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  description: string;
  categoryId: string;
  date: string;
  note?: string;
  roleId: string;
}

export function TransactionEntryForm({ 
  roleId, 
  onSubmit, 
  onCancel, 
  initialData 
}: TransactionEntryFormProps) {
  const [formData, setFormData] = useState<TransactionData>({
    type: initialData?.type || 'EXPENSE',
    amount: initialData?.amount || 0,
    description: initialData?.description || '',
    categoryId: initialData?.categoryId || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    note: initialData?.note || '',
    roleId,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TransactionData, string>>>({});

  const roleConfig = getRoleCardClasses(roleId as any);

  // Role-specific categories
  const getRoleCategories = (roleId: string, type: 'INCOME' | 'EXPENSE') => {
    const categories = {
      personal: {
        INCOME: [
          { id: 'salary', name: 'Salary' },
          { id: 'freelance', name: 'Freelance Work' },
          { id: 'investment', name: 'Investment Returns' },
          { id: 'gift', name: 'Gifts' },
          { id: 'other-income', name: 'Other Income' },
        ],
        EXPENSE: [
          { id: 'groceries', name: 'Groceries' },
          { id: 'transport', name: 'Transport' },
          { id: 'utilities', name: 'Utilities' },
          { id: 'rent', name: 'Rent/Mortgage' },
          { id: 'entertainment', name: 'Entertainment' },
          { id: 'healthcare', name: 'Healthcare' },
          { id: 'education', name: 'Education' },
          { id: 'clothing', name: 'Clothing' },
          { id: 'other-expense', name: 'Other Expense' },
        ],
      },
      'sky-tech': {
        INCOME: [
          { id: 'software-dev', name: 'Software Development' },
          { id: 'consulting', name: 'Consulting' },
          { id: 'support', name: 'Support Services' },
          { id: 'training', name: 'Training' },
          { id: 'other-income', name: 'Other Income' },
        ],
        EXPENSE: [
          { id: 'office-rent', name: 'Office Rent' },
          { id: 'salaries', name: 'Salaries' },
          { id: 'software-licenses', name: 'Software Licenses' },
          { id: 'marketing', name: 'Marketing' },
          { id: 'equipment', name: 'Equipment' },
          { id: 'travel', name: 'Travel' },
          { id: 'professional-services', name: 'Professional Services' },
          { id: 'other-expense', name: 'Other Expense' },
        ],
      },
      chama: {
        INCOME: [
          { id: 'weekly-contribution', name: 'Weekly Contribution' },
          { id: 'special-contribution', name: 'Special Contribution' },
          { id: 'interest', name: 'Interest' },
          { id: 'other-income', name: 'Other Income' },
        ],
        EXPENSE: [
          { id: 'administrative', name: 'Administrative Costs' },
          { id: 'bank-fees', name: 'Bank Fees' },
          { id: 'emergency', name: 'Emergency Fund' },
          { id: 'other-expense', name: 'Other Expense' },
        ],
      },
      'side-income': {
        INCOME: [
          { id: 'freelance-design', name: 'Freelance Design' },
          { id: 'photography', name: 'Photography' },
          { id: 'consulting', name: 'Consulting' },
          { id: 'online-courses', name: 'Online Courses' },
          { id: 'affiliate', name: 'Affiliate Marketing' },
          { id: 'other-income', name: 'Other Income' },
        ],
        EXPENSE: [
          { id: 'equipment', name: 'Equipment' },
          { id: 'software', name: 'Software' },
          { id: 'marketing', name: 'Marketing' },
          { id: 'training', name: 'Training' },
          { id: 'supplies', name: 'Supplies' },
          { id: 'other-expense', name: 'Other Expense' },
        ],
      },
    };

    return categories[roleId as keyof typeof categories]?.[type] || [];
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TransactionData, string>> = {};

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof TransactionData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const categories = getRoleCategories(roleId, formData.type);

  return (
    <Card className={roleConfig}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>
              {initialData ? 'Edit Transaction' : 'Add Transaction'} - {roleId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          </CardTitle>
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction Type */}
          <div className="space-y-2">
            <Label htmlFor="type" className="flex items-center space-x-2">
              <Tag className="h-4 w-4" />
              <span>Transaction Type</span>
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value: 'INCOME' | 'EXPENSE') => {
                handleInputChange('type', value);
                // Reset category when type changes
                handleInputChange('categoryId', '');
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select transaction type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INCOME">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span>Income</span>
                  </div>
                </SelectItem>
                <SelectItem value="EXPENSE">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <span>Expense</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>Amount</span>
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.amount || ''}
              onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
              className={errors.amount ? 'border-red-500' : ''}
            />
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount}</p>
            )}
            {formData.amount > 0 && (
              <p className="text-sm text-muted-foreground">
                {formatCurrency(formData.amount)}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Description</span>
            </Label>
            <Input
              id="description"
              placeholder="Enter transaction description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="flex items-center space-x-2">
              <Tag className="h-4 w-4" />
              <span>Category</span>
            </Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => handleInputChange('categoryId', value)}
            >
              <SelectTrigger className={errors.categoryId ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-sm text-red-500">{errors.categoryId}</p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Date</span>
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className={errors.date ? 'border-red-500' : ''}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.date && (
              <p className="text-sm text-red-500">{errors.date}</p>
            )}
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label htmlFor="note" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Note (Optional)</span>
            </Label>
            <Textarea
              id="note"
              placeholder="Add any additional notes..."
              value={formData.note}
              onChange={(e) => handleInputChange('note', e.target.value)}
              rows={3}
            />
          </div>

          {/* Role Badge */}
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="capitalize">
              {roleId.replace('-', ' ')}
            </Badge>
            <Badge variant={formData.type === 'INCOME' ? 'default' : 'secondary'}>
              {formData.type}
            </Badge>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" className="flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>{initialData ? 'Update' : 'Save'} Transaction</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Quick Transaction Entry Component
interface QuickTransactionEntryProps {
  roleId: string;
  onSubmit: (transaction: Omit<TransactionData, 'note'>) => void;
}

export function QuickTransactionEntry({ roleId, onSubmit }: QuickTransactionEntryProps) {
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const roleConfig = getRoleCardClasses(roleId as any);

  const getQuickCategories = (roleId: string, transactionType: 'INCOME' | 'EXPENSE') => {
    // Return top 3 most common categories for quick entry
    const categories = {
      personal: {
        EXPENSE: ['groceries', 'transport', 'utilities'],
        INCOME: ['salary', 'freelance', 'investment'],
      },
      'sky-tech': {
        EXPENSE: ['office-rent', 'software-licenses', 'marketing'],
        INCOME: ['software-dev', 'consulting', 'support'],
      },
      chama: {
        EXPENSE: ['administrative', 'bank-fees', 'emergency'],
        INCOME: ['weekly-contribution', 'special-contribution', 'interest'],
      },
      'side-income': {
        EXPENSE: ['equipment', 'software', 'marketing'],
        INCOME: ['freelance-design', 'photography', 'consulting'],
      },
    };

    return categories[roleId as keyof typeof categories]?.[transactionType] || [];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (amount && description && categoryId) {
      onSubmit({
        type,
        amount: parseFloat(amount),
        description,
        categoryId,
        date: new Date().toISOString().split('T')[0],
        roleId,
      });
      
      // Reset form
      setAmount('');
      setDescription('');
      setCategoryId('');
    }
  };

  const quickCategories = getQuickCategories(roleId, type);

  return (
    <Card className={roleConfig}>
      <CardHeader>
        <CardTitle className="text-lg">Quick Transaction Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={(value: 'INCOME' | 'EXPENSE') => setType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INCOME">Income</SelectItem>
                  <SelectItem value="EXPENSE">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              placeholder="What's this transaction for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {quickCategories.map((catId) => (
                  <SelectItem key={catId} value={catId}>
                    {catId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            Add Transaction
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
