"use client"

import { motion } from "framer-motion"
import { TutorialSection } from "@/components/projects/tutorial-section"
import { ImplementationChecklist } from "@/components/projects/implementation-checklist"
import { ArchitectureDiagram } from "@/components/projects/architecture-diagram"
import { ToolComparison } from "@/components/projects/tool-comparison"
import { Database, Code2, Brain, CheckCircle, AlertTriangle, ArrowRight, Lightbulb, Factory, Cpu, Activity } from "lucide-react"

export default function ManufacturingIoTPipelinePage() {
  const dataModelingSteps = [
    {
      id: 1,
      title: "Modélisation Time-Series Industrielle",
      description: "Conception des tables optimisées pour les données de capteurs haute fréquence avec compression temporelle intelligente.",
      code: `-- Table pour les lectures de capteurs avec compression temporelle
CREATE TABLE FACT_SENSOR_READING (
    reading_sk BIGINT PRIMARY KEY AUTO_INCREMENT,
    sensor_sk INT NOT NULL,
    equipment_sk INT NOT NULL,
    timestamp TIMESTAMP(3) NOT NULL,
    reading_value DECIMAL(15,6),
    reading_unit VARCHAR(20),
    quality_flag BOOLEAN DEFAULT TRUE,
    compression_level VARCHAR(20), -- raw, 1s, 1min, 5min
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_sensor_timestamp (sensor_sk, timestamp),
    INDEX idx_equipment_timestamp (equipment_sk, timestamp),
    INDEX idx_compression (compression_level)
);

-- Table pour les événements de production discrets
CREATE TABLE FACT_PRODUCTION_EVENT (
    event_sk BIGINT PRIMARY KEY AUTO_INCREMENT,
    equipment_sk INT NOT NULL,
    event_type VARCHAR(100) NOT NULL, -- start_batch, end_batch, change_parameters
    event_timestamp TIMESTAMP NOT NULL,
    operator_sk INT,
    parameters_json JSON,
    duration_minutes INT,
    
    INDEX idx_equipment_event (equipment_sk, event_timestamp),
    INDEX idx_event_type (event_type)
);

-- Table pour les mesures de qualité
CREATE TABLE FACT_QUALITY_MEASUREMENT (
    measurement_sk BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_sk INT NOT NULL,
    equipment_sk INT NOT NULL,
    measurement_timestamp TIMESTAMP NOT NULL,
    measurement_type VARCHAR(100), -- dimensional, destructive, visual
    measurement_value DECIMAL(15,6),
    tolerance_upper DECIMAL(15,6),
    tolerance_lower DECIMAL(15,6),
    is_within_tolerance BOOLEAN,
    inspector_sk INT,
    
    INDEX idx_product_timestamp (product_sk, measurement_timestamp),
    INDEX idx_equipment_timestamp (equipment_sk, measurement_timestamp)
);`,
      language: "sql",
      tips: [
        "Implémentez la compression temporelle pour réduire le volume",
        "Utilisez des index composites pour les requêtes fréquentes",
        "Stockez les paramètres en JSON pour la flexibilité"
      ],
      warnings: [
        "La compression temporelle peut impacter la précision",
        "Planifiez la rétention selon les exigences d'audit"
      ]
    },
    {
      id: 2,
      title: "Dimensions Équipement et Produit",
      description: "Création des dimensions pour la hiérarchie des équipements et les spécifications produits avec gestion des changements.",
      code: `-- Dimension équipement avec hiérarchie flexible
CREATE TABLE DIM_EQUIPMENT (
    equipment_sk INT PRIMARY KEY AUTO_INCREMENT,
    equipment_id VARCHAR(100) NOT NULL,
    equipment_name VARCHAR(255) NOT NULL,
    equipment_type VARCHAR(100),
    parent_equipment_sk INT NULL,
    plant_sk INT NOT NULL,
    line_sk INT NOT NULL,
    cell_sk INT NOT NULL,
    nominal_capacity DECIMAL(15,6),
    mtbf_hours DECIMAL(10,2),
    operational_cost_per_hour DECIMAL(10,2),
    installation_date DATE,
    last_maintenance_date DATE,
    
    INDEX idx_equipment_id (equipment_id),
    INDEX idx_parent (parent_equipment_sk),
    INDEX idx_plant_line (plant_sk, line_sk)
);

-- Dimension produit avec spécifications et tolérances
CREATE TABLE DIM_PRODUCT_SPEC (
    spec_sk INT PRIMARY KEY AUTO_INCREMENT,
    product_sk INT NOT NULL,
    spec_name VARCHAR(100) NOT NULL,
    spec_value DECIMAL(15,6),
    upper_limit DECIMAL(15,6),
    lower_limit DECIMAL(15,6),
    unit VARCHAR(20),
    is_critical BOOLEAN DEFAULT FALSE,
    measurement_method VARCHAR(100),
    
    INDEX idx_product_spec (product_sk, spec_name),
    INDEX idx_critical (is_critical) WHERE is_critical = TRUE
);`,
      language: "sql",
      tips: [
        "Utilisez une hiérarchie adjacency list pour la flexibilité",
        "Implémentez des métriques de maintenance prédictive",
        "Stockez les tolérances pour la validation automatique"
      ],
      warnings: [
        "Les hiérarchies complexes peuvent impacter les performances",
        "Maintenez la cohérence des spécifications produits"
      ]
    }
  ]

  const edgeArchitectureSteps = [
    {
      id: 1,
      title: "Architecture Edge-to-Cloud",
      description: "Implémentation d'une architecture edge-to-cloud avec Azure IoT Edge pour le processing local et Azure IoT Hub pour l'ingestion.",
      code: `// Configuration Azure IoT Edge pour le processing local
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
    public TimeSeriesClient timeSeriesClient() {
        TimeSeriesClientBuilder builder = TimeSeriesClient.builder();
        builder.region(Region.US_EAST_1);
        builder.credentialsProvider(DefaultCredentialsProvider.create());
        
        return builder.build();
    }
}

// Service de processing edge pour la détection d'anomalies
@Service
public class EdgeProcessingService {
    
    private final AnomalyDetectionModel anomalyModel;
    private final DataCompressionService compressionService;
    
    public ProcessedData processSensorData(SensorData rawData) {
        try {
            // Validation des données en edge
            if (!validateSensorData(rawData)) {
                throw new InvalidDataException("Données capteur invalides");
            }
            
            // Détection d'anomalies locale
            AnomalyResult anomaly = anomalyModel.detectAnomaly(rawData);
            
            // Compression intelligente selon l'importance
            CompressedData compressed = compressionService.compressData(rawData, anomaly.getSeverity());
            
            // Enrichissement avec métadonnées edge
            return ProcessedData.builder()
                .originalData(rawData)
                .anomalyResult(anomaly)
                .compressedData(compressed)
                .edgeProcessingTimestamp(Instant.now())
                .edgeNodeId(getEdgeNodeId())
                .build();
                
        } catch (Exception e) {
            handleEdgeProcessingError(rawData, e);
            throw new EdgeProcessingException("Échec du processing edge", e);
        }
    }
}`,
      language: "java",
      tips: [
        "Utilisez Azure IoT Edge pour le processing local",
        "Implémentez la compression intelligente des données",
        "Gérez les erreurs de processing edge"
      ],
      warnings: [
        "Le processing edge peut être limité par les ressources",
        "Testez la robustesse en environnement hostile"
      ]
    }
  ]

  const implementationChecklist = [
    {
      id: "planning-1",
      title: "Audit de l'Infrastructure IoT",
      description: "Évaluation des capteurs, équipements et protocoles industriels existants",
      category: "planning" as const,
      priority: "critical" as const,
      estimatedTime: "2-3 weeks",
      dependencies: []
    },
    {
      id: "planning-2",
      title: "Design de l'Architecture Edge",
      description: "Conception de l'architecture edge-to-cloud avec gestion des contraintes industrielles",
      category: "planning" as const,
      priority: "critical" as const,
      estimatedTime: "3-4 weeks",
      dependencies: ["planning-1"]
    },
    {
      id: "implementation-1",
      title: "Déploiement IoT Edge",
      description: "Configuration et déploiement des gateways edge avec processing local",
      category: "implementation" as const,
      priority: "high" as const,
      estimatedTime: "2-3 weeks",
      dependencies: ["planning-2"]
    },
    {
      id: "implementation-2",
      title: "Configuration IoT Hub",
      description: "Mise en place d'Azure IoT Hub avec Time Series Insights",
      category: "implementation" as const,
      priority: "high" as const,
      estimatedTime: "2-3 weeks",
      dependencies: ["implementation-1"]
    },
    {
      id: "testing-1",
      title: "Tests en Environnement Industriel",
      description: "Validation de la robustesse et des performances en conditions réelles",
      category: "testing" as const,
      priority: "high" as const,
      estimatedTime: "2-3 weeks",
      dependencies: ["implementation-2"]
    }
  ]

  const manufacturingTools = [
    {
      id: "azure-iot-edge",
      name: "Azure IoT Edge",
      description: "Plateforme edge computing pour le processing local des données IoT",
      category: "Edge Computing",
      pricing: "paid" as const,
      features: ["Local Processing", "Container Support", "Security", "Offline Capability", "Azure Integration"],
      pros: ["Processing local", "Support containers", "Sécurité renforcée", "Fonctionnement offline", "Intégration Azure"],
      cons: ["Vendor lock-in Azure", "Ressources limitées", "Complexité de configuration", "Coût élevé"],
      bestFor: ["IoT industriel", "Processing local", "Écosystème Azure", "Environnements hostiles"],
      notFor: ["Budget limité", "Multi-cloud", "Simplicité", "Open source"],
      rating: 4.3,
      marketShare: "24.1",
      learningCurve: "medium" as const,
      community: "large" as const,
      documentation: "good" as const
    },
    {
      id: "azure-iot-hub",
      name: "Azure IoT Hub",
      description: "Service managé pour la connectivité et la gestion des appareils IoT",
      category: "IoT Platform",
      pricing: "paid" as const,
      features: ["Device Management", "Security", "Scalability", "Protocol Support", "Integration"],
      pros: ["Gestion d'appareils", "Sécurité renforcée", "Scalabilité", "Support protocoles", "Intégration Azure"],
      cons: ["Coût élevé", "Vendor lock-in Azure", "Fonctionnalités limitées", "Complexité"],
      bestFor: ["IoT enterprise", "Gestion d'appareils", "Écosystème Azure", "Sécurité"],
      notFor: ["Budget limité", "Multi-cloud", "Simplicité", "Open source"],
      rating: 4.2,
      marketShare: "21.8",
      learningCurve: "medium" as const,
      community: "large" as const,
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
            <span className="px-3 py-1 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
              Industrial IoT
            </span>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              Manufacturing
            </span>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Factory className="w-4 h-4" />
              2025
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Manufacturing IoT Industrial Pipeline
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-4xl">
            Architecture edge-to-cloud pour l'IoT industriel avec processing local intelligent, 
            détection d'anomalies en temps réel et maintenance prédictive. Pipeline optimisé 
            pour 50K capteurs par usine avec latence &lt;100ms.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              <Code2 className="w-4 h-4" />
              View IoT Implementation
            </button>
            <button className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <Brain className="w-4 h-4" />
              Learn Edge Architecture
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
          <h2 className="text-3xl font-bold mb-8 text-center">Architecture IoT Industrielle Edge-to-Cloud</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Cette architecture combine processing edge intelligent et cloud computing pour 
                offrir une solution IoT industrielle robuste et performante. Le système traite 
                750GB/jour avec contrôle qualité &lt;100ms.
              </p>
              <p>
                L'architecture edge-to-cloud utilise Azure IoT Edge pour le processing local, 
                Azure IoT Hub pour l'ingestion, et Time Series Insights pour l'analytique 
                temporelle optimisée.
              </p>
              <ul className="list-disc list-inside mt-4">
                <li>Processing edge pour latence &lt;100ms</li>
                <li>50K capteurs par usine à 100Hz</li>
                <li>Maintenance prédictive avec 40% réduction downtime</li>
                <li>Contrôle qualité zéro défaut (PPM &lt;10)</li>
              </ul>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold mb-4">Technologies IoT Industrielles</h3>
              <div className="flex flex-wrap gap-2">
                {["Azure IoT Edge", "Azure IoT Hub", "Time Series Insights", "OPC-UA", "Modbus", "Apache Flink"].map((tech) => (
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
          <h2 className="text-3xl font-bold mb-8 text-center">Modélisation des Données Industrielles</h2>
          <div className="bg-card rounded-2xl border border-border p-8">
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Conception d'un modèle de données optimisé pour les capteurs haute fréquence avec 
              compression temporelle intelligente et gestion des événements de production.
            </p>
            <TutorialSection
              title="Modélisation des Données Industrielles"
              description="Conception d'un modèle de données optimisé pour les capteurs haute fréquence avec compression temporelle intelligente et gestion des événements de production."
              steps={dataModelingSteps}
              type="implementation"
              icon={Database}
            />
          </div>
        </motion.div>

        {/* Edge Architecture Tutorial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Architecture Edge-to-Cloud</h2>
          <div className="bg-card rounded-2xl border border-border p-8">
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Implémentation de l'architecture edge-to-cloud avec Azure IoT Edge pour le processing 
              local et Azure IoT Hub pour l'ingestion centralisée.
            </p>
            <TutorialSection
              title="Architecture Edge-to-Cloud"
              description="Implémentation de l'architecture edge-to-cloud avec Azure IoT Edge pour le processing local et Azure IoT Hub pour l'ingestion centralisée."
              steps={edgeArchitectureSteps}
              type="implementation"
              icon={Cpu}
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
          <h2 className="text-3xl font-bold mb-8 text-center">Checklist d'Implémentation IoT</h2>
          <div className="bg-card rounded-2xl border border-border p-8">
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Suivez cette checklist complète pour assurer une implémentation réussie de votre 
              pipeline IoT industriel avec processing edge et cloud.
            </p>
            <ImplementationChecklist
              title="Checklist d'Implémentation IoT"
              description="Suivez cette checklist complète pour assurer une implémentation réussie de votre pipeline IoT industriel avec processing edge et cloud."
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
          <h2 className="text-3xl font-bold mb-8 text-center">Comparaison des Technologies IoT</h2>
          <div className="bg-card rounded-2xl border border-border p-8">
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Comparez les technologies IoT industrielles pour choisir les bons outils pour votre 
              architecture. Évaluez performance, coût et intégration.
            </p>
            <ToolComparison
              title="Comparaison des Technologies IoT"
              description="Comparez les technologies IoT industrielles pour choisir les bons outils pour votre architecture. Évaluez performance, coût et intégration."
              tools={manufacturingTools}
              features={[
                { name: "Processing Edge", description: "Capacités de processing local", category: "Performance" },
                { name: "Connectivité", description: "Support des protocoles industriels", category: "Compatibility" },
                { name: "Sécurité", description: "Fonctionnalités de sécurité intégrées", category: "Security" },
                { name: "Scalabilité", description: "Capacité de scaling et croissance", category: "Architecture" },
                { name: "Intégration", description: "Facilité d'intégration avec l'écosystème", category: "Development" }
              ]}
            />
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
            <h3 className="text-2xl font-bold mb-4">Prêt à Moderniser votre Usine avec l'IoT ?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Commencez l'implémentation de votre pipeline IoT industriel aujourd'hui avec 
              nos guides complets et architectures éprouvées. Transformez votre manufacturing 
              et optimisez vos opérations.
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
