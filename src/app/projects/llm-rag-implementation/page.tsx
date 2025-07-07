"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Github, Calendar, Brain, MessageSquare, Search, Zap, Shield, Database, Cpu } from "lucide-react"

const projectDetails = {
  title: "LLM RAG Implementation",
  subtitle: "Retrieval-Augmented Generation system for intelligent document processing and Q&A",
  status: "Open Source",
  date: "2022",
  duration: "5 months",
  team: "Lead Developer",
  category: "AI/ML",
  technologies: ["Python", "LangChain", "OpenAI", "Pinecone", "FastAPI", "PostgreSQL", "Docker", "AWS", "Transformers", "HuggingFace"],
  demoUrl: null,
  githubUrl: "https://github.com/HumbledDS/llm-rag-system",
  liveUrl: null
}

const features = [
  {
    icon: Brain,
    title: "Intelligent Q&A",
    description: "Context-aware question answering with accurate and relevant responses"
  },
  {
    icon: Search,
    title: "Semantic Search",
    description: "Advanced document retrieval using vector embeddings and similarity search"
  },
  {
    icon: MessageSquare,
    title: "Conversational AI",
    description: "Multi-turn conversations with memory and context preservation"
  },
  {
    icon: Database,
    title: "Document Processing",
    description: "Automated document ingestion, parsing, and knowledge extraction"
  },
  {
    icon: Shield,
    title: "Privacy & Security",
    description: "On-premise deployment with data privacy and security controls"
  },
  {
    icon: Zap,
    title: "High Performance",
    description: "Optimized inference with caching and parallel processing"
  }
]

const challenges = [
  {
    title: "Context Window Limitations",
    description: "Managing large documents within LLM context window constraints",
    solution: "Implemented chunking strategies with semantic overlap and hierarchical retrieval"
  },
  {
    title: "Retrieval Accuracy",
    description: "Ensuring relevant document retrieval for accurate responses",
    solution: "Used hybrid search combining dense and sparse retrievers with re-ranking"
  },
  {
    title: "Response Quality",
    description: "Generating coherent and accurate responses from retrieved context",
    solution: "Implemented prompt engineering and response validation with human feedback"
  },
  {
    title: "Scalability",
    description: "Handling large document collections and concurrent user requests",
    solution: "Built distributed architecture with vector database and caching layers"
  }
]

const metrics = [
  { label: "Document Types", value: "20+", unit: "supported" },
  { label: "Response Accuracy", value: "92.5%", unit: "human evaluation" },
  { label: "Processing Speed", value: "<2s", unit: "average response" },
  { label: "Knowledge Base", value: "10GB+", unit: "documents" },
  { label: "Concurrent Users", value: "500+", unit: "supported" },
  { label: "Cost Reduction", value: "70%", unit: "vs manual review" }
]

export default function ProjectPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </motion.div>

        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-600 rounded-full text-sm font-medium">
              {projectDetails.status}
            </span>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {projectDetails.category}
            </span>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {projectDetails.date}
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {projectDetails.title}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-4xl">
            {projectDetails.subtitle}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href={projectDetails.githubUrl}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </Link>
          </div>
        </motion.div>

        {/* Project Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
        >
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Project Overview</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                The LLM RAG Implementation is a comprehensive Retrieval-Augmented Generation system that 
                combines large language models with intelligent document retrieval to provide accurate 
                and contextually relevant responses. Built for enterprise knowledge management and 
                customer support applications.
              </p>
              <p>
                The system uses LangChain for orchestration, OpenAI's GPT models for generation, Pinecone 
                for vector storage, and FastAPI for the backend API. It supports multiple document formats, 
                provides conversational interfaces, and can be deployed on-premise for data privacy.
              </p>
              <p>
                Key achievements include 92.5% response accuracy, support for 20+ document types, 
                processing 10GB+ of documents, and reducing manual review costs by 70%.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold mb-4">Project Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">{projectDetails.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Role:</span>
                  <span className="font-medium">{projectDetails.team}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium text-blue-600">{projectDetails.status}</span>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold mb-4">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {projectDetails.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-muted/50 rounded-full text-sm font-medium text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-8">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-card rounded-xl border border-border p-6 hover:border-primary/50 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-8">Performance Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-card rounded-xl border border-border p-6 text-center"
              >
                <div className="text-2xl font-bold text-primary mb-2">{metric.value}</div>
                <div className="text-sm text-muted-foreground mb-1">{metric.label}</div>
                <div className="text-xs text-muted-foreground">{metric.unit}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center"
        >
          <p className="text-muted-foreground mb-4">Interested in this project?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={projectDetails.githubUrl}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-4 h-4" />
              View Source Code
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 