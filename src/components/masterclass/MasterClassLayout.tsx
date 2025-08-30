"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CourseNavigation } from "./CourseNavigation"
import { masterclassCourses } from "../../lib/courseData"

interface MasterClassLayoutProps {
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

export function MasterClassLayout({ children, courseInfo, currentSlug }: MasterClassLayoutProps) {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-card shadow-lg rounded-lg mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <Link
                href="/MasterClass"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour aux cours
              </Link>
              
              <div className="flex items-center gap-4">
                {courseInfo.featured && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                    Recommandé
                  </span>
                )}
              </div>
            </div>
            
            <div className="mt-4">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{courseInfo.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  {courseInfo.level}
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-secondary rounded-full"></span>
                  {courseInfo.category}
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  {courseInfo.duration}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="mb-12">
          {children}
        </div>

        {/* Course Navigation */}
        <CourseNavigation currentSlug={currentSlug} courses={masterclassCourses} />
      </div>
    </div>
  )
}
