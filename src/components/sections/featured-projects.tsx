"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ExternalLink, Github } from "lucide-react"

const featuredProjects = [
  {
    title: "AI-Powered Analytics Dashboard",
    description: "A comprehensive analytics platform that uses machine learning to provide insights and predictions for business metrics.",
    image: "/images/project-1.jpg",
    technologies: ["React", "Python", "TensorFlow", "AWS"],
    github: "https://github.com/humblebabs/ai-analytics",
    live: "https://ai-analytics.humblebabs.com",
    category: "AI/ML",
  },
  {
    title: "Cloud-Native E-commerce Platform",
    description: "Scalable e-commerce solution built with microservices architecture and deployed on Kubernetes.",
    image: "/images/project-2.jpg",
    technologies: ["Next.js", "Node.js", "Docker", "Kubernetes"],
    github: "https://github.com/humblebabs/cloud-ecommerce",
    live: "https://ecommerce.humblebabs.com",
    category: "Cloud",
  },
  {
    title: "Real-time Data Pipeline",
    description: "End-to-end data pipeline for processing real-time streaming data with Apache Kafka and Apache Spark.",
    image: "/images/project-3.jpg",
    technologies: ["Apache Kafka", "Apache Spark", "Python", "PostgreSQL"],
    github: "https://github.com/humblebabs/data-pipeline",
    live: "https://pipeline.humblebabs.com",
    category: "Data",
  },
]

export function FeaturedProjects() {
  return (
    <section className="py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Featured Projects
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="mt-6 text-lg leading-8 text-muted-foreground"
          >
            A selection of my best work showcasing expertise in AI, Cloud computing, 
            and Data engineering.
          </motion.p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {featuredProjects.map((project, index) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-start"
            >
              <div className="relative w-full">
                <div className="aspect-[16/9] w-full rounded-2xl bg-muted overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center">
                    <span className="text-muted-foreground font-medium">
                      Project Image
                    </span>
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                    {project.category}
                  </span>
                </div>
              </div>
              
              <div className="max-w-xl">
                <div className="mt-8 flex items-center gap-x-4 text-xs">
                  <time dateTime="2024" className="text-muted-foreground">
                    2024
                  </time>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-foreground group-hover:text-primary transition-colors">
                    <Link href={project.live}>
                      <span className="absolute inset-0" />
                      {project.title}
                    </Link>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {project.description}
                  </p>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-border"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="mt-6 flex gap-x-4">
                  <Link
                    href={project.github}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-5 w-5" />
                  </Link>
                  <Link
                    href={project.live}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
          >
            View All Projects
            <ExternalLink className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
} 