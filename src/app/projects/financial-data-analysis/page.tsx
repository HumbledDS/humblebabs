"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Github, Calendar, TrendingUp, BarChart3, DollarSign, Shield, Zap, Database, Cpu } from "lucide-react"

const projectDetails = {
  title: "Financial Data Analysis Platform",
  subtitle: "Real-time financial data processing and analysis with predictive modeling capabilities",
  status: "Live",
  date: "2023",
  duration: "6 months",
  team: "Lead Developer",
  category: "Data",
  technologies: ["Python", "Pandas", "NumPy", "FastAPI", "PostgreSQL", "Redis", "Docker", "AWS", "Scikit-learn", "Plotly"],
  demoUrl: "https://demo.humblebabs.com/finance",
  githubUrl: "https://github.com/HumbledDS/finance-analytics",
  liveUrl: "https://finance.humblebabs.com"
}

const features = [
  {
    icon: TrendingUp,
    title: "Real-time Analytics",
    description: "Live financial data processing with sub-second latency for market insights"
  },
  {
    icon: BarChart3,
    title: "Predictive Modeling",
    description: "ML-powered forecasting for stock prices, market trends, and risk assessment"
  },
  {
    icon: DollarSign,
    title: "Portfolio Management",
    description: "Automated portfolio optimization and risk management tools"
  },
  {
    icon: Shield,
    title: "Compliance & Security",
    description: "Financial data security with regulatory compliance and audit trails"
  },
  {
    icon: Zap,
    title: "High Performance",
    description: "Optimized data processing handling millions of financial records"
  },
  {
    icon: Database,
    title: "Data Integration",
    description: "Seamless integration with multiple financial data sources and APIs"
  }
]

const challenges = [
  {
    title: "Data Latency",
    description: "Processing real-time financial data with minimal delay for trading decisions",
    solution: "Implemented streaming architecture with Apache Kafka and Redis caching"
  },
  {
    title: "Data Quality",
    description: "Ensuring accuracy and consistency across multiple financial data sources",
    solution: "Built comprehensive data validation and cleaning pipelines with automated monitoring"
  },
  {
    title: "Regulatory Compliance",
    description: "Meeting financial industry regulations and data protection requirements",
    solution: "Implemented audit trails, data encryption, and compliance monitoring systems"
  },
  {
    title: "Scalability",
    description: "Handling high-frequency trading data and market volatility spikes",
    solution: "Microservices architecture with auto-scaling and load balancing"
  }
]

const metrics = [
  { label: "Data Points", value: "100M+", unit: "processed daily" },
  { label: "Processing Speed", value: "<50ms", unit: "latency" },
  { label: "Prediction Accuracy", value: "87.3%", unit: "average" },
  { label: "Uptime", value: "99.9%", unit: "availability" },
  { label: "Data Sources", value: "50+", unit: "integrated" },
  { label: "API Calls", value: "1M+", unit: "daily" }
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
            <span className="px-3 py-1 bg-green-500/20 text-green-600 rounded-full text-sm font-medium">
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
              href={projectDetails.liveUrl}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-4 h-4" />
              View Live Demo
            </Link>
            <Link
              href={projectDetails.githubUrl}
              className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-4 h-4" />
              View Code
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
                The Financial Data Analysis Platform is a comprehensive solution for real-time financial 
                data processing, analysis, and predictive modeling. Built for financial institutions and 
                trading firms, it provides powerful tools for market analysis, risk assessment, and 
                portfolio optimization.
              </p>
              <p>
                The platform integrates with multiple financial data sources, processes real-time market 
                data, and provides predictive insights using machine learning models. It features a 
                FastAPI backend for high-performance data processing, PostgreSQL for data storage, and 
                interactive dashboards for data visualization.
              </p>
              <p>
                Key achievements include processing 100M+ data points daily, achieving sub-50ms latency, 
                87.3% prediction accuracy, and 99.9% uptime for critical financial operations.
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
                  <span className="font-medium text-green-600">{projectDetails.status}</span>
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
              href={projectDetails.liveUrl}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-4 h-4" />
              Try Live Demo
            </Link>
            <Link
              href={projectDetails.githubUrl}
              className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-4 h-4" />
              View Source Code
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 