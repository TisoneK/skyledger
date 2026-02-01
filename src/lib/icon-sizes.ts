/**
 * Icon Size Configuration System
 * 
 * Provides centralized icon size management with contextual sizing
 * and customization support for role icons across all UI components.
 */

import { getAccessibilityAdjustedSize, prefersReducedMotion } from './accessibility-utils';

export type IconContext = 'sidebar' | 'card' | 'compact' | 'large';

export interface IconSizeConfig {
  [key: string]: number;
}

export interface IconSizeConfiguration {
  sizes: IconSizeConfig;
  scale: number;
  responsive: {
    mobile: Partial<IconSizeConfig>;
    desktop: Partial<IconSizeConfig>;
  };
  accessibility: {
    enableHighContrastAdjustment: boolean;
    enableReducedMotion: boolean;
  };
}

/**
 * Default icon size configuration
 * - sidebar: 24px - Navigation and main UI elements
 * - card: 24px - Performance cards and content areas (increased from 20px)
 * - compact: 16px - Tight spaces and minimal UI
 * - large: 32px - Featured elements and accessibility
 */
export const defaultIconSizes: IconSizeConfig = {
  sidebar: 24,
  card: 24,
  compact: 16,
  large: 32,
};

/**
 * Current icon size configuration
 * Can be customized at runtime or through theme system
 */
export let iconSizeConfiguration: IconSizeConfiguration = {
  sizes: { ...defaultIconSizes },
  scale: 1,
  responsive: {
    mobile: {
      compact: 14, // Smaller on mobile for tight spaces
      card: 20,    // Slightly smaller cards on mobile (was 18)
    },
    desktop: {
      large: 36,   // Larger on desktop for prominence
    },
  },
  accessibility: {
    enableHighContrastAdjustment: true,
    enableReducedMotion: true,
  },
};

/**
 * Get icon size for a specific context
 * @param context - The UI context (sidebar, card, compact, large)
 * @param responsive - Whether to consider responsive sizing
 * @param accessibilityAware - Whether to apply accessibility adjustments
 * @returns Size in pixels
 */
export function getIconSize(
  context: IconContext,
  responsive: boolean = false,
  accessibilityAware: boolean = true
): number {
  if (!iconSizeConfiguration.sizes[context]) {
    throw new Error(`Invalid icon context: ${context}`);
  }

  let baseSize = iconSizeConfiguration.sizes[context];
  
  // Apply scaling
  baseSize = baseSize * iconSizeConfiguration.scale;
  
  // Apply responsive adjustments if enabled
  if (responsive) {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const responsiveConfig = isMobile 
      ? iconSizeConfiguration.responsive.mobile 
      : iconSizeConfiguration.responsive.desktop;
    
    if (responsiveConfig[context]) {
      baseSize = responsiveConfig[context]!;
    }
  }
  
  // Apply accessibility adjustments if enabled
  if (accessibilityAware && iconSizeConfiguration.accessibility.enableHighContrastAdjustment) {
    baseSize = getAccessibilityAdjustedSize(baseSize);
  }
  
  return Math.round(baseSize);
}

/**
 * Get icon size for context with validation
 * @param context - The UI context
 * @param responsive - Whether to use responsive sizing
 * @param accessibilityAware - Whether to apply accessibility adjustments
 * @returns Size in pixels or throws error for invalid context
 */
export function getValidatedIconSize(
  context: string,
  responsive: boolean = false,
  accessibilityAware: boolean = true
): number {
  const validContexts: IconContext[] = ['sidebar', 'card', 'compact', 'large'];
  
  if (!validContexts.includes(context as IconContext)) {
    throw new Error(
      `Invalid icon context "${context}". Valid contexts: ${validContexts.join(', ')}`
    );
  }
  
  return getIconSize(context as IconContext, responsive, accessibilityAware);
}

/**
 * Update icon size configuration
 * @param newConfig - Partial configuration to merge
 */
export function updateIconSizeConfiguration(
  newConfig: Partial<IconSizeConfiguration>
): void {
  iconSizeConfiguration = {
    ...iconSizeConfiguration,
    ...newConfig,
    sizes: {
      ...iconSizeConfiguration.sizes,
      ...(newConfig.sizes || {}),
    },
    responsive: {
      mobile: {
        ...iconSizeConfiguration.responsive.mobile,
        ...(newConfig.responsive?.mobile || {}),
      },
      desktop: {
        ...iconSizeConfiguration.responsive.desktop,
        ...(newConfig.responsive?.desktop || {}),
      },
    },
    accessibility: {
      ...iconSizeConfiguration.accessibility,
      ...(newConfig.accessibility || {}),
    },
  };
}

/**
 * Reset icon size configuration to defaults
 */
export function resetIconSizeConfiguration(): void {
  iconSizeConfiguration = {
    sizes: { ...defaultIconSizes },
    scale: 1,
    responsive: {
      mobile: {
        compact: 14,
        card: 20,
      },
      desktop: {
        large: 36,
      },
    },
    accessibility: {
      enableHighContrastAdjustment: true,
      enableReducedMotion: true,
    },
  };
}

/**
 * Scale all icon sizes by a factor
 * @param factor - Scaling factor (1.0 = no change, 1.2 = 20% larger)
 */
export function scaleIconSizes(factor: number): void {
  if (factor <= 0 || factor > 3) {
    throw new Error('Scale factor must be between 0 and 3');
  }
  iconSizeConfiguration.scale = factor;
}

/**
 * Get current scale factor
 */
export function getIconScale(): number {
  return iconSizeConfiguration.scale;
}

/**
 * Validate size is within acceptable range
 * @param size - Size in pixels
 * @returns True if size is valid
 */
export function isValidIconSize(size: number): boolean {
  return size >= 12 && size <= 64;
}

/**
 * Get all available contexts
 */
export function getAvailableContexts(): IconContext[] {
  return ['sidebar', 'card', 'compact', 'large'];
}

/**
 * Check if reduced motion should be applied
 */
export function shouldUseReducedMotion(): boolean {
  return iconSizeConfiguration.accessibility.enableReducedMotion && prefersReducedMotion();
}
