"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ExternalLink, Github, Calendar, Tag, ArrowRight, Filter, Search } from "lucide-react"

const projects = [
  {
    id: 1,
    title: "AI-Powered Analytics Dashboard",
    description: "Real-time analytics platform with machine learning predictions and interactive visualizations.",
    image: "/images/projects/analytics-dashboard.jpg",
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
    image: "/images/projects/data-viz.jpg",
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
    title: "E-commerce Recommendation Engine",
    description: "Personalized product recommendations using collaborative filtering and deep learning.",
    image: "/images/projects/recommendations.jpg",
    technologies: ["Python", "PyTorch", "Redis", "FastAPI", "Docker"],
    category: "AI/ML",
    demoUrl: "https://demo.humblebabs.com/recommendations",
    githubUrl: "https://github.com/HumbledDS/recommendation-engine",
    status: "Live",
    date: "2023",
    featured: false
  },
  {
    id: 5,
    title: "Real-time Chat Application",
    description: "Scalable chat application with real-time messaging, file sharing, and video calls.",
    image: "/images/projects/chat-app.jpg",
    technologies: ["React", "Node.js", "Socket.io", "WebRTC", "MongoDB"],
    category: "Web",
    demoUrl: "https://demo.humblebabs.com/chat",
    githubUrl: "https://github.com/HumbledDS/chat-app",
    status: "Live",
    date: "2023",
    featured: false
  },
  {
    id: 6,
    title: "Blockchain Analytics Platform",
    description: "Analytics platform for blockchain data with real-time transaction monitoring.",
    image: "/images/projects/blockchain.jpg",
    technologies: ["Python", "Web3.js", "PostgreSQL", "Redis", "Docker"],
    category: "Data",
    demoUrl: null,
    githubUrl: "https://github.com/HumbledDS/blockchain-analytics",
    status: "Open Source",
    date: "2022",
    featured: false
  }
]

const categories = ["All", "AI/ML", "Web", "Data", "Cloud", "Mobile"]

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
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-300"
            >
              {/* Project Image */}
              <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
                      href={project.title === "AI-Powered Analytics Dashboard" ? "/projects/ai-powered-analytics-dashboard" : project.githubUrl}
                      className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted/50 transition-colors duration-300 text-sm font-medium"
                      target={project.title === "AI-Powered Analytics Dashboard" ? "_self" : "_blank"}
                      rel={project.title === "AI-Powered Analytics Dashboard" ? "" : "noopener noreferrer"}
                    >
                      {project.title === "AI-Powered Analytics Dashboard" ? (
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
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
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
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary text-primary rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-medium"
          >
            Let's Work Together
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
} 