"use client"

import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav className={`flex items-center space-x-1 text-sm ${className}`} aria-label="Breadcrumb">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link
          href="/"
          className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
        >
          <Home className="w-4 h-4 mr-1" />
          Accueil
        </Link>
      </motion.div>
      
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: (index + 1) * 0.1 }}
          className="flex items-center"
        >
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 mx-1" />
          {item.href ? (
            <Link
              href={item.href}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 dark:text-white font-medium">
              {item.label}
            </span>
          )}
        </motion.div>
      ))}
    </nav>
  )
}
