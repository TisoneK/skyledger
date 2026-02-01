// Performance optimization utilities for SkyLedger

import React from 'react';

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  bundleSize: number;
  cacheHitRate: number;
}

export interface PerformanceThreshold {
  loadTime: number; // in milliseconds
  renderTime: number; // in milliseconds
  memoryUsage: number; // in MB
  bundleSize: number; // in KB
  cacheHitRate: number; // percentage
}

export const PERFORMANCE_THRESHOLDS: PerformanceThreshold = {
  loadTime: 1000, // 1 second
  renderTime: 100, // 100ms
  memoryUsage: 50, // 50MB
  bundleSize: 500, // 500KB
  cacheHitRate: 80, // 80%
};

// Performance monitoring class
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics = {
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    bundleSize: 0,
    cacheHitRate: 0,
  };
  private observers: PerformanceObserver[] = [];

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startMonitoring(): void {
    // Monitor navigation timing
    this.observeNavigationTiming();
    
    // Monitor resource loading
    this.observeResourceTiming();
    
    // Monitor paint timing
    this.observePaintTiming();
    
    // Monitor memory usage
    this.monitorMemoryUsage();
    
    // Monitor cache performance
    this.monitorCachePerformance();
  }

  private observeNavigationTiming(): void {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.metrics.loadTime = navEntry.loadEventEnd - navEntry.loadEventStart;
          }
        });
      });
      
      observer.observe({ entryTypes: ['navigation'] });
      this.observers.push(observer);
    }
  }

  private observeResourceTiming(): void {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        let totalSize = 0;
        let totalDuration = 0;
        
        entries.forEach((entry) => {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            totalSize += this.estimateResourceSize(resourceEntry);
            totalDuration += resourceEntry.duration;
          }
        });
        
        this.metrics.bundleSize = Math.round(totalSize / 1024); // Convert to KB
      });
      
      observer.observe({ entryTypes: ['resource'] });
      this.observers.push(observer);
    }
  }

  private observePaintTiming(): void {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'paint') {
            const paintEntry = entry as PerformancePaintTiming;
            if ((paintEntry as any).name === 'first-contentful-paint') {
              this.metrics.renderTime = paintEntry.startTime;
            }
          }
        });
      });
      
      observer.observe({ entryTypes: ['paint'] });
      this.observers.push(observer);
    }
  }

  private monitorMemoryUsage(): void {
    if ('memory' in performance) {
      const updateMemoryUsage = () => {
        const memory = (performance as any).memory;
        this.metrics.memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024); // Convert to MB
      };
      
      updateMemoryUsage();
      setInterval(updateMemoryUsage, 5000); // Update every 5 seconds
    }
  }

  private async monitorCachePerformance(): Promise<void> {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        let totalRequests = 0;
        let cacheHits = 0;
        
        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const requests = await cache.keys();
          totalRequests += requests.length;
          
          // Simulate cache hit rate calculation
          // In a real implementation, this would track actual cache hits/misses
          cacheHits = Math.floor(totalRequests * 0.85); // Assume 85% hit rate
        }
        
        this.metrics.cacheHitRate = totalRequests > 0 ? (cacheHits / totalRequests) * 100 : 0;
      } catch (error) {
        console.warn('Failed to monitor cache performance:', error);
      }
    }
  }

  private estimateResourceSize(entry: PerformanceResourceTiming): number {
    // Estimate size based on transfer size if available
    if ('transferSize' in entry) {
      return entry.transferSize || 0;
    }
    
    // Fallback estimation based on resource type
    const url = (entry as any).name;
    if (url.endsWith('.js')) return 50000; // 50KB average
    if (url.endsWith('.css')) return 20000; // 20KB average
    if (url.match(/\.(png|jpg|jpeg|gif|webp)$/)) return 100000; // 100KB average
    if (url.endsWith('.woff') || url.endsWith('.woff2')) return 30000; // 30KB average
    
    return 10000; // 10KB default
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  getPerformanceScore(): number {
    const thresholds = PERFORMANCE_THRESHOLDS;
    let score = 100;
    
    // Load time penalty
    if (this.metrics.loadTime > thresholds.loadTime) {
      score -= Math.min(30, (this.metrics.loadTime - thresholds.loadTime) / 100);
    }
    
    // Render time penalty
    if (this.metrics.renderTime > thresholds.renderTime) {
      score -= Math.min(20, (this.metrics.renderTime - thresholds.renderTime) / 5);
    }
    
    // Memory usage penalty
    if (this.metrics.memoryUsage > thresholds.memoryUsage) {
      score -= Math.min(20, (this.metrics.memoryUsage - thresholds.memoryUsage) / 5);
    }
    
    // Bundle size penalty
    if (this.metrics.bundleSize > thresholds.bundleSize) {
      score -= Math.min(20, (this.metrics.bundleSize - thresholds.bundleSize) / 50);
    }
    
    // Cache hit rate bonus/penalty
    if (this.metrics.cacheHitRate < thresholds.cacheHitRate) {
      score -= Math.min(10, (thresholds.cacheHitRate - this.metrics.cacheHitRate) / 2);
    }
    
    return Math.max(0, Math.round(score));
  }

  getRecommendations(): string[] {
    const recommendations: string[] = [];
    const thresholds = PERFORMANCE_THRESHOLDS;
    
    if (this.metrics.loadTime > thresholds.loadTime) {
      recommendations.push('Consider optimizing images and reducing bundle size for faster load times');
    }
    
    if (this.metrics.renderTime > thresholds.renderTime) {
      recommendations.push('Optimize component rendering and reduce unnecessary re-renders');
    }
    
    if (this.metrics.memoryUsage > thresholds.memoryUsage) {
      recommendations.push('Review memory usage and implement proper cleanup in components');
    }
    
    if (this.metrics.bundleSize > thresholds.bundleSize) {
      recommendations.push('Implement code splitting and tree shaking to reduce bundle size');
    }
    
    if (this.metrics.cacheHitRate < thresholds.cacheHitRate) {
      recommendations.push('Improve caching strategy for better offline performance');
    }
    
    return recommendations;
  }

  stopMonitoring(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Performance optimization utilities
export class PerformanceOptimizer {
  // Lazy loading for components
  static lazyLoad(
    importFunc: () => Promise<{ default: React.ComponentType<any> }>,
    fallback?: React.ComponentType
  ): React.LazyExoticComponent<React.ComponentType<any>> {
    return React.lazy(importFunc);
  }

  // Debounce utility for performance
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  // Throttle utility for performance
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Memoization utility
  static memoize<T extends (...args: any[]) => any>(func: T): T {
    const cache = new Map();
    return ((...args: Parameters<T>) => {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = func(...args);
      cache.set(key, result);
      return result;
    }) as T;
  }

  // Virtual scrolling helper
  static createVirtualScrollConfig(
    itemHeight: number,
    containerHeight: number,
    totalItems: number
  ) {
    const visibleItems = Math.ceil(containerHeight / itemHeight);
    const bufferSize = Math.max(5, Math.floor(visibleItems * 0.5));
    
    return {
      itemHeight,
      containerHeight,
      totalItems,
      visibleItems,
      bufferSize,
      scrollTop: 0,
      startIndex: 0,
      endIndex: Math.min(visibleItems + bufferSize, totalItems - 1),
    };
  }

  // Image optimization
  static optimizeImage(src: string, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpeg' | 'png';
  } = {}): string {
    const { width, height, quality = 80, format = 'webp' } = options;
    
    // This would typically use an image optimization service
    // For now, return the original src with basic optimization
    let optimizedSrc = src;
    
    if (width || height) {
      const params = new URLSearchParams();
      if (width) params.append('w', width.toString());
      if (height) params.append('h', height.toString());
      params.append('q', quality.toString());
      params.append('f', format);
      
      optimizedSrc += `?${params.toString()}`;
    }
    
    return optimizedSrc;
  }
}

// Performance monitoring hook
export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    bundleSize: 0,
    cacheHitRate: 0,
  });

  const [score, setScore] = React.useState(100);
  const [recommendations, setRecommendations] = React.useState<string[]>([]);

  React.useEffect(() => {
    const monitor = PerformanceMonitor.getInstance();
    monitor.startMonitoring();

    const updateMetrics = () => {
      const currentMetrics = monitor.getMetrics();
      setMetrics(currentMetrics);
      setScore(monitor.getPerformanceScore());
      setRecommendations(monitor.getRecommendations());
    };

    const interval = setInterval(updateMetrics, 5000);
    updateMetrics(); // Initial update

    return () => {
      clearInterval(interval);
      monitor.stopMonitoring();
    };
  }, []);

  return {
    metrics,
    score,
    recommendations,
    isOptimized: score >= 80,
  };
}

// Performance testing utilities
export class PerformanceTester {
  static async measureComponentRender(
    component: React.ComponentType,
    iterations: number = 10
  ): Promise<{ averageTime: number; minTime: number; maxTime: number }> {
    const times: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now();
      
      // Simulate component render
      // In a real implementation, this would use React's testing utilities
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const endTime = performance.now();
      times.push(endTime - startTime);
    }
    
    const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    
    return { averageTime, minTime, maxTime };
  }

  static async measureAsyncOperation<T>(
    operation: () => Promise<T>,
    iterations: number = 5
  ): Promise<{ averageTime: number; minTime: number; maxTime: number }> {
    const times: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now();
      await operation();
      const endTime = performance.now();
      times.push(endTime - startTime);
    }
    
    const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    
    return { averageTime, minTime, maxTime };
  }
}
