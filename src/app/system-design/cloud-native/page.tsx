"use client"

import { motion } from "framer-motion"
import { ArrowRight, Cloud, Search, Filter, Sparkles } from "lucide-react"
import Link from "next/link"
import { BackNavigation } from "@/components/system-design/back-navigation"
import { ArchitectureCard } from "@/components/system-design/architecture-card"
import { cloudNativeArchitectures, cloudNativeCategories } from "@/lib/cloud-native-data"
import { useState, useMemo } from "react"

export default function CloudNativePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  // Filter architectures based on search and category
  const filteredArchitectures = useMemo(() => {
    let filtered = cloudNativeArchitectures

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

  const allCategories = ["All", ...cloudNativeCategories]

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
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Cloud className="w-6 h-6 text-purple-500" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">
                Cloud-Native Solutions
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Architecture patterns for building resilient, scalable, and efficient cloud applications. 
              Explore modern cloud-native approaches that leverage the full potential of cloud platforms.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="px-4 py-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="flex flex-col md:flex-row gap-4 items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cloud-native architectures..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border/50 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-300"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 rounded-xl border border-border/50 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-300"
              >
                {allCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cloud-Native Grid */}
      <section className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Cloud-Native Architecture Patterns
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore different architectural patterns for building scalable, resilient, and cost-effective cloud applications.
              Each pattern includes detailed explanations, trade-offs analysis, and implementation guidance.
            </p>
          </motion.div>

          {/* Results Count */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
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
                <ArchitectureCard
                  key={architecture.id}
                  id={architecture.id}
                  name={architecture.name}
                  description={architecture.description}
                  category={architecture.category}
                  technologies={architecture.technologies}
                  complexity={architecture.complexity}
                  performance={architecture.performance}
                  tradeOffs={architecture.tradeOffs}
                  useCases={architecture.useCases}
                  href={`/system-design/cloud-native/${architecture.id}`}
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
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
                <Cloud className="w-12 h-12 text-muted-foreground" />
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

          {/* Coming Soon Section */}
          <motion.div 
            className="text-center pt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="border-t border-border/50 pt-8">
              <p className="text-muted-foreground mb-4">
                More cloud-native patterns coming soon!
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span>• Edge Computing</span>
                <span>• Cloud Databases</span>
                <span>• Event-Driven Cloud</span>
                <span>• Hybrid Cloud</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
