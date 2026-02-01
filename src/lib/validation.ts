// Validation utilities for SkyLedger

import React from 'react';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ValidationRule<T> {
  field: string;
  validate: (value: T) => boolean;
  message: string;
  warning?: boolean;
}

// Common validation rules
export const validationRules = {
  required: (field: string): ValidationRule<any> => ({
    field,
    validate: (value) => value !== null && value !== undefined && value !== '',
    message: `${field} is required`,
  }),

  positiveNumber: (field: string): ValidationRule<number> => ({
    field,
    validate: (value) => value > 0,
    message: `${field} must be a positive number`,
  }),

  nonNegativeNumber: (field: string): ValidationRule<number> => ({
    field,
    validate: (value) => value >= 0,
    message: `${field} must be a non-negative number`,
  }),

  maxLength: (field: string, max: number): ValidationRule<string> => ({
    field,
    validate: (value) => value.length <= max,
    message: `${field} must be ${max} characters or less`,
  }),

  minLength: (field: string, min: number): ValidationRule<string> => ({
    field,
    validate: (value) => value.length >= min,
    message: `${field} must be at least ${min} characters`,
  }),

  email: (field: string): ValidationRule<string> => ({
    field,
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: `${field} must be a valid email address`,
  }),

  date: (field: string): ValidationRule<string> => ({
    field,
    validate: (value) => !isNaN(Date.parse(value)),
    message: `${field} must be a valid date`,
  }),

  amount: (field: string): ValidationRule<number> => ({
    field,
    validate: (value) => value >= 0 && value <= 999999999.99,
    message: `${field} must be between 0 and 999,999,999.99`,
    warning: true,
  }),

  futureDate: (field: string): ValidationRule<string> => ({
    field,
    validate: (value) => new Date(value) >= new Date(new Date().toDateString()),
    message: `${field} must be today or in the future`,
  }),
};

// Transaction validation
export interface TransactionFormData {
  amount: string;
  description: string;
  date: string;
  type: 'INCOME' | 'EXPENSE';
  roleId: string;
  categoryId: string;
}

export function validateTransaction(data: TransactionFormData): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Amount validation
  if (!data.amount) {
    errors.push('Amount is required');
  } else {
    const amount = parseFloat(data.amount);
    if (isNaN(amount)) {
      errors.push('Amount must be a valid number');
    } else if (amount <= 0) {
      errors.push('Amount must be greater than 0');
    } else if (amount > 999999999.99) {
      warnings.push('Amount seems unusually large');
    }
  }

  // Description validation
  if (!data.description.trim()) {
    errors.push('Description is required');
  } else if (data.description.length > 255) {
    errors.push('Description must be 255 characters or less');
  }

  // Date validation
  if (!data.date) {
    errors.push('Date is required');
  } else {
    const date = new Date(data.date);
    if (isNaN(date.getTime())) {
      errors.push('Date must be a valid date');
    } else if (date > new Date()) {
      warnings.push('Transaction date is in the future');
    }
  }

  // Role validation
  if (!data.roleId) {
    errors.push('Financial role is required');
  }

  // Category validation
  if (!data.categoryId) {
    errors.push('Category is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// Chama contribution validation
export interface ChamaContributionData {
  amount: string;
  week: string;
  note?: string;
}

export function validateChamaContribution(data: ChamaContributionData): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Amount validation
  if (!data.amount) {
    errors.push('Amount is required');
  } else {
    const amount = parseFloat(data.amount);
    if (isNaN(amount)) {
      errors.push('Amount must be a valid number');
    } else if (amount <= 0) {
      errors.push('Amount must be greater than 0');
    } else if (amount > 10000) {
      warnings.push('Chama contribution seems unusually large');
    }
  }

  // Week validation
  if (!data.week) {
    errors.push('Week is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// Category validation
export interface CategoryData {
  name: string;
  type: 'INCOME' | 'EXPENSE';
  roleId: string;
}

export function validateCategory(data: CategoryData): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Name validation
  if (!data.name.trim()) {
    errors.push('Category name is required');
  } else if (data.name.length > 50) {
    errors.push('Category name must be 50 characters or less');
  } else if (!/^[a-zA-Z0-9\s\-_]+$/.test(data.name)) {
    errors.push('Category name can only contain letters, numbers, spaces, hyphens, and underscores');
  }

  // Type validation
  if (!data.type || !['INCOME', 'EXPENSE'].includes(data.type)) {
    errors.push('Category type is required');
  }

  // Role validation
  if (!data.roleId) {
    errors.push('Financial role is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// Generic validation function
export function validate<T>(data: T, rules: ValidationRule<T>[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const rule of rules) {
    try {
      const value = (data as any)[rule.field];
      if (!rule.validate(value)) {
        if (rule.warning) {
          warnings.push(rule.message);
        } else {
          errors.push(rule.message);
        }
      }
    } catch (error) {
      errors.push(`Error validating ${rule.field}: ${error}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// Sanitization utilities
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove potential JavaScript
    .replace(/on\w+=/gi, ''); // Remove potential event handlers
}

export function sanitizeNumber(input: string): number {
  const cleaned = input.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

export function sanitizeDate(input: string): string {
  const cleaned = input.replace(/[^\d-]/g, '');
  const date = new Date(cleaned);
  return isNaN(date.getTime()) ? new Date().toISOString().split('T')[0] : cleaned;
}

// Async validation utilities
export async function validateUniqueCategory(
  name: string,
  roleId: string,
  excludeId?: string
): Promise<boolean> {
  // This would typically make an API call to check uniqueness
  // For now, return true (assume it's unique)
  return true;
}

export async function validateUserRole(
  userId: string,
  roleId: string
): Promise<boolean> {
  // This would typically check if the user has access to the role
  // For now, return true (assume access is granted)
  return true;
}

// Form validation hook (for React components)
export function useFormValidation<T>(
  initialValues: T,
  validationRules: ValidationRule<T>[]
) {
  const [values, setValues] = React.useState<T>(initialValues);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [warnings, setWarnings] = React.useState<string[]>([]);
  const [isValid, setIsValid] = React.useState(false);

  const validateField = React.useCallback((field: keyof T, value: any) => {
    const fieldRules = validationRules.filter(rule => rule.field === field);
    if (fieldRules.length === 0) return;

    const result = validate({ ...values, [field]: value }, fieldRules);
    
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field as string];
      
      if (!result.isValid) {
        result.errors.forEach(error => {
          const fieldName = validationRules.find(rule => error.includes(rule.field))?.field;
          if (fieldName) {
            newErrors[fieldName] = error;
          }
        });
      }
      
      return newErrors;
    });

    setWarnings(prev => {
      const newWarnings = [...prev];
      result.warnings.forEach(warning => {
        if (!newWarnings.includes(warning)) {
          newWarnings.push(warning);
        }
      });
      return newWarnings;
    });
  }, [values, validationRules]);

  const validateForm = React.useCallback(() => {
    const result = validate(values, validationRules);
    
    const newErrors: Record<string, string> = {};
    result.errors.forEach(error => {
      const fieldName = validationRules.find(rule => error.includes(rule.field))?.field;
      if (fieldName) {
        newErrors[fieldName] = error;
      }
    });
    
    setErrors(newErrors);
    setWarnings(result.warnings);
    setIsValid(result.isValid);
    
    return result;
  }, [values, validationRules]);

  return {
    values,
    setValues,
    errors,
    warnings,
    isValid,
    validateField,
    validateForm,
  };
}
