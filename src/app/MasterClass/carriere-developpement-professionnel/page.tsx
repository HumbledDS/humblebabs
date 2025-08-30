"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { MasterClassLayout } from "../../../components/masterclass/MasterClassLayout"

export default function CarriereDeveloppementProfessionnel() {
  const courseInfo = {
    title: "Niveau 6 : Carrière et Développement Professionnel",
    duration: "4-6 semaines",
    level: "Tous niveaux",
    category: "Career",
    tags: ["Carrière", "Spécialisations", "Certifications", "Networking", "Entrepreneuriat"],
    featured: true
  }

  return (
    <MasterClassLayout courseInfo={courseInfo} currentSlug="carriere-developpement-professionnel">
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 mb-6 border-b-4 border-blue-500 pb-4">
            Niveau 6 : Carrière et Développement Professionnel
          </h1>
          <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed">
            Développez votre carrière en Data Engineering avec des roadmaps détaillés, des spécialisations, 
            des certifications, et des stratégies pour l'entrepreneuriat et l'innovation.
          </p>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-6">
            Développement de Carrière
          </h2>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
            Ce niveau final vous guide dans le développement de votre carrière en Data Engineering, 
            de la spécialisation technique à l'entrepreneuriat.
          </p>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
        >
          <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-3">
            🎉 Félicitations !
          </h3>
          <p className="text-green-700 dark:text-green-300 mb-4">
            Vous avez terminé tous les niveaux de la MasterClass Data Engineering. Vous disposez 
            maintenant de toutes les compétences nécessaires pour exceller dans ce domaine !
          </p>
          <div className="flex justify-between items-center">
            <Link
              href="/MasterClass/entretiens-tests-techniques"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Niveau 5 : Entretiens Techniques
            </Link>
            
            <Link
              href="/MasterClass"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Retour aux Cours
            </Link>
          </div>
        </motion.div>
      </div>
    </MasterClassLayout>
  )
}
