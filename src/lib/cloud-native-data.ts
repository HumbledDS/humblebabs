import { CloudNativeArchitecture, CloudNativeCategory } from "@/types"

export const cloudNativeArchitectures: CloudNativeArchitecture[] = [
  {
    id: "serverless-architecture",
    name: "Serverless Architecture",
    description: "Event-driven computing model where cloud providers manage infrastructure and automatically scale based on demand.",
    category: "Serverless",
    technologies: ["AWS Lambda", "Azure Functions", "Google Cloud Functions", "AWS Step Functions", "EventBridge"],
    diagram: "/images/system-design/serverless.svg",
    tradeOffs: [
      {
        aspect: "Cold Start Latency",
        description: "Initial function execution delay",
        impact: "Negative"
      },
      {
        aspect: "Cost Efficiency",
        description: "Pay only for actual execution time",
        impact: "Positive"
      },
      {
        aspect: "Vendor Lock-in",
        description: "Tightly coupled to cloud provider",
        impact: "Negative"
      }
    ],
    flowSteps: [
      {
        id: "event-trigger",
        title: "Event Trigger",
        description: "Function triggered by events (HTTP, S3, SQS)",
        technologies: ["API Gateway", "Event Sources", "Triggers"],
        order: 1
      },
      {
        id: "function-execution",
        title: "Function Execution",
        description: "Code executes in managed runtime",
        technologies: ["Lambda Runtime", "Container", "Custom Runtime"],
        order: 2
      },
      {
        id: "auto-scaling",
        title: "Auto-scaling",
        description: "Platform automatically scales based on load",
        technologies: ["Auto-scaling", "Concurrency Limits", "Provisioned Concurrency"],
        order: 3
      },
      {
        id: "result-return",
        title: "Result Return",
        description: "Function returns result or triggers other services",
        technologies: ["Response", "Event Sourcing", "Integration"],
        order: 4
      }
    ],
    useCases: [
      "Web APIs and microservices",
      "Data processing pipelines",
      "Scheduled tasks",
      "Real-time file processing",
      "IoT data processing"
    ],
    complexity: "Medium",
    performance: {
      latency: "Low (milliseconds, cold start excluded)",
      throughput: "High (scales automatically)",
      scalability: "Excellent",
      reliability: "High",
      cost: "Low to Medium"
    },
    pros: [
      "No server management",
      "Automatic scaling",
      "Pay-per-use pricing",
      "High availability",
      "Rapid deployment"
    ],
    cons: [
      "Cold start latency",
      "Vendor lock-in",
      "Limited execution time",
      "Debugging challenges",
      "Memory limitations"
    ],
    whenToUse: [
      "Event-driven workloads",
      "Variable traffic patterns",
      "Rapid prototyping",
      "Cost optimization",
      "Microservices"
    ],
    alternatives: [
      "Container-based deployment",
      "Traditional VMs",
      "Platform as a Service",
      "Self-hosted solutions"
    ]
  },
  {
    id: "kubernetes-orchestration",
    name: "Kubernetes Container Orchestration",
    description: "Open-source platform for automating deployment, scaling, and management of containerized applications.",
    category: "Container Orchestration",
    technologies: ["Kubernetes", "Docker", "Helm", "Prometheus", "Grafana", "Istio"],
    diagram: "/images/system-design/kubernetes.svg",
    tradeOffs: [
      {
        aspect: "Complexity",
        description: "Steep learning curve and operational overhead",
        impact: "Negative"
      },
      {
        aspect: "Portability",
        description: "Run anywhere with consistent behavior",
        impact: "Positive"
      },
      {
        aspect: "Resource Efficiency",
        description: "Better resource utilization than VMs",
        impact: "Positive"
      }
    ],
    flowSteps: [
      {
        id: "container-build",
        title: "Container Build",
        description: "Build and package application in containers",
        technologies: ["Docker", "BuildKit", "Multi-stage Builds"],
        order: 1
      },
      {
        id: "deployment",
        title: "Deployment",
        description: "Deploy containers using Kubernetes manifests",
        technologies: ["kubectl", "Helm Charts", "GitOps"],
        order: 2
      },
      {
        id: "orchestration",
        title: "Orchestration",
        description: "Kubernetes manages scheduling and scaling",
        technologies: ["Scheduler", "Auto-scaling", "Load Balancing"],
        order: 3
      },
      {
        id: "monitoring",
        title: "Monitoring & Management",
        description: "Monitor health and manage lifecycle",
        technologies: ["Prometheus", "Grafana", "Kubernetes Dashboard"],
        order: 4
      }
    ],
    useCases: [
      "Microservices applications",
      "High-availability systems",
      "Multi-cloud deployments",
      "DevOps automation",
      "Large-scale applications"
    ],
    complexity: "High",
    performance: {
      latency: "Very Low (microseconds)",
      throughput: "Very High (millions of requests/sec)",
      scalability: "Excellent",
      reliability: "Very High",
      cost: "Medium to High"
    },
    pros: [
      "Portability across clouds",
      "Automatic scaling",
      "Self-healing capabilities",
      "Rich ecosystem",
      "Industry standard"
    ],
    cons: [
      "High complexity",
      "Resource overhead",
      "Operational challenges",
      "Security considerations",
      "Learning curve"
    ],
    whenToUse: [
      "Containerized applications",
      "Multi-cloud strategy",
      "High availability needs",
      "DevOps automation",
      "Large-scale deployments"
    ],
    alternatives: [
      "Docker Swarm",
      "AWS ECS",
      "Azure Container Instances",
      "Traditional VMs"
    ]
  },
  {
    id: "multi-cloud-strategy",
    name: "Multi-Cloud Strategy",
    description: "Architecture that distributes applications across multiple cloud providers for redundancy, cost optimization, and vendor independence.",
    category: "Multi-Cloud",
    technologies: ["Terraform", "Kubernetes", "Istio", "CloudFlare", "HashiCorp Vault", "ArgoCD"],
    diagram: "/images/system-design/multi-cloud.svg",
    tradeOffs: [
      {
        aspect: "Complexity",
        description: "Increased operational complexity",
        impact: "Negative"
      },
      {
        aspect: "Vendor Independence",
        description: "Reduced lock-in to single provider",
        impact: "Positive"
      },
      {
        aspect: "Cost Optimization",
        description: "Leverage best pricing from each provider",
        impact: "Positive"
      }
    ],
    flowSteps: [
      {
        id: "abstraction-layer",
        title: "Abstraction Layer",
        description: "Create cloud-agnostic interfaces",
        technologies: ["Terraform", "Crossplane", "Cloud Provider APIs"],
        order: 1
      },
      {
        id: "deployment",
        title: "Multi-Cloud Deployment",
        description: "Deploy across multiple providers",
        technologies: ["Kubernetes", "ArgoCD", "GitOps"],
        order: 2
      },
      {
        id: "traffic-routing",
        title: "Traffic Routing",
        description: "Route traffic based on performance and cost",
        technologies: ["Global Load Balancer", "DNS", "CDN"],
        order: 3
      },
      {
        id: "monitoring",
        title: "Unified Monitoring",
        description: "Monitor across all cloud providers",
        technologies: ["Prometheus", "Grafana", "Jaeger"],
        order: 4
      }
    ],
    useCases: [
      "High availability requirements",
      "Cost optimization",
      "Vendor independence",
      "Geographic distribution",
      "Risk mitigation"
    ],
    complexity: "High",
    performance: {
      latency: "Low (optimized routing)",
      throughput: "Very High (distributed load)",
      scalability: "Excellent",
      reliability: "Very High",
      cost: "Medium to High"
    },
    pros: [
      "Vendor independence",
      "High availability",
      "Cost optimization",
      "Geographic distribution",
      "Risk mitigation"
    ],
    cons: [
      "High complexity",
      "Increased costs",
      "Operational overhead",
      "Security challenges",
      "Compliance complexity"
    ],
    whenToUse: [
      "Enterprise applications",
      "High availability needs",
      "Cost optimization goals",
      "Vendor independence",
      "Geographic distribution"
    ],
    alternatives: [
      "Single cloud provider",
      "Hybrid cloud",
      "On-premises deployment",
      "Edge computing"
    ]
  }
]

export const getCloudNativeArchitecturesByCategory = (category: CloudNativeCategory | "All") => {
  if (category === "All") return cloudNativeArchitectures
  return cloudNativeArchitectures.filter(architecture => architecture.category === category)
}

export const getCloudNativeArchitectureById = (id: string) => {
  return cloudNativeArchitectures.find(architecture => architecture.id === id)
}

export const cloudNativeCategories: CloudNativeCategory[] = [
  "Serverless",
  "Container Orchestration",
  "Event-Driven Cloud",
  "Multi-Cloud",
  "Edge Computing",
  "Cloud Databases"
]
