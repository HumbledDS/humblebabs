// Performance Monitor - Copy and paste this into browser console
console.log('🚀 Performance Monitor Started');

// Performance metrics
const metrics = {
  startTime: performance.now(),
  navigationStart: performance.timing?.navigationStart || Date.now(),
  resources: [],
  animations: 0,
  images: 0,
  memory: null
};

// Monitor resource loading
const resourceObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    if (entry.entryType === 'resource') {
      metrics.resources.push({
        name: entry.name,
        duration: entry.duration,
        size: entry.transferSize || 0
      });
    }
  });
});

resourceObserver.observe({ entryTypes: ['resource'] });

// Monitor animations
const animationObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    if (entry.entryType === 'animation') {
      metrics.animations++;
    }
  });
});

animationObserver.observe({ entryTypes: ['animation'] });

// Monitor images
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && entry.target.tagName === 'IMG') {
      metrics.images++;
    }
  });
});

// Monitor memory usage
const getMemoryInfo = () => {
  if (performance.memory) {
    metrics.memory = {
      used: (performance.memory.usedJSHeapSize / 1048576).toFixed(2) + 'MB',
      total: (performance.memory.totalJSHeapSize / 1048576).toFixed(2) + 'MB',
      limit: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2) + 'MB'
    };
  }
};

// Monitor Framer Motion components
const countMotionComponents = () => {
  const motionElements = document.querySelectorAll('[data-framer-motion]');
  return motionElements.length;
};

// Monitor CSS animations
const countCSSAnimations = () => {
  const animatedElements = document.querySelectorAll('[class*="animate-"]');
  return animatedElements.length;
};

// Monitor large elements
const findLargeElements = () => {
  const elements = document.querySelectorAll('*');
  const largeElements = [];
  
  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    const area = rect.width * rect.height;
    if (area > 100000) { // Elements larger than 100k pixels
      largeElements.push({
        tag: el.tagName,
        area: Math.round(area),
        classes: el.className
      });
    }
  });
  
  return largeElements.slice(0, 5); // Top 5 largest
};

// Monitor slow operations
const monitorSlowOperations = () => {
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.duration > 50) { // Operations longer than 50ms
        console.warn('🐌 Slow operation detected:', {
          name: entry.name,
          duration: entry.duration.toFixed(2) + 'ms',
          startTime: entry.startTime.toFixed(2) + 'ms'
        });
      }
    });
  });
  
  observer.observe({ entryTypes: ['measure', 'paint', 'layout'] });
};

// Generate performance report
const generateReport = () => {
  const loadTime = performance.now() - metrics.startTime;
  const navigation = performance.getEntriesByType('navigation')[0];
  
  console.log('📊 Performance Report:');
  console.log('=====================');
  console.log(`⏱️  Total Load Time: ${loadTime.toFixed(2)}ms`);
  
  if (navigation) {
    console.log('🧭 Navigation Timing:');
    console.log(`  DNS Lookup: ${(navigation.domainLookupEnd - navigation.domainLookupStart).toFixed(2)}ms`);
    console.log(`  TCP Connection: ${(navigation.connectEnd - navigation.connectStart).toFixed(2)}ms`);
    console.log(`  Server Response: ${(navigation.responseEnd - navigation.responseStart).toFixed(2)}ms`);
    console.log(`  DOM Content Loaded: ${(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart).toFixed(2)}ms`);
    console.log(`  Page Load: ${(navigation.loadEventEnd - navigation.loadEventStart).toFixed(2)}ms`);
  }
  
  console.log('📦 Resources:');
  console.log(`  Total Resources: ${metrics.resources.length}`);
  console.log(`  Total Size: ${(metrics.resources.reduce((sum, r) => sum + r.size, 0) / 1024 / 1024).toFixed(2)}MB`);
  
  const slowResources = metrics.resources.filter(r => r.duration > 1000);
  if (slowResources.length > 0) {
    console.log('🐌 Slow Resources (>1s):');
    slowResources.forEach(r => {
      console.log(`  ${r.name}: ${r.duration.toFixed(2)}ms`);
    });
  }
  
  console.log('🎭 Animations:');
  console.log(`  Framer Motion Components: ${countMotionComponents()}`);
  console.log(`  CSS Animations: ${countCSSAnimations()}`);
  console.log(`  Total Animations: ${metrics.animations}`);
  
  console.log('🖼️ Images:');
  console.log(`  Total Images: ${metrics.images}`);
  
  console.log('💾 Memory:');
  getMemoryInfo();
  if (metrics.memory) {
    console.log(`  Used: ${metrics.memory.used}`);
    console.log(`  Total: ${metrics.memory.total}`);
    console.log(`  Limit: ${metrics.memory.limit}`);
  }
  
  console.log('📏 Large Elements:');
  const largeElements = findLargeElements();
  largeElements.forEach(el => {
    console.log(`  ${el.tag}: ${el.area}px² (${el.classes})`);
  });
  
  // Performance recommendations
  console.log('💡 Recommendations:');
  if (loadTime > 3000) console.log('  ⚠️  Load time is slow (>3s)');
  if (countMotionComponents() > 10) console.log('  ⚠️  Too many Framer Motion components');
  if (metrics.images > 20) console.log('  ⚠️  Too many images - consider lazy loading');
  if (slowResources.length > 5) console.log('  ⚠️  Many slow resources - optimize loading');
  
  console.log('=====================');
};

// Auto-generate report after page load
window.addEventListener('load', () => {
  setTimeout(generateReport, 1000);
});

// Monitor slow operations
monitorSlowOperations();

// Expose functions globally
window.performanceMonitor = {
  generateReport,
  metrics,
  countMotionComponents,
  countCSSAnimations,
  findLargeElements
};

console.log('✅ Performance Monitor Ready! Use window.performanceMonitor.generateReport() to get a report'); 