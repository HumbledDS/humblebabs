"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Clock, Zap, Scale, Shield, DollarSign, CheckCircle, XCircle, AlertTriangle, ArrowRight, ExternalLink } from "lucide-react"
import { BackNavigation } from "@/components/system-design/back-navigation"
import { ArchitectureNavigation } from "./architecture-navigation"

interface ArchitectureDetailPageProps {
  architecture: any // Generic type for all architectures
  allArchitectures: any[]
  backHref: string
  backLabel: string
  sectionTitle: string
}

const complexityColors = {
  Low: "text-green-600 bg-green-100 dark:bg-green-900/20",
  Medium: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20",
  High: "text-red-600 bg-red-100 dark:bg-red-900/20"
}

const impactColors = {
  Positive: "text-green-600",
  Negative: "text-red-600",
  Neutral: "text-gray-600"
}

export function ArchitectureDetailPage({ 
  architecture, 
  allArchitectures, 
  backHref, 
  backLabel, 
  sectionTitle 
}: ArchitectureDetailPageProps) {
  return (
    <div className="flex flex-col">
      {/* Header with back navigation */}
      <section className="px-4 py-8 border-b border-border/50">
        <div className="max-w-7xl mx-auto">
          <BackNavigation href={backHref} label={backLabel} />
          
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {architecture.name}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
              {architecture.description}
            </p>
            
            {/* Complexity Badge */}
            <span className={`px-4 py-2 text-sm font-medium rounded-full ${complexityColors[architecture.complexity]}`}>
              {architecture.complexity} Complexity
            </span>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Technologies */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold mb-6">Technologies & Tools</h2>
                <div className="flex flex-wrap gap-3">
                  {architecture.technologies.map((tech: string) => (
                    <span 
                      key={tech}
                      className="px-4 py-2 bg-muted/50 text-muted-foreground rounded-xl font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Flow Steps */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold mb-6">Architecture Flow</h2>
                <div className="space-y-4">
                  {architecture.flowSteps
                    .sort((a: any, b: any) => a.order - b.order)
                    .map((step: any) => (
                    <div key={step.id} className="p-4 border border-border/50 rounded-xl bg-card">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                          {step.order}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">{step.name}</h3>
                          <p className="text-muted-foreground mb-3">{step.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {step.technologies.map((tech: string) => (
                              <span 
                                key={tech}
                                className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-md"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Use Cases */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <h2 className="text-2xl font-bold mb-6">Use Cases</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {architecture.useCases.map((useCase: string) => (
                    <div key={useCase} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{useCase}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Pros and Cons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {/* Pros */}
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-green-600">Pros</h2>
                  <div className="space-y-3">
                    {architecture.pros.map((pro: string) => (
                      <div key={pro} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{pro}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cons */}
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-red-600">Cons</h2>
                  <div className="space-y-3">
                    {architecture.cons.map((con: string) => (
                      <div key={con} className="flex items-center gap-3">
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <span className="text-sm">{con}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* When to Use */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                <h2 className="text-2xl font-bold mb-6">When to Use</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {architecture.whenToUse.map((scenario: string) => (
                    <div key={scenario} className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      <span className="text-sm">{scenario}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Alternatives */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <h2 className="text-2xl font-bold mb-6">Alternatives</h2>
                <div className="flex flex-wrap gap-3">
                  {architecture.alternatives.map((alternative: string) => (
                    <span 
                      key={alternative}
                      className="px-4 py-2 bg-muted/50 text-muted-foreground rounded-xl font-medium"
                    >
                      {alternative}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              {/* Performance Metrics */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="p-6 border border-border/50 rounded-xl bg-card"
              >
                <h3 className="text-xl font-bold mb-4">Performance Metrics</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="text-sm text-muted-foreground">Latency</div>
                      <div className="font-medium">{architecture.performance.latency}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <div>
                      <div className="text-sm text-muted-foreground">Throughput</div>
                      <div className="font-medium">{architecture.performance.throughput}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Scale className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="text-sm text-muted-foreground">Scalability</div>
                      <div className="font-medium">{architecture.performance.scalability}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-purple-500" />
                    <div>
                      <div className="text-sm text-muted-foreground">Reliability</div>
                      <div className="font-medium">{architecture.performance.reliability}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-orange-500" />
                    <div>
                      <div className="text-sm text-muted-foreground">Cost</div>
                      <div className="font-medium">{architecture.performance.cost}</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Trade-offs */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="p-6 border border-border/50 rounded-xl bg-card"
              >
                <h3 className="text-xl font-bold mb-4">Key Trade-offs</h3>
                <div className="space-y-3">
                  {architecture.tradeOffs.map((tradeOff: any) => (
                    <div key={tradeOff.aspect} className="p-3 border border-border/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`w-2 h-2 rounded-full ${
                          tradeOff.impact === 'Positive' ? 'bg-green-500' : 
                          tradeOff.impact === 'Negative' ? 'bg-red-500' : 'bg-gray-500'
                        }`} />
                        <span className="text-sm font-medium">{tradeOff.aspect}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{tradeOff.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Category Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="p-6 border border-border/50 rounded-xl bg-card"
              >
                <h3 className="text-xl font-bold mb-4">Category Information</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Category</div>
                    <div className="font-medium">{architecture.category}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Complexity Level</div>
                    <div className="font-medium">{architecture.complexity}</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation between architectures */}
      <ArchitectureNavigation 
        currentArchitecture={architecture}
        allArchitectures={allArchitectures}
        sectionHref={backHref}
        sectionTitle={sectionTitle}
      />
    </div>
  )
}
