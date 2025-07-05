"use client"

import { motion } from "framer-motion"
import { Download, Mail, Linkedin, Github, Calendar, MapPin, Briefcase, GraduationCap, Award, Users, Code, Database, Cloud } from "lucide-react"
import Link from "next/link"

const experiences = [
  {
    title: "Senior Data Scientist",
    company: "TechCorp Solutions",
    period: "2022 - Present",
    description: "Leading machine learning initiatives and developing AI-powered analytics solutions.",
    technologies: ["Python", "TensorFlow", "AWS", "Docker"]
  },
  {
    title: "AI Engineer",
    company: "InnovateAI",
    period: "2020 - 2022",
    description: "Built scalable ML pipelines and deployed models in production environments.",
    technologies: ["PyTorch", "Kubernetes", "MLflow", "React"]
  },
  {
    title: "Data Analyst",
    company: "DataFlow Inc",
    period: "2018 - 2020",
    description: "Analyzed complex datasets and created interactive dashboards for stakeholders.",
    technologies: ["SQL", "Tableau", "Python", "R"]
  }
]

const education = [
  {
    degree: "Master of Science in Data Science",
    school: "Stanford University",
    period: "2016 - 2018",
    description: "Specialized in machine learning and statistical analysis"
  },
  {
    degree: "Bachelor of Science in Computer Science",
    school: "MIT",
    period: "2012 - 2016",
    description: "Focused on algorithms and software engineering"
  }
]

const skills = [
  { category: "Programming", items: ["Python", "JavaScript", "TypeScript", "R", "SQL"] },
  { category: "Machine Learning", items: ["TensorFlow", "PyTorch", "Scikit-learn", "Keras", "OpenCV"] },
  { category: "Cloud & DevOps", items: ["AWS", "Azure", "GCP", "Docker", "Kubernetes"] },
  { category: "Data & Analytics", items: ["Pandas", "NumPy", "Matplotlib", "Tableau", "Power BI"] },
  { category: "Web Development", items: ["React", "Next.js", "Node.js", "PostgreSQL", "MongoDB"] },
  { category: "Tools & Platforms", items: ["Git", "Jupyter", "MLflow", "Airflow", "Spark"] }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="px-4 mb-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About <span className="text-[#23235b]">Me</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Passionate data scientist and AI engineer with a love for turning complex problems into elegant solutions
            </p>
          </motion.div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-card rounded-2xl border border-border p-8 mb-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold mb-4">HumbleBabs</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  I'm a full-stack developer and data scientist with over 6 years of experience in building 
                  intelligent systems and data-driven applications. My passion lies in the intersection of 
                  AI, cloud computing, and data engineering, where I create solutions that make a real impact.
                </p>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  When I'm not coding or analyzing data, you'll find me exploring new technologies, 
                  contributing to open-source projects, or sharing knowledge with the developer community.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/resume"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Resume
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Get In Touch
                  </Link>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">Available for opportunities</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">6+ years experience</span>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <h3 className="font-semibold mb-3">Connect</h3>
                  <div className="flex gap-3">
                    <Link href="https://linkedin.com/in/humblebabs" className="text-muted-foreground hover:text-primary transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </Link>
                    <Link href="https://github.com/humblebabs" className="text-muted-foreground hover:text-primary transition-colors">
                      <Github className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="px-4 mb-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Professional Experience</h2>
            <p className="text-muted-foreground">My journey in the world of data and technology</p>
          </motion.div>

          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-xl border border-border p-6 hover:border-primary/50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{exp.title}</h3>
                    <p className="text-primary font-medium">{exp.company}</p>
                  </div>
                  <span className="text-muted-foreground text-sm">{exp.period}</span>
                </div>
                <p className="text-muted-foreground mb-4">{exp.description}</p>
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-muted/50 rounded-full text-sm text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="px-4 mb-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Education</h2>
            <p className="text-muted-foreground">Academic background and continuous learning</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {education.map((edu, index) => (
              <motion.div
                key={edu.degree}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-xl border border-border p-6"
              >
                <div className="flex items-start gap-4">
                  <GraduationCap className="w-6 h-6 text-primary mt-1" />
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground mb-1">{edu.degree}</h3>
                    <p className="text-primary font-medium mb-2">{edu.school}</p>
                    <p className="text-muted-foreground text-sm mb-2">{edu.period}</p>
                    <p className="text-muted-foreground text-sm">{edu.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Skills & Technologies</h2>
            <p className="text-muted-foreground">Technologies and tools I work with</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skillGroup, index) => (
              <motion.div
                key={skillGroup.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-xl border border-border p-6"
              >
                <h3 className="font-bold text-foreground mb-4">{skillGroup.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-muted/50 rounded-full text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
} 