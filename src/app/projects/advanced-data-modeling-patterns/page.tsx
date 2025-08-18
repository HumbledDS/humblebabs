"use client"
import { motion } from "framer-motion"
import { TutorialSection } from "@/components/projects/tutorial-section"
import { ImplementationChecklist } from "@/components/projects/implementation-checklist"
import { ArchitectureDiagram } from "@/components/projects/architecture-diagram"
import { ToolComparison } from "@/components/projects/tool-comparison"
import { Database, Star, Zap, Shield, TrendingUp, Code, BookOpen, Target, ArrowRight, CheckCircle, Lightbulb } from "lucide-react"

export default function AdvancedDataModelingPatternsPage() {
  const starSchemaSteps = [
    {
      id: 1,
      title: "Identify Business Processes and Facts",
      description: "Start by understanding the key business processes and identifying measurable facts that stakeholders need to analyze. These become your fact tables.",
      code: `-- Example: Sales Fact Table
CREATE TABLE fact_sales (
  sale_id INT PRIMARY KEY,
  product_id INT,
  customer_id INT,
  store_id INT,
  date_id INT,
  quantity INT,
  unit_price DECIMAL(10,2),
  total_amount DECIMAL(12,2),
  created_at TIMESTAMP
);`,
      language: "sql",
      tips: [
        "Focus on business metrics that drive decisions",
        "Ensure facts are additive (can be summed across dimensions)",
        "Include both atomic and derived facts when appropriate"
      ],
      warnings: [
        "Avoid storing calculated fields that can be derived from other facts",
        "Don't mix different levels of granularity in the same fact table"
      ]
    },
    {
      id: 2,
      title: "Design Dimension Tables",
      description: "Create dimension tables for each business context that provides context to your facts. Dimensions should be descriptive and contain business attributes.",
      code: `-- Example: Product Dimension
CREATE TABLE dim_product (
  product_id INT PRIMARY KEY,
  product_name VARCHAR(100),
  category VARCHAR(50),
  brand VARCHAR(50),
  color VARCHAR(30),
  size VARCHAR(20),
  is_active BOOLEAN,
  effective_date DATE,
  expiry_date DATE
);`,
      language: "sql",
      tips: [
        "Use surrogate keys for better performance and flexibility",
        "Include slowly changing dimension logic for historical tracking",
        "Keep dimensions normalized to reduce redundancy"
      ],
      warnings: [
        "Avoid over-normalizing dimensions - balance with query performance",
        "Don't create too many dimensions - aim for 5-15 per fact table"
      ]
    },
    {
      id: 3,
      title: "Implement Slowly Changing Dimensions (SCD)",
      description: "Handle changes in dimension attributes over time using SCD Type 2 (tracking history) or Type 1 (overwriting) based on business requirements.",
      code: `-- SCD Type 2 Implementation
CREATE TABLE dim_customer_scd2 (
  customer_key INT PRIMARY KEY,
  customer_id INT,
  customer_name VARCHAR(100),
  email VARCHAR(100),
  city VARCHAR(50),
  effective_date DATE,
  expiry_date DATE,
  is_current BOOLEAN,
  version INT
);

-- Insert new version when customer data changes
INSERT INTO dim_customer_scd2 
SELECT 
  nextval('customer_key_seq'),
  customer_id,
  customer_name,
  email,
  city,
  CURRENT_DATE as effective_date,
  '9999-12-31' as expiry_date,
  true as is_current,
  version + 1
FROM dim_customer_scd2 
WHERE customer_id = ? AND is_current = true;`,
      language: "sql",
      tips: [
        "Use Type 2 for attributes that affect historical analysis",
        "Implement Type 1 for corrections and non-business changes",
        "Consider Type 3 for limited history tracking when full history isn't needed"
      ],
      warnings: [
        "SCD Type 2 can significantly increase table size over time",
        "Ensure proper indexing on effective_date and expiry_date columns"
      ]
    }
  ]

  const dataVaultSteps = [
    {
      id: 1,
      title: "Design Hub Tables",
      description: "Create hub tables for each business entity. Hubs contain the business keys and minimal metadata, serving as the central reference point.",
      code: `-- Customer Hub
CREATE TABLE hub_customer (
  customer_hk CHAR(32) PRIMARY KEY, -- Hash key
  customer_id VARCHAR(50) UNIQUE NOT NULL, -- Business key
  load_date TIMESTAMP NOT NULL,
  record_source VARCHAR(100) NOT NULL
);

-- Product Hub
CREATE TABLE hub_product (
  product_hk CHAR(32) PRIMARY KEY,
  product_id VARCHAR(50) UNIQUE NOT NULL,
  load_date TIMESTAMP NOT NULL,
  record_source VARCHAR(100) NOT NULL
);`,
      language: "sql",
      tips: [
        "Use hash keys (MD5/SHA256) for consistent surrogate keys",
        "Keep hubs lean with only essential business keys and metadata",
        "Ensure business keys are unique and stable over time"
      ],
      warnings: [
        "Don't add business attributes to hub tables",
        "Avoid complex business logic in hub table design"
      ]
    },
    {
      id: 2,
      title: "Create Link Tables",
      description: "Design link tables to represent relationships between business entities. Links capture the many-to-many relationships and business events.",
      code: `-- Customer-Product Link (e.g., purchases)
CREATE TABLE link_customer_product (
  link_hk CHAR(32) PRIMARY KEY,
  customer_hk CHAR(32) NOT NULL,
  product_hk CHAR(32) NOT NULL,
  load_date TIMESTAMP NOT NULL,
  record_source VARCHAR(100) NOT NULL,
  FOREIGN KEY (customer_hk) REFERENCES hub_customer(customer_hk),
  FOREIGN KEY (product_hk) REFERENCES hub_product(product_hk)
);

-- Order Link
CREATE TABLE link_order (
  link_hk CHAR(32) PRIMARY KEY,
  order_hk CHAR(32) NOT NULL,
  customer_hk CHAR(32) NOT NULL,
  order_date_hk CHAR(32) NOT NULL,
  load_date TIMESTAMP NOT NULL,
  record_source VARCHAR(100) NOT NULL
);`,
      language: "sql",
      tips: [
        "Links should represent business relationships, not technical joins",
        "Use descriptive naming conventions for link tables",
        "Consider temporal aspects when designing links"
      ],
      warnings: [
        "Don't create links for simple 1:1 relationships",
        "Avoid over-normalizing relationships that don't add business value"
      ]
    },
    {
      id: 3,
      title: "Implement Satellite Tables",
      description: "Create satellite tables to store descriptive attributes and their changes over time. Satellites provide context and historical tracking.",
      code: `-- Customer Satellite
CREATE TABLE sat_customer (
  sat_hk CHAR(32) PRIMARY KEY,
  customer_hk CHAR(32) NOT NULL,
  customer_name VARCHAR(100),
  email VARCHAR(100),
  phone VARCHAR(20),
  address TEXT,
  load_date TIMESTAMP NOT NULL,
  load_end_date TIMESTAMP,
  record_source VARCHAR(100) NOT NULL,
  hash_diff CHAR(32) NOT NULL, -- For change detection
  FOREIGN KEY (customer_hk) REFERENCES hub_customer(customer_hk)
);

-- Product Satellite
CREATE TABLE sat_product (
  sat_hk CHAR(32) PRIMARY KEY,
  product_hk CHAR(32) NOT NULL,
  product_name VARCHAR(100),
  description TEXT,
  category VARCHAR(50),
  brand VARCHAR(50),
  price DECIMAL(10,2),
  load_date TIMESTAMP NOT NULL,
  load_end_date TIMESTAMP,
  record_source VARCHAR(100) NOT NULL,
  hash_diff CHAR(32) NOT NULL,
  FOREIGN KEY (product_hk) REFERENCES hub_product(product_hk)
);`,
      language: "sql",
      tips: [
        "Group related attributes in the same satellite for better performance",
        "Use hash_diff for efficient change detection",
        "Implement proper indexing on load_date and hash_diff columns"
      ],
      warnings: [
        "Don't mix different change frequencies in the same satellite",
        "Avoid storing calculated fields in satellites"
      ]
    }
  ]

  const graphModelingSteps = [
    {
      id: 1,
      title: "Identify Entity Types and Relationships",
      description: "Map out the different types of entities in your domain and the relationships between them. Focus on connections that provide business value.",
      code: `// Neo4j Cypher - Define entity types and relationships
// Create constraints for entity types
CREATE CONSTRAINT person_id IF NOT EXISTS FOR (p:Person) REQUIRE p.id IS UNIQUE;
CREATE CONSTRAINT company_id IF NOT EXISTS FOR (c:Company) REQUIRE c.id IS UNIQUE;
CREATE CONSTRAINT product_id IF NOT EXISTS FOR (p:Product) REQUIRE p.id IS UNIQUE;

// Create indexes for better performance
CREATE INDEX person_name IF NOT EXISTS FOR (p:Person) ON (p.name);
CREATE INDEX company_name IF NOT EXISTS FOR (c:Company) ON (c.name);`,
      language: "cypher",
      tips: [
        "Start with high-level entity types and refine as you go",
        "Consider both direct and indirect relationships",
        "Use descriptive relationship types that make queries intuitive"
      ],
      warnings: [
        "Don't over-engineer relationships - keep them simple and meaningful",
        "Avoid creating relationships for every possible connection"
      ]
    },
    {
      id: 2,
      title: "Design Property Schema",
      description: "Define the properties for each entity type, considering which attributes are essential for queries and which can be stored as properties vs. separate nodes.",
      code: `// Example: Person node with properties
CREATE (p:Person {
  id: "P001",
  name: "John Doe",
  email: "john.doe@email.com",
  age: 30,
  location: "New York",
  skills: ["Python", "Data Science", "Machine Learning"],
  created_at: datetime(),
  is_active: true
});

// Example: Company node with properties
CREATE (c:Company {
  id: "C001",
  name: "TechCorp",
  industry: "Technology",
  founded_year: 2010,
  employee_count: 500,
  revenue: 10000000,
  location: "San Francisco"
});`,
      language: "cypher",
      tips: [
        "Store frequently queried properties directly on nodes",
        "Use arrays for multi-valued properties when appropriate",
        "Include metadata like timestamps and source information"
      ],
      warnings: [
        "Don't store large text fields as properties - consider separate nodes",
        "Avoid storing calculated fields that can be derived from relationships"
      ]
    },
    {
      id: 3,
      title: "Implement Relationship Patterns",
      description: "Create relationships between entities using meaningful types and properties. Consider temporal aspects and relationship weights.",
      code: `// Create relationships with properties
MATCH (p:Person {id: "P001"}), (c:Company {id: "C001"})
CREATE (p)-[r:WORKS_FOR {
  role: "Data Scientist",
  start_date: date("2022-01-15"),
  is_current: true,
  department: "Engineering",
  salary: 120000
}]->(c);

// Create relationship between products and categories
MATCH (p:Product {id: "PRD001"}), (cat:Category {name: "Electronics"})
CREATE (p)-[:BELONGS_TO {
  confidence: 0.95,
  assigned_by: "system",
  assigned_date: datetime()
}]->(cat);

// Create temporal relationship for purchases
MATCH (p:Person {id: "P001"}), (prod:Product {id: "PRD001"})
CREATE (p)-[r:PURCHASED {
  purchase_date: datetime("2024-01-15T10:30:00"),
  quantity: 2,
  unit_price: 29.99,
  total_amount: 59.98,
  payment_method: "credit_card"
}]->(prod);`,
      language: "cypher",
      tips: [
        "Use descriptive relationship types that read naturally in queries",
        "Include temporal properties for time-based analysis",
        "Consider relationship weights for recommendation systems"
      ],
      warnings: [
        "Don't create too many relationship types - keep them focused",
        "Avoid storing business logic in relationship properties"
      ]
    }
  ]

  const implementationChecklist = [
    {
      id: "planning-1",
      title: "Assess Current Data Landscape",
      description: "Analyze existing data sources, quality, and relationships to understand what you're working with",
      category: "planning" as const,
      priority: "critical" as const,
      estimatedTime: "2-3 days",
      dependencies: []
    },
    {
      id: "planning-2",
      title: "Define Business Requirements",
      description: "Gather requirements from stakeholders to understand what questions the data model should answer",
      category: "planning" as const,
      priority: "critical" as const,
      estimatedTime: "1-2 weeks",
      dependencies: ["planning-1"]
    },
    {
      id: "planning-3",
      title: "Choose Modeling Approach",
      description: "Select between Star Schema, Data Vault, Graph, or hybrid approach based on requirements",
      category: "planning" as const,
      priority: "high" as const,
      estimatedTime: "3-5 days",
      dependencies: ["planning-2"]
    },
    {
      id: "implementation-1",
      title: "Design Conceptual Model",
      description: "Create high-level entity-relationship diagrams and define business concepts",
      category: "implementation" as const,
      priority: "high" as const,
      estimatedTime: "1 week",
      dependencies: ["planning-3"]
    },
    {
      id: "implementation-2",
      title: "Create Logical Model",
      description: "Transform conceptual model into detailed logical structures with attributes and relationships",
      category: "implementation" as const,
      priority: "high" as const,
      estimatedTime: "1-2 weeks",
      dependencies: ["implementation-1"]
    },
    {
      id: "implementation-3",
      title: "Implement Physical Model",
      description: "Create actual database tables, indexes, and constraints based on logical model",
      category: "implementation" as const,
      priority: "high" as const,
      estimatedTime: "2-3 weeks",
      dependencies: ["implementation-2"]
    },
    {
      id: "testing-1",
      title: "Data Quality Validation",
      description: "Test data integrity, completeness, and accuracy across the new model",
      category: "testing" as const,
      priority: "high" as const,
      estimatedTime: "1 week",
      dependencies: ["implementation-3"]
    },
    {
      id: "testing-2",
      title: "Performance Testing",
      description: "Validate query performance and optimize indexes and table structures",
      category: "testing" as const,
      priority: "medium" as const,
      estimatedTime: "3-5 days",
      dependencies: ["testing-1"]
    },
    {
      id: "deployment-1",
      title: "Data Migration",
      description: "Migrate existing data to the new model with proper validation and rollback plans",
      category: "deployment" as const,
      priority: "critical" as const,
      estimatedTime: "1-2 weeks",
      dependencies: ["testing-2"]
    },
    {
      id: "deployment-2",
      title: "User Training",
      description: "Train end users and analysts on the new data model and reporting tools",
      category: "deployment" as const,
      priority: "medium" as const,
      estimatedTime: "3-5 days",
      dependencies: ["deployment-1"]
    },
    {
      id: "monitoring-1",
      title: "Performance Monitoring",
      description: "Set up monitoring for query performance, data quality, and usage patterns",
      category: "monitoring" as const,
      priority: "medium" as const,
      estimatedTime: "2-3 days",
      dependencies: ["deployment-2"]
    },
    {
      id: "monitoring-2",
      title: "Model Evolution",
      description: "Establish processes for evolving the data model as business requirements change",
      category: "monitoring" as const,
      priority: "low" as const,
      estimatedTime: "Ongoing",
      dependencies: ["monitoring-1"]
    }
  ]

  const modelingDecisionTree = [
    {
      id: "start",
      title: "Data Modeling Approach Selection",
      description: "Choose the right data modeling approach based on your specific requirements and constraints",
      question: "What is your primary use case for data modeling?",
      options: [
        {
          id: "analytics",
          label: "Business Intelligence & Analytics",
          description: "You need to support complex reporting, dashboards, and ad-hoc analysis",
          nextNode: "analytics-requirements",
          pros: ["Excellent for complex queries and aggregations", "Mature ecosystem and tools", "Easy for business users to understand"],
          cons: ["Can be rigid for changing requirements", "May not handle real-time updates well", "Can become complex with many dimensions"],
          recommendation: "Consider Star Schema or Snowflake Schema"
        },
        {
          id: "operational",
          label: "Operational Data & Real-time Processing",
          description: "You need to support operational systems with real-time data updates",
          nextNode: "operational-requirements",
          pros: ["Handles real-time updates efficiently", "Flexible for changing requirements", "Good for operational reporting"],
          cons: ["More complex to implement", "Requires more technical expertise", "Can be harder to query for analytics"],
          recommendation: "Consider Data Vault or Operational Data Store"
        },
        {
          id: "graph",
          label: "Complex Relationships & Network Analysis",
          description: "You need to model complex relationships, hierarchies, or network structures",
          nextNode: "graph-requirements",
          pros: ["Natural for complex relationships", "Excellent for path analysis", "Flexible schema evolution"],
          cons: ["Different query paradigm", "May not scale as well for large datasets", "Fewer tools and expertise available"],
          recommendation: "Consider Graph Database or Hybrid approach"
        }
      ]
    },
    {
      id: "analytics-requirements",
      title: "Analytics Requirements Analysis",
      description: "Determine the specific analytics requirements to choose the best dimensional modeling approach",
      question: "What is the complexity of your dimensional analysis?",
      options: [
        {
          id: "simple-analytics",
          label: "Simple Dimensional Analysis",
          description: "Basic reporting with standard dimensions like time, product, customer",
          outcome: "Star Schema",
          pros: ["Simple to implement and understand", "Excellent performance for basic queries", "Easy to maintain"],
          cons: ["Limited flexibility for complex scenarios", "May not handle changing requirements well"],
          recommendation: "Implement a classic Star Schema with Type 1 SCDs"
        },
        {
          id: "complex-analytics",
          label: "Complex Dimensional Analysis",
          description: "Advanced analytics with multiple fact tables, conformed dimensions, and complex hierarchies",
          outcome: "Snowflake Schema",
          pros: ["Handles complex hierarchies well", "Reduces redundancy", "More normalized structure"],
          cons: ["More complex queries", "Harder to maintain", "Potential performance impact"],
          recommendation: "Use Snowflake Schema with proper indexing strategy"
        }
      ]
    },
    {
      id: "operational-requirements",
      title: "Operational Requirements Analysis",
      description: "Assess operational requirements to determine the best approach for real-time data handling",
      question: "How frequently does your data change?",
      options: [
        {
          id: "frequent-changes",
          label: "Frequent Data Changes",
          description: "Data changes multiple times per day with complex business rules",
          outcome: "Data Vault",
          pros: ["Excellent for complex, changing requirements", "Audit trail for all changes", "Flexible schema evolution"],
          cons: ["Complex to implement", "Requires specialized expertise", "More complex queries"],
          recommendation: "Implement Data Vault with proper satellite design"
        },
        {
          id: "moderate-changes",
          label: "Moderate Data Changes",
          description: "Data changes daily or weekly with relatively stable business rules",
          outcome: "Operational Data Store",
          pros: ["Good balance of flexibility and simplicity", "Easier to implement than Data Vault", "Good for operational reporting"],
          cons: ["May not handle extreme complexity well", "Limited audit trail capabilities"],
          recommendation: "Use Operational Data Store with change data capture"
        }
      ]
    },
    {
      id: "graph-requirements",
      title: "Graph Requirements Analysis",
      description: "Evaluate specific graph requirements to determine the best graph modeling approach",
      question: "What type of relationship analysis do you need?",
      options: [
        {
          id: "hierarchical",
          label: "Hierarchical & Tree Structures",
          description: "You need to model organizational hierarchies, product categories, or nested structures",
          outcome: "Hierarchical Graph Model",
          pros: ["Natural for tree structures", "Efficient for hierarchical queries", "Easy to traverse relationships"],
          cons: ["May not handle complex networks well", "Limited flexibility for non-hierarchical relationships"],
          recommendation: "Use hierarchical graph model with proper indexing"
        },
        {
          id: "network",
          label: "Network & Social Analysis",
          description: "You need to analyze networks, social connections, or complex many-to-many relationships",
          outcome: "Network Graph Model",
          pros: ["Excellent for complex networks", "Flexible relationship modeling", "Powerful for path analysis"],
          cons: ["More complex to design", "Requires graph-specific expertise", "May not scale as well for large datasets"],
          recommendation: "Implement network graph model with relationship properties"
        }
      ]
    }
  ]

  const databaseTools = [
    {
      id: "postgresql",
      name: "PostgreSQL",
      description: "Advanced open-source relational database with excellent support for complex data types and JSON",
      category: "relational",
      pricing: "free" as const,
      features: ["ACID Compliance", "JSON Support", "Advanced Indexing", "Partitioning", "Foreign Data Wrappers"],
      pros: ["Excellent ACID compliance", "Rich feature set", "Strong community", "Free and open source", "Excellent JSON support"],
      cons: ["Complex configuration", "Limited horizontal scaling", "Manual optimization required"],
      bestFor: ["Complex relational data", "JSON data alongside relational", "ACID compliance requirements", "Cost-conscious organizations"],
      notFor: ["Massive scale deployments", "Simple key-value storage", "Real-time analytics"],
      rating: 4.5,
      marketShare: "35.5",
      learningCurve: "medium" as const,
      community: "large" as const,
      documentation: "excellent" as const
    },
    {
      id: "snowflake",
      name: "Snowflake",
      description: "Cloud-native data warehouse with automatic scaling and separation of compute and storage",
      category: "Cloud Data Warehouse",
      pricing: "paid" as const,
      features: ["Auto-scaling", "Multi-cluster", "Time Travel", "Zero-copy Cloning", "Secure Data Sharing"],
      pros: ["Automatic scaling", "Excellent performance", "Multi-cloud support", "Built-in security", "Easy administration"],
      cons: ["Expensive for large datasets", "Vendor lock-in", "Limited customization"],
      bestFor: ["Large-scale analytics", "Multi-cloud strategies", "Organizations wanting managed service", "Complex data warehousing"],
      notFor: ["Small datasets", "Cost-sensitive projects", "Real-time operational systems"],
      rating: 4.8,
      marketShare: "18.2",
      learningCurve: "easy" as const,
      community: "large" as const,
      documentation: "excellent" as const
    },
    {
      id: "neo4j",
      name: "Neo4j",
      description: "Native graph database designed for storing and querying connected data",
      category: "Graph Database",
      pricing: "freemium" as const,
      features: ["Cypher Query Language", "ACID Compliance", "Graph Algorithms", "Visual Browser", "Enterprise Security"],
      pros: ["Native graph processing", "Excellent for relationships", "Rich ecosystem", "Good documentation", "Visual tools"],
      cons: ["Different query paradigm", "May not scale as well for large datasets", "Limited for traditional analytics"],
      bestFor: ["Complex relationships", "Network analysis", "Recommendation systems", "Social networks"],
      notFor: ["Traditional analytics", "Simple CRUD operations", "Large-scale data warehousing"],
      rating: 4.3,
      marketShare: "12.8",
      learningCurve: "medium" as const,
      community: "medium" as const,
      documentation: "good" as const
    },
    {
      id: "influxdb",
      name: "InfluxDB",
      description: "Time-series database optimized for storing and querying time-stamped data",
      category: "Time-Series",
      pricing: "freemium" as const,
      features: ["Time-series Optimization", "InfluxQL", "Flux Language", "Built-in Functions", "Retention Policies"],
      pros: ["Excellent for time-series data", "Built-in functions", "Good performance", "Easy to use", "Free tier available"],
      cons: ["Limited to time-series use cases", "Smaller community", "Less flexible than general-purpose databases"],
      bestFor: ["IoT data", "Monitoring systems", "Financial time-series", "Sensor data", "Metrics collection"],
      notFor: ["General-purpose applications", "Complex relational data", "Document storage"],
      rating: 4.1,
      marketShare: "8.5",
      learningCurve: "easy" as const,
      community: "medium" as const,
      documentation: "good" as const
    }
  ]

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
              Expert Level
            </span>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              Data Architecture
            </span>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Database className="w-4 h-4" />
              2025
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Advanced Data Modeling Patterns
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-4xl">
            Master enterprise-grade data modeling patterns and architectures for complex, scalable, and compliant data systems. 
            Learn to design robust data models that evolve with your business needs.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              <Code className="w-4 h-4" />
              View Implementation Guide
            </button>
            <button className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <Target className="w-4 h-4" />
              Learn More Patterns
            </button>
          </div>
        </motion.div>

        {/* Overview Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Why Advanced Data Modeling Matters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                In today's data-driven world, the foundation of any successful data strategy lies in robust, scalable, and maintainable data models. 
                Advanced data modeling patterns provide the architectural backbone for complex analytics, operational systems, and compliance requirements.
              </p>
              <p>
                This comprehensive guide covers the most important data modeling patterns used in production environments, 
                including detailed implementation examples, best practices, and real-world use cases.
              </p>
              <ul className="list-disc list-inside mt-4">
                <li>Star Schema for dimensional modeling</li>
                <li>Data Vault for enterprise warehousing</li>
                <li>Graph modeling for complex relationships</li>
                <li>Production-ready implementation examples</li>
              </ul>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold mb-4">Modeling Patterns</h3>
              <div className="flex flex-wrap gap-2">
                {["Star Schema", "Data Vault", "Graph Modeling", "SCD", "Normalization"].map((tech) => (
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

        {/* Tutorial Sections */}
        <div className="space-y-16">
          {/* Star Schema Tutorial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Star Schema Implementation Guide</h2>
            <div className="bg-card rounded-2xl border border-border p-8">
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Learn to implement the classic Star Schema pattern, the foundation of dimensional modeling for business intelligence and analytics. 
                This pattern organizes data into fact tables (measurable events) and dimension tables (contextual attributes).
              </p>
              <TutorialSection
                title="Star Schema Implementation Guide"
                description="Learn to implement the classic Star Schema pattern, the foundation of dimensional modeling for business intelligence and analytics. This pattern organizes data into fact tables (measurable events) and dimension tables (contextual attributes)."
                steps={starSchemaSteps}
                type="implementation"
                icon={BookOpen}
              />
            </div>
          </motion.div>

          {/* Data Vault Tutorial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Data Vault Architecture Implementation</h2>
            <div className="bg-card rounded-2xl border border-border p-8">
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Master the Data Vault methodology, designed for enterprise data warehousing with maximum flexibility and auditability. 
                This pattern uses hubs, links, and satellites to create a scalable and maintainable data architecture.
              </p>
              <TutorialSection
                title="Data Vault Architecture Implementation"
                description="Master the Data Vault methodology, designed for enterprise data warehousing with maximum flexibility and auditability. This pattern uses hubs, links, and satellites to create a scalable and maintainable data architecture."
                steps={dataVaultSteps}
                type="implementation"
                icon={Target}
              />
            </div>
          </motion.div>

          {/* Graph Modeling Tutorial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Graph Database Modeling Patterns</h2>
            <div className="bg-card rounded-2xl border border-border p-8">
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Explore graph database modeling for complex relationship analysis, recommendation systems, and network analysis. 
                Learn to design efficient graph schemas using Neo4j and other graph databases.
              </p>
              <TutorialSection
                title="Graph Database Modeling Patterns"
                description="Explore graph database modeling for complex relationship analysis, recommendation systems, and network analysis. Learn to design efficient graph schemas using Neo4j and other graph databases."
                steps={graphModelingSteps}
                type="implementation"
                icon={TrendingUp}
              />
            </div>
          </motion.div>
        </div>

        {/* Decision Tree */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Data Modeling Approach Decision Tree</h2>
          <div className="bg-card rounded-2xl border border-border p-8">
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Use this interactive decision tree to choose the right data modeling approach for your specific use case. 
              Answer a few questions to get personalized recommendations based on your requirements.
            </p>
            <ArchitectureDiagram
              title="Data Modeling Approach Decision Tree"
              description="Use this interactive decision tree to choose the right data modeling approach for your specific use case. Answer a few questions to get personalized recommendations based on your requirements."
              type="decision-tree"
              content={modelingDecisionTree}
            />
          </div>
        </motion.div>

        {/* Implementation Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Data Modeling Implementation Checklist</h2>
          <div className="bg-card rounded-2xl border border-border p-8">
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Follow this comprehensive checklist to ensure you cover all critical aspects of implementing advanced data modeling patterns. 
              Track your progress and prioritize tasks based on your project timeline.
            </p>
            <ImplementationChecklist
              title="Data Modeling Implementation Checklist"
              description="Follow this comprehensive checklist to ensure you cover all critical aspects of implementing advanced data modeling patterns. Track your progress and prioritize tasks based on your project timeline."
              items={implementationChecklist}
            />
          </div>
        </motion.div>

        {/* Tool Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Database Technology Comparison</h2>
          <div className="bg-card rounded-2xl border border-border p-8">
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Compare different database technologies and choose the right one for your data modeling needs. 
              Each tool has different strengths and is suited for different use cases.
            </p>
            <ToolComparison
              title="Database Technology Comparison"
              description="Compare different database technologies and choose the right one for your data modeling needs. Each tool has different strengths and is suited for different use cases."
              tools={databaseTools}
              features={[]}
            />
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-primary/5 to-blue-600/5 rounded-2xl border border-border p-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Data Architecture?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              You now have the knowledge and tools to implement advanced data modeling patterns. 
              Start with the implementation checklist and work through the tutorials step by step.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium">
                <Code className="w-5 h-5" />
                Download Implementation Guide
              </button>
              <button className="inline-flex items-center gap-2 px-8 py-4 border border-border rounded-xl hover:bg-muted/50 transition-colors font-medium">
                <Target className="w-5 h-5" />
                Schedule Architecture Review
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
