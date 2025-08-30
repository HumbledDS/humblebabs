"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Target, Code, Database, FileText, Users, BookOpen, Zap, Shield, TrendingUp } from "lucide-react"
import { CourseLayout } from "../../../components/masterclass/CourseLayout"
import { Card, CardContent, CardHeader } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import { CodeBlock } from "../../../components/masterclass/CodeBlock"

export default function EntretiensTestsTechniques() {
  const courseInfo = {
    title: "Niveau 5 : Entretiens et Tests Techniques",
    duration: "3-4 semaines",
    level: "Tous niveaux",
    category: "Career",
    tags: ["Entretiens", "SQL", "Python", "Pipeline Design", "Tests Techniques"],
    featured: true
  }

  const learningObjectives = [
    {
      icon: Target,
      title: "Préparation Entretiens",
      description: "Maîtriser les questions techniques courantes"
    },
    {
      icon: Code,
      title: "Tests Pratiques",
      description: "Résoudre des problèmes en temps limité"
    },
    {
      icon: Database,
      title: "SQL Avancé",
      description: "Requêtes complexes et optimisations"
    },
    {
      icon: FileText,
      title: "Pipeline Design",
      description: "Concevoir des architectures robustes"
    },
    {
      icon: Users,
      title: "Communication",
      description: "Expliquer ses choix et solutions"
    },
    {
      icon: BookOpen,
      title: "Best Practices",
      description: "Standards de l'industrie"
    }
  ]

  const interviewTopics = [
    {
      category: "SQL",
      icon: "🗄️",
      description: "Requêtes complexes et optimisations",
      examples: ["Window functions", "CTEs", "Performance tuning"]
    },
    {
      category: "Python",
      icon: "🐍",
      description: "Code propre et efficace",
      examples: ["Data structures", "Algorithms", "Testing"]
    },
    {
      category: "System Design",
      icon: "🏗️",
      description: "Architectures scalables",
      examples: ["Microservices", "Data pipelines", "Caching"]
    },
    {
      category: "Data Engineering",
      icon: "⚡",
      description: "Concepts et outils",
      examples: ["ETL/ELT", "Streaming", "Data quality"]
    }
  ]

  const commonQuestions = [
    {
      question: "Comment optimiser une requête SQL lente ?",
      approach: "Analyser le plan d'exécution, créer des index appropriés, restructurer la requête",
      keywords: ["EXPLAIN", "Index", "JOIN optimization"]
    },
    {
      question: "Comment gérer la cohérence des données dans un système distribué ?",
      approach: "Utiliser des patterns comme SAGA, Event Sourcing, ou des modèles de cohérence appropriés",
      keywords: ["SAGA", "Event Sourcing", "Consistency models"]
    },
    {
      question: "Comment concevoir un pipeline de données pour traiter 1TB par jour ?",
      approach: "Partitionnement, parallélisme, monitoring, et gestion des erreurs",
      keywords: ["Partitioning", "Parallel processing", "Monitoring"]
    }
  ]

  const sqlExampleCode = `-- Exercice : Analyse des Ventes E-commerce
-- Calcul des métriques de vente par mois pour 2024

SELECT 
    DATE_FORMAT(o.order_date, '%Y-%m') as month,
    COUNT(DISTINCT o.order_id) as total_orders,
    SUM(o.quantity * o.unit_price) as total_revenue,
    ROUND(SUM(o.quantity * o.unit_price) / COUNT(DISTINCT o.order_id), 2) as avg_order_value,
    COUNT(DISTINCT o.user_id) as unique_customers,
    -- Window function pour calculer la croissance mensuelle
    LAG(SUM(o.quantity * o.unit_price)) OVER (ORDER BY DATE_FORMAT(o.order_date, '%Y-%m')) as prev_month_revenue,
    ROUND(
        (SUM(o.quantity * o.unit_price) - LAG(SUM(o.quantity * o.unit_price)) OVER (ORDER BY DATE_FORMAT(o.order_date, '%Y-%m'))) 
        / LAG(SUM(o.quantity * o.unit_price)) OVER (ORDER BY DATE_FORMAT(o.order_date, '%Y-%m')) * 100, 2
    ) as revenue_growth_pct
FROM orders o
WHERE o.order_date >= '2024-01-01' 
    AND o.order_date < '2025-01-01'
    AND o.status = 'completed'
GROUP BY DATE_FORMAT(o.order_date, '%Y-%m')
ORDER BY month;`

  const pythonETLCode = `import pandas as pd
from sqlalchemy import create_engine
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional

class DataPipelineOrchestrator:
    """
    Pipeline ETL robuste pour traitement de données e-commerce
    Utilisé dans les entretiens pour tester la conception de systèmes
    """
    
    def __init__(self, source_config: Dict, target_config: Dict):
        self.source_engine = create_engine(source_config['connection_string'])
        self.target_engine = create_engine(target_config['connection_string'])
        self.logger = self._setup_logger()
        
    def _setup_logger(self) -> logging.Logger:
        logger = logging.getLogger(__name__)
        logger.setLevel(logging.INFO)
        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        return logger
    
    def extract_daily_orders(self, date: str) -> pd.DataFrame:
        """Extract des commandes pour une date donnée"""
        query = '''
        SELECT 
            o.order_id,
            o.user_id,
            o.product_id,
            o.quantity,
            o.unit_price,
            o.order_date,
            o.region,
            p.category,
            p.brand,
            u.user_type
        FROM orders o
        JOIN products p ON o.product_id = p.product_id
        JOIN users u ON o.user_id = u.user_id
        WHERE DATE(o.order_date) = %s
            AND o.status = 'completed'
        '''
        
        try:
            df = pd.read_sql_query(query, self.source_engine, params=[date])
            self.logger.info(f"Extracted {len(df)} orders for {date}")
            return df
        except Exception as e:
            self.logger.error(f"Failed to extract data for {date}: {e}")
            raise`

  return (
    <CourseLayout courseInfo={courseInfo} currentSlug="entretiens-tests-techniques">
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

      {/* Interview Topics */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-foreground">📚 Sujets d'Entretien</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {interviewTopics.map((topic, index) => (
            <Card key={index} className="border-2 border-border shadow-md">
              <CardContent className="p-6">
                <div className="text-3xl mb-3">{topic.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">{topic.category}</h3>
                <p className="text-sm text-foreground mb-4">{topic.description}</p>
                <div className="space-y-1">
                  {topic.examples.map((example, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      {example}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Common Questions */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-foreground">❓ Questions Fréquentes</h2>
        <Card className="border-2 border-border shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-6">
              {commonQuestions.map((item, index) => (
                <div key={index} className="border-b border-border pb-4 last:border-b-0">
                  <h4 className="text-lg font-semibold mb-2 text-foreground">{item.question}</h4>
                  <p className="text-sm text-foreground mb-3">{item.approach}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.keywords.map((keyword, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs bg-muted border border-border text-foreground">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* SQL Examples */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-foreground">🗄️ Exemples SQL</h2>
        <Card className="border-2 border-border shadow-lg">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold mb-4 text-foreground">Analyse des Ventes E-commerce</h4>
            <CodeBlock
              code={sqlExampleCode}
              language="sql"
              title="Requête SQL Complexe avec Window Functions"
            />
          </CardContent>
        </Card>
      </section>

      {/* Python Examples */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-foreground">🐍 Exemples Python</h2>
        <Card className="border-2 border-border shadow-lg">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold mb-4 text-foreground">Pipeline ETL Robuste</h4>
            <CodeBlock
              code={pythonETLCode}
              language="python"
              title="Pipeline ETL avec Gestion d'Erreurs"
            />
          </CardContent>
        </Card>
      </section>

      {/* Interview Tips */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-foreground">💡 Conseils pour l'Entretien</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-2 border-border shadow-md">
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold mb-3 text-foreground">Avant l'Entretien</h4>
              <ul className="space-y-2 text-sm text-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Réviser les concepts fondamentaux
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Pratiquer le code sur papier
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Préparer des questions pour l'entreprise
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card className="border-2 border-border shadow-md">
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold mb-3 text-foreground">Pendant l'Entretien</h4>
              <ul className="space-y-2 text-sm text-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Clarifier les exigences
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Expliquer votre raisonnement
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Demander des clarifications
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Next Steps */}
      <section className="mb-12">
        <Card className="border-2 border-border bg-muted/50 shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-foreground">📚 Prochaines Étapes</h3>
            <p className="text-foreground mb-6">
              Félicitations ! Vous avez terminé le Niveau 5. Vous êtes maintenant prêt à passer au niveau suivant.
            </p>
            <Link href="/MasterClass/carriere-developpement-professionnel">
              <Button className="gap-2 shadow-md">
                Niveau 6 : Carrière et Développement Professionnel
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </CourseLayout>
  )
}
