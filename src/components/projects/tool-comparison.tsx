"use client"
import { motion } from "framer-motion"
import { CheckCircle, XCircle, Minus, Star, TrendingUp, Zap, Shield, DollarSign } from "lucide-react"
import { useState } from "react"

interface ToolFeature {
  name: string
  description: string
  category: string
}

interface ToolComparison {
  id: string
  name: string
  description: string
  logo?: string
  category: string
  pricing: "free" | "freemium" | "paid" | "enterprise"
  features: string[]
  pros: string[]
  cons: string[]
  bestFor: string[]
  notFor: string[]
  rating: number
  marketShare: string
  learningCurve: "easy" | "medium" | "hard"
  community: "small" | "medium" | "large"
  documentation: "poor" | "fair" | "good" | "excellent"
}

interface ToolComparisonProps {
  title: string
  description: string
  tools: ToolComparison[]
  features: ToolFeature[]
}

const ratingConfig = {
  easy: { color: "text-green-600", bgColor: "bg-green-100", label: "Easy" },
  medium: { color: "text-yellow-600", bgColor: "bg-yellow-100", label: "Medium" },
  hard: { color: "text-red-600", bgColor: "bg-red-100", label: "Hard" }
}

const communityConfig = {
  small: { color: "text-red-600", bgColor: "bg-red-100", label: "Small" },
  medium: { color: "text-yellow-600", bgColor: "bg-yellow-100", label: "Medium" },
  large: { color: "text-green-600", bgColor: "bg-green-100", label: "Large" }
}

const documentationConfig = {
  poor: { color: "text-red-600", bgColor: "bg-red-100", label: "Poor" },
  fair: { color: "text-yellow-600", bgColor: "bg-yellow-100", label: "Fair" },
  good: { color: "text-blue-600", bgColor: "bg-blue-100", label: "Good" },
  excellent: { color: "text-green-600", bgColor: "bg-green-100", label: "Excellent" }
}

export function ToolComparison({ title, description, tools, features }: ToolComparisonProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"rating" | "marketShare" | "learningCurve">("rating")

  const categories = Array.from(new Set(tools.map(tool => tool.category)))
  const filteredTools = selectedCategory === "all" 
    ? tools 
    : tools.filter(tool => tool.category === selectedCategory)

  const sortedTools = [...filteredTools].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating
      case "marketShare":
        return parseFloat(b.marketShare) - parseFloat(a.marketShare)
      case "learningCurve":
        const curveOrder = { easy: 3, medium: 2, hard: 1 }
        return curveOrder[b.learningCurve] - curveOrder[a.learningCurve]
      default:
        return 0
    }
  })

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
        
        {/* Filters and Sorting */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1 border border-border rounded-md text-sm bg-background"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'rating' | 'marketShare' | 'learningCurve')}
              className="px-3 py-1 border border-border rounded-md text-sm bg-background"
            >
              <option value="rating">Rating</option>
              <option value="marketShare">Market Share</option>
              <option value="learningCurve">Learning Curve</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid gap-6">
        {sortedTools.map((tool, index) => (
          <motion.div
            key={tool.id}
            className="border border-border/50 rounded-xl p-6 bg-card/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-xl font-bold text-foreground">{tool.name}</h4>
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    {tool.category}
                  </span>
                </div>
                <p className="text-muted-foreground mb-3">{tool.description}</p>
                
                {/* Rating and Stats */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(tool.rating) 
                            ? "text-yellow-500 fill-current" 
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-medium">{tool.rating}/5</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    {tool.marketShare}% market share
                  </div>
                </div>
              </div>
              
              {/* Pricing Badge */}
              <div className="flex-shrink-0">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  tool.pricing === "free" ? "bg-green-100 text-green-800" :
                  tool.pricing === "freemium" ? "bg-blue-100 text-blue-800" :
                  tool.pricing === "paid" ? "bg-orange-100 text-orange-800" :
                  "bg-purple-100 text-purple-800"
                }`}>
                  {tool.pricing.charAt(0).toUpperCase() + tool.pricing.slice(1)}
                </span>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Learning</div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  ratingConfig[tool.learningCurve].bgColor
                } ${ratingConfig[tool.learningCurve].color}`}>
                  {ratingConfig[tool.learningCurve].label}
                </span>
              </div>
              
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Community</div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  communityConfig[tool.community].bgColor
                } ${communityConfig[tool.community].color}`}>
                  {communityConfig[tool.community].label}
                </span>
              </div>
              
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Documentation</div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  documentationConfig[tool.documentation].bgColor
                } ${documentationConfig[tool.documentation].color}`}>
                  {documentationConfig[tool.documentation].label}
                </span>
              </div>
              
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Features</div>
                <span className="text-lg font-bold text-foreground">{tool.features.length}</span>
              </div>
            </div>

            {/* Features */}
            <div className="mb-6">
              <h5 className="font-semibold text-foreground mb-3">Key Features</h5>
              <div className="flex flex-wrap gap-2">
                {tool.features.map((feature, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Pros and Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Pros
                </h5>
                <ul className="space-y-2">
                  {tool.pros.map((pro, i) => (
                    <li key={i} className="text-sm text-green-700 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h5 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Cons
                </h5>
                <ul className="space-y-2">
                  {tool.cons.map((con, i) => (
                    <li key={i} className="text-sm text-red-700 flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Best For / Not For */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-border/50">
              <div>
                <h5 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-green-600" />
                  Best For
                </h5>
                <ul className="space-y-1">
                  {tool.bestFor.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h5 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-600" />
                  Not For
                </h5>
                <ul className="space-y-1">
                  {tool.notFor.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {sortedTools.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No tools found for the selected category.
        </div>
      )}
    </motion.div>
  )
}
