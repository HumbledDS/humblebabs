// Bundle Analysis Script
// Run this to analyze your Next.js bundle size

const fs = require('fs');
const path = require('path');

console.log('📊 Bundle Analysis Tool');

// Check if .next directory exists
const nextDir = path.join(process.cwd(), '.next');
if (!fs.existsSync(nextDir)) {
  console.log('❌ .next directory not found. Run "npm run build" first.');
  process.exit(1);
}

// Analyze static files
const staticDir = path.join(nextDir, 'static');
if (fs.existsSync(staticDir)) {
  console.log('\n📁 Static Files Analysis:');
  
  const analyzeDirectory = (dir, prefix = '') => {
    const items = fs.readdirSync(dir);
    let totalSize = 0;
    
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        const subSize = analyzeDirectory(itemPath, prefix + '  ');
        totalSize += subSize;
      } else {
        const sizeKB = (stat.size / 1024).toFixed(2);
        console.log(`${prefix}📄 ${item}: ${sizeKB}KB`);
        totalSize += stat.size;
      }
    });
    
    return totalSize;
  };
  
  const totalStaticSize = analyzeDirectory(staticDir);
  console.log(`\n📦 Total Static Size: ${(totalStaticSize / 1024 / 1024).toFixed(2)}MB`);
}

// Analyze package.json dependencies
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
console.log('\n📋 Dependencies Analysis:');

const dependencies = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies
};

// Known large packages
const largePackages = {
  'framer-motion': 'Animation library - can be heavy',
  'lucide-react': 'Icon library - consider tree shaking',
  '@radix-ui/react-*': 'UI components - multiple imports',
  'tailwindcss': 'CSS framework - large CSS output',
  'next': 'Framework - core dependency',
  'react': 'Core library',
  'react-dom': 'Core library'
};

Object.keys(dependencies).forEach(dep => {
  const size = largePackages[dep] || 'Unknown size';
  console.log(`📦 ${dep}: ${size}`);
});

console.log('\n💡 Optimization Recommendations:');
console.log('1. Use dynamic imports for heavy components');
console.log('2. Implement code splitting with React.lazy()');
console.log('3. Optimize Framer Motion usage');
console.log('4. Use tree shaking for icon libraries');
console.log('5. Consider replacing heavy dependencies');

// Check for potential issues
console.log('\n🔍 Potential Issues:');
if (dependencies['framer-motion']) {
  console.log('⚠️  Framer Motion detected - consider reducing animations');
}
if (Object.keys(dependencies).filter(d => d.startsWith('@radix-ui')).length > 5) {
  console.log('⚠️  Many Radix UI components - consider lazy loading');
}
if (dependencies['tailwindcss']) {
  console.log('⚠️  Tailwind CSS - ensure proper purging');
}

export default {}; 