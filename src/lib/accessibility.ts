// Accessibility utilities for SkyLedger - WCAG 2.1 AA compliance

import React from 'react';

export interface AccessibilityConfig {
  enableKeyboardNavigation: boolean;
  enableScreenReader: boolean;
  enableHighContrast: boolean;
  enableReducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  focusVisible: boolean;
}

export class AccessibilityManager {
  private static instance: AccessibilityManager;
  private config: AccessibilityConfig = {
    enableKeyboardNavigation: true,
    enableScreenReader: true,
    enableHighContrast: false,
    enableReducedMotion: false,
    fontSize: 'medium',
    focusVisible: true,
  };
  private listeners: ((config: AccessibilityConfig) => void)[] = [];

  static getInstance(): AccessibilityManager {
    if (!AccessibilityManager.instance) {
      AccessibilityManager.instance = new AccessibilityManager();
    }
    return AccessibilityManager.instance;
  }

  constructor() {
    this.loadFromLocalStorage();
    this.setupSystemPreferences();
    this.setupKeyboardHandlers();
  }

  private loadFromLocalStorage(): void {
    try {
      const saved = localStorage.getItem('skyledger-accessibility');
      if (saved) {
        this.config = { ...this.config, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.warn('Failed to load accessibility settings:', error);
    }
  }

  private saveToLocalStorage(): void {
    try {
      localStorage.setItem('skyledger-accessibility', JSON.stringify(this.config));
    } catch (error) {
      console.warn('Failed to save accessibility settings:', error);
    }
  }

  private setupSystemPreferences(): void {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.config.enableReducedMotion = true;
    }

    // Check for high contrast preference
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      this.config.enableHighContrast = true;
    }

    // Listen for changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.updateConfig({ enableReducedMotion: e.matches });
    });

    window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
      this.updateConfig({ enableHighContrast: e.matches });
    });
  }

  private setupKeyboardHandlers(): void {
    document.addEventListener('keydown', (e) => {
      // Tab navigation enhancement
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }

      // Escape key to close modals/dropdowns
      if (e.key === 'Escape') {
        this.handleEscapeKey();
      }

      // Skip to main content (Alt + M)
      if (e.altKey && e.key === 'm') {
        this.skipToMainContent();
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  private handleEscapeKey(): void {
    // Close any open modals, dropdowns, or menus
    const openElements = document.querySelectorAll('[data-open="true"]');
    openElements.forEach(element => {
      (element as HTMLElement).setAttribute('data-open', 'false');
    });
  }

  private skipToMainContent(): void {
    const mainContent = document.getElementById('main-content') || document.querySelector('main');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  }

  getConfig(): AccessibilityConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<AccessibilityConfig>): void {
    this.config = { ...this.config, ...updates };
    this.saveToLocalStorage();
    this.applyConfig();
    this.notifyListeners();
  }

  private applyConfig(): void {
    const root = document.documentElement;

    // Apply font size
    root.setAttribute('data-font-size', this.config.fontSize);

    // Apply high contrast
    root.setAttribute('data-high-contrast', this.config.enableHighContrast.toString());

    // Apply reduced motion
    root.setAttribute('data-reduced-motion', this.config.enableReducedMotion.toString());

    // Apply focus visible
    root.setAttribute('data-focus-visible', this.config.focusVisible.toString());

    // Apply ARIA live regions
    this.setupLiveRegions();
  }

  private setupLiveRegions(): void {
    // Create or update live regions for screen readers
    let liveRegion = document.getElementById('accessibility-live-region');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'accessibility-live-region';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }
  }

  announce(message: string): void {
    const liveRegion = document.getElementById('accessibility-live-region');
    if (liveRegion && this.config.enableScreenReader) {
      liveRegion.textContent = message;
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  }

  subscribe(listener: (config: AccessibilityConfig) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.config));
  }

  // Focus management utilities
  trapFocus(element: HTMLElement): () => void {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  }

  // Color contrast checker
  checkContrast(foreground: string, background: string): { ratio: number; passes: boolean } {
    // Convert hex to RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };

    const fg = hexToRgb(foreground);
    const bg = hexToRgb(background);

    if (!fg || !bg) return { ratio: 1, passes: false };

    // Calculate relative luminance
    const getLuminance = (color: { r: number; g: number; b: number }) => {
      const rsRGB = color.r / 255;
      const gsRGB = color.g / 255;
      const bsRGB = color.b / 255;

      const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
      const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
      const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const l1 = getLuminance(fg);
    const l2 = getLuminance(bg);

    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

    return {
      ratio: Math.round(ratio * 100) / 100,
      passes: ratio >= 4.5 // WCAG AA standard
    };
  }

  // Screen reader utilities
  addScreenReaderLabel(element: HTMLElement, label: string): void {
    element.setAttribute('aria-label', label);
  }

  addScreenReaderDescription(element: HTMLElement, description: string): void {
    const id = `sr-desc-${Date.now()}`;
    const descElement = document.createElement('div');
    descElement.id = id;
    descElement.className = 'sr-only';
    descElement.textContent = description;
    element.appendChild(descElement);
    element.setAttribute('aria-describedby', id);
  }

  markAsDecorative(element: HTMLElement): void {
    element.setAttribute('aria-hidden', 'true');
    element.setAttribute('role', 'presentation');
  }

  // Keyboard navigation utilities
  addKeyboardHandler(element: HTMLElement, handlers: {
    onEnter?: () => void;
    onSpace?: () => void;
    onEscape?: () => void;
    onArrowUp?: () => void;
    onArrowDown?: () => void;
    onArrowLeft?: () => void;
    onArrowRight?: () => void;
  }): () => void {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Enter':
          handlers.onEnter?.();
          break;
        case ' ':
          e.preventDefault();
          handlers.onSpace?.();
          break;
        case 'Escape':
          handlers.onEscape?.();
          break;
        case 'ArrowUp':
          e.preventDefault();
          handlers.onArrowUp?.();
          break;
        case 'ArrowDown':
          e.preventDefault();
          handlers.onArrowDown?.();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handlers.onArrowLeft?.();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handlers.onArrowRight?.();
          break;
      }
    };

    element.addEventListener('keydown', handleKeyDown);
    element.setAttribute('tabindex', '0');

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
      element.removeAttribute('tabindex');
    };
  }

  // ARIA utilities
  setAriaExpanded(element: HTMLElement, expanded: boolean): void {
    element.setAttribute('aria-expanded', expanded.toString());
  }

  setAriaPressed(element: HTMLElement, pressed: boolean): void {
    element.setAttribute('aria-pressed', pressed.toString());
  }

  setAriaSelected(element: HTMLElement, selected: boolean): void {
    element.setAttribute('aria-selected', selected.toString());
  }

  setAriaDisabled(element: HTMLElement, disabled: boolean): void {
    element.setAttribute('aria-disabled', disabled.toString());
    element.setAttribute('tabindex', disabled ? '-1' : '0');
  }

  // Validation utilities
  validateAccessibility(element: HTMLElement): { errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for alt text on images
    const images = element.querySelectorAll('img');
    images.forEach(img => {
      if (!img.getAttribute('alt') && !img.getAttribute('aria-label')) {
        errors.push('Image missing alt text or aria-label');
      }
    });

    // Check for proper heading structure
    const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let lastLevel = 0;
    headings.forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1));
      if (level > lastLevel + 1) {
        warnings.push('Heading level skipped');
      }
      lastLevel = level;
    });

    // Check for form labels
    const inputs = element.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      const hasLabel = input.getAttribute('aria-label') || 
                      input.getAttribute('aria-labelledby') ||
                      element.querySelector(`label[for="${input.id}"]`);
      if (!hasLabel) {
        errors.push('Form input missing label');
      }
    });

    // Check for button text
    const buttons = element.querySelectorAll('button');
    buttons.forEach(button => {
      const hasText = button.textContent?.trim() || 
                     button.getAttribute('aria-label') ||
                     button.getAttribute('aria-labelledby');
      if (!hasText) {
        errors.push('Button missing accessible name');
      }
    });

    return { errors, warnings };
  }
}

// React hook for accessibility
export function useAccessibility() {
  const [config, setConfig] = React.useState<AccessibilityConfig>(() => 
    AccessibilityManager.getInstance().getConfig()
  );

  React.useEffect(() => {
    const manager = AccessibilityManager.getInstance();
    const unsubscribe = manager.subscribe(setConfig);
    return unsubscribe;
  }, []);

  const updateConfig = React.useCallback((updates: Partial<AccessibilityConfig>) => {
    AccessibilityManager.getInstance().updateConfig(updates);
  }, []);

  const announce = React.useCallback((message: string) => {
    AccessibilityManager.getInstance().announce(message);
  }, []);

  const checkContrast = React.useCallback((foreground: string, background: string) => {
    return AccessibilityManager.getInstance().checkContrast(foreground, background);
  }, []);

  return {
    config,
    updateConfig,
    announce,
    checkContrast,
  };
}

// CSS class utilities for accessibility
export const accessibilityClasses = {
  srOnly: 'sr-only',
  focusVisible: 'focus-visible',
  skipLink: 'skip-link',
  keyboardNavigation: 'keyboard-navigation',
  highContrast: 'high-contrast',
  reducedMotion: 'reduced-motion',
};

// CSS for screen reader only content
export const srOnlyStyles = `
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: #000;
    color: #fff;
    padding: 8px;
    text-decoration: none;
    border-radius: 4px;
    z-index: 1000;
  }

  .skip-link:focus {
    top: 6px;
  }

  .keyboard-navigation *:focus {
    outline: 2px solid #0066cc;
    outline-offset: 2px;
  }

  .high-contrast {
    filter: contrast(1.5);
  }

  .reduced-motion * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
`;
