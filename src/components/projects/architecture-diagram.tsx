"use client"
import { motion } from "framer-motion"
import { ChevronRight, Database, Server, Globe, Cpu, Zap, Shield, BarChart3 } from "lucide-react"
import { useState } from "react"

interface DecisionNode {
  id: string
  title: string
  description: string
  question: string
  options: DecisionOption[]
  icon?: React.ReactNode
}

interface DecisionOption {
  id: string
  label: string
  description: string
  nextNode?: string
  outcome?: string
  pros: string[]
  cons: string[]
  recommendation?: string
}

interface ArchitectureDiagramProps {
  title: string
  description: string
  type: "decision-tree" | "flow-diagram" | "component-diagram"
  content: DecisionNode[] | string
}

const iconMap = {
  database: Database,
  server: Server,
  globe: Globe,
  cpu: Cpu,
  zap: Zap,
  shield: Shield,
  chart: BarChart3
}

export function ArchitectureDiagram({ title, description, type, content }: ArchitectureDiagramProps) {
  const [selectedPath, setSelectedPath] = useState<string[]>([])
  const [currentNode, setCurrentNode] = useState<string | null>(null)

  if (type === "decision-tree" && Array.isArray(content)) {
    return (
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-foreground mb-3">{title}</h3>
          <p className="text-muted-foreground text-lg">{description}</p>
        </div>

        <div className="bg-card/50 border border-border/50 rounded-xl p-6">
          <DecisionTree
            nodes={content}
            selectedPath={selectedPath}
            setSelectedPath={setSelectedPath}
            currentNode={currentNode}
            setCurrentNode={setCurrentNode}
          />
        </div>
      </motion.div>
    )
  }

  if (type === "flow-diagram") {
    return (
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-foreground mb-3">{title}</h3>
          <p className="text-muted-foreground text-lg">{description}</p>
        </div>

        <div className="bg-card/50 border border-border/50 rounded-xl p-6">
          <FlowDiagram content={content as string} />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-foreground mb-3">{title}</h3>
        <p className="text-muted-foreground text-lg">{description}</p>
      </div>

      <div className="bg-card/50 border border-border/50 rounded-xl p-6">
        <ComponentDiagram content={content as string} />
      </div>
    </motion.div>
  )
}

function DecisionTree({ 
  nodes, 
  selectedPath, 
  setSelectedPath, 
  currentNode, 
  setCurrentNode 
}: {
  nodes: DecisionNode[]
  selectedPath: string[]
  setSelectedPath: (path: string[]) => void
  currentNode: string | null
  setCurrentNode: (node: string | null) => void
}) {
  const startNode = nodes[0]
  const currentDecisionNode = currentNode ? nodes.find(n => n.id === currentNode) : startNode

  const handleOptionSelect = (option: DecisionOption) => {
    const newPath = [...selectedPath, option.id]
    setSelectedPath(newPath)
    
    if (option.nextNode) {
      setCurrentNode(option.nextNode)
    } else {
      setCurrentNode(null)
    }
  }

  const resetPath = () => {
    setSelectedPath([])
    setCurrentNode(null)
  }

  if (!currentDecisionNode) {
    // Show final outcome
    const lastOption = nodes.find(n => n.id === selectedPath[selectedPath.length - 1])
    return (
      <div className="text-center space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h4 className="text-xl font-semibold text-green-900 mb-3">Decision Path Complete</h4>
          <p className="text-green-800 mb-4">
            Based on your selections, here's the recommended approach:
          </p>
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <p className="font-medium text-green-900">{lastOption?.title}</p>
            <p className="text-green-800 text-sm mt-1">{lastOption?.description}</p>
          </div>
        </div>
        
        <button
          onClick={resetPath}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Start Over
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
          {currentDecisionNode.icon || <BarChart3 className="w-5 h-5" />}
          <span className="font-medium">Decision Point</span>
        </div>
        <h4 className="text-xl font-semibold text-foreground mb-2">{currentDecisionNode.title}</h4>
        <p className="text-muted-foreground mb-4">{currentDecisionNode.description}</p>
        <p className="text-lg font-medium text-foreground">{currentDecisionNode.question}</p>
      </div>

      <div className="grid gap-4">
        {currentDecisionNode.options.map((option, index) => (
          <motion.button
            key={option.id}
            onClick={() => handleOptionSelect(option)}
            className="text-left p-4 border border-border/50 rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {option.label}
              </h5>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            
            <p className="text-muted-foreground text-sm mb-3">{option.description}</p>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-green-50 border border-green-200 rounded p-2">
                <h6 className="font-medium text-green-800 mb-1">Pros</h6>
                <ul className="space-y-1">
                  {option.pros.map((pro, i) => (
                    <li key={i} className="text-green-700">• {pro}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded p-2">
                <h6 className="font-medium text-red-800 mb-1">Cons</h6>
                <ul className="space-y-1">
                  {option.cons.map((con, i) => (
                    <li key={i} className="text-red-700">• {con}</li>
                  ))}
                </ul>
              </div>
            </div>

            {option.recommendation && (
              <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
                <p className="text-blue-800 text-xs font-medium">{option.recommendation}</p>
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {selectedPath.length > 0 && (
        <div className="pt-4 border-t border-border/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>Your path:</span>
            {selectedPath.map((step, index) => (
              <span key={index} className="flex items-center">
                <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs">
                  {step}
                </span>
                {index < selectedPath.length - 1 && <ChevronRight className="w-4 h-4 mx-1" />}
              </span>
            ))}
          </div>
          <button
            onClick={resetPath}
            className="text-sm text-primary hover:underline"
          >
            Reset path
          </button>
        </div>
      )}
    </div>
  )
}

function FlowDiagram({ content }: { content: string }) {
  return (
    <div className="text-center py-8">
      <div className="text-muted-foreground">
        <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p>Flow diagram content would be rendered here</p>
        <p className="text-sm mt-2">{content}</p>
      </div>
    </div>
  )
}

function ComponentDiagram({ content }: { content: string }) {
  return (
    <div className="text-center py-8">
      <div className="text-muted-foreground">
        <Server className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p>Component diagram content would be rendered here</p>
        <p className="text-sm mt-2">{content}</p>
      </div>
    </div>
  )
}
