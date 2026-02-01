// Cache strategies for SkyLedger PWA

export interface CacheStrategy {
  name: string;
  cacheFirst: (request: Request) => Promise<Response>;
  networkFirst: (request: Request) => Promise<Response>;
  staleWhileRevalidate: (request: Request) => Promise<Response>;
}

// Cache names
export const CACHE_NAMES = {
  STATIC: 'skyledger-static-v1',
  API: 'skyledger-api-v1',
  IMAGES: 'skyledger-images-v1',
  DYNAMIC: 'skyledger-dynamic-v1',
};

// Cache durations (in seconds)
export const CACHE_DURATIONS = {
  STATIC: 30 * 24 * 60 * 60, // 30 days
  API: 5 * 60, // 5 minutes
  IMAGES: 7 * 24 * 60 * 60, // 7 days
  DYNAMIC: 24 * 60 * 60, // 1 day
};

// Determine cache strategy based on request
export function getCacheStrategy(request: Request): string {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Static assets - cache first
  if (
    pathname.startsWith('/_next/static/') ||
    pathname.startsWith('/static/') ||
    pathname.endsWith('.js') ||
    pathname.endsWith('.css') ||
    pathname.endsWith('.woff') ||
    pathname.endsWith('.woff2') ||
    pathname.endsWith('.ttf')
  ) {
    return 'cache-first';
  }

  // Images - cache first with longer duration
  if (
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.gif') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.webp')
  ) {
    return 'cache-first';
  }

  // API calls - network first with cache fallback
  if (pathname.startsWith('/api/')) {
    return 'network-first';
  }

  // Pages - stale while revalidate
  if (pathname.endsWith('.html') || pathname === '/') {
    return 'stale-while-revalidate';
  }

  // Default to network first
  return 'network-first';
}

// Cache First Strategy - serves from cache, falls back to network
export async function cacheFirst(request: Request): Promise<Response> {
  const cache = await caches.open(CACHE_NAMES.STATIC);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Cache First: Network request failed', error);
    throw error;
  }
}

// Network First Strategy - tries network, falls back to cache
export async function networkFirst(request: Request): Promise<Response> {
  const cache = await caches.open(CACHE_NAMES.API);
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network First: Network failed, trying cache');
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Stale While Revalidate Strategy - serves from cache, updates in background
export async function staleWhileRevalidate(request: Request): Promise<Response> {
  const cache = await caches.open(CACHE_NAMES.DYNAMIC);
  const cachedResponse = await cache.match(request);

  // Always try to update cache in background
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  });

  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }

  // If no cache, wait for network
  try {
    return await fetchPromise;
  } catch (error) {
    console.error('Stale While Revalidate: Both cache and network failed', error);
    throw error;
  }
}

// Cache management utilities
export class CacheManager {
  // Clear all caches
  static async clearAll(): Promise<void> {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
  }

  // Clear specific cache
  static async clearCache(cacheName: string): Promise<void> {
    await caches.delete(cacheName);
  }

  // Get cache size
  static async getCacheSize(cacheName: string): Promise<number> {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    let size = 0;
    
    for (const request of keys) {
      const response = await cache.match(request);
      if (response) {
        const responseClone = response.clone();
        const blob = await responseClone.blob();
        size += blob.size;
      }
    }
    
    return size;
  }

  // Clean old cache entries
  static async cleanCache(cacheName: string, maxAge: number): Promise<void> {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    const now = Date.now();
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const dateHeader = response.headers.get('date');
        if (dateHeader) {
          const responseDate = new Date(dateHeader).getTime();
          if (now - responseDate > maxAge * 1000) {
            await cache.delete(request);
          }
        }
      }
    }
  }

  // Preload critical assets
  static async preloadAssets(urls: string[]): Promise<void> {
    const cache = await caches.open(CACHE_NAMES.STATIC);
    
    for (const url of urls) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          await cache.put(url, response);
        }
      } catch (error) {
        console.warn(`Failed to preload ${url}:`, error);
      }
    }
  }
}

// Critical assets to preload
export const CRITICAL_ASSETS = [
  '/',
  '/manifest.json',
  '/_next/static/css/app/layout.css',
  '/_next/static/chunks/webpack.js',
  '/_next/static/chunks/main-app.js',
];
