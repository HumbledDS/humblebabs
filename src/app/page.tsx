"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Code, Database, Cloud, Brain, Sparkles, Download, ExternalLink, Github, Play } from "lucide-react"
import { motion } from "framer-motion"
import { getFeaturedProjects } from "./projects/data"
import { useI18n } from "@/components/i18n-provider"

type FeaturedProject = {
  title: string
  description: string
  image?: string | null
  technologies: string[]
  status: string
  demoUrl?: string | null
  githubUrl?: string | null
  detailsUrl?: string
}

function getProjectSlug(project: FeaturedProject): string {
  if (project.detailsUrl && project.detailsUrl.startsWith("/projects/")) {
    return project.detailsUrl.replace("/projects/", "")
  }
  switch (project.title) {
    case "Cloud ML Pipeline":
      return "cloud-ml-pipeline"
    case "Data Visualization Suite":
      return "data-visualization-suite"
    case "Computer Vision Analytics":
      return "computer-vision-analytics"
    case "Financial Data Analysis Platform":
      return "financial-data-analysis"
    case "LLM RAG Implementation":
      return "llm-rag-implementation"
    case "Advanced Data Modeling Patterns":
      return "advanced-data-modeling-patterns"
    case "Enterprise Data Pipeline Design":
      return "enterprise-data-pipeline-design"
    case "Real-time Analytics & ML Pipelines":
      return "real-time-analytics-ml-pipelines"
    case "Data Governance & Compliance":
      return "data-governance-compliance"
    case "S&P 500 Historical Performance Analysis System":
      return "sp500-historical-analysis"
    case "Job Market Analytics Pipeline":
      return "job-market-analysis"
    default:
      return ""
  }
}

const skills = [
  {
    icon: Brain,
    i18nKey: "aiMl",
    technologies: ["TensorFlow", "PyTorch", "Scikit-learn", "Keras", "OpenCV"],
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Cloud,
    i18nKey: "cloud",
    technologies: ["AWS", "Azure", "GCP", "Docker", "Kubernetes"],
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Database,
    i18nKey: "dataScience",
    technologies: ["Python", "R", "SQL", "Pandas", "NumPy"],
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Code,
    i18nKey: "financialMarkets",
    technologies: ["Python", "SQL", "Pandas", "NumPy", "Matplotlib"],
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-500/10",
  },
]

// Get featured projects from centralized data
const featuredProjects = getFeaturedProjects() as unknown as FeaturedProject[]

export default function Home() {
  const { t } = useI18n()
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
            {/* Floating elements - simplified for performance */}
            <div className="flex justify-center mb-8">
              {[Brain, Cloud, Database, Code].map((Icon, index) => (
                <div
                  key={index}
                  className="w-8 h-8 mx-2 text-primary/60 animate-bounce"
                  style={{ animationDelay: `${index * 0.5}s` }}
                >
                  <Icon className="w-full h-full" />
                </div>
              ))}
            </div>

            <motion.h1 
              className="text-5xl md:text-7xl font-bold"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span>{t("home.hero.hi")} </span>
              <span className="text-[#23235b] relative">
                Babacar.
                <span className="absolute -top-2 -right-2 text-2xl animate-pulse">  ✨
                </span>
              </span>
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6"
            >
              <p className="text-xl md:text-3xl text-muted-foreground font-medium">
                {t("home.hero.role")}
              </p>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
                {t("home.hero.description")}
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
                {t("home.hero.viewWork")}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/about"
                className="inline-flex items-center gap-3 px-8 py-4 border-2 border-border rounded-xl hover:bg-muted/50 hover:border-primary/50 transition-all duration-300"
              >
                {t("home.hero.aboutMe")}
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/resume"
                className="inline-flex items-center gap-3 px-8 py-4 bg-muted/50 rounded-xl hover:bg-muted transition-all duration-300"
              >
                <Download className="w-5 h-5" />
                {t("home.hero.resume")}
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
              {t("home.skillsTitle").split(" ")[0]} <span className="text-[#23235b]">{t("home.skillsTitle").split(" ").slice(1).join(" ")}</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t("home.skillsSubtitle")}
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.i18nKey}
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
                    <h3 className="text-2xl font-bold text-foreground">{t(`home.skills.${skill.i18nKey}.title`)}</h3>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                    {t(`home.skills.${skill.i18nKey}.description`)}
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
              {t("home.featuredTitle").split(" ")[0]} <span className="text-[#23235b]">{t("home.featuredTitle").split(" ").slice(1).join(" ")}</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t("home.featuredSubtitle")}
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
                {/* Project image */}
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
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Code className="w-16 h-16 text-muted-foreground/50 group-hover:text-primary/70 transition-colors duration-300" />
                      </div>
                    </>
                  )}
                  
                  {/* Status badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${ 
                      (project.status === 'Live' || project.status === 'Live Demo') ? 'bg-green-500/20 text-green-600' :
                      project.status === 'Beta' ? 'bg-yellow-500/20 text-yellow-600' :
                      'bg-blue-500/20 text-blue-600'
                    }`}>
                      {project.status === 'Live' ? t('home.projectStatus.live')
                        : project.status === 'Live Demo' ? t('home.projectStatus.liveDemo')
                        : project.status === 'Beta' ? t('home.projectStatus.beta')
                        : project.status === 'Open Source' ? t('home.projectStatus.openSource')
                        : project.status === 'Expert' ? t('home.projectStatus.expert')
                        : project.status === 'Advanced' ? t('home.projectStatus.advanced')
                        : project.status}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                    {(() => {
                      const keyFromDetails = getProjectSlug(project as FeaturedProject)
                      const titleKey = keyFromDetails ? `projects.items.${keyFromDetails}.title` : ""
                      const translated = titleKey ? t(titleKey) : ""
                      return translated && translated !== titleKey ? translated : project.title
                    })()}
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {(() => {
                      const keyFromDetails = getProjectSlug(project as FeaturedProject)
                      const descKey = keyFromDetails ? `projects.items.${keyFromDetails}.description` : ""
                      const translated = descKey ? t(descKey) : ""
                      return translated && translated !== descKey ? translated : project.description
                    })()}
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
                      <a
                        href={project.demoUrl}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-300 text-sm font-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4" />
                        {t("home.demo")}
                      </a>
                    )}
                    <Link
                      href={
                        project.title === "AI-Powered Analytics Dashboard" ? "/projects/ai-powered-analytics-dashboard" :
                        project.title === "Cloud ML Pipeline" ? "/projects/cloud-ml-pipeline" :
                        project.title === "Data Visualization Suite" ? "/projects/data-visualization-suite" :
                        project.title === "Computer Vision Analytics" ? "/projects/computer-vision-analytics" :
                        project.title === "Financial Data Analysis Platform" ? "/projects/financial-data-analysis" :
                        project.title === "LLM RAG Implementation" ? "/projects/llm-rag-implementation" :
                        (project.githubUrl || "/")
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
                          {t("home.viewDetails")}
                        </>
                      ) : (
                        <>
                          <Github className="w-4 h-4" />
                          {t("home.code")}
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
              {t("home.viewAllProjects")}
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
              {t("home.ctaTitle").split(" ").slice(0, 3).join(" ")} <span className="text-[#23235b]">{t("home.ctaTitle").split(" ").slice(3).join(" ")}</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("home.ctaSubtitle")}
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
                {t("home.ctaButton")}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}