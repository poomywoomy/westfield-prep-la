// Web Vitals monitoring for performance tracking
// Logs Core Web Vitals (LCP, FID, CLS) to console in development

type MetricType = 'LCP' | 'FID' | 'CLS' | 'FCP' | 'TTFB';

interface Metric {
  name: MetricType;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

const thresholds: Record<MetricType, { good: number; poor: number }> = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
};

function getRating(name: MetricType, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = thresholds[name];
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

function logMetric(metric: Metric) {
  if (!import.meta.env.DEV) return;

  const color = metric.rating === 'good' ? '✅' : metric.rating === 'needs-improvement' ? '⚠️' : '❌';
  console.log(
    `${color} Web Vital: ${metric.name}`,
    `${Math.round(metric.value)}${metric.name === 'CLS' ? '' : 'ms'}`,
    `(${metric.rating})`
  );
}

export function initWebVitals() {
  if (!import.meta.env.DEV) return;

  // Largest Contentful Paint (LCP)
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number };
    const value = lastEntry.renderTime || lastEntry.loadTime || 0;
    logMetric({ name: 'LCP', value, rating: getRating('LCP', value) });
  });

  try {
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) {
    // LCP not supported
  }

  // First Contentful Paint (FCP)
  const paintObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.name === 'first-contentful-paint') {
        logMetric({ name: 'FCP', value: entry.startTime, rating: getRating('FCP', entry.startTime) });
      }
    });
  });

  try {
    paintObserver.observe({ type: 'paint', buffered: true });
  } catch (e) {
    // Paint timing not supported
  }

  // Cumulative Layout Shift (CLS)
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries() as any[]) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    }
    logMetric({ name: 'CLS', value: clsValue, rating: getRating('CLS', clsValue) });
  });

  try {
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  } catch (e) {
    // Layout shift not supported
  }

  // First Input Delay (FID)
  const fidObserver = new PerformanceObserver((list) => {
    const firstInput = list.getEntries()[0] as PerformanceEntry & { processingStart?: number };
    const value = firstInput.processingStart ? firstInput.processingStart - firstInput.startTime : 0;
    logMetric({ name: 'FID', value, rating: getRating('FID', value) });
  });

  try {
    fidObserver.observe({ type: 'first-input', buffered: true });
  } catch (e) {
    // FID not supported
  }

  // Time to First Byte (TTFB)
  const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (navEntry) {
    const ttfb = navEntry.responseStart - navEntry.requestStart;
    logMetric({ name: 'TTFB', value: ttfb, rating: getRating('TTFB', ttfb) });
  }
}
