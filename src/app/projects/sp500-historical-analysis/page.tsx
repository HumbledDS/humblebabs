"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Github, FileText, BarChart3, BookOpen, Settings, AlertTriangle, Layers, FolderOpen, PlayCircle, Info, Zap, TrendingUp, Shield, Users, Globe } from "lucide-react"

// FR: Détails du projet (titre, sous-titre, etc.)
const projectDetails = {
  title: "S&P 500 Historical Performance Analysis System",
  subtitle: "A comprehensive research framework for analyzing 100+ years of stock market performance and macro-economic correlations.",
  status: "Research Tool",
  date: "2025",
  duration: "6+ months",
  team: "Lead Developer & Researcher",
  category: "Finance / Data Science",
  technologies: [
    "Python", "Pandas", "yfinance", "NumPy", "Matplotlib", "Seaborn", "Jupyter", "BeautifulSoup", "Scipy"
  ],
  githubUrl: "https://github.com/HumbledDS/Stock-Market-Analysis-Strat1",
  readmeUrl: "https://github.com/HumbledDS/Stock-Market-Analysis-Strat1#readme"
}

// FR: Objectifs de recherche (features)
const researchObjectives = [
  {
    icon: TrendingUp,
    title: "Identify Long-Term Winners",
    description: "Which stocks delivered exceptional returns over multiple decades?"
  },
  {
    icon: Users,
    title: "Business Model Resilience",
    description: "What business models proved most resilient across economic cycles?"
  },
  {
    icon: AlertTriangle,
    title: "Impact of Economic Events",
    description: "How did recessions, wars, and policy changes affect sectors?"
  },
  {
    icon: BarChart3,
    title: "Early Indicators",
    description: "What early signals predicted long-term winners vs. losers?"
  },
  {
    icon: Shield,
    title: "Survivorship Analysis",
    description: "Why did some companies thrive while others failed?"
  }
]

// FR: Principales métriques calculées
const metrics = [
  { label: "CAGR", value: "Compound Annual Growth Rate", desc: "Long-term compounding performance" },
  { label: "Sharpe Ratio", value: "Risk-adjusted Return", desc: "Return per unit of risk" },
  { label: "Max Drawdown", value: "Worst-case Loss", desc: "Largest peak-to-trough decline" },
  { label: "Sector Performance", value: "By Industry", desc: "Trends and rotation patterns" },
  { label: "Survivorship", value: "Data Longevity", desc: "How long companies survived" },
  { label: "Era Analysis", value: "Economic Cycles", desc: "Performance by macro periods" }
]

// FR: Architecture système (workflow)
const architecture = [
  {
    icon: FileText,
    title: "Historical Data Collector",
    desc: "Downloads and analyzes maximum historical data for all S&P 500 stocks. Outputs raw data, rankings, and survivorship analysis. (historical_sp500_analyzer.py)"
  },
  {
    icon: BarChart3,
    title: "Macro-Economic Correlation Analyzer",
    desc: "Correlates stock performance with economic cycles and major events. Outputs era-based and event-based analysis. (macro_correlation_analyzer.py)"
  },
  {
    icon: FolderOpen,
    title: "Structured Output",
    desc: "Organized output: raw data, analysis, reports, and charts for further research."
  }
]

// FR: Méthodologie et limites
const methodology = [
  {
    icon: Info,
    title: "Survivorship Bias Awareness",
    desc: "Focus on current S&P 500 members. Excludes failed companies, creating upward bias."
  },
  {
    icon: Settings,
    title: "Data Quality",
    desc: "Stock splits/dividends adjusted, missing data handled, corporate actions considered."
  },
  {
    icon: Layers,
    title: "Statistical Approach",
    desc: "Monthly log returns, risk-adjusted metrics, rolling analysis for trends."
  },
  {
    icon: AlertTriangle,
    title: "Limitations",
    desc: "Data availability, rate limiting, memory usage, correlation ≠ causation."
  }
]

export default function ProjectPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* FR: Bouton retour */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </motion.div>

        {/* FR: En-tête du projet */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-600 rounded-full text-sm font-medium">
              {projectDetails.status}
            </span>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {projectDetails.category}
            </span>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BarChart3 className="w-4 h-4" />
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
              href={projectDetails.githubUrl}
              className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-4 h-4" />
              View Code
            </Link>
            <Link
              href={projectDetails.readmeUrl}
              className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BookOpen className="w-4 h-4" />
              Read Documentation
            </Link>
          </div>
        </motion.div>

        {/* FR: Objectifs de recherche */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Research Objectives</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {researchObjectives.map((obj, index) => (
              <motion.div
                key={obj.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-card rounded-xl border border-border p-6 hover:border-primary/50 transition-all duration-300"
              >
                <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                  <obj.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{obj.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {obj.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FR: Aperçu du projet */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
        >
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Project Overview</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                This system analyzes the maximum available historical data (up to 100 years) for S&P 500 companies to identify patterns of long-term outperformance and their correlation with macro-economic factors. The focus is on monthly data to reduce noise and emphasize trends across economic cycles.
              </p>
              <p>
                The framework is built with Python scripts and Jupyter notebooks, automating data collection, performance analysis, and macro-economic correlation studies. Outputs include raw data, comprehensive metrics, sector analysis, and human-readable reports.
              </p>
              <p>
                The project is designed for researchers, academics, and investors seeking to understand the drivers of long-term business success in the stock market.
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold mb-4">Project Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">{projectDetails.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Role:</span>
                  <span className="font-medium">{projectDetails.team}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium text-blue-600">{projectDetails.status}</span>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold mb-4">Technologies Used</h3>
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

        {/* FR: Architecture système */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">System Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {architecture.map((layer, index) => (
              <motion.div
                key={layer.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card rounded-xl border border-border p-6 text-center"
              >
                <div className="p-4 bg-primary/10 rounded-xl mb-4 w-fit mx-auto">
                  <layer.icon className="w-8 h-8 text-primary mx-auto" />
                </div>
                <h3 className="font-semibold mb-2">{layer.title}</h3>
                <p className="text-sm text-muted-foreground">{layer.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FR: Principales métriques */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Key Metrics Calculated</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="text-2xl font-bold text-primary mb-2">{metric.label}</div>
                  <div className="text-sm text-muted-foreground mb-1">{metric.value}</div>
                  <div className="text-xs text-muted-foreground">{metric.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FR: Méthodologie et limites */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8">Methodology & Limitations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {methodology.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card rounded-xl border border-border p-6"
              >
                <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FR: Getting Started */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8">Getting Started</h2>
          <div className="bg-card rounded-2xl border border-border p-8">
            <ol className="list-decimal list-inside space-y-4 text-muted-foreground">
              <li>
                <strong>Clone or download the project files</strong> from GitHub.
              </li>
              <li>
                <strong>Install Python dependencies</strong>:
                <pre className="bg-muted/50 rounded p-2 mt-2 text-xs">pip install yfinance pandas numpy requests beautifulsoup4 matplotlib seaborn scipy</pre>
              </li>
              <li>
                <strong>Collect historical data</strong>:
                <pre className="bg-muted/50 rounded p-2 mt-2 text-xs">python historical_sp500_analyzer.py</pre>
              </li>
              <li>
                <strong>Run macro-economic analysis</strong>:
                <pre className="bg-muted/50 rounded p-2 mt-2 text-xs">python macro_correlation_analyzer.py</pre>
              </li>
              <li>
                <strong>Explore the generated reports and charts</strong> in the output folders.
              </li>
            </ol>
          </div>
        </motion.div>

        {/* FR: Résultats attendus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8">Expected Results & Insights</h2>
          <div className="bg-card rounded-2xl border border-border p-8">
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Long-term performance patterns by sector and era</li>
              <li>Identification of "Hall of Fame" stocks (50+ years, 12%+ CAGR)</li>
              <li>Sector rotation and macro-economic correlation insights</li>
              <li>Recession-resilient and high-risk stocks</li>
              <li>Comprehensive data and reports for further research</li>
            </ul>
          </div>
        </motion.div>

        {/* FR: Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-primary/5 to-blue-600/5 rounded-2xl border border-border p-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Discover the Secrets of Long-Term Market Outperformance?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Start with the historical analyzer and see what patterns emerge from decades of market data!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={projectDetails.githubUrl}
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-5 h-5" />
                View on GitHub
              </Link>
              <Link
                href={projectDetails.readmeUrl}
                className="inline-flex items-center gap-2 px-8 py-4 border border-border rounded-xl hover:bg-muted/50 transition-colors font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                <BookOpen className="w-5 h-5" />
                Read Documentation
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 