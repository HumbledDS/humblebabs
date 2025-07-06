"use client"

import { motion } from "framer-motion"
import { Download, Mail, Phone, MapPin, Linkedin, Github, Globe, Calendar, Briefcase, GraduationCap, Award, Users, Code, Database, Cloud, Brain } from "lucide-react"
import Link from "next/link"

const resumeSkills = {
  "Programming Languages": ["Python", "JavaScript", "TypeScript", "R", "SQL", "Java", "C++"],
  "Machine Learning": ["TensorFlow", "PyTorch", "Scikit-learn", "Keras", "OpenCV", "NLTK", "SpaCy"],
  "Cloud & DevOps": ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "Jenkins"],
  "Data & Analytics": ["Pandas", "NumPy", "Matplotlib", "Seaborn", "Tableau", "Power BI", "Apache Spark"],
  "Web Development": ["React", "Next.js", "Node.js", "Vue.js", "PostgreSQL", "MongoDB", "Redis"],
  "Tools & Platforms": ["Git", "Jupyter", "MLflow", "Airflow", "Kafka", "Elasticsearch", "Grafana"]
}

const resumeExperience = [
  {
    title: "Senior Data Scientist",
    company: "TechCorp Solutions",
    location: "San Francisco, CA",
    period: "2022 - Present",
    achievements: [
      "Led development of ML-powered analytics platform serving 10M+ users",
      "Reduced model training time by 60% through optimization of ML pipelines",
      "Implemented A/B testing framework resulting in 25% improvement in user engagement",
      "Mentored 5 junior data scientists and conducted technical interviews"
    ]
  },
  {
    title: "AI Engineer",
    company: "InnovateAI",
    location: "Seattle, WA",
    period: "2020 - 2022",
    achievements: [
      "Built scalable ML pipeline processing 1TB+ daily data volume",
      "Deployed 15+ production models with 99.9% uptime",
      "Developed real-time recommendation engine improving conversion by 30%",
      "Collaborated with cross-functional teams to integrate AI solutions"
    ]
  },
  {
    title: "Data Analyst",
    company: "DataFlow Inc",
    location: "Austin, TX",
    period: "2018 - 2020",
    achievements: [
      "Created interactive dashboards used by 500+ stakeholders",
      "Automated reporting processes saving 20 hours/week",
      "Conducted statistical analysis leading to $2M cost savings",
      "Presented findings to C-level executives and board members"
    ]
  }
]

const resumeEducation = [
  {
    degree: "Master of Science in Data Science",
    school: "Stanford University",
    location: "Stanford, CA",
    period: "2016 - 2018",
    gpa: "3.9/4.0",
    relevant: ["Machine Learning", "Statistical Analysis", "Big Data Processing", "Data Visualization"]
  },
  {
    degree: "Bachelor of Science in Computer Science",
    school: "Massachusetts Institute of Technology",
    location: "Cambridge, MA",
    period: "2012 - 2016",
    gpa: "3.8/4.0",
    relevant: ["Algorithms", "Software Engineering", "Database Systems", "Artificial Intelligence"]
  }
]

const certifications = [
  { name: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", year: "2023" },
  { name: "Google Cloud Professional Data Engineer", issuer: "Google Cloud", year: "2022" },
  { name: "Certified Kubernetes Administrator", issuer: "Cloud Native Computing Foundation", year: "2021" },
  { name: "TensorFlow Developer Certificate", issuer: "Google", year: "2020" }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen py-20">
      {/* Hero Section with Download Resume */}
      <section className="px-4 mb-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Babacar <span className="text-[#23235b]">GUEYE</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Passionate Data & AI Engineer with a deep eager to be fully expert on Cloud, AI and automatisation.
            </p>
            <Link
              href="/resume.pdf"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#23235b] text-white rounded-xl hover:bg-[#23235b]/90 transition-colors font-medium mt-8"
            >
              <Download className="w-5 h-5" />
              Download Resume (PDF)
            </Link>
          </motion.div>

          {/* Contact Information & Professional Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-card rounded-2xl border border-border p-8 mb-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-3xl font-bold mb-4">Babacar</h2>
                <p className="text-xl text-primary font-medium mb-6"> Data Engineer</p>
                <p className="text-muted-foreground leading-relaxed">
                  Competent about data acquisition, storage and transforming it into valuable information. Committed into building and maintaining intelligent systems. 
                  Experienced in data science, cloud computing, and full-stack development.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <a href="mailto:hello@humblebabs.com" className="text-muted-foreground hover:text-foreground transition-colors">
                    contact@humblebabs.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">+33 6 79 81 97 72</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">Region Parisienne, France</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-primary" />
                  <a href="https://humblebabs.com" className="text-muted-foreground hover:text-foreground transition-colors">
                    humblebabs.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Linkedin className="w-5 h-5 text-primary" />
                  <a href="https://linkedin.com/in/babacargueye1/" className="text-muted-foreground hover:text-foreground transition-colors">
                    linkedin.com/in/babacargueye1/
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Github className="w-5 h-5 text-primary" />
                  <a href="https://github.com/humbledds" className="text-muted-foreground hover:text-foreground transition-colors">
                    github.com/humbledds
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Professional Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-4">Professional Summary</h2>
            <div className="bg-card rounded-xl border border-border p-6">
              <p className="text-muted-foreground leading-relaxed">
                Results-driven data scientist and AI engineer with 6+ years of experience in developing 
                machine learning solutions and data-driven applications. Proven track record of leading 
                cross-functional teams, optimizing ML pipelines, and delivering impactful insights that 
                drive business growth. Expertise in Python, TensorFlow, AWS, and full-stack development. 
                Passionate about staying current with emerging technologies and contributing to open-source projects.
              </p>
            </div>
          </motion.div>

          {/* Professional Experience (detailed) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6">Professional Experience</h2>
            <div className="space-y-8">
              {resumeExperience.map((exp, index) => (
                <div key={exp.title} className="bg-card rounded-xl border border-border p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{exp.title}</h3>
                      <p className="text-primary font-medium">{exp.company}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground">{exp.period}</p>
                      <p className="text-sm text-muted-foreground">{exp.location}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="text-muted-foreground">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Education (detailed) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6">Education</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resumeEducation.map((edu, index) => (
                <div key={edu.degree} className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-start gap-4">
                    <GraduationCap className="w-6 h-6 text-primary mt-1" />
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground mb-1">{edu.degree}</h3>
                      <p className="text-primary font-medium mb-2">{edu.school}</p>
                      <p className="text-muted-foreground text-sm mb-2">{edu.location} • {edu.period}</p>
                      <p className="text-muted-foreground text-sm mb-3">GPA: {edu.gpa}</p>
                      <div className="flex flex-wrap gap-2">
                        {edu.relevant.map((course) => (
                          <span
                            key={course}
                            className="px-2 py-1 bg-muted/50 rounded-md text-xs text-muted-foreground"
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Technical Skills (detailed) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6">Technical Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(resumeSkills).map(([category, skillList], index) => (
                <div key={category} className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-bold text-foreground mb-4">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skillList.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-muted/50 rounded-full text-sm text-muted-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6">Certifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certifications.map((cert, index) => (
                <div key={cert.name} className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-start gap-4">
                    <Award className="w-6 h-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-bold text-foreground mb-1">{cert.name}</h3>
                      <p className="text-primary font-medium mb-1">{cert.issuer}</p>
                      <p className="text-muted-foreground text-sm">{cert.year}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-primary/5 to-purple-600/5 rounded-2xl border border-border p-8">
              <h3 className="text-2xl font-bold mb-4">Interested in working together?</h3>
              <p className="text-muted-foreground mb-6">
                Let's discuss how I can contribute to your next project
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium"
              >
                Get In Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
} 