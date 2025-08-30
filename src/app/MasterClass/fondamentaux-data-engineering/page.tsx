"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Clock, Users, BookOpen, TrendingUp, Database, Zap, Shield, Target, Lightbulb } from "lucide-react"
import { CourseLayout } from "../../../components/masterclass/CourseLayout"
import { Card, CardContent, CardHeader } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"

export default function FondamentauxDataEngineering() {
  const courseInfo = {
    title: "Niveau 1 : Fondamentaux Data Engineering",
    duration: "4-6 semaines",
    level: "Débutant",
    category: "Data Engineering",
    tags: ["Fondamentaux", "ETL", "ELT", "Data Modeling", "SQL", "Python", "Architecture"],
    featured: true
  }

  const learningObjectives = [
    {
      icon: Target,
      title: "Coder un ETL complet en Python",
      description: "Sans chercher sur ChatGPT toutes les 5 minutes"
    },
    {
      icon: Database,
      title: "Concevoir des pipelines modernes",
      description: "Avec Airflow + DBT"
    },
    {
      icon: TrendingUp,
      title: "Discuter architecture data",
      description: "Batch vs streaming, data lake vs warehouse"
    },
    {
      icon: Zap,
      title: "Résoudre des problèmes SQL complexes",
      description: "Window functions, CTEs, optimisation"
    },
    {
      icon: Shield,
      title: "Déployer une infrastructure data",
      description: "Basique sur le cloud"
    },
    {
      icon: Lightbulb,
      title: "Montrer des projets GitHub",
      description: "2-3 projets professionnels comme portfolio"
    }
  ]

  const approachSteps = [
    {
      title: "Learn",
      color: "text-green-600 dark:text-green-400",
      description: "Acquisition des concepts théoriques"
    },
    {
      title: "Build",
      color: "text-blue-600 dark:text-blue-400",
      description: "Application pratique dans des projets concrets"
    },
    {
      title: "Show",
      color: "text-purple-600 dark:text-purple-400",
      description: "Démonstration via un portfolio"
    },
    {
      title: "Repeat",
      color: "text-orange-600 dark:text-orange-400",
      description: "Itération et amélioration continue"
    }
  ]

  const dataVs = [
    {
      name: "Volume",
      icon: "📊",
      description: "Quantité massive de données générées chaque seconde",
      example: "2.5 quintillions d'octets par jour mondiale",
      color: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
    },
    {
      name: "Velocity",
      icon: "⚡",
      description: "Vitesse à laquelle les données sont générées et traitées",
      example: "Streaming en temps réel, micro-batches",
      color: "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20"
    },
    {
      name: "Variety",
      icon: "🎭",
      description: "Diversité des types et formats de données",
      example: "Structurées, semi-structurées, non-structurées",
      color: "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20"
    },
    {
      name: "Veracity",
      icon: "✅",
      description: "Qualité et fiabilité des données",
      example: "Data quality, completeness, accuracy",
      color: "from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20"
    },
    {
      name: "Value",
      icon: "💰",
      description: "Valeur business extraite des données",
      example: "Insights, prédictions, automatisation",
      color: "from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20"
    },
    {
      name: "Visualization",
      icon: "👁️",
      description: "Capacité à présenter et explorer les données",
      example: "Dashboards, reports, data apps",
      color: "from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20"
    }
  ]

  const architectureLayers = [
    {
      number: "1",
      title: "Couche d'Ingestion",
      description: "Collection des données depuis diverses sources (APIs, DB, files, streams)",
      color: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      number: "2",
      title: "Couche de Stockage",
      description: "Data Lake, Data Warehouse, bases de données spécialisées",
      color: "bg-green-100 dark:bg-green-900/30"
    },
    {
      number: "3",
      title: "Couche de Traitement",
      description: "ETL/ELT, transformations, agrégations, cleaning",
      color: "bg-purple-100 dark:bg-purple-900/30"
    },
    {
      number: "4",
      title: "Couche de Service",
      description: "APIs, dashboards, applications, ML models",
      color: "bg-orange-100 dark:bg-orange-900/30"
    },
    {
      number: "5",
      title: "Couche de Gouvernance",
      description: "Sécurité, qualité, conformité, métadonnées, monitoring",
      color: "bg-red-100 dark:bg-red-900/30"
    }
  ]

  return (
    <CourseLayout courseInfo={courseInfo} currentSlug="fondamentaux-data-engineering">
      {/* Learning Objectives */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-foreground">🎯 Objectifs Mesurables</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {learningObjectives.map((objective, index) => (
            <Card key={index} className="border-2 border-border shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-muted rounded-lg flex items-center justify-center border border-border">
                    <objective.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-foreground">{objective.title}</h3>
                    <p className="text-sm text-foreground">{objective.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Learning Approach */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-foreground">🔄 Approche Pédagogique</h2>
        <Card className="border-2 border-border shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-foreground">Learn → Build → Show → Repeat</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {approachSteps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center text-2xl font-bold border-2 border-border ${step.color}`}>
                    {index + 1}
                  </div>
                  <h4 className={`font-semibold mb-2 ${step.color}`}>{step.title}</h4>
                  <p className="text-sm text-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Data Engineering Role */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-foreground">👨‍💻 Rôle du Data Engineer</h2>
        <Card className="border-2 border-border shadow-lg">
          <CardContent className="p-6">
            <p className="text-foreground mb-4 leading-relaxed">
              Un Data Engineer est responsable de :
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-foreground">Concevoir et implémenter des pipelines de données robustes</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-foreground">Assurer la qualité et la cohérence des données</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-foreground">Optimiser les performances des systèmes de données</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-foreground">Maintenir l'infrastructure de données</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-foreground">Collaborer avec les équipes de données</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* The 6 Vs of Big Data */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-foreground">📊 Les 6 V du Big Data</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dataVs.map((dataV, index) => (
            <Card key={index} className={`border-2 border-border shadow-md bg-gradient-to-br ${dataV.color}`}>
              <CardContent className="p-6">
                <div className="text-3xl mb-3">{dataV.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">{dataV.name}</h3>
                <p className="text-sm text-foreground mb-3">{dataV.description}</p>
                <div className="text-xs text-foreground">
                  <strong>Ex:</strong> {dataV.example}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Architecture Layers */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-foreground">🏗️ Couches d'Architecture</h2>
        <Card className="border-2 border-border shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-4">
              {architectureLayers.map((layer, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-8 h-8 ${layer.color} rounded-full flex items-center justify-center border-2 border-border`}>
                    <span className="text-primary font-semibold text-sm">{layer.number}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-foreground">{layer.title}</h4>
                    <p className="text-sm text-foreground">{layer.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Next Steps */}
      <section className="mb-12">
        <Card className="border-2 border-border bg-muted/50 shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-foreground">📚 Prochaines Étapes</h3>
            <p className="text-foreground mb-6">
              Félicitations ! Vous avez terminé le Niveau 1. Vous êtes maintenant prêt à passer au niveau suivant.
            </p>
            <Link href="/MasterClass/modelisation-architecture-avancee">
              <Button className="gap-2 shadow-md">
                Niveau 2 : Modélisation et Architecture Avancée
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </CourseLayout>
  )
}
