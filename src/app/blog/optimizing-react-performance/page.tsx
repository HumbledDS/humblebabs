"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Tag, Share2, Zap, Code, TrendingUp, Cpu, Smartphone } from "lucide-react"

export default function BlogPost() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              Web Development
            </span>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              January 5, 2024
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              10 min read
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Optimizing React Performance: A Deep Dive
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Advanced techniques for optimizing React applications, from code splitting to memoization strategies.
          </p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold">H</span>
              </div>
              <div>
                <p className="font-medium text-foreground">HumbleBabs</p>
                <p className="text-sm text-muted-foreground">Data Scientist & AI Engineer</p>
              </div>
            </div>
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="prose prose-lg max-w-none"
        >
          <div className="bg-card rounded-2xl border border-border p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Performance optimization in React applications is crucial for providing a smooth user experience. 
              As applications grow in complexity, understanding and implementing performance optimization techniques 
              becomes essential for maintaining fast load times and responsive interactions.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              In this comprehensive guide, we'll explore advanced React performance optimization techniques, 
              from code splitting and lazy loading to memoization and virtualization strategies.
            </p>
          </div>

          <h2 className="text-3xl font-bold mb-6">Performance Metrics to Monitor</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Before diving into optimization techniques, it's important to understand what metrics to track:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">First Contentful Paint (FCP)</h3>
              <p className="text-muted-foreground text-sm">
                Time until the first piece of content is rendered on the screen.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Largest Contentful Paint (LCP)</h3>
              <p className="text-muted-foreground text-sm">
                Time until the largest content element is visible to the user.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Cpu className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Time to Interactive (TTI)</h3>
              <p className="text-muted-foreground text-sm">
                Time until the page becomes fully interactive for the user.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Cumulative Layout Shift (CLS)</h3>
              <p className="text-muted-foreground text-sm">
                Measure of visual stability and unexpected layout shifts.
              </p>
            </motion.div>
          </div>

          <h2 className="text-3xl font-bold mb-6">Code Splitting Strategies</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Code splitting is one of the most effective ways to improve initial load performance:
          </p>

          <div className="bg-muted/30 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Route-Based Splitting:</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold">React.lazy()</h4>
                  <p className="text-sm text-muted-foreground">Lazy load components based on routes</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold">Dynamic Imports</h4>
                  <p className="text-sm text-muted-foreground">Load components on-demand with webpack</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold">Bundle Analysis</h4>
                  <p className="text-sm text-muted-foreground">Identify and split large dependencies</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6">Memoization Techniques</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Preventing unnecessary re-renders is crucial for performance:
          </p>

          <div className="space-y-6 mb-8">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-xl font-semibold mb-3">React.memo()</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Memoize functional components to prevent re-renders when props haven't changed.
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <pre className="text-sm text-muted-foreground overflow-x-auto">
{`const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* Expensive rendering logic */}</div>
})`}
                </pre>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-xl font-semibold mb-3">useMemo() Hook</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Memoize expensive calculations to avoid recomputation on every render.
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <pre className="text-sm text-muted-foreground overflow-x-auto">
{`const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b)
}, [a, b])`}
                </pre>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-xl font-semibold mb-3">useCallback() Hook</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Memoize functions to prevent child components from re-rendering unnecessarily.
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <pre className="text-sm text-muted-foreground overflow-x-auto">
{`const handleClick = useCallback(() => {
  // Handle click logic
}, [dependency])`}
                </pre>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6">Virtualization for Large Lists</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            When dealing with large datasets, virtualization is essential:
          </p>

          <div className="bg-primary/5 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Benefits of Virtualization:</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span className="text-muted-foreground">
                  <strong>Memory Efficiency:</strong> Only render visible items, reducing DOM nodes
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span className="text-muted-foreground">
                  <strong>Performance:</strong> Maintains smooth scrolling with thousands of items
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span className="text-muted-foreground">
                  <strong>Scalability:</strong> Handle datasets of any size without performance degradation
                </span>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6">Bundle Optimization</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Optimizing your JavaScript bundle size is crucial for fast loading:
          </p>

          <div className="space-y-6 mb-8">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-xl font-semibold mb-3">Tree Shaking</h3>
              <p className="text-muted-foreground leading-relaxed">
                Remove unused code from your bundle using ES6 modules and proper build configuration. 
                Modern bundlers like webpack and Rollup automatically eliminate dead code.
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-xl font-semibold mb-3">Library Optimization</h3>
              <p className="text-muted-foreground leading-relaxed">
                Use smaller alternatives to heavy libraries. For example, use date-fns instead of moment.js, 
                or lodash-es for tree-shakeable utility functions.
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-xl font-semibold mb-3">Dynamic Imports</h3>
              <p className="text-muted-foreground leading-relaxed">
                Load heavy libraries only when needed. For example, load chart libraries only when 
                the user navigates to a page that requires them.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6">Performance Monitoring</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Continuous monitoring is essential for maintaining performance:
          </p>

          <div className="bg-muted/30 rounded-xl p-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500/20 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold">React DevTools Profiler</h4>
                  <p className="text-sm text-muted-foreground">Profile component render times and identify bottlenecks</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500/20 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold">Web Vitals</h4>
                  <p className="text-sm text-muted-foreground">Monitor Core Web Vitals in production</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500/20 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold">Bundle Analyzer</h4>
                  <p className="text-sm text-muted-foreground">Analyze bundle size and identify optimization opportunities</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6">Conclusion</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            React performance optimization is an ongoing process that requires understanding of both 
            React's rendering mechanism and modern web performance best practices. By implementing 
            these techniques systematically, you can create fast, responsive applications that provide 
            excellent user experiences.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Remember to measure performance before and after optimizations, and always prioritize 
            user experience over premature optimization. The key is to identify bottlenecks and 
            apply the right optimization technique for each specific case.
          </p>
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-border"
        >
          <div className="flex items-center gap-4 mb-4">
            <Tag className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium text-foreground">Tags:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {["React", "Performance", "JavaScript", "Frontend", "Web Development", "Optimization"].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-muted/50 rounded-full text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
} 