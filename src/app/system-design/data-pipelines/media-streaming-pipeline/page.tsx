import { Metadata } from 'next'
import { TutorialSection } from '@/components/projects/tutorial-section'
import { ImplementationChecklist } from '@/components/projects/implementation-checklist'
import { ArchitectureDiagram } from '@/components/projects/architecture-diagram'
import { ToolComparison } from '@/components/projects/tool-comparison'
import { 
  Video, 
  Database, 
  BarChart3, 
  Zap,
  Users,
  Activity
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Media Streaming Analytics Pipeline - System Design',
  description: 'Comprehensive guide to building real-time analytics pipelines for media streaming platforms.',
}

export default function MediaStreamingPipelinePage() {
  const tutorialSteps = [
    {
      id: 1,
      title: "Streaming Data Modeling",
      description: "Design comprehensive data models for capturing streaming events, user behavior, and content analytics.",
      code: `-- Streaming Events Fact Table
CREATE TABLE fact_stream_events (
    event_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    content_id BIGINT NOT NULL,
    event_timestamp TIMESTAMP(3) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    position_seconds INT,
    quality_level VARCHAR(20),
    device_type VARCHAR(50),
    network_quality VARCHAR(20),
    session_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user_content_time (user_id, content_id, event_timestamp),
    INDEX idx_event_type (event_type),
    INDEX idx_session (session_id)
);

-- Content Dimension Table
CREATE TABLE dim_content (
    content_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    content_title VARCHAR(255) NOT NULL,
    content_type VARCHAR(50),
    genre_primary VARCHAR(100),
    genre_secondary JSON,
    release_date DATE,
    duration_minutes INT,
    language VARCHAR(10),
    age_rating VARCHAR(10),
    cast_members JSON,
    director VARCHAR(255)
);

-- User Dimension Table
CREATE TABLE dim_users (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_name VARCHAR(255),
    age_group VARCHAR(20),
    location_country VARCHAR(100),
    subscription_type VARCHAR(50),
    join_date DATE,
    preferences JSON
);`,
      language: "sql",
      tips: [
        "Implement composite indexes for frequent queries",
        "Use calculated engagement metrics",
        "Partition by date for performance"
      ],
      warnings: [
        "Streaming data can be voluminous",
        "Plan retention based on business needs"
      ]
    },
    {
      id: 2,
      title: "Real-time Analytics Pipeline",
      description: "Build a streaming pipeline for real-time content recommendations and user behavior analysis.",
      code: `// Real-time Streaming Analytics with Flink
@Slf4j
public class StreamingAnalyticsProcessor {
    
    private final StreamExecutionEnvironment env;
    private final KafkaSource<StreamEvent> source;
    
    public StreamingAnalyticsProcessor() {
        this.env = StreamExecutionEnvironment.getExecutionEnvironment();
        this.source = KafkaSource.<StreamEvent>builder()
            .setBootstrapServers("localhost:9092")
            .setTopics("streaming-events")
            .setGroupId("analytics-processor")
            .setStartingOffsets(OffsetsInitializer.latest())
            .build();
    }
    
    public void processStream() {
        env.fromSource(source, WatermarkStrategy.noWatermarks(), "Streaming Events")
            .map(new EventDeserializer())
            .keyBy(StreamEvent::getUserId)
            .window(TumblingProcessingTimeWindows.of(Time.seconds(5)))
            .aggregate(new UserEngagementAggregator())
            .process(new RecommendationProcessor())
            .addSink(new RedisSink());
    }
}

// User Engagement Aggregator
public class UserEngagementAggregator implements AggregateFunction<StreamEvent, UserEngagement, UserEngagement> {
    
    @Override
    public UserEngagement createAccumulator() {
        return new UserEngagement();
    }
    
    @Override
    public UserEngagement add(StreamEvent event, UserEngagement accumulator) {
        accumulator.addEvent(event);
        return accumulator;
    }
    
    @Override
    public UserEngagement getResult(UserEngagement accumulator) {
        return accumulator;
    }
    
    @Override
    public UserEngagement merge(UserEngagement a, UserEngagement b) {
        return a.merge(b);
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
      id: 3,
      title: "Content Recommendation Engine",
      description: "Implement machine learning models for personalized content recommendations.",
      code: `# Content Recommendation Engine
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import redis
import json

class ContentRecommendationEngine:
    def __init__(self, redis_client):
        self.redis_client = redis_client
        self.tfidf = TfidfVectorizer(max_features=1000)
        self.content_features = None
        
    def train_model(self, content_data):
        """Train the recommendation model"""
        # Prepare content features
        content_text = content_data['title'] + ' ' + content_data['genre'] + ' ' + content_data['description']
        
        # TF-IDF vectorization
        self.content_features = self.tfidf.fit_transform(content_text)
        
        # Store in Redis for real-time access
        self._store_features()
    
    def get_recommendations(self, user_id, n_recommendations=10):
        """Get personalized recommendations for a user"""
        # Get user preferences and viewing history
        user_profile = self._get_user_profile(user_id)
        
        # Calculate similarity scores
        user_vector = self._create_user_vector(user_profile)
        similarities = cosine_similarity(user_vector, self.content_features)
        
        # Get top recommendations
        top_indices = np.argsort(similarities[0])[-n_recommendations:][::-1]
        
        return [self.content_data.iloc[i] for i in top_indices]
    
    def update_user_preferences(self, user_id, content_id, rating):
        """Update user preferences based on new interactions"""
        user_key = f"user:{user_id}:preferences"
        
        # Get current preferences
        current_prefs = self.redis_client.get(user_key)
        if current_prefs:
            prefs = json.loads(current_prefs)
        else:
            prefs = {'ratings': {}, 'genres': {}, 'actors': {}}
        
        # Update preferences
        prefs['ratings'][content_id] = rating
        
        # Store updated preferences
        self.redis_client.setex(user_key, 3600, json.dumps(prefs))  # 1 hour TTL
    
    def _store_features(self):
        """Store model features in Redis for real-time access"""
        feature_key = "content:features"
        self.redis_client.setex(feature_key, 3600, self.content_features.tobytes())
    
    def _get_user_profile(self, user_id):
        """Retrieve user profile from Redis"""
        user_key = f"user:{user_id}:profile"
        profile = self.redis_client.get(user_key)
        return json.loads(profile) if profile else {}
    
    def _create_user_vector(self, user_profile):
        """Create user feature vector for similarity calculation"""
        # Implementation depends on user profile structure
        # This is a simplified example
        return np.zeros((1, self.content_features.shape[1]))`,
      language: "python",
      tips: [
        "Use Redis for ultra-low latency access",
        "Implement hybrid recommendation algorithms",
        "Cache frequent recommendations"
      ],
      warnings: [
        "Real-time recommendations can be expensive",
        "Test recommendation quality with A/B testing"
      ]
    }
  ]

  const implementationChecklist = [
    {
      id: "planning-1",
      title: "Data Model Design",
      description: "Design streaming data models and schemas",
      category: "planning" as const,
      priority: "high" as const,
      estimatedTime: "1-2 weeks",
      dependencies: []
    },
    {
      id: "implementation-1",
      title: "Streaming Pipeline",
      description: "Implement real-time data processing pipeline",
      category: "implementation" as const,
      priority: "high" as const,
      estimatedTime: "2-3 weeks",
      dependencies: ["planning-1"]
    },
    {
      id: "implementation-2",
      title: "Recommendation Engine",
      description: "Build ML-based recommendation system",
      category: "implementation" as const,
      priority: "high" as const,
      estimatedTime: "3-4 weeks",
      dependencies: ["implementation-1"]
    },
    {
      id: "implementation-3",
      title: "Real-time Serving",
      description: "Set up low-latency data serving",
      category: "implementation" as const,
      priority: "medium" as const,
      estimatedTime: "1-2 weeks",
      dependencies: ["implementation-2"]
    }
  ]

  const architectureDecisionTree = [
    {
      id: "start",
      title: "Media Streaming Architecture Selection",
      description: "Choose the right streaming analytics architecture based on your requirements",
      question: "What is your primary requirement?",
      options: [
        {
          id: "real-time-recommendations",
          label: "Real-time recommendations",
          description: "Requires streaming pipeline and ML models",
          nextNode: "real-time-recommendations",
          pros: ["Immediate insights", "Real-time decision making", "Competitive advantage"],
          cons: ["Higher complexity", "More expensive", "Harder to maintain"],
          recommendation: "Consider streaming architecture with ML models"
        },
        {
          id: "content-analytics",
          label: "Content analytics",
          description: "Focus on content performance metrics",
          nextNode: "content-analytics",
          pros: ["Comprehensive analysis", "Cost-effective", "Easier to implement"],
          cons: ["Delayed insights", "Limited real-time capabilities", "Batch windows"],
          recommendation: "Consider batch processing with analytics"
        },
        {
          id: "user-tracking",
          label: "User behavior tracking",
          description: "Track individual user interactions",
          nextNode: "user-tracking",
          pros: ["User insights", "Personalization", "Engagement tracking"],
          cons: ["Privacy concerns", "Data volume", "Complex analysis"],
          recommendation: "Consider event streaming with user analytics"
        }
      ]
    }
  ]

  const pipelineTools = [
    {
      id: "apache-kafka",
      name: "Apache Kafka",
      description: "Distributed streaming platform for high-throughput event ingestion",
      category: "Streaming Platform",
      pricing: "free" as const,
      features: ["High throughput", "Fault tolerance", "Scalability", "Real-time processing"],
      pros: ["Excellent performance", "Large ecosystem", "Production ready", "Good documentation"],
      cons: ["Complex setup", "Steep learning curve", "Resource intensive"],
      bestFor: ["High-volume real-time data streaming", "Event sourcing", "Real-time pipelines"],
      notFor: ["Simple batch processing", "Small datasets", "Basic message queuing"],
      rating: 4.8,
      marketShare: "42.3",
      learningCurve: "hard" as const,
      community: "large" as const,
      documentation: "excellent" as const
    },
    {
      id: "apache-flink",
      name: "Apache Flink",
      description: "Stream processing framework for real-time analytics",
      category: "Stream Processing",
      pricing: "free" as const,
      features: ["Event time processing", "Exactly-once semantics", "State management", "CEP support"],
      pros: ["Advanced streaming features", "Excellent performance", "Rich APIs", "Active development"],
      cons: ["Complex configuration", "Resource intensive", "Limited ecosystem"],
      bestFor: ["Complex event processing", "Real-time analytics", "Stateful applications"],
      notFor: ["Simple data transformations", "Basic ETL", "Small-scale applications"],
      rating: 4.6,
      marketShare: "15.2",
      learningCurve: "hard" as const,
      community: "medium" as const,
      documentation: "good" as const
    },
    {
      id: "redis",
      name: "Redis",
      description: "In-memory data structure store for low-latency serving",
      category: "In-Memory Store",
      pricing: "free" as const,
      features: ["In-memory storage", "Multiple data structures", "Pub/Sub", "Lua scripting"],
      pros: ["Ultra-fast access", "Simple to use", "Rich data structures", "Good documentation"],
      cons: ["Memory constraints", "Limited persistence", "No complex queries"],
      bestFor: ["Caching", "Session storage", "Real-time recommendations", "Leaderboards"],
      notFor: ["Large persistent data", "Complex analytics", "Ad-hoc queries"],
      rating: 4.5,
      marketShare: "28.9",
      learningCurve: "medium" as const,
      community: "large" as const,
      documentation: "good" as const
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Video className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Media Streaming Analytics Pipeline</h1>
              <p className="text-muted-foreground">Real-time analytics and recommendations for streaming platforms</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-yellow-600" />
                <span className="font-semibold">Real-time Analytics</span>
              </div>
              <p className="text-sm text-muted-foreground">Sub-second latency for live recommendations</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="font-semibold">User Behavior</span>
              </div>
              <p className="text-sm text-muted-foreground">Track individual user interactions and preferences</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-green-600" />
                <span className="font-semibold">Content Analytics</span>
              </div>
              <p className="text-sm text-muted-foreground">Performance metrics and content insights</p>
            </div>
          </div>
        </div>

        {/* Tutorial Sections */}
        <div className="space-y-8">
          <TutorialSection
            title="Media Streaming Analytics Implementation"
            description="Master the implementation of real-time streaming analytics for media platforms with comprehensive data modeling, streaming pipelines, and ML-based recommendations."
            steps={tutorialSteps}
            type="implementation"
            icon={Video}
          />
        </div>

        {/* Implementation Checklist */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Implementation Checklist</h2>
          <ImplementationChecklist
            title="Media Streaming Pipeline Implementation Checklist"
            description="Follow this comprehensive checklist to ensure successful implementation of media streaming analytics with real-time recommendations and user behavior tracking."
            items={implementationChecklist}
          />
        </div>

        {/* Architecture Decision Tree */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Architecture Decision Tree</h2>
          <ArchitectureDiagram
            title="Pipeline Architecture Selection Guide"
            description="Use this interactive decision tree to choose the right streaming analytics architecture for your specific requirements and constraints."
            type="decision-tree"
            content={architectureDecisionTree}
          />
        </div>

        {/* Tool Comparison */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Technology Stack Comparison</h2>
          <ToolComparison
            title="Data Pipeline Technology Comparison"
            description="Compare leading streaming technologies to choose the right tools for your architecture. Evaluate performance, learning curve, and community support."
            tools={pipelineTools}
            features={[
              { name: "Streaming Capabilities", description: "Real-time data processing capabilities", category: "Performance" },
              { name: "State Management", description: "Stateful processing and persistence", category: "Features" },
              { name: "Scalability", description: "Horizontal scaling and fault tolerance", category: "Architecture" },
              { name: "Ecosystem", description: "Available connectors and integrations", category: "Community" }
            ]}
          />
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Build Your Media Streaming Pipeline?</h2>
          <p className="text-purple-100 mb-6">
            Start implementing these patterns for real-time streaming analytics and recommendations.
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
