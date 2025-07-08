// Performance Test - Copy this into browser console
console.log('🚀 Testing Performance Improvements...');

const testNavigation = () => {
  const startTime = performance.now();
  
  // Test navigation timing
  const nav = performance.getEntriesByType('navigation')[0];
  if (nav) {
    const totalTime = nav.loadEventEnd - nav.fetchStart;
    const serverTime = nav.responseEnd - nav.responseStart;
    const domTime = nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart;
    
    console.log('📊 Navigation Performance:');
    console.log(`  Total Time: ${totalTime.toFixed(2)}ms`);
    console.log(`  Server Response: ${serverTime.toFixed(2)}ms`);
    console.log(`  DOM Ready: ${domTime.toFixed(2)}ms`);
    
    if (totalTime < 3000) {
      console.log('✅ Good performance!');
    } else if (totalTime < 5000) {
      console.log('⚠️  Moderate performance');
    } else {
      console.log('❌ Slow performance');
    }
  }
  
  // Test resource loading
  const resources = performance.getEntriesByType('resource');
  const slowResources = resources.filter(r => r.duration > 1000);
  
  console.log('\n📦 Resource Loading:');
  console.log(`  Total Resources: ${resources.length}`);
  console.log(`  Slow Resources (>1s): ${slowResources.length}`);
  
  if (slowResources.length > 0) {
    console.log('  Slowest resources:');
    slowResources.slice(0, 3).forEach(r => {
      console.log(`    ${r.name}: ${r.duration.toFixed(2)}ms`);
    });
  }
  
  // Test animations
  const motionElements = document.querySelectorAll('[data-framer-motion]');
  const cssAnimations = document.querySelectorAll('[class*="animate-"]');
  
  console.log('\n🎭 Animations:');
  console.log(`  Framer Motion: ${motionElements.length}`);
  console.log(`  CSS Animations: ${cssAnimations.length}`);
  
  // Test images
  const images = document.querySelectorAll('img');
  console.log(`\n🖼️ Images: ${images.length} total`);
  
  // Memory usage
  if (performance.memory) {
    const usedMB = (performance.memory.usedJSHeapSize / 1048576).toFixed(2);
    console.log(`\n💾 Memory: ${usedMB}MB used`);
  }
  
  console.log('\n✨ Performance test complete!');
};

// Run test after page loads
if (document.readyState === 'loading') {
  window.addEventListener('load', testNavigation);
} else {
  testNavigation();
} 