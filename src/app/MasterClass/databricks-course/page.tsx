"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Clock, BookOpen } from "lucide-react"

export default function DatabricksCoursePage() {
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
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Databricks - Lakehouse</h1>
          <p className="text-muted-foreground mb-6">Notebooks, Jobs, Delta Lake, MLflow, Workflows et bonnes pratiques à l’échelle.</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-10">
            <span className="inline-flex items-center gap-2"><Clock className="w-4 h-4" /> 10-12 heures</span>
            <span className="inline-flex items-center gap-2"><BookOpen className="w-4 h-4" /> Intermédiaire</span>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Plan du cours (aperçu)</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Delta Lake: ACID, Time Travel</li>
              <li>Jobs & Workflows</li>
              <li>MLflow: tracking, model registry</li>
              <li>Coûts, monitoring et sécurité</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

