import { AIMLArchitecture, AIMLCategory } from "@/types"

export const aiMLArchitectures: AIMLArchitecture[] = [
  {
    id: "mlops-pipeline",
    name: "MLOps Pipeline",
    description: "End-to-end machine learning lifecycle management from data ingestion to model deployment and monitoring.",
    category: "MLOps",
    technologies: ["MLflow", "Kubeflow", "Airflow", "DVC", "Weights & Biases", "Seldon Core"],
    diagram: "/images/system-design/mlops.svg",
    tradeOffs: [
      {
        aspect: "Complexity",
        description: "High operational complexity and tooling",
        impact: "Negative"
      },
      {
        aspect: "Reproducibility",
        description: "Excellent experiment tracking and reproducibility",
        impact: "Positive"
      },
      {
        aspect: "Cost",
        description: "Infrastructure and tooling costs",
        impact: "Negative"
      }
    ],
    flowSteps: [
      {
        id: "data-ingestion",
        name: "Data Ingestion",
        description: "Collect and validate training data",
        technologies: ["Data Pipelines", "Data Validation", "Feature Engineering"],
        order: 1
      },
      {
        id: "experiment-tracking",
        name: "Experiment Tracking",
        description: "Track model experiments and hyperparameters",
        technologies: ["MLflow", "Weights & Biases", "DVC"],
        order: 2
      },
      {
        id: "model-training",
        name: "Model Training",
        description: "Train models with versioned data and code",
        technologies: ["Distributed Training", "Hyperparameter Tuning", "Model Registry"],
        order: 3
      },
      {
        id: "deployment",
        name: "Model Deployment",
        description: "Deploy models to production with monitoring",
        technologies: ["Seldon Core", "Kubernetes", "Model Serving"],
        order: 4
      }
    ],
    useCases: [
      "Production ML systems",
      "Large-scale model training",
      "Team collaboration",
      "Model versioning",
      "Continuous deployment"
    ],
    complexity: "High",
    performance: {
      latency: "Low (minutes to hours for training)",
      throughput: "High (parallel training)",
      scalability: "Excellent",
      reliability: "High",
      cost: "High"
    },
    pros: [
      "Reproducible experiments",
      "Automated workflows",
      "Team collaboration",
      "Model versioning",
      "Production deployment"
    ],
    cons: [
      "High complexity",
      "Tooling costs",
      "Operational overhead",
      "Learning curve",
      "Infrastructure management"
    ],
    whenToUse: [
      "Production ML systems",
      "Team collaboration",
      "Model versioning needs",
      "Automated workflows",
      "Large-scale training"
    ],
    alternatives: [
      "Manual workflows",
      "Simple scripts",
      "Cloud ML platforms",
      "Custom solutions"
    ]
  },
  {
    id: "model-serving-architecture",
    name: "Model Serving Architecture",
    description: "Scalable infrastructure for serving machine learning models in production with high availability and low latency.",
    category: "Model Serving",
    technologies: ["TensorFlow Serving", "TorchServe", "Seldon Core", "Kubernetes", "Redis", "Nginx"],
    diagram: "/images/system-design/model-serving.svg",
    tradeOffs: [
      {
        aspect: "Latency",
        description: "Optimized for low-latency inference",
        impact: "Positive"
      },
      {
        aspect: "Resource Usage",
        description: "Models loaded in memory for fast access",
        impact: "Negative"
      },
      {
        aspect: "Scalability",
        description: "Horizontal scaling with load balancing",
        impact: "Positive"
      }
    ],
    flowSteps: [
      {
        id: "request-reception",
        name: "Request Reception",
        description: "Receive inference requests via API",
        technologies: ["REST API", "gRPC", "GraphQL", "Load Balancer"],
        order: 1
      },
      {
        id: "preprocessing",
        name: "Data Preprocessing",
        description: "Transform input data for model consumption",
        technologies: ["Data Validation", "Feature Engineering", "Normalization"],
        order: 2
      },
      {
        id: "inference",
        name: "Model Inference",
        description: "Execute model prediction",
        technologies: ["Model Runtime", "GPU/CPU Optimization", "Batch Processing"],
        order: 3
      },
      {
        id: "postprocessing",
        name: "Post-processing",
        description: "Transform model output and return response",
        technologies: ["Output Formatting", "Confidence Scoring", "Response Caching"],
        order: 4
      }
    ],
    useCases: [
      "Real-time predictions",
      "Recommendation systems",
      "Computer vision APIs",
      "Natural language processing",
      "Fraud detection"
    ],
    complexity: "Medium to High",
    performance: {
      latency: "Very Low (milliseconds)",
      throughput: "Very High (thousands of requests/sec)",
      scalability: "Excellent",
      reliability: "High",
      cost: "Medium to High"
    },
    pros: [
      "Low latency inference",
      "High throughput",
      "Automatic scaling",
      "Model versioning",
      "A/B testing support"
    ],
    cons: [
      "Resource intensive",
      "Model loading overhead",
      "Complex deployment",
      "Monitoring challenges",
      "Cost optimization"
    ],
    whenToUse: [
      "Real-time inference",
      "High throughput requirements",
      "Production ML systems",
      "API-based ML services",
      "Low latency needs"
    ],
    alternatives: [
      "Batch processing",
      "Cloud ML services",
      "Edge deployment",
      "Custom serving"
    ]
  },
  {
    id: "feature-store-architecture",
    name: "Feature Store Architecture",
    description: "Centralized system for storing, managing, and serving machine learning features for training and inference.",
    category: "Feature Store",
    technologies: ["Feast", "Tecton", "Hopsworks", "Redis", "PostgreSQL", "Apache Kafka"],
    diagram: "/images/system-design/feature-store.svg",
    tradeOffs: [
      {
        aspect: "Data Consistency",
        description: "Ensures feature consistency across training and inference",
        impact: "Positive"
      },
      {
        aspect: "Complexity",
        description: "Additional infrastructure and operational overhead",
        impact: "Negative"
      },
      {
        aspect: "Performance",
        description: "Optimized feature retrieval for ML workloads",
        impact: "Positive"
      }
    ],
    flowSteps: [
      {
        id: "feature-computation",
        name: "Feature Computation",
        description: "Compute features from raw data sources",
        technologies: ["ETL Pipelines", "Feature Engineering", "Data Processing"],
        order: 1
      },
      {
        id: "feature-storage",
        name: "Feature Storage",
        description: "Store features in optimized storage systems",
        technologies: ["Online Store", "Offline Store", "Feature Registry"],
        order: 2
      },
      {
        id: "feature-serving",
        name: "Feature Serving",
        description: "Serve features for training and inference",
        technologies: ["Feature API", "Batch Serving", "Real-time Serving"],
        order: 3
      },
      {
        id: "feature-monitoring",
        name: "Feature Monitoring",
        description: "Monitor feature quality and drift",
        technologies: ["Data Quality", "Feature Drift", "Monitoring Dashboards"],
        order: 4
      }
    ],
    useCases: [
      "Large-scale ML systems",
      "Feature reuse across models",
      "Real-time feature serving",
      "Feature versioning",
      "Team collaboration"
    ],
    complexity: "High",
    performance: {
      latency: "Low (milliseconds for online, hours for offline)",
      throughput: "Very High (millions of features/sec)",
      scalability: "Excellent",
      reliability: "High",
      cost: "High"
    },
    pros: [
      "Feature consistency",
      "Feature reuse",
      "Real-time serving",
      "Feature versioning",
      "Data quality"
    ],
    cons: [
      "High complexity",
      "Infrastructure costs",
      "Operational overhead",
      "Learning curve",
      "Data governance"
    ],
    whenToUse: [
      "Multiple ML models",
      "Feature reuse needs",
      "Real-time serving",
      "Large feature sets",
      "Team collaboration"
    ],
    alternatives: [
      "Embedded features",
      "Custom solutions",
      "Database views",
      "Data pipelines"
    ]
  }
]

export const getAIMLArchitecturesByCategory = (category: AIMLCategory | "All") => {
  if (category === "All") return aiMLArchitectures
  return aiMLArchitectures.filter(architecture => architecture.category === category)
}

export const getAIMLArchitectureById = (id: string) => {
  return aiMLArchitectures.find(architecture => architecture.id === id)
}

export const aiMLCategories: AIMLCategory[] = [
  "MLOps",
  "Model Serving",
  "Feature Store",
  "A/B Testing",
  "Data Versioning",
  "Federated Learning"
]
