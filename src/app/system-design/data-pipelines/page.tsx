"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Database } from "lucide-react"
import Link from "next/link"
import { BackNavigation } from "@/components/system-design/back-navigation"
import { PipelineArchitecturesGrid } from "@/components/system-design/data-pipelines/pipeline-architectures-grid"

export default function DataPipelineArchitecturesPage() {
  return (
    <div className="flex flex-col">
      {/* Header with back navigation */}
      <section className="px-4 py-8 border-b border-border/50">
        <div className="max-w-7xl mx-auto">
          <BackNavigation href="/system-design" label="Back to System Design" />

          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Database className="w-6 h-6 text-blue-500" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">
                Data Pipeline Architectures
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive guides to various data pipeline architectures with explanations, 
              trade-offs, and interactive flow diagrams. Master the art of building scalable data systems.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pipeline Architectures Grid */}
      <section className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Pipeline Architecture Patterns
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore different architectural patterns for building robust and scalable data pipelines. 
              Each pattern includes detailed explanations, trade-offs analysis, and implementation guidance.
            </p>
          </motion.div>

          {/* Pipeline Architectures Grid Component */}
          <PipelineArchitecturesGrid />
        </div>
      </section>
    </div>
  )
}
