"use client"

import { motion } from "framer-motion"
import { ArrowRight, Database, Cloud, Brain, Code2, Sparkles } from "lucide-react"
import Link from "next/link"
import { SystemDesignStats } from "@/components/system-design/system-design-stats"
import { useI18n } from "@/components/i18n-provider"

const systemDesignCategories = [
  {
    key: "dataPipelines",
    icon: Database,
    href: "/system-design/data-pipelines",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    technologies: ["ETL", "Stream Processing", "Batch Processing", "Real-time Analytics"]
  },
  {
    key: "microservices",
    icon: Code2,
    href: "/system-design/microservices",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
    technologies: ["Docker", "Kubernetes", "API Gateway", "Service Mesh"]
  },
  {
    key: "cloudNative",
    icon: Cloud,
    href: "/system-design/cloud-native",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
    technologies: ["AWS", "Azure", "GCP", "Serverless", "Containers"]
  },
  {
    key: "aiMl",
    icon: Brain,
    href: "/system-design/ai-ml",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-500/10",
    technologies: ["MLOps", "Model Serving", "Feature Stores", "Data Versioning"]
  }
]

export default function SystemDesignPage() {
  const { t } = useI18n()
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
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

        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Floating elements */}
            <div className="flex justify-center mb-8">
              {[Database, Cloud, Brain, Code2].map((Icon, index) => (
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
              <span className="text-[#23235b] relative">
                {t("systemDesign.heroTitle")}
                <span className="absolute -top-2 -right-2 text-2xl animate-pulse">✨</span>
              </span>
            </motion.h1>

            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {t("systemDesign.heroSubtitle")}
            </motion.p>

            <motion.div 
              className="flex items-center justify-center gap-4 text-sm text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Sparkles className="w-4 h-4" />
              <span>{t("systemDesign.heroBadge")}</span>
              <Sparkles className="w-4 h-4" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("systemDesign.exploreTitle")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("systemDesign.exploreSubtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {systemDesignCategories.map((category, index) => (
              <motion.div
                key={category.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Link href={category.href}>
                  <div className={`relative p-8 rounded-2xl border border-border/50 bg-card hover:bg-card/80 transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-xl group-hover:shadow-primary/10`}>
                    {/* Background gradient */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${category.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                    
                    {/* Icon */}
                    <div className={`relative z-10 w-16 h-16 rounded-xl ${category.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <category.icon className={`w-8 h-8 bg-gradient-to-r ${category.color} bg-clip-text text-transparent`} />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 space-y-4">
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {t(`systemDesign.categories.${category.key}.title`)}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {t(`systemDesign.categories.${category.key}.description`)}
                      </p>
                      
                      {/* Technologies */}
                      <div className="flex flex-wrap gap-2">
                        {category.technologies.map((tech) => (
                          <span 
                            key={tech}
                            className="px-3 py-1 text-xs font-medium bg-muted/50 text-muted-foreground rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Arrow indicator */}
                      <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform duration-300">
                        <span>{t("systemDesign.exploreCta")}</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

             {/* Statistics Section */}
       <SystemDesignStats
         totalArchitectures={11}
         totalCategories={12}
         totalTechnologies={45}
       />
    </div>
  )
}
