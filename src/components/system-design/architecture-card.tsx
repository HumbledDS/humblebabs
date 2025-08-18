"use client"

import { motion } from "framer-motion"
import { ArrowRight, Clock, Zap, Scale, Shield, DollarSign } from "lucide-react"
import Link from "next/link"

interface ArchitectureCardProps {
  id: string
  name: string
  description: string
  category: string
  technologies: string[]
  complexity: 'Low' | 'Medium' | 'High'
  performance: {
    latency: string
    throughput: string
    scalability: string
    cost: string
  }
  tradeOffs: Array<{
    aspect: string
    description: string
    impact: 'Positive' | 'Negative' | 'Neutral'
  }>
  useCases: string[]
  href: string
  index: number
}

const complexityColors = {
  Low: "text-green-600 bg-green-100 dark:bg-green-900/20",
  Medium: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20",
  High: "text-red-600 bg-red-100 dark:bg-red-900/20"
}

const impactColors = {
  Positive: "text-green-600",
  Negative: "text-red-600",
  Neutral: "text-gray-600"
}

export function ArchitectureCard({ 
  id, 
  name, 
  description, 
  category, 
  technologies, 
  complexity, 
  performance, 
  tradeOffs, 
  useCases, 
  href, 
  index 
}: ArchitectureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <div className="relative p-6 rounded-2xl border border-border/50 bg-card hover:bg-card/80 transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-xl group-hover:shadow-primary/10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 mb-2">
              {name}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {description}
            </p>
          </div>
          
          {/* Complexity Badge */}
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${complexityColors[complexity]}`}>
            {complexity} Complexity
          </span>
        </div>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {technologies.slice(0, 5).map((tech) => (
            <span 
              key={tech}
              className="px-2 py-1 text-xs font-medium bg-muted/50 text-muted-foreground rounded-md"
            >
              {tech}
            </span>
          ))}
          {technologies.length > 5 && (
            <span className="px-2 py-1 text-xs font-medium bg-muted/50 text-muted-foreground rounded-md">
              +{technologies.length - 5} more
            </span>
          )}
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="text-muted-foreground">Latency:</span>
            <span className="font-medium">{performance.latency}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-muted-foreground">Throughput:</span>
            <span className="font-medium">{performance.throughput}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Scale className="w-4 h-4 text-green-500" />
            <span className="text-muted-foreground">Scalability:</span>
            <span className="font-medium">{performance.scalability}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-purple-500" />
            <span className="text-muted-foreground">Cost:</span>
            <span className="font-medium">{performance.cost}</span>
          </div>
        </div>

        {/* Key Trade-offs */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-foreground mb-2">Key Trade-offs:</h4>
          <div className="space-y-1">
            {tradeOffs.slice(0, 3).map((tradeOff) => (
              <div key={tradeOff.aspect} className="flex items-center gap-2 text-xs">
                <span className={`w-2 h-2 rounded-full ${impactColors[tradeOff.impact] === 'text-green-600' ? 'bg-green-500' : impactColors[tradeOff.impact] === 'text-red-600' ? 'bg-red-500' : 'bg-gray-500'}`} />
                <span className="text-muted-foreground">{tradeOff.aspect}:</span>
                <span className="font-medium">{tradeOff.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-foreground mb-2">Use Cases:</h4>
          <div className="flex flex-wrap gap-1">
            {useCases.slice(0, 3).map((useCase) => (
              <span 
                key={useCase}
                className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-md"
              >
                {useCase}
              </span>
            ))}
            {useCases.length > 3 && (
              <span className="px-2 py-1 text-xs bg-muted/50 text-muted-foreground rounded-md">
                +{useCases.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between">
          <Link href={href}>
            <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform duration-300">
              <span>View Details</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </Link>
          
          {/* Category */}
          <span className="px-3 py-1 text-xs font-medium bg-muted/50 text-muted-foreground rounded-full">
            {category}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
