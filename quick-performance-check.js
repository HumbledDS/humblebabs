// Quick Performance Check - Copy this into browser console
console.log('🚀 Quick Performance Check');

const startTime = performance.now();

window.addEventListener('load', () => {
  const loadTime = performance.now() - startTime;
  const nav = performance.getEntriesByType('navigation')[0];
  
  console.log('📊 Performance Summary:');
  console.log(`⏱️  Page Load: ${loadTime.toFixed(2)}ms`);
  
  if (nav) {
    console.log(`🧭 Total Navigation: ${(nav.loadEventEnd - nav.fetchStart).toFixed(2)}ms`);
    console.log(`🌐 Server Response: ${(nav.responseEnd - nav.responseStart).toFixed(2)}ms`);
  }
  
  const resources = performance.getEntriesByType('resource');
  const slowResources = resources.filter(r => r.duration > 1000);
  
  console.log(`📦 Resources: ${resources.length} total, ${slowResources.length} slow (>1s)`);
  
  const images = document.querySelectorAll('img');
  console.log(`🖼️ Images: ${images.length} total`);
  
  const motionElements = document.querySelectorAll('[data-framer-motion]');
  console.log(`🎭 Framer Motion: ${motionElements.length} components`);
  
  if (performance.memory) {
    console.log(`💾 Memory: ${(performance.memory.usedJSHeapSize / 1048576).toFixed(2)}MB used`);
  }
  
  // Check for common issues
  console.log('\n🔍 Issues Found:');
  
  if (loadTime > 3000) console.log('❌ Slow page load (>3s)');
  if (slowResources.length > 5) console.log('❌ Many slow resources');
  if (motionElements.length > 10) console.log('❌ Too many Framer Motion components');
  if (images.length > 20) console.log('❌ Too many images');
  
  if (loadTime < 2000 && slowResources.length < 3 && motionElements.length < 5) {
    console.log('✅ Performance looks good!');
  }
}); 