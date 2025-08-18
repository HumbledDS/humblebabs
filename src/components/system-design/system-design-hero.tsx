"use client"

import { motion } from "framer-motion"
import { LucideIcon, Sparkles } from "lucide-react"

interface SystemDesignHeroProps {
  title: string
  description: string
  icon: LucideIcon
  iconColor?: string
  bgColor?: string
  technologies?: string[]
}

export function SystemDesignHero({
  title,
  description,
  icon: Icon,
  iconColor = "text-blue-500",
  bgColor = "bg-blue-500/10",
  technologies = []
}: SystemDesignHeroProps) {
  return (
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
          {/* Icon */}
          <motion.div 
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className={`w-20 h-20 rounded-2xl ${bgColor} flex items-center justify-center`}>
              <Icon className={`w-10 h-10 ${iconColor}`} />
            </div>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-7xl font-bold"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="text-[#23235b] relative">
              {title}
              <span className="absolute -top-2 -right-2 text-2xl animate-pulse">✨</span>
            </span>
          </motion.h1>

          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {description}
          </motion.p>

          {/* Technologies */}
          {technologies.length > 0 && (
            <motion.div 
              className="flex flex-wrap justify-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {technologies.map((tech, index) => (
                <motion.span
                  key={tech}
                  className="px-4 py-2 text-sm font-medium bg-muted/50 text-muted-foreground rounded-full border border-border/30"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>
          )}

          <motion.div 
            className="flex items-center justify-center gap-4 text-sm text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <Sparkles className="w-4 h-4" />
            <span>Expert-level architectural insights</span>
            <Sparkles className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
