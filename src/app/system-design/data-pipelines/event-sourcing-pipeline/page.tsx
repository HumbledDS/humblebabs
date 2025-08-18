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
  title: 'Event Sourcing Pipeline - System Design',
  description: 'Comprehensive guide to building event sourcing pipelines for audit trails and data reconstruction.',
}

export default function EventSourcingPipelinePage() {
  const tutorialSteps = [
    {
      title: "Event Sourcing Architecture",
      description: "Design an event sourcing pipeline that captures all state changes as a sequence of events.",
      icon: Database,
      content: `
        ## Event Sourcing Components
        
        ### Core Concepts
        - **Event Store**: Immutable append-only log of events
        - **Event Streams**: Ordered sequence of related events
        - **Aggregates**: Business entities that generate events
        - **Projections**: Read models built from event streams
        
        ### Data Flow
        1. **Command Handling**: Business commands trigger events
        2. **Event Generation**: Domain events are created and stored
        3. **Event Publishing**: Events are published to subscribers
        4. **Projection Building**: Read models are updated from events
        
        ### Key Benefits
        - **Audit Trail**: Complete history of all changes
        - **Temporal Queries**: Query data at any point in time
        - **Event Replay**: Rebuild state from historical events
        - **Scalability**: Separate read and write concerns
      `,
      codeBlock: {
        language: 'java',
        code: `// Event Sourcing Implementation
@Entity
public class CustomerAggregate {
    
    @Id
    private String customerId;
    
    @Version
    private Long version;
    
    private String name;
    private String email;
    private CustomerStatus status;
    
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<DomainEvent> uncommittedEvents = new ArrayList<>();
    
    public void createCustomer(String name, String email) {
        if (this.customerId != null) {
            throw new IllegalStateException("Customer already exists");
        }
        
        CustomerCreatedEvent event = new CustomerCreatedEvent(
            UUID.randomUUID().toString(),
            name,
            email,
            Instant.now()
        );
        
        apply(event);
        uncommittedEvents.add(event);
    }
    
    public void updateEmail(String newEmail) {
        if (this.customerId == null) {
            throw new IllegalStateException("Customer does not exist");
        }
        
        EmailUpdatedEvent event = new EmailUpdatedEvent(
            this.customerId,
            this.email,
            newEmail,
            Instant.now()
        );
        
        apply(event);
        uncommittedEvents.add(event);
    }
    
    private void apply(DomainEvent event) {
        if (event instanceof CustomerCreatedEvent) {
            CustomerCreatedEvent e = (CustomerCreatedEvent) event;
            this.customerId = e.getCustomerId();
            this.name = e.getName();
            this.email = e.getEmail();
            this.status = CustomerStatus.ACTIVE;
        } else if (event instanceof EmailUpdatedEvent) {
            EmailUpdatedEvent e = (EmailUpdatedEvent) event;
            this.email = e.getNewEmail();
        }
        
        this.version++;
    }
    
    public List<DomainEvent> getUncommittedEvents() {
        return new ArrayList<>(uncommittedEvents);
    }
    
    public void markEventsAsCommitted() {
        uncommittedEvents.clear();
    }
}`
      }
    },
    {
      title: "Event Store & Projections",
      description: "Implement event storage and build read models from event streams.",
      icon: BarChart3,
      content: `
        ## Event Storage Strategy
        
        ### Event Store Design
        - **Event Schema**: Structured event data with metadata
        - **Stream Management**: Organize events by aggregate ID
        - **Versioning**: Optimistic concurrency control
        - **Persistence**: Database or message queue storage
        
        ### Projection Building
        - **Event Handlers**: Process events to update read models
        - **Materialized Views**: Pre-computed query results
        - **CQRS Pattern**: Separate command and query models
        - **Event Replay**: Rebuild projections from historical events
        
        ### Performance Optimization
        - **Event Sourcing**: Store only events, not state
        - **Snapshot Strategy**: Periodic state snapshots
        - **Read Model Caching**: Cache frequently accessed data
        - **Event Batching**: Process events in batches
      `,
      codeBlock: {
        language: 'java',
        code: `// Event Store Implementation
@Repository
public class EventStore {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    public void appendEvents(String aggregateId, List<DomainEvent> events, long expectedVersion) {
        jdbcTemplate.execute(status -> {
            // Check version for optimistic concurrency
            Long currentVersion = jdbcTemplate.queryForObject(
                "SELECT version FROM aggregates WHERE aggregate_id = ?",
                Long.class,
                aggregateId
            );
            
            if (currentVersion != null && currentVersion != expectedVersion) {
                throw new ConcurrencyException("Version mismatch");
            }
            
            // Insert events
            for (DomainEvent event : events) {
                jdbcTemplate.update(
                    "INSERT INTO events (event_id, aggregate_id, event_type, event_data, version, timestamp) VALUES (?, ?, ?, ?, ?, ?)",
                    event.getEventId(),
                    aggregateId,
                    event.getClass().getSimpleName(),
                    serializeEvent(event),
                    expectedVersion + 1,
                    event.getTimestamp()
                );
            }
            
            // Update aggregate version
            if (currentVersion == null) {
                jdbcTemplate.update(
                    "INSERT INTO aggregates (aggregate_id, version) VALUES (?, ?)",
                    aggregateId,
                    expectedVersion + events.size()
                );
            } else {
                jdbcTemplate.update(
                    "UPDATE aggregates SET version = ? WHERE aggregate_id = ?",
                    expectedVersion + events.size(),
                    aggregateId
                );
            }
            
            return null;
        });
    }
    
    public List<DomainEvent> getEvents(String aggregateId, long fromVersion) {
        return jdbcTemplate.query(
            "SELECT event_type, event_data, version, timestamp FROM events WHERE aggregate_id = ? AND version > ? ORDER BY version",
            new Object[]{aggregateId, fromVersion},
            (rs, rowNum) -> deserializeEvent(
                rs.getString("event_type"),
                rs.getString("event_data"),
                rs.getLong("version"),
                rs.getTimestamp("timestamp").toInstant()
            )
        );
    }
    
    private String serializeEvent(DomainEvent event) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.writeValueAsString(event);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize event", e);
        }
    }
    
    private DomainEvent deserializeEvent(String eventType, String eventData, long version, Instant timestamp) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            Class<?> eventClass = Class.forName("com.example.events." + eventType);
            DomainEvent event = (DomainEvent) mapper.readValue(eventData, eventClass);
            event.setVersion(version);
            event.setTimestamp(timestamp);
            return event;
        } catch (Exception e) {
            throw new RuntimeException("Failed to deserialize event", e);
        }
    }
}`
      }
    }
  ]

  const implementationChecklist = [
    {
      id: '1',
      title: 'Event Store Design',
      description: 'Design event storage schema and structure',
      category: 'planning' as const,
      priority: 'high' as const,
      completed: false,
      details: 'Plan event schema, storage strategy, and versioning approach'
    },
    {
      id: '2',
      title: 'Aggregate Implementation',
      description: 'Implement domain aggregates with event generation',
      category: 'implementation' as const,
      priority: 'high' as const,
      completed: false,
      details: 'Build aggregates that generate and apply domain events'
    },
    {
      id: '3',
      title: 'Event Handlers',
      description: 'Implement event handlers for projection building',
      category: 'implementation' as const,
      priority: 'high' as const,
      completed: false,
      details: 'Create event handlers to update read models and projections'
    },
    {
      id: '4',
      title: 'Event Replay',
      description: 'Implement event replay for state reconstruction',
      category: 'implementation' as const,
      priority: 'medium' as const,
      completed: false,
      details: 'Build mechanisms to replay events and rebuild state'
    }
  ]

  const decisionTree = {
    title: "Event Sourcing Decisions",
    description: "Decision tree for choosing event sourcing architecture",
    nodes: [
      {
        id: 'start',
        title: 'Primary Requirements Assessment',
        description: 'Determine your primary event sourcing requirements',
        question: 'What is your primary requirement?',
        options: [
          {
            id: 'audit-trail-option',
            label: 'Audit trail',
            nextNode: 'audit-trail',
            description: 'Use event sourcing for compliance',
            pros: ['Complete history', 'Compliance ready', 'Audit trail'],
            cons: ['Storage overhead', 'Complexity'],
            recommendation: 'Use for compliance and audit requirements'
          },
          {
            id: 'temporal-queries-option',
            label: 'Temporal queries',
            nextNode: 'temporal-queries',
            description: 'Query data at specific points in time',
            pros: ['Time-based analysis', 'Historical insights'],
            cons: ['Query complexity', 'Performance impact'],
            recommendation: 'Use for time-series analysis needs'
          },
          {
            id: 'event-replay-option',
            label: 'Event replay',
            nextNode: 'event-replay',
            description: 'Rebuild state from historical events',
            pros: ['State reconstruction', 'Debugging', 'Testing'],
            cons: ['Processing time', 'Resource intensive'],
            recommendation: 'Use for debugging and testing scenarios'
          }
        ]
      }
    ]
  }

  const tools = [
    {
      id: 'eventstoredb',
      name: 'EventStoreDB',
      category: 'database' as const,
      description: 'Event sourcing database with built-in event storage',
      features: ['Event storage', 'Streams', 'Projections', 'Event replay'],
      pros: ['Purpose-built for event sourcing', 'Excellent performance', 'Built-in projections'],
      cons: ['Vendor lock-in', 'Limited ecosystem', 'Steep learning curve'],
      bestFor: ['Event sourcing applications'],
      notFor: ['Traditional CRUD applications'],
      pricing: 'paid' as const,
      rating: 4.5,
      marketShare: 'Medium',
      learningCurve: 'hard' as const,
      community: 'medium' as const,
      documentation: 'good' as const
    },
    {
      id: 'apache-kafka',
      name: 'Apache Kafka',
      category: 'streaming' as const,
      description: 'Distributed streaming platform for event storage',
      features: ['High throughput', 'Fault tolerance', 'Scalability', 'Event streaming'],
      pros: ['Excellent performance', 'Large ecosystem', 'Production ready'],
      cons: ['Complex setup', 'Not purpose-built for event sourcing'],
      bestFor: ['High-volume event streaming'],
      notFor: ['Simple event sourcing'],
      pricing: 'free' as const,
      rating: 4.8,
      marketShare: 'Very High',
      learningCurve: 'hard' as const,
      community: 'large' as const,
      documentation: 'excellent' as const
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Event Sourcing Pipeline</h1>
              <p className="text-muted-foreground">Event-driven architecture for audit trails and state reconstruction</p>
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
            title="Event Sourcing Pipeline Implementation Checklist"
            description="Follow this comprehensive checklist to ensure successful implementation of your event sourcing pipeline"
            items={implementationChecklist}
          />
        </div>

        {/* Architecture Decision Tree */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Architecture Decision Tree</h2>
          <ArchitectureDiagram 
            title="Event Sourcing Architecture Decisions"
            description="Decision tree for choosing the right event sourcing architecture"
            type="decision-tree"
            content={decisionTree.nodes}
          />
        </div>

        {/* Tool Comparison */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Technology Stack Comparison</h2>
          <ToolComparison 
            title="Technology Stack Comparison"
            description="Compare different event sourcing technologies"
            tools={tools}
            features={[]}
          />
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Build Your Event Sourcing Pipeline?</h2>
          <p className="text-green-100 mb-6">
            Start implementing these patterns for event-driven architecture.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
              Download Architecture Template
            </button>
            <button className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
              Schedule Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
