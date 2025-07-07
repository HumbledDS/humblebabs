"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Github, Calendar, Users, Code, Database, Cloud, Brain, TrendingUp, Zap, Shield, Globe, Eye, Target, Cpu, Smartphone, Camera } from "lucide-react"

const projectDetails = {
  title: "Computer Vision Analytics",
  subtitle: "Advanced computer vision system for object detection and image analysis using deep learning",
  status: "Live",
  date: "2023",
  duration: "9 months",
  team: "Lead Developer",
  category: "AI/ML",
  technologies: [
    "Python", "OpenCV", "TensorFlow", "PyTorch", "Docker", "AWS", "CUDA", "Flask", "PostgreSQL", "Redis"
  ],
  demoUrl: "https://demo.humblebabs.com/computer-vision",
  githubUrl: "https://github.com/HumbledDS/computer-vision-analytics",
  liveUrl: "https://cv.humblebabs.com"
}

const features = [
  {
    icon: Eye,
    title: "Object Detection",
    description: "Real-time detection and classification of objects in images and video streams"
  },
  {
    icon: Target,
    title: "Face Recognition",
    description: "Advanced facial recognition with emotion detection and identity verification"
  },
  {
    icon: Cpu,
    title: "GPU Acceleration",
    description: "Optimized performance using CUDA and GPU-accelerated deep learning models"
  },
  {
    icon: Smartphone,
    title: "Mobile Integration",
    description: "Mobile SDK for real-time computer vision on iOS and Android devices"
  },
  {
    icon: Camera,
    title: "Video Analytics",
    description: "Real-time video processing with object tracking and behavior analysis"
  },
  {
    icon: Shield,
    title: "Privacy-First",
    description: "On-device processing with data privacy and security compliance"
  }
]

const challenges = [
  {
    title: "Real-time Performance",
    description: "Achieving sub-second inference times for complex computer vision tasks",
    solution: "Optimized model architecture with TensorRT and GPU acceleration"
  },
  {
    title: "Model Accuracy",
    description: "Maintaining high accuracy across diverse lighting conditions and environments",
    solution: "Implemented data augmentation and transfer learning with custom datasets"
  },
  {
    title: "Scalability",
    description: "Handling multiple concurrent video streams and processing requests",
    solution: "Built microservices architecture with load balancing and auto-scaling"
  },
  {
    title: "Edge Deployment",
    description: "Deploying models on resource-constrained edge devices",
    solution: "Model quantization and optimization for mobile and IoT devices"
  }
]

const metrics = [
  { label: "Detection Accuracy", value: "96.8%", unit: "mAP" },
  { label: "Processing Speed", value: "30 FPS", unit: "real-time" },
  { label: "Supported Objects", value: "1000+", unit: "classes" },
  { label: "Model Size", value: "15MB", unit: "optimized" },
  { label: "API Response", value: "<100ms", unit: "average" },
  { label: "Uptime", value: "99.7%", unit: "availability" }
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
                The Computer Vision Analytics platform is a comprehensive solution for real-time image and 
                video analysis using state-of-the-art deep learning models. Built for applications requiring 
                high accuracy and low latency, it provides robust object detection, face recognition, and 
                video analytics capabilities.
              </p>
              <p>
                The system leverages TensorFlow and PyTorch for model training, OpenCV for image processing, 
                and CUDA for GPU acceleration. It's designed to run both in the cloud and on edge devices, 
                with optimized models for mobile deployment. The platform includes REST APIs, SDKs for 
                multiple platforms, and comprehensive monitoring tools.
              </p>
              <p>
                Key achievements include 96.8% detection accuracy, real-time processing at 30 FPS, support 
                for 1000+ object classes, and deployment on resource-constrained edge devices.
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