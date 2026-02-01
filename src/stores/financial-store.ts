import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Transaction, 
  Category, 
  FinancialRole, 
  WeeklySummary, 
  ChamaContribution,
  DashboardData,
  RoleName,
  WeekData,
  RoleSummary 
} from '@/types/financial';

interface FinancialStore {
  // Data
  roles: FinancialRole[];
  categories: Category[];
  transactions: Transaction[];
  weeklySummaries: WeeklySummary[];
  chamaContributions: ChamaContribution[];
  currentDashboardData?: DashboardData;
  
  // Loading states
  isLoading: boolean;
  error?: string;
  
  // Actions
  setRoles: (roles: FinancialRole[]) => void;
  setCategories: (categories: Category[]) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setWeeklySummaries: (summaries: WeeklySummary[]) => void;
  setChamaContributions: (contributions: ChamaContribution[]) => void;
  setCurrentDashboardData: (data: DashboardData) => void;
  
  // CRUD operations
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  
  addChamaContribution: (contribution: Omit<ChamaContribution, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateChamaContribution: (id: string, updates: Partial<ChamaContribution>) => void;
  
  // Utility methods
  getTransactionsByRole: (roleId: string) => Transaction[];
  getTransactionsByWeek: (week: string) => Transaction[];
  getCategoriesByRole: (roleId: string) => Category[];
  calculateWeekSummary: (week: string, roleId: string) => WeekData;
  
  // Loading and error handling
  setLoading: (loading: boolean) => void;
  setError: (error?: string) => void;
  clearError: () => void;
}

export const useFinancialStore = create<FinancialStore>()(
  persist(
    (set, get) => ({
      // Initial state
      roles: [],
      categories: [],
      transactions: [],
      weeklySummaries: [],
      chamaContributions: [],
      currentDashboardData: undefined,
      isLoading: false,
      error: undefined,
      
      // Setters
      setRoles: (roles) => set({ roles }),
      setCategories: (categories) => set({ categories }),
      setTransactions: (transactions) => set({ transactions }),
      setWeeklySummaries: (weeklySummaries) => set({ weeklySummaries }),
      setChamaContributions: (chamaContributions) => set({ chamaContributions }),
      setCurrentDashboardData: (currentDashboardData) => set({ currentDashboardData }),
      
      // Transaction CRUD
      addTransaction: (transactionData) => {
        const newTransaction: Transaction = {
          ...transactionData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          transactions: [...state.transactions, newTransaction],
        }));
      },
      
      updateTransaction: (id, updates) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t
          ),
        }));
      },
      
      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }));
      },
      
      // Chama CRUD
      addChamaContribution: (contributionData) => {
        const newContribution: ChamaContribution = {
          ...contributionData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          chamaContributions: [...state.chamaContributions, newContribution],
        }));
      },
      
      updateChamaContribution: (id, updates) => {
        set((state) => ({
          chamaContributions: state.chamaContributions.map((c) =>
            c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c
          ),
        }));
      },
      
      // Utility methods
      getTransactionsByRole: (roleId) => {
        return get().transactions.filter((t) => t.roleId === roleId);
      },
      
      getTransactionsByWeek: (week) => {
        return get().transactions.filter((t) => {
          // Simple week filtering - in real implementation, use proper date logic
          return t.date.toString().includes(week);
        });
      },
      
      getCategoriesByRole: (roleId) => {
        return get().categories.filter((c) => c.roleId === roleId);
      },
      
      calculateWeekSummary: (week, roleId) => {
        const { transactions } = get();
        const roleTransactions = transactions.filter(
          (t) => t.roleId === roleId && t.date.toString().includes(week)
        );
        
        const income = roleTransactions
          .filter((t) => t.type === 'INCOME')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const expenses = roleTransactions
          .filter((t) => t.type === 'EXPENSE')
          .reduce((sum, t) => sum + t.amount, 0);
        
        return {
          week,
          startDate: new Date(), // Calculate actual week start
          endDate: new Date(),   // Calculate actual week end
          income,
          expenses,
          netIncome: income - expenses,
          transactions: roleTransactions,
          roleSummaries: [], // Calculate from weeklySummaries
        };
      },
      
      // Loading and error handling
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: undefined }),
    }),
    {
      name: 'financial-store',
      partialize: (state) => ({
        transactions: state.transactions.slice(-100), // Keep last 100 transactions
        roles: state.roles,
        categories: state.categories,
      }),
    }
  )
);
