/**
 * Unit tests for icon size configuration module
 */

import {
  getIconSize,
  getValidatedIconSize,
  updateIconSizeConfiguration,
  resetIconSizeConfiguration,
  scaleIconSizes,
  getIconScale,
  isValidIconSize,
  getAvailableContexts,
  shouldUseReducedMotion,
  defaultIconSizes,
  iconSizeConfiguration,
} from '../icon-sizes';

// Mock window object for tests
const mockWindow = {
  matchMedia: jest.fn(),
  innerWidth: 1024,
};

// Mock accessibility utils
jest.mock('../accessibility-utils', () => ({
  getAccessibilityAdjustedSize: jest.fn((size: number) => size * 1.25),
  prefersReducedMotion: jest.fn(() => false),
}));

describe('Icon Size Configuration', () => {
  beforeEach(() => {
    // Reset configuration before each test
    resetIconSizeConfiguration();
    jest.clearAllMocks();
    
    // Mock window
    Object.defineProperty(global, 'window', {
      value: mockWindow,
      writable: true,
    });
  });

  describe('getIconSize', () => {
    it('should return correct size for valid context', () => {
      expect(getIconSize('sidebar')).toBe(24);
      expect(getIconSize('card')).toBe(20);
      expect(getIconSize('compact')).toBe(16);
      expect(getIconSize('large')).toBe(32);
    });

    it('should throw error for invalid context', () => {
      expect(() => getIconSize('invalid' as any)).toThrow('Invalid icon context: invalid');
    });

    it('should apply scaling factor', () => {
      scaleIconSizes(2);
      expect(getIconSize('sidebar')).toBe(48);
      expect(getIconSize('card')).toBe(40);
      resetIconSizeConfiguration();
    });

    it('should apply responsive adjustments for mobile', () => {
      mockWindow.innerWidth = 768; // Mobile breakpoint
      mockWindow.matchMedia.mockReturnValue({
        matches: true,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      });

      const size = getIconSize('compact', true);
      expect(size).toBe(14); // Mobile compact size
    });

    it('should apply responsive adjustments for desktop', () => {
      mockWindow.innerWidth = 1024; // Desktop
      mockWindow.matchMedia.mockReturnValue({
        matches: false,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      });

      const size = getIconSize('large', true);
      expect(size).toBe(36); // Desktop large size
    });

    it('should apply accessibility adjustments when enabled', () => {
      const { getAccessibilityAdjustedSize } = require('../accessibility-utils');
      getAccessibilityAdjustedSize.mockReturnValue(30); // 24 * 1.25

      const size = getIconSize('sidebar', false, true);
      expect(size).toBe(30);
    });

    it('should skip accessibility adjustments when disabled', () => {
      updateIconSizeConfiguration({
        accessibility: {
          enableHighContrastAdjustment: false,
          enableReducedMotion: true,
        },
      });

      const size = getIconSize('sidebar', false, true);
      expect(size).toBe(24); // No adjustment applied
    });
  });

  describe('getValidatedIconSize', () => {
    it('should return size for valid context', () => {
      expect(getValidatedIconSize('sidebar')).toBe(24);
    });

    it('should throw error for invalid context', () => {
      expect(() => getValidatedIconSize('invalid')).toThrow(
        'Invalid icon context "invalid". Valid contexts: sidebar, card, compact, large'
      );
    });
  });

  describe('updateIconSizeConfiguration', () => {
    it('should update size configuration', () => {
      updateIconSizeConfiguration({
        sizes: {
          sidebar: 30,
          card: 25,
        },
      });

      expect(getIconSize('sidebar')).toBe(30);
      expect(getIconSize('card')).toBe(25);
      expect(getIconSize('compact')).toBe(16); // Unchanged
    });

    it('should update scale factor', () => {
      updateIconSizeConfiguration({ scale: 1.5 });
      expect(getIconSize('sidebar')).toBe(36); // 24 * 1.5
    });

    it('should update responsive configuration', () => {
      updateIconSizeConfiguration({
        responsive: {
          mobile: {
            sidebar: 20,
          },
          desktop: {
            card: 30,
          },
        },
      });

      mockWindow.innerWidth = 768;
      mockWindow.matchMedia.mockReturnValue({
        matches: true,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      });

      expect(getIconSize('sidebar', true)).toBe(20);
    });

    it('should update accessibility settings', () => {
      updateIconSizeConfiguration({
        accessibility: {
          enableHighContrastAdjustment: false,
          enableReducedMotion: false,
        },
      });

      expect(iconSizeConfiguration.accessibility.enableHighContrastAdjustment).toBe(false);
      expect(iconSizeConfiguration.accessibility.enableReducedMotion).toBe(false);
    });
  });

  describe('resetIconSizeConfiguration', () => {
    it('should reset to default values', () => {
      // Modify configuration
      scaleIconSizes(2);
      updateIconSizeConfiguration({
        sizes: { sidebar: 50 },
      });

      // Reset
      resetIconSizeConfiguration();

      // Check defaults
      expect(getIconSize('sidebar')).toBe(24);
      expect(getIconScale()).toBe(1);
      expect(iconSizeConfiguration.accessibility.enableHighContrastAdjustment).toBe(true);
    });
  });

  describe('scaleIconSizes', () => {
    it('should scale all sizes by factor', () => {
      scaleIconSizes(1.5);
      expect(getIconSize('sidebar')).toBe(36);
      expect(getIconSize('card')).toBe(30);
      expect(getIconSize('compact')).toBe(24);
      expect(getIconSize('large')).toBe(48);
    });

    it('should throw error for invalid scale factor', () => {
      expect(() => scaleIconSizes(0)).toThrow('Scale factor must be between 0 and 3');
      expect(() => scaleIconSizes(4)).toThrow('Scale factor must be between 0 and 3');
    });
  });

  describe('getIconScale', () => {
    it('should return current scale factor', () => {
      expect(getIconScale()).toBe(1);
      scaleIconSizes(2);
      expect(getIconScale()).toBe(2);
      resetIconSizeConfiguration();
    });
  });

  describe('isValidIconSize', () => {
    it('should validate size range', () => {
      expect(isValidIconSize(12)).toBe(true);
      expect(isValidIconSize(32)).toBe(true);
      expect(isValidIconSize(64)).toBe(true);
      expect(isValidIconSize(11)).toBe(false);
      expect(isValidIconSize(65)).toBe(false);
    });
  });

  describe('getAvailableContexts', () => {
    it('should return all available contexts', () => {
      const contexts = getAvailableContexts();
      expect(contexts).toEqual(['sidebar', 'card', 'compact', 'large']);
    });
  });

  describe('shouldUseReducedMotion', () => {
    it('should check reduced motion preference', () => {
      const { prefersReducedMotion } = require('../accessibility-utils');
      prefersReducedMotion.mockReturnValue(true);

      expect(shouldUseReducedMotion()).toBe(true);

      prefersReducedMotion.mockReturnValue(false);
      expect(shouldUseReducedMotion()).toBe(false);
    });

    it('should respect accessibility setting', () => {
      updateIconSizeConfiguration({
        accessibility: {
          enableHighContrastAdjustment: true,
          enableReducedMotion: false,
        },
      });

      expect(shouldUseReducedMotion()).toBe(false);
    });
  });

  describe('Configuration persistence', () => {
    it('should maintain configuration across multiple calls', () => {
      updateIconSizeConfiguration({ scale: 1.2 });
      expect(getIconSize('sidebar')).toBe(28.8);
      expect(getIconSize('card')).toBe(24);
      expect(getIconSize('sidebar')).toBe(28.8); // Should be consistent
    });
  });
});
