"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Database, Layers, Zap, Shield, Target, TrendingUp, BookOpen, Code, BarChart3 } from "lucide-react"
import { CourseLayout } from "../../../components/masterclass/CourseLayout"
import { Card, CardContent, CardHeader } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"

export default function ModelisationArchitectureAvancee() {
  const courseInfo = {
    title: "Niveau 2 : Modélisation et Architecture Avancée des Données",
    duration: "4-6 semaines",
    level: "Intermédiaire",
    category: "Data Modeling",
    tags: ["Modélisation Avancée", "Architecture", "Patterns", "Performance", "Gouvernance"],
    featured: true
  }

  const learningObjectives = [
    {
      icon: Database,
      title: "Maîtriser la modélisation avancée",
      description: "Concepts complexes et patterns éprouvés"
    },
    {
      icon: Layers,
      title: "Concevoir des architectures robustes",
      description: "Systèmes évolutifs et maintenables"
    },
    {
      icon: Zap,
      title: "Optimiser les performances",
      description: "Requêtes rapides et efficaces"
    },
    {
      icon: Shield,
      title: "Implémenter la gouvernance",
      description: "Qualité, sécurité et conformité"
    },
    {
      icon: Target,
      title: "Résoudre des scénarios complexes",
      description: "Cas d'usage du monde réel"
    },
    {
      icon: TrendingUp,
      title: "Architectures modernes",
      description: "Cloud-native et microservices"
    }
  ]

  const modelingPatterns = [
    {
      name: "Modèle en Étoile Étendu",
      icon: "⭐",
      description: "Gestion des relations complexes et hiérarchies multiples",
      benefits: ["Simplicité de requête", "Flexibilité", "Performance optimisée"]
    },
    {
      name: "Modèle en Flocon",
      icon: "❄️",
      description: "Normalisation partielle pour réduire la redondance",
      benefits: ["Moins de redondance", "Intégrité des données", "Maintenance facilitée"]
    },
    {
      name: "Modèle Constellation",
      icon: "🌌",
      description: "Multiple fact tables partageant des dimensions communes",
      benefits: ["Réutilisation des dimensions", "Flexibilité maximale", "Évolutivité"]
    }
  ]

  const architecturePatterns = [
    {
      name: "Data Vault 2.0",
      icon: "🏗️",
      description: "Modélisation hybride pour l'agilité et la performance",
      features: ["Hubs, Links, Satellites", "Historisation complète", "Évolutivité maximale"]
    },
    {
      name: "Anchor Modeling",
      icon: "⚓",
      description: "Approche normalisée pour la flexibilité temporelle",
      features: ["Entités stables", "Attributs évolutifs", "Gestion du temps"]
    },
    {
      name: "One Big Table (OBT)",
      icon: "📊",
      description: "Dénormalisation pour la performance des requêtes",
      features: ["Requêtes rapides", "Simplicité", "Optimisation column-store"]
    }
  ]

  const performanceOptimizations = [
    {
      technique: "Partitionnement",
      description: "Diviser les tables en partitions logiques",
      benefits: ["Requêtes plus rapides", "Maintenance facilitée", "Gestion du cycle de vie"]
    },
    {
      technique: "Indexation avancée",
      description: "Index composites et couvrants",
      benefits: ["Accès optimisé", "Moins d'I/O", "Performance des JOINs"]
    },
    {
      technique: "Compression",
      description: "Réduction de l'espace de stockage",
      benefits: ["Moins de stockage", "Moins d'I/O", "Cache plus efficace"]
    }
  ]

  return (
    <CourseLayout courseInfo={courseInfo} currentSlug="modelisation-architecture-avancee">
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

      {/* Advanced Modeling Patterns */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-foreground">📊 Patterns de Modélisation Avancés</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modelingPatterns.map((pattern, index) => (
            <Card key={index} className="border-2 border-border shadow-md">
              <CardContent className="p-6">
                <div className="text-3xl mb-3">{pattern.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">{pattern.name}</h3>
                <p className="text-sm text-foreground mb-4">{pattern.description}</p>
                <div className="space-y-1">
                  {pattern.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      {benefit}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Architecture Patterns */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-foreground">🏗️ Patterns d'Architecture</h2>
        <Card className="border-2 border-border shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-6">
              {architecturePatterns.map((pattern, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-muted rounded-lg flex items-center justify-center border border-border">
                    <span className="text-2xl">{pattern.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold mb-2 text-foreground">{pattern.name}</h4>
                    <p className="text-sm text-foreground mb-3">{pattern.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {pattern.features.map((feature, idx) => (
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

      {/* Performance Optimization */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-foreground">⚡ Optimisation des Performances</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {performanceOptimizations.map((optimization, index) => (
            <Card key={index} className="border-2 border-border shadow-md">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2 text-foreground">{optimization.technique}</h4>
                <p className="text-sm text-foreground mb-3">{optimization.description}</p>
                <div className="space-y-1">
                  {optimization.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-foreground">
                      <div className="w-1 h-1 bg-primary rounded-full"></div>
                      {benefit}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Data Governance */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-foreground">🛡️ Gouvernance des Données</h2>
        <Card className="border-2 border-border shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold mb-3 text-foreground">Qualité des Données</h4>
                <ul className="space-y-2 text-sm text-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Validation des données
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Nettoyage automatique
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Monitoring continu
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-3 text-foreground">Sécurité et Conformité</h4>
                <ul className="space-y-2 text-sm text-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Chiffrement des données
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Contrôle d'accès
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Audit trail
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
              Félicitations ! Vous avez terminé le Niveau 2. Vous êtes maintenant prêt à passer au niveau suivant.
            </p>
            <Link href="/MasterClass/scenarios-complexes-solutions-sur-mesure">
              <Button className="gap-2 shadow-md">
                Niveau 3 : Scénarios Complexes et Solutions sur Mesure
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </CourseLayout>
  )
}
