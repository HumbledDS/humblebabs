import { Metadata } from 'next'
import { TutorialSection } from '@/components/projects/tutorial-section'
import { ImplementationChecklist } from '@/components/projects/implementation-checklist'
import { ArchitectureDiagram } from '@/components/projects/architecture-diagram'
import { ToolComparison } from '@/components/projects/tool-comparison'
import { 
  TrendingUp, 
  Shield, 
  Database, 
  BarChart3, 
  Zap,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Insurance OLAP Analytics Pipeline - System Design',
  description: 'Comprehensive guide to building OLAP analytics pipelines for insurance companies with regulatory compliance and real-time reporting capabilities.',
}

export default function InsuranceOLAPPipelinePage() {
  const tutorialSteps = [
    {
      title: "Insurance Data Modeling Strategy",
      description: "Design a comprehensive data model that supports both operational and analytical workloads for insurance operations.",
      icon: Database,
      content: `
        ## Core Insurance Data Model
        
        ### Fact Tables
        - **Claims Fact**: claim_id, policy_id, claim_amount, claim_date, settlement_date
        - **Premium Fact**: policy_id, premium_amount, payment_date, coverage_period
        - **Risk Assessment Fact**: policy_id, risk_score, assessment_date, underwriter_id
        
        ### Dimension Tables
        - **Policy Dimension**: policy_id, policy_type, coverage_details, start_date, end_date
        - **Customer Dimension**: customer_id, demographics, risk_profile, contact_info
        - **Product Dimension**: product_id, product_name, coverage_type, premium_rate
        - **Time Dimension**: date_key, year, quarter, month, day_of_week
        
        ### Key Relationships
        - One-to-Many: Customer → Policies
        - Many-to-Many: Policies ↔ Coverage Types (via bridge table)
        - Hierarchical: Geographic regions, product categories
      `,
      codeBlock: {
        language: 'sql',
        code: `-- Insurance Star Schema
CREATE TABLE fact_claims (
    claim_id BIGINT PRIMARY KEY,
    policy_id BIGINT,
    claim_amount DECIMAL(15,2),
    claim_date DATE,
    settlement_date DATE,
    claim_status VARCHAR(50),
    claim_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dim_policy (
    policy_id BIGINT PRIMARY KEY,
    customer_id BIGINT,
    product_id BIGINT,
    policy_number VARCHAR(50),
    start_date DATE,
    end_date DATE,
    premium_amount DECIMAL(15,2),
    coverage_amount DECIMAL(15,2),
    status VARCHAR(20)
);

CREATE TABLE dim_customer (
    customer_id BIGINT PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    risk_profile VARCHAR(20),
    credit_score INTEGER,
    address_id BIGINT
);

-- Create indexes for OLAP performance
CREATE INDEX idx_claims_policy_date ON fact_claims(policy_id, claim_date);
CREATE INDEX idx_claims_amount ON fact_claims(claim_amount);
CREATE INDEX idx_policy_customer ON dim_policy(customer_id);`
      }
    },
    {
      title: "OLAP Cube Design",
      description: "Design multi-dimensional data structures for complex insurance analytics and reporting.",
      icon: BarChart3,
      content: `
        ## OLAP Cube Dimensions
        
        ### Primary Dimensions
        1. **Time**: Year, Quarter, Month, Week, Day
        2. **Geography**: Country, State, City, Postal Code
        3. **Product**: Product Line, Coverage Type, Policy Term
        4. **Customer**: Age Group, Risk Profile, Customer Segment
        5. **Claims**: Claim Type, Severity, Status
        
        ### Key Measures
        - Total Premiums
        - Claims Frequency
        - Loss Ratio
        - Average Claim Amount
        - Customer Lifetime Value
        - Risk Score Distribution
        
        ### Aggregation Levels
        - Daily → Weekly → Monthly → Quarterly → Yearly
        - Individual → Household → Region → National
        - Policy → Product Line → Business Unit → Company
      `,
      codeBlock: {
        language: 'sql',
        code: `-- OLAP Cube Views
CREATE VIEW v_claims_analytics AS
SELECT 
    DATE_TRUNC('month', c.claim_date) as month,
    p.product_line,
    p.coverage_type,
    c.claim_type,
    COUNT(*) as claim_count,
    SUM(c.claim_amount) as total_claims,
    AVG(c.claim_amount) as avg_claim_amount,
    SUM(c.claim_amount) / NULLIF(SUM(p.premium_amount), 0) as loss_ratio
FROM fact_claims c
JOIN dim_policy p ON c.policy_id = p.policy_id
GROUP BY 
    DATE_TRUNC('month', c.claim_date),
    p.product_line,
    p.coverage_type,
    c.claim_type;

-- Materialized view for performance
CREATE MATERIALIZED VIEW mv_monthly_claims_summary AS
SELECT * FROM v_claims_analytics;

-- Refresh materialized view
REFRESH MATERIALIZED VIEW mv_monthly_claims_summary;`
      }
    },
    {
      title: "Real-time Analytics Pipeline",
      description: "Build a streaming pipeline for real-time insurance analytics and fraud detection.",
      icon: Zap,
      content: `
        ## Real-time Processing Architecture
        
        ### Data Flow
        1. **Stream Ingestion**: Kafka for real-time event streams
        2. **Stream Processing**: Apache Flink for complex event processing
        3. **Real-time Analytics**: ClickHouse for fast aggregations
        4. **Fraud Detection**: ML models for real-time scoring
        5. **Alerting**: Real-time notifications for suspicious activities
        
        ### Key Components
        - **Event Streams**: Claims, payments, policy changes
        - **Processing Rules**: Business logic, validation, enrichment
        - **Real-time Dashboards**: Live metrics and KPIs
        - **ML Pipeline**: Feature engineering and model serving
        
        ### Performance Requirements
        - Sub-second latency for fraud detection
        - Real-time aggregation updates
        - 99.9% uptime for critical operations
      `,
      codeBlock: {
        language: 'java',
        code: `// Real-time Claims Processing with Flink
public class ClaimsStreamProcessor extends KeyedProcessFunction<String, ClaimEvent, FraudAlert> {
    
    private ValueState<ClaimHistory> claimHistoryState;
    private ValueState<CustomerProfile> customerProfileState;
    
    @Override
    public void processElement(ClaimEvent claim, Context ctx, Collector<FraudAlert> out) throws Exception {
        // Get historical data
        ClaimHistory history = claimHistoryState.value();
        CustomerProfile profile = customerProfileState.value();
        
        // Real-time fraud detection
        FraudScore score = calculateFraudScore(claim, history, profile);
        
        if (score.getRiskLevel() == RiskLevel.HIGH) {
            FraudAlert alert = FraudAlert.builder()
                .claimId(claim.getClaimId())
                .customerId(claim.getCustomerId())
                .riskScore(score.getScore())
                .indicators(score.getIndicators())
                .timestamp(Instant.now())
                .build();
                
            out.collect(alert);
        }
        
        // Update state
        updateClaimHistory(claim, history);
    }
    
    private FraudScore calculateFraudScore(ClaimEvent claim, ClaimHistory history, CustomerProfile profile) {
        double score = 0.0;
        List<String> indicators = new ArrayList<>();
        
        // Frequency analysis
        if (history.getClaimCount() > profile.getExpectedClaims()) {
            score += 30.0;
            indicators.add("HIGH_CLAIM_FREQUENCY");
        }
        
        // Amount analysis
        if (claim.getAmount() > profile.getAverageClaimAmount() * 3) {
            score += 25.0;
            indicators.add("UNUSUAL_CLAIM_AMOUNT");
        }
        
        // Timing analysis
        if (isSuspiciousTiming(claim, history)) {
            score += 20.0;
            indicators.add("SUSPICIOUS_TIMING");
        }
        
        return new FraudScore(score, indicators);
    }
}`
      }
    },
    {
      title: "Regulatory Compliance & Governance",
      description: "Implement comprehensive data governance for insurance regulatory requirements.",
      icon: Shield,
      content: `
        ## Compliance Requirements
        
        ### Data Privacy
        - **GDPR**: Customer consent management, right to be forgotten
        - **CCPA**: California privacy rights, data disclosure
        - **HIPAA**: Protected health information handling
        
        ### Financial Regulations
        - **Solvency II**: Risk-based capital requirements
        - **IFRS 17**: Insurance contract accounting
        - **Basel III**: Risk management standards
        
        ### Data Governance
        - **Data Lineage**: Track data from source to consumption
        - **Data Quality**: Validation rules, monitoring, alerts
        - **Access Control**: Role-based permissions, audit trails
        - **Retention Policies**: Legal hold, archival, deletion
        
        ### Audit & Reporting
        - **Regulatory Reports**: Automated generation and submission
        - **Audit Trails**: Complete change history tracking
        - **Compliance Dashboards**: Real-time compliance status
      `,
      codeBlock: {
        language: 'sql',
        code: `-- Data Lineage Tracking
CREATE TABLE data_lineage (
    lineage_id BIGINT PRIMARY KEY,
    source_table VARCHAR(255),
    target_table VARCHAR(255),
    transformation_type VARCHAR(100),
    transformation_sql TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100)
);

-- Data Quality Monitoring
CREATE TABLE data_quality_checks (
    check_id BIGINT PRIMARY KEY,
    table_name VARCHAR(255),
    column_name VARCHAR(255),
    check_type VARCHAR(100),
    check_sql TEXT,
    threshold_value DECIMAL(10,2),
    current_value DECIMAL(10,2),
    status VARCHAR(20),
    last_run TIMESTAMP,
    alert_sent BOOLEAN DEFAULT FALSE
);

-- Compliance Monitoring
CREATE VIEW v_compliance_status AS
SELECT 
    'GDPR' as regulation,
    COUNT(CASE WHEN consent_status = 'ACTIVE' THEN 1 END) as compliant_records,
    COUNT(*) as total_records,
    ROUND(COUNT(CASE WHEN consent_status = 'ACTIVE' THEN 1 END) * 100.0 / COUNT(*), 2) as compliance_rate
FROM customer_consents
WHERE consent_type = 'DATA_PROCESSING'
UNION ALL
SELECT 
    'Data Retention' as regulation,
    COUNT(CASE WHEN retention_status = 'COMPLIANT' THEN 1 END) as compliant_records,
    COUNT(*) as total_records,
    ROUND(COUNT(CASE WHEN retention_status = 'COMPLIANT' THEN 1 END) * 100.0 / COUNT(*), 2) as compliance_rate
FROM data_retention_policies;`
      }
    }
  ]

  const implementationChecklist = [
    {
      id: '1',
      title: 'Data Model Design',
      description: 'Design comprehensive star schema for insurance data',
      category: 'planning' as const,
      priority: 'high' as const,
      completed: false,
      details: 'Create fact and dimension tables for claims, policies, customers, and products'
    },
    {
      id: '2',
      title: 'OLAP Cube Implementation',
      description: 'Build multi-dimensional data structures',
      category: 'implementation' as const,
      priority: 'high' as const,
      completed: false,
      details: 'Implement OLAP cubes with proper aggregation levels and measures'
    },
    {
      id: '3',
      title: 'Real-time Processing',
      description: 'Set up streaming pipeline for live analytics',
      category: 'implementation' as const,
      priority: 'high' as const,
      completed: false,
      details: 'Configure Kafka, Flink, and real-time analytics database'
    },
    {
      id: '4',
      title: 'Fraud Detection ML',
      description: 'Implement machine learning models for fraud detection',
      category: 'implementation' as const,
      priority: 'high' as const,
      completed: false,
      details: 'Build and deploy fraud detection models with real-time scoring'
    },
    {
      id: '5',
      title: 'Compliance Framework',
      description: 'Establish data governance and compliance monitoring',
      category: 'planning' as const,
      priority: 'high' as const,
      completed: false,
      details: 'Implement data lineage, quality checks, and audit trails'
    },
    {
      id: '6',
      title: 'Performance Optimization',
      description: 'Optimize query performance and data access',
      category: 'testing' as const,
      priority: 'medium' as const,
      completed: false,
      details: 'Create indexes, materialized views, and query optimization'
    },
    {
      id: '7',
      title: 'Monitoring & Alerting',
      description: 'Set up comprehensive monitoring and alerting',
      category: 'monitoring' as const,
      priority: 'medium' as const,
      completed: false,
      details: 'Implement dashboards, alerts, and performance monitoring'
    }
  ]

  const decisionTree = {
    title: "Insurance Analytics Architecture Decisions",
    description: "Decision tree for choosing the right insurance analytics architecture",
    nodes: [
      {
        id: 'start',
        title: 'Primary Analytics Requirements Assessment',
        description: 'Determine your primary analytics requirements for insurance operations',
        question: 'What is your primary analytics requirement?',
        options: [
          {
            id: 'fraud-detection-option',
            label: 'Real-time fraud detection',
            description: 'Requires streaming pipeline and ML models',
            nextNode: 'fraud-detection',
            pros: ['Immediate threat detection', 'Real-time protection', 'Reduced losses'],
            cons: ['High complexity', 'High cost', 'Expertise required'],
            recommendation: 'Use streaming pipeline with ML models for real-time fraud detection'
          },
          {
            id: 'regulatory-reporting-option',
            label: 'Regulatory reporting',
            description: 'Focus on compliance and audit trails',
            nextNode: 'regulatory-reporting',
            pros: ['Compliance assurance', 'Audit readiness', 'Risk mitigation'],
            cons: ['Complex setup', 'Ongoing maintenance', 'Regular updates'],
            recommendation: 'Focus on compliance framework and audit trails'
          },
          {
            id: 'business-intelligence-option',
            label: 'Business intelligence',
            description: 'Traditional OLAP with scheduled updates',
            nextNode: 'business-intelligence',
            pros: ['Simple setup', 'Lower cost', 'Easy maintenance'],
            cons: ['Delayed insights', 'Limited real-time capabilities'],
            recommendation: 'Use traditional OLAP for business intelligence needs'
          }
        ]
      },
      {
        id: 'fraud-detection',
        title: 'Fraud Detection Latency Assessment',
        description: 'Evaluate your fraud detection latency requirements',
        question: 'What is your fraud detection latency requirement?',
        options: [
          {
            id: 'sub-second-option',
            label: 'Sub-second (< 1 second)',
            description: 'Use Apache Flink + ClickHouse',
            nextNode: 'real-time-streaming',
            pros: ['Immediate detection', 'Real-time protection', 'Minimal losses'],
            cons: ['High cost', 'Complex setup', 'Expertise required'],
            recommendation: 'Use Apache Flink + ClickHouse for sub-second fraud detection'
          },
          {
            id: 'near-real-time-option',
            label: 'Near real-time (1-5 seconds)',
            description: 'Use Kafka Streams + Redis',
            nextNode: 'near-real-time',
            pros: ['Good performance', 'Balanced cost', 'Moderate complexity'],
            cons: ['Some delay', 'Limited real-time capabilities'],
            recommendation: 'Use Kafka Streams + Redis for near real-time fraud detection'
          },
          {
            id: 'batch-processing-option',
            label: 'Batch processing (5+ minutes)',
            description: 'Use Apache Spark + traditional databases',
            nextNode: 'batch-processing',
            pros: ['Lower cost', 'Simple setup', 'Easy maintenance'],
            cons: ['Delayed detection', 'Higher losses'],
            recommendation: 'Use Apache Spark + traditional databases for batch fraud detection'
          }
        ]
      },
      {
        id: 'regulatory-reporting',
        title: 'Regulatory Framework Assessment',
        description: 'Evaluate which regulatory frameworks apply to your operations',
        question: 'Which regulatory frameworks apply?',
        options: [
          {
            id: 'comprehensive-compliance-option',
            label: 'GDPR + Financial regulations',
            description: 'Full data governance and lineage tracking',
            nextNode: 'comprehensive-compliance',
            pros: ['Full compliance', 'Comprehensive protection', 'Risk mitigation'],
            cons: ['High complexity', 'High cost', 'Ongoing maintenance'],
            recommendation: 'Implement full data governance and lineage tracking for comprehensive compliance'
          },
          {
            id: 'basic-compliance-option',
            label: 'Basic compliance only',
            description: 'Standard audit trails and data quality',
            nextNode: 'basic-compliance',
            pros: ['Lower cost', 'Simple setup', 'Basic protection'],
            cons: ['Limited compliance', 'Higher risk', 'May not meet requirements'],
            recommendation: 'Use standard audit trails and data quality for basic compliance'
          }
        ]
      }
    ]
  }

  const tools = [
    {
      id: 'apache-kafka',
      name: 'Apache Kafka',
      category: 'streaming' as const,
      description: 'Distributed streaming platform for real-time data ingestion',
      features: ['High throughput', 'Fault tolerance', 'Scalability', 'Real-time processing'],
      pros: ['Excellent performance', 'Large ecosystem', 'Production ready', 'Good documentation'],
      cons: ['Complex setup', 'Steep learning curve', 'Resource intensive'],
      bestFor: ['High-volume real-time data streaming'],
      notFor: ['Simple batch processing'],
      pricing: 'free' as const,
      rating: 4.8,
      marketShare: 'Very High',
      learningCurve: 'hard' as const,
      community: 'large' as const,
      documentation: 'excellent' as const
    },
    {
      id: 'apache-flink',
      name: 'Apache Flink',
      category: 'streaming' as const,
      description: 'Stream processing framework for real-time analytics',
      features: ['Event time processing', 'Exactly-once semantics', 'State management', 'CEP support'],
      pros: ['Advanced streaming features', 'Excellent performance', 'Rich APIs', 'Active development'],
      cons: ['Complex configuration', 'Resource intensive', 'Limited ecosystem'],
      bestFor: ['Complex event processing and real-time analytics'],
      notFor: ['Simple data transformations'],
      pricing: 'free' as const,
      rating: 4.6,
      marketShare: 'High',
      learningCurve: 'hard' as const,
      community: 'medium' as const,
      documentation: 'good' as const
    },
    {
      id: 'clickhouse',
      name: 'ClickHouse',
      category: 'database' as const,
      description: 'Column-oriented database for real-time analytics',
      features: ['Column storage', 'Real-time queries', 'High compression', 'SQL support'],
      pros: ['Extremely fast queries', 'Excellent compression', 'Real-time capabilities', 'SQL compatibility'],
      cons: ['Limited ecosystem', 'Complex optimization', 'Resource intensive'],
      bestFor: ['Real-time analytics and reporting'],
      notFor: ['OLTP workloads'],
      pricing: 'free' as const,
      rating: 4.7,
      marketShare: 'Medium',
      learningCurve: 'medium' as const,
      community: 'medium' as const,
      documentation: 'good' as const
    },
    {
      id: 'apache-superset',
      name: 'Apache Superset',
      category: 'visualization' as const,
      description: 'Data exploration and visualization platform',
      features: ['Rich visualizations', 'SQL editor', 'Dashboard creation', 'User management'],
      pros: ['Free and open source', 'Rich feature set', 'Good integration', 'Active community'],
      cons: ['Complex setup', 'Limited customization', 'Performance issues with large datasets'],
      bestFor: ['Business intelligence and data exploration'],
      notFor: ['Real-time dashboards'],
      pricing: 'free' as const,
      rating: 4.2,
      marketShare: 'Medium',
      learningCurve: 'medium' as const,
      community: 'medium' as const,
      documentation: 'good' as const
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Insurance OLAP Analytics Pipeline</h1>
              <p className="text-muted-foreground">Comprehensive guide to building OLAP analytics pipelines for insurance companies</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-semibold">Real-time Analytics</span>
              </div>
              <p className="text-sm text-muted-foreground">Sub-second fraud detection and live reporting</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="font-semibold">Regulatory Compliance</span>
              </div>
              <p className="text-sm text-muted-foreground">GDPR, Solvency II, and financial regulations</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-purple-600" />
                <span className="font-semibold">OLAP Cubes</span>
              </div>
              <p className="text-sm text-muted-foreground">Multi-dimensional analytics and reporting</p>
            </div>
          </div>
        </div>

        {/* Tutorial Sections */}
        <div className="space-y-8">
          {tutorialSteps.map((step, index) => (
            <TutorialSection
              key={index}
              title={step.title}
              description={step.description}
              icon={step.icon}
              content={step.content}
              codeBlock={step.codeBlock}
            />
          ))}
        </div>

        {/* Implementation Checklist */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Implementation Checklist</h2>
          <ImplementationChecklist 
            title="Insurance OLAP Pipeline Implementation Checklist"
            description="Follow this comprehensive checklist to ensure successful implementation of your insurance analytics pipeline"
            items={implementationChecklist}
          />
        </div>

        {/* Architecture Decision Tree */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Architecture Decision Tree</h2>
          <ArchitectureDiagram 
            title="Insurance OLAP Architecture Decisions"
            description="Decision tree for choosing the right insurance analytics architecture"
            type="decision-tree"
            content={decisionTree.nodes}
          />
        </div>

        {/* Tool Comparison */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Technology Stack Comparison</h2>
          <ToolComparison 
            title="Technology Stack Comparison"
            description="Compare different insurance analytics technologies"
            tools={tools}
            features={[]}
          />
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Build Your Insurance Analytics Pipeline?</h2>
          <p className="text-blue-100 mb-6">
            Start implementing these patterns to create a robust, compliant, and high-performance insurance analytics system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Download Architecture Template
            </button>
            <button className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Schedule Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
