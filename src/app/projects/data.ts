export const projects = [
  {
    id: 1,
    title: "S&P 500 Historical Performance Analysis System",
    description: "A comprehensive research framework for analyzing 100+ years of stock market performance and macro-economic correlations.",
    image: "/images/projects/FinanceData.jpg", // Update if you have a new image for sp500-historical-analysis
    technologies: ["Python", "Pandas", "yfinance", "NumPy", "Matplotlib", "Seaborn", "Jupyter"],
    category: "Data & Financial Markets",
    demoUrl: "https://github.com/HumbledDS/Stock-Market-Analysis-Strat1",
    githubUrl: "https://github.com/HumbledDS/Stock-Market-Analysis-Strat1",
    detailsUrl: "/projects/sp500-historical-analysis",
    status: "Open Source",
    date: "2025",
    featured: true
  },
  {
    id: 2,
    title: "Job Market Analytics Pipeline",
    description: "A complete end-to-end data engineering pipeline: extract, process, and visualize job market data with Airflow, APIs, and Streamlit.",
    image: "/images/projects/JobMarket.jpg", // Change if you have a more relevant image
    technologies: ["Python", "Airflow", "APIs", "SQLite", "Streamlit", "Plotly", "DBT"],
    category: "Data Engineering",
    demoUrl: "https://job-market-pipeline-ks2yydrdw.streamlit.app/",
    githubUrl: "https://github.com/HumbledDS/job-market-pipeline",
    detailsUrl: "/projects/job-market-analysis",
    status: "Live Demo",
    date: "2025",
    featured: true
  },
  {
    id: 3,
    title: "LLM RAG Implementation",
    description: "Retrieval-Augmented Generation system for intelligent document processing and Q&A.",
    image: "/images/projects/LLMRagHowTo.jpg",
    technologies: ["Python", "LangChain", "OpenAI", "Pinecone", "FastAPI"],
    category: "AI/ML",
    demoUrl: null,
    // githubUrl: "https://github.com/HumbledDS/llm-rag-system",
    githubUrl: "https://github.com/HumbledDS",
    status: "Open Source",
    date: "2025",
    featured: false
  },
  
  {
    id: 4,
    title: "Computer Vision Analytics",
    description: "Advanced computer vision system for object detection and image analysis using deep learning.",
    image: "/images/projects/ComputerVision.jpg",
    technologies: ["Python", "OpenCV", "TensorFlow", "PyTorch", "Docker"],
    category: "AI/ML",
    demoUrl: "https://demo.humblebabs.com/computer-vision",
    // githubUrl: "https://github.com/HumbledDS/computer-vision-analytics",
    githubUrl: "https://github.com/HumbledDS",
    status: "Beta",
    date: "2024",
    featured: false
  },
  {
    id: 5,
    title: "Financial Data Analysis Platform",
    description: "Real-time financial data processing and analysis with predictive modeling capabilities.",
    image: "/images/projects/FinanceData.jpg",
    technologies: ["Python", "Pandas", "NumPy", "FastAPI", "PostgreSQL"],
    category: "Data",
    demoUrl: "https://demo.humblebabs.com/finance",
    // githubUrl: "https://github.com/HumbledDS/finance-analytics",
    githubUrl: "https://github.com/HumbledDS",
    status: "Beta",
    date: "2025",
    featured: false
  },
  {
    id: 6,
    title: "Data Visualization Suite",
    description: "Interactive data exploration tools with real-time updates and collaborative features.",
    image: "/images/projects/HowTo1.jpg",
    technologies: ["Vue.js", "D3.js", "WebSocket", "Node.js", "PostgreSQL"],
    category: "Data",
    demoUrl: "https://demo.humblebabs.com/dataviz",
    // githubUrl: "https://github.com/HumbledDS/data-viz-suite",
    githubUrl: "https://github.com/HumbledDS",
    status: "Beta",
    date: "2025",
    featured: false
  },
  
  {
    id: 7,
    title: "Cloud ML Pipeline",
    description: "Automated machine learning pipeline for model training, validation, and deployment on AWS.",
    image: "/images/projects/ml-pipeline.jpg",
    technologies: ["AWS", "Docker", "Python", "MLflow", "Kubernetes"],
    category: "Cloud",
    demoUrl: null,
    // githubUrl: "https://github.com/HumbledDS/cloud-ml-pipeline",
    githubUrl: "https://github.com/HumbledDS",
    status: "Open Source",
    date: "2025",
    featured: true
  },
  
]

// Function to get featured projects
export const getFeaturedProjects = () => {
  return projects.filter(project => project.featured)
}

// Function to get projects by category
export const getProjectsByCategory = (category: string) => {
  if (category === "All") return projects
  return projects.filter(project => project.category === category)
}

export const categories = ["All", "AI/ML", "Data", "Cloud"] 