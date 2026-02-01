/**
 * CSS Class Generation Utilities for Icons
 * 
 * Converts pixel sizes to Tailwind CSS classes and provides
 * caching for performance optimization.
 */

// Cache for generated classes to avoid repeated calculations
const classCache = new Map<string, string>();

/**
 * Convert pixel size to Tailwind width/height class
 * @param size - Size in pixels
 * @returns Tailwind class string (e.g., "h-6 w-6")
 */
export function pixelsToTailwindClass(size: number): string {
  const cacheKey = `size-${size}`;
  
  if (classCache.has(cacheKey)) {
    return classCache.get(cacheKey)!;
  }
  
  let tailwindClass: string;
  
  // Map common sizes to Tailwind classes
  const sizeMap: Record<number, string> = {
    12: 'h-3 w-3',
    14: 'h-3.5 w-3.5',
    16: 'h-4 w-4',
    18: 'h-4.5 w-4.5',
    20: 'h-5 w-5',
    22: 'h-5.5 w-5.5',
    24: 'h-6 w-6',
    26: 'h-6.5 w-6.5',
    28: 'h-7 w-7',
    30: 'h-7.5 w-7.5',
    32: 'h-8 w-8',
    36: 'h-9 w-9',
    40: 'h-10 w-10',
    44: 'h-11 w-11',
    48: 'h-12 w-12',
    52: 'h-13 w-13',
    56: 'h-14 w-14',
    60: 'h-15 w-15',
    64: 'h-16 w-16',
  };
  
  if (sizeMap[size]) {
    tailwindClass = sizeMap[size];
  } else {
    // For non-standard sizes, use arbitrary values
    tailwindClass = `h-[${size}px] w-[${size}px]`;
  }
  
  classCache.set(cacheKey, tailwindClass);
  return tailwindClass;
}

/**
 * Generate responsive size classes
 * @param mobileSize - Size for mobile devices
 * @param desktopSize - Size for desktop devices
 * @returns Responsive Tailwind classes
 */
export function generateResponsiveClasses(
  mobileSize: number,
  desktopSize: number
): string {
  const mobileClass = pixelsToTailwindClass(mobileSize);
  const desktopClass = pixelsToTailwindClass(desktopSize);
  
  // Extract just the size part (h-* w-*) for responsive variants
  const mobileSizeClass = mobileClass.split(' ').map(cls => `sm:${cls}`).join(' ');
  
  return `${mobileSizeClass} ${desktopClass}`;
}

/**
 * Generate hover state classes
 * @param baseSize - Base size in pixels
 * @param hoverScale - Scale factor for hover state (default: 1.1)
 * @returns Classes with hover state
 */
export function generateHoverClasses(
  baseSize: number,
  hoverScale: number = 1.1
): string {
  const baseClass = pixelsToTailwindClass(baseSize);
  const hoverSize = Math.round(baseSize * hoverScale);
  const hoverClass = pixelsToTailwindClass(hoverSize);
  
  return `${baseClass} hover:${hoverClass} transition-all duration-200`;
}

/**
 * Generate focus state classes for accessibility
 * @param baseSize - Base size in pixels
 * @returns Classes with focus state
 */
export function generateFocusClasses(baseSize: number): string {
  const baseClass = pixelsToTailwindClass(baseSize);
  return `${baseClass} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`;
}

/**
 * Generate complete icon classes with all states
 * @param size - Size in pixels
 * @param options - Additional options for class generation
 * @returns Complete class string
 */
export function generateIconClasses(
  size: number,
  options: {
    responsive?: boolean;
    hover?: boolean;
    focus?: boolean;
    mobileSize?: number;
    desktopSize?: number;
    customClasses?: string;
  } = {}
): string {
  const {
    responsive = false,
    hover = false,
    focus = false,
    mobileSize,
    desktopSize,
    customClasses = '',
  } = options;
  
  let classes: string[] = [];
  
  if (responsive && mobileSize && desktopSize) {
    classes.push(generateResponsiveClasses(mobileSize, desktopSize));
  } else {
    classes.push(pixelsToTailwindClass(size));
  }
  
  if (hover) {
    const baseClass = classes[0];
    const hoverSize = Math.round(size * 1.1);
    const hoverClass = pixelsToTailwindClass(hoverSize);
    classes.push(`hover:${hoverClass.replace('h-', '').replace('w-', '')}`);
    classes.push('transition-all duration-200');
  }
  
  if (focus) {
    classes.push('focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500');
  }
  
  if (customClasses) {
    classes.push(customClasses);
  }
  
  return classes.join(' ');
}

/**
 * Clear the class cache (useful for testing or configuration changes)
 */
export function clearClassCache(): void {
  classCache.clear();
}

/**
 * Get cache statistics for debugging
 */
export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: classCache.size,
    keys: Array.from(classCache.keys()),
  };
}
