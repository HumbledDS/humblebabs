import { MicroserviceArchitecture, MicroserviceCategory } from "@/types"

export const microserviceArchitectures: MicroserviceArchitecture[] = [
  {
    id: "api-gateway-pattern",
    name: "API Gateway Pattern",
    description: "Centralized entry point that handles cross-cutting concerns like authentication, rate limiting, and routing for microservices.",
    category: "API Gateway",
    technologies: ["Kong", "AWS API Gateway", "Azure API Management", "Envoy", "Spring Cloud Gateway"],
    diagram: "/images/system-design/api-gateway.svg",
    tradeOffs: [
      {
        aspect: "Single Point of Failure",
        description: "Gateway failure affects all services",
        impact: "Negative"
      },
      {
        aspect: "Centralized Control",
        description: "Easier to manage security and policies",
        impact: "Positive"
      },
      {
        aspect: "Performance Overhead",
        description: "Additional latency for each request",
        impact: "Negative"
      }
    ],
    flowSteps: [
      {
        id: "request",
        name: "Client Request",
        description: "Client sends request to API Gateway",
        technologies: ["HTTP/HTTPS", "REST", "GraphQL"],
        order: 1
      },
      {
        id: "authentication",
        name: "Authentication & Authorization",
        description: "Validate JWT tokens and check permissions",
        technologies: ["JWT", "OAuth2", "RBAC"],
        order: 2
      },
      {
        id: "routing",
        name: "Request Routing",
        description: "Route request to appropriate microservice",
        technologies: ["Load Balancer", "Service Discovery", "Routing Rules"],
        order: 3
      },
      {
        id: "response",
        name: "Response Aggregation",
        description: "Aggregate responses from multiple services",
        technologies: ["Response Caching", "Data Transformation"],
        order: 4
      }
    ],
    useCases: [
      "Multi-service applications",
      "Mobile API backends",
      "Third-party integrations",
      "Legacy system modernization",
      "Multi-tenant applications"
    ],
    complexity: "Medium",
    performance: {
      latency: "Low (milliseconds)",
      throughput: "High (thousands of requests/sec)",
      scalability: "Excellent",
      reliability: "High",
      cost: "Medium"
    },
    pros: [
      "Centralized security management",
      "Simplified client integration",
      "Request/response transformation",
      "Rate limiting and throttling",
      "API versioning support"
    ],
    cons: [
      "Single point of failure",
      "Performance overhead",
      "Increased complexity",
      "Vendor lock-in risk",
      "Debugging challenges"
    ],
    whenToUse: [
      "Multiple microservices",
      "Need for centralized security",
      "API management requirements",
      "Client simplification needs",
      "Cross-cutting concerns"
    ],
    alternatives: [
      "Direct service communication",
      "Service mesh",
      "Backend for frontend",
      "GraphQL federation"
    ]
  },
  {
    id: "service-mesh-istio",
    name: "Service Mesh with Istio",
    description: "Infrastructure layer that handles service-to-service communication, security, and observability in microservices.",
    category: "Service Mesh",
    technologies: ["Istio", "Envoy Proxy", "Kubernetes", "Prometheus", "Grafana", "Jaeger"],
    diagram: "/images/system-design/service-mesh.svg",
    tradeOffs: [
      {
        aspect: "Complexity",
        description: "High operational complexity and learning curve",
        impact: "Negative"
      },
      {
        aspect: "Observability",
        description: "Excellent visibility into service communication",
        impact: "Positive"
      },
      {
        aspect: "Performance",
        description: "Minimal latency overhead with sidecar proxy",
        impact: "Positive"
      }
    ],
    flowSteps: [
      {
        id: "sidecar-injection",
        name: "Sidecar Injection",
        description: "Inject Envoy proxy alongside each service",
        technologies: ["Istio Operator", "Kubernetes Mutating Webhook"],
        order: 1
      },
      {
        id: "traffic-management",
        name: "Traffic Management",
        description: "Route traffic based on policies and rules",
        technologies: ["Virtual Services", "Destination Rules", "Traffic Splitting"],
        order: 2
      },
      {
        id: "security",
        name: "Security & Authentication",
        description: "Handle mTLS and service authentication",
        technologies: ["mTLS", "Service Accounts", "Authorization Policies"],
        order: 3
      },
      {
        id: "observability",
        name: "Observability",
        description: "Collect metrics, logs, and traces",
        technologies: ["Prometheus", "Jaeger", "Kiali"],
        order: 4
      }
    ],
    useCases: [
      "Complex microservices architectures",
      "Multi-cluster deployments",
      "Advanced traffic management",
      "Security-first applications",
      "Observability requirements"
    ],
    complexity: "High",
    performance: {
      latency: "Very Low (microseconds)",
      throughput: "Very High (millions of requests/sec)",
      scalability: "Excellent",
      reliability: "Very High",
      cost: "High"
    },
    pros: [
      "Advanced traffic management",
      "Built-in security features",
      "Comprehensive observability",
      "Policy-based control",
      "Multi-cluster support"
    ],
    cons: [
      "High complexity",
      "Resource overhead",
      "Steep learning curve",
      "Operational challenges",
      "Vendor lock-in"
    ],
    whenToUse: [
      "Large microservices deployments",
      "Complex traffic patterns",
      "Security requirements",
      "Multi-cluster needs",
      "Advanced observability"
    ],
    alternatives: [
      "API Gateway",
      "Direct service communication",
      "Simpler service mesh (Linkerd)",
      "Custom solutions"
    ]
  },
  {
    id: "event-driven-microservices",
    name: "Event-Driven Microservices",
    description: "Architecture where services communicate through asynchronous events, enabling loose coupling and scalability.",
    category: "Event-Driven",
    technologies: ["Apache Kafka", "RabbitMQ", "AWS SQS", "EventStore", "Apache Pulsar"],
    diagram: "/images/system-design/event-driven.svg",
    tradeOffs: [
      {
        aspect: "Eventual Consistency",
        description: "Data consistency challenges across services",
        impact: "Negative"
      },
      {
        aspect: "Scalability",
        description: "Excellent horizontal scalability",
        impact: "Positive"
      },
      {
        aspect: "Complexity",
        description: "Event ordering and replay complexity",
        impact: "Negative"
      }
    ],
    flowSteps: [
      {
        id: "event-production",
        name: "Event Production",
        description: "Services produce domain events",
        technologies: ["Event Publishers", "Domain Events", "Event Schema"],
        order: 1
      },
      {
        id: "event-storage",
        name: "Event Storage",
        description: "Events stored in event store/stream",
        technologies: ["Apache Kafka", "EventStore", "Message Queues"],
        order: 2
      },
      {
        id: "event-consumption",
        name: "Event Consumption",
        description: "Services consume and react to events",
        technologies: ["Event Handlers", "Event Consumers", "Event Processors"],
        order: 3
      },
      {
        id: "event-replay",
        name: "Event Replay",
        description: "Replay events for state reconstruction",
        technologies: ["Event Sourcing", "CQRS", "Projections"],
        order: 4
      }
    ],
    useCases: [
      "E-commerce order processing",
      "User activity tracking",
      "Real-time analytics",
      "IoT data processing",
      "Financial transactions"
    ],
    complexity: "High",
    performance: {
      latency: "Low (milliseconds to seconds)",
      throughput: "Very High (millions of events/sec)",
      scalability: "Excellent",
      reliability: "High",
      cost: "Medium to High"
    },
    pros: [
      "Loose coupling",
      "High scalability",
      "Fault tolerance",
      "Event replay capability",
      "Real-time processing"
    ],
    cons: [
      "Eventual consistency",
      "Event ordering complexity",
      "Debugging challenges",
      "Event versioning",
      "Storage growth"
    ],
    whenToUse: [
      "High throughput requirements",
      "Loose coupling needs",
      "Real-time processing",
      "Event sourcing",
      "Asynchronous workflows"
    ],
    alternatives: [
      "Synchronous communication",
      "API Gateway",
      "Message queues",
      "Event streaming"
    ]
  }
]

export const getMicroserviceArchitecturesByCategory = (category: MicroserviceCategory | "All") => {
  if (category === "All") return microserviceArchitectures
  return microserviceArchitectures.filter(architecture => architecture.category === category)
}

export const getMicroserviceArchitectureById = (id: string) => {
  return microserviceArchitectures.find(architecture => architecture.id === id)
}

export const microserviceCategories: MicroserviceCategory[] = [
  "API Gateway",
  "Service Mesh",
  "Event-Driven",
  "CQRS",
  "Saga Pattern",
  "Circuit Breaker"
]
