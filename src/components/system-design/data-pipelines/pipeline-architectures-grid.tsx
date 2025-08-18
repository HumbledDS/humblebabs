"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { PipelineCard } from "./pipeline-card"
import { PipelineFilters } from "./pipeline-filters"
import { PipelineArchitecture, PipelineCategory } from "@/types"
import { pipelineArchitectures, pipelineCategories } from "@/lib/system-design-data"

export function PipelineArchitecturesGrid() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<PipelineCategory | "All">("All")

  // Filter architectures based on search and category
  const filteredArchitectures = useMemo(() => {
    let filtered = pipelineArchitectures

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(arch => arch.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(arch => 
        arch.name.toLowerCase().includes(query) ||
        arch.description.toLowerCase().includes(query) ||
        arch.technologies.some(tech => tech.toLowerCase().includes(query)) ||
        arch.useCases.some(useCase => useCase.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [searchQuery, selectedCategory])

  return (
    <div className="space-y-8">
      {/* Filters */}
      <PipelineFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={pipelineCategories}
      />

      {/* Results Count */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-lg text-muted-foreground">
          {filteredArchitectures.length === 0 
            ? "No architectures found matching your criteria."
            : `Found ${filteredArchitectures.length} architecture${filteredArchitectures.length === 1 ? '' : 's'}`
          }
        </p>
      </motion.div>

      {/* Architectures Grid */}
      {filteredArchitectures.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredArchitectures.map((architecture, index) => (
            <PipelineCard
              key={architecture.id}
              architecture={architecture}
              index={index}
            />
          ))}
        </div>
      ) : (
        /* No Results State */
        <motion.div 
          className="text-center py-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
            <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Try adjusting your search terms or category filter to find what you're looking for.
          </p>
          <button
            onClick={() => {
              setSearchQuery("")
              setSelectedCategory("All")
            }}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors duration-300"
          >
            Clear All Filters
          </button>
        </motion.div>
      )}

      {/* Load More / Add More Content */}
      <motion.div 
        className="text-center pt-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="border-t border-border/50 pt-8">
          <p className="text-muted-foreground mb-4">
            More pipeline architectures coming soon!
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>• Lambda Architecture</span>
            <span>• Kappa Architecture</span>
            <span>• Data Mesh</span>
            <span>• Event Sourcing</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
