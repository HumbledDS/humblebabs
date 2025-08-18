import { Metadata } from 'next'
import { TutorialSection } from '@/components/projects/tutorial-section'
import { ImplementationChecklist } from '@/components/projects/implementation-checklist'
import { ArchitectureDiagram } from '@/components/projects/architecture-diagram'
import { ToolComparison } from '@/components/projects/tool-comparison'
import { 
  Zap, 
  Database, 
  BarChart3, 
  Settings,
  Workflow
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kafka Stream Processing Pipeline - System Design',
  description: 'Comprehensive guide to building real-time stream processing pipelines with Apache Kafka.',
}

export default function KafkaStreamProcessingPipelinePage() {
  const tutorialSteps = [
    {
      title: "Kafka Stream Architecture",
      description: "Design a scalable stream processing architecture using Apache Kafka for real-time data processing.",
      icon: Database,
      content: `
        ## Kafka Stream Processing Architecture
        
        ### Core Components
        - **Kafka Brokers**: Distributed message storage and routing
        - **Producers**: Data sources generating events
        - **Consumers**: Applications processing streams
        - **Stream Processors**: Real-time data transformation logic
        
        ### Data Flow
        1. **Event Ingestion**: Producers send events to Kafka topics
        2. **Stream Processing**: Kafka Streams or Flink process events
        3. **State Management**: Maintain processing state across events
        4. **Output Sinks**: Send processed results to downstream systems
        
        ### Key Design Principles
        - **Fault Tolerance**: Automatic failover and recovery
        - **Scalability**: Horizontal scaling of partitions
        - **Ordering**: Maintain event order within partitions
        - **Durability**: Persistent storage with replication
      `,
      codeBlock: {
        language: 'java',
        code: `// Kafka Streams Configuration
@Configuration
public class KafkaStreamsConfig {
    
    @Bean
    public StreamsBuilderFactoryBean streamsBuilderFactoryBean() {
        Map<String, Object> props = new HashMap<>();
        props.put(StreamsConfig.APPLICATION_ID_CONFIG, "user-activity-processor");
        props.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass());
        props.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.String().getClass());
        props.put(StreamsConfig.PROCESSING_GUARANTEE_CONFIG, StreamsConfig.EXACTLY_ONCE_V2);
        
        StreamsBuilderFactoryBean factoryBean = new StreamsBuilderFactoryBean();
        factoryBean.setStreamsConfiguration(props);
        return factoryBean;
    }
}`
      }
    },
    {
      title: "Stream Processing Logic",
      description: "Implement real-time stream processing with state management and windowing operations.",
      icon: Zap,
      content: `
        ## Stream Processing Operations
        
        ### Processing Types
        - **Stateless**: Simple transformations without memory
        - **Stateful**: Operations requiring historical context
        - **Windowing**: Time-based aggregations
        - **Joining**: Combining multiple streams
        
        ### State Management
        - **Local State**: In-memory state stores
        - **Global State**: Distributed state across instances
        - **Changelog Topics**: Backup and recovery mechanism
        - **Standby Replicas**: Hot backup for failover
        
        ### Performance Optimization
        - **Partitioning**: Parallel processing of data
        - **Caching**: Reduce external lookups
        - **Batching**: Group operations for efficiency
        - **Resource Management**: Control memory and CPU usage
      `,
      codeBlock: {
        language: 'java',
        code: `// User Activity Stream Processor
@Component
public class UserActivityProcessor {
    
    @Autowired
    private StreamsBuilder streamsBuilder;
    
    public void buildPipeline() {
        KStream<String, UserActivity> userActivityStream = streamsBuilder
            .stream("user-activities", Consumed.with(Serdes.String(), userActivitySerde));
        
        // Filter high-value activities
        KStream<String, UserActivity> highValueActivities = userActivityStream
            .filter((key, activity) -> activity.getAmount() > 1000.0);
        
        // Aggregate by user with time windowing
        KTable<Windowed<String>, UserActivitySummary> userSummary = highValueActivities
            .groupByKey()
            .windowedBy(TimeWindows.of(Duration.ofHours(1)))
            .aggregate(
                UserActivitySummary::new,
                (key, activity, summary) -> summary.update(activity),
                Materialized.with(Serdes.String(), userActivitySummarySerde)
            );
        
        // Output to downstream topic
        userSummary.toStream()
            .map((key, value) -> new KeyValue<>(key.key(), value))
            .to("user-activity-summaries");
    }
}`
      }
    }
  ]

  const implementationChecklist = [
    {
      id: '1',
      title: 'Kafka Cluster Setup',
      description: 'Configure Kafka brokers and topics',
      category: 'planning' as const,
      priority: 'high' as const,
      completed: false,
      details: 'Set up multi-broker cluster with proper replication and partitioning'
    },
    {
      id: '2',
      title: 'Stream Processing Logic',
      description: 'Implement stream processing applications',
      category: 'implementation' as const,
      priority: 'high' as const,
      completed: false,
      details: 'Build stream processors with state management and windowing'
    },
    {
      id: '3',
      title: 'State Management',
      description: 'Configure state stores and changelog topics',
      category: 'implementation' as const,
      priority: 'high' as const,
      completed: false,
      details: 'Set up local and global state stores with backup mechanisms'
    },
    {
      id: '4',
      title: 'Monitoring & Alerting',
      description: 'Implement comprehensive monitoring',
      category: 'monitoring' as const,
      priority: 'medium' as const,
      completed: false,
      details: 'Set up metrics collection, dashboards, and alerting'
    }
  ]

  const decisionTree = {
    title: "Kafka Stream Processing Decisions",
    description: "Decision tree for choosing stream processing architecture",
    nodes: [
      {
        id: 'start',
        title: 'Stream Processing Requirements',
        description: 'Choose the appropriate stream processing approach based on your requirements',
        question: 'What is your processing requirement?',
        options: [
          {
            id: 'simple-processing',
            label: 'Simple transformations',
            description: 'Use stateless operations',
            nextNode: 'simple-processing',
            pros: ['Easy to implement', 'Scalable', 'Low resource usage'],
            cons: ['Limited functionality', 'No state persistence', 'Basic operations only'],
            recommendation: 'Use for simple data transformations and filtering'
          },
          {
            id: 'complex-processing',
            label: 'Complex aggregations',
            description: 'Use stateful operations with state stores',
            nextNode: 'complex-processing',
            pros: ['Rich functionality', 'State persistence', 'Complex analytics'],
            cons: ['Higher complexity', 'More resources', 'State management overhead'],
            recommendation: 'Use for complex aggregations, windowing, and stateful operations'
          }
        ]
      }
    ]
  }

  const tools = [
    {
      id: 'apache-kafka',
      name: 'Apache Kafka',
      category: 'streaming',
      description: 'Distributed streaming platform',
      features: ['High throughput', 'Fault tolerance', 'Scalability'],
      pros: ['Excellent performance', 'Large ecosystem', 'Production ready'],
      cons: ['Complex setup', 'Steep learning curve'],
      bestFor: ['High-volume real-time data streaming'],
      notFor: ['Simple batch processing'],
      pricing: 'free' as const,
      rating: 4.8,
      marketShare: '60%',
      learningCurve: 'hard' as const,
      community: 'large' as const,
      documentation: 'excellent' as const
    },
    {
      id: 'kafka-streams',
      name: 'Kafka Streams',
      category: 'processing',
      description: 'Stream processing library for Kafka',
      features: ['Exactly-once semantics', 'State management', 'Windowing'],
      pros: ['Native Kafka integration', 'Simple deployment', 'Good performance'],
      cons: ['Limited ecosystem', 'Basic features'],
      bestFor: ['Kafka-native stream processing'],
      notFor: ['Complex event processing'],
      pricing: 'free' as const,
      rating: 4.5,
      marketShare: '30%',
      learningCurve: 'medium' as const,
      community: 'good' as const,
      documentation: 'good' as const
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Kafka Stream Processing Pipeline</h1>
              <p className="text-muted-foreground">Real-time stream processing with Apache Kafka</p>
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
            description="Track your progress in implementing Kafka stream processing pipeline"
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
            description="Compare different Kafka stream processing technologies"
            tools={tools}
            features={[]}
          />
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Build Your Stream Processing Pipeline?</h2>
          <p className="text-purple-100 mb-6">
            Start implementing these patterns for real-time data processing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
              Download Architecture Template
            </button>
            <button className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors">
              Schedule Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
