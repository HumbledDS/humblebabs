"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Circle, PlayCircle } from "lucide-react"

interface CourseProgressProps {
  totalSections: number
  completedSections: number
}

export function CourseProgress({ totalSections, completedSections }: CourseProgressProps) {
  const progress = totalSections > 0 ? (completedSections / totalSections) * 100 : 0

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
        Progression du cours
      </h4>
      
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
          <span>{completedSections} / {totalSections} sections</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {completedSections}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Complétées
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
          <div className="text-lg font-bold text-gray-600 dark:text-gray-400">
            {totalSections - completedSections}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Restantes
          </div>
        </div>
      </div>

      {/* Continue Button */}
      {completedSections < totalSections && (
        <motion.button
          className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <PlayCircle className="w-4 h-4" />
          Continuer le cours
        </motion.button>
      )}

      {completedSections === totalSections && (
        <motion.div
          className="w-full mt-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 py-2 px-4 rounded-lg flex items-center justify-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <CheckCircle className="w-4 h-4" />
          Cours terminé !
        </motion.div>
      )}
    </div>
  )
}
