"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Tag, Share2, BarChart3, Eye, Palette, Smartphone, Zap } from "lucide-react"

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
              Data Science
            </span>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              December 28, 2023
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              15 min read
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Data Visualization Best Practices with D3.js
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Master the art of creating compelling and informative data visualizations using D3.js.
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
              Data visualization is a powerful tool for communicating complex information effectively. 
              D3.js (Data-Driven Documents) is the most flexible and powerful library for creating 
              custom data visualizations on the web.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              In this comprehensive guide, we'll explore best practices for creating effective, 
              accessible, and performant data visualizations using D3.js.
            </p>
          </div>

          <h2 className="text-3xl font-bold mb-6">Core Principles of Data Visualization</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Before diving into D3.js specifics, let's understand the fundamental principles:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Clarity</h3>
              <p className="text-muted-foreground text-sm">
                Visualizations should clearly communicate the intended message without ambiguity.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Accuracy</h3>
              <p className="text-muted-foreground text-sm">
                Data should be represented truthfully without distortion or misleading scales.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Palette className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Aesthetics</h3>
              <p className="text-muted-foreground text-sm">
                Visual appeal enhances engagement while maintaining functionality.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Accessibility</h3>
              <p className="text-muted-foreground text-sm">
                Visualizations should be usable by people with diverse abilities and devices.
              </p>
            </motion.div>
          </div>

          <h2 className="text-3xl font-bold mb-6">D3.js Fundamentals</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Understanding D3.js core concepts is essential for effective visualization:
          </p>

          <div className="bg-muted/30 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Key Concepts:</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold">Selections</h4>
                  <p className="text-sm text-muted-foreground">Select and manipulate DOM elements</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold">Scales</h4>
                  <p className="text-sm text-muted-foreground">Map data values to visual properties</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold">Axes</h4>
                  <p className="text-sm text-muted-foreground">Create reference lines and labels</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold">Transitions</h4>
                  <p className="text-sm text-muted-foreground">Animate changes smoothly</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6">Choosing the Right Chart Type</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Selecting the appropriate visualization type is crucial for effective communication:
          </p>

          <div className="space-y-6 mb-8">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-xl font-semibold mb-3">Bar Charts</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Best for comparing quantities across categories. Use for discrete data with clear categories.
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <pre className="text-sm text-muted-foreground overflow-x-auto">
{`// Example: Creating a bar chart
const bars = svg.selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", d => xScale(d.category))
  .attr("y", d => yScale(d.value))
  .attr("width", xScale.bandwidth())
  .attr("height", d => height - yScale(d.value))`}
                </pre>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-xl font-semibold mb-3">Line Charts</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Ideal for showing trends over time or continuous relationships between variables.
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <pre className="text-sm text-muted-foreground overflow-x-auto">
{`// Example: Creating a line chart
const line = d3.line()
  .x(d => xScale(d.date))
  .y(d => yScale(d.value))

svg.append("path")
  .datum(data)
  .attr("d", line)
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 2)`}
                </pre>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-xl font-semibold mb-3">Scatter Plots</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Perfect for exploring relationships between two continuous variables and identifying patterns.
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <pre className="text-sm text-muted-foreground overflow-x-auto">
{`// Example: Creating a scatter plot
svg.selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", d => xScale(d.x))
  .attr("cy", d => yScale(d.y))
  .attr("r", 5)
  .attr("fill", "steelblue")`}
                </pre>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6">Color and Design Best Practices</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Effective use of color and design enhances comprehension:
          </p>

          <div className="bg-primary/5 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Color Guidelines:</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span className="text-muted-foreground">
                  <strong>Semantic Colors:</strong> Use colors that have meaning (red for negative, green for positive)
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span className="text-muted-foreground">
                  <strong>Color Blindness:</strong> Ensure sufficient contrast and avoid red-green combinations
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span className="text-muted-foreground">
                  <strong>Consistency:</strong> Use consistent color schemes across related visualizations
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span className="text-muted-foreground">
                  <strong>Accessibility:</strong> Maintain WCAG contrast ratios for text and background
                </span>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6">Performance Optimization</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Large datasets require careful optimization:
          </p>

          <div className="space-y-6 mb-8">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-xl font-semibold mb-3">Data Reduction</h3>
              <p className="text-muted-foreground leading-relaxed">
                Use techniques like sampling, binning, or aggregation to reduce the number of data points 
                while preserving important patterns and trends.
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-xl font-semibold mb-3">Canvas vs SVG</h3>
              <p className="text-muted-foreground leading-relaxed">
                Use Canvas for large datasets (10,000+ points) and SVG for smaller, interactive visualizations. 
                Canvas provides better performance but less interactivity.
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-xl font-semibold mb-3">Virtualization</h3>
              <p className="text-muted-foreground leading-relaxed">
                Only render visible elements in viewport-based visualizations. This is especially important 
                for long lists or large scatter plots.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6">Interactivity and User Experience</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Interactive elements enhance engagement and understanding:
          </p>

          <div className="bg-muted/30 rounded-xl p-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500/20 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold">Tooltips</h4>
                  <p className="text-sm text-muted-foreground">Provide detailed information on hover</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500/20 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold">Zoom and Pan</h4>
                  <p className="text-sm text-muted-foreground">Allow users to explore data at different scales</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500/20 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold">Filtering</h4>
                  <p className="text-sm text-muted-foreground">Enable users to focus on specific data subsets</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6">Accessibility Considerations</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Making visualizations accessible to all users is essential:
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span className="text-muted-foreground">
                <strong>Screen Reader Support:</strong> Provide alternative text and ARIA labels for all visual elements
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span className="text-muted-foreground">
                <strong>Keyboard Navigation:</strong> Ensure all interactive elements are keyboard accessible
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span className="text-muted-foreground">
                <strong>High Contrast:</strong> Maintain sufficient contrast ratios for all text and visual elements
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span className="text-muted-foreground">
                <strong>Responsive Design:</strong> Ensure visualizations work well on all screen sizes and devices
              </span>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6">Conclusion</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Creating effective data visualizations with D3.js requires a balance of technical skill, 
            design principles, and user experience considerations. By following these best practices, 
            you can create visualizations that are not only beautiful but also informative and accessible.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Remember that the goal of data visualization is to communicate insights clearly and effectively. 
            Always start with the data and the message you want to convey, then choose the appropriate 
            visualization technique and design accordingly.
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
            {["D3.js", "Visualization", "JavaScript", "Data", "Frontend", "Design"].map((tag) => (
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