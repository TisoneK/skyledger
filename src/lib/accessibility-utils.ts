/**
 * Accessibility Utilities
 * 
 * Provides utilities for detecting user accessibility preferences
 * and adjusting icon sizing accordingly.
 */

/**
 * Check if user prefers high contrast mode
 */
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-contrast: high)').matches;
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if user prefers larger text (may indicate need for larger icons)
 */
export function prefersLargerText(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check for increased text size preference
  const testElement = document.createElement('div');
  testElement.style.position = 'absolute';
  testElement.style.visibility = 'hidden';
  testElement.style.fontSize = '16px';
  testElement.textContent = 'Test';
  document.body.appendChild(testElement);
  
  const defaultSize = testElement.offsetHeight;
  testElement.style.fontSize = '1em';
  const computedSize = testElement.offsetHeight;
  
  document.body.removeChild(testElement);
  
  return computedSize > defaultSize;
}

/**
 * Get accessibility-adjusted icon size
 */
export function getAccessibilityAdjustedSize(baseSize: number): number {
  let adjustedSize = baseSize;
  
  // Increase size for high contrast mode
  if (prefersHighContrast()) {
    adjustedSize = Math.round(baseSize * 1.25);
  }
  
  // Increase size if user prefers larger text
  if (prefersLargerText()) {
    adjustedSize = Math.round(adjustedSize * 1.1);
  }
  
  // Ensure minimum size for visibility
  return Math.max(adjustedSize, 16);
}

/**
 * Check if screen reader is active
 */
export function isScreenReaderActive(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check for common screen reader indicators
  return (
    window.speechSynthesis?.speaking ||
    window.navigator?.userAgent?.includes('NVDA') ||
    window.navigator?.userAgent?.includes('JAWS') ||
    window.navigator?.userAgent?.includes('VoiceOver')
  );
}

/**
 * Add accessibility event listeners
 */
export function addAccessibilityListeners(
  onHighContrastChange?: (prefersHighContrast: boolean) => void,
  onReducedMotionChange?: (prefersReducedMotion: boolean) => void
): () => void {
  if (typeof window === 'undefined') return () => {};
  
  const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  const handleHighContrastChange = () => {
    onHighContrastChange?.(prefersHighContrast());
  };
  
  const handleReducedMotionChange = () => {
    onReducedMotionChange?.(prefersReducedMotion());
  };
  
  // Add listeners
  highContrastQuery.addEventListener('change', handleHighContrastChange);
  reducedMotionQuery.addEventListener('change', handleReducedMotionChange);
  
  // Return cleanup function
  return () => {
    highContrastQuery.removeEventListener('change', handleHighContrastChange);
    reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
  };
}
