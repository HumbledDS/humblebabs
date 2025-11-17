"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronUp, ChevronDown, BookOpen, Target, Zap, Database, Cloud, Brain, Users, Clock, Star, CheckCircle, AlertTriangle, Info, Lightbulb, ArrowRight, ArrowLeft, BarChart3, Settings, FileText, Code, Shield, TrendingUp, Activity, Gauge, Cpu, Globe, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import coursCompletData from "@/lib/coursCompletData"
import { masterclassCourses } from "@/lib/courseData"

interface Chapter {
  id: string
  title: string
  level: number
  duration: string
  topics: string[]
  completed: boolean
}

// Générer les chapitres depuis les données disponibles
const chapters: Chapter[] = (coursCompletData as unknown as Array<{
  id: string; title: string; level: number; duration: string; topics: string[]
}>).map((chapter) => ({
  id: chapter.id,
  title: chapter.title,
  level: chapter.level,
  duration: chapter.duration,
  topics: chapter.topics,
  completed: false
}))

export default function CoursCompletPage() {
  const [currentChapter, setCurrentChapter] = useState(0)
  const [completedChapters, setCompletedChapters] = useState<Set<string>>(new Set())
  const [showTableOfContents, setShowTableOfContents] = useState(true)

  const progress = (completedChapters.size / chapters.length) * 100

  const markChapterComplete = (chapterId: string) => {
    const newCompleted = new Set(completedChapters)
    newCompleted.add(chapterId)
    setCompletedChapters(newCompleted)
  }

  const nextChapter = () => {
    if (currentChapter < chapters.length - 1) {
      setCurrentChapter(currentChapter + 1)
    }
  }

  const prevChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1)
    }
  }

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <Card className="border-2 border-border shadow-lg bg-card">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <BookOpen className="w-8 h-8 text-primary" />
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  Cours Complet Data Engineering
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Maîtrisez tous les aspects du Data Engineering : de l'ingestion à la production,
                en passant par la transformation et l'orchestration des données.
              </p>
            </CardHeader>

            <CardContent>
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <Badge variant="secondary" className="text-sm bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-2 border-blue-200 dark:border-blue-800">
                  <Target className="w-3 h-3 mr-1" />
                  Niveau: Avancé
                </Badge>
                <Badge variant="secondary" className="text-sm bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-2 border-green-200 dark:border-green-800">
                  <Clock className="w-3 h-3 mr-1" />
                  Durée: 16-20 heures
                </Badge>
                <Badge variant="secondary" className="text-sm bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-2 border-purple-200 dark:border-purple-800">
                  <Users className="w-3 h-3 mr-1" />
                  Public: Data Engineers, Data Scientists
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Progression globale</span>
                  <span className="text-sm font-medium text-muted-foreground">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{completedChapters.size} chapitres terminés</span>
                  <span>{chapters.length - completedChapters.size} restants</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Parcours intégrés (Niveaux 1 à 6) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Card className="border-2 border-border shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Parcours par Niveaux (1 → 6)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {masterclassCourses
                  .filter(c =>
                    [
                      "fondamentaux-data-engineering",
                      "modelisation-architecture-avancee",
                      "scenarios-complexes-solutions-sur-mesure",
                      "pipelines-transactionnels-temps-reel",
                      "entretiens-tests-techniques",
                      "carriere-developpement-professionnel",
                    ].includes(c.id)
                  )
                  .map((course) => (
                    <Card key={course.id} className="border-2 border-border hover:border-primary/40 transition-colors">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex flex-wrap gap-2">
                            {course.featured && (
                              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-2 border-emerald-200 dark:border-emerald-800">
                                <Star className="w-3 h-3 mr-1" />
                                Recommandé
                              </Badge>
                            )}
                            <Badge variant="outline" className="border-2 bg-background text-foreground">
                              {course.category}
                            </Badge>
                            <Badge variant="outline" className="border-2 bg-background text-foreground">
                              {course.level}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {course.duration}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <h3 className="text-lg font-semibold text-foreground">{course.title}</h3>
                        <p className="text-sm text-muted-foreground">{course.excerpt}</p>
                        <div className="flex flex-wrap gap-2">
                          {course.tags.slice(0, 4).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs bg-muted border border-border text-foreground">
                              {tag}
                            </Badge>
                          ))}
                          {course.tags.length > 4 && (
                            <Badge variant="secondary" className="text-xs bg-muted border border-border text-foreground">
                              +{course.tags.length - 4}
                            </Badge>
                          )}
                        </div>
                        <div className="pt-2">
                          <a href={`/MasterClass/${course.slug}`} className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium">
                            Commencer le cours
                            <ArrowRight className="w-4 h-4" />
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Table of Contents Toggle */}
        <div className="flex justify-center mb-8">
          <Button
            variant="outline"
            onClick={() => setShowTableOfContents(!showTableOfContents)}
            className="gap-2"
          >
            {showTableOfContents ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showTableOfContents ? "Masquer le sommaire" : "Afficher le sommaire"}
          </Button>
        </div>

        {/* Table of Contents */}
        {showTableOfContents && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-12"
          >
            <Card className="border-2 border-border shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Sommaire du Cours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {chapters.map((chapter, index) => (
                    <Card
                      key={chapter.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        currentChapter === index ? "ring-2 ring-primary" : ""
                      } ${completedChapters.has(chapter.id) ? "bg-green-50 dark:bg-green-900/20" : ""}`}
                      onClick={() => setCurrentChapter(index)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant="outline" className="text-xs">
                            Niveau {chapter.level}
                          </Badge>
                          {completedChapters.has(chapter.id) && (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                        <h3 className="font-semibold mb-2 text-foreground">{chapter.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{chapter.duration}</p>
                        <div className="space-y-1">
                          {chapter.topics.map((topic, topicIndex) => (
                            <div key={topicIndex} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                              {topic}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Chapter Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={prevChapter}
            disabled={currentChapter === 0}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Chapitre précédent
          </Button>

          <div className="text-center">
            <span className="text-sm text-muted-foreground">Chapitre</span>
            <div className="text-2xl font-bold text-foreground">
              {currentChapter + 1} / {chapters.length}
            </div>
            <div className="text-lg text-muted-foreground">{chapters[currentChapter].title}</div>
          </div>

          <Button
            variant="outline"
            onClick={nextChapter}
            disabled={currentChapter === chapters.length - 1}
            className="gap-2"
          >
            Chapitre suivant
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Chapter Content */}
        <motion.div
          key={currentChapter}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <ChapterContent
            chapter={chapters[currentChapter]}
            onComplete={() => markChapterComplete(chapters[currentChapter].id)}
            isCompleted={completedChapters.has(chapters[currentChapter].id)}
          />
        </motion.div>

        {/* Chapter Completion */}
        <div className="text-center mb-12">
          {completedChapters.has(chapters[currentChapter].id) ? (
            <div className="inline-flex items-center gap-2 p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-lg border-2 border-green-200 dark:border-green-800">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Chapitre terminé !</span>
            </div>
          ) : (
            <Button
              onClick={() => markChapterComplete(chapters[currentChapter].id)}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              <CheckCircle className="w-4 h-4" />
              Marquer comme terminé
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// Chapter Content Component
function ChapterContent({ chapter, onComplete, isCompleted }: {
  chapter: Chapter;
  onComplete: () => void;
  isCompleted: boolean;
}) {
  const chapterData = coursCompletData.find(c => c.id === chapter.id)

  if (!chapterData) {
    return <DefaultChapter />
  }

  return (
    <Card className="border-2 border-border shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 text-primary rounded-full">
            {chapter.level}
          </div>
          {chapter.title}
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {chapter.duration}
          </span>
          <span className="flex items-center gap-1">
            <Target className="w-4 h-4" />
            Niveau {chapter.level}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {chapterData.title}
            </h2>
            <p className="text-lg text-muted-foreground">
              Niveau {chapterData.level} - {chapterData.duration}
            </p>
          </div>

          {/* Contenu principal */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: chapterData.content.replace(/\n/g, '<br/>').replace(/#{1,6}\s+(.+)/g, '<h3 class="text-2xl font-bold text-foreground mb-4">$1</h3>').replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground">$1</strong>').replace(/\*(.+?)\*/g, '<em class="text-muted-foreground">$1</em>') }} />
          </div>

          {/* Exemples pratiques */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Code className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Exemples Pratiques</h3>
            </div>

            <div className="grid gap-4">
              {chapterData.examples.map((example, index) => (
                <Card key={index} className="border-2 border-green-200 dark:border-green-800">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-sm font-bold text-green-600">{index + 1}</span>
                      </div>
                      <p className="text-muted-foreground">{example}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Outils et technologies */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Outils et Technologies</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {chapterData.tools.map((tool, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {tool}
                </Badge>
              ))}
            </div>
          </section>

          {/* Bonnes pratiques */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Bonnes Pratiques</h3>
            </div>

            <div className="grid gap-4">
              {chapterData.bestPractices.map((practice, index) => (
                <Card key={index} className="border-2 border-purple-200 dark:border-purple-800">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                      <p className="text-muted-foreground">{practice}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Défis et solutions */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Défis et Solutions</h3>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="font-semibold text-foreground mb-4">Défis Rencontrés</h4>
                <div className="space-y-3">
                  {chapterData.challenges.map((challenge, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <AlertTriangle className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{challenge}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-4">Solutions Recommandées</h4>
                <div className="space-y-3">
                  {chapterData.solutions.map((solution, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{solution}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Résumé du chapitre */}
          <section className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-2xl border-2 border-blue-200 dark:border-blue-800">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                🎯 Résumé du Chapitre {chapterData.level}
              </h3>
              <p className="text-blue-700 dark:text-blue-300 max-w-3xl mx-auto">
                Vous avez maintenant une compréhension approfondie de {chapterData.title.toLowerCase()}.
                Ce chapitre vous a fourni les connaissances théoriques et pratiques nécessaires
                pour implémenter des solutions robustes et évolutives.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                  <CheckCircle className="w-4 h-4" />
                  Concepts maîtrisés
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                  <CheckCircle className="w-4 h-4" />
                  Outils identifiés
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                  <CheckCircle className="w-4 h-4" />
                  Bonnes pratiques comprises
                </div>
              </div>
            </div>
          </section>
        </div>
      </CardContent>
    </Card>
  )
}

// Placeholder functions for other chapters
function DefaultChapter() {
  return <div className="text-center p-8"><p className="text-muted-foreground">Chapitre non trouvé...</p></div>
}