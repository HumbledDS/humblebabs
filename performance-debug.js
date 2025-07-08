// Performance Debugging Script
// Run this in your browser console to measure performance

console.log('🚀 Performance Debug Tool Started');

// 1. Measure Page Load Time
const pageLoadTime = performance.now();
window.addEventListener('load', () => {
  const loadTime = performance.now() - pageLoadTime;
  console.log(`📊 Page Load Time: ${loadTime.toFixed(2)}ms`);
  
  // Performance marks
  const marks = performance.getEntriesByType('mark');
  console.log('📈 Performance Marks:', marks);
  
  // Performance measures
  const measures = performance.getEntriesByType('measure');
  console.log('📏 Performance Measures:', measures);
});

// 2. Measure Resource Loading
const resourceObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    if (entry.entryType === 'resource') {
      console.log(`📦 Resource: ${entry.name} - ${entry.duration.toFixed(2)}ms`);
    }
  });
});
resourceObserver.observe({ entryTypes: ['resource'] });

// 3. Measure Navigation Timing
const navigationTiming = performance.getEntriesByType('navigation')[0];
if (navigationTiming) {
  console.log('🧭 Navigation Timing:', {
    'DNS Lookup': `${navigationTiming.domainLookupEnd - navigationTiming.domainLookupStart}ms`,
    'TCP Connection': `${navigationTiming.connectEnd - navigationTiming.connectStart}ms`,
    'Server Response': `${navigationTiming.responseEnd - navigationTiming.responseStart}ms`,
    'DOM Content Loaded': `${navigationTiming.domContentLoadedEventEnd - navigationTiming.domContentLoadedEventStart}ms`,
    'Page Load': `${navigationTiming.loadEventEnd - navigationTiming.loadEventStart}ms`,
    'Total Time': `${navigationTiming.loadEventEnd - navigationTiming.fetchStart}ms`
  });
}

// 4. Measure Bundle Size (if available)
if (window.__NEXT_DATA__) {
  console.log('📦 Next.js Bundle Info:', {
    buildId: window.__NEXT_DATA__.buildId,
    runtimeConfig: window.__NEXT_DATA__.runtimeConfig
  });
}

// 5. Measure Memory Usage
if (performance.memory) {
  console.log('💾 Memory Usage:', {
    'Used JS Heap': `${(performance.memory.usedJSHeapSize / 1048576).toFixed(2)}MB`,
    'Total JS Heap': `${(performance.memory.totalJSHeapSize / 1048576).toFixed(2)}MB`,
    'JS Heap Limit': `${(performance.memory.jsHeapSizeLimit / 1048576).toFixed(2)}MB`
  });
}

// 6. Measure Framer Motion Performance
const measureFramerMotion = () => {
  const motionElements = document.querySelectorAll('[data-framer-motion]');
  console.log(`🎭 Framer Motion Elements: ${motionElements.length}`);
  
  // Measure animation performance
  let totalAnimations = 0;
  motionElements.forEach(el => {
    const animations = el.getAnimations();
    totalAnimations += animations.length;
  });
  console.log(`🎬 Total Animations: ${totalAnimations}`);
};

// 7. Measure Image Loading
const measureImages = () => {
  const images = document.querySelectorAll('img');
  console.log(`🖼️ Total Images: ${images.length}`);
  
  let loadedImages = 0;
  let totalImageSize = 0;
  
  images.forEach(img => {
    if (img.complete) {
      loadedImages++;
      // Estimate image size (rough calculation)
      totalImageSize += (img.naturalWidth * img.naturalHeight * 4) / 1024; // KB
    }
  });
  
  console.log(`📸 Loaded Images: ${loadedImages}/${images.length}`);
  console.log(`💾 Estimated Image Size: ${(totalImageSize / 1024).toFixed(2)}MB`);
};

// 8. Measure CSS Size
const measureCSS = () => {
  const stylesheets = document.styleSheets;
  console.log(`🎨 Stylesheets: ${stylesheets.length}`);
  
  let totalCSSRules = 0;
  for (let i = 0; i < stylesheets.length; i++) {
    try {
      totalCSSRules += stylesheets[i].cssRules.length;
    } catch (e) {
      // Cross-origin stylesheets
    }
  }
  console.log(`📋 Total CSS Rules: ${totalCSSRules}`);
};

// Run measurements after page load
window.addEventListener('load', () => {
  setTimeout(() => {
    measureFramerMotion();
    measureImages();
    measureCSS();
  }, 1000);
});

// 9. Performance Tips
console.log(`
💡 Performance Tips:
1. Use React.lazy() for code splitting
2. Optimize images with next/image
3. Reduce Framer Motion animations
4. Use CSS-in-JS sparingly
5. Implement proper caching
6. Use static generation where possible
`);

export default {}; 