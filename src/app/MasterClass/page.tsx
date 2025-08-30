"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { GraduationCap, BookOpen, Clock, Users } from "lucide-react"
import { Breadcrumb } from "../../components/ui/Breadcrumb"
import { CourseCard } from "../../components/masterclass/CourseCard"
import { CourseSearchFilters } from "../../components/masterclass/CourseSearchFilters"
import { masterclassCourses, categories, levels } from "../../lib/courseData"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"

export default function MasterClassPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedLevel, setSelectedLevel] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCourses = masterclassCourses.filter(course => {
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory
    const matchesLevel = selectedLevel === "All" || course.level === selectedLevel
    const matchesSearch = searchTerm === "" || 
                         course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesCategory && matchesLevel && matchesSearch
  })

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb items={[{ label: "MasterClass" }]} />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-6 border-2 border-border shadow-lg">
            <GraduationCap className="w-10 h-10 text-foreground" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
            MasterClass
            <span className="block text-primary">Data Engineering</span>
          </h1>
          <p className="text-xl text-foreground max-w-3xl mx-auto mb-8">
            Transformez votre carrière avec nos cours intensifs et pratiques. 
            De débutant à expert, maîtrisez les technologies et concepts essentiels du data engineering.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-foreground">
            <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg border border-border">
              <Users className="w-4 h-4" />
              <span>10+ Cours Complets</span>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg border border-border">
              <Clock className="w-4 h-4" />
              <span>De 3 jours à 2 semaines</span>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg border border-border">
              <BookOpen className="w-4 h-4" />
              <span>Contenu Pratique</span>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <CourseSearchFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedLevel={selectedLevel}
          onLevelChange={setSelectedLevel}
          categories={categories}
          levels={levels}
        />

        {/* Cours Complet - Section Spéciale */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <Card className="border-2 border-primary/20 shadow-xl bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-primary" />
                    </div>
                    <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                      Recommandé
                    </Badge>
                  </div>
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    Cours Complet Data Engineering
                  </h2>
                  <p className="text-muted-foreground mb-6 text-lg">
                    Maîtrisez tous les aspects du Data Engineering en une seule page complète. 
                    De l'ingestion à la production, en passant par la transformation et l'orchestration des données.
                  </p>
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>16-20 heures</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>6 chapitres</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <GraduationCap className="w-4 h-4" />
                      <span>Niveau Avancé</span>
                    </div>
                  </div>
                  <Button 
                    asChild 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <a href="/MasterClass/cours-complet">
                      Commencer le Cours Complet
                    </a>
                  </Button>
                </div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl p-6 border border-primary/20">
                    <h3 className="font-semibold text-foreground mb-4">Contenu du Cours</h3>
                    <div className="space-y-3">
                      {[
                        "🚀 Ingestion des Données",
                        "💾 Stockage des Données", 
                        "🔄 Transformation des Données",
                        "⚙️ Orchestration et Workflows",
                        "📊 Monitoring et Observabilité",
                        "🔒 Sécurité et Gouvernance"
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-3 text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Courses Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          key={`${selectedCategory}-${selectedLevel}-${searchTerm}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredCourses.map((course, index) => (
            <CourseCard key={course.slug} course={course} index={index} />
          ))}
        </motion.div>

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-foreground">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2 text-foreground">Aucun cours trouvé</h3>
              <p className="text-foreground">Essayez de modifier vos filtres ou votre recherche</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
