"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Github, Calendar, Users, Code, Database, Cloud, Brain, TrendingUp, Zap, Shield, Globe, Cpu, GitBranch, Monitor } from "lucide-react"

const projectDetails = {
  title: "Cloud ML Pipeline",
  subtitle: "Automated machine learning pipeline for model training, validation, and deployment on AWS",
  status: "Open Source",
  date: "2024",
  duration: "8 months",
  team: "Lead Developer",
  category: "Cloud",
  technologies: [
    "AWS", "Docker", "Python", "MLflow", "Kubernetes", "Terraform", "Apache Airflow", "S3", "EC2", "EKS"
  ],
  demoUrl: null,
  githubUrl: "https://github.com/HumbledDS/cloud-ml-pipeline",
  liveUrl: null
}

const features = [
  {
    icon: Cpu,
    title: "Automated Training",
    description: "End-to-end ML pipeline with automated data preprocessing, model training, and validation"
  },
  {
    icon: GitBranch,
    title: "Version Control",
    description: "Complete model versioning and experiment tracking with MLflow integration"
  },
  {
    icon: Cloud,
    title: "Cloud-Native",
    description: "Built on AWS with Kubernetes orchestration for scalable and reliable deployment"
  },
  {
    icon: Monitor,
    title: "Monitoring & Logging",
    description: "Comprehensive monitoring of model performance and system health in production"
  },
  {
    icon: Shield,
    title: "Security First",
    description: "Secure model serving with authentication, authorization, and data encryption"
  },
  {
    icon: Zap,
    title: "Auto-scaling",
    description: "Automatic scaling based on demand with cost optimization and resource management"
  }
]

const challenges = [
  {
    title: "Pipeline Orchestration",
    description: "Coordinating complex ML workflows across multiple services and environments",
    solution: "Implemented Apache Airflow for workflow orchestration with custom operators"
  },
  {
    title: "Model Versioning",
    description: "Managing multiple model versions and ensuring reproducibility across environments",
    solution: "Integrated MLflow for experiment tracking and model registry with automated versioning"
  },
  {
    title: "Infrastructure as Code",
    description: "Deploying and managing complex cloud infrastructure reliably",
    solution: "Used Terraform for infrastructure provisioning and Kubernetes for container orchestration"
  },
  {
    title: "Cost Optimization",
    description: "Balancing performance requirements with cloud infrastructure costs",
    solution: "Implemented auto-scaling policies and spot instance usage for cost-effective deployment"
  }
]

const metrics = [
  { label: "Training Time", value: "60%", unit: "faster" },
  { label: "Deployment Time", value: "90%", unit: "reduction" },
  { label: "Model Accuracy", value: "98.5%", unit: "average" },
  { label: "Infrastructure Cost", value: "40%", unit: "savings" },
  { label: "Uptime", value: "99.8%", unit: "availability" },
  { label: "Models Deployed", value: "50+", unit: "monthly" }
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
                The Cloud ML Pipeline is a comprehensive solution for automating machine learning workflows 
                in the cloud. Built with modern DevOps practices and cloud-native technologies, it provides 
                a complete framework for training, validating, and deploying ML models at scale.
              </p>
              <p>
                The pipeline integrates with AWS services including EKS for Kubernetes orchestration, S3 for 
                data storage, and EC2 for compute resources. It uses MLflow for experiment tracking and model 
                registry, Apache Airflow for workflow orchestration, and Terraform for infrastructure management.
              </p>
              <p>
                Key achievements include reducing model deployment time by 90%, improving training efficiency 
                by 60%, and achieving 99.8% uptime with automatic scaling and cost optimization.
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

        {/* Challenges & Solutions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-8">Challenges & Solutions</h2>
          <div className="space-y-6">
            {challenges.map((challenge, index) => (
              <motion.div
                key={challenge.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card rounded-xl border border-border p-6"
              >
                <h3 className="font-semibold mb-2 text-primary">{challenge.title}</h3>
                <p className="text-muted-foreground mb-3">{challenge.description}</p>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-sm font-medium">Solution:</p>
                  <p className="text-sm text-muted-foreground">{challenge.solution}</p>
                </div>
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