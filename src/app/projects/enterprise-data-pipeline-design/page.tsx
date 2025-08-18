"use client"

import { motion } from "framer-motion"
import { TutorialSection } from "@/components/projects/tutorial-section"
import { ImplementationChecklist } from "@/components/projects/implementation-checklist"
import { ArchitectureDiagram } from "@/components/projects/architecture-diagram"
import { ToolComparison } from "@/components/projects/tool-comparison"
import { Workflow, Zap, Shield, TrendingUp, Globe, Database, Code2, Brain, CheckCircle, AlertTriangle, ArrowRight, Lightbulb } from "lucide-react"

export default function EnterpriseDataPipelineDesignPage() {
  const lambdaArchitectureSteps = [
    {
      id: 1,
      title: "Design Speed Layer",
      description: "Implement real-time processing using streaming technologies like Apache Kafka and Apache Flink for immediate data insights.",
      code: `// Speed Layer Implementation with Apache Flink
public class SpeedLayerProcessor {
    private final StreamExecutionEnvironment env;
    
    public SpeedLayerProcessor() {
        this.env = StreamExecutionEnvironment.getExecutionEnvironment();
        this.env.enableCheckpointing(60000); // 1 minute checkpoints
    }
    
    public void processRealTimeData(DataStream<Event> eventStream) {
        eventStream
            .keyBy(Event::getUserId)
            .window(TumblingProcessingTimeWindows.of(Time.seconds(5)))
            .aggregate(new RealTimeAggregator())
            .addSink(new SpeedLayerSink());
    }
}`,
      language: "java",
      tips: [
        "Use keyed state for maintaining entity state",
        "Implement checkpointing for fault tolerance",
        "Design for exactly-once processing semantics"
      ],
      warnings: [
        "State management can be complex - start simple",
        "Monitor memory usage for stateful operations"
      ]
    },
    {
      id: 2,
      title: "Implement Batch Layer",
      description: "Build comprehensive batch processing using Apache Spark for historical data analysis and master dataset creation.",
      code: `// Batch Layer Implementation with Apache Spark
public class BatchLayerProcessor {
    private final SparkSession spark;
    
    public BatchLayerProcessor() {
        this.spark = SparkSession.builder()
            .appName("Lambda-Batch-Layer")
            .config("spark.sql.adaptive.enabled", "true")
            .getOrCreate();
    }
    
    public Dataset<Row> processBatchData(String dataPath) {
        return spark.read()
            .option("header", "true")
            .csv(dataPath)
            .transform(new BatchDataTransformer())
            .transform(new DataQualityValidator())
            .transform(new MasterDatasetBuilder());
    }
}`,
      language: "java",
      tips: [
        "Use Spark SQL for complex transformations",
        "Implement data quality checks in the pipeline",
        "Optimize partition sizes for better performance"
      ],
      warnings: [
        "Monitor memory usage for large datasets",
        "Implement proper error handling and logging"
      ]
    },
    {
      id: 3,
      title: "Create Serving Layer",
      description: "Develop a serving layer that merges real-time and batch results, providing a unified view of data.",
      code: `// Serving Layer Implementation
public class ServingLayer {
    private final SpeedLayerClient speedClient;
    private final BatchLayerClient batchClient;
    
    public ServingLayer() {
        this.speedClient = new SpeedLayerClient();
        this.batchClient = new BatchLayerClient();
    }
    
    public CompletableFuture<AggregatedResult> getUnifiedResult(String userId) {
        CompletableFuture<SpeedResult> speedResult = speedClient.getLatestResult(userId);
        CompletableFuture<BatchResult> batchResult = batchClient.getMasterData(userId);
        
        return CompletableFuture.allOf(speedResult, batchResult)
            .thenApply(v -> mergeResults(speedResult.join(), batchResult.join()));
    }
    
    private AggregatedResult mergeResults(SpeedResult speed, BatchResult batch) {
        // Merge logic: speed results override batch results for recent data
        return new AggregatedResult(speed, batch, Instant.now());
    }
}`,
      language: "java",
      tips: [
        "Use async processing for better performance",
        "Implement caching for frequently accessed data",
        "Design for eventual consistency"
      ],
      warnings: [
        "Handle partial failures gracefully",
        "Monitor latency of serving layer operations"
      ]
    }
  ]

  const kappaArchitectureSteps = [
    {
      id: 1,
      title: "Design Stream-First Architecture",
      description: "Create a unified streaming architecture where all data flows through a single stream processing pipeline.",
      code: `// Kappa Architecture Stream Processor
public class KappaStreamProcessor {
    private final StreamExecutionEnvironment env;
    private final KafkaSource<String> source;
    
    public KappaStreamProcessor() {
        this.env = StreamExecutionEnvironment.getExecutionEnvironment();
        this.source = KafkaSource.<String>builder()
            .setBootstrapServers("localhost:9092")
            .setTopics("data-stream")
            .setGroupId("kappa-processor")
            .setStartingOffsets(OffsetsInitializer.earliest())
            .build();
    }
    
    public void processStream() {
        env.fromSource(source, WatermarkStrategy.noWatermarks(), "Kafka Source")
            .map(new JsonDeserializer())
            .keyBy(Event::getEntityId)
            .process(new StatefulEventProcessor())
            .addSink(new ResultSink());
    }
}`,
      language: "java",
      tips: [
        "Use event time processing for accurate timestamps",
        "Implement state backends for persistence",
        "Design for replay capability"
      ],
      warnings: [
        "Stream processing complexity requires careful testing",
        "Monitor state size and memory usage"
      ]
    },
    {
      id: 2,
      title: "Implement State Management",
      description: "Build robust state management using RocksDB or other state backends for maintaining entity state across stream processing.",
      code: `// State Management in Kappa Architecture
public class StatefulEventProcessor extends KeyedProcessFunction<String, Event, ProcessedEvent> {
    private ValueState<EntityState> entityState;
    private ListState<Event> eventHistory;
    
    @Override
    public void open(Configuration parameters) {
        entityState = getRuntimeContext().getState(
            new ValueStateDescriptor<>("entity-state", EntityState.class)
        );
        eventHistory = getRuntimeContext().getListState(
            new ListStateDescriptor<>("event-history", Event.class)
        );
    }
    
    @Override
    public void processElement(Event event, Context ctx, Collector<ProcessedEvent> out) throws Exception {
        EntityState currentState = entityState.value();
        if (currentState == null) {
            currentState = new EntityState();
        }
        
        // Update state based on event
        currentState = updateState(currentState, event);
        entityState.update(currentState);
        
        // Store event in history
        eventHistory.add(event);
        
        // Emit processed result
        out.collect(new ProcessedEvent(event.getId(), currentState, Instant.now()));
    }
}`,
      language: "java",
      tips: [
        "Use appropriate state backends for your use case",
        "Implement state TTL for memory management",
        "Design state schemas carefully"
      ],
      warnings: [
        "Large state can impact performance",
        "State serialization affects checkpointing"
      ]
    },
    {
      id: 3,
      title: "Enable Stream Replay",
      description: "Implement stream replay capabilities allowing historical data reprocessing for debugging and data recovery.",
      code: `// Stream Replay Implementation
public class StreamReplayService {
    private final KafkaConsumer<String, String> consumer;
    private final StreamExecutionEnvironment env;
    
    public void replayFromTimestamp(Instant startTime, Instant endTime) {
        // Configure consumer for replay
        consumer.seekToBeginning(Collections.singletonList(topicPartition));
        
        // Create replay stream
        DataStream<Event> replayStream = env
            .addSource(new ReplaySource(startTime, endTime))
            .filter(event -> isInTimeRange(event, startTime, endTime))
            .keyBy(Event::getEntityId)
            .process(new ReplayProcessor());
        
        // Process replay stream
        replayStream.addSink(new ReplayResultSink());
    }
    
    private boolean isInTimeRange(Event event, Instant start, Instant end) {
        Instant eventTime = event.getTimestamp();
        return !eventTime.isBefore(start) && !eventTime.isAfter(end);
    }
}`,
      language: "java",
      tips: [
        "Use watermarks for time-based processing",
        "Implement idempotent processing for replay",
        "Monitor replay performance and resource usage"
      ],
      warnings: [
        "Replay can be resource-intensive",
        "Ensure replay doesn't affect production streams"
      ]
    }
  ]

  const implementationChecklist = [
    {
      id: "planning-1",
      title: "Assess Data Requirements",
      description: "Analyze data volume, velocity, variety, and veracity to understand pipeline requirements",
      category: "planning" as const,
      priority: "critical" as const,
      estimatedTime: "1-2 weeks",
      dependencies: []
    },
    {
      id: "planning-2",
      title: "Choose Architecture Pattern",
      description: "Select between Lambda, Kappa, Data Mesh, or hybrid approach based on requirements",
      category: "planning" as const,
      priority: "critical" as const,
      estimatedTime: "1 week",
      dependencies: ["planning-1"]
    },
    {
      id: "planning-3",
      title: "Design Data Contracts",
      description: "Define data schemas, formats, and quality standards for all data sources",
      category: "planning" as const,
      priority: "high" as const,
      estimatedTime: "1 week",
      dependencies: ["planning-2"]
    },
    {
      id: "implementation-1",
      title: "Set Up Infrastructure",
      description: "Provision and configure cloud resources, containers, and networking",
      category: "implementation" as const,
      priority: "high" as const,
      estimatedTime: "1-2 weeks",
      dependencies: ["planning-3"]
    },
    {
      id: "implementation-2",
      title: "Implement Data Ingestion",
      description: "Build connectors and pipelines for data ingestion from various sources",
      category: "implementation" as const,
      priority: "high" as const,
      estimatedTime: "2-3 weeks",
      dependencies: ["implementation-1"]
    },
    {
      id: "implementation-3",
      title: "Create Processing Logic",
      description: "Implement business logic, transformations, and aggregations",
      category: "implementation" as const,
      priority: "high" as const,
      estimatedTime: "3-4 weeks",
      dependencies: ["implementation-2"]
    },
    {
      id: "testing-1",
      title: "Data Quality Testing",
      description: "Test data accuracy, completeness, and consistency across the pipeline",
      category: "testing" as const,
      priority: "high" as const,
      estimatedTime: "1-2 weeks",
      dependencies: ["implementation-3"]
    },
    {
      id: "testing-2",
      title: "Performance Testing",
      description: "Validate throughput, latency, and resource utilization under load",
      category: "testing" as const,
      priority: "medium" as const,
      estimatedTime: "1 week",
      dependencies: ["testing-1"]
    },
    {
      id: "deployment-1",
      title: "Production Deployment",
      description: "Deploy pipeline to production with monitoring and alerting",
      category: "deployment" as const,
      priority: "critical" as const,
      estimatedTime: "1 week",
      dependencies: ["testing-2"]
    },
    {
      id: "monitoring-1",
      title: "Operational Monitoring",
      description: "Set up monitoring for pipeline health, data quality, and performance",
      category: "monitoring" as const,
      priority: "high" as const,
      estimatedTime: "3-5 days",
      dependencies: ["deployment-1"]
    }
  ]

  const architectureDecisionTree = [
    {
      id: "start",
      title: "Enterprise Data Pipeline Architecture Selection",
      description: "Choose the right architecture pattern based on your specific requirements and constraints",
      question: "What is your primary data processing requirement?",
      options: [
        {
          id: "real-time",
          label: "Real-time Processing & Analytics",
          description: "You need immediate insights and real-time decision making",
          nextNode: "real-time-requirements",
          pros: ["Immediate insights", "Real-time decision making", "Competitive advantage"],
          cons: ["Higher complexity", "More expensive", "Harder to maintain"],
          recommendation: "Consider Kappa Architecture or Lambda Architecture"
        },
        {
          id: "batch",
          label: "Batch Processing & Historical Analysis",
          description: "You need comprehensive analysis of historical data",
          nextNode: "batch-requirements",
          pros: ["Comprehensive analysis", "Cost-effective", "Easier to implement"],
          cons: ["Delayed insights", "Limited real-time capabilities", "Batch windows"],
          recommendation: "Consider traditional ETL or Data Lakehouse"
        },
        {
          id: "hybrid",
          label: "Hybrid Real-time & Batch",
          description: "You need both real-time insights and comprehensive historical analysis",
          nextNode: "hybrid-requirements",
          pros: ["Best of both worlds", "Flexible architecture", "Comprehensive analytics"],
          cons: ["Highest complexity", "Most expensive", "Complex maintenance"],
          recommendation: "Consider Lambda Architecture or Data Mesh"
        }
      ]
    },
    {
      id: "real-time-requirements",
      title: "Real-time Processing Requirements",
      description: "Determine the specific real-time requirements to choose the best streaming architecture",
      question: "What is your data volume and update frequency?",
      options: [
        {
          id: "high-volume",
          label: "High Volume, High Frequency",
          description: "Millions of events per second with sub-second latency requirements",
          outcome: "Kappa Architecture",
          pros: ["Streaming-first approach", "Excellent performance", "Simplified architecture"],
          cons: ["Complex state management", "Event replay complexity", "Higher operational overhead"],
          recommendation: "Implement Kappa Architecture with Apache Flink"
        },
        {
          id: "moderate-volume",
          label: "Moderate Volume, Variable Frequency",
          description: "Thousands to millions of events with flexible latency requirements",
          outcome: "Lambda Architecture",
          pros: ["Proven approach", "Flexible processing", "Good performance"],
          cons: ["Dual system complexity", "Data consistency challenges", "Higher maintenance"],
          recommendation: "Use Lambda Architecture with proper serving layer design"
        }
      ]
    }
  ]

  const pipelineTools = [
    {
      id: "apache-kafka",
      name: "Apache Kafka",
      description: "Distributed streaming platform for building real-time data pipelines and streaming applications",
      category: "Streaming Platform",
      pricing: "free" as const,
      features: ["Distributed Streaming", "Fault Tolerance", "Horizontal Scaling", "Real-time Processing", "Event Sourcing"],
      pros: ["Excellent performance", "Strong durability guarantees", "Rich ecosystem", "Open source", "Enterprise ready"],
      cons: ["Complex configuration", "Steep learning curve", "Operational overhead", "Resource intensive"],
      bestFor: ["High-throughput streaming", "Event sourcing", "Real-time pipelines", "Microservices communication"],
      notFor: ["Simple batch processing", "Small datasets", "Basic message queuing"],
      rating: 4.7,
      marketShare: "42.3",
      learningCurve: "hard" as const,
      community: "large" as const,
      documentation: "excellent" as const
    },
    {
      id: "apache-spark",
      name: "Apache Spark",
      description: "Unified analytics engine for large-scale data processing with support for batch and streaming",
      category: "Data Processing",
      pricing: "free" as const,
      features: ["Batch Processing", "Streaming", "Machine Learning", "Graph Processing", "SQL"],
      pros: ["Unified platform", "Excellent performance", "Rich ecosystem", "Multiple languages", "Active development"],
      cons: ["Memory intensive", "Complex tuning", "Steep learning curve", "Operational complexity"],
      bestFor: ["Large-scale batch processing", "ETL pipelines", "Machine learning", "Data exploration"],
      notFor: ["Real-time processing", "Simple transformations", "Small datasets"],
      rating: 4.5,
      marketShare: "38.7",
      learningCurve: "hard" as const,
      community: "large" as const,
      documentation: "excellent" as const
    },
    {
      id: "apache-flink",
      name: "Apache Flink",
      description: "Stream processing framework for high-throughput, low-latency data streaming applications",
      category: "Stream Processing",
      pricing: "free" as const,
      features: ["Stream Processing", "Event Time Processing", "State Management", "Exactly-once Semantics", "CEP"],
      pros: ["Excellent streaming performance", "Event time processing", "Strong consistency", "Rich APIs", "Active community"],
      cons: ["Complex state management", "Steep learning curve", "Operational overhead", "Resource intensive"],
      bestFor: ["Real-time streaming", "Complex event processing", "Stateful applications", "Low-latency requirements"],
      notFor: ["Simple batch processing", "Basic ETL", "Small-scale applications"],
      rating: 4.4,
      marketShare: "15.2",
      learningCurve: "hard" as const,
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
            <span className="px-3 py-1 bg-green-500/20 text-green-600 dark:text-green-400 rounded-full text-sm font-medium">
              Production Ready
            </span>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              Data Engineering
            </span>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Workflow className="w-4 h-4" />
              2025
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Enterprise Data Pipeline Design
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-4xl">
            Master advanced data pipeline architectures including Lambda, Kappa, and Data Mesh patterns. 
            Learn to design scalable, fault-tolerant data systems for enterprise environments.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              <Code2 className="w-4 h-4" />
              View Code Examples
            </button>
            <button className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <Brain className="w-4 h-4" />
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
          <h2 className="text-3xl font-bold mb-8 text-center">Enterprise Data Pipeline Architectures</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Enterprise data pipelines require robust architectures that can handle massive scale, 
                ensure data quality, and provide both real-time and batch processing capabilities. 
                Learn the key patterns and implementation strategies.
              </p>
              <p>
                This comprehensive guide covers the most important data pipeline architectures used in production environments, 
                including detailed implementation examples, trade-offs analysis, and best practices for each pattern.
              </p>
              <ul className="list-disc list-inside mt-4">
                <li>Lambda Architecture for hybrid real-time and batch processing</li>
                <li>Kappa Architecture for unified streaming workflows</li>
                <li>Data Mesh for domain-driven architectures</li>
                <li>Production-ready implementation examples</li>
              </ul>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold mb-4">Architecture Patterns</h3>
              <div className="flex flex-wrap gap-2">
                {["Lambda", "Kappa", "Data Mesh", "Event Sourcing", "Stream Processing"].map((tech) => (
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

        {/* Lambda Architecture Tutorial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Lambda Architecture Implementation</h2>
          <div className="bg-card rounded-2xl border border-border p-8">
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Master the Lambda Architecture pattern that combines batch and stream processing for comprehensive data analytics. 
              Learn to implement speed, batch, and serving layers effectively.
            </p>
            <TutorialSection
              title="Lambda Architecture Implementation"
              description="Master the Lambda Architecture pattern that combines batch and stream processing for comprehensive data analytics. Learn to implement speed, batch, and serving layers effectively."
              steps={lambdaArchitectureSteps}
              type="implementation"
              icon={Workflow}
            />
          </div>
        </motion.div>

        {/* Kappa Architecture Tutorial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Kappa Architecture Implementation</h2>
          <div className="bg-card rounded-2xl border border-border p-8">
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Implement the Kappa Architecture pattern for unified stream processing. 
              Learn to build stateful stream processors with replay capabilities and robust state management.
            </p>
            <TutorialSection
              title="Kappa Architecture Implementation"
              description="Implement the Kappa Architecture pattern for unified stream processing. Learn to build stateful stream processors with replay capabilities and robust state management."
              steps={kappaArchitectureSteps}
              type="implementation"
              icon={Workflow}
            />
          </div>
        </motion.div>

        {/* Architecture Decision Tree */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Pipeline Architecture Selection Guide</h2>
          <div className="bg-card rounded-2xl border border-border p-8">
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Use this interactive decision tree to choose the right data pipeline architecture for your specific requirements and constraints.
            </p>
            <ArchitectureDiagram
              title="Pipeline Architecture Selection Guide"
              description="Use this interactive decision tree to choose the right data pipeline architecture for your specific requirements and constraints."
              type="decision-tree"
              content={architectureDecisionTree}
            />
          </div>
        </motion.div>

        {/* Implementation Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Enterprise Pipeline Implementation Checklist</h2>
          <div className="bg-card rounded-2xl border border-border p-8">
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Follow this comprehensive checklist to ensure successful implementation of enterprise data pipelines with proper planning, testing, and monitoring.
            </p>
            <ImplementationChecklist
              title="Enterprise Pipeline Implementation Checklist"
              description="Follow this comprehensive checklist to ensure successful implementation of enterprise data pipelines with proper planning, testing, and monitoring."
              items={implementationChecklist}
            />
          </div>
        </motion.div>

        {/* Tool Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Data Pipeline Technology Comparison</h2>
          <div className="bg-card rounded-2xl border border-border p-8">
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Compare leading data pipeline technologies to choose the right tools for your architecture. Evaluate performance, learning curve, and community support.
            </p>
            <ToolComparison
              title="Data Pipeline Technology Comparison"
              description="Compare leading data pipeline technologies to choose the right tools for your architecture. Evaluate performance, learning curve, and community support."
              tools={pipelineTools}
              features={[
                { name: "Streaming Capabilities", description: "Real-time data processing capabilities", category: "Performance" },
                { name: "Batch Processing", description: "Large-scale batch data processing", category: "Performance" },
                { name: "State Management", description: "Stateful processing and persistence", category: "Features" },
                { name: "Scalability", description: "Horizontal scaling and fault tolerance", category: "Architecture" },
                { name: "Ecosystem", description: "Available connectors and integrations", category: "Community" }
              ]}
            />
          </div>
        </motion.div>

        {/* Best Practices Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Best Practices & Recommendations</h2>
          <div className="bg-card rounded-2xl border border-border p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-xl font-semibold mb-4">Architecture Selection</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Choose Lambda for hybrid real-time and batch requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Use Kappa for pure streaming workloads</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Consider Data Mesh for domain-driven architectures</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-xl font-semibold mb-4">Implementation Strategy</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Start with a proof of concept</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Implement data quality checks early</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Design for observability from day one</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-primary/5 to-green-600/5 rounded-2xl border border-border p-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Build Enterprise Data Pipelines?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Start implementing these architectures today with our comprehensive guides, 
              code examples, and best practices. Transform your data infrastructure 
              and unlock the full potential of your data.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium">
                <Code2 className="w-5 h-5" />
                View Code Examples
              </button>
              <button className="inline-flex items-center gap-2 px-8 py-4 border border-border rounded-xl hover:bg-muted/50 transition-colors font-medium">
                <Brain className="w-5 h-5" />
                Learn More Patterns
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
