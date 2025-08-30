"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronRight, List } from "lucide-react"

interface SimpleTableOfContentsProps {
  content: string
}

interface TocItem {
  id: string
  title: string
  level: number
}

export function SimpleTableOfContents({ content }: SimpleTableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([])

  useEffect(() => {
    // Parse content to extract headings and generate IDs
    const headings = content.match(/^(#{1,6})\s+(.+)$/gm)
    if (headings) {
      const items: TocItem[] = headings.map((heading, index) => {
        const level = heading.match(/^(#{1,6})/)?.[1].length || 1
        const title = heading.replace(/^#{1,6}\s+/, '')
        // Generate a simple ID
        const id = `heading-${index}`
        return { id, title, level }
      })
      setTocItems(items)
      console.log("TOC Items:", items) // Debug log
    }
  }, [content])

  const scrollToHeading = (id: string) => {
    console.log("Scrolling to:", id) // Debug log
    const element = document.getElementById(id)
    if (element) {
      console.log("Element found:", element) // Debug log
      // Smooth scroll to the heading with offset for header
      const headerHeight = 100 // Adjust based on your header height
      const elementPosition = element.offsetTop - headerHeight
      
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth"
      })
    } else {
      console.log("Element not found for ID:", id) // Debug log
      // List all elements with IDs for debugging
      const allElements = document.querySelectorAll('[id]')
      console.log("All elements with IDs:", Array.from(allElements).map(el => ({ id: el.id, tagName: el.tagName, text: el.textContent?.slice(0, 50) })))
    }
  }

  if (tocItems.length === 0) return null

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
      <div className="flex items-center gap-2 mb-4">
        <List className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Table des matières
        </h3>
      </div>
      
      <nav className="space-y-1 max-h-96 overflow-y-auto">
        {tocItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => scrollToHeading(item.id)}
            className="w-full text-left px-3 py-2 rounded-lg transition-all duration-200 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white"
            style={{ paddingLeft: `${(item.level - 1) * 16 + 12}px` }}
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-2">
              <ChevronRight className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{item.title}</span>
              <span className="text-xs text-gray-400">({item.id})</span>
            </div>
          </motion.button>
        ))}
      </nav>
    </div>
  )
}
