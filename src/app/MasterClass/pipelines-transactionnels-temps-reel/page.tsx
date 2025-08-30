"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Zap, Clock, Shield, Target, TrendingUp, Database, Cpu, Activity, Gauge } from "lucide-react"
import { CourseLayout } from "../../../components/masterclass/CourseLayout"
import { Card, CardContent, CardHeader } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import { CodeBlock } from "../../../components/masterclass/CodeBlock"
import { MermaidDiagram } from "../../../components/masterclass/MermaidDiagram"

export default function PipelinesTransactionnelsTempsReel() {
  const courseInfo = {
    title: "Niveau 4 : Pipelines Transactionnels et Temps Réel",
    duration: "6-8 semaines",
    level: "Expert",
    category: "Data Engineering",
    tags: ["Transactions", "Temps Réel", "Cohérence", "Haute Disponibilité", "Performance"],
    featured: true
  }

  const learningObjectives = [
    {
      icon: Zap,
      title: "Pipelines Transactionnels",
      description: "Gérer la cohérence des données distribuées"
    },
    {
      icon: Clock,
      title: "Temps Réel",
      description: "Traitement de streams en continu"
    },
    {
      icon: Shield,
      title: "Cohérence des Données",
      description: "Maintenir l'intégrité des systèmes"
    },
    {
      icon: Target,
      title: "Haute Disponibilité",
      description: "Systèmes résilients et robustes"
    },
    {
      icon: TrendingUp,
      title: "Performance",
      description: "Optimiser la latence et le throughput"
    },
    {
      icon: Database,
      title: "Architectures Distribuées",
      description: "Gérer la complexité des systèmes"
    }
  ]

  const transactionPatterns = [
    {
      name: "SAGA Pattern",
      icon: "🔄",
      description: "Gestion des transactions distribuées avec compensation",
      benefits: ["Cohérence éventuelle", "Résilience", "Scalabilité"]
    },
    {
      name: "Event Sourcing",
      icon: "📝",
      description: "Stockage des événements plutôt que des états",
      benefits: ["Audit trail", "Reproductibilité", "Flexibilité"]
    },
    {
      name: "CQRS",
      icon: "📊",
      description: "Séparation des commandes et des requêtes",
      benefits: ["Performance", "Scalabilité", "Flexibilité"]
    }
  ]

  const realTimeTechnologies = [
    {
      name: "Apache Kafka",
      icon: "📨",
      description: "Plateforme de streaming distribuée",
      features: ["High throughput", "Fault tolerance", "Scalability"]
    },
    {
      name: "Apache Flink",
      icon: "⚡",
      description: "Moteur de streaming stateful",
      features: ["Low latency", "Exactly-once", "Event time"]
    },
    {
      name: "Kafka Streams",
      icon: "🔄",
      description: "Bibliothèque de streaming pour Kafka",
      features: ["Simple API", "Lightweight", "Kafka-native"]
    }
  ]

  const consistencyModels = [
    {
      model: "Strong Consistency",
      description: "Toutes les lectures voient la dernière écriture",
      tradeoffs: ["Latence élevée", "Disponibilité limitée", "Cohérence garantie"]
    },
    {
      model: "Eventual Consistency",
      description: "Cohérence atteinte après un délai",
      tradeoffs: ["Latence faible", "Disponibilité élevée", "Cohérence temporaire"]
    },
    {
      model: "Causal Consistency",
      description: "Cohérence causale entre événements",
      tradeoffs: ["Équilibre", "Complexité", "Performance"]
    }
  ]

  return (
    <CourseLayout courseInfo={courseInfo} currentSlug="pipelines-transactionnels-temps-reel">
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

      {/* Transaction Patterns */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-foreground">🔄 Patterns Transactionnels</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {transactionPatterns.map((pattern, index) => (
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

      {/* Real-Time Technologies */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-foreground">⚡ Technologies Temps Réel</h2>
        <Card className="border-2 border-border shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-6">
              {realTimeTechnologies.map((tech, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-muted rounded-lg flex items-center justify-center border border-border">
                    <span className="text-2xl">{tech.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold mb-2 text-foreground">{tech.name}</h4>
                    <p className="text-sm text-foreground mb-3">{tech.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {tech.features.map((feature, idx) => (
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

      {/* Consistency Models */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-foreground">🔒 Modèles de Cohérence</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {consistencyModels.map((consistency, index) => (
            <Card key={index} className="border-2 border-border shadow-md">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2 text-foreground">{consistency.model}</h4>
                <p className="text-sm text-foreground mb-3">{consistency.description}</p>
                <div className="space-y-1">
                  {consistency.tradeoffs.map((tradeoff, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-foreground">
                      <div className="w-1 h-1 bg-primary rounded-full"></div>
                      {tradeoff}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Code Examples */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-foreground">💻 Exemples de Code</h2>
        <Card className="border-2 border-border shadow-lg">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold mb-4 text-foreground">Pattern SAGA en Python</h4>
            <CodeBlock
              code={`from abc import ABC, abstractmethod
from typing import List, Dict, Any
import logging

class SagaStep(ABC):
    def __init__(self, name: str):
        self.name = name
        self.compensation = None
    
    @abstractmethod
    def execute(self, context: Dict[str, Any]) -> bool:
        pass
    
    @abstractmethod
    def compensate(self, context: Dict[str, Any]) -> bool:
        pass

class InventoryReservationStep(SagaStep):
    def __init__(self):
        super().__init__("Inventory Reservation")
    
    def execute(self, context: Dict[str, Any]) -> bool:
        try:
            inventory_id = context.get('inventory_id')
            quantity = context.get('quantity')
            
            if self._reserve_inventory(inventory_id, quantity):
                context['inventory_reserved'] = True
                return True
            return False
        except Exception as e:
            logging.error(f"Failed to reserve inventory: {e}")
            return False
    
    def compensate(self, context: Dict[str, Any]) -> bool:
        try:
            inventory_id = context.get('inventory_id')
            quantity = context.get('quantity')
            
            if context.get('inventory_reserved'):
                self._release_inventory(inventory_id, quantity)
                context['inventory_reserved'] = False
            return True
        except Exception as e:
            logging.error(f"Failed to compensate inventory: {e}")
            return False`}
              language="python"
              title="SAGA Pattern Implementation"
            />
          </CardContent>
        </Card>
      </section>

      {/* Architecture Diagram */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-foreground">🏗️ Architecture de Pipeline</h2>
        <Card className="border-2 border-border shadow-lg">
          <CardContent className="p-6">
            <MermaidDiagram
              chart={`graph TD
    A[Data Source] --> B[Kafka]
    B --> C[Flink Stream Processing]
    C --> D[State Store]
    C --> E[Fraud Detection]
    C --> F[Aggregations]
    E --> G[Alert System]
    F --> H[Data Warehouse]
    D --> I[Recovery]
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0
    style E fill:#ffebee
    style F fill:#f1f8e9
    style G fill:#fce4ec
    style H fill:#e0f2f1
    style I fill:#fafafa`}
              title="Real-Time Pipeline Architecture"
            />
          </CardContent>
        </Card>
      </section>

      {/* Performance Metrics */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-foreground">📊 Métriques de Performance</h2>
        <Card className="border-2 border-border shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold mb-3 text-foreground">Latence</h4>
                <ul className="space-y-2 text-sm text-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    End-to-end: &lt; 100ms
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Processing: &lt; 10ms
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Network: &lt; 1ms
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-3 text-foreground">Throughput</h4>
                <ul className="space-y-2 text-sm text-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Events/sec: 100K+
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Concurrent users: 10K+
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Data volume: 1TB+/day
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
              Félicitations ! Vous avez terminé le Niveau 4. Vous êtes maintenant prêt à passer au niveau suivant.
            </p>
            <Link href="/MasterClass/entretiens-tests-techniques">
              <Button className="gap-2 shadow-md">
                Niveau 5 : Entretiens et Tests Techniques
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </CourseLayout>
  )
}
