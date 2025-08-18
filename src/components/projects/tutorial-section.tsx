"use client"
import { motion } from "framer-motion"
import { CheckCircle, AlertCircle, Info, Code, BookOpen, Target, Zap } from "lucide-react"
import React from "react"

interface TutorialStep {
  id: number
  title: string
  description: string
  code?: string
  language?: string
  tips?: string[]
  warnings?: string[]
}

interface TutorialSectionProps {
  title: string
  description: string
  steps?: TutorialStep[]
  type?: "implementation" | "concept" | "best-practice" | "optimization"
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>> | React.ReactNode
  content?: string
  codeBlock?: {
    language: string
    code: string
  }
}

const typeConfig = {
  implementation: { color: "text-blue-600", bgColor: "bg-blue-50", icon: Code },
  concept: { color: "text-green-600", bgColor: "bg-green-50", icon: BookOpen },
  "best-practice": { color: "text-purple-600", bgColor: "bg-purple-50", icon: Target },
  optimization: { color: "text-orange-600", bgColor: "bg-orange-50", icon: Zap }
}

export function TutorialSection({ title, description, steps, type = "implementation", icon, content, codeBlock }: TutorialSectionProps) {
  const config = typeConfig[type]
  const IconComponent = icon || config.icon

  // Helper function to render the icon
  const renderIcon = () => {
    if (typeof IconComponent === 'function') {
      const Icon = IconComponent
      return <Icon className={`w-6 h-6 ${config.color}`} />
    }
    if (React.isValidElement(IconComponent)) {
      return IconComponent
    }
    return <config.icon className={`w-6 h-6 ${config.color}`} />
  }

  return (
    <motion.div
      className="mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg ${config.bgColor}`}>
          {renderIcon()}
        </div>
        <h3 className="text-2xl font-bold text-foreground">{title}</h3>
      </div>
      
      <p className="text-muted-foreground text-lg mb-8 leading-relaxed">{description}</p>
      
      {/* Content Display Mode */}
      {content && (
        <div className="space-y-6">
          <div className="border border-border/50 rounded-xl p-6 bg-card/50">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
            </div>
          </div>
          
          {codeBlock && (
            <div className="border border-border/50 rounded-xl p-6 bg-card/50">
              <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
                <pre className="text-sm overflow-x-auto">
                  <code className={`language-${codeBlock.language}`}>{codeBlock.code}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Steps Display Mode */}
      {steps && steps.length > 0 && (
        <div className="space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className="border border-border/50 rounded-xl p-6 bg-card/50"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                  {step.id}
                </div>
                
                <div className="flex-1 space-y-4">
                  <h4 className="text-lg font-semibold text-foreground">{step.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  
                  {step.code && (
                    <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
                      <pre className="text-sm overflow-x-auto">
                        <code className={`language-${step.language || 'bash'}`}>{step.code}</code>
                      </pre>
                    </div>
                  )}
                  
                  {step.tips && step.tips.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="font-medium text-blue-900 mb-2">Pro Tips</h5>
                          <ul className="space-y-1">
                            {step.tips.map((tip, tipIndex) => (
                              <li key={tipIndex} className="text-blue-800 text-sm flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {step.warnings && step.warnings.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="font-medium text-amber-900 mb-2">Important Warnings</h5>
                          <ul className="space-y-1">
                            {step.warnings.map((warning, warningIndex) => (
                              <li key={warningIndex} className="text-amber-800 text-sm flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                {warning}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
