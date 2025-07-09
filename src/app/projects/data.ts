export const projects = [
  {
    id: 1,
    title: "AI-Powered Analytics Dashboard",
    description: "Real-time analytics platform with machine learning predictions and interactive visualizations.",
    image: "/images/projects/DataScienceQualityScore.jpg",
    technologies: ["React", "Python", "TensorFlow", "D3.js", "AWS"],
    category: "AI/ML",
    demoUrl: "https://demo.humblebabs.com/analytics",
    githubUrl: "https://github.com/HumbledDS/analytics-dashboard",
    status: "Live",
    date: "2024",
    featured: true
  },
  {
    id: 2,
    title: "Cloud ML Pipeline",
    description: "Automated machine learning pipeline for model training, validation, and deployment on AWS.",
    image: "/images/projects/ml-pipeline.jpg",
    technologies: ["AWS", "Docker", "Python", "MLflow", "Kubernetes"],
    category: "Cloud",
    demoUrl: null,
    githubUrl: "https://github.com/HumbledDS/cloud-ml-pipeline",
    status: "Open Source",
    date: "2024",
    featured: true
  },
  {
    id: 3,
    title: "Data Visualization Suite",
    description: "Interactive data exploration tools with real-time updates and collaborative features.",
    image: "/images/projects/HowTo1.jpg",
    technologies: ["Vue.js", "D3.js", "WebSocket", "Node.js", "PostgreSQL"],
    category: "Data",
    demoUrl: "https://demo.humblebabs.com/dataviz",
    githubUrl: "https://github.com/HumbledDS/data-viz-suite",
    status: "Beta",
    date: "2023",
    featured: true
  },
  {
    id: 4,
    title: "Computer Vision Analytics",
    description: "Advanced computer vision system for object detection and image analysis using deep learning.",
    image: "/images/projects/ComputerVision.jpg",
    technologies: ["Python", "OpenCV", "TensorFlow", "PyTorch", "Docker"],
    category: "AI/ML",
    demoUrl: "https://demo.humblebabs.com/computer-vision",
    githubUrl: "https://github.com/HumbledDS/computer-vision-analytics",
    status: "Live",
    date: "2023",
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
    githubUrl: "https://github.com/HumbledDS/finance-analytics",
    status: "Live",
    date: "2023",
    featured: false
  },
  {
    id: 6,
    title: "LLM RAG Implementation",
    description: "Retrieval-Augmented Generation system for intelligent document processing and Q&A.",
    image: "/images/projects/LLMRagHowTo.jpg",
    technologies: ["Python", "LangChain", "OpenAI", "Pinecone", "FastAPI"],
    category: "AI/ML",
    demoUrl: null,
    githubUrl: "https://github.com/HumbledDS/llm-rag-system",
    status: "Open Source",
    date: "2022",
    featured: false
  }
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