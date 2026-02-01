// Role isolation utilities for SkyLedger
// Ensures proper data separation between financial roles

import React from 'react';

export type RoleName = 'personal' | 'sky-tech' | 'chama' | 'side-income';

export interface RoleData<T> {
  personal: T;
  'sky-tech': T;
  chama: T;
  'side-income': T;
}

export interface RoleFilter {
  roleId?: RoleName | 'all';
  includeInactive?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface RoleMetrics {
  roleId: RoleName;
  income: number;
  expenses: number;
  netIncome: number;
  transactionCount: number;
  averageTransaction: number;
  topCategories: Array<{
    name: string;
    amount: number;
    count: number;
    percentage: number;
  }>;
}

export class RoleIsolation {
  private static readonly ROLES: RoleName[] = ['personal', 'sky-tech', 'chama', 'side-income'];

  /**
   * Filter data by role
   */
  static filterByRole<T extends { roleId: string }>(
    data: T[],
    roleId: RoleName | 'all'
  ): T[] {
    if (roleId === 'all') {
      return data;
    }
    return data.filter(item => item.roleId === roleId);
  }

  /**
   * Filter data by multiple roles
   */
  static filterByRoles<T extends { roleId: string }>(
    data: T[],
    roleIds: RoleName[]
  ): T[] {
    return data.filter(item => roleIds.includes(item.roleId as RoleName));
  }

  /**
   * Group data by role
   */
  static groupByRole<T extends { roleId: string }>(data: T[]): RoleData<T[]> {
    const grouped: RoleData<T[]> = {
      personal: [],
      'sky-tech': [],
      chama: [],
      'side-income': [],
    };
    
    this.ROLES.forEach(role => {
      grouped[role] = data.filter(item => item.roleId === role);
    });

    return grouped;
  }

  /**
   * Create role-specific query filters
   */
  static createRoleFilter(filter: RoleFilter): {
    where: Record<string, any>;
    orderBy?: Record<string, any>;
  } {
    const where: Record<string, any> = {};

    // Role filtering
    if (filter.roleId && filter.roleId !== 'all') {
      where.roleId = filter.roleId;
    }

    // Date range filtering
    if (filter.dateRange) {
      where.date = {
        gte: filter.dateRange.start.toISOString(),
        lte: filter.dateRange.end.toISOString(),
      };
    }

    // Active status filtering
    if (filter.includeInactive !== undefined) {
      where.isActive = filter.includeInactive ? undefined : true;
    }

    return { where };
  }

  /**
   * Calculate role-specific metrics
   */
  static calculateRoleMetrics(
    transactions: Array<{
      roleId: string;
      amount: number;
      type: 'INCOME' | 'EXPENSE';
      categoryName: string;
      date: string;
    }>,
    roleId: RoleName
  ): RoleMetrics {
    const roleTransactions = this.filterByRole(transactions, roleId);

    const income = roleTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = roleTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    const netIncome = income - expenses;
    const transactionCount = roleTransactions.length;
    const averageTransaction = transactionCount > 0 ? (income + expenses) / transactionCount : 0;

    // Calculate top categories
    const categoryTotals = roleTransactions.reduce((acc, t) => {
      const key = t.categoryName;
      if (!acc[key]) {
        acc[key] = { amount: 0, count: 0 };
      }
      acc[key].amount += t.amount;
      acc[key].count += 1;
      return acc;
    }, {} as Record<string, { amount: number; count: number }>);

    const totalAmount = income + expenses;
    const topCategories = Object.entries(categoryTotals)
      .map(([name, data]) => ({
        name,
        amount: data.amount,
        count: data.count,
        percentage: totalAmount > 0 ? (data.amount / totalAmount) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return {
      roleId,
      income,
      expenses,
      netIncome,
      transactionCount,
      averageTransaction,
      topCategories,
    };
  }

  /**
   * Validate role access
   */
  static validateRoleAccess(userRole: RoleName, targetRole: RoleName): boolean {
    // Users can access their own data
    if (userRole === targetRole) {
      return true;
    }

    // Admin role (if implemented) can access all roles
    // This would need to be extended based on your auth system
    return false;
  }

  /**
   * Get role-specific color scheme
   */
  static getRoleColors(roleId: RoleName): {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  } {
    const colorSchemes = {
      personal: {
        primary: '#10b981',
        secondary: '#059669',
        accent: '#047857',
        background: '#f0fdf4',
      },
      'sky-tech': {
        primary: '#3b82f6',
        secondary: '#2563eb',
        accent: '#1d4ed8',
        background: '#eff6ff',
      },
      chama: {
        primary: '#8b5cf6',
        secondary: '#6366f1',
        accent: '#4f46e5',
        background: '#f5f3ff',
      },
      'side-income': {
        primary: '#f59e0b',
        secondary: '#d97706',
        accent: '#b45309',
        background: '#fffbeb',
      },
    };

    return colorSchemes[roleId];
  }

  /**
   * Get role-specific categories
   */
  static getRoleCategories(roleId: RoleName, type: 'INCOME' | 'EXPENSE'): Array<{
    id: string;
    name: string;
    type: 'INCOME' | 'EXPENSE';
    roleId: RoleName;
  }> {
    const categories: Record<RoleName, {
      INCOME: Array<{
        id: string;
        name: string;
        type: 'INCOME';
        roleId: RoleName;
      }>;
      EXPENSE: Array<{
        id: string;
        name: string;
        type: 'EXPENSE';
        roleId: RoleName;
      }>;
    }> = {
      personal: {
        INCOME: [
          { id: 'salary', name: 'Salary', type: 'INCOME' as const, roleId: 'personal' as const },
          { id: 'freelance', name: 'Freelance Work', type: 'INCOME' as const, roleId: 'personal' as const },
          { id: 'investment', name: 'Investment Returns', type: 'INCOME' as const, roleId: 'personal' as const },
          { id: 'gift', name: 'Gifts', type: 'INCOME' as const, roleId: 'personal' as const },
          { id: 'other-income', name: 'Other Income', type: 'INCOME' as const, roleId: 'personal' as const },
        ],
        EXPENSE: [
          { id: 'groceries', name: 'Groceries', type: 'EXPENSE' as const, roleId: 'personal' as const },
          { id: 'transport', name: 'Transport', type: 'EXPENSE' as const, roleId: 'personal' as const },
          { id: 'utilities', name: 'Utilities', type: 'EXPENSE' as const, roleId: 'personal' as const },
          { id: 'rent', name: 'Rent/Mortgage', type: 'EXPENSE' as const, roleId: 'personal' as const },
          { id: 'entertainment', name: 'Entertainment', type: 'EXPENSE' as const, roleId: 'personal' as const },
          { id: 'healthcare', name: 'Healthcare', type: 'EXPENSE' as const, roleId: 'personal' as const },
          { id: 'education', name: 'Education', type: 'EXPENSE' as const, roleId: 'personal' as const },
          { id: 'clothing', name: 'Clothing', type: 'EXPENSE' as const, roleId: 'personal' as const },
          { id: 'other-expense', name: 'Other Expense', type: 'EXPENSE' as const, roleId: 'personal' as const },
        ],
      },
      'sky-tech': {
        INCOME: [
          { id: 'software-dev', name: 'Software Development', type: 'INCOME' as const, roleId: 'sky-tech' as const },
          { id: 'consulting', name: 'Consulting', type: 'INCOME' as const, roleId: 'sky-tech' as const },
          { id: 'support', name: 'Support Services', type: 'INCOME' as const, roleId: 'sky-tech' as const },
          { id: 'training', name: 'Training', type: 'INCOME' as const, roleId: 'sky-tech' as const },
          { id: 'other-income', name: 'Other Income', type: 'INCOME' as const, roleId: 'sky-tech' as const },
        ],
        EXPENSE: [
          { id: 'office-rent', name: 'Office Rent', type: 'EXPENSE' as const, roleId: 'sky-tech' as const },
          { id: 'salaries', name: 'Salaries', type: 'EXPENSE' as const, roleId: 'sky-tech' as const },
          { id: 'software-licenses', name: 'Software Licenses', type: 'EXPENSE' as const, roleId: 'sky-tech' as const },
          { id: 'marketing', name: 'Marketing', type: 'EXPENSE' as const, roleId: 'sky-tech' as const },
          { id: 'equipment', name: 'Equipment', type: 'EXPENSE' as const, roleId: 'sky-tech' as const },
          { id: 'travel', name: 'Travel', type: 'EXPENSE' as const, roleId: 'sky-tech' as const },
          { id: 'professional-services', name: 'Professional Services', type: 'EXPENSE' as const, roleId: 'sky-tech' as const },
          { id: 'other-expense', name: 'Other Expense', type: 'EXPENSE' as const, roleId: 'sky-tech' as const },
        ],
      },
      chama: {
        INCOME: [
          { id: 'weekly-contribution', name: 'Weekly Contribution', type: 'INCOME' as const, roleId: 'chama' as const },
          { id: 'special-contribution', name: 'Special Contribution', type: 'INCOME' as const, roleId: 'chama' as const },
          { id: 'interest', name: 'Interest', type: 'INCOME' as const, roleId: 'chama' as const },
          { id: 'other-income', name: 'Other Income', type: 'INCOME' as const, roleId: 'chama' as const },
        ],
        EXPENSE: [
          { id: 'administrative', name: 'Administrative Costs', type: 'EXPENSE' as const, roleId: 'chama' as const },
          { id: 'bank-fees', name: 'Bank Fees', type: 'EXPENSE' as const, roleId: 'chama' as const },
          { id: 'emergency', name: 'Emergency Fund', type: 'EXPENSE' as const, roleId: 'chama' as const },
          { id: 'other-expense', name: 'Other Expense', type: 'EXPENSE' as const, roleId: 'chama' as const },
        ],
      },
      'side-income': {
        INCOME: [
          { id: 'freelance-design', name: 'Freelance Design', type: 'INCOME' as const, roleId: 'side-income' as const },
          { id: 'photography', name: 'Photography', type: 'INCOME' as const, roleId: 'side-income' as const },
          { id: 'consulting', name: 'Consulting', type: 'INCOME' as const, roleId: 'side-income' as const },
          { id: 'online-courses', name: 'Online Courses', type: 'INCOME' as const, roleId: 'side-income' as const },
          { id: 'affiliate', name: 'Affiliate Marketing', type: 'INCOME' as const, roleId: 'side-income' as const },
          { id: 'other-income', name: 'Other Income', type: 'INCOME' as const, roleId: 'side-income' as const },
        ],
        EXPENSE: [
          { id: 'equipment', name: 'Equipment', type: 'EXPENSE' as const, roleId: 'side-income' as const },
          { id: 'software', name: 'Software', type: 'EXPENSE' as const, roleId: 'side-income' as const },
          { id: 'marketing', name: 'Marketing', type: 'EXPENSE' as const, roleId: 'side-income' as const },
          { id: 'training', name: 'Training', type: 'EXPENSE' as const, roleId: 'side-income' as const },
          { id: 'supplies', name: 'Supplies', type: 'EXPENSE' as const, roleId: 'side-income' as const },
          { id: 'other-expense', name: 'Other Expense', type: 'EXPENSE' as const, roleId: 'side-income' as const },
        ],
      },
    };

    return categories[roleId]?.[type] || [];
  }

  /**
   * Check if a transaction belongs to a role
   */
  static isTransactionInRole(transaction: { roleId: string }, roleId: RoleName): boolean {
    return transaction.roleId === roleId;
  }

  /**
   * Sanitize role data for display
   */
  static sanitizeRoleData<T extends Record<string, any>>(
    data: T,
    userRole: RoleName
  ): Partial<T> {
    const sanitized: any = {};

    // Only include data that belongs to the user's role
    Object.keys(data).forEach(key => {
      if (key === userRole || key === 'all') {
        sanitized[key] = data[key];
      }
    });

    return sanitized;
  }

  /**
   * Create role-specific data queries
   */
  static createRoleQuery<T extends Record<string, any>>(
    baseQuery: T,
    roleId: RoleName | 'all'
  ): T {
    if (roleId === 'all') {
      return baseQuery;
    }

    return {
      ...baseQuery,
      where: {
        ...baseQuery.where,
        roleId,
      },
    } as T;
  }

  /**
   * Validate role transition
   */
  static validateRoleTransition(fromRole: RoleName, toRole: RoleName): boolean {
    // In most cases, users can switch between roles freely
    // This can be extended based on business logic
    return true;
  }

  /**
   * Get role-specific permissions
   */
  static getRolePermissions(roleId: RoleName): {
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canExport: boolean;
    canShare: boolean;
  } {
    // Default permissions - can be extended based on user roles
    const basePermissions = {
      canView: true,
      canCreate: true,
      canEdit: true,
      canDelete: true,
      canExport: true,
      canShare: true,
    };

    // Role-specific modifications can be added here
    return basePermissions;
  }
}

// React hook for role isolation
export function useRoleIsolation(userRole: RoleName) {
  const filterByRole = React.useCallback(
    <T extends { roleId: string }>(data: T[], roleId: RoleName | 'all' = userRole) => {
      return RoleIsolation.filterByRole(data, roleId);
    },
    [userRole]
  );

  const groupByRole = React.useCallback(
    <T extends { roleId: string }>(data: T[]) => {
      return RoleIsolation.groupByRole(data);
    },
    []
  );

  const calculateMetrics = React.useCallback(
    (transactions: Array<{
      roleId: string;
      amount: number;
      type: 'INCOME' | 'EXPENSE';
      categoryName: string;
      date: string;
    }>, roleId: RoleName = userRole) => {
      return RoleIsolation.calculateRoleMetrics(transactions, roleId);
    },
    [userRole]
  );

  const getCategories = React.useCallback(
    (type: 'INCOME' | 'EXPENSE', roleId: RoleName = userRole) => {
      return RoleIsolation.getRoleCategories(roleId, type);
    },
    [userRole]
  );

  return {
    filterByRole,
    groupByRole,
    calculateMetrics,
    getCategories,
    userRole,
    validateAccess: (targetRole: RoleName) => RoleIsolation.validateRoleAccess(userRole, targetRole),
    getColors: (roleId: RoleName = userRole) => RoleIsolation.getRoleColors(roleId),
    getPermissions: (roleId: RoleName = userRole) => RoleIsolation.getRolePermissions(roleId),
  };
}
