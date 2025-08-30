"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Cloud, Zap, Shield, Target, TrendingUp, Database, Globe, Lock, Cpu } from "lucide-react"
import { CourseLayout } from "../../../components/masterclass/CourseLayout"
import { Card, CardContent, CardHeader } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"

export default function ScenariosComplexesSolutionsSurMesure() {
  const courseInfo = {
    title: "Niveau 3 : Scénarios Complexes et Solutions sur Mesure",
    duration: "6-8 semaines",
    level: "Avancé",
    category: "Data Engineering",
    tags: ["Big Data", "Multi-Cloud", "Streaming", "Machine Learning", "Sécurité"],
    featured: true
  }

  const learningObjectives = [
    {
      icon: Cloud,
      title: "Architectures Multi-Cloud",
      description: "Gérer des systèmes distribués sur plusieurs clouds"
    },
    {
      icon: Zap,
      title: "Streaming en Temps Réel",
      description: "Traitement de données en continu à grande échelle"
    },
    {
      icon: Shield,
      title: "Sécurité Avancée",
      description: "Protection des données sensibles et conformité"
    },
    {
      icon: Target,
      title: "Optimisation Performance",
      description: "Maximiser l'efficacité des systèmes complexes"
    },
    {
      icon: TrendingUp,
      title: "Scalabilité",
      description: "Gérer la croissance des volumes de données"
    },
    {
      icon: Database,
      title: "Big Data",
      description: "Traiter des datasets de plusieurs téraoctets"
    }
  ]

  const multiCloudScenarios = [
    {
      name: "Hybrid Cloud",
      icon: "☁️",
      description: "Combiner cloud public et infrastructure privée",
      challenges: ["Latence réseau", "Synchronisation", "Gouvernance"]
    },
    {
      name: "Multi-Cloud",
      icon: "🌐",
      description: "Utiliser plusieurs fournisseurs cloud",
      challenges: ["Vendor lock-in", "Complexité", "Coûts"]
    },
    {
      name: "Edge Computing",
      icon: "📡",
      description: "Traitement proche des sources de données",
      challenges: ["Latence", "Bande passante", "Sécurité"]
    }
  ]

  const streamingArchitectures = [
    {
      name: "Kafka Streams",
      icon: "🔄",
      description: "Traitement de streams avec Apache Kafka",
      features: ["Fault tolerance", "Scalabilité", "Exactly-once semantics"]
    },
    {
      name: "Apache Flink",
      icon: "⚡",
      description: "Moteur de streaming distribué",
      features: ["Low latency", "High throughput", "Event time processing"]
    },
    {
      name: "Spark Streaming",
      icon: "🔥",
      description: "Streaming basé sur micro-batches",
      features: ["Unified API", "Machine Learning", "SQL support"]
    }
  ]

  const securityMeasures = [
    {
      measure: "Chiffrement des Données",
      description: "Protection des données au repos et en transit",
      implementation: ["AES-256", "TLS 1.3", "End-to-end encryption"]
    },
    {
      measure: "Contrôle d'Accès",
      description: "Gestion des permissions et authentification",
      implementation: ["RBAC", "OAuth 2.0", "Multi-factor auth"]
    },
    {
      measure: "Audit et Monitoring",
      description: "Surveillance continue des accès et activités",
      implementation: ["Log aggregation", "Real-time alerts", "Compliance reporting"]
    }
  ]

  return (
    <CourseLayout courseInfo={courseInfo} currentSlug="scenarios-complexes-solutions-sur-mesure">
      {/* Learning Objectives */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-foreground">🎯 Objectifs d'Apprentissage</h2>
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

      {/* Multi-Cloud Scenarios */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-foreground">☁️ Scénarios Multi-Cloud</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {multiCloudScenarios.map((scenario, index) => (
            <Card key={index} className="border-2 border-border shadow-md">
              <CardContent className="p-6">
                <div className="text-3xl mb-3">{scenario.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">{scenario.name}</h3>
                <p className="text-sm text-foreground mb-4">{scenario.description}</p>
                <div className="space-y-1">
                  {scenario.challenges.map((challenge, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      {challenge}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Streaming Architectures */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-foreground">🔄 Architectures de Streaming</h2>
        <Card className="border-2 border-border shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-6">
              {streamingArchitectures.map((architecture, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-muted rounded-lg flex items-center justify-center border border-border">
                    <span className="text-2xl">{architecture.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold mb-2 text-foreground">{architecture.name}</h4>
                    <p className="text-sm text-foreground mb-3">{architecture.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {architecture.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-muted border border-border text-foreground">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Security Measures */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-foreground">🛡️ Mesures de Sécurité</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {securityMeasures.map((security, index) => (
            <Card key={index} className="border-2 border-border shadow-md">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2 text-foreground">{security.measure}</h4>
                <p className="text-sm text-foreground mb-3">{security.description}</p>
                <div className="space-y-1">
                  {security.implementation.map((impl, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-foreground">
                      <div className="w-1 h-1 bg-primary rounded-full"></div>
                      {impl}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Big Data Challenges */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-foreground">📊 Défis du Big Data</h2>
        <Card className="border-2 border-border shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold mb-3 text-foreground">Volume et Performance</h4>
                <ul className="space-y-2 text-sm text-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Partitionnement intelligent des données
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Indexation et compression avancées
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Cache distribué et optimisation des requêtes
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-3 text-foreground">Qualité et Fiabilité</h4>
                <ul className="space-y-2 text-sm text-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Validation et nettoyage automatique
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Monitoring et alerting en temps réel
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Récupération automatique après défaillance
                  </li>
                </ul>
              </div>
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
              Félicitations ! Vous avez terminé le Niveau 3. Vous êtes maintenant prêt à passer au niveau suivant.
            </p>
            <Link href="/MasterClass/pipelines-transactionnels-temps-reel">
              <Button className="gap-2 shadow-md">
                Niveau 4 : Pipelines Transactionnels et Temps Réel
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </CourseLayout>
  )
}
