"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ExternalLink, Github, Database, Cloud, BarChart3, Zap, Settings, PlayCircle, BookOpen } from "lucide-react"

// FR: Détails du projet
const projectDetails = {
  title: "Job Market Analytics Pipeline",
  subtitle: "A complete end-to-end data engineering pipeline: extract, process, and visualize job market data with Airflow, APIs, and Streamlit.",
  status: "Live Demo",
  date: "2025",
  duration: "2 months",
  team: "Lead Developer",
  category: "Data Engineering",
  technologies: [
    "Python", "Airflow", "APIs", "SQLite", "Streamlit", "Plotly", "DBT"
  ],
  demoUrl: "https://job-market-pipeline-ks2yydrdw.streamlit.app/",
  githubUrl: "https://github.com/HumbledDS/job-market-pipeline"
}

// FR: Fonctionnalités principales
const features = [
  {
    icon: Zap,
    title: "Real-time Data Extraction",
    description: "Automated retrieval of job data from the Adzuna API using Airflow."
  },
  {
    icon: Database,
    title: "Database Storage",
    description: "Store raw and processed data in a local SQLite database for reliability and easy querying."
  },
  {
    icon: Settings,
    title: "Data Transformation",
    description: "Clean, enrich, and aggregate job data using Python and SQL workflows."
  },
  {
    icon: BarChart3,
    title: "Interactive Analytics",
    description: "Visualize trends and insights with Streamlit and Plotly dashboards."
  },
  {
    icon: Cloud,
    title: "Orchestration with Airflow",
    description: "Schedule and monitor the entire pipeline for full automation."
  }
]

// FR: Stack technique
const techStack = [
  { label: "Python", desc: "Data processing & orchestration" },
  { label: "Airflow", desc: "Pipeline scheduling & automation" },
  { label: "APIs (Adzuna)", desc: "Job data extraction" },
  { label: "SQLite", desc: "Local data storage" },
  { label: "Streamlit", desc: "Interactive dashboard" },
  { label: "Plotly", desc: "Data visualizations" }
]

// FR: Insights clés
const insights = [
  "Salary trends by role and location",
  "Top hiring companies analysis",
  "Skills demand tracking",
  "Geographic job distribution"
]

export default function ProjectPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* FR: En-tête du projet */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 bg-green-500/20 text-green-600 rounded-full text-sm font-medium">
              {projectDetails.status}
            </span>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {projectDetails.category}
            </span>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Cloud className="w-4 h-4" />
              {projectDetails.date}
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {projectDetails.title}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-4xl">
            {projectDetails.subtitle}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href={projectDetails.demoUrl}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-4 h-4" />
              Live Demo
            </Link>
            <Link
              href={projectDetails.githubUrl}
              className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-4 h-4" />
              View Code
            </Link>
          </div>
        </motion.div>

        {/* FR: Aperçu pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">End-to-End Pipeline Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                This project demonstrates how to build a fully automated data pipeline for job market analytics, from data extraction to interactive visualization. The pipeline is orchestrated with <strong>Airflow</strong>, retrieves data from the <strong>Adzuna API</strong>, stores it in a <strong>SQLite</strong> database, processes and transforms the data, and finally presents insights through a <strong>Streamlit</strong> dashboard.
              </p>
              <p>
                The architecture is modular and production-ready: each step (API extraction, storage, transformation, analytics) is decoupled and can be extended or replaced. Airflow ensures reliability and automation, while Streamlit provides a modern, interactive UI for business users.
              </p>
              <ul className="list-disc list-inside mt-4">
                <li>Automated, scheduled data collection (Airflow DAGs)</li>
                <li>Robust data storage and transformation (SQLite, Python, SQL)</li>
                <li>Real-time analytics and visualization (Streamlit, Plotly)</li>
                <li>Easy to extend for new data sources or analytics</li>
              </ul>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold mb-4">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {projectDetails.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-muted/50 rounded-full text-sm text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* FR: Fonctionnalités */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-card rounded-xl border border-border p-6 hover:border-primary/50 transition-all duration-300"
              >
                <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FR: Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Key Insights Delivered</h2>
          <div className="bg-card rounded-2xl border border-border p-8">
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {insights.map((insight) => (
                <li key={insight}>{insight}</li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* FR: Tutoriel de mise en place */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8">Quick Start Tutorial: Build Your Own Automated Pipeline</h2>
          <div className="bg-card rounded-2xl border border-border p-8">
            <ol className="list-decimal list-inside space-y-4 text-muted-foreground">
              <li>
                <strong>Clone the repository</strong>:
                <pre className="bg-muted/50 rounded p-2 mt-2 text-xs">git clone https://github.com/HumbledDS/job-market-pipeline</pre>
              </li>
              <li>
                <strong>Install dependencies</strong>:
                <pre className="bg-muted/50 rounded p-2 mt-2 text-xs">pip install -r requirements.txt</pre>
              </li>
              <li>
                <strong>Configure your API keys and settings</strong> (see <code>config/</code> folder).
              </li>
              <li>
                <strong>Run the complete pipeline with Airflow</strong>:
                <pre className="bg-muted/50 rounded p-2 mt-2 text-xs">python scripts/run_complete_pipeline.py</pre>
                <span className="text-xs">This script triggers the Airflow DAG to extract, load, and transform job data automatically.</span>
              </li>
              <li>
                <strong>Launch the Streamlit dashboard</strong>:
                <pre className="bg-muted/50 rounded p-2 mt-2 text-xs">streamlit run dashboard/job_market_dashboard.py</pre>
                <span className="text-xs">Explore salary trends, top companies, skills demand, and more in real time.</span>
              </li>
            </ol>
            <div className="mt-6 text-xs text-muted-foreground">
              <strong>Tip:</strong> You can customize the pipeline by editing the Airflow DAGs, adding new data sources, or extending the dashboard with new visualizations.
            </div>
          </div>
        </motion.div>

        {/* FR: Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-primary/5 to-green-600/5 rounded-2xl border border-border p-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Build Your Own Data Pipeline?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Explore the code, try the live demo, and use this project as a template for your own data engineering workflows!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={projectDetails.demoUrl}
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-5 h-5" />
                Live Demo
              </Link>
              <Link
                href={projectDetails.githubUrl}
                className="inline-flex items-center gap-2 px-8 py-4 border border-border rounded-xl hover:bg-muted/50 transition-colors font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-5 h-5" />
                View Code
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
