import { PipelineArchitecture, PipelineCategory } from "@/types"

export const pipelineArchitectures: PipelineArchitecture[] = [
  {
    id: "fintech-neobank-pipeline",
    name: "FinTech Neo-Bank Real-Time Pipeline",
    description: "High-performance real-time data pipeline for neo-banking with fraud detection, credit scoring, and regulatory compliance.",
    category: "Real-time Processing",
    technologies: ["Apache Kafka", "Apache Flink", "PostgreSQL", "Redis", "AWS", "Python", "Java"],
    diagram: "/images/system-design/fintech-neobank-pipeline.svg",
    tradeOffs: [
      {
        aspect: "Latency",
        description: "Ultra-low latency for fraud detection (<100ms)",
        impact: "Positive"
      },
      {
        aspect: "Compliance",
        description: "Complex regulatory requirements (PSD2, GDPR)",
        impact: "Negative"
      },
      {
        aspect: "Cost",
        description: "High infrastructure costs for real-time processing",
        impact: "Negative"
      }
    ],
    flowSteps: [
      {
        id: "real-time-ingestion",
        title: "Real-Time Data Ingestion",
        description: "Capture transaction data, user events, and external API feeds in real-time",
        technologies: ["Apache Kafka", "CDC", "REST APIs", "WebSockets"],
        order: 1
      },
      {
        id: "fraud-detection",
        title: "Real-Time Fraud Detection",
        description: "ML-based fraud detection with sub-100ms latency",
        technologies: ["Apache Flink", "ML Models", "Redis", "Feature Store"],
        order: 2
      },
      {
        id: "credit-scoring",
        title: "Dynamic Credit Scoring",
        description: "Real-time credit assessment using multiple data sources",
        technologies: ["ML Pipeline", "External APIs", "Risk Models"],
        order: 3
      },
      {
        id: "compliance-processing",
        title: "Regulatory Compliance",
        description: "PSD2, GDPR compliance with audit trails",
        technologies: ["Data Governance", "Audit Logs", "Encryption"],
        order: 4
      }
    ],
    useCases: [
      "Real-time fraud detection",
      "Dynamic credit scoring",
      "PSD2 open banking compliance",
      "GDPR data governance",
      "Real-time risk management"
    ],
    complexity: "High",
    performance: {
      latency: "Ultra-low (<100ms for fraud, <500ms for scoring)",
      throughput: "10K transactions/sec",
      scalability: "Excellent (5x growth in 18 months)",
      reliability: "99.95% availability",
      cost: "High (40K€/month)"
    },
    pros: [
      "Real-time fraud detection reducing losses from 0.1% to 0.02%",
      "Dynamic credit scoring with 30% higher acceptance rates",
      "Full regulatory compliance",
      "Scalable architecture for rapid growth"
    ],
    cons: [
      "High infrastructure costs",
      "Complex compliance requirements",
      "High operational complexity",
      "Requires specialized expertise"
    ],
    whenToUse: [
      "Neo-banking and fintech applications",
      "Real-time fraud detection requirements",
      "Regulatory compliance needs",
      "High-growth financial services"
    ],
    alternatives: [
      "Batch processing with real-time alerts",
      "Hybrid lambda architecture",
      "Event sourcing with CQRS"
    ]
  },
  {
    id: "etl-batch-pipeline",
    name: "ETL Batch Pipeline with Apache Airflow",
    description: "Traditional Extract, Transform, Load pipeline for processing large volumes of data in scheduled batches.",
    category: "Batch Processing",
    technologies: ["Apache Airflow", "Python", "PostgreSQL", "Pandas", "Docker"],
    diagram: "/images/system-design/etl-batch-pipeline.svg",
    tradeOffs: [
      {
        aspect: "Latency",
        description: "High latency due to batch processing",
        impact: "Negative"
      },
      {
        aspect: "Throughput",
        description: "High throughput for large datasets",
        impact: "Positive"
      },
      {
        aspect: "Cost",
        description: "Cost-effective for large data volumes",
        impact: "Positive"
      }
    ],
    flowSteps: [
      {
        id: "extract",
        title: "Data Extraction",
        description: "Extract data from various sources (databases, APIs, files)",
        technologies: ["Python", "SQL", "APIs"],
        order: 1
      },
      {
        id: "transform",
        title: "Data Transformation",
        description: "Clean, validate, and transform data according to business rules",
        technologies: ["Pandas", "NumPy", "Python"],
        order: 2
      },
      {
        id: "load",
        title: "Data Loading",
        description: "Load processed data into target data warehouse or database",
        technologies: ["PostgreSQL", "SQL", "Python"],
        order: 3
      }
    ],
    useCases: [
      "Data warehouse population",
      "Business intelligence reporting",
      "Historical data analysis",
      "Compliance reporting"
    ],
    complexity: "Medium",
    performance: {
      latency: "High (hours to days)",
      throughput: "High (GBs to TBs per batch)",
      scalability: "Good",
      reliability: "High",
      cost: "Low to Medium"
    },
    pros: [
      "Handles large data volumes efficiently",
      "Cost-effective for batch processing",
      "Reliable and well-established pattern",
      "Easy to monitor and debug"
    ],
    cons: [
      "High latency",
      "Not suitable for real-time requirements",
      "Complex error handling for failed batches",
      "Resource utilization spikes"
    ],
    whenToUse: [
      "Processing large historical datasets",
      "Non-time-critical data updates",
      "Cost-sensitive environments",
      "Traditional data warehousing"
    ],
    alternatives: [
      "Real-time streaming pipelines",
      "Hybrid lambda architecture",
      "Event-driven processing"
    ]
  },
  {
    id: "retail-legacy-migration-pipeline",
    name: "Retail Legacy Migration Pipeline",
    description: "Data pipeline for traditional retail transformation, migrating from legacy SAP systems to modern analytics platform.",
    category: "Batch Processing",
    technologies: ["Apache Airflow", "SAP ECC6", "PostgreSQL", "Python", "AWS Glue", "Tableau"],
    diagram: "/images/system-design/retail-legacy-migration-pipeline.svg",
    tradeOffs: [
      {
        aspect: "Migration Risk",
        description: "High risk due to legacy system complexity",
        impact: "Negative"
      },
      {
        aspect: "Cost Savings",
        description: "Significant long-term cost savings",
        impact: "Positive"
      },
      {
        aspect: "Timeline",
        description: "Long migration timeline (24 months)",
        impact: "Negative"
      }
    ],
    flowSteps: [
      {
        id: "sap-extraction",
        title: "SAP ECC6 Data Extraction",
        description: "Extract data from legacy SAP system during maintenance windows",
        technologies: ["SAP BW", "SAP Data Services", "Oracle", "Batch Jobs"],
        order: 1
      },
      {
        id: "data-harmonization",
        title: "Data Harmonization",
        description: "Standardize data formats across 850+ stores and multiple systems",
        technologies: ["Python", "Pandas", "Data Quality Tools"],
        order: 2
      },
      {
        id: "master-data-management",
        title: "Master Data Management",
        description: "Create unified product catalog with 8M SKUs and 50+ nomenclatures",
        technologies: ["MDM Platform", "Data Governance", "Reference Data"],
        order: 3
      },
      {
        id: "analytics-platform",
        title: "Modern Analytics Platform",
        description: "Build unified data warehouse for online/offline analytics",
        technologies: ["PostgreSQL", "Tableau", "Power BI", "Data Warehouse"],
        order: 4
      }
    ],
    useCases: [
      "Legacy system migration",
      "Multi-store retail analytics",
      "Inventory optimization",
      "Supply chain analytics",
      "Customer 360° view"
    ],
    complexity: "High",
    performance: {
      latency: "Medium (hourly updates for stock, daily for analytics)",
      throughput: "500GB/day processing",
      scalability: "Good (20% annual growth)",
      reliability: "99% availability",
      cost: "Medium (250K€/month)"
    },
    pros: [
      "30% reduction in stockouts (+120M€/an)",
      "2% increase in marketing conversion",
      "8% reduction in logistics costs",
      "Unified view of online/offline operations"
    ],
    cons: [
      "High migration risk",
      "Long implementation timeline",
      "Resistance to change",
      "Complex legacy system integration"
    ],
    whenToUse: [
      "Traditional retail digital transformation",
      "Legacy SAP system migration",
      "Multi-store retail operations",
      "Supply chain optimization needs"
    ],
    alternatives: [
      "Gradual migration approach",
      "Hybrid legacy/modern systems",
      "Cloud-based retail platforms",
      "Third-party retail analytics"
    ]
  },
  {
    id: "kafka-stream-processing",
    name: "Kafka Stream Processing Pipeline",
    description: "Real-time data processing pipeline using Apache Kafka for high-throughput, low-latency streaming applications.",
    category: "Real-time Processing",
    technologies: ["Apache Kafka", "Kafka Streams", "Java", "Docker", "Zookeeper"],
    diagram: "/images/system-design/kafka-stream-pipeline.svg",
    tradeOffs: [
      {
        aspect: "Latency",
        description: "Very low latency for real-time processing",
        impact: "Positive"
      },
      {
        aspect: "Complexity",
        description: "Higher complexity compared to batch processing",
        impact: "Negative"
      },
      {
        aspect: "Scalability",
        description: "Excellent horizontal scalability",
        impact: "Positive"
      }
    ],
    flowSteps: [
      {
        id: "ingest",
        title: "Data Ingestion",
        description: "Ingest data streams from various sources into Kafka topics",
        technologies: ["Kafka Connect", "Kafka Producers"],
        order: 1
      },
      {
        id: "process",
        title: "Stream Processing",
        description: "Process data streams in real-time using Kafka Streams",
        technologies: ["Kafka Streams", "Java"],
        order: 2
      },
      {
        id: "output",
        title: "Data Output",
        description: "Send processed results to downstream systems",
        technologies: ["Kafka Consumers", "Databases", "APIs"],
        order: 3
      }
    ],
    useCases: [
      "Real-time analytics",
      "Fraud detection",
      "Live dashboards",
      "IoT data processing",
      "Real-time recommendations"
    ],
    complexity: "High",
    performance: {
      latency: "Very Low (milliseconds to seconds)",
      throughput: "Very High (millions of events per second)",
      scalability: "Excellent",
      reliability: "High",
      cost: "Medium to High"
    },
    pros: [
      "Real-time processing capabilities",
      "High throughput and scalability",
      "Fault tolerance and reliability",
      "Rich ecosystem and community support"
    ],
    cons: [
      "Higher complexity and operational overhead",
      "More expensive than batch processing",
      "Requires specialized expertise",
      "Debugging can be challenging"
    ],
    whenToUse: [
      "Real-time data requirements",
      "High-throughput streaming applications",
      "Event-driven architectures",
      "Real-time analytics and monitoring"
    ],
    alternatives: [
      "Apache Flink",
      "Apache Storm",
      "AWS Kinesis",
      "Google Cloud Dataflow"
    ]
  },
  {
    id: "healthtech-hipaa-pipeline",
    name: "HealthTech HIPAA-Compliant Pipeline",
    description: "HIPAA-compliant data pipeline for telemedicine platforms with real-time medical alerts and predictive analytics.",
    category: "Real-time Processing",
    technologies: ["Apache Kafka", "Apache Flink", "PostgreSQL", "Redis", "AWS", "HIPAA Tools"],
    diagram: "/images/system-design/healthtech-hipaa-pipeline.svg",
    tradeOffs: [
      {
        aspect: "Compliance",
        description: "HIPAA compliance adds complexity but ensures patient safety",
        impact: "Positive"
      },
      {
        aspect: "Latency",
        description: "Critical medical alerts require sub-second latency",
        impact: "Positive"
      },
      {
        aspect: "Cost",
        description: "HIPAA compliance and real-time processing increase costs",
        impact: "Negative"
      }
    ],
    flowSteps: [
      {
        id: "hipaa-ingestion",
        title: "HIPAA-Compliant Data Ingestion",
        description: "Secure ingestion of patient data with encryption and access controls",
        technologies: ["Encrypted APIs", "TLS 1.3", "Access Controls", "Audit Logs"],
        order: 1
      },
      {
        id: "real-time-alerts",
        title: "Real-Time Medical Alerts",
        description: "Critical health alerts with <1 second latency for life-threatening conditions",
        technologies: ["Apache Flink", "ML Models", "Real-time Rules Engine"],
        order: 2
      },
      {
        id: "predictive-analytics",
        title: "Predictive Analytics",
        description: "ML-based risk prediction with 85% accuracy for preventive medicine",
        technologies: ["ML Pipeline", "Feature Store", "Model Serving"],
        order: 3
      },
      {
        id: "compliance-audit",
        title: "HIPAA Compliance & Audit",
        description: "Complete audit trail and compliance monitoring",
        technologies: ["Audit Logs", "Compliance Monitoring", "Data Governance"],
        order: 4
      }
    ],
    useCases: [
      "Telemedicine platforms",
      "Medical IoT monitoring",
      "Predictive healthcare",
      "Clinical research",
      "Patient safety monitoring"
    ],
    complexity: "High",
    performance: {
      latency: "Critical alerts <1s, risk scores <5s",
      throughput: "100K consultations/day",
      scalability: "Excellent (10x growth in 18 months)",
      reliability: "99.99% uptime (53min/year max)",
      cost: "Medium (50K$/month)"
    },
    pros: [
      "85% accuracy in medical risk prediction",
      "20% reduction in patient readmissions",
      "Full HIPAA compliance",
      "Real-time patient monitoring"
    ],
    cons: [
      "High compliance complexity",
      "Critical system reliability requirements",
      "Expensive infrastructure",
      "Complex regulatory landscape"
    ],
    whenToUse: [
      "Healthcare applications requiring HIPAA compliance",
      "Real-time medical monitoring",
      "Predictive healthcare analytics",
      "Telemedicine platforms"
    ],
    alternatives: [
      "Batch healthcare analytics",
      "On-premise healthcare systems",
      "Third-party HIPAA-compliant services",
      "Hybrid cloud healthcare solutions"
    ]
  },
  {
    id: "lambda-architecture",
    name: "Lambda Architecture",
    description: "Hybrid architecture combining batch and stream processing for both real-time and batch analytics with fault tolerance.",
    category: "Hybrid Architecture",
    technologies: ["Apache Spark", "Apache Kafka", "Apache Hadoop", "Apache Storm", "Docker"],
    diagram: "/images/system-design/lambda-architecture.svg",
    tradeOffs: [
      {
        aspect: "Data Consistency",
        description: "Eventually consistent data between batch and speed layers",
        impact: "Negative"
      },
      {
        aspect: "Complexity",
        description: "High operational complexity with two processing paths",
        impact: "Negative"
      },
      {
        aspect: "Fault Tolerance",
        description: "Excellent fault tolerance and data durability",
        impact: "Positive"
      }
    ],
    flowSteps: [
      {
        id: "batch-layer",
        title: "Batch Layer",
        description: "Process all historical data in batches for comprehensive analytics",
        technologies: ["Apache Hadoop", "Apache Spark", "HDFS"],
        order: 1
      },
      {
        id: "speed-layer",
        title: "Speed Layer",
        description: "Process real-time data streams for low-latency analytics",
        technologies: ["Apache Storm", "Apache Kafka", "Redis"],
        order: 2
      },
      {
        id: "serving-layer",
        title: "Serving Layer",
        description: "Merge batch and speed layer results for querying",
        technologies: ["Apache HBase", "Cassandra", "Elasticsearch"],
        order: 3
      }
    ],
    useCases: [
      "Big data analytics",
      "Real-time dashboards",
      "Machine learning pipelines",
      "Data warehousing",
      "Business intelligence"
    ],
    complexity: "High",
    performance: {
      latency: "Low (real-time) + High (batch)",
      throughput: "Very High (both layers)",
      scalability: "Excellent",
      reliability: "Very High",
      cost: "High"
    },
    pros: [
      "Handles both real-time and batch processing",
      "Excellent fault tolerance",
      "Scalable architecture",
      "Rich analytics capabilities"
    ],
    cons: [
      "High operational complexity",
      "Data consistency challenges",
      "Resource intensive",
      "Difficult to maintain"
    ],
    whenToUse: [
      "Large-scale data processing",
      "Real-time + batch analytics requirements",
      "Fault-tolerant systems",
      "Complex data pipelines"
    ],
    alternatives: [
      "Kappa Architecture",
      "Data Mesh",
      "Event Sourcing",
      "CQRS"
    ]
  },
  {
    id: "manufacturing-iot-pipeline",
    name: "Manufacturing IoT Industrial Pipeline",
    description: "Industrial IoT data pipeline for smart manufacturing with predictive maintenance and quality control.",
    category: "Real-time Processing",
    technologies: ["Apache Kafka", "Apache Flink", "InfluxDB", "Grafana", "OPC-UA", "Edge Computing"],
    diagram: "/images/system-design/manufacturing-iot-pipeline.svg",
    tradeOffs: [
      {
        aspect: "Latency",
        description: "Ultra-low latency for quality control (<100ms)",
        impact: "Positive"
      },
      {
        aspect: "Environment",
        description: "Hostile industrial environment requirements",
        impact: "Negative"
      },
      {
        aspect: "Reliability",
        description: "24/7 production with zero downtime tolerance",
        impact: "Positive"
      }
    ],
    flowSteps: [
      {
        id: "edge-ingestion",
        title: "Edge Data Ingestion",
        description: "Collect data from 50K sensors per factory at 100Hz sampling rate",
        technologies: ["OPC-UA", "Modbus", "Edge Gateways", "Local Processing"],
        order: 1
      },
      {
        id: "quality-control",
        title: "Real-Time Quality Control",
        description: "Inline quality control with <100ms latency for immediate defect rejection",
        technologies: ["Computer Vision", "ML Models", "Real-time Rules Engine"],
        order: 2
      },
      {
        id: "predictive-maintenance",
        title: "Predictive Maintenance",
        description: "ML-based maintenance prediction reducing downtime by 40%",
        technologies: ["Time Series Analysis", "Anomaly Detection", "ML Models"],
        order: 3
      },
      {
        id: "central-analytics",
        title: "Central Analytics & OEE",
        description: "Overall Equipment Effectiveness monitoring across 15 factories",
        technologies: ["Data Warehouse", "OLAP Cubes", "Business Intelligence"],
        order: 4
      }
    ],
    useCases: [
      "Smart manufacturing",
      "Predictive maintenance",
      "Quality control",
      "Energy optimization",
      "Digital twin implementation"
    ],
    complexity: "High",
    performance: {
      latency: "Quality control <100ms, maintenance alerts <1s",
      throughput: "750GB/day across 15 factories",
      scalability: "Excellent (25 factories in 3 years)",
      reliability: "99.9% uptime (zero downtime tolerance)",
      cost: "Medium (40K€/month)"
    },
    pros: [
      "40% reduction in production downtime",
      "20% energy optimization",
      "Zero-defect manufacturing (PPM <10)",
      "Real-time quality control"
    ],
    cons: [
      "Hostile environment requirements",
      "Complex IT/OT integration",
      "High sensor maintenance costs",
      "Legacy equipment integration challenges"
    ],
    whenToUse: [
      "Industrial IoT applications",
      "Smart manufacturing",
      "Predictive maintenance",
      "Quality control systems"
    ],
    alternatives: [
      "Traditional scheduled maintenance",
      "Reactive maintenance",
      "Manual quality control",
      "On-premise industrial systems"
    ]
  },
  {
    id: "aws-glue-pipeline",
    name: "AWS Glue ETL Pipeline",
    description: "Serverless ETL pipeline using AWS Glue for data transformation and loading with automatic schema discovery.",
    category: "Cloud-Native",
    technologies: ["AWS Glue", "AWS S3", "AWS Redshift", "Python", "Apache Spark"],
    diagram: "/images/system-design/aws-glue-pipeline.svg",
    tradeOffs: [
      {
        aspect: "Cost",
        description: "Pay-per-use pricing, can be expensive for large datasets",
        impact: "Negative"
      },
      {
        aspect: "Scalability",
        description: "Automatic scaling based on data volume and complexity",
        impact: "Positive"
      },
      {
        aspect: "Vendor Lock-in",
        description: "Tightly coupled to AWS ecosystem",
        impact: "Negative"
      }
    ],
    flowSteps: [
      {
        id: "catalog",
        title: "Data Catalog",
        description: "Automatically discover and catalog data sources",
        technologies: ["AWS Glue Data Catalog", "AWS Glue Crawler"],
        order: 1
      },
      {
        id: "etl-job",
        title: "ETL Job",
        description: "Transform data using serverless Spark jobs",
        technologies: ["AWS Glue ETL", "Apache Spark", "Python"],
        order: 2
      },
      {
        id: "target",
        title: "Target Storage",
        description: "Load processed data to data warehouse or data lake",
        technologies: ["AWS Redshift", "AWS S3", "AWS RDS"],
        order: 3
      }
    ],
    useCases: [
      "Data lake ETL",
      "Data warehouse population",
      "Real-time data processing",
      "Schema evolution",
      "Data migration"
    ],
    complexity: "Medium",
    performance: {
      latency: "Medium (minutes to hours)",
      throughput: "High (scales automatically)",
      scalability: "Excellent",
      reliability: "High",
      cost: "Medium to High"
    },
    pros: [
      "Serverless and fully managed",
      "Automatic scaling",
      "Built-in data catalog",
      "Integration with AWS services"
    ],
    cons: [
      "AWS vendor lock-in",
      "Limited customization",
      "Can be expensive",
      "Debugging challenges"
    ],
    whenToUse: [
      "AWS-based data infrastructure",
      "Serverless architecture preference",
      "Managed ETL requirements",
      "Rapid prototyping"
    ],
    alternatives: [
      "Azure Data Factory",
      "Google Cloud Dataflow",
      "Apache Airflow on EKS",
      "Self-hosted solutions"
    ]
  },
  {
    id: "event-sourcing-pipeline",
    name: "Event Sourcing Pipeline",
    description: "Event-driven architecture that stores all changes as a sequence of events for audit trails and temporal queries.",
    category: "Event-Driven",
    technologies: ["Apache Kafka", "EventStore", "PostgreSQL", "Node.js", "Redis"],
    diagram: "/images/system-design/event-sourcing-pipeline.svg",
    tradeOffs: [
      {
        aspect: "Storage",
        description: "Efficient storage and retrieval of event sequences",
        impact: "Positive"
      },
      {
        aspect: "Complexity",
        description: "Complex event replay and state reconstruction",
        impact: "Negative"
      },
      {
        aspect: "Audit Trail",
        description: "Complete audit trail of all system changes",
        impact: "Positive"
      }
    ],
    flowSteps: [
      {
        id: "event-capture",
        title: "Event Capture",
        description: "Capture all domain events from business operations",
        technologies: ["Event Store", "Apache Kafka", "Message Queues"],
        order: 1
      },
      {
        id: "event-storage",
        title: "Event Storage",
        description: "Store events in append-only event log",
        technologies: ["EventStore", "PostgreSQL", "Apache Kafka"],
        order: 2
      },
      {
        id: "projection",
        title: "Projection",
        description: "Build read models from event streams",
        technologies: ["Node.js", "Redis", "Elasticsearch"],
        order: 3
      }
    ],
    useCases: [
      "Audit and compliance",
      "Temporal data analysis",
      "Business process tracking",
      "System state reconstruction",
      "Event-driven microservices"
    ],
    complexity: "High",
    performance: {
      latency: "Low (event capture) + Medium (projections)",
      throughput: "High (event streaming)",
      scalability: "Excellent",
      reliability: "Very High",
      cost: "Medium to High"
    },
    pros: [
      "Complete audit trail",
      "Temporal queries",
      "Scalable event processing",
      "Decoupled architecture"
    ],
    cons: [
      "Complex event replay",
      "Event versioning challenges",
      "Storage growth over time",
      "Learning curve"
    ],
    whenToUse: [
      "Audit requirements",
      "Temporal data needs",
      "Event-driven systems",
      "Complex business processes"
    ],
    alternatives: [
      "CQRS",
      "Traditional CRUD",
      "Event streaming",
      "Change data capture"
    ]
  },
  {
    id: "media-streaming-pipeline",
    name: "Media Streaming Analytics Pipeline",
    description: "High-throughput streaming pipeline for video platforms with real-time recommendations and anti-piracy detection.",
    category: "Real-time Processing",
    technologies: ["Apache Kafka", "Apache Flink", "MongoDB", "Redis", "Elasticsearch", "CDN Analytics"],
    diagram: "/images/system-design/media-streaming-pipeline.svg",
    tradeOffs: [
      {
        aspect: "Latency",
        description: "Ultra-low latency for recommendations (<100ms)",
        impact: "Positive"
      },
      {
        aspect: "Bandwidth",
        description: "High bandwidth costs for video streaming",
        impact: "Negative"
      },
      {
        aspect: "Global Scale",
        description: "Multi-country deployment with regulatory challenges",
        impact: "Negative"
      }
    ],
    flowSteps: [
      {
        id: "viewing-events",
        title: "Viewing Event Collection",
        description: "Capture 500M viewing events per day from 15M subscribers",
        technologies: ["Apache Kafka", "Mobile SDKs", "Web Analytics", "CDN Logs"],
        order: 1
      },
      {
        id: "real-time-recommendations",
        title: "Real-Time Recommendations",
        description: "Personalized content recommendations with <100ms latency",
        technologies: ["ML Models", "Collaborative Filtering", "Real-time Features"],
        order: 2
      },
      {
        id: "anti-piracy-detection",
        title: "Anti-Piracy Detection",
        description: "Real-time piracy detection with <5 minute takedown",
        technologies: ["Video Fingerprinting", "ML Detection", "Automated Takedown"],
        order: 3
      },
      {
        id: "cdn-optimization",
        title: "CDN Optimization",
        description: "Bandwidth optimization reducing costs by 30%",
        technologies: ["CDN Analytics", "Bandwidth Optimization", "Quality Adaptation"],
        order: 4
      }
    ],
    useCases: [
      "Video streaming platforms",
      "Content recommendation",
      "Anti-piracy protection",
      "CDN optimization",
      "User behavior analytics"
    ],
    complexity: "High",
    performance: {
      latency: "Recommendations <100ms, piracy detection <5min",
      throughput: "2TB/day, 50K events/sec peak",
      scalability: "Excellent (50% annual growth)",
      reliability: "99.95% API availability",
      cost: "High (200K$/month)"
    },
    pros: [
      "40% increase in watch time",
      "25% reduction in churn",
      "30% reduction in bandwidth costs",
      "Real-time content intelligence"
    ],
    cons: [
      "High bandwidth costs",
      "Complex multi-country compliance",
      "Peak load unpredictability",
      "Device compatibility challenges"
    ],
    whenToUse: [
      "Video streaming platforms",
      "Content recommendation systems",
      "Multi-country media services",
      "High-scale user analytics"
    ],
    alternatives: [
      "Batch content analysis",
      "Third-party recommendation services",
      "Traditional CDN services",
      "On-premise media platforms"
    ]
  },
  {
    id: "insurance-olap-pipeline",
    name: "Insurance OLAP Analytics Pipeline",
    description: "Massive OLAP data pipeline for insurance companies with actuarial modeling, regulatory reporting, and cross-product analytics.",
    category: "Batch Processing",
    technologies: ["Snowflake", "Apache Spark", "Python", "R", "Tableau", "Power BI"],
    diagram: "/images/system-design/insurance-olap-pipeline.svg",
    tradeOffs: [
      {
        aspect: "Data Volume",
        description: "Massive historical data (200TB) with complex OLAP requirements",
        impact: "Negative"
      },
      {
        aspect: "Analytics Depth",
        description: "Deep actuarial analysis and regulatory compliance",
        impact: "Positive"
      },
      {
        aspect: "Cost",
        description: "High infrastructure costs for massive data processing",
        impact: "Negative"
      }
    ],
    flowSteps: [
      {
        id: "multi-country-ingestion",
        title: "Multi-Country Data Ingestion",
        description: "Consolidate data from 25 core insurance systems across different countries",
        technologies: ["ETL Pipelines", "Data Integration", "Oracle", "DB2", "SQL Server"],
        order: 1
      },
      {
        id: "actuarial-modeling",
        title: "Actuarial Modeling & Calculations",
        description: "Complex actuarial calculations including provisions, IBNR, and chain ladder analysis",
        technologies: ["R", "Python", "Actuarial Models", "Monte Carlo Simulations"],
        order: 2
      },
      {
        id: "regulatory-reporting",
        title: "Regulatory Reporting (Solvency II)",
        description: "Automated regulatory reporting for 30 countries with compliance monitoring",
        technologies: ["Compliance Engine", "Regulatory Frameworks", "Audit Trails"],
        order: 3
      },
      {
        id: "olap-cubes",
        title: "OLAP Cubes & Analytics",
        description: "Multi-dimensional analysis across geography, product, channel, and time dimensions",
        technologies: ["Snowflake", "OLAP Cubes", "Business Intelligence", "Tableau"],
        order: 4
      }
    ],
    useCases: [
      "Cross-product insurance analytics",
      "Actuarial modeling and risk assessment",
      "Regulatory compliance reporting",
      "Customer 360° analytics",
      "Fraud detection and prevention"
    ],
    complexity: "High",
    performance: {
      latency: "Dashboards <3s, ad-hoc queries <30s, batch simulations overnight",
      throughput: "1TB/day processing, 200TB historical data",
      scalability: "Excellent (30% annual growth)",
      reliability: "99.95% availability",
      cost: "High (5M€/year)"
    },
    pros: [
      "8% increase in profitability through dynamic pricing",
      "25% increase in cross-selling through 360° customer view",
      "Automated regulatory reporting (200 people/month savings)",
      "15% reduction in loss provisions through predictive analytics"
    ],
    cons: [
      "High infrastructure costs",
      "Complex multi-country compliance",
      "Long implementation timeline (18 months)",
      "Requires specialized actuarial expertise"
    ],
    whenToUse: [
      "Large insurance companies",
      "Multi-country insurance operations",
      "Complex actuarial modeling needs",
      "Regulatory compliance requirements"
    ],
    alternatives: [
      "Traditional data marts",
      "On-premise data warehouses",
      "Third-party insurance analytics",
      "Cloud-based insurance platforms"
    ]
  },
  {
    id: "trading-platform-pipeline",
    name: "High-Frequency Trading Analytics Pipeline",
    description: "Ultra-low latency data pipeline for retail trading platforms with real-time risk management and compliance monitoring.",
    category: "Real-time Processing",
    technologies: ["Apache Pinot", "TimescaleDB", "CockroachDB", "Redis", "GPU Computing"],
    diagram: "/images/system-design/trading-platform-pipeline.svg",
    tradeOffs: [
      {
        aspect: "Latency",
        description: "Ultra-low latency (<100ms) for risk calculations",
        impact: "Positive"
      },
      {
        aspect: "Cost",
        description: "Expensive infrastructure for high-frequency trading",
        impact: "Negative"
      },
      {
        aspect: "Compliance",
        description: "Strict regulatory requirements with audit trails",
        impact: "Negative"
      }
    ],
    flowSteps: [
      {
        id: "market-data-ingestion",
        title: "Real-Time Market Data Ingestion",
        description: "Process 100K market updates per second for equities, options, and crypto",
        technologies: ["Market Data Feeds", "High-Speed Networks", "Data Normalization"],
        order: 1
      },
      {
        id: "risk-calculation",
        title: "Real-Time Risk Calculation",
        description: "Calculate risk metrics including VaR, Greeks, and margin requirements",
        technologies: ["GPU Computing", "Risk Models", "Real-time Analytics"],
        order: 2
      },
      {
        id: "position-aggregation",
        title: "Portfolio Position Aggregation",
        description: "Real-time aggregation of 5M portfolios with microsecond precision",
        technologies: ["In-Memory Computing", "Distributed Databases", "Real-time OLAP"],
        order: 3
      },
      {
        id: "compliance-monitoring",
        title: "Compliance & Regulatory Reporting",
        description: "Real-time compliance monitoring and automated regulatory reporting",
        technologies: ["Compliance Engine", "Audit Trails", "Regulatory APIs"],
        order: 4
      }
    ],
    useCases: [
      "Retail trading platforms",
      "High-frequency trading",
      "Risk management",
      "Portfolio analytics",
      "Regulatory compliance"
    ],
    complexity: "High",
    performance: {
      latency: "Risk calculations <100ms, positions real-time, P&L streaming",
      throughput: "10M orders/day, 100K concurrent users",
      scalability: "Excellent (10x growth during volatility)",
      reliability: "99.99% uptime (zero data loss tolerance)",
      cost: "Very High (500K$/month)"
    },
    pros: [
      "Prevention of systemic margin calls",
      "50% increase in user engagement",
      "Automated regulatory compliance",
      "Real-time risk monitoring"
    ],
    cons: [
      "Extremely expensive infrastructure",
      "Complex regulatory landscape",
      "High operational risk",
      "Requires specialized trading expertise"
    ],
    whenToUse: [
      "Retail trading platforms",
      "High-frequency trading systems",
      "Real-time risk management",
      "Compliance-heavy financial applications"
    ],
    alternatives: [
      "Traditional batch risk calculations",
      "Third-party trading platforms",
      "On-premise trading systems",
      "Cloud-based trading solutions"
    ]
  }
]

export const getPipelineArchitecturesByCategory = (category: PipelineCategory | "All") => {
  if (category === "All") return pipelineArchitectures
  return pipelineArchitectures.filter(architecture => architecture.category === category)
}

export const getPipelineArchitectureById = (id: string) => {
  return pipelineArchitectures.find(architecture => architecture.id === id)
}

export const pipelineCategories: PipelineCategory[] = [
  "Batch Processing",
  "Real-time Processing", 
  "Hybrid Architecture",
  "Cloud-Native",
  "Event-Driven",
  "Stream Processing"
]
