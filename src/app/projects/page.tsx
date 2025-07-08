"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ExternalLink, Github, Calendar, Tag, ArrowRight, Filter, Search } from "lucide-react"

export const projects = [
  {
    id: 1,
    title: "AI-Powered Analytics Dashboard",
    description: "Real-time analytics platform with machine learning predictions and interactive visualizations.",
    image: "/images/projects/DataScienceQualityScore.jpg",
    technologies: ["React", "Python", "TensorFlow", "D3.js", "AWS"],
    category: "AI/ML",
    demoUrl: "https://demo.humblebabs.com/analytics",
    githubUrl: "https://github.com/HumbledDS/analytics-dashboard",
    status: "Live",
    date: "2024",
    featured: true
  },
  {
    id: 2,
    title: "Cloud ML Pipeline",
    description: "Automated machine learning pipeline for model training, validation, and deployment on AWS.",
    image: "/images/projects/ml-pipeline.jpg",
    technologies: ["AWS", "Docker", "Python", "MLflow", "Kubernetes"],
    category: "Cloud",
    demoUrl: null,
    githubUrl: "https://github.com/HumbledDS/cloud-ml-pipeline",
    status: "Open Source",
    date: "2024",
    featured: true
  },
  {
    id: 3,
    title: "Data Visualization Suite",
    description: "Interactive data exploration tools with real-time updates and collaborative features.",
    image: "/images/projects/HowTo1.jpg",
    technologies: ["Vue.js", "D3.js", "WebSocket", "Node.js", "PostgreSQL"],
    category: "Data",
    demoUrl: "https://demo.humblebabs.com/dataviz",
    githubUrl: "https://github.com/HumbledDS/data-viz-suite",
    status: "Beta",
    date: "2023",
    featured: true
  },
  {
    id: 4,
    title: "Computer Vision Analytics",
    description: "Advanced computer vision system for object detection and image analysis using deep learning.",
    image: "/images/projects/ComputerVision.jpg",
    technologies: ["Python", "OpenCV", "TensorFlow", "PyTorch", "Docker"],
    category: "AI/ML",
    demoUrl: "https://demo.humblebabs.com/computer-vision",
    githubUrl: "https://github.com/HumbledDS/computer-vision-analytics",
    status: "Live",
    date: "2023",
    featured: false
  },
  {
    id: 5,
    title: "Financial Data Analysis Platform",
    description: "Real-time financial data processing and analysis with predictive modeling capabilities.",
    image: "/images/projects/FinanceData.jpg",
    technologies: ["Python", "Pandas", "NumPy", "FastAPI", "PostgreSQL"],
    category: "Data",
    demoUrl: "https://demo.humblebabs.com/finance",
    githubUrl: "https://github.com/HumbledDS/finance-analytics",
    status: "Live",
    date: "2023",
    featured: false
  },
  {
    id: 6,
    title: "LLM RAG Implementation",
    description: "Retrieval-Augmented Generation system for intelligent document processing and Q&A.",
    image: "/images/projects/LLMRagHowTo.jpg",
    technologies: ["Python", "LangChain", "OpenAI", "Pinecone", "FastAPI"],
    category: "AI/ML",
    demoUrl: null,
    githubUrl: "https://github.com/HumbledDS/llm-rag-system",
    status: "Open Source",
    date: "2022",
    featured: false
  }
]

// Function to get featured projects
export const getFeaturedProjects = () => {
  return projects.filter(project => project.featured)
}

// Function to get projects by category
export const getProjectsByCategory = (category: string) => {
  if (category === "All") return projects
  return projects.filter(project => project.category === category)
}

const categories = ["All", "AI/ML", "Data", "Cloud"]

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === "All" || project.category === selectedCategory
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-[#23235b]">Projects</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A collection of projects showcasing my work in AI, data science, and full-stack development
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <motion.div 
              className="relative flex-1 max-w-md"
              whileHover={{ scale: 1.02 }}
              whileFocus={{ scale: 1.02 }}
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 hover:border-primary/50"
              />
            </motion.div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  whileHover={{ 
                    scale: 1.05,
                    y: -2,
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground hover:shadow-md"
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          key={`${selectedCategory}-${searchTerm}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.03, 
                y: -8,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
              }}
              className="group bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-300"
            >
              {/* Project Image */}
              <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden">
                {project.image ? (
                                  <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index === 0}
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Tag className="w-8 h-8 text-primary" />
                  </div>
                </div>
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    project.status === 'Live' ? 'bg-green-500/20 text-green-600' :
                    project.status === 'Beta' ? 'bg-yellow-500/20 text-yellow-600' :
                    'bg-blue-500/20 text-blue-600'
                  }`}>
                    {project.status}
                  </span>
                </div>

                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-600">
                      Featured
                    </span>
                  </div>
                )}
              </div>

              {/* Project Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-muted-foreground">{project.category}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{project.date}</span>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                  {project.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-muted/50 rounded-md text-xs font-medium text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="px-2 py-1 bg-muted/50 rounded-md text-xs font-medium text-muted-foreground">
                      +{project.technologies.length - 4}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {project.demoUrl && (
                    <Link
                      href={project.demoUrl}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-300 text-sm font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Demo
                    </Link>
                  )}
                  <Link
                    href={
                      project.title === "AI-Powered Analytics Dashboard" ? "/projects/ai-powered-analytics-dashboard" :
                      project.title === "Cloud ML Pipeline" ? "/projects/cloud-ml-pipeline" :
                      project.title === "Data Visualization Suite" ? "/projects/data-visualization-suite" :
                      project.title === "Computer Vision Analytics" ? "/projects/computer-vision-analytics" :
                      project.title === "Financial Data Analysis Platform" ? "/projects/financial-data-analysis" :
                      project.title === "LLM RAG Implementation" ? "/projects/llm-rag-implementation" :
                      project.githubUrl
                    }
                    className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted/50 transition-colors duration-300 text-sm font-medium"
                    target={
                      project.title === "AI-Powered Analytics Dashboard" || 
                      project.title === "Cloud ML Pipeline" ||
                      project.title === "Data Visualization Suite" ||
                      project.title === "Computer Vision Analytics" ||
                      project.title === "Financial Data Analysis Platform" ||
                      project.title === "LLM RAG Implementation" ? "_self" : "_blank"
                    }
                    rel={
                      project.title === "AI-Powered Analytics Dashboard" || 
                      project.title === "Cloud ML Pipeline" ||
                      project.title === "Data Visualization Suite" ||
                      project.title === "Computer Vision Analytics" ||
                      project.title === "Financial Data Analysis Platform" ||
                      project.title === "LLM RAG Implementation" ? "" : "noopener noreferrer"
                    }
                  >
                    {(project.title === "AI-Powered Analytics Dashboard" || 
                      project.title === "Cloud ML Pipeline" ||
                      project.title === "Data Visualization Suite" ||
                      project.title === "Computer Vision Analytics" ||
                      project.title === "Financial Data Analysis Platform" ||
                      project.title === "LLM RAG Implementation") ? (
                      <>
                        <ExternalLink className="w-4 h-4" />
                        View Details
                      </>
                    ) : (
                      <>
                        <Github className="w-4 h-4" />
                        Code
                      </>
                    )}
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <motion.div 
              className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Search className="w-8 h-8 text-muted-foreground" />
            </motion.div>
            <h3 className="text-xl font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-4">Have a project in mind?</p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary text-primary rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-medium"
            >
              Let's Work Together
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
} 