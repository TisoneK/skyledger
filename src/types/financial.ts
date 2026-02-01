export type TransactionType = 'INCOME' | 'EXPENSE';

export type RoleName = 'personal' | 'business' | 'chama' | 'sideincome';

export interface FinancialRole {
  id: string;
  name: RoleName;
  displayName: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  roleId: string;
  type: TransactionType;
  createdAt: Date;
  updatedAt: Date;
  role?: FinancialRole;
}

export interface Transaction {
  id: string;
  amount: number;
  description?: string;
  date: Date;
  type: TransactionType;
  roleId: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  role?: FinancialRole;
  category?: Category;
}

export interface ChamaContribution {
  id: string;
  week: string; // Format: YYYY-WXX
  amount: number;
  targetAmount: number;
  date: Date;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WeeklySummary {
  id: string;
  week: string; // Format: YYYY-WXX
  roleId: string;
  totalIncome: number;
  totalExpense: number;
  netIncome: number;
  createdAt: Date;
  updatedAt: Date;
  role?: FinancialRole;
}

export interface WeekData {
  week: string;
  startDate: Date;
  endDate: Date;
  income: number;
  expenses: number;
  netIncome: number;
  transactions: Transaction[];
  roleSummaries: WeeklySummary[];
}

export interface RoleSummary {
  role: FinancialRole;
  income: number;
  expenses: number;
  netIncome: number;
  transactionCount: number;
  categories: Category[];
}

export interface DashboardData {
  currentWeek: WeekData;
  previousWeek?: WeekData;
  roleSummaries: RoleSummary[];
  chamaContribution?: ChamaContribution;
  isTuesday: boolean;
}

// UI State Types
export type SyncStatus = 'synced' | 'syncing' | 'offline' | 'sync-error';

export interface ConnectionState {
  isOnline: boolean;
  syncStatus: SyncStatus;
  lastSyncTime?: Date;
  pendingOperations: number;
}

export interface UIState {
  selectedRole: RoleName | 'all';
  currentWeek: string;
  viewMode: 'dashboard' | 'transactions' | 'analytics';
  sidebarOpen: boolean;
  darkMode: boolean;
}

// Form Types
export interface TransactionFormData {
  amount: string;
  description: string;
  date: string;
  type: TransactionType;
  roleId: string;
  categoryId: string;
}

export interface ChamaContributionFormData {
  amount: string;
  week: string;
  date: string;
  note?: string;
}

// Chart Data Types
export interface ChartDataPoint {
  name: string;
  value: number;
  fill?: string;
}

export interface TrendData {
  week: string;
  income: number;
  expenses: number;
  netIncome: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

// Weekly Assessment Types
export interface WeeklyAssessment {
  week: string;
  overallScore: number; // 0-100
  movingForward: boolean;
  factors: {
    income: boolean;
    expenses: boolean;
    savings: boolean;
    consistency: boolean;
  };
  recommendations: string[];
}

// Chama Target Tracking
export interface ChamaTarget {
  weeklyTarget: number; // 250
  currentWeek: string;
  currentAmount: number;
  progress: number; // percentage
  onTrack: boolean;
  weeklyHistory: ChamaContribution[];
}
