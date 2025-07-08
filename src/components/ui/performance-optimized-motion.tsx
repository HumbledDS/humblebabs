"use client"

import { motion, HTMLMotionProps } from "framer-motion"
import { ReactNode } from "react"

interface PerformanceMotionProps extends HTMLMotionProps<"div"> {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
}

// Optimized motion component with reduced complexity
export function PerformanceMotion({ 
  children, 
  className = "", 
  delay = 0, 
  duration = 0.6,
  ...props 
}: PerformanceMotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Simple fade-in component using CSS instead of Framer Motion
export function SimpleFadeIn({ 
  children, 
  className = "", 
  delay = 0 
}: { 
  children: ReactNode
  className?: string
  delay?: number 
}) {
  return (
    <div 
      className={`animate-fade-in ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  )
}

// Hover effect component using CSS
export function HoverEffect({ 
  children, 
  className = "" 
}: { 
  children: ReactNode
  className?: string 
}) {
  return (
    <div className={`transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${className}`}>
      {children}
    </div>
  )
} 