"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Clock, Users, BookOpen, ArrowRight, Star } from "lucide-react"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"

interface CourseCardProps {
  course: {
    slug: string
    title: string
    excerpt: string
    duration: string
    level: string
    category: string
    tags: string[]
    featured?: boolean
  }
  index: number
}

export function CourseCard({ course, index }: CourseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Link href={`/MasterClass/${course.slug}`}>
        <Card className="h-full transition-all duration-300 hover:shadow-xl border-2 border-border hover:border-primary/50 bg-card shadow-sm hover:shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              {course.featured && (
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <Star className="w-3 h-3 mr-1" />
                  Recommandé
                </Badge>
              )}
              <div className="flex items-center gap-2 text-xs text-foreground bg-muted/50 px-2 py-1 rounded-md">
                <Clock className="w-3 h-3" />
                {course.duration}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pb-4">
            <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors text-foreground">
              {course.title}
            </h3>
            <p className="text-foreground text-sm leading-relaxed mb-4">
              {course.excerpt}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="text-xs border-2 bg-background text-foreground">
                {course.level}
              </Badge>
              <Badge variant="outline" className="text-xs border-2 bg-background text-foreground">
                {course.category}
              </Badge>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {course.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs bg-muted border border-border text-foreground">
                  {tag}
                </Badge>
              ))}
              {course.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs bg-muted border border-border text-foreground">
                  +{course.tags.length - 3}
                </Badge>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="pt-0">
            <div className="flex items-center justify-between w-full p-3 bg-muted/30 rounded-lg border border-border">
              <span className="text-sm text-foreground font-medium">
                Commencer le cours
              </span>
              <ArrowRight className="w-4 h-4 text-foreground group-hover:translate-x-1 transition-transform" />
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  )
}
