'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Settings, 
  ChevronDown,
  DollarSign,
  Briefcase,
  PiggyBank,
  TrendingUp
} from 'lucide-react';
import { getRoleCardClasses, getRoleBadgeClasses } from '@/lib/role-colors';
import { RoleIsolation, type RoleName } from '@/lib/role-isolation';

interface RoleContextType {
  currentRole: RoleName;
  setCurrentRole: (role: RoleName) => void;
  roleHistory: RoleName[];
  switchRole: (role: RoleName) => void;
  getRoleData: <T>(key: string) => T;
  setRoleData: (key: string, data: any) => void;
  clearRoleData: (key: string) => void;
}

interface RoleSwitcherProps {
  children: ReactNode;
  onRoleChange?: (role: RoleName) => void;
  defaultRole?: RoleName;
  showHistory?: boolean;
  compact?: boolean;
  className?: string;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function useRoleContext(): RoleContextType {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRoleContext must be used within a RoleProvider');
  }
  return context;
}

export function RoleProvider({ 
  children, 
  onRoleChange,
  defaultRole = 'personal',
  showHistory = true,
  compact = false,
  className 
}: RoleSwitcherProps) {
  const [currentRole, setCurrentRoleState] = useState<RoleName>(defaultRole);
  const [roleHistory, setRoleHistory] = useState<RoleName[]>([defaultRole]);
  const [roleData, setRoleDataState] = useState<Record<string, any>>({});

  const setCurrentRole = useCallback((role: RoleName) => {
    setCurrentRoleState(role);
    setRoleHistory(prev => {
      const newHistory = prev.filter(r => r !== role);
      return [...newHistory, role];
    });
    onRoleChange?.(role);
  }, [onRoleChange]);

  const switchRole = useCallback((role: RoleName) => {
    setCurrentRole(role);
  }, []);

  const getRoleData = useCallback(<T>(key: string) => {
    return roleData[key] || null;
  }, [roleData]);

  const setRoleData = useCallback((key: string, data: any) => {
    setRoleDataState(prev => ({
      ...prev,
      [key]: data,
    }));
  }, []);

  const clearRoleData = useCallback((key: string) => {
    setRoleDataState(prev => {
      const newData = { ...prev };
      delete newData[key];
      return newData;
    });
  }, []);

  const value: RoleContextType = {
    currentRole,
    setCurrentRole,
    roleHistory,
    switchRole,
    getRoleData,
    setRoleData,
    clearRoleData,
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
}

interface RoleSwitcherComponentProps {
  currentRole: RoleName;
  onRoleChange: (role: RoleName) => void;
  showHistory?: boolean;
  compact?: boolean;
  className?: string;
}

export function RoleSwitcher({ 
  currentRole, 
  onRoleChange, 
  showHistory = true, 
  compact = false,
  className 
}: RoleSwitcherComponentProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleName>(currentRole);

  const roles = [
    {
      id: 'personal' as RoleName,
      name: 'Personal',
      icon: <DollarSign className="h-4 w-4" />,
      description: 'Personal finances and expenses',
      color: 'text-green-600',
    },
    {
      id: 'sky-tech' as RoleName,
      name: 'Sky Tech',
      icon: <Briefcase className="h-4 w-4" />,
      description: 'Business operations and revenue',
      color: 'text-blue-600',
    },
    {
      id: 'chama' as RoleName,
      name: 'Chama',
      icon: <PiggyBank className="h-4 w-4" />,
      description: 'Group savings and investments',
      color: 'text-purple-600',
    },
    {
      id: 'side-income' as RoleName,
      name: 'Side Income',
      icon: <TrendingUp className="h-4 w-4" />,
      description: 'Additional income streams',
      color: 'text-orange-600',
    },
  ];

  const handleRoleSelect = (roleId: RoleName) => {
    setSelectedRole(roleId);
    setIsExpanded(false);
  };

  const handleRoleConfirm = () => {
    onRoleChange(selectedRole);
    setIsExpanded(false);
  };

  const handleRoleCancel = () => {
    setSelectedRole(currentRole);
    setIsExpanded(false);
  };

  const handleHistorySelect = (roleId: RoleName) => {
    setSelectedRole(roleId);
    onRoleChange(roleId);
    setIsExpanded(false);
  };

  const getRoleConfig = (roleId: RoleName) => {
    return getRoleCardClasses(roleId);
  };

  const getBadgeConfig = (roleId: RoleName) => {
    return getRoleBadgeClasses(roleId);
  };

  if (compact) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2"
        >
          {roles.find(r => r.id === currentRole)?.icon}
          <span className="text-sm font-medium">
            {roles.find(r => r.id === currentRole)?.name}
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`} />
        </Button>
        
        {isExpanded && (
          <div className="absolute top-full left-0 mt-2 bg-background border rounded-lg shadow-lg z-50 min-w-[200px]">
            <div className="p-2">
              <div className="text-sm font-medium mb-2">Switch Role</div>
              <div className="space-y-1">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors ${
                      role.id === selectedRole ? 'bg-muted' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {role.icon}
                      <span>{role.name}</span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-between mt-2 pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRoleCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleRoleConfirm}
                  className="flex-1"
                >
                  Switch
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className={getRoleConfig(currentRole)}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Role Switcher</span>
          <Badge className={getBadgeConfig(currentRole)}>
            {currentRole.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Role Display */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${getRoleConfig(currentRole)}`}>
              {roles.find(r => r.id === currentRole)?.icon}
            </div>
            <div>
              <div className="font-medium">
                {roles.find(r => r.id === currentRole)?.name}
              </div>
              <div className="text-sm text-muted-foreground">
                {roles.find(r => r.id === currentRole)?.description}
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2"
          >
            <Settings className="h-4 w-4" />
            <span>Change Role</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`} />
          </Button>
        </div>

        {/* Role Selection Dropdown */}
        {isExpanded && (
          <div className="space-y-2">
            {/* Available Roles */}
            <div className="p-2 text-sm text-muted-foreground font-medium">Switch to:</div>
            <div className="space-y-2">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className={`w-full text-left px-4 py-3 hover:bg-muted rounded-lg transition-colors ${
                    role.id === selectedRole ? 'bg-muted' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getRoleConfig(role.id)}`}>
                      {role.icon}
                    </div>
                    <div>
                      <div className="font-medium">{role.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {role.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRoleCancel}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleRoleConfirm}
                className="flex-1"
              >
                Switch to {selectedRole}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { RoleSwitcher, RoleProvider, useRoleContext };
