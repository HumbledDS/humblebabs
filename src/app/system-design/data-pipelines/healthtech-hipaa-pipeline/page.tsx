"use client"

import { motion } from "framer-motion"
import { TutorialSection } from "@/components/projects/tutorial-section"
import { ImplementationChecklist } from "@/components/projects/implementation-checklist"
import { ArchitectureDiagram } from "@/components/projects/architecture-diagram"
import { ToolComparison } from "@/components/projects/tool-comparison"
import { Shield, Zap, Database, Code2, Brain, CheckCircle, AlertTriangle, ArrowRight, Lightbulb, Heart, Lock, Activity } from "lucide-react"

export default function HealthTechHIPAAPipelinePage() {
  const dataModelingSteps = [
    {
      id: 1,
      title: "Modélisation des Faits Cliniques",
      description: "Conception des tables de faits pour capturer chaque interaction médicale avec granularité atomique et anonymisation HIPAA.",
      code: `-- Table de faits principale pour les événements cliniques
CREATE TABLE FACT_CLINICAL_EVENT (
    event_sk BIGINT PRIMARY KEY AUTO_INCREMENT,
    event_id VARCHAR(50) NOT NULL,
    patient_research_id VARCHAR(100) NOT NULL, -- Hash unidirectionnel
    provider_sk INT NOT NULL,
    event_type_sk INT NOT NULL,
    event_timestamp TIMESTAMP(3) NOT NULL,
    date_sk INT NOT NULL,
    time_sk INT NOT NULL,
    severity_score DECIMAL(3,2),
    risk_score DECIMAL(3,2),
    clinical_values JSON, -- Valeurs cliniques chiffrées
    is_critical BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_patient_date (patient_research_id, date_sk),
    INDEX idx_provider_date (provider_sk, date_sk),
    INDEX idx_critical (is_critical) WHERE is_critical = TRUE
);

-- Table pour les résultats de laboratoire
CREATE TABLE FACT_LAB_RESULT (
    result_sk BIGINT PRIMARY KEY AUTO_INCREMENT,
    patient_research_id VARCHAR(100) NOT NULL,
    lab_test_sk INT NOT NULL,
    batch_id VARCHAR(50) NOT NULL,
    result_timestamp TIMESTAMP NOT NULL,
    numeric_value DECIMAL(10,4),
    text_value TEXT,
    unit VARCHAR(20),
    reference_range_low DECIMAL(10,4),
    reference_range_high DECIMAL(10,4),
    is_abnormal BOOLEAN DEFAULT FALSE,
    abnormal_flag VARCHAR(10),
    
    INDEX idx_patient_test (patient_research_id, lab_test_sk),
    INDEX idx_batch (batch_id),
    INDEX idx_abnormal (is_abnormal) WHERE is_abnormal = TRUE
);

-- Table pour l'administration de médicaments
CREATE TABLE FACT_MEDICATION_ADMINISTRATION (
    administration_sk BIGINT PRIMARY KEY AUTO_INCREMENT,
    patient_research_id VARCHAR(100) NOT NULL,
    medication_sk INT NOT NULL,
    administration_timestamp TIMESTAMP NOT NULL,
    dosage DECIMAL(10,4) NOT NULL,
    dosage_unit VARCHAR(20) NOT NULL,
    route VARCHAR(50), -- oral, IV, IM, etc.
    site VARCHAR(100), -- site d'injection si applicable
    administered_by_sk INT,
    is_scheduled BOOLEAN DEFAULT FALSE,
    
    INDEX idx_patient_medication (patient_research_id, medication_sk),
    INDEX idx_timestamp (administration_timestamp)
);`,
      language: "sql",
      tips: [
        "Utilisez des hash unidirectionnels pour les identifiants patients",
        "Implémentez des index partiels pour les événements critiques",
        "Stockez les valeurs cliniques en JSON chiffré"
      ],
      warnings: [
        "Ne stockez jamais de PII dans les tables de faits",
        "Respectez les exigences de rétention HIPAA"
      ]
    },
    {
      id: 2,
      title: "Dimensions Médicales Spécialisées",
      description: "Création des dimensions pour le contexte médical avec gestion des codes ICD-10, CPT et hiérarchies cliniques.",
      code: `-- Dimension patient anonymisée
CREATE TABLE DIM_PATIENT (
    patient_sk INT PRIMARY KEY AUTO_INCREMENT,
    patient_research_id VARCHAR(100) UNIQUE NOT NULL,
    age_group VARCHAR(20), -- 18-25, 26-35, etc.
    gender_category VARCHAR(10), -- M, F, Other
    zip_code_prefix VARCHAR(3), -- 3 premiers chiffres seulement
    chronic_conditions_flags JSON, -- Flags booléens pour conditions
    risk_factors JSON, -- Facteurs de risque encodés
    registration_date DATE,
    last_activity_date DATE,
    valid_from TIMESTAMP NOT NULL,
    valid_to TIMESTAMP NULL,
    is_current BOOLEAN DEFAULT TRUE,
    
    INDEX idx_research_id (patient_research_id),
    INDEX idx_current (is_current)
);

-- Dimension diagnostic avec hiérarchie ICD-10
CREATE TABLE DIM_DIAGNOSIS (
    diagnosis_sk INT PRIMARY KEY AUTO_INCREMENT,
    icd10_code VARCHAR(10) NOT NULL,
    diagnosis_name VARCHAR(255) NOT NULL,
    chapter VARCHAR(100),
    section VARCHAR(100),
    category VARCHAR(100),
    subcategory VARCHAR(100),
    severity_level VARCHAR(20),
    is_chronic BOOLEAN DEFAULT FALSE,
    
    INDEX idx_icd10_code (icd10_code),
    INDEX idx_chapter (chapter),
    INDEX idx_chronic (is_chronic)
);

-- Dimension procédure avec codes CPT
CREATE TABLE DIM_PROCEDURE (
    procedure_sk INT PRIMARY KEY AUTO_INCREMENT,
    cpt_code VARCHAR(10) NOT NULL,
    procedure_name VARCHAR(255) NOT NULL,
    procedure_category VARCHAR(100),
    body_system VARCHAR(100),
    complexity_level VARCHAR(20),
    typical_duration_minutes INT,
    
    INDEX idx_cpt_code (cpt_code),
    INDEX idx_category (procedure_category)
);`,
      language: "sql",
      tips: [
        "Implémentez SCD Type 2 pour l'historique des changements",
        "Utilisez des codes standardisés (ICD-10, CPT)",
        "Anonymisez les données démographiques"
      ],
      warnings: [
        "Vérifiez la conformité des codes avec les standards actuels",
        "Maintenez la cohérence des hiérarchies médicales"
      ]
    },
    {
      id: 3,
      title: "Modélisation pour Machine Learning",
      description: "Structures optimisées pour le feature engineering et les modèles prédictifs médicaux.",
      code: `-- Vue matérialisée pour la timeline patient
CREATE TABLE FACT_PATIENT_TIMELINE (
    timeline_sk BIGINT PRIMARY KEY AUTO_INCREMENT,
    patient_research_id VARCHAR(100) NOT NULL,
    timeline_date DATE NOT NULL,
    days_since_registration INT,
    active_medications_count INT,
    days_since_last_admission INT,
    vital_signs_trend JSON, -- Tendances des signes vitaux
    risk_score_daily DECIMAL(3,2),
    engagement_score DECIMAL(3,2),
    
    INDEX idx_patient_date (patient_research_id, timeline_date),
    INDEX idx_risk_score (risk_score_daily)
);

-- Feature store pour le ML médical
CREATE TABLE FEATURE_STORE_PATIENT (
    feature_sk BIGINT PRIMARY KEY AUTO_INCREMENT,
    patient_research_id VARCHAR(100) NOT NULL,
    feature_name VARCHAR(100) NOT NULL,
    feature_value JSON,
    feature_version VARCHAR(20),
    feature_timestamp TIMESTAMP NOT NULL,
    feature_source VARCHAR(100),
    feature_quality_score DECIMAL(3,2),
    
    INDEX idx_patient_feature (patient_research_id, feature_name),
    INDEX idx_timestamp (feature_timestamp)
);

-- Table pour les prédictions et recommandations
CREATE TABLE FACT_PREDICTION_RESULT (
    prediction_sk BIGINT PRIMARY KEY AUTO_INCREMENT,
    patient_research_id VARCHAR(100) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    model_version VARCHAR(20) NOT NULL,
    prediction_type VARCHAR(50), -- readmission, deterioration, etc.
    prediction_value DECIMAL(3,2),
    confidence_score DECIMAL(3,2),
    prediction_timestamp TIMESTAMP NOT NULL,
    actual_outcome VARCHAR(50), -- NULL si pas encore connu
    outcome_timestamp TIMESTAMP NULL,
    
    INDEX idx_patient_model (patient_research_id, model_name),
    INDEX idx_prediction_type (prediction_type)
);`,
      language: "sql",
      tips: [
        "Versionnez les features pour la reproductibilité",
        "Implémentez des métriques de qualité des features",
        "Trackez les prédictions vs résultats réels"
      ],
      warnings: [
        "Les modèles ML doivent être validés cliniquement",
        "Respectez les exigences FDA pour les algorithmes médicaux"
      ]
    }
  ]

  const hipaaArchitectureSteps = [
    {
      id: 1,
      title: "Architecture Event-Driven Serverless",
      description: "Implémentation d'une architecture HIPAA-compliant avec AWS HealthLake et processing serverless pour optimiser les coûts.",
      code: `// Configuration AWS HealthLake pour la conformité HIPAA
@Configuration
public class HealthLakeConfig {
    
    @Bean
    public HealthLakeClient healthLakeClient() {
        HealthLakeClientBuilder builder = HealthLakeClient.builder();
        builder.region(Region.US_EAST_1);
        builder.credentialsProvider(DefaultCredentialsProvider.create());
        
        return builder.build();
    }
    
    @Bean
    public FHIRService fhirService(HealthLakeClient healthLakeClient) {
        return new FHIRService(healthLakeClient);
    }
}

// Service FHIR pour l'ingestion des données médicales
@Service
public class FHIRService {
    
    private final HealthLakeClient healthLakeClient;
    private final DataAnonymizationService anonymizationService;
    
    public ImportJobResult importFHIRData(String dataLocation, DataFormat format) {
        try {
            // Configuration de l'import avec conformité HIPAA
            ImportJobRequest request = ImportJobRequest.builder()
                .inputDataConfig(InputDataConfig.builder()
                    .s3Uri(dataLocation)
                    .dataFormat(format)
                    .build())
                .jobOutputDataConfig(OutputDataConfig.builder()
                    .s3Uri("s3://healthlake-output/")
                    .build())
                .jobName("HIPAA-Import-" + System.currentTimeMillis())
                .dataAccessRoleArn("arn:aws:iam::account:role/HealthLakeDataAccessRole")
                .build();
            
            // Lancement de l'import
            ImportJobResponse response = healthLakeClient.startFHIRImportJob(request);
            
            // Monitoring de l'import
            return monitorImportJob(response.importJobId());
            
        } catch (HealthLakeException e) {
            throw new HIPAAComplianceException("Échec de l'import HealthLake", e);
        }
    }
}`,
      language: "java",
      tips: [
        "Utilisez AWS HealthLake pour la conformité HIPAA native",
        "Configurez les rôles IAM appropriés",
        "Implémentez le monitoring des jobs d'import"
      ],
      warnings: [
        "Vérifiez que tous les services sont HIPAA-eligible",
        "Testez la conformité en environnement de test"
      ]
    },
    {
      id: 2,
      title: "Streaming IoT avec Kinesis",
      description: "Configuration du streaming des données wearables avec AWS IoT Core et Kinesis pour la latence <1s.",
      code: `// Configuration AWS IoT Core pour les wearables
@Configuration
public class IoTCoreConfig {
    
    @Bean
    public IoTCoreClient ioTCoreClient() {
        IoTCoreClientBuilder builder = IoTCoreClient.builder();
        builder.region(Region.US_EAST_1);
        builder.credentialsProvider(DefaultCredentialsProvider.create());
        
        return builder.build();
    }
    
    @Bean
    public KinesisClient kinesisClient() {
        KinesisClientBuilder builder = KinesisClient.builder();
        builder.region(Region.US_EAST_1);
        builder.credentialsProvider(DefaultCredentialsProvider.create());
        
        return builder.build();
    }
}

// Service de streaming des données IoT
@Service
public class IoTStreamingService {
    
    private final IoTCoreClient ioTCoreClient;
    private final KinesisClient kinesisClient;
    private final DataValidationService validationService;
    
    public void processWearableData(String deviceId, WearableData data) {
        try {
            // Validation des données IoT
            if (!validationService.validateWearableData(data)) {
                throw new InvalidDataException("Données wearables invalides");
            }
            
            // Enrichissement avec métadonnées HIPAA
            EnrichedData enrichedData = enrichWithHIPAAMetadata(data, deviceId);
            
            // Envoi vers Kinesis pour processing temps réel
            PutRecordRequest request = PutRecordRequest.builder()
                .streamName("wearable-data-stream")
                .partitionKey(deviceId)
                .data(SdkBytes.fromUtf8String(enrichedData.toJson()))
                .build();
            
            PutRecordResponse response = kinesisClient.putRecord(request);
            
            // Log de l'audit trail
            auditDataProcessing(deviceId, data, response.sequenceNumber());
            
        } catch (Exception e) {
            handleStreamingError(deviceId, data, e);
        }
    }
    
    private EnrichedData enrichWithHIPAAMetadata(WearableData data, String deviceId) {
        return EnrichedData.builder()
            .originalData(data)
            .deviceId(deviceId)
            .timestamp(Instant.now())
            .dataSource("wearable-device")
            .complianceLevel("HIPAA")
            .encryptionStatus("encrypted")
            .build();
    }
}`,
      language: "java",
      tips: [
        "Utilisez Kinesis pour le streaming temps réel",
        "Implémentez la validation des données IoT",
        "Enrichissez avec les métadonnées HIPAA"
      ],
      warnings: [
        "Les données IoT peuvent être volumineuses",
        "Planifiez la scalabilité du streaming"
      ]
    },
    {
      id: 3,
      title: "Pipeline ML avec SageMaker",
      description: "Configuration des pipelines ML pour la prédiction médicale avec monitoring et conformité FDA.",
      code: `// Configuration SageMaker pour le ML médical
@Configuration
public class SageMakerConfig {
    
    @Bean
    public SageMakerClient sageMakerClient() {
        SageMakerClientBuilder builder = SageMakerClient.builder();
        builder.region(Region.US_EAST_1);
        builder.credentialsProvider(DefaultCredentialsProvider.create());
        
        return builder.build();
    }
    
    @Bean
    public FeatureStoreService featureStoreService(SageMakerClient sageMakerClient) {
        return new FeatureStoreService(sageMakerClient);
    }
}

// Service de feature store pour le ML médical
@Service
public class FeatureStoreService {
    
    private final SageMakerClient sageMakerClient;
    private final DataLineageService lineageService;
    
    public void createFeatureGroup(String featureGroupName, FeatureDefinition... definitions) {
        try {
            // Création du feature group avec conformité HIPAA
            CreateFeatureGroupRequest request = CreateFeatureGroupRequest.builder()
                .featureGroupName(featureGroupName)
                .recordIdentifierFeatureName("patient_research_id")
                .eventTimeFeatureName("timestamp")
                .featureDefinitions(Arrays.asList(definitions))
                .onlineStoreConfig(OnlineStoreConfig.builder()
                    .enableOnlineStore(true)
                    .build())
                .offlineStoreConfig(OfflineStoreConfig.builder()
                    .s3StorageConfig(S3StorageConfig.builder()
                        .s3Uri("s3://feature-store-offline/")
                        .build())
                    .build())
                .roleArn("arn:aws:iam::account:role/SageMakerFeatureStoreRole")
                .description("Feature group HIPAA-compliant pour " + featureGroupName)
                .build();
            
            CreateFeatureGroupResponse response = sageMakerClient.createFeatureGroup(request);
            
            // Configuration du monitoring des features
            configureFeatureMonitoring(featureGroupName);
            
            // Enregistrement de la lignée des données
            lineageService.recordFeatureGroupCreation(featureGroupName, definitions);
            
        } catch (SageMakerException e) {
            throw new MLPipelineException("Échec de création du feature group", e);
        }
    }
    
    private void configureFeatureMonitoring(String featureGroupName) {
        // Configuration du monitoring des features pour la conformité FDA
        MonitoringScheduleConfig monitoringConfig = MonitoringScheduleConfig.builder()
            .monitoringType(MonitoringType.DATA_QUALITY)
            .dataQualityJobInput(DataQualityJobInput.builder()
                .endpointInput(EndpointInput.builder()
                    .endpointName(featureGroupName + "-endpoint")
                    .build())
                .build())
            .build();
        
        // Création du schedule de monitoring
        CreateMonitoringScheduleRequest request = CreateMonitoringScheduleRequest.builder()
            .monitoringScheduleName(featureGroupName + "-monitoring")
            .monitoringScheduleConfig(monitoringConfig)
            .build();
        
        sageMakerClient.createMonitoringSchedule(request);
    }
}`,
      language: "java",
      tips: [
        "Utilisez SageMaker Feature Store pour la conformité FDA",
        "Configurez le monitoring des features",
        "Implémentez la traçabilité des données"
      ],
      warnings: [
        "Les modèles ML doivent être validés cliniquement",
        "Respectez les exigences de monitoring FDA"
      ]
    }
  ]

  const implementationChecklist = [
    {
      id: "planning-1",
      title: "Audit de Conformité HIPAA",
      description: "Évaluation complète des exigences HIPAA et identification des gaps",
      category: "planning" as const,
      priority: "critical" as const,
      estimatedTime: "3-4 weeks",
      dependencies: []
    },
    {
      id: "planning-2",
      title: "Design de l'Architecture de Sécurité",
      description: "Conception des couches de sécurité, chiffrement et gestion des accès",
      category: "planning" as const,
      priority: "critical" as const,
      estimatedTime: "2-3 weeks",
      dependencies: ["planning-1"]
    },
    {
      id: "planning-3",
      title: "Modélisation des Données Médicales",
      description: "Design du modèle de données avec anonymisation et conformité HIPAA",
      category: "planning" as const,
      priority: "high" as const,
      estimatedTime: "4-5 weeks",
      dependencies: ["planning-2"]
    },
    {
      id: "implementation-1",
      title: "Configuration d'AWS HealthLake",
      description: "Mise en place d'AWS HealthLake avec conformité HIPAA native",
      category: "implementation" as const,
      priority: "high" as const,
      estimatedTime: "2-3 weeks",
      dependencies: ["planning-3"]
    },
    {
      id: "implementation-2",
      title: "Streaming IoT avec Kinesis",
      description: "Configuration du streaming des données wearables pour latence <1s",
      category: "implementation" as const,
      priority: "high" as const,
      estimatedTime: "3-4 weeks",
      dependencies: ["implementation-1"]
    },
    {
      id: "implementation-3",
      title: "Pipeline ML avec SageMaker",
      description: "Configuration des pipelines ML avec monitoring et conformité FDA",
      category: "implementation" as const,
      priority: "high" as const,
      estimatedTime: "4-5 weeks",
      dependencies: ["implementation-2"]
    },
    {
      id: "testing-1",
      title: "Tests de Conformité HIPAA",
      description: "Validation de la conformité HIPAA et audit trail",
      category: "testing" as const,
      priority: "critical" as const,
      estimatedTime: "3-4 weeks",
      dependencies: ["implementation-3"]
    },
    {
      id: "testing-2",
      title: "Tests de Performance et Latence",
      description: "Validation des SLAs de latence <1s pour les alertes critiques",
      category: "testing" as const,
      priority: "high" as const,
      estimatedTime: "2 weeks",
      dependencies: ["testing-1"]
    },
    {
      id: "deployment-1",
      title: "Déploiement en Production",
      description: "Mise en production avec monitoring HIPAA et alerting",
      category: "deployment" as const,
      priority: "critical" as const,
      estimatedTime: "1-2 weeks",
      dependencies: ["testing-2"]
    },
    {
      id: "monitoring-1",
      title: "Monitoring et Conformité Continue",
      description: "Surveillance continue de la conformité HIPAA et qualité des données",
      category: "monitoring" as const,
      priority: "high" as const,
      estimatedTime: "1 week",
      dependencies: ["deployment-1"]
    }
  ]

  const hipaaDecisionTree = [
    {
      id: "start",
      title: "Architecture HealthTech HIPAA-Compliant",
      description: "Sélection de l'architecture optimale pour une application médicale avec exigences HIPAA strictes",
      question: "Quelle est votre priorité principale ?",
      options: [
        {
          id: "compliance",
          label: "Conformité HIPAA Maximale",
          description: "Conformité HIPAA complète avec audit trail immuable",
          nextNode: "compliance-requirements",
          pros: ["Conformité maximale", "Audit trail complet", "Sécurité renforcée"],
          cons: ["Coût élevé", "Complexité opérationnelle", "Latence accrue"],
          recommendation: "Architecture avec AWS HealthLake et QLDB"
        },
        {
          id: "performance",
          label: "Performance et Latence",
          description: "Latence <1s pour les alertes médicales critiques",
          nextNode: "performance-requirements",
          pros: ["Latence ultra-faible", "Sauvegarde de vies", "Avantage concurrentiel"],
          cons: ["Coût infrastructure élevé", "Complexité technique", "Maintenance complexe"],
          recommendation: "Architecture serverless avec Kinesis et Lambda"
        },
        {
          id: "cost",
          label: "Optimisation des Coûts",
          description: "Budget limité avec ROI rapide",
          nextNode: "cost-requirements",
          pros: ["Coût maîtrisé", "ROI rapide", "Complexité réduite"],
          cons: ["Fonctionnalités limitées", "Scalabilité limitée", "Conformité partielle"],
          recommendation: "Architecture hybride avec services managés AWS"
        }
      ]
    },
    {
      id: "compliance-requirements",
      title: "Exigences de Conformité HIPAA",
      description: "Déterminer le niveau de conformité HIPAA requis pour choisir l'architecture appropriée",
      question: "Quels types de données médicales traitez-vous ?",
      options: [
        {
          id: "phi",
          label: "PHI (Protected Health Information)",
          description: "Données médicales identifiables avec exigences HIPAA strictes",
          outcome: "Architecture HIPAA Complète",
          pros: ["Conformité HIPAA complète", "Audit trail immuable", "Sécurité maximale"],
          cons: ["Coût élevé (50K$/mois)", "Complexité opérationnelle", "Latence 1-5s"],
          recommendation: "Implémentez AWS HealthLake avec chiffrement end-to-end et audit trail immuable"
        },
        {
          id: "deidentified",
          label: "Données Dé-identifiées",
          description: "Données médicales anonymisées pour la recherche",
          outcome: "Architecture de Recherche",
          pros: ["Conformité simplifiée", "Coût réduit", "Flexibilité maximale"],
          cons: ["Limitations d'usage", "Conformité partielle", "Audit limité"],
          recommendation: "Architecture de recherche avec AWS Comprehend Medical pour la dé-identification"
        }
      ]
    }
  ]

  const healthtechTools = [
    {
      id: "aws-healthlake",
      name: "AWS HealthLake",
      description: "Service managé pour l'analyse des données de santé conformes HIPAA",
      category: "Healthcare Platform",
      pricing: "paid" as const,
      features: ["HIPAA Eligible", "FHIR Native", "NLP Medical", "Data Analytics", "Compliance"],
      pros: ["Conformité HIPAA native", "Support FHIR R4", "NLP médical intégré", "Scalabilité AWS", "Support enterprise"],
      cons: ["Coût élevé", "Vendor lock-in AWS", "Fonctionnalités limitées", "Courbe d'apprentissage"],
      bestFor: ["Applications médicales", "Conformité HIPAA", "Données FHIR", "Écosystème AWS"],
      notFor: ["Budget limité", "Multi-cloud", "Fonctionnalités avancées", "Open source"],
      rating: 4.2,
      marketShare: "18.7",
      learningCurve: "medium" as const,
      community: "medium" as const,
      documentation: "good" as const
    },
    {
      id: "aws-kinesis",
      name: "AWS Kinesis Data Streams",
      description: "Service de streaming de données temps réel pour applications haute performance",
      category: "Streaming Platform",
      pricing: "paid" as const,
      features: ["Real-time Streaming", "Auto-scaling", "Fault Tolerance", "Data Retention", "Security"],
      pros: ["Streaming temps réel", "Auto-scaling", "Intégration AWS native", "Haute disponibilité", "Sécurité renforcée"],
      cons: ["Coût élevé pour gros volumes", "Vendor lock-in AWS", "Fonctionnalités limitées", "Complexité de configuration"],
      bestFor: ["Streaming temps réel", "IoT applications", "Analytics temps réel", "Écosystème AWS"],
      notFor: ["Budget limité", "Multi-cloud", "Fonctionnalités avancées", "Open source"],
      rating: 4.4,
      marketShare: "25.3",
      learningCurve: "medium" as const,
      community: "large" as const,
      documentation: "excellent" as const
    },
    {
      id: "aws-sagemaker",
      name: "AWS SageMaker",
      description: "Plateforme complète pour le machine learning avec support enterprise",
      category: "ML Platform",
      pricing: "paid" as const,
      features: ["ML Lifecycle", "AutoML", "Model Monitoring", "Feature Store", "Notebooks"],
      pros: ["Plateforme ML complète", "AutoML intégré", "Monitoring des modèles", "Feature Store", "Intégration AWS"],
      cons: ["Coût élevé", "Vendor lock-in AWS", "Complexité de configuration", "Courbe d'apprentissage"],
      bestFor: ["Machine learning", "MLOps", "Feature engineering", "Écosystème AWS", "Enterprise"],
      notFor: ["Budget limité", "Multi-cloud", "Simplicité", "Open source"],
      rating: 4.6,
      marketShare: "31.2",
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
            <span className="px-3 py-1 bg-green-500/20 text-green-600 dark:text-green-400 rounded-full text-sm font-medium">
              HIPAA Compliant
            </span>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              HealthTech
            </span>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Heart className="w-4 h-4" />
              2025
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            HealthTech HIPAA-Compliant Pipeline
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-4xl">
            Architecture complète pour applications médicales avec conformité HIPAA native, 
            détection d'alertes critiques &lt;1s et prédictions ML avec 85% de précision. 
            Pipeline temps réel pour la télémédecine et l'IoT médical.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              <Code2 className="w-4 h-4" />
              View HIPAA Implementation
            </button>
            <button className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <Brain className="w-4 h-4" />
              Learn Healthcare Architecture
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
          <h2 className="text-3xl font-bold mb-8 text-center">Architecture HealthTech HIPAA-Compliant</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Cette architecture combine conformité HIPAA native et performance temps réel 
                pour offrir une solution médicale moderne et sécurisée. Le système traite 
                100K consultations/jour avec alertes critiques &lt;1s.
              </p>
              <p>
                L'architecture event-driven serverless utilise AWS HealthLake pour la conformité 
                HIPAA, Kinesis pour le streaming IoT, et SageMaker pour les prédictions ML 
                avec monitoring FDA.
              </p>
              <ul className="list-disc list-inside mt-4">
                <li>Conformité HIPAA native avec AWS HealthLake</li>
                <li>Alertes médicales critiques &lt;1s</li>
                <li>Prédictions ML avec 85% de précision</li>
                <li>Monitoring FDA et audit trail immuable</li>
              </ul>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold mb-4">Technologies Healthcare</h3>
              <div className="flex flex-wrap gap-2">
                {["AWS HealthLake", "Kinesis Data Streams", "SageMaker", "IoT Core", "Comprehend Medical", "QLDB"].map((tech) => (
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
          <h2 className="text-3xl font-bold mb-8 text-center">Modélisation des Données Médicales</h2>
          <div className="bg-card rounded-2xl border border-border p-8">
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Conception d'un modèle de données HIPAA-compliant avec anonymisation des PII, 
              gestion des codes ICD-10/CPT et structures optimisées pour le ML médical.
            </p>
            <TutorialSection
              title="Modélisation des Données Médicales"
              description="Conception d'un modèle de données HIPAA-compliant avec anonymisation des PII, gestion des codes ICD-10/CPT et structures optimisées pour le ML médical."
              steps={dataModelingSteps}
              type="implementation"
              icon={Database}
            />
          </div>
        </motion.div>

        {/* HIPAA Architecture Tutorial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Architecture HIPAA et Serverless</h2>
          <div className="bg-card rounded-2xl border border-border p-8">
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Implémentation de l'architecture HIPAA-compliant avec AWS HealthLake, streaming 
              IoT et pipelines ML. Configuration pour la conformité et la performance temps réel.
            </p>
            <TutorialSection
              title="Architecture HIPAA et Serverless"
              description="Implémentation de l'architecture HIPAA-compliant avec AWS HealthLake, streaming IoT et pipelines ML. Configuration pour la conformité et la performance temps réel."
              steps={hipaaArchitectureSteps}
              type="implementation"
              icon={Shield}
            />
          </div>
        </motion.div>

        {/* HIPAA Decision Tree */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Guide de Conformité HIPAA</h2>
          <div className="bg-card rounded-2xl border border-border p-8">
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Utilisez cet arbre de décision pour choisir l'architecture HealthTech optimale 
              selon vos exigences de conformité HIPAA et de performance.
            </p>
            <ArchitectureDiagram
              title="Guide de Conformité HIPAA HealthTech"
              description="Utilisez cet arbre de décision pour choisir l'architecture HealthTech optimale selon vos exigences de conformité HIPAA et de performance."
              type="decision-tree"
              content={hipaaDecisionTree}
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
          <h2 className="text-3xl font-bold mb-8 text-center">Checklist d'Implémentation HIPAA</h2>
          <div className="bg-card rounded-2xl border border-border p-8">
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Suivez cette checklist complète pour assurer une implémentation réussie de votre 
              pipeline HealthTech avec conformité HIPAA et performance temps réel.
            </p>
            <ImplementationChecklist
              title="Checklist d'Implémentation HIPAA"
              description="Suivez cette checklist complète pour assurer une implémentation réussie de votre pipeline HealthTech avec conformité HIPAA et performance temps réel."
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
          <h2 className="text-3xl font-bold mb-8 text-center">Comparaison des Technologies HealthTech</h2>
          <div className="bg-card rounded-2xl border border-border p-8">
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Comparez les technologies HealthTech leaders pour choisir les bons outils pour votre 
              architecture. Évaluez conformité HIPAA, performance et coût.
            </p>
            <ToolComparison
              title="Comparaison des Technologies HealthTech"
              description="Comparez les technologies HealthTech leaders pour choisir les bons outils pour votre architecture. Évaluez conformité HIPAA, performance et coût."
              tools={healthtechTools}
              features={[
                { name: "Conformité HIPAA", description: "Niveau de conformité HIPAA", category: "Compliance" },
                { name: "Performance Temps Réel", description: "Capacités de traitement temps réel", category: "Performance" },
                { name: "Intégration ML", description: "Capacités d'intégration ML", category: "ML" },
                { name: "Scalabilité", description: "Capacité de scaling et croissance", category: "Architecture" },
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
          <h2 className="text-3xl font-bold mb-8 text-center">Bonnes Pratiques HIPAA & HealthTech</h2>
          <div className="bg-card rounded-2xl border border-border p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-xl font-semibold mb-4">Conformité HIPAA</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Utilisez des services HIPAA-eligible par design</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Implémentez un audit trail immuable</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Chiffrez toutes les données au repos et en transit</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-xl font-semibold mb-4">Performance et ML</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Optimisez pour la latence &lt;1s des alertes critiques</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Implémentez le monitoring des modèles ML</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Validez cliniquement tous les modèles prédictifs</span>
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
          <div className="bg-gradient-to-r from-green-500/5 to-primary/5 rounded-2xl border border-border p-8">
            <h3 className="text-2xl font-bold mb-4">Prêt à Construire votre Pipeline HealthTech ?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Commencez l'implémentation de cette architecture HIPAA-compliant aujourd'hui avec 
              nos guides complets et bonnes pratiques. Transformez vos soins de santé et 
              sauvegardez des vies avec la technologie.
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
