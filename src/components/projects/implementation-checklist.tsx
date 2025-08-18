"use client"
import { motion } from "framer-motion"
import { CheckCircle, Circle, AlertTriangle, Clock, Target } from "lucide-react"
import { useState } from "react"

interface ChecklistItem {
  id: string
  title: string
  description: string
  category: "planning" | "implementation" | "testing" | "deployment" | "monitoring"
  priority: "low" | "medium" | "high" | "critical"
  estimatedTime?: string
  dependencies?: string[]
}

interface ImplementationChecklistProps {
  title: string
  description: string
  items: ChecklistItem[]
}

const categoryConfig = {
  planning: { color: "text-blue-600", bgColor: "bg-blue-50", icon: Target },
  implementation: { color: "text-green-600", bgColor: "bg-green-50", icon: CheckCircle },
  testing: { color: "text-purple-600", bgColor: "bg-purple-50", icon: Circle },
  deployment: { color: "text-orange-600", bgColor: "bg-orange-50", icon: Clock },
  monitoring: { color: "text-red-600", bgColor: "bg-red-50", icon: AlertTriangle }
}

const priorityConfig = {
  low: { color: "text-gray-500", bgColor: "bg-gray-100" },
  medium: { color: "text-blue-500", bgColor: "bg-blue-100" },
  high: { color: "text-orange-500", bgColor: "bg-orange-100" },
  critical: { color: "text-red-500", bgColor: "bg-red-100" }
}

export function ImplementationChecklist({ title, description, items }: ImplementationChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())
  const [filterCategory, setFilterCategory] = useState<string>("all")

  const toggleItem = (itemId: string) => {
    const newChecked = new Set(checkedItems)
    if (newChecked.has(itemId)) {
      newChecked.delete(itemId)
    } else {
      newChecked.add(itemId)
    }
    setCheckedItems(newChecked)
  }

  const filteredItems = filterCategory === "all" 
    ? items 
    : items.filter(item => item.category === filterCategory)

  const progress = (checkedItems.size / items.length) * 100

  return (
    <motion.div
      className="mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-foreground mb-3">{title}</h3>
        <p className="text-muted-foreground text-lg mb-4">{description}</p>
        
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">Progress</span>
            <span className="text-sm text-muted-foreground">{checkedItems.size} / {items.length} completed</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <motion.div
              className="bg-primary h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilterCategory("all")}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filterCategory === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            All Categories
          </button>
          {Object.entries(categoryConfig).map(([category, config]) => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filterCategory === category
                  ? `${config.bgColor} ${config.color}`
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredItems.map((item, index) => {
          const isChecked = checkedItems.has(item.id)
          const itemCategoryConfig = categoryConfig[item.category as keyof typeof categoryConfig]
          const itemPriorityConfig = priorityConfig[item.priority]
          const IconComponent = itemCategoryConfig.icon

          return (
            <motion.div
              key={item.id}
              className={`border rounded-xl p-4 transition-all duration-200 ${
                isChecked 
                  ? "border-green-200 bg-green-50/50" 
                  : "border-border/50 bg-card/50"
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleItem(item.id)}
                  className="flex-shrink-0 mt-1"
                >
                  {isChecked ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <Circle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
                  )}
                </button>

                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <h4 className={`font-semibold text-foreground ${isChecked ? 'line-through text-muted-foreground' : ''}`}>
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${itemPriorityConfig.bgColor} ${itemPriorityConfig.color}`}>
                        {item.priority}
                      </span>
                      {item.estimatedTime && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {item.estimatedTime}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className={`text-sm ${isChecked ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                    {item.description}
                  </p>

                  <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${itemCategoryConfig.bgColor}`}>
                      <IconComponent className={`w-4 h-4 ${itemCategoryConfig.color}`} />
                      <span className={`text-xs font-medium ${itemCategoryConfig.color}`}>
                        {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                      </span>
                    </div>

                    {item.dependencies && item.dependencies.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Dependencies: {item.dependencies.join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No items found for the selected category.
        </div>
      )}
    </motion.div>
  )
}
