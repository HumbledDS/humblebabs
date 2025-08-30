"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Clock, Users, BookOpen, Star } from "lucide-react"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Button } from "../ui/button"
import { CourseNavigation } from "./CourseNavigation"
import { masterclassCourses } from "../../lib/courseData"

interface CourseLayoutProps {
  children: React.ReactNode
  courseInfo: {
    title: string
    duration: string
    level: string
    category: string
    tags: string[]
    featured?: boolean
  }
  currentSlug: string
}

export function CourseLayout({ children, courseInfo, currentSlug }: CourseLayoutProps) {
  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link href="/MasterClass">
            <Button variant="outline" className="gap-2 border-2 hover:bg-muted">
              <ArrowLeft className="w-4 h-4" />
              Retour aux cours
            </Button>
          </Link>
        </motion.div>

        {/* Course Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <Card className="border-2 border-border shadow-lg bg-card">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    {courseInfo.featured && (
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-2 border-emerald-200 dark:border-emerald-800">
                        <Star className="w-3 h-3 mr-1" />
                        Recommandé
                      </Badge>
                    )}
                    <Badge variant="outline" className="border-2 bg-background text-foreground">
                      {courseInfo.category}
                    </Badge>
                    <Badge variant="outline" className="border-2 bg-background text-foreground">
                      {courseInfo.level}
                    </Badge>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                    {courseInfo.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-foreground">
                    <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg border border-border">
                      <Clock className="w-4 h-4" />
                      <span>{courseInfo.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg border border-border">
                      <Users className="w-4 h-4" />
                      <span>Niveau {courseInfo.level}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg border border-border">
                      <BookOpen className="w-4 h-4" />
                      <span>{courseInfo.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {courseInfo.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs bg-muted border border-border text-foreground">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Course Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          {children}
        </motion.div>

        {/* Course Navigation */}
        <CourseNavigation currentSlug={currentSlug} />
      </div>
    </div>
  )
}
