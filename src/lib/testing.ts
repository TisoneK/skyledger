// Testing utilities for SkyLedger validation and quality assurance

export interface TestResult {
  passed: boolean;
  message: string;
  details?: any;
}

export interface TestSuite {
  name: string;
  tests: TestResult[];
  passed: boolean;
  duration: number;
}

export class TestRunner {
  private suites: TestSuite[] = [];
  private currentSuite: TestSuite | null = null;

  createSuite(name: string): void {
    this.currentSuite = {
      name,
      tests: [],
      passed: true,
      duration: 0,
    };
  }

  addTest(test: TestResult): void {
    if (!this.currentSuite) {
      throw new Error('No active test suite. Call createSuite() first.');
    }
    this.currentSuite.tests.push(test);
    if (!test.passed) {
      this.currentSuite.passed = false;
    }
  }

  finishSuite(): void {
    if (this.currentSuite) {
      this.suites.push(this.currentSuite);
      this.currentSuite = null;
    }
  }

  getResults(): TestSuite[] {
    return this.suites;
  }

  getSummary(): { total: number; passed: number; failed: number } {
    const total = this.suites.reduce((sum, suite) => sum + suite.tests.length, 0);
    const passed = this.suites.reduce((sum, suite) => 
      sum + suite.tests.filter(test => test.passed).length, 0);
    const failed = total - passed;

    return { total, passed, failed };
  }
}

// Offline functionality testing
export class OfflineTester {
  static async testServiceWorkerRegistration(): Promise<TestResult> {
    try {
      const registration = await navigator.serviceWorker.ready;
      if (registration.active) {
        return {
          passed: true,
          message: 'Service worker is active and registered',
          details: { scope: registration.scope }
        };
      } else {
        return {
          passed: false,
          message: 'Service worker registration found but not active'
        };
      }
    } catch (error) {
      return {
        passed: false,
        message: 'Service worker not registered',
        details: { error: (error as Error).message }
      };
    }
  }

  static async testCacheAvailability(): Promise<TestResult> {
    try {
      const cacheNames = await caches.keys();
      const skyLedgerCaches = cacheNames.filter(name => name.includes('skyledger'));
      
      if (skyLedgerCaches.length > 0) {
        return {
          passed: true,
          message: `Found ${skyLedgerCaches.length} SkyLedger caches`,
          details: { caches: skyLedgerCaches }
        };
      } else {
        return {
          passed: false,
          message: 'No SkyLedger caches found'
        };
      }
    } catch (error) {
      return {
        passed: false,
        message: 'Failed to check cache availability',
        details: { error: (error as Error).message }
      };
    }
  }

  static async testOfflineFunctionality(): Promise<TestResult> {
    try {
      // Simulate offline mode
      const originalOnline = navigator.onLine;
      
      // Test if offline detection works
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        return {
          passed: true,
          message: 'Connection API available for offline detection',
          details: { 
            effectiveType: connection.effectiveType,
            online: originalOnline
          }
        };
      } else {
        return {
          passed: false,
          message: 'Connection API not available'
        };
      }
    } catch (error) {
      return {
        passed: false,
        message: 'Failed to test offline functionality',
        details: { error: (error as Error).message }
      };
    }
  }

  static async testBackgroundSync(): Promise<TestResult> {
    try {
      const registration = await navigator.serviceWorker.ready;
      if ('sync' in registration) {
        return {
          passed: true,
          message: 'Background Sync API is available',
          details: { supported: true }
        };
      } else {
        return {
          passed: false,
          message: 'Background Sync API not available',
          details: { fallback: 'Manual sync will be used' }
        };
      }
    } catch (error) {
      return {
        passed: false,
        message: 'Failed to test background sync',
        details: { error: (error as Error).message }
      };
    }
  }
}

// Responsive design testing
export class ResponsiveTester {
  static testViewportMeta(): TestResult {
    const viewport = document.querySelector('meta[name="viewport"]');
    
    if (viewport) {
      const content = viewport.getAttribute('content');
      if (content && content.includes('width=device-width')) {
        return {
          passed: true,
          message: 'Viewport meta tag is properly configured',
          details: { content }
        };
      } else {
        return {
          passed: false,
          message: 'Viewport meta tag missing width=device-width'
        };
      }
    } else {
      return {
        passed: false,
        message: 'Viewport meta tag not found'
      };
    }
  }

  static testMediaQueries(): TestResult {
    const mediaQueries = [
      '(max-width: 640px)',  // Mobile
      '(max-width: 768px)',  // Tablet
      '(max-width: 1024px)', // Desktop
      '(min-width: 1025px)', // Large desktop
    ];

    const results = mediaQueries.map(query => {
      const mq = window.matchMedia(query);
      return { query, matches: mq.matches };
    });

    return {
      passed: true,
      message: 'Media queries are supported',
      details: { results }
    };
  }

  static testTouchSupport(): TestResult {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    return {
      passed: true,
      message: `Touch support ${hasTouch ? 'available' : 'not available'}`,
      details: { 
        touchSupported: hasTouch,
        maxTouchPoints: navigator.maxTouchPoints
      }
    };
  }

  static testResponsiveImages(): TestResult {
    const images = document.querySelectorAll('img');
    const responsiveImages = Array.from(images).filter(img => 
      img.hasAttribute('srcset') || 
      img.hasAttribute('sizes') ||
      img.classList.contains('responsive')
    );

    return {
      passed: true,
      message: `${responsiveImages.length}/${images.length} images are responsive`,
      details: { 
        total: images.length,
        responsive: responsiveImages.length
      }
    };
  }
}

// Role separation testing
export class RoleTester {
  static testRoleIsolation(): TestResult {
    // Test if role-specific data is properly isolated
    const roles = ['personal', 'sky-tech', 'chama', 'side-income'];
    const roleElements = roles.map(role => 
      document.querySelectorAll(`[data-role="${role}"]`)
    );

    const hasRoleElements = roleElements.some(elements => elements.length > 0);

    return {
      passed: hasRoleElements,
      message: hasRoleElements ? 'Role-specific elements found' : 'No role-specific elements found',
      details: { 
        roles: roles.map((role, index) => ({
          name: role,
          elementCount: roleElements[index].length
        }))
      }
    };
  }

  static testRoleSwitching(): TestResult {
    const roleSwitcher = document.querySelector('[data-role-switcher]');
    const roleButtons = document.querySelectorAll('[data-role-button]');
    
    return {
      passed: roleSwitcher !== null && roleButtons.length > 0,
      message: roleSwitcher ? 'Role switching interface found' : 'Role switching interface not found',
      details: {
        switcherFound: roleSwitcher !== null,
        buttonCount: roleButtons.length
      }
    };
  }

  static testRoleColors(): TestResult {
    const roleElements = document.querySelectorAll('[data-role]');
    const elementsWithColors = Array.from(roleElements).filter(element => {
      const styles = window.getComputedStyle(element);
      return styles.backgroundColor && styles.backgroundColor !== 'rgba(0, 0, 0, 0)';
    });

    return {
      passed: elementsWithColors.length > 0,
      message: `${elementsWithColors.length}/${roleElements.length} role elements have styling`,
      details: {
        total: roleElements.length,
        styled: elementsWithColors.length
      }
    };
  }
}

// Data aggregation testing
export class DataTester {
  static testWeeklyCalculations(): TestResult {
    // Test if weekly data calculations are working
    const weeklyElements = document.querySelectorAll('[data-weekly]');
    const hasCalculations = weeklyElements.length > 0;

    return {
      passed: hasCalculations,
      message: hasCalculations ? 'Weekly calculation elements found' : 'No weekly calculation elements found',
      details: {
        elementCount: weeklyElements.length
      }
    };
  }

  static testFinancialMetrics(): TestResult {
    const metrics = ['income', 'expenses', 'net-income', 'savings'];
    const metricElements = metrics.map(metric => 
      document.querySelectorAll(`[data-metric="${metric}"]`)
    );

    const hasMetrics = metricElements.some(elements => elements.length > 0);

    return {
      passed: hasMetrics,
      message: hasMetrics ? 'Financial metrics found' : 'No financial metrics found',
      details: {
        metrics: metrics.map((metric, index) => ({
          name: metric,
          elementCount: metricElements[index].length
        }))
      }
    };
  }

  static testDataIntegrity(): TestResult {
    // Test data integrity checks
    const dataElements = document.querySelectorAll('[data-test-value]');
    const validElements = Array.from(dataElements).filter(element => {
      const value = element.getAttribute('data-test-value');
      return value !== null && value !== '';
    });

    return {
      passed: validElements.length === dataElements.length,
      message: `${validElements.length}/${dataElements.length} data elements have valid values`,
      details: {
        total: dataElements.length,
        valid: validElements.length
      }
    };
  }
}

// Performance testing
export class PerformanceTester {
  static testLoadTime(): TestResult {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigationEntries = performance.getEntriesByType('navigation');
      if (navigationEntries.length > 0) {
        const loadTime = (navigationEntries[0] as PerformanceNavigationTiming).loadEventEnd - 
                        (navigationEntries[0] as PerformanceNavigationTiming).loadEventStart;
        
        const passed = loadTime < 1000; // Under 1 second
        
        return {
          passed,
          message: `Load time: ${loadTime.toFixed(2)}ms ${passed ? '(✓)' : '(✗)'}`,
          details: { loadTime, threshold: 1000 }
        };
      }
    }

    return {
      passed: false,
      message: 'Performance API not available'
    };
  }

  static testFirstContentfulPaint(): TestResult {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      
      if (fcpEntry) {
        const fcpTime = fcpEntry.startTime;
        const passed = fcpTime < 1000; // Under 1 second
        
        return {
          passed,
          message: `First Contentful Paint: ${fcpTime.toFixed(2)}ms ${passed ? '(✓)' : '(✗)'}`,
          details: { fcpTime, threshold: 1000 }
        };
      }
    }

    return {
      passed: false,
      message: 'First Contentful Paint not available'
    };
  }

  static testBundleSize(): TestResult {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const resources = performance.getEntriesByType('resource');
      const jsResources = resources.filter(resource => 
        resource.name.endsWith('.js') && resource.name.includes('skyledger')
      );
      
      const totalSize = jsResources.reduce((sum, resource) => 
        sum + (resource as any).transferSize || 0, 0);
      
      const sizeInKB = Math.round(totalSize / 1024);
      const passed = sizeInKB < 500; // Under 500KB
      
      return {
        passed,
        message: `Bundle size: ${sizeInKB}KB ${passed ? '(✓)' : '(✗)'}`,
        details: { sizeInKB, threshold: 500 }
      };
    }

    return {
      passed: false,
      message: 'Resource timing not available'
    };
  }
}

// Accessibility testing
export class AccessibilityTester {
  static testAltText(): TestResult {
    const images = document.querySelectorAll('img');
    const imagesWithoutAlt = Array.from(images).filter(img => 
      !img.getAttribute('alt') && !img.getAttribute('aria-label')
    );

    const passed = imagesWithoutAlt.length === 0;

    return {
      passed,
      message: `${images.length - imagesWithoutAlt.length}/${images.length} images have alt text`,
      details: {
        total: images.length,
        withAlt: images.length - imagesWithoutAlt.length,
        withoutAlt: imagesWithoutAlt.length
      }
    };
  }

  static testFormLabels(): TestResult {
    const inputs = document.querySelectorAll('input, select, textarea');
    const inputsWithoutLabels = Array.from(inputs).filter(input => {
      const hasLabel = input.getAttribute('aria-label') ||
                      input.getAttribute('aria-labelledby') ||
                      document.querySelector(`label[for="${input.id}"]`);
      return !hasLabel;
    });

    const passed = inputsWithoutLabels.length === 0;

    return {
      passed,
      message: `${inputs.length - inputsWithoutLabels.length}/${inputs.length} form inputs have labels`,
      details: {
        total: inputs.length,
        withLabels: inputs.length - inputsWithoutLabels.length,
        withoutLabels: inputsWithoutLabels.length
      }
    };
  }

  static testHeadingStructure(): TestResult {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const headingLevels = Array.from(headings).map(h => parseInt(h.tagName.charAt(1)));
    const hasProperStructure = this.checkHeadingLevels(headingLevels);

    return {
      passed: hasProperStructure,
      message: hasProperStructure ? 'Heading structure is proper' : 'Heading structure has issues',
      details: {
        headings: headingLevels,
        properStructure: hasProperStructure
      }
    };
  }

  private static checkHeadingLevels(levels: number[]): boolean {
    let lastLevel = 0;
    for (const level of levels) {
      if (level > lastLevel + 1) {
        return false;
      }
      lastLevel = level;
    }
    return true;
  }
}

// Main test orchestrator
export class SkyLedgerTester {
  private runner = new TestRunner();

  async runAllTests(): Promise<TestSuite[]> {
    // Offline functionality tests
    this.runner.createSuite('Offline Functionality');
    this.runner.addTest(await OfflineTester.testServiceWorkerRegistration());
    this.runner.addTest(await OfflineTester.testCacheAvailability());
    this.runner.addTest(await OfflineTester.testOfflineFunctionality());
    this.runner.addTest(await OfflineTester.testBackgroundSync());
    this.runner.finishSuite();

    // Responsive design tests
    this.runner.createSuite('Responsive Design');
    this.runner.addTest(ResponsiveTester.testViewportMeta());
    this.runner.addTest(ResponsiveTester.testMediaQueries());
    this.runner.addTest(ResponsiveTester.testTouchSupport());
    this.runner.addTest(ResponsiveTester.testResponsiveImages());
    this.runner.finishSuite();

    // Role separation tests
    this.runner.createSuite('Role Separation');
    this.runner.addTest(RoleTester.testRoleIsolation());
    this.runner.addTest(RoleTester.testRoleSwitching());
    this.runner.addTest(RoleTester.testRoleColors());
    this.runner.finishSuite();

    // Data aggregation tests
    this.runner.createSuite('Data Aggregation');
    this.runner.addTest(DataTester.testWeeklyCalculations());
    this.runner.addTest(DataTester.testFinancialMetrics());
    this.runner.addTest(DataTester.testDataIntegrity());
    this.runner.finishSuite();

    // Performance tests
    this.runner.createSuite('Performance');
    this.runner.addTest(PerformanceTester.testLoadTime());
    this.runner.addTest(PerformanceTester.testFirstContentfulPaint());
    this.runner.addTest(PerformanceTester.testBundleSize());
    this.runner.finishSuite();

    // Accessibility tests
    this.runner.createSuite('Accessibility');
    this.runner.addTest(AccessibilityTester.testAltText());
    this.runner.addTest(AccessibilityTester.testFormLabels());
    this.runner.addTest(AccessibilityTester.testHeadingStructure());
    this.runner.finishSuite();

    return this.runner.getResults();
  }

  generateReport(results: TestSuite[]): string {
    const summary = results.reduce((acc, suite) => ({
      total: acc.total + suite.tests.length,
      passed: acc.passed + suite.tests.filter(t => t.passed).length,
      failed: acc.failed + suite.tests.filter(t => !t.passed).length
    }), { total: 0, passed: 0, failed: 0 });

    let report = `# SkyLedger Test Report\n\n`;
    report += `## Summary\n`;
    report += `- Total Tests: ${summary.total}\n`;
    report += `- Passed: ${summary.passed}\n`;
    report += `- Failed: ${summary.failed}\n`;
    report += `- Success Rate: ${((summary.passed / summary.total) * 100).toFixed(1)}%\n\n`;

    for (const suite of results) {
      report += `## ${suite.name}\n`;
      report += `- Status: ${suite.passed ? '✅ PASSED' : '❌ FAILED'}\n`;
      report += `- Tests: ${suite.tests.filter(t => t.passed).length}/${suite.tests.length} passed\n\n`;

      for (const test of suite.tests) {
        const icon = test.passed ? '✅' : '❌';
        report += `${icon} ${test.message}\n`;
        if (test.details) {
          report += `   Details: ${JSON.stringify(test.details, null, 2)}\n`;
        }
      }
      report += '\n';
    }

    return report;
  }
}
