"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Clock, Zap, Scale, Shield, DollarSign, CheckCircle, XCircle, AlertTriangle, ArrowRight, ExternalLink } from "lucide-react"
import { PipelineArchitecture } from "@/types"
import { BackNavigation } from "@/components/system-design/back-navigation"
import { PipelineNavigation } from "./pipeline-navigation"
import { pipelineArchitectures } from "@/lib/system-design-data"

interface PipelineDetailPageProps {
  architecture: PipelineArchitecture
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

export function PipelineDetailPage({ architecture }: PipelineDetailPageProps) {
  return (
    <div className="flex flex-col">
      {/* Header with back navigation */}
      <section className="px-4 py-8 border-b border-border/50">
        <div className="max-w-7xl mx-auto">
          <BackNavigation href="/system-design/data-pipelines" label="Back to Data Pipeline Architectures" />

          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">
                {architecture.name}
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-6">
              {architecture.description}
            </p>
            
            {/* Complexity Badge */}
            <span className={`inline-block px-4 py-2 text-sm font-medium rounded-full ${complexityColors[architecture.complexity]}`}>
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
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-2xl font-bold mb-6">Technologies & Stack</h2>
                <div className="flex flex-wrap gap-3">
                  {architecture.technologies.map((tech) => (
                    <span 
                      key={tech}
                      className="px-4 py-2 text-sm font-medium bg-muted/50 text-muted-foreground rounded-lg border border-border/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Flow Steps */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold mb-6">Pipeline Flow</h2>
                <div className="space-y-4">
                  {architecture.flowSteps.map((step, index) => (
                    <div key={step.id} className="flex gap-4 p-4 rounded-xl border border-border/50 bg-card">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                        {step.order}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-2">{step.name}</h3>
                        <p className="text-muted-foreground mb-3">{step.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {step.technologies.map((tech) => (
                            <span 
                              key={tech}
                              className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-md"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Use Cases */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold mb-6">Use Cases</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {architecture.useCases.map((useCase) => (
                    <div key={useCase} className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-card">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-foreground">{useCase}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Pros and Cons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {/* Pros */}
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-green-600">Advantages</h2>
                  <div className="space-y-3">
                    {architecture.pros.map((pro) => (
                      <div key={pro} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{pro}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cons */}
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-red-600">Challenges</h2>
                  <div className="space-y-3">
                    {architecture.cons.map((con) => (
                      <div key={con} className="flex items-start gap-3">
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{con}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* When to Use */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <h2 className="text-2xl font-bold mb-6">When to Use This Architecture</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {architecture.whenToUse.map((scenario) => (
                    <div key={scenario} className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-card">
                      <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                      <span className="text-foreground">{scenario}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Alternatives */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                <h2 className="text-2xl font-bold mb-6">Alternative Solutions</h2>
                <div className="flex flex-wrap gap-3">
                  {architecture.alternatives.map((alternative) => (
                    <span 
                      key={alternative}
                      className="px-4 py-2 text-sm font-medium bg-muted/50 text-muted-foreground rounded-lg border border-border/30"
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
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="p-6 rounded-2xl border border-border/50 bg-card"
              >
                <h3 className="text-xl font-bold mb-6">Performance Metrics</h3>
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
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="p-6 rounded-2xl border border-border/50 bg-card"
              >
                <h3 className="text-xl font-bold mb-6">Key Trade-offs</h3>
                <div className="space-y-4">
                  {architecture.tradeOffs.map((tradeOff) => (
                    <div key={tradeOff.aspect} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${
                          tradeOff.impact === 'Positive' ? 'bg-green-500' : 
                          tradeOff.impact === 'Negative' ? 'bg-red-500' : 'bg-gray-500'
                        }`} />
                        <span className="font-medium text-sm">{tradeOff.aspect}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{tradeOff.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Category Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="p-6 rounded-2xl border border-border/50 bg-card"
              >
                <h3 className="text-xl font-bold mb-4">Architecture Category</h3>
                <div className="inline-block px-4 py-2 text-sm font-medium bg-primary/10 text-primary rounded-lg">
                  {architecture.category}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation between architectures */}
      <PipelineNavigation 
        currentArchitecture={architecture}
        allArchitectures={pipelineArchitectures}
      />
    </div>
  )
}
