"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Github, Calendar, Users, Code, Database, Cloud, Brain, TrendingUp, Zap, Shield, Globe } from "lucide-react"

const projectDetails = {
  title: "AI-Powered Analytics Dashboard",
  subtitle: "Real-time analytics platform with machine learning predictions and interactive visualizations",
  status: "Live",
  date: "2024",
  duration: "6 months",
  team: "Lead Developer",
  category: "AI/ML",
  technologies: [
    "React", "TypeScript", "Python", "TensorFlow", "D3.js", "AWS", "PostgreSQL", "Redis", "Docker", "Kubernetes"
  ],
  demoUrl: "https://demo.humblebabs.com/analytics",
  githubUrl: "https://github.com/HumbledDS/analytics-dashboard",
  liveUrl: "https://analytics.humblebabs.com"
}

const features = [
  {
    icon: Brain,
    title: "ML-Powered Insights",
    description: "Real-time predictions and anomaly detection using advanced machine learning models"
  },
  {
    icon: TrendingUp,
    title: "Interactive Visualizations",
    description: "Dynamic charts and graphs with real-time data updates and user interactions"
  },
  {
    icon: Zap,
    title: "Real-time Processing",
    description: "Sub-second latency for data processing and visualization updates"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Role-based access control, data encryption, and compliance with industry standards"
  },
  {
    icon: Users,
    title: "Multi-user Support",
    description: "Collaborative features with user management and permission controls"
  },
  {
    icon: Globe,
    title: "Scalable Architecture",
    description: "Microservices architecture that scales to handle millions of data points"
  }
]

const challenges = [
  {
    title: "Real-time Data Processing",
    description: "Implementing sub-second latency for live data streams while maintaining accuracy",
    solution: "Used Apache Kafka for stream processing and Redis for caching"
  },
  {
    title: "ML Model Deployment",
    description: "Deploying and managing multiple ML models in production with automatic scaling",
    solution: "Built custom model serving infrastructure using TensorFlow Serving and Kubernetes"
  },
  {
    title: "Interactive Visualizations",
    description: "Creating responsive and performant visualizations for large datasets",
    solution: "Implemented data virtualization and progressive loading with D3.js"
  },
  {
    title: "Scalability",
    description: "Handling millions of data points and concurrent users",
    solution: "Microservices architecture with horizontal scaling and load balancing"
  }
]

const metrics = [
  { label: "Data Points Processed", value: "10M+", unit: "daily" },
  { label: "Active Users", value: "5K+", unit: "monthly" },
  { label: "Model Accuracy", value: "95.2%", unit: "average" },
  { label: "Response Time", value: "<500ms", unit: "average" },
  { label: "Uptime", value: "99.9%", unit: "availability" },
  { label: "Cost Reduction", value: "40%", unit: "vs traditional" }
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
                The AI-Powered Analytics Dashboard is a comprehensive real-time analytics platform that combines 
                traditional business intelligence with cutting-edge machine learning capabilities. Built for 
                enterprises that need to process and visualize large volumes of data while gaining predictive insights.
              </p>
              <p>
                The platform features an intuitive React-based frontend with interactive visualizations powered by D3.js, 
                while the backend leverages Python and TensorFlow for ML model training and inference. The entire 
                system is deployed on AWS using Kubernetes for orchestration and scalability.
              </p>
              <p>
                Key achievements include reducing data processing time by 80%, improving prediction accuracy by 15%, 
                and supporting 10,000+ concurrent users with sub-second response times.
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
              <h3 className="font-semibold mb-4">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {projectDetails.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-muted/50 rounded-full text-sm text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Key Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Key Features</h2>
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
                <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Performance Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="text-2xl font-bold text-primary mb-2">{metric.value}</div>
                  <div className="text-sm text-muted-foreground mb-1">{metric.label}</div>
                  <div className="text-xs text-muted-foreground">{metric.unit}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Technical Challenges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8">Technical Challenges & Solutions</h2>
          <div className="space-y-6">
            {challenges.map((challenge, index) => (
              <motion.div
                key={challenge.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card rounded-xl border border-border p-6"
              >
                <h3 className="text-xl font-semibold mb-3 text-primary">{challenge.title}</h3>
                <p className="text-muted-foreground mb-4">{challenge.description}</p>
                <div className="bg-muted/30 rounded-lg p-4">
                  <strong className="text-foreground">Solution:</strong>
                  <span className="text-muted-foreground ml-2">{challenge.solution}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Architecture Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8">System Architecture</h2>
          <div className="bg-card rounded-2xl border border-border p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="p-4 bg-blue-500/10 rounded-xl mb-4">
                  <Code className="w-8 h-8 text-blue-500 mx-auto" />
                </div>
                <h3 className="font-semibold mb-2">Frontend Layer</h3>
                <p className="text-sm text-muted-foreground">
                  React + TypeScript<br />
                  D3.js Visualizations<br />
                  Real-time WebSocket
                </p>
              </div>
              <div className="text-center">
                <div className="p-4 bg-green-500/10 rounded-xl mb-4">
                  <Brain className="w-8 h-8 text-green-500 mx-auto" />
                </div>
                <h3 className="font-semibold mb-2">ML Processing Layer</h3>
                <p className="text-sm text-muted-foreground">
                  TensorFlow Models<br />
                  Python Backend<br />
                  Model Serving
                </p>
              </div>
              <div className="text-center">
                <div className="p-4 bg-purple-500/10 rounded-xl mb-4">
                  <Cloud className="w-8 h-8 text-purple-500 mx-auto" />
                </div>
                <h3 className="font-semibold mb-2">Infrastructure Layer</h3>
                <p className="text-sm text-muted-foreground">
                  AWS Kubernetes<br />
                  PostgreSQL + Redis<br />
                  Load Balancing
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-primary/5 to-purple-600/5 rounded-2xl border border-border p-8">
            <h3 className="text-2xl font-bold mb-4">Interested in Similar Projects?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Let's discuss how we can build innovative solutions for your business needs
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium"
              >
                Get In Touch
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-8 py-4 border border-border rounded-xl hover:bg-muted/50 transition-colors font-medium"
              >
                View More Projects
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 