"use client"
import { motion } from "framer-motion"
import { TutorialSection } from "@/components/projects/tutorial-section"
import { ImplementationChecklist } from "@/components/projects/implementation-checklist"
import { ArchitectureDiagram } from "@/components/projects/architecture-diagram"
import { ToolComparison } from "@/components/projects/tool-comparison"
import { Brain, Zap, Shield, TrendingUp, Database, Code2, Cpu, Target, ArrowRight, Lightbulb } from "lucide-react"

export default function RealTimeAnalyticsMLPipelinesPage() {
  const featureStoreSteps = [
    {
      id: 1,
      title: "Design Feature Store Architecture",
      description: "Create a centralized feature store that serves both online (real-time) and offline (batch) feature serving. This requires careful design of feature storage, versioning, and serving layers.",
      code: `// Feature Store Architecture with Redis + PostgreSQL
@Service
public class FeatureStoreService {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    @Autowired
    private FeatureRepository featureRepository;
    
    // Online serving (real-time)
    public Map<String, Object> getFeaturesOnline(String entityId, List<String> featureNames) {
        Map<String, Object> features = new HashMap<>();
        
        for (String featureName : featureNames) {
            String key = String.format("feature:%s:%s", entityId, featureName);
            Object value = redisTemplate.opsForValue().get(key);
            
            if (value != null) {
                features.put(featureName, value);
            } else {
                // Fallback to database for missing features
                Feature feature = featureRepository.findByEntityIdAndName(entityId, featureName);
                if (feature != null) {
                    features.put(featureName, feature.getValue());
                    // Cache for future requests
                    redisTemplate.opsForValue().set(key, feature.getValue(), Duration.ofHours(1));
                }
            }
        }
        
        return features;
    }
    
    // Offline serving (batch)
    public Dataset<Row> getFeaturesOffline(SparkSession spark, String entityType, List<String> featureNames) {
        // Read from feature tables for batch processing
        String featureTable = String.format("features_%s", entityType);
        
        Dataset<Row> features = spark.read()
            .table(featureTable)
            .select("entity_id", featureNames.toArray(new String[0]));
        
        return features;
    }
}`,
      language: "java",
      tips: [
        "Use Redis for online serving with appropriate TTL",
        "Implement feature versioning for model reproducibility",
        "Design for horizontal scaling of feature serving"
      ],
      warnings: [
        "Feature store can become a bottleneck - monitor performance",
        "Ensure data consistency between online and offline stores"
      ]
    },
    {
      id: 2,
      title: "Implement Feature Engineering Pipeline",
      description: "Build automated feature engineering pipelines that transform raw data into ML-ready features. This includes data preprocessing, feature creation, and quality validation.",
      code: `// Apache Spark Feature Engineering Pipeline
public class FeatureEngineeringPipeline {
    
    public Dataset<Row> engineerFeatures(SparkSession spark, Dataset<Row> rawData) {
        // 1. Data cleaning and preprocessing
        Dataset<Row> cleanedData = rawData
            .na().fill(0) // Fill missing values
            .filter(col("amount").isNotNull()) // Remove null amounts
            .filter(col("amount") > 0); // Remove invalid amounts
        
        // 2. Feature creation
        Dataset<Row> features = cleanedData
            .withColumn("amount_log", log(col("amount"))) // Log transformation
            .withColumn("amount_bucket", 
                when(col("amount") < 100, "low")
                .when(col("amount") < 1000, "medium")
                .otherwise("high")) // Categorical bucketing
            .withColumn("day_of_week", dayofweek(col("timestamp"))) // Temporal features
            .withColumn("hour_of_day", hour(col("timestamp")))
            .withColumn("is_weekend", 
                when(dayofweek(col("timestamp")).isin(1, 7), true)
                .otherwise(false));
        
        // 3. Aggregated features
        WindowSpec windowSpec = Window.partitionBy("user_id")
            .orderBy("timestamp")
            .rangeBetween(-30, -1); // Last 30 days
        
        Dataset<Row> aggregatedFeatures = features
            .withColumn("avg_amount_30d", avg("amount").over(windowSpec))
            .withColumn("count_transactions_30d", count("*").over(windowSpec))
            .withColumn("max_amount_30d", max("amount").over(windowSpec));
        
        return aggregatedFeatures;
    }
}`,
      language: "java",
      tips: [
        "Use window functions for time-based aggregations",
        "Implement feature validation and quality checks",
        "Cache intermediate results for performance"
      ],
      warnings: [
        "Feature engineering can be computationally expensive",
        "Monitor memory usage for large datasets"
      ]
    }
  ]

  const modelServingSteps = [
    {
      id: 1,
      title: "Design Model Serving Architecture",
      description: "Create a scalable model serving architecture that can handle multiple models, A/B testing, and canary deployments. This includes model versioning and traffic routing.",
      code: `// Model Serving with A/B Testing
@Service
public class ModelServingService {
    
    @Autowired
    private ModelRegistry modelRegistry;
    
    @Autowired
    private FeatureStoreService featureStore;
    
    public PredictionResponse predict(String entityId, PredictionRequest request) {
        // Get model configuration
        ModelConfig config = modelRegistry.getActiveModel(request.getModelName());
        
        // Get features
        Map<String, Object> features = featureStore.getFeaturesOnline(
            entityId, config.getRequiredFeatures());
        
        // Route to appropriate model version
        ModelVersion modelVersion = routeToModelVersion(config, request);
        
        // Make prediction
        Prediction prediction = modelVersion.predict(features);
        
        // Log prediction for monitoring
        logPrediction(entityId, request, prediction, modelVersion);
        
        return new PredictionResponse(prediction, modelVersion.getVersion());
    }
    
    private ModelVersion routeToModelVersion(ModelConfig config, PredictionRequest request) {
        // A/B testing logic
        if (config.isABTestingEnabled()) {
            String userId = request.getUserId();
            int hash = Math.abs(userId.hashCode());
            
            if (hash % 100 < config.getABTestPercentage()) {
                return config.getBModelVersion(); // New model
            } else {
                return config.getAModelVersion(); // Control model
            }
        }
        
        // Canary deployment logic
        if (config.isCanaryEnabled()) {
            // Route small percentage to new model
            if (Math.random() < config.getCanaryPercentage()) {
                return config.getCanaryModelVersion();
            }
        }
        
        return config.getDefaultModelVersion();
    }
}`,
      language: "java",
      tips: [
        "Implement proper model versioning and rollback",
        "Use consistent hashing for A/B testing",
        "Monitor model performance and drift"
      ],
      warnings: [
        "A/B testing adds complexity - start simple",
        "Ensure proper monitoring for all model versions"
      ]
    }
  ]

  const implementationChecklist = [
    {
      id: "planning-1",
      title: "Define ML Use Cases",
      description: "Identify specific ML use cases and success metrics for your real-time analytics pipeline",
      category: "planning",
      priority: "critical",
      estimatedTime: "1-2 weeks",
      dependencies: []
    },
    {
      id: "planning-2",
      title: "Design Feature Strategy",
      description: "Plan feature engineering strategy, feature store architecture, and data lineage",
      category: "planning",
      priority: "critical",
      estimatedTime: "1-2 weeks",
      dependencies: ["planning-1"]
    },
    {
      id: "planning-3",
      title: "Choose ML Infrastructure",
      description: "Select ML frameworks, model serving platforms, and monitoring tools",
      category: "planning",
      priority: "high",
      estimatedTime: "1 week",
      dependencies: ["planning-2"]
    },
    {
      id: "implementation-1",
      title: "Build Feature Store",
      description: "Implement feature store with online and offline serving capabilities",
      category: "implementation",
      priority: "high",
      estimatedTime: "3-4 weeks",
      dependencies: ["planning-3"]
    },
    {
      id: "implementation-2",
      title: "Create ML Pipeline",
      description: "Build end-to-end ML pipeline from data ingestion to model serving",
      category: "implementation",
      priority: "high",
      estimatedTime: "4-6 weeks",
      dependencies: ["implementation-1"]
    },
    {
      id: "testing-1",
      title: "Model Validation",
      description: "Validate model performance, feature drift, and prediction accuracy",
      category: "testing",
      priority: "high",
      estimatedTime: "1-2 weeks",
      dependencies: ["implementation-2"]
    },
    {
      id: "deployment-1",
      title: "Production Deployment",
      description: "Deploy ML pipeline to production with monitoring and alerting",
      category: "deployment",
      priority: "critical",
      estimatedTime: "1-2 weeks",
      dependencies: ["testing-1"]
    },
    {
      id: "monitoring-1",
      title: "ML Operations",
      description: "Set up MLOps monitoring, model retraining, and performance tracking",
      category: "monitoring",
      priority: "high",
      estimatedTime: "2-3 weeks",
      dependencies: ["deployment-1"]
    }
  ]

  const mlArchitectureDecisionTree = [
    {
      id: "start",
      title: "ML Pipeline Architecture Selection",
      description: "Choose the right ML pipeline architecture based on your specific requirements",
      question: "What is your primary ML use case?",
      options: [
        {
          id: "real-time-prediction",
          label: "Real-time Prediction & Inference",
          description: "You need immediate predictions for real-time decision making",
          nextNode: "real-time-requirements",
          pros: ["Immediate insights", "Real-time actions", "Competitive advantage"],
          cons: ["Higher latency requirements", "More complex infrastructure", "Higher costs"],
          recommendation: "Consider streaming ML pipeline with model serving"
        },
        {
          id: "batch-training",
          label: "Batch Training & Offline Inference",
          description: "You need to train models on historical data and make batch predictions",
          nextNode: "batch-requirements",
          pros: ["Cost-effective", "Easier to implement", "Better model quality"],
          cons: ["Delayed insights", "Limited real-time capabilities", "Batch processing windows"],
          recommendation: "Consider traditional ML pipeline with scheduled training"
        },
        {
          id: "hybrid-ml",
          label: "Hybrid Real-time & Batch",
          description: "You need both real-time inference and periodic model retraining",
          nextNode: "hybrid-requirements",
          pros: ["Best of both worlds", "Flexible architecture", "Continuous improvement"],
          cons: ["Highest complexity", "Most expensive", "Complex maintenance"],
          recommendation: "Consider hybrid ML pipeline with feature store"
        }
      ]
    }
  ]

  const mlTools = [
    {
      id: "mlflow",
      name: "MLflow",
      description: "Open-source platform for managing the end-to-end machine learning lifecycle",
      category: "ML Platform",
      pricing: "free",
      features: ["Experiment Tracking", "Model Registry", "Model Serving", "Deployment", "Reproducibility"],
      pros: ["Excellent experiment tracking", "Model versioning", "Easy deployment", "Open source", "Good documentation"],
      cons: ["Limited enterprise features", "Basic model serving", "Community support only"],
      bestFor: ["Experiment tracking", "Model management", "Small to medium teams", "Open source adoption"],
      notFor: ["Enterprise ML platforms", "Advanced model serving", "Large-scale deployments"],
      rating: 4.3,
      marketShare: "18.5",
      learningCurve: "easy",
      community: "large",
      documentation: "good"
    },
    {
      id: "tensorflow-serving",
      name: "TensorFlow Serving",
      description: "High-performance serving system for machine learning models designed for production environments",
      category: "Model Serving",
      pricing: "free",
      features: ["High Performance", "Model Versioning", "A/B Testing", "REST/gRPC APIs", "Docker Support"],
      pros: ["Excellent performance", "Production ready", "Good versioning", "Flexible APIs", "Docker support"],
      cons: ["TensorFlow specific", "Complex configuration", "Limited model formats"],
      bestFor: ["TensorFlow models", "High-performance serving", "Production deployments", "A/B testing"],
      notFor: ["Non-TensorFlow models", "Simple deployments", "Quick prototyping"],
      rating: 4.6,
      marketShare: "25.3",
      learningCurve: "medium",
      community: "large",
      documentation: "good"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950">
      {/* Hero Section */}
      <motion.div
        className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-700 dark:from-purple-800 dark:via-pink-800 dark:to-indigo-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-indigo-700/20" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <div className="text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-medium mb-8 border border-white/20">
                <Brain className="w-5 h-5" />
                AI/ML & Real-time Analytics
                <ArrowRight className="w-4 h-4" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
                Real-time Analytics &
                <span className="block bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                  ML Pipelines
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-purple-100 max-w-4xl mx-auto leading-relaxed">
                Build production-ready ML pipelines with real-time analytics, automated model serving, and continuous learning capabilities. 
                Master feature engineering, model deployment, and MLOps practices.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                <Zap className="w-5 h-5 text-yellow-300" />
                <span className="font-medium text-white">Real-time Processing</span>
              </div>
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                <Brain className="w-5 h-5 text-blue-300" />
                <span className="font-medium text-white">ML Production</span>
              </div>
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                <Target className="w-5 h-5 text-green-300" />
                <span className="font-medium text-white">Continuous Learning</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Overview Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Lightbulb className="w-4 h-4" />
              Why This Matters
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Why Real-time Analytics & ML Pipelines Matter
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              In today's competitive landscape, organizations need to make data-driven decisions in real-time. 
              ML pipelines that can process data, train models, and serve predictions continuously provide a significant competitive advantage.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="group text-center p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Real-time Insights</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Process data as it arrives and provide immediate insights for real-time decision making and automated actions.
              </p>
            </motion.div>

            <motion.div 
              className="group text-center p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">ML Production</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Deploy ML models to production with proper monitoring, A/B testing, and continuous improvement capabilities.
              </p>
            </motion.div>

            <motion.div 
              className="group text-center p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Continuous Learning</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Implement feedback loops that continuously improve models based on new data and performance metrics.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Tutorial Sections */}
        <div className="space-y-20">
          {/* Feature Store Tutorial */}
          <TutorialSection
            title="Feature Store Implementation Guide"
            description="Learn to implement a centralized feature store that serves both online and offline feature serving. Master feature engineering, versioning, and serving patterns."
            steps={featureStoreSteps}
            type="implementation"
            icon={Database}
          />

          {/* Model Serving Tutorial */}
          <TutorialSection
            title="Model Serving Architecture Guide"
            description="Master model serving patterns including A/B testing, canary deployments, and traffic routing. Learn to build scalable and reliable model serving systems."
            steps={modelServingSteps}
            type="implementation"
            icon={Cpu}
          />
        </div>

        {/* Decision Tree */}
        <div className="my-20">
          <ArchitectureDiagram
            title="ML Pipeline Architecture Decision Tree"
            description="Use this interactive decision tree to choose the right ML pipeline architecture for your specific requirements. Get personalized recommendations."
            type="decision-tree"
            content={mlArchitectureDecisionTree}
          />
        </div>

        {/* Implementation Checklist */}
        <div className="my-20">
          <ImplementationChecklist
            title="ML Pipeline Implementation Checklist"
            description="Follow this comprehensive checklist to ensure you cover all critical aspects of implementing real-time analytics and ML pipelines."
            items={implementationChecklist}
          />
        </div>

        {/* Tool Comparison */}
        <div className="my-20">
          <ToolComparison
            title="ML Platform & Tools Comparison"
            description="Compare different ML platforms and tools to choose the right technology stack for your ML pipeline implementation."
            tools={mlTools}
            features={[]}
          />
        </div>

        {/* Next Steps */}
        <motion.div
          className="text-center py-20 bg-gradient-to-r from-slate-50 to-purple-50 dark:from-slate-800 dark:to-purple-900/20 rounded-3xl border border-slate-200 dark:border-slate-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="max-w-3xl mx-auto px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
              Ready to Build Production ML Pipelines?
            </h2>
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              You now have the knowledge and tools to implement production-ready ML pipelines. 
              Start with the implementation checklist and work through the tutorials step by step.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <button className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1">
                Download ML Pipeline Guide
                <ArrowRight className="w-5 h-5 ml-2 inline group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button className="px-8 py-4 border-2 border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300 font-semibold text-lg">
                Schedule ML Architecture Review
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
