"use client"

import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "./button"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-32 h-10 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse" />
    )
  }

  const themes = [
    { value: "light", label: "Clair", icon: Sun },
    { value: "dark", label: "Sombre", icon: Moon },
    { value: "system", label: "Système", icon: Monitor }
  ]

  return (
    <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-slate-800 rounded-lg">
      {themes.map((themeOption) => {
        const Icon = themeOption.icon
        const isActive = theme === themeOption.value
        
        return (
          <motion.div
            key={themeOption.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => setTheme(themeOption.value)}
              className={`flex items-center gap-2 px-3 py-2 h-8 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs font-medium">{themeOption.label}</span>
            </Button>
          </motion.div>
        )
      })}
    </div>
  )
}
