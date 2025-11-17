"use client"

import { motion } from "framer-motion"
import { Search, Filter } from "lucide-react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useI18n } from "@/components/i18n-provider"

interface CourseSearchFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedCategory: string
  onCategoryChange: (value: string) => void
  selectedLevel: string
  onLevelChange: (value: string) => void
  categories: string[]
  levels: string[]
}

export function CourseSearchFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedLevel,
  onLevelChange,
  categories,
  levels
}: CourseSearchFiltersProps) {
  const { t } = useI18n()
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="mb-12"
    >
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <motion.div 
          className="relative flex-1 max-w-md"
          whileHover={{ scale: 1.02 }}
          whileFocus={{ scale: 1.02 }}
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t("masterclass.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-background border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 hover:border-primary/50 shadow-sm"
          />
        </motion.div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => onCategoryChange(category)}
              whileHover={{ 
                scale: 1.05,
                y: -2,
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
              }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 border-2 ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground shadow-lg border-primary"
                  : "bg-background text-foreground hover:bg-muted border-border hover:border-primary/50 hover:shadow-md"
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* Level Filters */}
        <div className="flex flex-wrap gap-2">
          {levels.map((level) => (
            <motion.button
              key={level}
              onClick={() => onLevelChange(level)}
              whileHover={{ 
                scale: 1.05,
                y: -2,
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
              }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 border-2 ${
                selectedLevel === level
                  ? "bg-primary text-primary-foreground shadow-lg border-primary"
                  : "bg-background text-foreground hover:bg-muted border-border hover:border-primary/50 hover:shadow-md"
              }`}
            >
              {level}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
