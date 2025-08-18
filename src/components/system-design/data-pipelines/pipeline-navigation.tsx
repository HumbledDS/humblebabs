"use client"

import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, ArrowUp } from "lucide-react"
import Link from "next/link"
import { PipelineArchitecture } from "@/types"

interface PipelineNavigationProps {
  currentArchitecture: PipelineArchitecture
  allArchitectures: PipelineArchitecture[]
}

export function PipelineNavigation({ currentArchitecture, allArchitectures }: PipelineNavigationProps) {
  const currentIndex = allArchitectures.findIndex(arch => arch.id === currentArchitecture.id)
  const prevArchitecture = currentIndex > 0 ? allArchitectures[currentIndex - 1] : null
  const nextArchitecture = currentIndex < allArchitectures.length - 1 ? allArchitectures[currentIndex + 1] : null

  return (
    <motion.div 
      className="border-t border-border/50 pt-8 mt-16"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <h3 className="text-2xl font-bold text-center mb-8">Explore Other Pipeline Architectures</h3>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          {/* Previous Architecture */}
          {prevArchitecture ? (
            <Link 
              href={`/system-design/data-pipelines/${prevArchitecture.id}`}
              className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-card hover:bg-card/80 transition-all duration-300 group hover:border-primary/30"
            >
              <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Previous</div>
                <div className="font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                  {prevArchitecture.name}
                </div>
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-muted/30 text-muted-foreground">
              <ChevronLeft className="w-5 h-5" />
              <div className="text-right">
                <div className="text-sm">Previous</div>
                <div className="font-medium">No more</div>
              </div>
            </div>
          )}

          {/* Back to Overview */}
          <Link 
            href="/system-design/data-pipelines"
            className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-primary/10 hover:bg-primary/20 transition-all duration-300 group"
          >
            <ArrowUp className="w-5 h-5 text-primary" />
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Back to</div>
              <div className="font-medium text-primary">Overview</div>
            </div>
          </Link>

          {/* Next Architecture */}
          {nextArchitecture ? (
            <Link 
              href={`/system-design/data-pipelines/${nextArchitecture.id}`}
              className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-card hover:bg-card/80 transition-all duration-300 group hover:border-primary/30"
            >
              <div className="text-left">
                <div className="text-sm text-muted-foreground">Next</div>
                <div className="font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                  {nextArchitecture.name}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
            </Link>
          ) : (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-muted/30 text-muted-foreground">
              <div className="text-left">
                <div className="text-sm">Next</div>
                <div className="font-medium">No more</div>
              </div>
              <ChevronRight className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* All Architectures Grid */}
        <div className="mt-12">
          <h4 className="text-lg font-semibold text-center mb-6">All Pipeline Architectures</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allArchitectures.map((arch) => (
              <Link
                key={arch.id}
                href={`/system-design/data-pipelines/${arch.id}`}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  arch.id === currentArchitecture.id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border/50 bg-card hover:bg-card/80 hover:border-primary/30'
                }`}
              >
                <div className="font-medium mb-2">{arch.name}</div>
                <div className="text-sm text-muted-foreground">{arch.category}</div>
                <div className={`text-xs mt-2 ${
                  arch.id === currentArchitecture.id ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {arch.complexity} Complexity
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
