"use client"

import { motion } from "framer-motion"
import { LoadingSpinner, LoadingDots } from "./loading-spinner"

interface PageLoadingProps {
  message?: string
  showProgress?: boolean
}

export function PageLoading({ message = "Loading...", showProgress = true }: PageLoadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="text-center space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <LoadingSpinner size="lg" />
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-2"
        >
          <p className="text-lg font-medium text-foreground">{message}</p>
          {showProgress && <LoadingDots />}
        </motion.div>
      </div>
    </motion.div>
  )
}

export function ContentLoading({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-20 ${className}`}>
      <div className="text-center space-y-4">
        <LoadingSpinner size="md" />
        <p className="text-sm text-muted-foreground">Loading content...</p>
      </div>
    </div>
  )
} 