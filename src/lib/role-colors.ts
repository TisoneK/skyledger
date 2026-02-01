import { RoleName } from '@/types/financial';

export interface RoleColorConfig {
  name: RoleName | 'all';
  displayName: string;
  primary: string;
  light: string;
  dark: string;
  border: string;
  text: string;
  background: string;
  chart: string;
}

export const roleColors: Record<RoleName | 'all', RoleColorConfig> = {
  personal: {
    name: 'personal',
    displayName: 'Personal',
    primary: '#3b82f6',
    light: '#dbeafe',
    dark: '#1d4ed8',
    border: '#3b82f6',
    text: 'text-blue-500',
    background: 'bg-blue-50',
    chart: '#3b82f6',
  },
  'sky-tech': {
    name: 'sky-tech',
    displayName: 'Sky Tech',
    primary: '#22c55e',
    light: '#dcfce7',
    dark: '#16a34a',
    border: '#22c55e',
    text: 'text-green-500',
    background: 'bg-green-50',
    chart: '#22c55e',
  },
  chama: {
    name: 'chama',
    displayName: 'Chama',
    primary: '#f59e0b',
    light: '#fef3c7',
    dark: '#d97706',
    border: '#f59e0b',
    text: 'text-amber-500',
    background: 'bg-amber-50',
    chart: '#f59e0b',
  },
  'side-income': {
    name: 'side-income',
    displayName: 'Side Income',
    primary: '#a855f7',
    light: '#faf5ff',
    dark: '#9333ea',
    border: '#a855f7',
    text: 'text-purple-500',
    background: 'bg-purple-50',
    chart: '#a855f7',
  },
  all: {
    name: 'all',
    displayName: 'All Roles',
    primary: '#6b7280',
    light: '#f3f4f6',
    dark: '#4b5563',
    border: '#6b7280',
    text: 'text-gray-500',
    background: 'bg-gray-50',
    chart: '#6b7280',
  },
};

export function getRoleColor(role: RoleName | 'all'): RoleColorConfig {
  const config = roleColors[role];
  if (!config) {
    // Return a default config if role is not found
    return roleColors['all'];
  }
  return config;
}

export function getRoleColorClass(role: RoleName | 'all', type: 'text' | 'bg' | 'border' | 'chart'): string {
  const config = getRoleColor(role);
  
  switch (type) {
    case 'text':
      return config.text;
    case 'bg':
      return config.background;
    case 'border':
      return `border-${config.primary}`;
    case 'chart':
      return config.chart;
    default:
      return config.text;
  }
}

export function getRoleGradient(role: RoleName | 'all'): string {
  const config = getRoleColor(role);
  return `linear-gradient(135deg, ${config?.primary || '#6b7280'} 0%, ${config?.dark || '#4b5563'} 100%)`;
}

export function getRoleBadgeClasses(role: RoleName | 'all'): string {
  const config = getRoleColor(role);
  return `
    inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
    ${config?.background || 'bg-gray-50'} ${config?.text || 'text-gray-500'} border ${config?.border || '#6b7280'}/20
  `;
}

export function getRoleCardClasses(role: RoleName | 'all'): string {
  const config = getRoleColor(role);
  return `
    rounded-lg border bg-card p-6 transition-all hover:shadow-md
    ${config?.border || '#6b7280'}/20 hover:${config?.border || '#6b7280'}/40
  `;
}

export function getRoleButtonClasses(role: RoleName | 'all', variant: 'solid' | 'outline' | 'ghost' = 'solid'): string {
  const config = getRoleColor(role);
  
  switch (variant) {
    case 'solid':
      return `
        bg-[${config?.primary || '#6b7280'}] text-white hover:bg-[${config?.dark || '#4b5563'}]
        focus:ring-2 focus:ring-[${config?.primary || '#6b7280'}/50]
      `;
    case 'outline':
      return `
        border [${config?.border || '#6b7280'}] ${config?.text || 'text-gray-500'} hover:${config?.background || 'bg-gray-50'}
        focus:ring-2 focus:ring-[${config?.primary || '#6b7280'}/50]
      `;
    case 'ghost':
      return `
        ${config?.text || 'text-gray-500'} hover:${config?.background || 'bg-gray-50'}
      `;
    default:
      return getRoleButtonClasses(role, 'solid');
  }
}

// Chart color utilities
export function getRoleChartColors(role: RoleName | 'all'): {
  primary: string;
  secondary: string;
  background: string;
} {
  const config = getRoleColor(role);
  return {
    primary: config?.chart || '#6b7280',
    secondary: config?.light || '#f3f4f6',
    background: config?.background || 'bg-gray-50',
  };
}

// Status color utilities for financial metrics
export function getMetricColor(value: number, target: number): {
  color: string;
  status: 'positive' | 'negative' | 'neutral';
  percentage: number;
} {
  const percentage = (value / target) * 100;
  
  if (percentage >= 100) {
    return {
      color: 'text-green-500',
      status: 'positive',
      percentage,
    };
  } else if (percentage >= 75) {
    return {
      color: 'text-amber-500',
      status: 'neutral',
      percentage,
    };
  } else {
    return {
      color: 'text-red-500',
      status: 'negative',
      percentage,
    };
  }
}

// Tuesday-specific styling for Chama
export function getTuesdayAlertClasses(isTuesday: boolean): string {
  if (!isTuesday) return '';
  
  return `
    animate-pulse border-2 border-amber-200 bg-amber-50
    shadow-lg shadow-amber-100
  `;
}
