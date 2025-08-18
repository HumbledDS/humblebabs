"use client"

import { motion } from "framer-motion"
import { Database, Code2, Cloud, Brain, TrendingUp, Users } from "lucide-react"

interface SystemDesignStatsProps {
  totalArchitectures: number
  totalCategories: number
  totalTechnologies: number
}

export function SystemDesignStats({ 
  totalArchitectures, 
  totalCategories, 
  totalTechnologies 
}: SystemDesignStatsProps) {
  const stats = [
    {
      icon: Database,
      label: "Pipeline Architectures",
      value: totalArchitectures,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: Code2,
      label: "System Categories",
      value: totalCategories,
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      icon: Cloud,
      label: "Technologies Covered",
      value: totalTechnologies,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    }
  ]

  return (
    <section className="py-16 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-4">
            System Design Expertise
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive coverage of modern system design patterns and architectures
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`w-10 h-10 ${stat.color}`} />
              </div>
              
              <div className="mb-4">
                <div className="text-4xl font-bold text-foreground mb-2">
                  {stat.value}+
                </div>
                <div className="text-lg text-muted-foreground">
                  {stat.label}
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span>Growing collection</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary rounded-xl border border-primary/20">
            <Users className="w-5 h-5" />
            <span className="font-medium">Expert-level insights for senior developers</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
