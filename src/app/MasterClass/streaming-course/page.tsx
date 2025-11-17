"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Clock, BookOpen } from "lucide-react"

export default function StreamingCoursePage() {
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
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Streaming (Kafka, Flink)</h1>
          <p className="text-muted-foreground mb-6">Producteurs, consommateurs, partitions, exactly-once, stateful stream processing.</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-10">
            <span className="inline-flex items-center gap-2"><Clock className="w-4 h-4" /> 12-14 heures</span>
            <span className="inline-flex items-center gap-2"><BookOpen className="w-4 h-4" /> Avancé</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

