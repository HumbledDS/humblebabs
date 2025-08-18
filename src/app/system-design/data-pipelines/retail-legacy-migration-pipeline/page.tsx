"use client"

import { motion } from "framer-motion"
import { TutorialSection } from "@/components/projects/tutorial-section"
import { ImplementationChecklist } from "@/components/projects/implementation-checklist"
import { ArchitectureDiagram } from "@/components/projects/architecture-diagram"
import { ToolComparison } from "@/components/projects/tool-comparison"
import { Database, Code2, Brain, CheckCircle, AlertTriangle, ArrowRight, Lightbulb, ShoppingCart, RefreshCw, BarChart3, Settings } from "lucide-react"

export default function RetailLegacyMigrationPipelinePage() {
  const dataModelingSteps = [
    {
      id: 1,
      title: "Modélisation des Faits Retail",
      description: "Conception des tables de faits pour capturer les ventes, stocks et opérations multi-magasins avec gestion des promotions complexes.",
      code: `-- Table de faits principale pour les ventes au niveau ligne
CREATE TABLE FACT_SALES_LINE (
    sale_line_sk BIGINT PRIMARY KEY AUTO_INCREMENT,
    sale_id VARCHAR(50) NOT NULL,
    store_sk INT NOT NULL,
    product_sk INT NOT NULL,
    customer_sk INT,
    date_sk INT NOT NULL,
    time_sk INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(19,4) NOT NULL,
    discount_amount DECIMAL(19,4) DEFAULT 0,
    tax_amount DECIMAL(19,4) DEFAULT 0,
    net_amount DECIMAL(19,4) NOT NULL,
    channel_sk INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_store_date (store_sk, date_sk),
    INDEX idx_product_date (product_sk, date_sk),
    INDEX idx_customer_date (customer_sk, date_sk)
);

-- Table pour les promotions multiples et empilables
CREATE TABLE FACT_SALES_PROMOTION_BRIDGE (
    sale_line_sk BIGINT NOT NULL,
    promotion_sk INT NOT NULL,
    promotion_amount DECIMAL(19,4) NOT NULL,
    promotion_type VARCHAR(50),
    promotion_priority INT,
    
    PRIMARY KEY (sale_line_sk, promotion_sk),
    FOREIGN KEY (sale_line_sk) REFERENCES FACT_SALES_LINE(sale_line_sk)
);

-- Snapshot quotidien des stocks par magasin
CREATE TABLE FACT_INVENTORY_SNAPSHOT (
    snapshot_sk BIGINT PRIMARY KEY AUTO_INCREMENT,
    store_sk INT NOT NULL,
    product_sk INT NOT NULL,
    date_sk INT NOT NULL,
    on_hand_quantity INT NOT NULL,
    on_order_quantity INT DEFAULT 0,
    allocated_quantity INT DEFAULT 0,
    available_to_promise INT GENERATED ALWAYS AS (on_hand_quantity - allocated_quantity) STORED,
    
    INDEX idx_store_product_date (store_sk, product_sk, date_sk),
    INDEX idx_date (date_sk)
);`,
      language: "sql",
      tips: [
        "Utilisez des tables de liaison pour les promotions multiples",
        "Implémentez des colonnes calculées pour les métriques dérivées",
        "Partitionnez par date pour les performances"
      ],
      warnings: [
        "Évitez les jointures complexes sur les tables de faits",
        "Planifiez la rétention des snapshots selon vos besoins"
      ]
    },
    {
      id: 2,
      title: "Dimensions Produit et Magasin",
      description: "Création des dimensions pour le catalogue produits et la hiérarchie magasin avec gestion des attributs dynamiques.",
      code: `-- Dimension produit avec hiérarchie profonde
CREATE TABLE DIM_PRODUCT (
    product_sk INT PRIMARY KEY AUTO_INCREMENT,
    product_id VARCHAR(50) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    brand_sk INT,
    category_sk INT,
    department_sk INT,
    division_sk INT,
    is_active BOOLEAN DEFAULT TRUE,
    launch_date DATE,
    discontinued_date DATE,
    
    INDEX idx_sku (sku),
    INDEX idx_category (category_sk),
    INDEX idx_active (is_active)
);

-- Modèle EAV pour les attributs spécifiques par catégorie
CREATE TABLE DIM_PRODUCT_ATTRIBUTE (
    product_sk INT NOT NULL,
    attribute_name VARCHAR(100) NOT NULL,
    attribute_value TEXT,
    attribute_type VARCHAR(50),
    
    PRIMARY KEY (product_sk, attribute_name),
    FOREIGN KEY (product_sk) REFERENCES DIM_PRODUCT(product_sk)
);

-- Dimension magasin avec hiérarchie organisationnelle
CREATE TABLE DIM_STORE (
    store_sk INT PRIMARY KEY AUTO_INCREMENT,
    store_id VARCHAR(50) NOT NULL,
    store_name VARCHAR(255) NOT NULL,
    store_number VARCHAR(20),
    surface_area DECIMAL(10,2),
    format_type VARCHAR(50), -- hypermarché, supermarché, proximité
    zone_chalandise VARCHAR(100),
    cluster_demographique VARCHAR(50),
    market_potential DECIMAL(15,2),
    market_share_index DECIMAL(5,4),
    performance_index DECIMAL(5,4),
    
    INDEX idx_store_id (store_id),
    INDEX idx_format (format_type),
    INDEX idx_cluster (cluster_demographique)
);`,
      language: "sql",
      tips: [
        "Utilisez un modèle EAV pour les attributs variables",
        "Implémentez des métriques dérivées mises à jour en batch",
        "Normalisez les hiérarchies pour la flexibilité"
      ],
      warnings: [
        "Le modèle EAV peut impacter les performances des requêtes",
        "Maintenez la cohérence des données de référence"
      ]
    },
    {
      id: 3,
      title: "Gestion de la Saisonnalité et Événements",
      description: "Modélisation des événements impactant les ventes et calendrier fiscal personnalisé.",
      code: `-- Dimension pour les événements impactant les ventes
CREATE TABLE DIM_CALENDAR_EVENT (
    event_sk INT PRIMARY KEY AUTO_INCREMENT,
    event_name VARCHAR(255) NOT NULL,
    event_type VARCHAR(100), -- holiday, vacances, événement local, météo
    event_date DATE NOT NULL,
    expected_impact VARCHAR(20), -- low, medium, high
    affected_radius_km INT,
    description TEXT,
    
    INDEX idx_event_date (event_date),
    INDEX idx_event_type (event_type)
);

-- Table de liaison pour les événements par magasin
CREATE TABLE BRIDGE_STORE_EVENT (
    store_sk INT NOT NULL,
    event_sk INT NOT NULL,
    impact_multiplier DECIMAL(5,4) DEFAULT 1.0,
    
    PRIMARY KEY (store_sk, event_sk),
    FOREIGN KEY (store_sk) REFERENCES DIM_STORE(store_sk),
    FOREIGN KEY (event_sk) REFERENCES DIM_CALENDAR_EVENT(event_sk)
);

-- Calendrier fiscal personnalisé (année commence en février)
CREATE TABLE DIM_FISCAL_CALENDAR (
    fiscal_date_sk INT PRIMARY KEY,
    fiscal_date DATE NOT NULL,
    fiscal_year INT NOT NULL,
    fiscal_quarter INT NOT NULL,
    fiscal_month INT NOT NULL,
    fiscal_week INT NOT NULL,
    is_fiscal_year_end BOOLEAN DEFAULT FALSE,
    is_fiscal_quarter_end BOOLEAN DEFAULT FALSE,
    
    INDEX idx_fiscal_date (fiscal_date),
    INDEX idx_fiscal_year (fiscal_year),
    INDEX idx_fiscal_quarter (fiscal_year, fiscal_quarter)
);`,
      language: "sql",
      tips: [
        "Utilisez des tables de liaison pour les relations many-to-many",
        "Implémentez un calendrier fiscal personnalisé",
        "Calculez les impacts d'événements en batch"
      ],
      warnings: [
        "Maintenez la cohérence entre calendriers civil et fiscal",
        "Planifiez la mise à jour des impacts d'événements"
      ]
    }
  ]

  const migrationArchitectureSteps = [
    {
      id: 1,
      title: "Architecture de Transition Intelligente",
      description: "Implémentation du pattern 'strangler fig' pour une migration progressive sans interruption des opérations.",
      code: `// Configuration SAP Data Services pour l'extraction
@Configuration
public class SAPDataServicesConfig {
    
    @Bean
    public DataSource sapDataSource() {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:sap://sap-server:3300/ECC6");
        config.setUsername("sap_username");
        config.setPassword("sap_password");
        config.setDriverClassName("com.sap.db.jdbc.Driver");
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(5);
        
        return new HikariDataSource(config);
    }
    
    @Bean
    public SAPDataServices sapDataServices(DataSource dataSource) {
        SAPDataServicesConfig config = new SAPDataServicesConfig();
        config.setDataSource(dataSource);
        config.setExtractMode(ExtractMode.CDC); // Change Data Capture
        config.setBatchSize(10000);
        config.setExtractWindow("00:00-04:00"); // Fenêtre de maintenance
        
        return new SAPDataServices(config);
    }
}

// Service d'extraction avec gestion des erreurs
@Service
public class SAPExtractionService {
    
    private final SAPDataServices sapDataServices;
    private final ErrorHandlingService errorHandler;
    
    public ExtractionResult extractData(String tableName, LocalDateTime since) {
        try {
            // Extraction avec CDC sur les tables techniques SAP
            CDCConfig cdcConfig = new CDCConfig();
            cdcConfig.setChangeTables(Arrays.asList("CDHDR", "CDPOS"));
            cdcConfig.setSinceTimestamp(since);
            
            ExtractionResult result = sapDataServices.extractWithCDC(tableName, cdcConfig);
            
            // Validation des données extraites
            validateExtractedData(result);
            
            return result;
            
        } catch (SAPExtractionException e) {
            errorHandler.handleExtractionError(tableName, e);
            throw new MigrationException("Échec de l'extraction SAP", e);
        }
    }
}`,
      language: "java",
      tips: [
        "Utilisez CDC pour minimiser la fenêtre d'extraction",
        "Implémentez une gestion d'erreur robuste",
        "Configurez des pools de connexions optimisés"
      ],
      warnings: [
        "Les extractions CDC peuvent impacter les performances SAP",
        "Testez la récupération après panne en production"
      ]
    },
    {
      id: 2,
      title: "Intégration Multi-Systèmes avec Apache NiFi",
      description: "Configuration de NiFi pour gérer l'hétérogénéité des 850 systèmes de caisse et formats de données.",
      code: `// Configuration NiFi pour l'intégration multi-systèmes
@Configuration
public class NiFiConfig {
    
    @Bean
    public NiFiClient niFiClient() {
        NiFiClientConfig config = new NiFiClientConfig();
        config.setNiFiUrl("http://nifi:8080");
        config.setUsername("nifi_username");
        config.setPassword("nifi_password");
        config.setConnectionTimeout(30000);
        config.setReadTimeout(60000);
        
        return new NiFiClient(config);
    }
    
    @Bean
    public DataFlowManager dataFlowManager(NiFiClient niFiClient) {
        return new DataFlowManager(niFiClient);
    }
}

// Gestionnaire de flux de données pour différents formats
@Service
public class MultiSystemIntegrationService {
    
    private final DataFlowManager dataFlowManager;
    private final FormatConverterService formatConverter;
    
    public void createIntegrationFlow(String systemType, String format) {
        // Création d'un flux NiFi personnalisé selon le type de système
        DataFlow flow = new DataFlow();
        
        switch (systemType.toLowerCase()) {
            case "as400":
                flow.addProcessor(new AS400DataProcessor());
                flow.addProcessor(new EBCDICConverter());
                break;
                
            case "pos":
                flow.addProcessor(new POSDataProcessor());
                flow.addProcessor(new JSONConverter());
                break;
                
            case "legacy":
                flow.addProcessor(new LegacyDataProcessor());
                flow.addProcessor(new CSVConverter());
                break;
        }
        
        // Ajout des processeurs communs
        flow.addProcessor(new DataValidator());
        flow.addProcessor(new DataEnricher());
        flow.addProcessor(new KafkaProducer());
        
        // Déploiement du flux
        dataFlowManager.deployFlow(flow);
    }
}`,
      language: "java",
      tips: [
        "Utilisez des processeurs spécialisés pour chaque format",
        "Implémentez une validation des données robuste",
        "Configurez des retry policies appropriées"
      ],
      warnings: [
        "La complexité des flux peut impacter la maintenance",
        "Testez chaque intégration en environnement de test"
      ]
    },
    {
      id: 3,
      title: "Data Lakehouse avec Delta Lake",
      description: "Configuration d'un Data Lakehouse moderne combinant flexibilité du lac et performance du warehouse.",
      code: `// Configuration Delta Lake pour le Data Lakehouse
@Configuration
public class DeltaLakeConfig {
    
    @Bean
    public SparkSession sparkSession() {
        return SparkSession.builder()
            .appName("Retail Data Lakehouse")
            .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension")
            .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog")
            .config("spark.databricks.delta.retentionDurationCheck.enabled", "false")
            .config("spark.databricks.delta.merge.repartitionBeforeWrite", "true")
            .getOrCreate();
    }
    
    @Bean
    public DeltaTableManager deltaTableManager(SparkSession sparkSession) {
        return new DeltaTableManager(sparkSession);
    }
}

// Service de gestion des tables Delta avec optimisations
@Service
public class DeltaLakehouseService {
    
    private final DeltaTableManager deltaTableManager;
    private final DataQualityService dataQualityService;
    
    public void createOptimizedTable(String tableName, StructType schema) {
        // Création de la table avec optimisations Delta
        DeltaTable table = deltaTableManager.createTable(tableName, schema);
        
        // Configuration des optimisations
        table.optimize()
            .where("date >= '2024-01-01'")
            .executeCompaction();
        
        // Configuration de la rétention et des archives
        table.vacuum(168); // Garder 7 jours de données
    }
    
    public void upsertData(String tableName, Dataset<Row> newData, String mergeKey) {
        // Upsert avec gestion des conflits et audit trail
        DeltaTable table = deltaTableManager.getTable(tableName);
        
        table.alias("target")
            .merge(newData.alias("source"), mergeKey)
            .whenMatchedUpdateAll()
            .whenNotMatchedInsertAll()
            .execute();
        
        // Mise à jour des métriques de qualité
        dataQualityService.updateQualityMetrics(tableName);
    }
}`,
      language: "java",
      tips: [
        "Utilisez les optimisations Delta pour les performances",
        "Implémentez une stratégie de rétention appropriée",
        "Configurez la compaction automatique"
      ],
      warnings: [
        "Les opérations Delta peuvent être coûteuses",
        "Planifiez la maintenance des tables optimisées"
      ]
    }
  ]

  const implementationChecklist = [
    {
      id: "planning-1",
      title: "Audit des Systèmes Legacy",
      description: "Inventaire complet des 850 systèmes et analyse de leur complexité",
      category: "planning" as const,
      priority: "critical" as const,
      estimatedTime: "4-6 weeks",
      dependencies: []
    },
    {
      id: "planning-2",
      title: "Stratégie de Migration Progressive",
      description: "Plan de migration en vagues avec minimisation des risques",
      category: "planning" as const,
      priority: "critical" as const,
      estimatedTime: "3-4 weeks",
      dependencies: ["planning-1"]
    },
    {
      id: "planning-3",
      title: "Design du Modèle de Données Unifié",
      description: "Conception du modèle de données pour 8M SKUs et 850 magasins",
      category: "planning" as const,
      priority: "high" as const,
      estimatedTime: "4-5 weeks",
      dependencies: ["planning-2"]
    },
    {
      id: "implementation-1",
      title: "Configuration de l'Infrastructure SAP",
      description: "Mise en place de SAP Data Services avec CDC et gestion des erreurs",
      category: "implementation" as const,
      priority: "high" as const,
      estimatedTime: "2-3 weeks",
      dependencies: ["planning-3"]
    },
    {
      id: "implementation-2",
      title: "Déploiement d'Apache NiFi",
      description: "Configuration de NiFi pour l'intégration multi-systèmes",
      category: "implementation" as const,
      priority: "high" as const,
      estimatedTime: "3-4 weeks",
      dependencies: ["implementation-1"]
    },
    {
      id: "implementation-3",
      title: "Construction du Data Lakehouse",
      description: "Mise en place d'Azure Data Lake et Delta Lake",
      category: "implementation" as const,
      priority: "high" as const,
      estimatedTime: "3-4 weeks",
      dependencies: ["implementation-2"]
    },
    {
      id: "testing-1",
      title: "Tests de Migration Progressive",
      description: "Validation de chaque vague de migration avec rollback",
      category: "testing" as const,
      priority: "high" as const,
      estimatedTime: "2-3 weeks",
      dependencies: ["implementation-3"]
    },
    {
      id: "testing-2",
      title: "Tests de Performance et Qualité",
      description: "Validation des performances et de la qualité des données",
      category: "testing" as const,
      priority: "medium" as const,
      estimatedTime: "2 weeks",
      dependencies: ["testing-1"]
    },
    {
      id: "deployment-1",
      title: "Déploiement en Production",
      description: "Mise en production progressive avec monitoring",
      category: "deployment" as const,
      priority: "critical" as const,
      estimatedTime: "1-2 weeks",
      dependencies: ["testing-2"]
    },
    {
      id: "monitoring-1",
      title: "Monitoring et Optimisation",
      description: "Surveillance continue et optimisation des performances",
      category: "monitoring" as const,
      priority: "high" as const,
      estimatedTime: "1 week",
      dependencies: ["deployment-1"]
    }
  ]

  const migrationDecisionTree = [
    {
      id: "start",
      title: "Stratégie de Migration Retail Legacy",
      description: "Sélection de la meilleure approche pour migrer des systèmes SAP legacy vers une plateforme moderne",
      question: "Quelle est votre approche de migration préférée ?",
      options: [
        {
          id: "progressive",
          label: "Migration Progressive (Strangler Fig)",
          description: "Migration en vagues avec coexistence des systèmes",
          nextNode: "progressive-approach",
          pros: ["Risque minimal", "Continuity des opérations", "Validation progressive"],
          cons: ["Timeline plus long", "Coût plus élevé", "Complexité de maintenance"],
          recommendation: "Approche recommandée pour minimiser les risques business"
        },
        {
          id: "bigbang",
          label: "Migration Big Bang",
          description: "Remplacement complet en une seule fois",
          nextNode: "bigbang-approach",
          pros: ["Timeline court", "Coût réduit", "Simplicité de maintenance"],
          cons: ["Risque élevé", "Downtime important", "Difficile de rollback"],
          recommendation: "À éviter pour les systèmes critiques"
        },
        {
          id: "hybrid",
          label: "Approche Hybride",
          description: "Combinaison de migration et modernisation",
          nextNode: "hybrid-approach",
          pros: ["Flexibilité maximale", "ROI optimisé", "Risque maîtrisé"],
          cons: ["Complexité élevée", "Expertise requise", "Timeline variable"],
          recommendation: "Pour les organisations avec expertise technique"
        }
      ]
    },
    {
      id: "progressive-approach",
      title: "Migration Progressive Détaillée",
      description: "Planification des vagues de migration pour minimiser les risques",
      question: "Quelle est la première vague de migration ?",
      options: [
        {
          id: "readonly",
          label: "Données en Lecture Seule",
          description: "Catalogue produits et historique des ventes",
          outcome: "Vague 1: Données en Lecture Seule",
          pros: ["Quick wins visibles", "Risque minimal", "Validation de l'architecture"],
          cons: ["Impact limité", "ROI partiel", "Timeline étendu"],
          recommendation: "Commencez par les données non critiques pour établir la confiance"
        },
        {
          id: "inventory",
          label: "Stocks Temps Quasi-Réel",
          description: "Synchronisation des stocks avec les systèmes modernes",
          outcome: "Vague 2: Stocks Temps Quasi-Réel",
          pros: ["Impact business visible", "Amélioration des opérations", "ROI significatif"],
          cons: ["Complexité accrue", "Risque modéré", "Intégration critique"],
          recommendation: "Ajoutez les stocks une fois la première vague validée"
        }
      ]
    }
  ]

  const retailTools = [
    {
      id: "sap-data-services",
      name: "SAP Data Services",
      description: "Plateforme ETL native SAP pour l'intégration de données SAP et non-SAP",
      category: "ETL Platform",
      pricing: "paid" as const,
      features: ["SAP Native", "CDC Support", "Data Quality", "Metadata Management", "Real-time Processing"],
      pros: ["Intégration native SAP", "Support CDC avancé", "Gestion des erreurs robuste", "Support enterprise", "Performance optimisée"],
      cons: ["Coût élevé", "Vendor lock-in SAP", "Courbe d'apprentissage", "Licences complexes"],
      bestFor: ["Environnements SAP", "Migrations legacy", "Intégrations complexes", "Enterprise"],
      notFor: ["Petites organisations", "Budget limité", "Environnements non-SAP", "Open source"],
      rating: 4.3,
      marketShare: "28.5",
      learningCurve: "hard" as const,
      community: "medium" as const,
      documentation: "good" as const
    },
    {
      id: "apache-nifi",
      name: "Apache NiFi",
      description: "Plateforme de flux de données pour l'automatisation du mouvement des données",
      category: "Data Flow",
      pricing: "free" as const,
      features: ["Visual Flow Design", "Real-time Processing", "Data Provenance", "Security", "Scalability"],
      pros: ["Interface graphique intuitive", "300+ processeurs préconstruits", "Traçabilité complète", "Open source", "Scalabilité horizontale"],
      cons: ["Performance limitée", "Complexité des flux", "Maintenance opérationnelle", "Courbe d'apprentissage"],
      bestFor: ["Intégrations hétérogènes", "Prototypage rapide", "Environnements legacy", "Équipes non-techniques"],
      notFor: ["Traitement haute performance", "Volumes massifs", "Latence critique", "Architectures modernes"],
      rating: 4.1,
      marketShare: "12.8",
      learningCurve: "medium" as const,
      community: "large" as const,
      documentation: "good" as const
    },
    {
      id: "azure-databricks",
      name: "Azure Databricks",
      description: "Plateforme d'analytics unifiée basée sur Apache Spark",
      category: "Analytics Platform",
      pricing: "paid" as const,
      features: ["Apache Spark", "Delta Lake", "MLflow", "Collaborative Notebooks", "Auto-scaling"],
      pros: ["Performance Spark optimisée", "Intégration Azure native", "Delta Lake intégré", "Collaboration équipe", "Auto-scaling"],
      cons: ["Coût élevé", "Vendor lock-in Azure", "Complexité de configuration", "Courbe d'apprentissage"],
      bestFor: ["Big data analytics", "Machine learning", "Data engineering", "Écosystème Azure"],
      notFor: ["Petits datasets", "Budget limité", "Multi-cloud", "Simplicité"],
      rating: 4.5,
      marketShare: "22.1",
      learningCurve: "hard" as const,
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
            <span className="px-3 py-1 bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-full text-sm font-medium">
              Migration Legacy
            </span>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              Retail
            </span>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShoppingCart className="w-4 h-4" />
              2025
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Retail Legacy Migration Pipeline
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-4xl">
            Architecture de migration progressive pour transformer des systèmes retail legacy SAP 
            vers une plateforme moderne. Migration de 850 magasins et 8M SKUs avec minimisation 
            des risques et continuité des opérations.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              <Code2 className="w-4 h-4" />
              View Migration Plan
            </button>
            <button className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <Brain className="w-4 h-4" />
              Learn Strategy
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
          <h2 className="text-3xl font-bold mb-8 text-center">Architecture de Migration Retail Legacy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Cette architecture adopte le pattern "strangler fig" pour une migration progressive 
                et sécurisée. Le nouveau système coexiste avec l'ancien pendant la transition, 
                permettant une validation continue et une minimisation des risques.
              </p>
              <p>
                L'approche utilise SAP Data Services pour l'extraction CDC, Apache NiFi pour 
                l'intégration multi-systèmes, et un Data Lakehouse moderne avec Delta Lake 
                pour la flexibilité et les performances.
              </p>
              <ul className="list-disc list-inside mt-4">
                <li>Migration progressive en 3 vagues sur 24 mois</li>
                <li>Extraction CDC depuis SAP ECC6 avec fenêtre 45min</li>
                <li>Intégration de 850 systèmes hétérogènes</li>
                <li>Data Lakehouse unifié pour online/offline</li>
              </ul>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold mb-4">Technologies de Migration</h3>
              <div className="flex flex-wrap gap-2">
                {["SAP Data Services", "Apache NiFi", "Azure Data Lake", "Delta Lake", "Power BI", "Apache Spark"].map((tech) => (
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
          <h2 className="text-3xl font-bold mb-8 text-center">Modélisation des Données Retail</h2>
          <div className="bg-card rounded-2xl border border-border p-8">
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Conception d'un modèle de données unifié pour 8M SKUs et 850 magasins avec 
              gestion des promotions complexes, hiérarchies produits et saisonnalité business.
            </p>
            <TutorialSection
              title="Modélisation des Données Retail"
              description="Conception d'un modèle de données unifié pour 8M SKUs et 850 magasins avec gestion des promotions complexes, hiérarchies produits et saisonnalité business."
              steps={dataModelingSteps}
              type="implementation"
              icon="database"
            />
          </div>
        </motion.div>

        {/* Migration Architecture Tutorial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Architecture de Migration Progressive</h2>
          <div className="bg-card rounded-2xl border border-border p-8">
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Implémentation de l'architecture de migration avec SAP Data Services, Apache NiFi 
              et Data Lakehouse. Configuration pour la coexistence et la transition progressive.
            </p>
            <TutorialSection
              title="Architecture de Migration Progressive"
              description="Implémentation de l'architecture de migration avec SAP Data Services, Apache NiFi et Data Lakehouse. Configuration pour la coexistence et la transition progressive."
              steps={migrationArchitectureSteps}
              type="implementation"
              icon="refresh-cw"
            />
          </div>
        </motion.div>

        {/* Migration Decision Tree */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Guide de Stratégie de Migration</h2>
          <div className="bg-card rounded-2xl border border-border p-8">
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Utilisez cet arbre de décision pour choisir la meilleure stratégie de migration 
              selon vos contraintes de risque, timeline et budget.
            </p>
            <ArchitectureDiagram
              title="Guide de Stratégie de Migration Retail"
              description="Utilisez cet arbre de décision pour choisir la meilleure stratégie de migration selon vos contraintes de risque, timeline et budget."
              type="decision-tree"
              content={migrationDecisionTree}
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
          <h2 className="text-3xl font-bold mb-8 text-center">Checklist de Migration Legacy</h2>
          <div className="bg-card rounded-2xl border border-border p-8">
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Suivez cette checklist complète pour assurer une migration réussie de vos systèmes 
              legacy avec minimisation des risques et continuité des opérations.
            </p>
            <ImplementationChecklist
              title="Checklist de Migration Legacy"
              description="Suivez cette checklist complète pour assurer une migration réussie de vos systèmes legacy avec minimisation des risques et continuité des opérations."
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
          <h2 className="text-3xl font-bold mb-8 text-center">Comparaison des Outils de Migration</h2>
          <div className="bg-card rounded-2xl border border-border p-8">
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Comparez les outils de migration retail pour choisir les bonnes technologies 
              selon vos contraintes techniques et budgétaires.
            </p>
            <ToolComparison
              title="Comparaison des Outils de Migration"
              description="Comparez les outils de migration retail pour choisir les bonnes technologies selon vos contraintes techniques et budgétaires."
              tools={retailTools}
              features={[
                { name: "Intégration SAP", description: "Capacités d'intégration avec SAP", category: "Compatibility" },
                { name: "Gestion des Erreurs", description: "Robustesse de la gestion d'erreurs", category: "Reliability" },
                { name: "Performance", description: "Capacités de traitement et scalabilité", category: "Performance" },
                { name: "Facilité d'Usage", description: "Simplicité de configuration et maintenance", category: "Usability" },
                { name: "Support Enterprise", description: "Qualité du support et documentation", category: "Support" }
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
          <h2 className="text-3xl font-bold mb-8 text-center">Bonnes Pratiques de Migration</h2>
          <div className="bg-card rounded-2xl border border-border p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-xl font-semibold mb-4">Stratégie de Migration</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Commencez par les données en lecture seule</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Utilisez le pattern strangler fig</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Validez chaque vague avant la suivante</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-xl font-semibold mb-4">Gestion des Risques</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Maintenez des options de rollback</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Surveillez les métriques business</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Formez les équipes utilisateurs</span>
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
          <div className="bg-gradient-to-r from-orange-500/5 to-primary/5 rounded-2xl border border-border p-8">
            <h3 className="text-2xl font-bold mb-4">Prêt à Moderniser vos Systèmes Retail ?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Commencez votre migration legacy aujourd'hui avec nos guides complets et 
              stratégies éprouvées. Transformez votre infrastructure retail et libérez 
              le plein potentiel de vos données.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium">
                <Code2 className="w-5 h-5" />
                Commencer la Migration
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
