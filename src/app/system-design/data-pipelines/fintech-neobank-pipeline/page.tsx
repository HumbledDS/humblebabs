"use client"

import { motion } from "framer-motion"
import { TutorialSection } from "@/components/projects/tutorial-section"
import { ImplementationChecklist } from "@/components/projects/implementation-checklist"
import { ArchitectureDiagram } from "@/components/projects/architecture-diagram"
import { ToolComparison } from "@/components/projects/tool-comparison"
import { Shield, Zap, Database, Code2, Brain, CheckCircle, AlertTriangle, ArrowRight, Lightbulb, CreditCard, Lock, TrendingUp } from "lucide-react"

export default function FinTechNeoBankPipelinePage() {
  const dataModelingSteps = [
    {
      id: 1,
      title: "Modélisation des Faits Financiers",
      description: "Conception des tables de faits pour capturer chaque transaction avec granularité atomique et traçabilité complète.",
      code: `-- Table de faits principale pour les transactions
CREATE TABLE FACT_TRANSACTION (
    transaction_sk BIGINT PRIMARY KEY AUTO_INCREMENT,
    transaction_id VARCHAR(50) NOT NULL,
    transaction_timestamp TIMESTAMP(3) NOT NULL,
    sender_customer_sk INT,
    receiver_customer_sk INT,
    merchant_sk INT,
    date_sk INT NOT NULL,
    time_sk INT NOT NULL,
    transaction_type_sk INT NOT NULL,
    channel_sk INT NOT NULL,
    amount_euro DECIMAL(19,4) ENCRYPTED,
    fee_amount DECIMAL(19,4),
    fraud_score DECIMAL(3,2),
    is_flagged_fraud BOOLEAN DEFAULT FALSE,
    processing_time_ms INT,
    authorization_code VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_date_customer (date_sk, sender_customer_sk),
    INDEX idx_merchant_date (merchant_sk, date_sk),
    INDEX idx_fraud_score (fraud_score) WHERE fraud_score > 0.7
);

-- Table pour les décisions de crédit
CREATE TABLE FACT_CREDIT_DECISION (
    decision_sk BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_sk INT NOT NULL,
    application_id VARCHAR(50) NOT NULL,
    requested_amount DECIMAL(19,4),
    approved_amount DECIMAL(19,4),
    credit_score INT,
    risk_tier VARCHAR(20),
    decision_reason TEXT,
    decision_timestamp TIMESTAMP,
    
    INDEX idx_customer_decision (customer_sk, decision_timestamp)
);`,
      language: "sql",
      tips: [
        "Utilisez des clés surrogate pour les performances et la sécurité",
        "Implémentez des index partiels pour les scores de fraude élevés",
        "Chiffrez les montants sensibles au niveau colonne"
      ],
      warnings: [
        "Évitez de stocker des PII dans les tables de faits",
        "Planifiez le partitionnement par date pour les grandes tables"
      ]
    },
    {
      id: 2,
      title: "Dimensions Client et Marchand",
      description: "Création des dimensions pour le contexte business avec gestion des changements temporels et anonymisation.",
      code: `-- Dimension client avec SCD Type 2
CREATE TABLE DIM_CUSTOMER (
    customer_sk INT PRIMARY KEY AUTO_INCREMENT,
    customer_id VARCHAR(50) NOT NULL,
    age_group VARCHAR(20),
    gender VARCHAR(10),
    location_tier VARCHAR(20),
    segment VARCHAR(20),
    risk_score VARCHAR(20),
    registration_date DATE,
    last_activity_date DATE,
    valid_from TIMESTAMP NOT NULL,
    valid_to TIMESTAMP NULL,
    is_current BOOLEAN DEFAULT TRUE,
    
    INDEX idx_customer_id (customer_id),
    INDEX idx_current (is_current)
);

-- Dimension marchand avec enrichissement des risques
CREATE TABLE DIM_MERCHANT (
    merchant_sk INT PRIMARY KEY AUTO_INCREMENT,
    merchant_id VARCHAR(50) NOT NULL,
    merchant_name VARCHAR(255),
    mcc_code VARCHAR(10),
    country_code VARCHAR(3),
    risk_level VARCHAR(20),
    fraud_rate DECIMAL(5,4),
    avg_transaction_amount DECIMAL(19,4),
    last_risk_assessment_date DATE,
    
    INDEX idx_merchant_id (merchant_id),
    INDEX idx_risk_level (risk_level)
);`,
      language: "sql",
      tips: [
        "Implémentez SCD Type 2 pour l'historique des changements",
        "Utilisez des codes de catégorie standardisés (MCC)",
        "Calculez les métriques de risque en batch"
      ],
      warnings: [
        "Ne stockez jamais d'informations personnelles exactes",
        "Maintenez la cohérence des données de référence"
      ]
    },
    {
      id: 3,
      title: "Modèle de Conformité et Audit",
      description: "Structure pour la traçabilité réglementaire PSD2/GDPR avec audit trail complet et gestion des consentements.",
      code: `-- Table de liaison pour la conformité PSD2
CREATE TABLE BRIDGE_TRANSACTION_COMPLIANCE (
    transaction_sk INT NOT NULL,
    regulation_type VARCHAR(20) NOT NULL,
    compliance_status VARCHAR(20),
    verification_timestamp TIMESTAMP,
    verification_method VARCHAR(50),
    compliance_score DECIMAL(3,2),
    
    PRIMARY KEY (transaction_sk, regulation_type),
    FOREIGN KEY (transaction_sk) REFERENCES FACT_TRANSACTION(transaction_sk)
);

-- Table pour le consentement GDPR
CREATE TABLE DIM_CONSENT (
    consent_sk INT PRIMARY KEY AUTO_INCREMENT,
    customer_sk INT NOT NULL,
    consent_type VARCHAR(50),
    consent_status VARCHAR(20),
    granted_date TIMESTAMP,
    revoked_date TIMESTAMP NULL,
    legal_basis VARCHAR(100),
    
    INDEX idx_customer_consent (customer_sk, consent_type),
    INDEX idx_status (consent_status)
);

-- Audit trail pour toutes les actions sensibles
CREATE TABLE FACT_AUDIT_TRAIL (
    audit_sk BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50),
    action_type VARCHAR(100),
    table_name VARCHAR(100),
    record_id VARCHAR(100),
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_timestamp (timestamp),
    INDEX idx_action (action_type)
);`,
      language: "sql",
      tips: [
        "Utilisez des tables de liaison pour les relations many-to-many",
        "Implémentez un audit trail immuable pour la conformité",
        "Stockez les consentements avec dates de validité"
      ],
      warnings: [
        "L'audit trail ne doit jamais être modifié ou supprimé",
        "Respectez les délais de rétention légaux"
      ]
    }
  ]

  const architectureImplementationSteps = [
    {
      id: 1,
      title: "Architecture Lambda Hybride",
      description: "Implémentation d'une architecture combinant streaming temps réel et batch pour la cohérence et la conformité.",
      code: `// Configuration Apache Kafka pour l'épine dorsale événementielle
@Configuration
public class KafkaConfig {
    
    @Bean
    public ProducerFactory<String, TransactionEvent> producerFactory() {
        Map<String, Object> config = new HashMap<>();
        config.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "kafka:9092");
        config.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        config.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        config.put(ProducerConfig.ACKS_CONFIG, "all");
        config.put(ProducerConfig.RETRIES_CONFIG, 3);
        config.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, true);
        
        return new DefaultKafkaProducerFactory<>(config);
    }
    
    @Bean
    public ConsumerFactory<String, TransactionEvent> consumerFactory() {
        Map<String, Object> config = new HashMap<>();
        config.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "kafka:9092");
        config.put(ConsumerConfig.GROUP_ID_CONFIG, "fraud-detection-group");
        config.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        config.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false);
        
        return new DefaultKafkaConsumerFactory<>(config);
    }
}`,
      language: "java",
      tips: [
        "Configurez l'idempotence pour éviter les doublons",
        "Utilisez des groupes de consommateurs pour la scalabilité",
        "Désactivez l'auto-commit pour le contrôle manuel"
      ],
      warnings: [
        "La configuration idempotence impacte les performances",
        "Gérez manuellement les offsets pour la fiabilité"
      ]
    },
    {
      id: 2,
      title: "Streaming avec Apache Flink",
      description: "Mise en place du processing temps réel pour la détection de fraude avec latence <100ms.",
      code: `// Job Flink pour la détection de fraude en temps réel
public class FraudDetectionJob {
    
    public static void main(String[] args) throws Exception {
        StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
        env.enableCheckpointing(60000); // Checkpoint toutes les minutes
        env.setParallelism(4);
        
        // Source Kafka pour les transactions
        KafkaSource<TransactionEvent> source = KafkaSource.<TransactionEvent>builder()
            .setBootstrapServers("kafka:9092")
            .setTopics("transactions")
            .setGroupId("fraud-detection")
            .setStartingOffsets(OffsetsInitializer.latest())
            .setValueOnlyDeserializer(new TransactionEventDeserializer())
            .build();
        
        // Pipeline de détection de fraude
        env.fromSource(source, WatermarkStrategy.noWatermarks(), "Transaction Source")
            .keyBy(TransactionEvent::getCustomerId)
            .window(TumblingProcessingTimeWindows.of(Time.seconds(5)))
            .process(new FraudDetectionProcessor())
            .addSink(new FraudAlertSink());
        
        env.execute("Fraud Detection Job");
    }
}

// Processeur de détection de fraude
public class FraudDetectionProcessor extends KeyedProcessFunction<String, TransactionEvent, FraudAlert> {
    
    private ValueState<CustomerProfile> customerProfile;
    private ValueState<TransactionHistory> transactionHistory;
    
    @Override
    public void open(Configuration parameters) {
        customerProfile = getRuntimeContext().getState(
            new ValueStateDescriptor<>("customer-profile", CustomerProfile.class)
        );
        transactionHistory = getRuntimeContext().getState(
            new ValueStateDescriptor<>("transaction-history", TransactionHistory.class)
        );
    }
    
    @Override
    public void processElement(TransactionEvent event, Context ctx, Collector<FraudAlert> out) throws Exception {
        // Logique de détection de fraude
        double fraudScore = calculateFraudScore(event, customerProfile.value(), transactionHistory.value());
        
        if (fraudScore > 0.8) {
            FraudAlert alert = new FraudAlert(event.getTransactionId(), fraudScore, "High risk transaction");
            out.collect(alert);
        }
        
        // Mise à jour des états
        updateCustomerProfile(event);
        updateTransactionHistory(event);
    }
}`,
      language: "java",
      tips: [
        "Utilisez des checkpoints pour la récupération après panne",
        "Implémentez des états keyed pour le contexte client",
        "Optimisez la parallélisation selon vos ressources"
      ],
      warnings: [
        "Les états peuvent consommer beaucoup de mémoire",
        "Testez la récupération après panne en production"
      ]
    },
    {
      id: 3,
      title: "Stockage Polyglotte et Optimisations",
      description: "Configuration des différents stores selon les besoins de latence et de coût.",
      code: `// Configuration DynamoDB pour les profils clients
@Configuration
public class DynamoDBConfig {
    
    @Bean
    public DynamoDbClient dynamoDbClient() {
        return DynamoDbClient.builder()
            .region(Region.EU_WEST_1)
            .credentialsProvider(DefaultCredentialsProvider.create())
            .build();
    }
    
    @Bean
    public DynamoDbEnhancedClient enhancedClient(DynamoDbClient client) {
        return DynamoDbEnhancedClient.builder()
            .dynamoDbClient(client)
            .build();
    }
}

// Repository pour les profils clients
@Repository
public class CustomerProfileRepository {
    
    private final DynamoDbEnhancedClient enhancedClient;
    private final DynamoDbTable<CustomerProfile> table;
    
    public CustomerProfileRepository(DynamoDbEnhancedClient enhancedClient) {
        this.enhancedClient = enhancedClient;
        this.table = enhancedClient.table("customer-profiles", 
            TableSchema.fromBean(CustomerProfile.class));
    }
    
    public CustomerProfile findByCustomerId(String customerId) {
        Key key = Key.builder().partitionValue(customerId).build();
        return table.getItem(key);
    }
    
    public void save(CustomerProfile profile) {
        table.putItem(profile);
    }
    
    // Requête avec index GSI pour les segments
    public List<CustomerProfile> findBySegment(String segment) {
        QueryEnhancedRequest request = QueryEnhancedRequest.builder()
            .queryConditional(QueryConditional.keyEqualTo(
                Key.builder().partitionValue("SEGMENT#" + segment).build()))
            .build();
        
        return table.index("segment-index").query(request)
            .stream()
            .map(Page::items)
            .flatMap(List::stream)
            .collect(Collectors.toList());
    }
}`,
      language: "java",
      tips: [
        "Utilisez des index GSI pour les requêtes par segment",
        "Implémentez des stratégies de mise en cache",
        "Optimisez les modèles de données pour DynamoDB"
      ],
      warnings: [
        "Les index GSI ont un coût et une latence de mise à jour",
        "Planifiez la capacité selon vos patterns d'accès"
      ]
    }
  ]

  const implementationChecklist = [
    {
      id: "planning-1",
      title: "Analyse des Exigences Réglementaires",
      description: "Audit complet des exigences PSD2, GDPR et PCI-DSS pour l'architecture",
      category: "planning" as const,
      priority: "critical" as const,
      estimatedTime: "2-3 weeks",
      dependencies: []
    },
    {
      id: "planning-2",
      title: "Design de l'Architecture de Sécurité",
      description: "Conception des couches de sécurité, chiffrement et gestion des clés",
      category: "planning" as const,
      priority: "critical" as const,
      estimatedTime: "2 weeks",
      dependencies: ["planning-1"]
    },
    {
      id: "planning-3",
      title: "Modélisation des Données Financières",
      description: "Design du modèle de données avec tables de faits et dimensions",
      category: "planning" as const,
      priority: "high" as const,
      estimatedTime: "3 weeks",
      dependencies: ["planning-2"]
    },
    {
      id: "implementation-1",
      title: "Configuration de l'Infrastructure Kafka",
      description: "Déploiement et configuration de Kafka avec haute disponibilité",
      category: "implementation" as const,
      priority: "high" as const,
      estimatedTime: "1-2 weeks",
      dependencies: ["planning-3"]
    },
    {
      id: "implementation-2",
      title: "Développement des Jobs Flink",
      description: "Implémentation des pipelines de détection de fraude et scoring",
      category: "implementation" as const,
      priority: "high" as const,
      estimatedTime: "4-5 weeks",
      dependencies: ["implementation-1"]
    },
    {
      id: "implementation-3",
      title: "Intégration des Stores de Données",
      description: "Configuration de DynamoDB, Snowflake et Redis",
      category: "implementation" as const,
      priority: "high" as const,
      estimatedTime: "2-3 weeks",
      dependencies: ["implementation-2"]
    },
    {
      id: "testing-1",
      title: "Tests de Performance et Latence",
      description: "Validation des SLAs de latence <100ms pour la fraude",
      category: "testing" as const,
      priority: "high" as const,
      estimatedTime: "2 weeks",
      dependencies: ["implementation-3"]
    },
    {
      id: "testing-2",
      title: "Tests de Conformité et Audit",
      description: "Vérification de la conformité PSD2/GDPR et audit trail",
      category: "testing" as const,
      priority: "critical" as const,
      estimatedTime: "2-3 weeks",
      dependencies: ["testing-1"]
    },
    {
      id: "deployment-1",
      title: "Déploiement en Production",
      description: "Mise en production avec monitoring et alerting",
      category: "deployment" as const,
      priority: "critical" as const,
      estimatedTime: "1 week",
      dependencies: ["testing-2"]
    },
    {
      id: "monitoring-1",
      title: "Monitoring et Observabilité",
      description: "Configuration des métriques business et techniques",
      category: "monitoring" as const,
      priority: "high" as const,
      estimatedTime: "1 week",
      dependencies: ["deployment-1"]
    }
  ]

  const architectureDecisionTree = [
    {
      id: "start",
      title: "Architecture FinTech Neo-Bank",
      description: "Sélection de l'architecture optimale pour une neo-banque avec exigences de conformité strictes",
      question: "Quelle est votre priorité principale ?",
      options: [
        {
          id: "compliance",
          label: "Conformité Réglementaire Maximale",
          description: "PSD2, GDPR, PCI-DSS avec audit trail complet",
          nextNode: "compliance-requirements",
          pros: ["Conformité maximale", "Audit trail complet", "Sécurité renforcée"],
          cons: ["Coût élevé", "Complexité opérationnelle", "Latence accrue"],
          recommendation: "Architecture Lambda avec QLDB et chiffrement end-to-end"
        },
        {
          id: "performance",
          label: "Performance et Latence",
          description: "Latence <100ms pour la détection de fraude",
          nextNode: "performance-requirements",
          pros: ["Latence ultra-faible", "Expérience utilisateur optimale", "Avantage concurrentiel"],
          cons: ["Coût infrastructure élevé", "Complexité technique", "Maintenance complexe"],
          recommendation: "Architecture Kappa avec Flink et stores in-memory"
        },
        {
          id: "cost",
          label: "Optimisation des Coûts",
          description: "Budget limité avec ROI rapide",
          nextNode: "cost-requirements",
          pros: ["Coût maîtrisé", "ROI rapide", "Complexité réduite"],
          cons: ["Latence compromise", "Fonctionnalités limitées", "Scalabilité limitée"],
          recommendation: "Architecture hybride avec services managés AWS"
        }
      ]
    },
    {
      id: "compliance-requirements",
      title: "Exigences de Conformité",
      description: "Déterminer le niveau de conformité requis pour choisir l'architecture appropriée",
      question: "Quels régulateurs devez-vous respecter ?",
      options: [
        {
          id: "european",
          label: "Régulateurs Européens (PSD2, GDPR)",
          description: "Conformité complète avec les réglementations européennes",
          outcome: "Architecture Lambda avec QLDB",
          pros: ["Conformité PSD2/GDPR", "Audit trail immuable", "Sécurité maximale"],
          cons: ["Coût élevé (40K€/mois)", "Complexité opérationnelle", "Latence 200-500ms"],
          recommendation: "Implémentez une architecture Lambda avec AWS QLDB pour l'audit trail immuable"
        },
        {
          id: "global",
          label: "Régulateurs Globaux (PCI-DSS, SOC2)",
          description: "Conformité internationale avec standards de sécurité élevés",
          outcome: "Architecture Multi-Cloud Sécurisée",
          pros: ["Conformité internationale", "Résilience géographique", "Sécurité maximale"],
          cons: ["Coût très élevé (60K€/mois)", "Complexité maximale", "Latence 300-800ms"],
          recommendation: "Architecture multi-cloud avec chiffrement end-to-end et audit trail distribué"
        }
      ]
    }
  ]

  const fintechTools = [
    {
      id: "apache-kafka",
      name: "Apache Kafka",
      description: "Plateforme de streaming distribuée pour la construction de pipelines de données temps réel",
      category: "Streaming Platform",
      pricing: "free" as const,
      features: ["Distributed Streaming", "Fault Tolerance", "Horizontal Scaling", "Real-time Processing", "Event Sourcing"],
      pros: ["Performance excellente", "Garanties de durabilité", "Écosystème riche", "Open source", "Prêt pour l'entreprise"],
      cons: ["Configuration complexe", "Courbe d'apprentissage", "Overhead opérationnel", "Intensif en ressources"],
      bestFor: ["Streaming haute performance", "Event sourcing", "Pipelines temps réel", "Communication microservices"],
      notFor: ["Traitement batch simple", "Petits datasets", "Message queuing basique"],
      rating: 4.7,
      marketShare: "42.3",
      learningCurve: "hard" as const,
      community: "large" as const,
      documentation: "excellent" as const
    },
    {
      id: "apache-flink",
      name: "Apache Flink",
      description: "Framework de stream processing pour applications de streaming haute performance et faible latence",
      category: "Stream Processing",
      pricing: "free" as const,
      features: ["Stream Processing", "Event Time Processing", "State Management", "Exactly-once Semantics", "CEP"],
      pros: ["Performance streaming excellente", "Traitement event time", "Cohérence forte", "APIs riches", "Communauté active"],
      cons: ["Gestion d'état complexe", "Courbe d'apprentissage", "Overhead opérationnel", "Intensif en ressources"],
      bestFor: ["Streaming temps réel", "Complex event processing", "Applications stateful", "Exigences de faible latence"],
      notFor: ["Traitement batch simple", "ETL basique", "Applications à petite échelle"],
      rating: 4.4,
      marketShare: "15.2",
      learningCurve: "hard" as const,
      community: "medium" as const,
      documentation: "good" as const
    },
    {
      id: "aws-dynamodb",
      name: "AWS DynamoDB",
      description: "Base de données NoSQL managée pour applications nécessitant performance et scalabilité",
      category: "Database",
      pricing: "paid" as const,
      features: ["NoSQL", "Auto-scaling", "Global Tables", "Point-in-time Recovery", "Encryption at Rest"],
      pros: ["Performance prévisible", "Auto-scaling", "Tables globales", "Intégration AWS native", "Haute disponibilité"],
      cons: ["Vendor lock-in AWS", "Coût élevé pour gros volumes", "Requêtes complexes limitées", "Modèle de données rigide"],
      bestFor: ["Applications haute performance", "Données structurées simples", "Écosystème AWS", "Scaling automatique"],
      notFor: ["Requêtes analytiques complexes", "Relations complexes", "Budget limité", "Multi-cloud"],
      rating: 4.2,
      marketShare: "18.7",
      learningCurve: "medium" as const,
      community: "large" as const,
      documentation: "excellent" as const
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
              Production Ready
            </span>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              FinTech
            </span>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CreditCard className="w-4 h-4" />
              2025
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            FinTech Neo-Bank Real-Time Pipeline
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-4xl">
            Architecture complète pour une neo-banque avec détection de fraude temps réel, 
            scoring de crédit dynamique et conformité PSD2/GDPR. Pipeline haute performance 
            avec latence &lt;100ms pour la fraude et &lt;500ms pour le scoring.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              <Code2 className="w-4 h-4" />
              View Implementation
            </button>
            <button className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <Brain className="w-4 h-4" />
              Learn Architecture
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
          <h2 className="text-3xl font-bold mb-8 text-center">Architecture FinTech Neo-Bank</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Cette architecture combine le meilleur du streaming temps réel et du batch processing 
                pour offrir une solution bancaire moderne, conforme et performante. Le système 
                traite 10K transactions/seconde avec détection de fraude &lt;100ms.
              </p>
              <p>
                L'architecture Lambda hybride utilise Apache Kafka comme épine dorsale événementielle, 
                Apache Flink pour le processing temps réel, et une approche polyglotte pour le stockage 
                (DynamoDB, Snowflake, Redis).
              </p>
              <ul className="list-disc list-inside mt-4">
                <li>Détection de fraude ML avec latence &lt;100ms</li>
                <li>Scoring de crédit dynamique en temps réel</li>
                <li>Conformité PSD2 et GDPR complète</li>
                <li>Audit trail immuable avec QLDB</li>
              </ul>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold mb-4">Technologies Clés</h3>
              <div className="flex flex-wrap gap-2">
                {["Apache Kafka", "Apache Flink", "DynamoDB", "Snowflake", "Redis", "AWS QLDB"].map((tech) => (
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

        {/* Data Modeling Tutorial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Modélisation des Données Financières</h2>
          <div className="bg-card rounded-2xl border border-border p-8">
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Conception d'un modèle de données optimisé pour les transactions financières avec 
              gestion des changements temporels, anonymisation des PII et traçabilité complète 
              pour la conformité réglementaire.
            </p>
            <TutorialSection
              title="Modélisation des Données Financières"
              description="Conception d'un modèle de données optimisé pour les transactions financières avec gestion des changements temporels, anonymisation des PII et traçabilité complète pour la conformité réglementaire."
              steps={dataModelingSteps}
              type="implementation"
              icon={Database}
            />
          </div>
        </motion.div>

        {/* Architecture Implementation Tutorial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Implémentation de l'Architecture</h2>
          <div className="bg-card rounded-2xl border border-border p-8">
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Mise en œuvre de l'architecture Lambda hybride avec Apache Kafka, Flink et stores 
              polyglottes. Configuration pour haute disponibilité et performance temps réel.
            </p>
            <TutorialSection
              title="Implémentation de l'Architecture"
              description="Mise en œuvre de l'architecture Lambda hybride avec Apache Kafka, Flink et stores polyglottes. Configuration pour haute disponibilité et performance temps réel."
              steps={architectureImplementationSteps}
              type="implementation"
              icon={Code2}
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
          <h2 className="text-3xl font-bold mb-8 text-center">Guide de Sélection d'Architecture</h2>
          <div className="bg-card rounded-2xl border border-border p-8">
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Utilisez cet arbre de décision interactif pour choisir l'architecture FinTech optimale 
              selon vos priorités : conformité, performance ou coût.
            </p>
            <ArchitectureDiagram
              title="Guide de Sélection d'Architecture FinTech"
              description="Utilisez cet arbre de décision interactif pour choisir l'architecture FinTech optimale selon vos priorités : conformité, performance ou coût."
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
          <h2 className="text-3xl font-bold mb-8 text-center">Checklist d'Implémentation FinTech</h2>
          <div className="bg-card rounded-2xl border border-border p-8">
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Suivez cette checklist complète pour assurer une implémentation réussie de votre 
              pipeline FinTech avec conformité réglementaire et performance temps réel.
            </p>
            <ImplementationChecklist
              title="Checklist d'Implémentation FinTech"
              description="Suivez cette checklist complète pour assurer une implémentation réussie de votre pipeline FinTech avec conformité réglementaire et performance temps réel."
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
          <h2 className="text-3xl font-bold mb-8 text-center">Comparaison des Technologies FinTech</h2>
          <div className="bg-card rounded-2xl border border-border p-8">
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Comparez les technologies FinTech leaders pour choisir les bons outils pour votre 
              architecture. Évaluez performance, coût et complexité opérationnelle.
            </p>
            <ToolComparison
              title="Comparaison des Technologies FinTech"
              description="Comparez les technologies FinTech leaders pour choisir les bons outils pour votre architecture. Évaluez performance, coût et complexité opérationnelle."
              tools={fintechTools}
              features={[
                { name: "Performance Temps Réel", description: "Capacités de traitement temps réel", category: "Performance" },
                { name: "Scalabilité", description: "Capacité de scaling horizontal", category: "Architecture" },
                { name: "Sécurité", description: "Fonctionnalités de sécurité intégrées", category: "Sécurité" },
                { name: "Intégration", description: "Facilité d'intégration avec l'écosystème", category: "Développement" },
                { name: "Support Enterprise", description: "Support et documentation enterprise", category: "Opérationnel" }
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
          <h2 className="text-3xl font-bold mb-8 text-center">Bonnes Pratiques & Recommandations</h2>
          <div className="bg-card rounded-2xl border border-border p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-xl font-semibold mb-4">Architecture et Performance</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Utilisez Kafka avec idempotence pour éviter les doublons</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Implémentez des checkpoints Flink pour la récupération</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Partitionnez les données par date pour les performances</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-xl font-semibold mb-4">Sécurité et Conformité</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Chiffrez toutes les données sensibles au repos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Implémentez un audit trail immuable</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Utilisez des clés de chiffrement par utilisateur</span>
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
          <div className="bg-gradient-to-r from-blue-500/5 to-primary/5 rounded-2xl border border-border p-8">
            <h3 className="text-2xl font-bold mb-4">Prêt à Construire votre Pipeline FinTech ?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Commencez l'implémentation de cette architecture aujourd'hui avec nos guides complets, 
              exemples de code et bonnes pratiques. Transformez votre infrastructure financière 
              et libérez le plein potentiel de vos données.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium">
                <Code2 className="w-5 h-5" />
                Commencer l'Implémentation
              </button>
              <button className="inline-flex items-center gap-2 px-8 py-4 border border-border rounded-xl hover:bg-muted/50 transition-colors font-medium">
                <Brain className="w-5 h-5" />
                En savoir plus
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
