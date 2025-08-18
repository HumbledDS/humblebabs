"use client"

import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface BackNavigationProps {
  href: string
  label: string
}

export function BackNavigation({ href, label }: BackNavigationProps) {
  return (
    <motion.div 
      className="flex items-center gap-4 mb-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link 
        href={href}
        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300 group"
      >
        <motion.div
          whileHover={{ x: -3 }}
          transition={{ duration: 0.2 }}
        >
          <ArrowLeft className="w-4 h-4" />
        </motion.div>
        <span className="group-hover:underline">{label}</span>
      </Link>
    </motion.div>
  )
}
