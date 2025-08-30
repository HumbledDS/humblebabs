export interface ChapterContent {
  id: string
  title: string
  level: number
  duration: string
  topics: string[]
  content: string
  examples: string[]
  tools: string[]
  bestPractices: string[]
  challenges: string[]
  solutions: string[]
}

export const coursCompletData: ChapterContent[] = [
  {
    id: "ingestion",
    title: "Ingestion des Données",
    level: 1,
    duration: "2-3 heures",
    topics: ["Types de données", "Modes d'ingestion", "Batch vs Streaming", "Outils et technologies"],
    content: `
# Ingestion des Données

L'ingestion de données est la première étape critique de tout pipeline de données. Elle consiste à collecter, recevoir et stocker des données provenant de diverses sources dans un système centralisé.

## Types de Données

### Données Transactionnelles (OLTP)
Les données transactionnelles sont générées par les systèmes métiers en temps réel. Elles représentent les opérations quotidiennes de l'entreprise.

**Caractéristiques principales :**
- **Volume** : Faible à moyen (GB/jour)
- **Vélocité** : Haute (millisecondes)
- **Structure** : Hautement structurée avec schéma fixe
- **Latence requise** : Temps réel ou quasi temps réel
- **Qualité** : Élevée (validation en temps réel)

**Sources typiques :**
- Systèmes CRM et ERP
- Applications e-commerce
- Systèmes bancaires
- Applications mobiles
- Capteurs IoT

**Outils recommandés :**
- **CDC (Change Data Capture)** : Debezium, AWS DMS, Oracle GoldenGate
- **API/Webhooks** : REST APIs, GraphQL, WebSockets
- **Message Queues** : RabbitMQ, AWS SQS, Apache Kafka
- **ETL traditionnel** : Informatica, Talend, DataStage

### Données Analytiques (OLAP)
Les données analytiques sont agrégées et historiques, optimisées pour l'analyse et le reporting.

**Caractéristiques principales :**
- **Volume** : Moyen à très élevé (TB/jour)
- **Vélocité** : Basse à moyenne (heures/jours)
- **Structure** : Structurée à semi-structurée
- **Latence acceptable** : Heures à jours
- **Qualité** : Variable selon la source

**Sources typiques :**
- Data warehouses existants
- Systèmes de reporting
- Données historiques
- Agrégations métier
- Données externes (APIs publiques)

**Outils recommandés :**
- **ETL/ELT** : Apache Airflow + DBT, Matillion, Talend
- **Batch Processing** : Apache Spark, Hadoop MapReduce
- **Data Warehouses** : Snowflake, BigQuery, Redshift
- **Data Lakes** : S3, Azure Data Lake, GCS

## Modes d'Ingestion

### Batch Processing

Le traitement par lots est la méthode traditionnelle d'ingestion de données. Il consiste à traiter de grands volumes de données à intervalles réguliers.

**Avantages :**
- **Économique** : Coût par unité de données très faible
- **Simple** : Mise en œuvre et maintenance faciles
- **Idempotent** : Garantit la cohérence des données
- **Robuste** : Retry et recovery simples
- **Prévisible** : Charge système planifiée

**Inconvénients :**
- **Latence élevée** : Données potentiellement obsolètes
- **Pics de charge** : Utilisation intensive des ressources
- **Complexité temporelle** : Gestion des dépendances temporelles
- **Rigidité** : Difficile d'ajuster la fréquence

**Cas d'usage optimal :**
- Rapports journaliers/mensuels
- Agrégations historiques
- ML training sur données complètes
- Migrations de données
- Nettoyage et transformation en masse

**Technologies :**
- **Orchestration** : Apache Airflow, Dagster, Prefect, Luigi
- **Processing** : Apache Spark, Hadoop MapReduce, AWS Glue
- **Stockage temporaire** : HDFS, S3, Azure Data Lake
- **Scheduling** : Cron, Windows Task Scheduler, Kubernetes CronJobs

**Métriques de performance :**
- **Coût** : €€ (2/5) - Économique pour grands volumes
- **Complexité** : ★★ (2/5) - Simple à mettre en œuvre
- **Latence** : 1h-24h selon la fréquence
- **Throughput** : TB/jour selon l'infrastructure
- **Scalabilité** : Excellente (horizontale facile)

### Streaming/Real-time

Le traitement en streaming traite les données au fil de l'eau, permettant une réactivité immédiate.

**Avantages :**
- **Latence minimale** : Données disponibles en millisecondes
- **Toujours à jour** : Informations en temps réel
- **Réactivité** : Réaction immédiate aux événements
- **Charge distribuée** : Traitement continu et équilibré
- **Flexibilité** : Adaptation dynamique aux changements

**Inconvénients :**
- **Coût élevé** : Infrastructure 24/7 nécessaire
- **Complexité** : Gestion d'état et exactly-once delivery
- **Debugging difficile** : Problèmes difficiles à reproduire
- **Expertise requise** : Compétences spécialisées nécessaires
- **Gestion d'état** : Complexité de la persistance d'état

**Cas d'usage optimal :**
- Détection de fraude en temps réel
- Recommandations dynamiques
- Monitoring et alerting
- IoT et capteurs
- Trading algorithmique
- Analyse de sentiment

**Technologies :**
- **Message Brokers** : Apache Kafka, Apache Pulsar, AWS Kinesis
- **Stream Processing** : Apache Flink, Spark Streaming, Kafka Streams
- **CEP (Complex Event Processing)** : Esper, WSO2, Apache Beam
- **Real-time Analytics** : Apache Druid, ClickHouse, TimescaleDB

**Métriques de performance :**
- **Coût** : €€€€€ (5/5) - Infrastructure 24/7
- **Complexité** : ★★★★★ (5/5) - Très complexe
- **Latence** : <1s (millisecondes)
- **Throughput** : Millions d'événements/seconde
- **Scalabilité** : Complexe mais possible

## Comparaison Batch vs Streaming

| Critère | Batch | Streaming | Hybride (Lambda/Kappa) |
|---------|-------|-----------|------------------------|
| **Latence** | Heures-Jours | Millisecondes-Secondes | Variable selon layer |
| **Coût** | €€ (2/5) | €€€€€ (5/5) | €€€€ (4/5) |
| **Complexité** | Simple | Complexe | Très complexe |
| **Scalabilité** | Horizontale facile | Horizontale complexe | Selon architecture |
| **Cas d'erreur** | Rejeu facile | Rejeu complexe | Dépend du layer |
| **État** | Stateless | Stateful | Mixte |
| **Débutant** | Recommandé | Éviter | Intermédiaire |
| **Expert** | Utiliser si approprié | Recommandé | Recommandé |

## Architecture Hybride : Lambda et Kappa

### Architecture Lambda
L'architecture Lambda combine les approches batch et streaming pour offrir le meilleur des deux mondes.

**Principe :**
- **Speed Layer** : Traitement en streaming pour la latence
- **Batch Layer** : Traitement par lots pour la précision
- **Serving Layer** : Fusion des résultats pour la cohérence

**Avantages :**
- Latence faible + précision élevée
- Flexibilité dans le choix des technologies
- Robustesse et fiabilité

**Inconvénients :**
- Complexité de maintenance
- Duplication de logique métier
- Coût d'infrastructure élevé

### Architecture Kappa
L'architecture Kappa traite tout en streaming, simplifiant l'architecture.

**Principe :**
- Un seul pipeline de streaming
- Reprocessing des données historiques si nécessaire
- Logique métier centralisée

**Avantages :**
- Simplicité conceptuelle
- Maintenance plus facile
- Cohérence des données

**Inconvénients :**
- Complexité technique du streaming
- Gestion des états complexes
- Expertise requise

## Choix de l'Architecture

### Critères de décision

**1. Latence requise**
- < 1 minute → Streaming obligatoire
- 1 minute - 1 heure → Batch ou streaming selon le budget
- > 1 heure → Batch recommandé

**2. Volume de données**
- < 1 GB/jour → Batch simple
- 1-100 GB/jour → Batch avancé ou streaming simple
- > 100 GB/jour → Streaming ou architecture hybride

**3. Budget disponible**
- Faible → Batch uniquement
- Moyen → Batch + streaming simple
- Élevé → Architecture hybride complète

**4. Expertise de l'équipe**
- Débutant → Batch uniquement
- Intermédiaire → Batch + streaming simple
- Expert → Architecture hybride

### Recommandations par secteur

**E-commerce :**
- Recommandations : Streaming (latence < 100ms)
- Analytics : Batch (rapports journaliers)
- Fraude : Streaming (détection temps réel)

**Finance :**
- Trading : Streaming (latence < 1ms)
- Reporting : Batch (conformité réglementaire)
- Risk : Streaming + Batch (hybride)

**IoT :**
- Monitoring : Streaming (alertes temps réel)
- Analytics : Batch (agrégations historiques)
- Maintenance : Streaming (prédictif)

## Outils et Technologies

### Écosystème Open Source

**Apache Kafka**
- Message broker distribué
- Haute disponibilité et scalabilité
- Idéal pour le streaming
- Écosystème riche (Kafka Streams, KSQL)

**Apache Flink**
- Moteur de streaming unifié
- Gestion d'état avancée
- Exactly-once semantics
- Performance excellente

**Apache Spark**
- Traitement batch et streaming
- Écosystème ML intégré
- Facile à utiliser
- Large communauté

### Solutions Cloud

**AWS :**
- Kinesis (streaming)
- Glue (ETL)
- DMS (migration)
- SQS/SNS (messaging)

**Azure :**
- Event Hubs (streaming)
- Data Factory (ETL)
- Stream Analytics
- Service Bus

**GCP :**
- Pub/Sub (messaging)
- Dataflow (streaming)
- Dataproc (Spark)
- BigQuery (warehouse)

## Bonnes Pratiques

### 1. Gestion des Erreurs
- Implémenter des mécanismes de retry
- Utiliser des dead letter queues
- Monitorer les échecs d'ingestion
- Avoir des stratégies de fallback

### 2. Qualité des Données
- Valider les données à la source
- Implémenter des contrôles de qualité
- Gérer les données manquantes
- Documenter les transformations

### 3. Monitoring et Observabilité
- Métriques de throughput et latence
- Logs détaillés des erreurs
- Dashboards de monitoring
- Alertes automatiques

### 4. Sécurité
- Chiffrement en transit et au repos
- Authentification et autorisation
- Audit des accès
- Conformité réglementaire

## Métriques et KPIs

### Métriques Techniques
- **Throughput** : Données traitées par seconde
- **Latence** : Délai de traitement
- **Disponibilité** : Uptime du système
- **Erreurs** : Taux d'échec des jobs

### Métriques Métier
- **Fréquence de mise à jour** : Actualité des données
- **Complétude** : Pourcentage de données reçues
- **Précision** : Qualité des données ingérées
- **Temps de valeur** : Délai entre réception et utilisation

## Conclusion

L'ingestion de données est la fondation de tout système de données moderne. Le choix entre batch et streaming dépend de vos besoins en latence, budget et expertise. Une approche hybride offre souvent le meilleur compromis entre performance et coût.

**Points clés à retenir :**
1. **Batch** : Simple, économique, approprié pour la plupart des cas
2. **Streaming** : Complexe, coûteux, nécessaire pour la latence
3. **Hybride** : Meilleur des deux mondes, mais plus complexe
4. **Architecture** : Choisir selon les besoins métier, pas la technologie
5. **Évolution** : Commencer simple, évoluer selon les besoins
    `,
    examples: [
      "Pipeline e-commerce : Site web → Kafka → Flink → Redis (recommandations temps réel)",
      "Pipeline financier : Trading systems → Kinesis → Lambda → DynamoDB (analytics temps réel)",
      "Pipeline IoT : Capteurs → MQTT → Kafka → Spark → S3 (agrégations batch)"
    ],
    tools: [
      "Apache Kafka", "Apache Flink", "Apache Spark", "AWS Kinesis", "Google Cloud Pub/Sub",
      "Debezium", "AWS DMS", "Apache Airflow", "DBT", "Fivetran"
    ],
    bestPractices: [
      "Commencez par du batch simple, évoluez vers le streaming selon les besoins",
      "Implémentez des mécanismes de retry et de dead letter queue",
      "Monitorer les métriques de throughput, latence et erreurs",
      "Valider la qualité des données à la source",
      "Documenter toutes les transformations et règles métier"
    ],
    challenges: [
      "Gestion de la latence vs coût",
      "Complexité du streaming en production",
      "Gestion des états et de la cohérence",
      "Debugging des pipelines temps réel",
      "Scalabilité des systèmes de streaming"
    ],
    solutions: [
      "Architecture hybride batch/streaming",
      "Monitoring et observabilité avancés",
      "Tests et simulations en environnement de développement",
      "Documentation et runbooks détaillés",
      "Formation continue de l'équipe"
    ]
  },
  {
    id: "stockage",
    title: "Stockage des Données",
    level: 2,
    duration: "3-4 heures",
    topics: ["Data Lake", "Data Warehouse", "NoSQL", "Architecture de stockage"],
    content: `
# Stockage des Données

Le stockage des données est un composant critique de l'architecture data. Il doit répondre aux besoins de performance, de scalabilité et de coût tout en garantissant la fiabilité et la sécurité.

## Types de Stockage

### Data Lake

Un Data Lake est un système de stockage centralisé qui stocke les données dans leur format natif, brut et non structuré.

**Définition et concept :**
Un Data Lake est un référentiel de données qui stocke de grandes quantités de données brutes dans leur format natif. Contrairement à un Data Warehouse, il n'impose pas de schéma prédéfini et permet une exploration flexible des données.

**Avantages :**
- **Flexibilité** : Aucun schéma imposé, adaptation aux changements
- **Scalabilité** : Stockage illimité, coût par TB très faible
- **Diversité** : Support de tous types de données (structurées, semi-structurées, non structurées)
- **Exploration** : Possibilité de découvrir de nouvelles insights
- **Économique** : Coût de stockage très bas

**Inconvénients :**
- **Complexité** : Difficile à gérer sans gouvernance appropriée
- **Qualité** : Risque de devenir un "Data Swamp" sans contrôle
- **Performance** : Requêtes lentes sans optimisation
- **Sécurité** : Contrôle d'accès complexe
- **Gouvernance** : Nécessite des processus stricts

**Technologies principales :**

**Cloud :**
- **AWS S3** : Service de stockage objet leader du marché
- **Azure Data Lake Storage** : Intégration native avec l'écosystème Azure
- **Google Cloud Storage** : Performance et coût optimisés
- **IBM Cloud Object Storage** : Solutions enterprise

**On-premise :**
- **HDFS (Hadoop Distributed File System)** : Standard open source
- **MinIO** : Compatible S3, déploiement simple
- **Ceph** : Stockage distribué haute disponibilité
- **GlusterFS** : Système de fichiers distribué

**Format de fichiers :**

**Parquet :**
- Format columnar optimisé pour l'analytics
- Compression excellente (2-4x vs CSV)
- Support des types complexes (nested, arrays)
- Compatible avec tous les outils Big Data
- Idéal pour les requêtes analytiques

**ORC (Optimized Row Columnar) :**
- Alternative à Parquet, optimisé pour Hive
- Compression encore meilleure que Parquet
- Support des index et statistiques
- Idéal pour l'écosystème Hadoop

**Avro :**
- Format binaire avec schéma JSON
- Évolution de schéma native
- Idéal pour le streaming et les APIs
- Compression excellente
- Support des types complexes

**Delta Lake / Iceberg :**
- Transactions ACID sur Data Lake
- Gestion des versions et time travel
- Compatible avec Spark et Flink
- Idéal pour les pipelines de production

**Architecture recommandée :**

L'architecture en couches (Medallion Architecture) est recommandée :

\`\`\`
Bronze (Raw) → Silver (Cleaned) → Gold (Business-ready)
\`\`\`

**Bronze Layer :**
- Données brutes, exactement comme reçues
- Aucune transformation
- Rétention longue
- Backup et réplication

**Silver Layer :**
- Données nettoyées et validées
- Schéma appliqué
- Qualité contrôlée
- Historique préservé

**Gold Layer :**
- Données métier optimisées
- Agrégations et KPIs
- Performance optimisée
- Accès utilisateur final

**Coût mensuel estimé (1TB) :**
- **S3 Standard** : ~$23/mois
- **S3 Infrequent Access** : ~$12.50/mois
- **S3 Glacier** : ~$4/mois
- **S3 Deep Archive** : ~$0.99/mois

### Data Warehouse

Un Data Warehouse est une base de données optimisée pour l'analyse et le reporting avec un schéma prédéfini.

**Définition et concept :**
Un Data Warehouse est une base de données relationnelle optimisée pour l'analytics. Il utilise des techniques comme le columnar storage, la compression et l'indexation pour optimiser les requêtes analytiques.

**Avantages :**
- **Performance** : Requêtes analytiques rapides
- **Schéma** : Structure claire et documentée
- **SQL** : Langage standard et familier
- **Intégrité** : Contraintes et validations
- **Gouvernance** : Contrôle d'accès et audit

**Inconvénients :**
- **Rigidité** : Schéma difficile à modifier
- **Coût** : Plus cher que le Data Lake
- **Scalabilité** : Limites de croissance
- **Flexibilité** : Adaptabilité limitée aux changements
- **Complexité** : Administration et maintenance

**Technologies principales :**

**Cloud-native :**
- **Snowflake** : Leader du marché, séparation compute/storage
- **BigQuery** : Intégration native GCP, ML intégré
- **Redshift** : Solution AWS, performance excellente
- **Synapse** : Solution Azure, intégration native

**Traditional :**
- **Teradata** : Solution enterprise éprouvée
- **Oracle Exadata** : Performance extrême
- **IBM Db2 Warehouse** : Solution enterprise IBM
- **SAP HANA** : In-memory, performance exceptionnelle

**Modélisation :**

**Star Schema :**
- Fait central avec dimensions
- Simple à comprendre et utiliser
- Performance optimale pour les requêtes
- Idéal pour les KPIs et métriques

**Snowflake Schema :**
- Dimensions normalisées
- Évite la redondance
- Plus complexe à maintenir
- Performance intermédiaire

**Data Vault :**
- Hub, Link, Satellite
- Évolutivité maximale
- Historisation complète
- Complexité élevée

**Comparaison des solutions :**

| Solution | Coût/TB/mois | Séparation Compute/Storage | Scaling | Concurrent Users | ML Intégré |
|----------|--------------|---------------------------|---------|------------------|------------|
| Snowflake | $40-50 | Oui | Auto | Illimité | Oui |
| BigQuery | $20-25 | Oui | Auto | Illimité | Oui |
| Redshift | $250-350 | Non | Manuel | Limité | Non |
| Synapse | $30-40 | Oui | Auto | Limité | Oui |

### Bases NoSQL

Les bases NoSQL offrent une alternative aux bases relationnelles traditionnelles pour des cas d'usage spécifiques.

**Document Store (MongoDB, DynamoDB) :**

**Caractéristiques :**
- Stockage de documents JSON/BSON
- Schéma flexible et évolutif
- Requêtes complexes sur documents
- Scalabilité horizontale native

**Use cases :**
- Catalogues produits e-commerce
- Contenu management systems
- Applications mobiles
- APIs et microservices

**Avantages :**
- Flexibilité du schéma
- Scalabilité horizontale
- Performance pour les lectures
- Support des types complexes

**Inconvénients :**
- Pas de transactions ACID complètes
- Requêtes complexes limitées
- Consommation mémoire élevée
- Expertise requise

**Column Family (Cassandra, HBase) :**

**Caractéristiques :**
- Stockage orienté colonnes
- Scalabilité linéaire
- Haute disponibilité
- Performance d'écriture excellente

**Use cases :**
- Time series data
- Logs et événements
- IoT et capteurs
- Analytics en temps réel

**Avantages :**
- Scalabilité exceptionnelle
- Performance d'écriture
- Haute disponibilité
- Support des gros volumes

**Inconvénients :**
- Requêtes complexes limitées
- Pas de jointures
- Modélisation complexe
- Expertise spécialisée

**Graph (Neo4j, Neptune) :**

**Caractéristiques :**
- Stockage orienté graphe
- Traversal de relations optimisé
- Requêtes de pattern matching
- Support des algorithmes de graphe

**Use cases :**
- Réseaux sociaux
- Systèmes de recommandation
- Détection de fraude
- Analyse de réseaux

**Avantages :**
- Requêtes de relations complexes
- Algorithmes de graphe intégrés
- Performance pour les traversals
- Modélisation intuitive

**Inconvénients :**
- Scalabilité verticale limitée
- Coût élevé
- Expertise spécialisée
- Cas d'usage spécifiques

**Key-Value (Redis, DynamoDB) :**

**Caractéristiques :**
- Stockage clé-valeur simple
- Performance extrême
- Latence minimale
- Simplicité d'utilisation

**Use cases :**
- Cache et session
- Real-time analytics
- Gaming et IoT
- APIs haute performance

**Avantages :**
- Performance exceptionnelle
- Simplicité d'utilisation
- Latence minimale
- Scalabilité horizontale

**Inconvénients :**
- Fonctionnalités limitées
- Pas de requêtes complexes
- Persistence optionnelle
- Cas d'usage spécifiques

## Choix Architecture selon le Besoin

### Arbre de Décision

**1. Volume de données ?**
- **< 1TB** → PostgreSQL/MySQL
- **1-10TB** → PostgreSQL avec partitioning OU Cloud DW
- **10-100TB** → Cloud DW (Redshift/BigQuery)
- **> 100TB** → Data Lake + Cloud DW hybride

**2. Type de requêtes ?**
- **OLTP** → PostgreSQL/MySQL
- **OLAP** → Data Warehouse
- **Analytics complexes** → Data Lake + Warehouse
- **Real-time** → NoSQL + Cache

**3. Latence requise ?**
- **< 100ms** → Cache + Base principale
- **100ms-1s** → Base optimisée
- **> 1s** → Data Lake

**4. Budget disponible ?**
- **Faible** → Open source + Cloud basique
- **Moyen** → Cloud managed services
- **Élevé** → Solutions enterprise + support

**5. Expertise de l'équipe ?**
- **Débutant** → Solutions managed cloud
- **Intermédiaire** → Cloud + open source
- **Expert** → Solutions sur mesure

### Recommandations par secteur

**E-commerce :**
- **Produits** : MongoDB/DynamoDB (catalogue)
- **Commandes** : PostgreSQL (transactions)
- **Analytics** : BigQuery/Snowflake (reporting)
- **Cache** : Redis (performance)

**Finance :**
- **Trading** : TimescaleDB (time series)
- **Reporting** : Teradata/Oracle (conformité)
- **Fraude** : Neo4j (réseaux)
- **Cache** : Redis (latence)

**IoT :**
- **Capteurs** : InfluxDB/TimescaleDB (time series)
- **Analytics** : ClickHouse (real-time)
- **Historique** : S3 + Athena (coût)
- **Cache** : Redis (performance)

## Architecture de Stockage

### Architecture Lambda (Batch + Streaming)

**Principe :**
- **Speed Layer** : Traitement en streaming pour la latence
- **Batch Layer** : Traitement par lots pour la précision
- **Serving Layer** : Fusion des résultats pour la cohérence

**Implémentation :**
\`\`\`
Streaming → Kafka → Flink → Redis (Speed)
Batch → S3 → Spark → Warehouse (Batch)
Serving → API Gateway → Fusion Layer
\`\`\`

**Avantages :**
- Latence faible + précision élevée
- Flexibilité dans le choix des technologies
- Robustesse et fiabilité

**Inconvénients :**
- Complexité de maintenance
- Duplication de logique métier
- Coût d'infrastructure élevé

### Architecture Kappa (Streaming uniquement)

**Principe :**
- Un seul pipeline de streaming
- Reprocessing des données historiques si nécessaire
- Logique métier centralisée

**Implémentation :**
\`\`\`
Sources → Kafka → Flink → S3 + Warehouse
\`\`\`

**Avantages :**
- Simplicité conceptuelle
- Maintenance plus facile
- Cohérence des données

**Inconvénients :**
- Complexité technique du streaming
- Gestion des états complexes
- Expertise requise

### Architecture Data Mesh

**Principe :**
- Données distribuées par domaine métier
- Gouvernance décentralisée
- APIs standardisées

**Implémentation :**
\`\`\`
Domain 1 → Data Product 1 → API Gateway
Domain 2 → Data Product 2 → API Gateway
Domain 3 → Data Product 3 → API Gateway
\`\`\`

**Avantages :**
- Scalabilité organisationnelle
- Responsabilité claire
- Innovation par domaine

**Inconvénients :**
- Complexité de coordination
- Gouvernance difficile
- Expertise requise

## Performance et Optimisation

### Stratégies d'Optimisation

**Partitioning :**
- Partitionnement par date (recommandé)
- Partitionnement par région/domaine
- Partitionnement par taille
- Éviter le partitionnement excessif

**Indexation :**
- Index sur les colonnes de jointure
- Index sur les colonnes de filtrage
- Index composites pour les requêtes complexes
- Monitoring de l'utilisation des index

**Compression :**
- Parquet avec compression Snappy
- ORC avec compression ZLIB
- Avro avec compression Deflate
- Équilibrer compression et performance

**Caching :**
- Cache Redis pour les requêtes fréquentes
- Cache applicatif pour les données statiques
- Cache de requêtes pour les résultats complexes
- Stratégie d'expiration appropriée

### Monitoring et Observabilité

**Métriques techniques :**
- Throughput (MB/s)
- Latence (ms)
- Utilisation CPU/Mémoire
- Espace disque
- Nombre de connexions

**Métriques métier :**
- Temps de réponse des requêtes
- Disponibilité des données
- Qualité des données
- Coût par requête
- Satisfaction utilisateur

**Outils de monitoring :**
- **Infrastructure** : CloudWatch, Azure Monitor, Stackdriver
- **Base de données** : pg_stat_statements, MySQL Performance Schema
- **Application** : Prometheus, Grafana, Datadog
- **Logs** : ELK Stack, Splunk, CloudWatch Logs

## Sécurité et Gouvernance

### Sécurité des Données

**Chiffrement :**
- Chiffrement en transit (TLS/SSL)
- Chiffrement au repos (AES-256)
- Chiffrement des clés (KMS)
- Rotation automatique des clés

**Authentification :**
- IAM et RBAC
- Multi-factor authentication
- Single sign-on (SSO)
- Gestion des sessions

**Autorisation :**
- Contrôle d'accès granulaire
- Séparation des privilèges
- Audit des accès
- Conformité réglementaire

### Gouvernance des Données

**Catalogage :**
- Métadonnées complètes
- Lignage des données
- Glossaire métier
- Classification des données

**Qualité :**
- Contrôles automatisés
- Métriques de qualité
- Processus de correction
- Monitoring continu

**Compliance :**
- RGPD, CCPA
- SOX, PCI-DSS
- Audit trails
- Reporting réglementaire

## Coût et ROI

### Analyse des Coûts

**Coûts directs :**
- Stockage (par TB/mois)
- Compute (par heure)
- Transfert de données
- Support et licences

**Coûts indirects :**
- Développement et maintenance
- Formation de l'équipe
- Temps d'arrêt
- Complexité opérationnelle

**ROI attendu :**
- Réduction du temps d'analyse
- Amélioration de la prise de décision
- Automatisation des processus
- Innovation et nouveaux produits

### Stratégies d'Optimisation des Coûts

**Cloud :**
- Utiliser les instances spot/reserved
- Optimiser la taille des instances
- Utiliser les services serverless
- Monitoring des coûts en temps réel

**On-premise :**
- Virtualisation et consolidation
- Optimisation des ressources
- Maintenance préventive
- Planification de la capacité

## Conclusion

Le choix de l'architecture de stockage dépend de nombreux facteurs : volume de données, latence requise, budget disponible et expertise de l'équipe. Une approche hybride combinant Data Lake, Data Warehouse et bases NoSQL offre souvent la meilleure flexibilité.

**Points clés à retenir :**
1. **Data Lake** : Flexibilité maximale, coût minimal
2. **Data Warehouse** : Performance optimale, gouvernance forte
3. **NoSQL** : Cas d'usage spécifiques, performance extrême
4. **Architecture** : Choisir selon les besoins métier
5. **Évolution** : Commencer simple, évoluer selon les besoins
6. **Monitoring** : Mesurer et optimiser en continu
7. **Sécurité** : Priorité absolue dès le début
8. **Coût** : Équilibrer performance et budget
    `,
    examples: [
      "E-commerce : MongoDB (produits) + PostgreSQL (commandes) + BigQuery (analytics)",
      "Finance : TimescaleDB (trading) + Teradata (reporting) + Neo4j (fraude)",
      "IoT : InfluxDB (capteurs) + ClickHouse (real-time) + S3 (historique)"
    ],
    tools: [
      "AWS S3", "Azure Data Lake", "Google Cloud Storage", "Snowflake", "BigQuery",
      "Redshift", "MongoDB", "Cassandra", "Neo4j", "Redis", "PostgreSQL"
    ],
    bestPractices: [
      "Implémenter une architecture en couches (Bronze/Silver/Gold)",
      "Utiliser des formats de fichiers optimisés (Parquet, ORC)",
      "Partitionner les données par date pour de meilleures performances",
      "Implémenter des stratégies de compression appropriées",
      "Monitorer les coûts et performances en continu"
    ],
    challenges: [
      "Gestion de la complexité des architectures hybrides",
      "Optimisation des coûts cloud vs performance",
      "Maintenance des schémas et de la gouvernance",
      "Scalabilité des systèmes de stockage",
      "Sécurité et conformité réglementaire"
    ],
    solutions: [
      "Architecture modulaire et évolutive",
      "Monitoring et alerting automatisés",
      "Documentation et processus de gouvernance",
      "Formation continue de l'équipe",
      "Audits de sécurité réguliers"
    ]
  },
  {
    id: "transformation",
    title: "Transformation des Données",
    level: 3,
    duration: "4-5 heures",
    topics: ["ETL/ELT", "Data Quality", "Schema Evolution", "Outils de transformation"],
    content: `
# Transformation des Données

La transformation est l'étape où les données brutes sont nettoyées, enrichies et structurées pour être exploitables. Elle conditionne directement la qualité des analyses et des produits data.

## Pourquoi c'est important

Des données mal transformées entraînent des indicateurs erronés, des modèles ML biaisés et une perte de confiance métier. Une stratégie claire et des tests systématiques sont indispensables.

## ETL vs ELT

### ETL (Extract, Transform, Load)

**Définition** : Pipeline traditionnel où les données sont transformées avant le stockage.

**Processus** :
1. **Extract** : Extraction depuis sources variées
2. **Transform** : Nettoyage et structuration des données
3. **Load** : Chargement dans le système cible

**Avantages** :
- Contrôle total sur les transformations
- Qualité garantie à l'entrée du système cible
- Optimisé pour les bases de données traditionnelles
- Debugging plus facile

**Inconvénients** :
- Complexité de développement et maintenance
- Difficilement scalable pour les gros volumes
- Latence élevée due aux transformations
- Coût de développement élevé

**Technologies** :
- Apache Airflow + Spark pour l'orchestration
- Talend, Informatica pour les outils GUI
- Python/Pandas pour les transformations personnalisées

### ELT (Extract, Load, Transform)

**Définition** : Les données sont chargées brutes puis transformées dans le système cible.

**Avantages** :
- Rapidité de mise en place
- Scalabilité naturelle avec le cloud
- Flexibilité pour les nouvelles transformations
- Coût de stockage bas avec les data lakes

**Inconvénients** :
- Qualité des données moins contrôlée
- Nécessite un système cible puissant
- Complexité des transformations SQL
- Gouvernance plus difficile

**Technologies** : DBT, Spark, Snowflake/BigQuery

## Outils de Transformation

### Apache Spark

Traitement unifié batch et streaming, performance exceptionnelle sur gros volumes.

### DBT (Data Build Tool)

Transformations exclusivement SQL, version control intégré, tests automatisés et documentation.

## Qualité des Données

### Dimensions de la Qualité

**Complétude** (non nullité), **Exactitude** (conformité), **Cohérence** (absence de contradictions), **Actualité** (fraîcheur), **Accessibilité** (facilité d'accès).

### Métriques de Qualité (exemples SQL)

\`\`\`sql
-- Taux de complétude
SELECT COUNT(column_value)*100.0/COUNT(*) AS completeness_rate FROM data_quality_audit;

-- Doublons
SELECT customer_id, COUNT(*) FROM customers GROUP BY customer_id HAVING COUNT(*)>1;
\`\`\`

## Évolution de Schéma

### Techniques et Stratégies

**Avro Schema Evolution** (compatibilité), **Blue-Green Deployment** (migration progressive), **Feature Flags** (activation contrôlée).

## Optimisation des Performances

Partitionnement (date, région, hash), indexation (B-Tree, GIN, BRIN), vues matérialisées, caching (Redis).
    `,
    examples: [
      "ETL traditionnel : Base OLTP → Talend → Data Warehouse → Tableau",
      "ELT moderne : APIs → Airbyte → S3 → DBT → Snowflake → PowerBI",
      "Streaming : Kafka → Flink SQL → Elasticsearch → Kibana"
    ],
    tools: [
      "Apache Spark", "Apache Flink", "DBT", "Apache Airflow", "Talend",
      "Informatica", "Great Expectations", "Apache Atlas", "Deequ"
    ],
    bestPractices: [
      "Commencer par ELT pour les nouveaux projets",
      "Utiliser DBT pour les transformations SQL",
      "Implémenter des tests de qualité automatisés",
      "Prévoir l'évolution des schémas dès la conception",
      "Monitorer les performances des transformations"
    ],
    challenges: [
      "Gestion de la complexité des transformations",
      "Maintenance de la qualité des données",
      "Optimisation des performances",
      "Évolution des schémas en production",
      "Débogage des pipelines complexes"
    ],
    solutions: [
      "Architecture modulaire et testable",
      "Automatisation des tests de qualité",
      "Monitoring et alerting des performances",
      "Stratégies de migration progressive",
      "Documentation et version control"
    ]
  },
  {
    id: "orchestration",
    title: "Orchestration et Workflows",
    level: 4,
    duration: "3-4 heures",
    topics: ["Apache Airflow", "Dagster", "Monitoring", "Gestion des erreurs"],
    content: `
# Orchestration et Workflows

L'orchestration coordonne l'exécution des tâches, gère les dépendances et fiabilise les traitements. C'est le système nerveux d'un écosystème data.

## Pourquoi c'est crucial

Sans orchestration robuste : exécutions imprévisibles, erreurs silencieuses, coûts élevés et manque de traçabilité. Avec de bons DAGs et du monitoring, les opérations deviennent fiables et auditées.

## Concepts Fondamentaux

### DAG (Directed Acyclic Graph)
Graphe orienté acyclique représentant les dépendances entre tâches.

### États des Tâches
Scheduled, Queued, Running, Success, Failed, Skipped, Upstream Failed, Retry.

## Apache Airflow

### Architecture (Web Server, Scheduler, Executor, Worker, Metadata DB)
Configuration typique (Celery/Kubernetes Executor), tagging, catchup, retries.

### Écriture de DAGs
Définition des tâches (Python/Bash), dépendances, sensors, hooks, connections.

## Dagster

### Concepts Innovants
Software-Defined Assets, type safety, materialization, orchestration orientée données.

## Patterns Avancés

### Event-Driven Orchestration
Déclenchement time-based, event-based, data-driven.

### Orchestration Multi-Cloud
Stratégies single/multi/hybrid cloud, latence inter-régions, identité et coûts.

## Monitoring et Observabilité

Métriques clés : DAG duration, Task duration, Success rate, Queue time. Dashboards et alertes.

## Gestion des Ressources

Scaling horizontal (auto-scaling), resource pools, priorités, optimisation des coûts (spot instances).
    `,
    examples: [
      "ETL quotidien : Extraction → Validation → Transformation → Chargement (Airflow)",
      "ML Pipeline : Données → Préparation → Entraînement → Déploiement (Dagster)",
      "Streaming : Kafka → Flink → Elasticsearch → Alertes (Airflow + Sensors)"
    ],
    tools: [
      "Apache Airflow", "Dagster", "Prefect", "Apache NiFi", "Luigi",
      "Kubernetes", "Docker", "Prometheus", "Grafana", "Elasticsearch"
    ],
    bestPractices: [
      "Concevoir des DAGs maintenables et testables",
      "Implémenter un monitoring complet et des alertes",
      "Utiliser des sensors pour les dépendances externes",
      "Prévoir des stratégies de retry et de recovery",
      "Documenter tous les workflows critiques"
    ],
    challenges: [
      "Complexité de gestion des dépendances",
      "Monitoring des pipelines distribués",
      "Gestion des erreurs et recovery",
      "Scaling des workloads variables",
      "Maintenance des DAGs legacy"
    ],
    solutions: [
      "Patterns de conception éprouvés",
      "Monitoring avancé et alertes pertinentes",
      "Circuit breakers et stratégies de retry",
      "Auto-scaling et resource management",
      "Refactoring progressif des DAGs"
    ]
  },
  {
    id: "monitoring",
    title: "Monitoring et Observabilité",
    level: 5,
    duration: "2-3 heures",
    topics: ["Métriques", "Logs", "Alerting", "Dashboards"],
    content: `
# Monitoring et Observabilité

Le monitoring et l'observabilité permettent de détecter les problèmes tôt, d'expliquer les comportements du système et d'améliorer en continu les performances.

## Objectifs

Visibilité (métriques), compréhension (traces/logs) et action (alertes/runbooks) pour réduire MTTR et prévenir les incidents.

## Métriques Clés

### Techniques
Throughput, latence, disponibilité, erreurs.

### Métier
Freshness, complétude, qualité, utilisation.

## Outils

Prometheus, Grafana, ELK/Datadog/Splunk, CloudWatch/Monitor/Stackdriver.

## Alerting

Critique/Urgent/Normal/Info, escalades automatiques, silencing, réduction du bruit.

## Dashboards

Opérationnels (temps réel), métier (KPIs), diagnostic (investigation rapide).
    `,
    examples: [
      "Dashboard Pipeline : Métriques temps réel des tâches en cours",
      "Alerting Critique : Notification immédiate sur les pannes système",
      "Diagnostic : Logs détaillés pour le debugging des erreurs"
    ],
    tools: [
      "Prometheus", "Grafana", "ELK Stack", "Datadog", "New Relic",
      "Splunk", "CloudWatch", "Azure Monitor", "Stackdriver"
    ],
    bestPractices: [
      "Définir des SLO clairs",
      "Monitoring multi-niveaux (infra/app/data)",
      "Alertes intelligentes et actionnables",
      "Runbooks pour scénarios récurrents",
      "Revues post-incident systématiques"
    ],
    challenges: [
      "Volume et cardinalité des métriques",
      "Seuils d'alerte pertinents",
      "Corrélation d'événements distribués",
      "Bruit des alertes",
      "Acculturation des équipes"
    ],
    solutions: [
      "Métriques orientées business",
      "Multi-seuils et fenêtres glissantes",
      "Outils de corrélation et tracing",
      "Politiques de silencing",
      "Formations régulières au monitoring"
    ]
  },
  {
    id: "securite",
    title: "Sécurité et Gouvernance",
    level: 6,
    duration: "2-3 heures",
    topics: ["Chiffrement", "RBAC", "Audit", "Compliance"],
    content: `
# Sécurité et Gouvernance

La sécurité et la gouvernance assurent la protection des données sensibles et la conformité réglementaire tout en préservant l'agilité des équipes.

## Principes Clés

Principe du moindre privilège, défense en profondeur, séparation des responsabilités, approche risk-based.

## Sécurité des Données

### Chiffrement
Au repos (AES-256), en transit (TLS), gestion et rotation des clés (KMS/HSM).

### Authentification et Autorisation
IAM (identités), RBAC/ABAC (contrôle d'accès), SSO/MFA.

## Gouvernance des Données

Catalogage (métadonnées), lignage, glossaire métier, qualité automatisée.

## Conformité

RGPD/CCPA (droits, consentement, DPIA), SOX/HIPAA/PCI-DSS selon le domaine.

## Outils

IAM Cloud, Vault, Apache Ranger/Atlas, Collibra/Alation, SIEM/SOAR, DLP.
    `,
    examples: [
      "RGPD : Consentement et gestion des droits individuels",
      "Multi-tenant : Isolation stricte des données",
      "Zero Trust : Vérification systématique des accès"
    ],
    tools: [
      "AWS IAM", "Azure AD", "Google Cloud IAM", "HashiCorp Vault",
      "Apache Ranger", "Apache Atlas", "Collibra", "Alation"
    ],
    bestPractices: [
      "Moindre privilège par défaut",
      "Chiffrement end-to-end",
      "Audit trail complet",
      "Tests de sécurité réguliers",
      "Programme de sensibilisation continue"
    ],
    challenges: [
      "Gestion des accès multi-cloud",
      "Équilibre sécurité vs utilisabilité",
      "Multiplicité réglementaire",
      "Données sensibles à grande échelle",
      "Formation des équipes"
    ],
    solutions: [
      "Gouvernance unifiée",
      "Automatisation des contrôles",
      "Approche par les risques",
      "Classification automatique",
      "Formations intégrées au runbook"
    ]
  }
]

export default coursCompletData