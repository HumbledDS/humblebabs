"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, X, ChevronDown } from "lucide-react"
import { PipelineCategory } from "@/types"

interface PipelineFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedCategory: PipelineCategory | "All"
  setSelectedCategory: (category: PipelineCategory | "All") => void
  categories: PipelineCategory[]
}

export function PipelineFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories
}: PipelineFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const allCategories = ["All", ...categories]

  return (
    <div className="bg-muted/30 rounded-xl p-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pipeline architectures..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border/50 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-300"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border/50 bg-background hover:bg-muted/50 transition-all duration-300"
          >
            <Filter className="w-4 h-4" />
            <span>{selectedCategory}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full right-0 mt-2 w-48 bg-background border border-border/50 rounded-xl shadow-lg z-10"
              >
                <div className="p-2">
                  {allCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category as PipelineCategory | "All")
                        setIsFilterOpen(false)
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                        selectedCategory === category
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground hover:bg-muted/50'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Active Filters Display */}
        {(searchQuery || selectedCategory !== "All") && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-sm"
          >
            <span className="text-muted-foreground">Active filters:</span>
            {searchQuery && (
              <span className="px-2 py-1 bg-primary/10 text-primary rounded-md">
                Search: "{searchQuery}"
              </span>
            )}
            {selectedCategory !== "All" && (
              <span className="px-2 py-1 bg-primary/10 text-primary rounded-md">
                Category: {selectedCategory}
              </span>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
