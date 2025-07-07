"use client"

import { motion } from "framer-motion"
import { Download, Mail, Phone, MapPin, Linkedin, Github, Globe, Calendar, Briefcase, GraduationCap, Award, Users, Code, Database, Cloud, Brain } from "lucide-react"
import Link from "next/link"

const resumeSkills = {
  "Data Engineering": ["Apache Kafka", "Hadoop", "Spark", "Airflow", "AWS Glue", "Databricks"],
  "ETL & Data Pipeline": ["Python (Pandas, PySpark)", "SQL", "Airflow", "Talend"],
  "Cloud & DevOps": ["AWS (S3, EC2, Lambda)", "GCP", "Docker", "Kubernetes", "Terraform", "Ansible"],
  "Big Data Tools": ["Apache Hadoop", "Hive", "Spark", "HDFS"],
  "Database Management": ["SQL/NoSQL", "PostgreSQL", "MongoDB", "Cassandra"],
  "Data Analytics & Modeling": ["Dimensional Modeling", "OLAP", "Data Warehousing"],
  "Version Control & CI/CD": ["Git", "Jenkins", "GitLab CI"],
  "Project Management": ["Agile/Scrum", "Jira", "Trello", "Slack"]
}

const resumeExperience = [
  {
    title: "Freelance Web & AI Developer",
    company: "Raktiak Studio (link)",
    companyUrl: "https://raktiak-studio.com",
    location: "France",
    period: "09/2024 - 03/2025",
    achievements: [
      "Developed custom web applications using modern frameworks and Python backend technologies",
      "Implemented AI solutions and machine learning models for client projects",
      "Built scalable web services and APIs for various business requirements",
      "Provided technical consulting and development services to multiple clients"
    ]
  },
  {
    title: "Data Engineer & Backend Developer",
    company: "TrouveTout (Startup)",
    location: "France",
    period: "07/2023 - 05/2024",
    achievements: [
      "Developed ETL processes using Python and Airflow for marketplace data processing",
      "Built scalable backend with Django for data ingestion, transformation, and storage",
      "Implemented automated CI/CD pipelines with Docker, Jenkins, and GitLab, reducing deployment time by 30%",
      "Created data quality monitoring and anomaly detection systems to ensure data integrity"
    ]
  },
  {
    title: "Data Science/Engineer Intern",
    company: "Orange (Telecom Sector)",
    location: "France",
    period: "11/2022 - 05/2023",
    achievements: [
      "Developed data lake architecture using Hadoop and Spark to handle over 200 TB of telecom data",
      "Deployed Kafka for real-time streaming of customer data, enabling better churn analysis",
      "Assisted in migrating on-premises data infrastructure to AWS, utilizing S3, Glue, and Redshift",
      "Supported data science team by providing scalable data pipelines for churn prediction using Apache Spark"
    ]
  },
  {
    title: "Data Analyst Intern",
    company: "Laboratoire de Mathématiques Nicolas ORESME",
    location: "France",
    period: "03/2021 - 07/2021",
    achievements: [
      "Optimized data pipelines for research projects, reducing processing time by 20%",
      "Developed interactive dashboards with SAS Visual Analytics for better variable relationship understanding",
      "Conducted statistical analysis and data transformation for research initiatives"
    ]
  }
]

const resumeEducation = [
  {
    degree: "DU Big Data, Data Science et Analyse des risques",
    school: "Université de Montpellier",
    location: "Montpellier, France",
    period: "10/2023 - 09/2024",
    gpa: "",
    relevant: ["Big Data", "Data Science", "Risk Analysis", "Statistical Modeling"]
  },
  {
    degree: "Master 2 Statistiques Appliquées et Analyse Décisionnelle",
    school: "Université de Caen",
    location: "Caen, France",
    period: "09/2021 - 09/2023",
    gpa: "",
    relevant: ["Applied Statistics", "Decision Analysis", "Statistical Modeling", "Data Analysis"]
  },
  {
    degree: "Licence 3 Mathématiques Appliquées et Licence 3 Informatique",
    school: "Université de Caen",
    location: "Caen, France",
    period: "09/2019 - 09/2021",
    gpa: "",
    relevant: ["Applied Mathematics", "Computer Science", "Algorithms", "Programming"]
  }
]

const certifications = [
  { name: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", year: "2023" },
  { name: "Apache Spark Developer Certification", issuer: "Databricks", year: "2023" },
  { name: "Docker Certified Associate", issuer: "Docker Inc", year: "2022" },
  { name: "Kubernetes Administrator", issuer: "Cloud Native Computing Foundation", year: "2022" }
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
              href="/CV_Babacar_DataEngineer.pdf"
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
                Results-driven Data Engineer with 3+ years of experience in developing data pipelines and 
                data-driven applications. Proven track record of building scalable ETL processes, optimizing 
                data infrastructure, and delivering impactful insights that drive business growth. Expertise 
                in Python, Apache Spark, AWS, and data engineering technologies. Motivated to staying 
                current with emerging technologies and contributing to open-source projects.
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
                      {exp.companyUrl ? (
                        <a 
                          href={exp.companyUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary font-medium hover:text-primary/80 transition-colors"
                        >
                          {exp.company}
                        </a>
                      ) : (
                        <p className="text-primary font-medium">{exp.company}</p>
                      )}
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