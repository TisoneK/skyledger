import React from 'react';
import { User, Users, TrendingUp, Briefcase, Crown } from 'lucide-react';

export type RoleType = 'personal' | 'chama' | 'side-income' | 'all-roles' | 'sky-tech';

export interface RoleIconProps {
  type: RoleType;
  size?: number;
  className?: string;
  alt?: string;
  fallback?: React.ReactNode;
}

const roleIconMap: Record<RoleType, string> = {
  personal: '/icons/roles/personal.png',
  chama: '/icons/roles/chama.png',
  'side-income': '/icons/roles/side-income.png',
  'all-roles': '/icons/roles/all-roles.png',
  'sky-tech': '/icons/roles/sky-tech.png',
};

const fallbackIconMap: Record<RoleType, React.ComponentType<any>> = {
  personal: User,
  chama: Users,
  'side-income': TrendingUp,
  'all-roles': Crown,
  'sky-tech': Briefcase,
};

export const RoleIcon: React.FC<RoleIconProps> = ({
  type,
  size = 24,
  className = '',
  alt,
  fallback,
}) => {
  const [imageError, setImageError] = React.useState(false);
  const iconPath = roleIconMap[type];
  const FallbackComponent = fallbackIconMap[type];

  const defaultAlt = `${type.replace('-', ' ')} icon`;

  if (imageError || !iconPath) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <FallbackComponent size={size} className={className} />;
  }

  return (
    <img
      src={iconPath}
      alt={alt || defaultAlt}
      width={size}
      height={size}
      className={className}
      onError={() => setImageError(true)}
    />
  );
};

export default RoleIcon;
