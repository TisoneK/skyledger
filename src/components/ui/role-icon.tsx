import React from 'react';
import { User, Users, TrendingUp, Briefcase, Crown } from 'lucide-react';
import { IconContext, getIconSize, getValidatedIconSize, shouldUseReducedMotion } from '@/lib/icon-sizes';
import { pixelsToTailwindClass, generateIconClasses } from '@/lib/icon-class-utils';

export type RoleType = 'personal' | 'chama' | 'side-income' | 'all-roles' | 'sky-tech';

export interface RoleIconProps {
  type: RoleType;
  size?: number;
  context?: IconContext;
  className?: string;
  alt?: string;
  fallback?: React.ReactNode;
  responsive?: boolean;
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

/**
 * Detect context from CSS classes and component hierarchy
 */
function detectContext(className: string): IconContext | null {
  const classes = className.split(' ');
  
  // Check for context indicators in CSS classes
  if (classes.some(cls => cls.includes('sidebar') || cls.includes('nav'))) {
    return 'sidebar';
  }
  if (classes.some(cls => cls.includes('card') || cls.includes('metric'))) {
    return 'card';
  }
  if (classes.some(cls => cls.includes('compact') || cls.includes('tight'))) {
    return 'compact';
  }
  if (classes.some(cls => cls.includes('large') || cls.includes('featured'))) {
    return 'large';
  }
  
  return null;
}

export const RoleIcon: React.FC<RoleIconProps> = ({
  type,
  size,
  context,
  className = '',
  alt,
  fallback,
  responsive = false,
}) => {
  const [imageError, setImageError] = React.useState(false);
  const iconPath = roleIconMap[type];
  const FallbackComponent = fallbackIconMap[type];

  const defaultAlt = `${type.replace('-', ' ')} icon`;

  // Determine the final size to use
  let finalSize: number;
  let sizeClasses: string = '';

  if (size) {
    // Backward compatibility: explicit size prop takes precedence
    finalSize = size;
    sizeClasses = pixelsToTailwindClass(size);
  } else if (context) {
    // Use provided context
    try {
      finalSize = getIconSize(context, responsive);
      sizeClasses = pixelsToTailwindClass(finalSize);
    } catch (error) {
      console.error(`Invalid context "${context}":`, error);
      finalSize = 16; // fallback size
      sizeClasses = pixelsToTailwindClass(finalSize);
    }
  } else {
    // Auto-detect context from className
    const detectedContext = detectContext(className);
    if (detectedContext) {
      try {
        finalSize = getIconSize(detectedContext, responsive);
        sizeClasses = pixelsToTailwindClass(finalSize);
      } catch (error) {
        console.error(`Invalid detected context "${detectedContext}":`, error);
        finalSize = 16;
        sizeClasses = pixelsToTailwindClass(finalSize);
      }
    } else {
      // Default fallback
      finalSize = 16;
      sizeClasses = pixelsToTailwindClass(finalSize);
    }
  }

  // Add transition classes unless reduced motion is preferred
  const transitionClasses = shouldUseReducedMotion() ? '' : 'transition-all duration-200';
  const combinedClasses = `${sizeClasses} ${transitionClasses} ${className}`.trim();

  if (imageError || !iconPath) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <FallbackComponent size={finalSize} className={combinedClasses} />;
  }

  return (
    <img
      src={iconPath}
      alt={alt || defaultAlt}
      width={finalSize}
      height={finalSize}
      className={combinedClasses}
      onError={() => setImageError(true)}
    />
  );
};

export default RoleIcon;
