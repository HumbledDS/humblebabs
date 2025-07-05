export interface BlogPost {
  id: string
  title: string
  description: string
  content: string
  excerpt: string
  image: string
  tags: string[]
  category: string
  publishedAt: string
  updatedAt: string
  readingTime: number
  slug: string
}

export interface Project {
  id: string
  title: string
  description: string
  content: string
  image: string
  technologies: string[]
  category: "AI/ML" | "Cloud" | "Data" | "Web" | "Mobile"
  github?: string
  live?: string
  featured: boolean
  publishedAt: string
  updatedAt: string
}

export interface Experience {
  id: string
  title: string
  company: string
  location: string
  startDate: string
  endDate?: string
  current: boolean
  description: string[]
  technologies: string[]
}

export interface Skill {
  name: string
  level: number
  category: string
  icon?: string
}

export interface SkillCategory {
  name: string
  icon: string
  skills: Skill[]
}

export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

export interface Education {
  id: string
  degree: string
  institution: string
  location: string
  startDate: string
  endDate: string
  description: string
  gpa?: string
}
