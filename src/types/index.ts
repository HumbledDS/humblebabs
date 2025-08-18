export interface BlogPost {
  id: string
  title: string
  description: string
  content: string
  excerpt: string
  image: string
  tags: string[]
  category: string
  publishedAt: string
  updatedAt: string
  readingTime: number
  slug: string
}

export interface Project {
  id: string
  title: string
  description: string
  content: string
  image: string
  technologies: string[]
  category: "AI/ML" | "Cloud" | "Data" | "Web" | "Mobile"
  github?: string
  live?: string
  featured: boolean
  publishedAt: string
  updatedAt: string
}

export interface Experience {
  id: string
  title: string
  company: string
  location: string
  startDate: string
  endDate?: string
  current: boolean
  description: string[]
  technologies: string[]
}

export interface Skill {
  name: string
  level: number
  category: string
  icon?: string
}

export interface SkillCategory {
  name: string
  icon: string
  skills: Skill[]
}

export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

export interface Education {
  id: string
  degree: string
  institution: string
  location: string
  startDate: string
  endDate: string
  description: string
  gpa?: string
}

// System Design Types
export interface PipelineArchitecture {
  id: string
  name: string
  description: string
  category: PipelineCategory
  technologies: string[]
  diagram: string // SVG path ou image URL
  tradeOffs: TradeOff[]
  flowSteps: FlowStep[]
  useCases: string[]
  complexity: 'Low' | 'Medium' | 'High'
  performance: PerformanceMetrics
  pros: string[]
  cons: string[]
  whenToUse: string[]
  alternatives: string[]
}

export type PipelineCategory =
  | 'Batch Processing'
  | 'Real-time Processing'
  | 'Hybrid Architecture'
  | 'Cloud-Native'
  | 'Event-Driven'
  | 'Stream Processing'

// Microservices Types
export interface MicroserviceArchitecture {
  id: string
  name: string
  description: string
  category: MicroserviceCategory
  technologies: string[]
  diagram: string
  tradeOffs: TradeOff[]
  flowSteps: FlowStep[]
  useCases: string[]
  complexity: 'Low' | 'Medium' | 'High'
  performance: PerformanceMetrics
  pros: string[]
  cons: string[]
  whenToUse: string[]
  alternatives: string[]
}

export type MicroserviceCategory =
  | 'API Gateway'
  | 'Service Mesh'
  | 'Event-Driven'
  | 'CQRS'
  | 'Saga Pattern'
  | 'Circuit Breaker'

// Cloud-Native Types
export interface CloudNativeArchitecture {
  id: string
  name: string
  description: string
  category: CloudNativeCategory
  technologies: string[]
  diagram: string
  tradeOffs: TradeOff[]
  flowSteps: FlowStep[]
  useCases: string[]
  complexity: 'Low' | 'Medium' | 'High'
  performance: PerformanceMetrics
  pros: string[]
  cons: string[]
  whenToUse: string[]
  alternatives: string[]
}

export type CloudNativeCategory =
  | 'Serverless'
  | 'Container Orchestration'
  | 'Event-Driven Cloud'
  | 'Multi-Cloud'
  | 'Edge Computing'
  | 'Cloud Databases'

// AI/ML Types
export interface AIMLArchitecture {
  id: string
  name: string
  description: string
  category: AIMLCategory
  technologies: string[]
  diagram: string
  tradeOffs: TradeOff[]
  flowSteps: FlowStep[]
  useCases: string[]
  complexity: 'Low' | 'Medium' | 'High'
  performance: PerformanceMetrics
  pros: string[]
  cons: string[]
  whenToUse: string[]
  alternatives: string[]
}

export type AIMLCategory =
  | 'MLOps'
  | 'Model Serving'
  | 'Feature Store'
  | 'A/B Testing'
  | 'Data Versioning'
  | 'Federated Learning'

export interface TradeOff {
  aspect: string
  description: string
  impact: 'Positive' | 'Negative' | 'Neutral'
}

export interface FlowStep {
  id: string
  name: string
  description: string
  technologies: string[]
  order: number
}

export interface PerformanceMetrics {
  latency: string
  throughput: string
  scalability: string
  reliability: string
  cost: string
}

export interface SystemDesignCategory {
  id: string
  title: string
  description: string
  icon: string
  href: string
  color: string
  bgColor: string
  technologies: string[]
}
