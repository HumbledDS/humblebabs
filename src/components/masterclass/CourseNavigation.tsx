"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Course {
  slug: string
  title: string
  level: number
}

const courses: Course[] = [
  {
    slug: "cours-complet",
    title: "Cours Complet Data Engineering",
    level: 0
  },
  {
    slug: "fondamentaux-data-engineering",
    title: "Fondamentaux Data Engineering",
    level: 1
  },
  {
    slug: "modelisation-architecture-avancee",
    title: "Modélisation et Architecture Avancée",
    level: 2
  },
  {
    slug: "scenarios-complexes-solutions-sur-mesure",
    title: "Scénarios Complexes et Solutions",
    level: 3
  },
  {
    slug: "pipelines-transactionnels-temps-reel",
    title: "Pipelines Transactionnels et Temps Réel",
    level: 4
  },
  {
    slug: "entretiens-tests-techniques",
    title: "Entretiens et Tests Techniques",
    level: 5
  },
  {
    slug: "carriere-developpement-professionnel",
    title: "Carrière et Développement Professionnel",
    level: 6
  }
]

interface CourseNavigationProps {
  currentSlug: string
}

export function CourseNavigation({ currentSlug }: CourseNavigationProps) {
  const currentIndex = courses.findIndex(course => course.slug === currentSlug)
  const previousCourse = currentIndex > 0 ? courses[currentIndex - 1] : null
  const nextCourse = currentIndex < courses.length - 1 ? courses[currentIndex + 1] : null

  return (
    <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl">
      <div className="flex justify-between items-center">
        {/* Previous Course */}
        <div className="flex-1">
          {previousCourse ? (
            <Link
              href={`/MasterClass/${previousCourse.slug}`}
              className="inline-flex items-center gap-3 p-4 bg-white dark:bg-slate-700 rounded-lg hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-slate-100 dark:bg-slate-600 rounded-full group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </div>
              <div className="text-left">
                <div className="text-sm text-slate-500 dark:text-slate-400">Précédent</div>
                <div className="font-medium text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Niveau {previousCourse.level}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {previousCourse.title}
                </div>
              </div>
            </Link>
          ) : (
            <div></div>
          )}
        </div>

        {/* Course Progress */}
        <div className="flex-shrink-0 mx-8">
          <div className="text-center">
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">Progression</div>
            <div className="flex items-center gap-2">
              {courses.map((course, index) => (
                <div
                  key={course.slug}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex
                      ? "bg-blue-600"
                      : index < currentIndex
                      ? "bg-green-500"
                      : "bg-slate-300 dark:bg-slate-600"
                  }`}
                />
              ))}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              {currentIndex + 1} / {courses.length}
            </div>
          </div>
        </div>

        {/* Next Course */}
        <div className="flex-1 flex justify-end">
          {nextCourse ? (
            <Link
              href={`/MasterClass/${nextCourse.slug}`}
              className="inline-flex items-center gap-3 p-4 bg-white dark:bg-slate-700 rounded-lg hover:shadow-md transition-all duration-200 group"
            >
              <div className="text-right">
                <div className="text-sm text-slate-500 dark:text-slate-400">Suivant</div>
                <div className="font-medium text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Niveau {nextCourse.level}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {nextCourse.title}
                </div>
              </div>
              <div className="flex items-center justify-center w-10 h-10 bg-slate-100 dark:bg-slate-600 rounded-full group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </div>
            </Link>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  )
}