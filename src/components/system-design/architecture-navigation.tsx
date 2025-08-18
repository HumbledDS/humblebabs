"use client"

import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, ArrowUp } from "lucide-react"
import Link from "next/link"

interface ArchitectureNavigationProps {
  currentArchitecture: {
    id: string
    name: string
    category: string
    complexity: 'Low' | 'Medium' | 'High'
  }
  allArchitectures: Array<{
    id: string
    name: string
    category: string
    complexity: 'Low' | 'Medium' | 'High'
  }>
  sectionHref: string
  sectionTitle: string
}

export function ArchitectureNavigation({ 
  currentArchitecture, 
  allArchitectures, 
  sectionHref, 
  sectionTitle 
}: ArchitectureNavigationProps) {
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
        <h3 className="text-2xl font-bold text-center mb-8">Explore Other {sectionTitle} Architectures</h3>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          {/* Previous Architecture Link/Placeholder */}
          <div className="flex-1">
            {prevArchitecture ? (
              <Link
                href={`${sectionHref}/${prevArchitecture.id}`}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm">Previous: {prevArchitecture.name}</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground/50">
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm">No previous architecture</span>
              </div>
            )}
          </div>

          {/* Back to Overview Link */}
          <div className="flex-shrink-0">
            <Link
              href={sectionHref}
              className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors duration-300"
            >
              <ArrowUp className="w-4 h-4" />
              <span className="text-sm font-medium">Back to {sectionTitle}</span>
            </Link>
          </div>

          {/* Next Architecture Link/Placeholder */}
          <div className="flex-1 text-right">
            {nextArchitecture ? (
              <Link
                href={`${sectionHref}/${nextArchitecture.id}`}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300 ml-auto justify-end"
              >
                <span className="text-sm">Next: {nextArchitecture.name}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground/50 ml-auto justify-end">
                <span className="text-sm">No next architecture</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>

        {/* All Architectures Grid */}
        <div className="mt-12">
          <h4 className="text-lg font-semibold text-center mb-6">All {sectionTitle} Architectures</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allArchitectures.map((arch) => (
              <Link
                key={arch.id}
                href={`${sectionHref}/${arch.id}`}
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
