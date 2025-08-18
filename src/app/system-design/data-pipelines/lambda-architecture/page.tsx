import { Metadata } from 'next'
import { TutorialSection } from '@/components/projects/tutorial-section'
import { ImplementationChecklist } from '@/components/projects/implementation-checklist'
import { ArchitectureDiagram } from '@/components/projects/architecture-diagram'
import { ToolComparison } from '@/components/projects/tool-comparison'
import { 
  Database, 
  Zap, 
  BarChart3, 
  Settings,
  Workflow
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Lambda Architecture - System Design',
  description: 'Comprehensive guide to implementing Lambda architecture for batch and real-time processing.',
}

export default function LambdaArchitecturePage() {
  const tutorialSteps = [
    {
      title: "Lambda Architecture Overview",
      description: "Design a hybrid architecture combining batch and real-time processing for comprehensive data analytics.",
      icon: Database,
      content: `
        ## Lambda Architecture Components
        
        ### Three Layers
        1. **Batch Layer**: Processes all historical data with high accuracy
        2. **Speed Layer**: Processes real-time data with low latency
        3. **Serving Layer**: Combines results for unified query interface
        
        ### Data Flow
        - **New Data**: Enters both batch and speed layers simultaneously
        - **Batch Processing**: Runs on full dataset for accuracy
        - **Speed Processing**: Runs on recent data for timeliness
        - **Result Merging**: Combines batch and speed results
        
        ### Key Benefits
        - **Accuracy**: Batch layer provides correct results
        - **Latency**: Speed layer provides real-time results
        - **Fault Tolerance**: Independent processing layers
        - **Scalability**: Each layer scales independently
      `,
      codeBlock: {
        language: 'java',
        code: `// Lambda Architecture Configuration
@Configuration
public class LambdaArchitectureConfig {
    
    @Bean
    public BatchProcessor batchProcessor() {
        return BatchProcessor.builder()
            .batchSize(10000)
            .processingInterval(Duration.ofHours(1))
            .dataSource("historical-data")
            .build();
    }
    
    @Bean
    public SpeedProcessor speedProcessor() {
        return SpeedProcessor.builder()
            .windowSize(Duration.ofMinutes(5))
            .processingInterval(Duration.ofSeconds(30))
            .dataSource("real-time-stream")
            .build();
    }
    
    @Bean
    public ServingLayer servingLayer() {
        return ServingLayer.builder()
            .batchResults("batch-results")
            .speedResults("speed-results")
            .mergeStrategy(MergeStrategy.LATEST_WINS)
            .build();
    }
}`
      }
    },
    {
      title: "Batch Layer Implementation",
      description: "Implement the batch processing layer for comprehensive historical data analysis.",
      icon: BarChart3,
      content: `
        ## Batch Processing Strategy
        
        ### Processing Characteristics
        - **Full Dataset**: Process entire historical dataset
        - **High Accuracy**: Correct results with no approximations
        - **Long Latency**: Hours to days for completion
        - **Resource Intensive**: High CPU and memory usage
        
        ### Implementation Patterns
        - **MapReduce**: Distributed processing framework
        - **Partitioning**: Divide data for parallel processing
        - **Incremental Processing**: Process only new data
        - **Result Storage**: Store in optimized format
        
        ### Data Storage
        - **Raw Data**: Immutable append-only storage
        - **Processed Views**: Pre-computed aggregations
        - **Indexing**: Optimize for query performance
        - **Compression**: Reduce storage costs
      `,
      codeBlock: {
        language: 'java',
        code: `// Batch Processing Implementation
@Component
public class BatchProcessor {
    
    @Autowired
    private SparkSession sparkSession;
    
    public void processBatchData(String date) {
        // Read historical data
        Dataset<Row> historicalData = sparkSession.read()
            .option("basePath", "/data/historical")
            .parquet("/data/historical/*");
        
        // Apply batch transformations
        Dataset<Row> processedData = historicalData
            .filter(col("date").leq(date))
            .groupBy("user_id", "category")
            .agg(
                sum("amount").as("total_amount"),
                count("*").as("transaction_count"),
                avg("amount").as("avg_amount")
            );
        
        // Write results to serving layer
        processedData.write()
            .mode(SaveMode.Overwrite)
            .partitionBy("date")
            .parquet("/data/batch-results/" + date);
    }
}`
      }
    }
  ]

  const implementationChecklist = [
    {
      id: '1',
      title: 'Architecture Design',
      description: 'Design the three-layer Lambda architecture',
      category: 'planning' as const,
      priority: 'high' as const,
      completed: false,
      details: 'Plan batch, speed, and serving layers with data flow'
    },
    {
      id: '2',
      title: 'Batch Layer',
      description: 'Implement batch processing for historical data',
      category: 'implementation' as const,
      priority: 'high' as const,
      completed: false,
      details: 'Build batch processors with MapReduce or Spark'
    },
    {
      id: '3',
      title: 'Speed Layer',
      description: 'Implement real-time processing for recent data',
      category: 'implementation' as const,
      priority: 'high' as const,
      completed: false,
      details: 'Build stream processors with Kafka Streams or Flink'
    },
    {
      id: '4',
      title: 'Serving Layer',
      description: 'Implement result merging and query interface',
      category: 'implementation' as const,
      priority: 'medium' as const,
      completed: false,
      details: 'Build serving layer to combine batch and speed results'
    }
  ]

  const decisionTree = {
    title: "Lambda Architecture Decisions",
    description: "Decision tree for choosing Lambda architecture components",
    nodes: [
      {
        id: 'start',
        title: 'Data Processing Requirements',
        description: 'Choose the appropriate data processing architecture based on your requirements',
        question: 'What is your data processing requirement?',
        options: [
          {
            id: 'batch-only',
            label: 'Batch only',
            description: 'Use traditional batch processing',
            nextNode: 'batch-only',
            pros: ['Simple to implement', 'Cost-effective', 'High accuracy'],
            cons: ['High latency', 'Limited real-time insights'],
            recommendation: 'Use for historical analysis and reporting'
          },
          {
            id: 'real-time-only',
            label: 'Real-time only',
            description: 'Use streaming architecture',
            nextNode: 'real-time-only',
            pros: ['Low latency', 'Immediate insights', 'Real-time decision making'],
            cons: ['Higher complexity', 'More expensive', 'Potential data loss'],
            recommendation: 'Use for real-time monitoring and alerts'
          },
          {
            id: 'lambda-architecture',
            label: 'Both batch and real-time',
            description: 'Use Lambda architecture',
            nextNode: 'lambda-architecture',
            pros: ['Best of both worlds', 'High accuracy + low latency', 'Fault tolerance'],
            cons: ['Complex to implement', 'Higher maintenance', 'Data consistency challenges'],
            recommendation: 'Use for comprehensive data analytics with both historical and real-time needs'
          }
        ]
      }
    ]
  }

  const tools = [
    {
      id: 'apache-spark',
      name: 'Apache Spark',
      category: 'batch',
      description: 'Unified analytics engine for batch processing',
      features: ['Batch processing', 'ML support', 'Graph processing', 'SQL'],
      pros: ['Excellent performance', 'Rich APIs', 'Scalable', 'Active development'],
      cons: ['Complex configuration', 'Resource intensive', 'Steep learning curve'],
      bestFor: ['Large-scale batch data processing'],
      notFor: ['Simple data transformations'],
      pricing: 'free' as const,
      rating: 4.8,
      marketShare: '45%',
      learningCurve: 'hard' as const,
      community: 'large' as const,
      documentation: 'excellent' as const
    },
    {
      id: 'apache-flink',
      name: 'Apache Flink',
      category: 'streaming',
      description: 'Stream processing framework for real-time analytics',
      features: ['Event time processing', 'Exactly-once semantics', 'State management'],
      pros: ['Advanced streaming features', 'Excellent performance', 'Rich APIs'],
      cons: ['Complex configuration', 'Resource intensive', 'Limited ecosystem'],
      bestFor: ['Complex event processing and real-time analytics'],
      notFor: ['Simple data transformations'],
      pricing: 'free' as const,
      rating: 4.6,
      marketShare: '25%',
      learningCurve: 'hard' as const,
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
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Workflow className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Lambda Architecture</h1>
              <p className="text-muted-foreground">Hybrid batch and real-time processing architecture</p>
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
            description="Track your progress in implementing Lambda architecture"
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
            description="Compare different technologies for implementing Lambda architecture"
            tools={tools}
            features={[]}
          />
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Build Your Lambda Architecture?</h2>
          <p className="text-orange-100 mb-6">
            Start implementing these patterns for hybrid batch and real-time processing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
              Download Architecture Template
            </button>
            <button className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors">
              Schedule Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
