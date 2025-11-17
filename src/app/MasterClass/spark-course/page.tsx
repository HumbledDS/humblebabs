"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Clock, BookOpen } from "lucide-react"

export default function SparkCoursePage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="mb-8">
          <Link href="/MasterClass" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            MasterClass
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Apache Spark</h1>
          <p className="text-muted-foreground mb-6">Traitement distribué: RDD, DataFrames, Spark SQL, et optimisation des performances.</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-10">
            <span className="inline-flex items-center gap-2"><Clock className="w-4 h-4" /> 10-12 heures</span>
            <span className="inline-flex items-center gap-2"><BookOpen className="w-4 h-4" /> Intermédiaire</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

