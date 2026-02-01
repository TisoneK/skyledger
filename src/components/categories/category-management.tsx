'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Tag,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  DollarSign,
  Briefcase,
  PiggyBank,
  Calendar
} from 'lucide-react';
import { getRoleCardClasses } from '@/lib/role-colors';
import { RoleName } from '@/types/financial';

interface Category {
  id: string;
  name: string;
  type: 'INCOME' | 'EXPENSE';
  roleId: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive: boolean;
  transactionCount: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

interface CategoryManagementProps {
  roleId: string;
  categories: Category[];
  onAdd?: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEdit?: (category: Category) => void;
  onDelete?: (categoryId: string) => void;
  onToggleActive?: (categoryId: string, isActive: boolean) => void;
}

export function CategoryManagement({ 
  roleId, 
  categories, 
  onAdd, 
  onEdit, 
  onDelete, 
  onToggleActive 
}: CategoryManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const roleConfig = getRoleCardClasses(roleId as any);

  // Filter categories
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        category.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || category.type === filterType;
    const matchesStatus = filterStatus === 'ALL' || 
                        (filterStatus === 'ACTIVE' && category.isActive) ||
                        (filterStatus === 'INACTIVE' && !category.isActive);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getRoleIcon = (roleId: string) => {
    switch (roleId) {
      case 'personal':
        return <DollarSign className="h-5 w-5" />;
      case 'sky-tech':
        return <Briefcase className="h-5 w-5" />;
      case 'chama':
        return <PiggyBank className="h-5 w-5" />;
      default:
        return <Tag className="h-5 w-5" />;
    }
  };

  const getRoleName = (roleId: string) => {
    return roleId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleAddCategory = (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    onAdd?.(categoryData);
    setShowAddForm(false);
  };

  const handleEditCategory = (categoryData: Category) => {
    onEdit?.(categoryData);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (categoryId: string) => {
    onDelete?.(categoryId);
    setDeleteConfirm(null);
  };

  const handleToggleActive = (categoryId: string, isActive: boolean) => {
    onToggleActive?.(categoryId, isActive);
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
            <h2 className="text-2xl font-bold">Category Management</h2>
            <p className="text-muted-foreground">
              Manage categories for {getRoleName(roleId)}
            </p>
          </div>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Categories</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
              <Tag className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Categories</p>
                <p className="text-2xl font-bold text-green-600">
                  {categories.filter(c => c.isActive).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Income Categories</p>
                <p className="text-2xl font-bold text-green-600">
                  {categories.filter(c => c.type === 'INCOME').length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expense Categories</p>
                <p className="text-2xl font-bold text-red-600">
                  {categories.filter(c => c.type === 'EXPENSE').length}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterType} onValueChange={(value: 'ALL' | 'INCOME' | 'EXPENSE') => setFilterType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="INCOME">Income</SelectItem>
                <SelectItem value="EXPENSE">Expenses</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={(value: 'ALL' | 'ACTIVE' | 'INACTIVE') => setFilterStatus(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Category List */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCategories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No categories found</p>
              <Button onClick={() => setShowAddForm(true)} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Category
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      category.type === 'INCOME' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{category.name}</h3>
                        <Badge variant={category.type === 'INCOME' ? 'default' : 'secondary'}>
                          {category.type}
                        </Badge>
                        {!category.isActive && (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </div>
                      {category.description && (
                        <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <span>{category.transactionCount} transactions</span>
                        <span>{formatCurrency(category.totalAmount)}</span>
                        <span>Created {new Date(category.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActive(category.id, !category.isActive)}
                      className="h-8 w-8 p-0"
                      title={category.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {category.isActive ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-gray-400" />}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingCategory(category)}
                      className="h-8 w-8 p-0"
                      title="Edit Category"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirm(category.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      title="Delete Category"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Category Form */}
      {(showAddForm || editingCategory) && (
        <CategoryForm
          roleId={roleId}
          category={editingCategory}
          onSubmit={editingCategory ? handleEditCategory : handleAddCategory}
          onCancel={() => {
            setShowAddForm(false);
            setEditingCategory(null);
          }}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                <span>Delete Category</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>
                  Are you sure you want to delete this category? This action cannot be undone.
                </AlertDescription>
              </Alert>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="font-medium">
                  {categories.find(c => c.id === deleteConfirm)?.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {categories.find(c => c.id === deleteConfirm)?.transactionCount} transactions will be affected
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirm(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteCategory(deleteConfirm)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Category Form Component
interface CategoryFormProps {
  roleId: string;
  category?: Category | null;
  onSubmit: (category: any) => void;
  onCancel: () => void;
}

function CategoryForm({ roleId, category, onSubmit, onCancel }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    type: category?.type || 'EXPENSE' as 'INCOME' | 'EXPENSE',
    description: category?.description || '',
    color: category?.color || '#000000',
    icon: category?.icon || '',
    isActive: category?.isActive ?? true,
    roleId,
    transactionCount: category?.transactionCount || 0,
    totalAmount: category?.totalAmount || 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        id: category?.id || '',
        createdAt: category?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const roleConfig = getRoleCardClasses(roleId as RoleName | 'all');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto ${roleConfig}`}>
        <CardHeader>
          <CardTitle>
            {category ? 'Edit Category' : 'Add New Category'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'INCOME' | 'EXPENSE') => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INCOME">Income</SelectItem>
                    <SelectItem value="EXPENSE">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Optional description"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="isActive">Active</Label>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {category ? 'Update' : 'Create'} Category
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Mock data for demonstration
export function useCategoryManagementData(roleId: string): Category[] {
  const mockCategories: Category[] = [
    {
      id: '1',
      name: 'Groceries',
      type: 'EXPENSE',
      roleId,
      description: 'Food and household items',
      isActive: true,
      transactionCount: 15,
      totalAmount: 8000,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Transport',
      type: 'EXPENSE',
      roleId,
      description: 'Public transport and fuel',
      isActive: true,
      transactionCount: 8,
      totalAmount: 3500,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '3',
      name: 'Salary',
      type: 'INCOME',
      roleId,
      description: 'Monthly salary',
      isActive: true,
      transactionCount: 1,
      totalAmount: 40000,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '4',
      name: 'Freelance Work',
      type: 'INCOME',
      roleId,
      description: 'Side projects and consulting',
      isActive: true,
      transactionCount: 3,
      totalAmount: 5000,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ];

  return mockCategories;
}
