export interface Course {
  id: string
  title: string
  excerpt: string
  duration: string
  level: string
  category: string
  tags: string[]
  featured: boolean
  slug: string
  fileName: string
}

export const masterclassCourses: Course[] = [
  {
    id: "fondamentaux-data-engineering",
    title: "Niveau 1 : Fondamentaux Data Engineering",
    excerpt: "Guide complet des fondamentaux Data Engineering avec 15 scénarios de pipeline, modélisation des données, ETL/ELT, et architecture moderne. Inclut des graphiques Mermaid pour visualiser les concepts.",
    duration: "4-6 semaines",
    level: "Débutant",
    category: "Data Engineering",
    tags: ["Fondamentaux", "ETL", "ELT", "Data Modeling", "SQL", "Python", "Mermaid"],
    featured: true,
    slug: "fondamentaux-data-engineering",
    fileName: "01-fondamentaux-data-engineering.md"
  },
  {
    id: "modelisation-architecture-avancee",
    title: "Niveau 2 : Modélisation et Architecture Avancée des Données",
    excerpt: "Maîtrisez les concepts avancés de modélisation des données, concevez des architectures robustes et évolutives, et implémentez des patterns de conception pour les pipelines de données.",
    duration: "4-6 semaines",
    level: "Intermédiaire",
    category: "Data Modeling",
    tags: ["Modélisation Avancée", "Architecture", "Patterns", "Performance", "Gouvernance"],
    featured: true,
    slug: "modelisation-architecture-avancee",
    fileName: "02-modelisation-architecture-avancee.md"
  },
  {
    id: "scenarios-complexes-solutions-sur-mesure",
    title: "Niveau 3 : Scénarios Complexes et Solutions sur Mesure",
    excerpt: "Résolvez des problèmes de données complexes et multi-dimensionnels, concevez des architectures adaptées aux contraintes spécifiques, et gérez des volumes de données massifs.",
    duration: "6-8 semaines",
    level: "Avancé",
    category: "Data Engineering",
    tags: ["Big Data", "Multi-Cloud", "Streaming", "Machine Learning", "Sécurité"],
    featured: true,
    slug: "scenarios-complexes-solutions-sur-mesure",
    fileName: "03-scenarios-complexes-solutions-sur-mesure.md"
  },
  {
    id: "pipelines-transactionnels-temps-reel",
    title: "Niveau 4 : Pipelines Transactionnels et Temps Réel",
    excerpt: "Concevez des pipelines transactionnels robustes et performants, implémentez des systèmes en temps réel critiques, et assurez la haute disponibilité et la résilience des systèmes.",
    duration: "6-8 semaines",
    level: "Expert",
    category: "Data Engineering",
    tags: ["Transactions", "Temps Réel", "Cohérence", "Haute Disponibilité", "Performance"],
    featured: true,
    slug: "pipelines-transactionnels-temps-reel",
    fileName: "04-pipelines-transactionnels-temps-reel.md"
  },
  {
    id: "entretiens-tests-techniques",
    title: "Niveau 5 : Entretiens et Tests Techniques",
    excerpt: "Préparez-vous aux entretiens techniques avec des exercices SQL avancés, des problèmes Python Data Engineering, et des scénarios de conception de pipelines. Inclut des corrections détaillées.",
    duration: "3-4 semaines",
    level: "Tous niveaux",
    category: "Career",
    tags: ["Entretiens", "SQL", "Python", "Pipeline Design", "Tests Techniques"],
    featured: true,
    slug: "entretiens-tests-techniques",
    fileName: "05-entretiens-tests-techniques.md"
  },
  {
    id: "carriere-developpement-professionnel",
    title: "Niveau 6 : Carrière et Développement Professionnel",
    excerpt: "Développez votre carrière en Data Engineering avec des roadmaps détaillés, des spécialisations, des certifications, et des stratégies pour l'entrepreneuriat et l'innovation.",
    duration: "4-6 semaines",
    level: "Tous niveaux",
    category: "Career",
    tags: ["Carrière", "Spécialisations", "Certifications", "Networking", "Entrepreneuriat"],
    featured: true,
    slug: "carriere-developpement-professionnel",
    fileName: "06-carriere-developpement-professionnel.md"
  }
]

export const categories = ["All", "Data Engineering", "Data Modeling", "Career"]
export const levels = ["All", "Débutant", "Intermédiaire", "Avancé", "Expert", "Tous niveaux"]

export function getCourseBySlug(slug: string): Course | undefined {
  return masterclassCourses.find(course => course.slug === slug)
}

export function getCoursesByCategory(category: string): Course[] {
  if (category === "All") return masterclassCourses
  return masterclassCourses.filter(course => course.category === category)
}

export function getCoursesByLevel(level: string): Course[] {
  if (level === "All") return masterclassCourses
  return masterclassCourses.filter(course => course.level === level)
}

export function searchCourses(query: string): Course[] {
  const lowercaseQuery = query.toLowerCase()
  return masterclassCourses.filter(course => 
    course.title.toLowerCase().includes(lowercaseQuery) ||
    course.excerpt.toLowerCase().includes(lowercaseQuery) ||
    course.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}
