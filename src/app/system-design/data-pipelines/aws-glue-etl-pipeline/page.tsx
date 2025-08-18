import { Metadata } from 'next'
import { TutorialSection } from '@/components/projects/tutorial-section'
import { ImplementationChecklist } from '@/components/projects/implementation-checklist'
import { ArchitectureDiagram } from '@/components/projects/architecture-diagram'
import { ToolComparison } from '@/components/projects/tool-comparison'
import { 
  Cloud, 
  Database, 
  BarChart3, 
  Settings,
  Workflow
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'AWS Glue ETL Pipeline - System Design',
  description: 'Comprehensive guide to building serverless ETL pipelines with AWS Glue.',
}

export default function AWSGlueETLPipelinePage() {
  const tutorialSteps = [
    {
      title: "AWS Glue Architecture",
      description: "Design a serverless ETL pipeline using AWS Glue for data processing and transformation.",
      icon: Cloud,
      content: `
        ## AWS Glue ETL Components
        
        ### Core Services
        - **Glue Data Catalog**: Central metadata repository
        - **Glue ETL Jobs**: Serverless Spark jobs for data processing
        - **Glue Crawlers**: Automatic schema discovery and metadata updates
        - **Glue DataBrew**: Visual data preparation tool
        
        ### Data Flow
        1. **Data Discovery**: Crawlers scan data sources
        2. **Schema Detection**: Automatic schema inference
        3. **ETL Processing**: Spark-based data transformation
        4. **Data Catalog**: Centralized metadata management
        
        ### Key Benefits
        - **Serverless**: No infrastructure management
        - **Auto-scaling**: Automatic resource allocation
        - **Pay-per-use**: Only pay for processing time
        - **Integration**: Native AWS service integration
      `,
      codeBlock: {
        language: 'python',
        code: `# AWS Glue ETL Job
import sys
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job

# Initialize Glue context
args = getResolvedOptions(sys.argv, ['JOB_NAME'])
sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args['JOB_NAME'], args)

# Read data from S3
datasource0 = glueContext.create_dynamic_frame.from_catalog(
    database="customer-database",
    table_name="raw-customer-data"
)

# Apply transformations
applymapping1 = ApplyMapping.apply(
    frame=datasource0,
    mappings=[
        ("customer_id", "string", "customer_id", "string"),
        ("first_name", "string", "first_name", "string"),
        ("last_name", "string", "last_name", "string"),
        ("email", "string", "email", "string"),
        ("created_date", "string", "created_date", "date")
    ]
)

# Filter valid records
filtered_data = Filter.apply(
    frame=applymapping1,
    f=lambda row: row["email"] is not None and "@" in row["email"]
)

# Write to target S3 location
datasink4 = glueContext.write_dynamic_frame.from_options(
    frame=filtered_data,
    connection_type="s3",
    connection_options={"path": "s3://processed-data/customers/"},
    format="parquet"
)

job.commit()`
      }
    },
    {
      title: "Data Catalog & Crawlers",
      description: "Implement automatic data discovery and schema management with Glue Crawlers.",
      icon: Database,
      content: `
        ## Data Discovery Strategy
        
        ### Crawler Configuration
        - **Data Sources**: S3, RDS, Redshift, JDBC connections
        - **Scheduling**: On-demand or scheduled crawling
        - **Schema Changes**: Automatic schema evolution detection
        - **Partition Discovery**: Automatic partition identification
        
        ### Metadata Management
        - **Table Definitions**: Automatic table creation
        - **Schema Evolution**: Track schema changes over time
        - **Data Lineage**: Track data flow and transformations
        - **Access Control**: IAM-based permissions
        
        ### Best Practices
        - **Incremental Crawling**: Only scan new/changed data
        - **Partition Strategy**: Optimize for query performance
        - **Schema Validation**: Ensure data quality consistency
        - **Cost Optimization**: Minimize crawling frequency
      `,
      codeBlock: {
        language: 'python',
        code: `# Glue Crawler Configuration
import boto3

glue_client = boto3.client('glue')

def create_crawler(crawler_name, database_name, s3_path):
    """Create a Glue crawler for S3 data discovery"""
    
    response = glue_client.create_crawler(
        Name=crawler_name,
        Role='AWSGlueServiceRole',
        DatabaseName=database_name,
        Targets={
            'S3Targets': [
                {
                    'Path': s3_path,
                    'Exclusions': ['*.tmp', '*.log', '_SUCCESS']
                }
            ]
        },
        Schedule='cron(0 */6 * * ? *)',  # Every 6 hours
        SchemaChangePolicy={
            'UpdateBehavior': 'UPDATE_IN_DATABASE',
            'DeleteBehavior': 'LOG'
        },
        Configuration='{"Version": 1.0, "CrawlerOutput": {"Partitions": {"AddOrUpdateBehavior": "InheritFromTable"}}}'
    )
    
    return response

def start_crawler(crawler_name):
    """Start a Glue crawler"""
    
    response = glue_client.start_crawler(
        Name=crawler_name
    )
    
    return response

# Example usage
crawler_name = 'customer-data-crawler'
database_name = 'customer-analytics'
s3_path = 's3://raw-data/customers/'

# Create crawler
create_crawler(crawler_name, database_name, s3_path)

# Start crawling
start_crawler(crawler_name)`
      }
    }
  ]

  const implementationChecklist = [
    {
      id: '1',
      title: 'AWS Setup',
      description: 'Configure AWS services and IAM roles',
      category: 'planning' as const,
      priority: 'high' as const,
      completed: false,
      details: 'Set up S3 buckets, IAM roles, and VPC configuration'
    },
    {
      id: '2',
      title: 'Data Catalog',
      description: 'Set up Glue Data Catalog and crawlers',
      category: 'implementation' as const,
      priority: 'high' as const,
      completed: false,
      details: 'Configure crawlers for automatic schema discovery'
    },
    {
      id: '3',
      title: 'ETL Jobs',
      description: 'Implement Glue ETL jobs for data processing',
      category: 'implementation' as const,
      priority: 'high' as const,
      completed: false,
      details: 'Build PySpark-based ETL jobs with transformations'
    },
    {
      id: '4',
      title: 'Monitoring',
      description: 'Set up CloudWatch monitoring and alerting',
      category: 'monitoring' as const,
      priority: 'medium' as const,
      completed: false,
      details: 'Configure metrics, logs, and alerting for ETL jobs'
    }
  ]

  const decisionTree = {
    title: "AWS Glue ETL Decisions",
    description: "Decision tree for choosing AWS Glue ETL components",
    nodes: [
      {
        id: 'start',
        title: 'Data Processing Requirements',
        description: 'Choose the appropriate AWS Glue ETL approach based on your requirements',
        question: 'What is your data processing requirement?',
        options: [
          {
            id: 'glue-etl',
            label: 'Simple transformations',
            description: 'Use AWS Glue ETL jobs',
            nextNode: 'glue-etl',
            pros: ['Serverless', 'Auto-scaling', 'AWS integration', 'Cost-effective'],
            cons: ['Vendor lock-in', 'Limited customization', 'Cold start delays'],
            recommendation: 'Use for standard ETL workflows with AWS-native data sources'
          },
          {
            id: 'glue-databrew',
            label: 'Visual data preparation',
            description: 'Use AWS Glue DataBrew',
            nextNode: 'glue-databrew',
            pros: ['Visual interface', 'No coding required', 'Business user friendly'],
            cons: ['Limited customization', 'Vendor lock-in', 'Higher cost'],
            recommendation: 'Use for business users who need visual data preparation tools'
          },
          {
            id: 'kinesis',
            label: 'Real-time processing',
            description: 'Use Amazon Kinesis',
            nextNode: 'kinesis',
            pros: ['Real-time processing', 'Low latency', 'High throughput'],
            cons: ['Higher complexity', 'More expensive', 'Requires streaming expertise'],
            recommendation: 'Use for real-time data processing and analytics'
          }
        ]
      }
    ]
  }

  const tools = [
    {
      id: 'aws-glue',
      name: 'AWS Glue',
      category: 'etl',
      description: 'Serverless ETL service for data processing',
      features: ['Serverless', 'Auto-scaling', 'Data catalog', 'Crawlers'],
      pros: ['No infrastructure management', 'Auto-scaling', 'AWS integration'],
      cons: ['Vendor lock-in', 'Cost for large datasets', 'Limited customization'],
      bestFor: ['AWS-native ETL processing'],
      notFor: ['Complex custom logic'],
      pricing: 'paid' as const,
      rating: 4.3,
      marketShare: '35%',
      learningCurve: 'medium' as const,
      community: 'large' as const,
      documentation: 'excellent' as const
    },
    {
      id: 'aws-glue-databrew',
      name: 'AWS Glue DataBrew',
      category: 'etl',
      description: 'Visual data preparation tool',
      features: ['Visual interface', 'Pre-built transformations', 'Data profiling'],
      pros: ['Easy to use', 'No coding required', 'Good for business users'],
      cons: ['Limited customization', 'Vendor lock-in', 'Higher cost'],
      bestFor: ['Business user data preparation'],
      notFor: ['Complex ETL logic'],
      pricing: 'paid' as const,
      rating: 4.0,
      marketShare: '20%',
      learningCurve: 'easy' as const,
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
              <Cloud className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">AWS Glue ETL Pipeline</h1>
              <p className="text-muted-foreground">Serverless ETL processing with AWS Glue</p>
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
            title="Implementation Checklist"
            description="Track your progress in implementing AWS Glue ETL pipeline"
            items={implementationChecklist}
          />
        </div>

        {/* Architecture Decision Tree */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Architecture Decision Tree</h2>
          <ArchitectureDiagram 
            title={decisionTree.title}
            description={decisionTree.description}
            type="decision-tree"
            content={decisionTree.nodes}
          />
        </div>

        {/* Tool Comparison */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Technology Stack Comparison</h2>
          <ToolComparison 
            title="Technology Stack Comparison"
            description="Compare different AWS Glue ETL technologies"
            tools={tools}
            features={[]}
          />
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Build Your AWS Glue ETL Pipeline?</h2>
          <p className="text-blue-100 mb-6">
            Start implementing these patterns for serverless ETL processing.
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
