'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Calendar, 
  ArrowUpDown,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  Plus
} from 'lucide-react';
import { getRoleCardClasses, getRoleBadgeClasses } from '@/lib/role-colors';

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

interface TransactionListProps {
  roleId: string;
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transactionId: string) => void;
  onView?: (transaction: Transaction) => void;
  onAdd?: () => void;
}

export function TransactionList({ 
  roleId, 
  transactions, 
  onEdit, 
  onDelete, 
  onView,
  onAdd 
}: TransactionListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'description'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const roleConfig = getRoleCardClasses(roleId as any);
  const badgeConfig = getRoleBadgeClasses(roleId as any);

  // Get unique categories for filtering
  const categories = useMemo(() => {
    const cats = new Set(transactions.map(t => t.categoryName));
    return Array.from(cats).sort();
  }, [transactions]);

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions.filter(transaction => {
      // Search filter
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          transaction.note?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Type filter
      const matchesType = filterType === 'ALL' || transaction.type === filterType;
      
      // Category filter
      const matchesCategory = filterCategory === 'ALL' || transaction.categoryName === filterCategory;
      
      return matchesSearch && matchesType && matchesCategory;
    });

    // Sort transactions
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'description':
          comparison = a.description.localeCompare(b.description);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [transactions, searchTerm, filterType, filterCategory, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredAndSortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const toggleSort = (field: 'date' | 'amount' | 'description') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const totalIncome = filteredAndSortedTransactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredAndSortedTransactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const netIncome = totalIncome - totalExpenses;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${roleConfig}`}>
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Transactions</h2>
            <p className="text-muted-foreground">
              {filteredAndSortedTransactions.length} transactions found
            </p>
          </div>
        </div>
        {onAdd && (
          <Button onClick={onAdd} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Transaction</span>
          </Button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Income</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
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
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
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
                <p className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(netIncome)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters & Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Type Filter */}
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

            {/* Category Filter */}
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
              const [field, order] = value.split('-');
              setSortBy(field as 'date' | 'amount' | 'description');
              setSortOrder(order as 'asc' | 'desc');
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Date (Newest)</SelectItem>
                <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                <SelectItem value="amount-desc">Amount (High to Low)</SelectItem>
                <SelectItem value="amount-asc">Amount (Low to High)</SelectItem>
                <SelectItem value="description-asc">Description (A-Z)</SelectItem>
                <SelectItem value="description-desc">Description (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transaction List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transaction List</CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className={badgeConfig}>
                {paginatedTransactions.length} of {filteredAndSortedTransactions.length}
              </Badge>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {paginatedTransactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No transactions found</p>
              {onAdd && (
                <Button onClick={onAdd} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Transaction
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Table Headers */}
              <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 rounded-lg font-medium text-sm">
                <div className="col-span-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSort('description')}
                    className="p-0 h-auto font-medium"
                  >
                    Description
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </div>
                <div className="col-span-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSort('date')}
                    className="p-0 h-auto font-medium"
                  >
                    Date
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </div>
                <div className="col-span-2">Category</div>
                <div className="col-span-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSort('amount')}
                    className="p-0 h-auto font-medium"
                  >
                    Amount
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </div>
                <div className="col-span-2">Actions</div>
              </div>

              {/* Transaction Rows */}
              {paginatedTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="grid grid-cols-12 gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="col-span-4">
                    <div className="font-medium">{transaction.description}</div>
                    {transaction.note && (
                      <div className="text-sm text-muted-foreground mt-1">{transaction.note}</div>
                    )}
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{formatDate(transaction.date)}</span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Badge variant="outline" className="text-xs">
                      {transaction.categoryName}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <div className={`font-medium ${
                      transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center space-x-1">
                      {onView && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onView(transaction)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(transaction)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(transaction.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                    {Math.min(currentPage * itemsPerPage, filteredAndSortedTransactions.length)} of{' '}
                    {filteredAndSortedTransactions.length} transactions
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className="w-8 h-8 p-0"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Mock data for demonstration
export function useTransactionListData(roleId: string): Transaction[] {
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      description: 'Monthly Salary',
      amount: 40000,
      type: 'INCOME',
      categoryId: 'salary',
      categoryName: 'Salary',
      date: '2024-01-29',
      roleId,
      note: 'January salary',
      createdAt: '2024-01-29T10:00:00Z',
      updatedAt: '2024-01-29T10:00:00Z',
    },
    {
      id: '2',
      description: 'Grocery Shopping',
      amount: 2500,
      type: 'EXPENSE',
      categoryId: 'groceries',
      categoryName: 'Groceries',
      date: '2024-01-28',
      roleId,
      note: 'Weekly groceries',
      createdAt: '2024-01-28T15:30:00Z',
      updatedAt: '2024-01-28T15:30:00Z',
    },
    {
      id: '3',
      description: 'Electric Bill',
      amount: 1500,
      type: 'EXPENSE',
      categoryId: 'utilities',
      categoryName: 'Utilities',
      date: '2024-01-27',
      roleId,
      createdAt: '2024-01-27T09:00:00Z',
      updatedAt: '2024-01-27T09:00:00Z',
    },
    {
      id: '4',
      description: 'Freelance Design Project',
      amount: 5000,
      type: 'INCOME',
      categoryId: 'freelance',
      categoryName: 'Freelance Work',
      date: '2024-01-26',
      roleId,
      note: 'Logo design for client',
      createdAt: '2024-01-26T14:00:00Z',
      updatedAt: '2024-01-26T14:00:00Z',
    },
    {
      id: '5',
      description: 'Transport',
      amount: 800,
      type: 'EXPENSE',
      categoryId: 'transport',
      categoryName: 'Transport',
      date: '2024-01-25',
      roleId,
      note: 'Fuel and parking',
      createdAt: '2024-01-25T18:00:00Z',
      updatedAt: '2024-01-25T18:00:00Z',
    },
  ];

  return mockTransactions;
}
