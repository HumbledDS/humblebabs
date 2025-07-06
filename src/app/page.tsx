"use client"

import Link from "next/link"
import { ArrowRight, Code, Database, Cloud, Brain, Sparkles, Download, ExternalLink, Github, Play } from "lucide-react"
import { motion } from "framer-motion"

const skills = [
  {
    icon: Brain,
    title: "AI & Machine Learning",
    description: "Building intelligent systems with TensorFlow, PyTorch, and Scikit-learn. From neural networks to deep learning.",
    technologies: ["TensorFlow", "PyTorch", "Scikit-learn", "Keras", "OpenCV"],
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Cloud,
    title: "Cloud Computing",
    description: "Scalable solutions on AWS, Azure, and GCP. Container orchestration with Docker and Kubernetes.",
    technologies: ["AWS", "Azure", "GCP", "Docker", "Kubernetes"],
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Database,
    title: "Data Science",
    description: "Extracting insights from complex datasets using Python, R, and advanced analytics techniques.",
    technologies: ["Python", "R", "SQL", "Pandas", "NumPy"],
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Code,
    title: "Full-Stack Development",
    description: "Modern web applications with React, Next.js, and TypeScript. Building end-to-end solutions.",
    technologies: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL"],
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-500/10",
  },
]

const featuredProjects = [
  {
    title: "AI-Powered Analytics Dashboard",
    description: "Real-time analytics platform with machine learning predictions and interactive visualizations.",
    image: "/images/projects/analytics-dashboard.jpg",
    technologies: ["React", "Python", "TensorFlow", "D3.js"],
    demoUrl: "https://demo.humblebabs.com/analytics",
    githubUrl: "https://github.com/HumbledDS/analytics-dashboard",
    status: "Live",
  },
  {
    title: "Cloud ML Pipeline",
    description: "Automated machine learning pipeline for model training, validation, and deployment on AWS.",
    image: "/images/projects/ml-pipeline.jpg",
    technologies: ["AWS", "Docker", "Python", "MLflow"],
    demoUrl: null,
    githubUrl: "https://github.com/HumbledDS/cloud-ml-pipeline",
    status: "Open Source",
  },
  {
    title: "Data Visualization Suite",
    description: "Interactive data exploration tools with real-time updates and collaborative features.",
    image: "/images/projects/data-viz.jpg",
    technologies: ["Vue.js", "D3.js", "WebSocket", "Node.js"],
    demoUrl: "https://demo.humblebabs.com/dataviz",
    githubUrl: "https://github.com/HumbledDS/data-viz-suite",
    status: "Beta",
  },
]

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section with enhanced animations */}
      <section className="relative flex-1 flex items-center justify-center px-4 py-20 lg:py-32 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent)]" />
          <motion.div 
            className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"
            animate={{ 
              backgroundPosition: ["0px 0px", "50px 50px"],
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto text-left space-y-8">
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Floating elements */}
            <motion.div className="flex justify-center mb-8">
              {[Brain, Cloud, Database, Code].map((Icon, index) => (
                <motion.div
                  key={index}
                  className="w-8 h-8 mx-2 text-primary/60"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ 
                    duration: 3,
                    delay: index * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Icon className="w-full h-full" />
                </motion.div>
              ))}
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-7xl font-bold"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span>Hi, I'm </span>
              <motion.span 
                className="text-[#23235b] relative"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                }}
                style={{ backgroundSize: "200% 200%" }}
              >
                Babacar.
                <motion.span
                  className="absolute -top-2 -right-2 text-2xl"
                  animate={{ rotate: [0, 20, -20, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >  ✨
                </motion.span>
              </motion.span>
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6"
            >
              <p className="text-xl md:text-3xl text-muted-foreground font-medium">
                Data & AI Engineer
              </p>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
                Passionate about transforming data into actionable insights and building intelligent systems. 
                I specialize in <span className="text-primary font-semibold">Data Engineering</span>, 
                <span className="text-purple-600 font-semibold"> Cloud Computing</span>, and 
                <span className="text-blue-600 font-semibold"> Machine Learning</span>.
              </p>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/projects"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-[#23235b] text-white rounded-xl hover:bg-[#23235b]/90 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                View My Work
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/about"
                className="inline-flex items-center gap-3 px-8 py-4 border-2 border-border rounded-xl hover:bg-muted/50 hover:border-primary/50 transition-all duration-300"
              >
                About Me
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/resume"
                className="inline-flex items-center gap-3 px-8 py-4 bg-muted/50 rounded-xl hover:bg-muted transition-all duration-300"
              >
                <Download className="w-5 h-5" />
                Resume
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Skills Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-muted/20 to-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Technical <span className="text-[#23235b]">Expertise</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Combining cutting-edge technologies with practical experience to solve complex problems
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group relative p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 overflow-hidden"
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <motion.div
                      className={`p-4 rounded-xl ${skill.bgColor} group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: 5 }}
                    >
                      <skill.icon className="w-8 h-8 text-primary" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-foreground">{skill.title}</h3>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                    {skill.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {skill.technologies.map((tech, techIndex) => (
                      <motion.span
                        key={tech}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: techIndex * 0.1 }}
                        viewport={{ once: true }}
                        className="px-3 py-1 bg-muted/50 rounded-full text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-300"
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Featured <span className="text-[#23235b]">Projects</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A showcase of my latest work in AI, Data Science, and Cloud Computing
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="group relative bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-300"
              >
                {/* Project image placeholder */}
                <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Code className="w-16 h-16 text-muted-foreground/50 group-hover:text-primary/70 transition-colors duration-300" />
                  </div>
                  
                  {/* Status badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.status === 'Live' ? 'bg-green-500/20 text-green-600' :
                      project.status === 'Beta' ? 'bg-yellow-500/20 text-yellow-600' :
                      'bg-blue-500/20 text-blue-600'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-muted/50 rounded-md text-xs font-medium text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary text-primary rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-medium"
            >
              View All Projects
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/5 via-purple-600/5 to-blue-600/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold">
              Let's Build Something <span className="text-[#23235b]">Amazing</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have a project in mind? Let's discuss how we can bring your data-driven ideas to life.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#23235b] text-white rounded-xl hover:bg-[#23235b]/90 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
              >
                <Sparkles className="w-5 h-5" />
                Get In Touch
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}