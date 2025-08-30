# Cours Magistral : Architecture et Ingénierie des Données Modernes

## Module 1 : Introduction au Data Engineering Moderne

### 1.1 Définition et Enjeux
Le data engineering moderne désigne l'ensemble des processus, technologies et compétences nécessaires pour concevoir, construire et maintenir des systèmes de traitement de données à grande échelle. Contrairement aux approches traditionnelles centrées sur le batch processing, l'ingénierie moderne intègre le temps réel, le cloud computing et l'intelligence artificielle.

**Enjeux principaux** :
- **Volume** : Explosion des données (de Go à Po par jour)
- **Vélocité** : Besoin de traitement en temps réel
- **Variété** : Données structurées, semi-structurées et non structurées
- **Véracité** : Qualité et fiabilité des données
- **Valeur** : Transformation en insights actionnables

### 1.2 Objectifs Pédagogiques
À l'issue de ce cours, vous serez capable de :
- Concevoir une architecture data complète selon les besoins métier
- Choisir les technologies adaptées à différents scénarios
- Identifier et résoudre les bottlenecks de performance
- Optimiser les coûts d'une plateforme data
- Anticiper l'évolution et le scaling des systèmes

### 1.3 Public Cible et Prérequis
**Niveau** : Intermédiaire à Avancé  
**Prérequis** :
- Connaissances de base en bases de données et SQL
- Notions de programmation (Python de préférence)
- Compréhension des concepts cloud (AWS, Azure, ou GCP)

---

## Module 2 : Fondamentaux de l'Ingestion des Données

### 2.1 Types de Données et Caractéristiques

#### Données Transactionnelles (OLTP)
**Définition** : Données opérationnelles générées par les systèmes métiers (commandes, transactions, logs).

**Caractéristiques** :
- Volume : Faible à moyen (Go/jour)
- Vélocité : Haute (millisecondes)
- Structure : Hautement structurée
- Latence : Temps réel ou quasi temps réel

**Exemple concret** : Système de traitement de commandes e-commerce où chaque achat génère une transaction en base de données.

#### Données Analytiques (OLAP)
**Définition** : Données agrégées et historiques pour l'analyse.

**Caractéristiques** :
- Volume : Moyen à très élevé (To/jour)
- Vélocité : Basse à moyenne (heures/jours)
- Structure : Structurée à semi-structurée
- Latence : Heures à jours acceptables

**Exemple** : Data warehouse contenant l'historique des ventes sur 5 ans pour l'analyse des tendances.

### 2.2 Modes d'Ingestion

#### Batch Processing
**Définition** : Traitement périodique de grands volumes de données.

**Avantages** :
- Économique pour grands volumes
- Simplicité de mise en œuvre
- Idempotence facile à garantir
- Retry et recovery simples

**Inconvénients** :
- Latence élevée (heures/jours)
- Pics de charge système
- Données potentiellement obsolètes

**Cas d'usage optimal** :
- Rapports journaliers/mensuels
- Agrégations historiques
- ML training sur données complètes
- Migrations de données

**Technologies** :
- **Orchestration** : Apache Airflow, Dagster, Prefect
- **Processing** : Apache Spark, Hadoop, AWS Glue
- **Stockage temporaire** : HDFS, S3, Azure Data Lake

#### Streaming/Real-time
**Définition** : Traitement continu des données au fil de l'eau.

**Avantages** :
- Latence minimale (ms-secondes)
- Données toujours à jour
- Réaction immédiate aux événements
- Charge système distribuée

**Inconvénients** :
- Coût élevé (infrastructure 24/7)
- Complexité accrue (gestion état, exactly-once)
- Debugging difficile
- Nécessite expertise spécialisée

**Cas d'usage optimal** :
- Détection de fraude
- Recommandations temps réel
- Monitoring et alerting
- IoT et capteurs

**Technologies** :
- **Message Brokers** : Kafka, Pulsar, Kinesis
- **Stream Processing** : Flink, Spark Streaming, Kafka Streams
- **CEP** : Esper, WSO2

### 2.3 Comparaison Batch vs Streaming

| Critère | Batch | Streaming | Hybride (Lambda/Kappa) |
|---------|-------|-----------|------------------------|
| **Latence** | Heures-Jours | Millisecondes-Secondes | Variable selon layer |
| **Coût** | €€ | €€€€€ | €€€€ |
| **Complexité** | Simple | Complexe | Très complexe |
| **Scalabilité** | Horizontale facile | Horizontale complexe | Selon architecture |
| **Cas d'erreur** | Rejeu facile | Rejeu complexe | Dépend du layer |
| **État** | Stateless | Stateful | Mixte |

**Exercice 1** : Pour chaque scénario ci-dessous, recommandez batch, streaming ou hybride et justifiez :
1. Système de reporting mensuel des ventes
2. Détection de fraude sur transactions bancaires
3. Plateforme de recommandation de produits en temps réel
4. Archivage de données historiques pour compliance

**Solution détaillée** :
1. **Batch** : Les rapports mensuels n'ont pas besoin de données en temps réel et traitent de grands volumes historiques.
2. **Streaming** : La fraude nécessite une détection immédiate pour bloquer les transactions suspectes.
3. **Hybride** : Combinaison de traitement batch pour l'entraînement des modèles et streaming pour les recommandations temps réel.
4. **Batch** : L'archivage est un processus périodique sans besoin de temps réel.

---

## Module 3 : Stratégies de Stockage des Données

### 3.1 Types de Stockage

#### Data Lake
**Définition** : Stockage centralisé de données brutes dans leur format natif.

**Technologies principales** :
- **Cloud** : S3, Azure Data Lake, GCS
- **On-premise** : HDFS, MinIO

**Format de fichiers** :
- **Parquet** : Optimal pour analytics (compression columnar)
- **ORC** : Alternative à Parquet, meilleur pour Hive
- **Avro** : Idéal pour streaming (évolution de schéma)
- **Delta/Iceberg** : ACID transactions sur data lake

**Architecture recommandée** :
```
Bronze (Raw) → Silver (Cleaned) → Gold (Business-ready)
```

#### Data Warehouse
**Définition** : Base de données optimisée pour l'analyse avec schéma défini.

**Technologies principales** :
- **Cloud-native** : Snowflake, BigQuery, Redshift
- **Traditional** : Teradata, Oracle Exadata

**Modélisation** :
- **Star Schema** : Fait central + dimensions
- **Snowflake Schema** : Dimensions normalisées
- **Data Vault** : Hub, Link, Satellite

#### Bases NoSQL
**Document Store (MongoDB, DynamoDB)** :
- Use case: Données semi-structurées, catalogues produits
- Scalabilité: Horizontale native
- Consistency: Eventually consistent par défaut

**Column Family (Cassandra, HBase)** :
- Use case: Time series, logs, IoT
- Scalabilité: Linéaire
- Write performance: Excellente

**Graph (Neo4j, Neptune)** :
- Use case: Réseaux sociaux, recommandations
- Requêtes: Traversal complexes optimisés
- Scalabilité: Verticale principalement

**Key-Value (Redis, DynamoDB)** :
- Use case: Cache, sessions, real-time
- Latence: <1ms
- Persistence: Optionnelle

### 3.2 Arbre de Décision pour le Choix de Stockage

```
1. Volume de données?
   └── < 1TB → PostgreSQL/MySQL
   └── 1-10TB → PostgreSQL avec partitioning OU Cloud DW
   └── 10-100TB → Cloud DW (Redshift/BigQuery)
   └── > 100TB → Data Lake + Query Engine (Presto/Athena)

2. Type de requêtes?
   └── OLTP → PostgreSQL/MySQL/Oracle
   └── OLAP → Snowflake/BigQuery/Redshift
   └── Mixed → PostgreSQL + Read Replicas OU HTAP (SingleStore)

3. Budget?
   └── Limité → Open Source (PostgreSQL + Presto + S3)
   └── Moyen → Managed services (RDS + Athena)
   └── Élevé → Premium solutions (Snowflake/Databricks)
```

**Exercice 2** : Pour chaque cas, recommandez la solution de stockage optimale :
1. Startup avec 50Go/jour de données clients, besoin de reporting SQL
2. Scale-up e-commerce avec 500Go/jour, besoin d'analytics temps réel
3. Entreprise IoT avec 10To/jour de données capteurs, requêtes ad-hoc complexes

**Solution détaillée** :
1. **PostgreSQL** : Volume modeste, besoin de SQL traditionnel
2. **Snowflake/BigQuery** : Volume important, besoin de performances analytiques
3. **Data Lake + Presto/Athena** : Volume très important, besoin de flexibilité des requêtes

---

## Module 4 : Processing et Transformation des Données

### 4.1 Moteurs de Processing

#### Apache Spark
**Forces** :
- Unified batch + streaming
- In-memory processing
- Riche écosystème (MLlib, GraphX)
- Support SQL natif

**Limitations** :
- Coût mémoire élevé
- Complexité tuning (shuffle, partitions)
- Overhead pour petits datasets

**Optimisations clés** :
```python
# Partitioning optimal
df.repartition(200, "key_column")

# Broadcast join pour petites tables
broadcast(small_df).join(large_df)

# Cache stratégique
df.cache().count()  # Forcer materialisation
```

#### Apache Flink
**Forces** :
- True streaming (event-time)
- Exactly-once guarantees
- Low latency (<100ms)
- Stateful processing natif

**Limitations** :
- Courbe apprentissage steep
- Moins de connecteurs que Spark
- Community plus petite

#### DBT (Data Build Tool)
**Forces** :
- SQL-only transformations
- Version control natif
- Testing intégré
- Documentation automatique

### 4.2 Patterns d'Architecture

#### Lambda Architecture
```
                 ┌─────────────┐
Source Data ─────┤             ├───→ Batch Layer (Spark)
                 │  Ingestion  │         ↓
                 │             ├───→ Speed Layer (Flink)
                 └─────────────┘         ↓
                                    Serving Layer
```

**Avantages** : Robustesse, reprocessing facile  
**Inconvénients** : Duplication logique, maintenance double

#### Kappa Architecture
```
Source Data ───→ Kafka ───→ Stream Processing ───→ Serving
                   ↑                                   ↓
                   └──────── Replay if needed ────────┘
```

**Avantages** : Architecture simple, single codebase  
**Inconvénients** : Reprocessing historique complexe

**Exercice 3** : Concevez une architecture pour un système de détection de fraude qui doit :
- Traiter 1M transactions/jour
- Détecter les patterns frauduleux en <100ms
- Support des requêtes historiques sur 2 ans
- Budget limité

**Solution détaillée** :
**Architecture Lambda** :
- **Batch Layer** : Spark pour l'entraînement des modèles sur données historiques
- **Speed Layer** : Flink pour la détection en temps réel
- **Serving Layer** : Redis pour les features temps réel + Cassandra pour l'historique

Justification : Lambda permet de concilier le besoin temps réel avec l'analyse historique, tout en optimisant les coûts.

---

## Module 5 : Identification et Résolution des Bottlenecks

### 5.1 Bottlenecks Communs par Étape

#### Ingestion
**Symptômes** :
- Lag croissant dans CDC
- Timeout API fréquents
- Queue overflow

**Solutions** :
- Parallel ingestion (multiple consumers)
- Batch size optimization
- Connection pooling
- Compression at source

#### Processing
**Symptômes** :
- Jobs Spark qui durent >2h
- OOM errors fréquents
- Shuffle spill to disk

**Solutions** :
```scala
// Optimisation Spark
spark.conf.set("spark.sql.adaptive.enabled", "true")
spark.conf.set("spark.sql.adaptive.coalescePartitions.enabled", "true")
spark.conf.set("spark.sql.shuffle.partitions", "200")

// Avoid shuffle when possible
df.repartition($"partition_key")
  .sortWithinPartitions($"sort_key")
```

#### Storage
**Symptômes** :
- Query timeout
- Storage costs explosion
- Slow joins

**Solutions** :
- Partitioning strategy (date, region)
- Z-ordering/clustering
- Materialized views
- Data retention policies

### 5.2 Framework de Métriques de Performance

```python
# SLA Monitoring
class PipelineMetrics:
    def __init__(self):
        self.metrics = {
            'ingestion_latency': {'target': 5, 'unit': 'minutes'},
            'processing_time': {'target': 30, 'unit': 'minutes'},
            'end_to_end_latency': {'target': 45, 'unit': 'minutes'},
            'data_quality_score': {'target': 99.5, 'unit': '%'},
            'system_availability': {'target': 99.9, 'unit': '%'}
        }
    
    def calculate_health_score(self):
        # Aggregate health score
        pass
```

**Exercice 4** : Diagnostiquez et résolvez le problème suivant :
"Un pipeline Spark qui traitait 1To en 2 heures prend maintenant 6 heures pour le même volume. Les données et le code n'ont pas changé."

**Solution détaillée** :
**Diagnostic** :
1. Vérifier la consommation mémoire (OOM errors dans les logs)
2. Analyser le shuffle spill (metrics Spark UI)
3. Examiner la distribution des données (skew)

**Solutions** :
1. Augmenter les partitions : `spark.conf.set("spark.sql.shuffle.partitions", "400")`
2. Optimiser les joins : Utiliser broadcast join pour les petites tables
3. Repartitionner les données : `df.repartition(1000, "partition_key")`

---

## Module 6 : Études de Cas Détaillées

### 6.1 Cas 1 : E-Commerce Temps Réel - Marketplace Global

**Contexte** :
- Marketplace avec 50M utilisateurs actifs
- 5M transactions/jour, 10TB logs/jour
- 50M events/heure en peak

**Besoins Critiques** :
1. Recommandations temps réel (<100ms)
2. Détection fraude instantanée
3. Inventory sync multi-vendeurs
4. Analytics vendeurs real-time
5. Conformité GDPR

**Architecture Solution** :
```
┌───────────────── INGESTION LAYER ─────────────────┐
│ API/DB Sources → Kafka (100 partitions)           │
│          ↓ Schema Registry (Protobuf)             │
└───────────────────────────────────────────────────┘
                            ↓
┌───────────────── PROCESSING LAYERS ───────────────┐
│ HOT PATH: Kafka → Flink → Redis Cluster           │
│ WARM PATH: Kafka → Spark → ClickHouse             │
│ COLD PATH: S3 → Spark → Data Warehouse            │
└───────────────────────────────────────────────────┘
                            ↓
┌───────────────── SERVING LAYER ───────────────────┐
│ Redis (Session State) + Snowflake (Analytics)     │
│ GraphQL API → Mobile/Web Apps                     │
└───────────────────────────────────────────────────┘
```

**Choix Technologiques Justifiés** :
- **Kafka** : Throughput élevé, durability, ecosystem mature
- **Flink** : Low latency, exactly-once processing
- **Redis** : Latence <1ms pour les features temps réel
- **Snowflake** : Performance analytics, separation compute/storage

### 6.2 Cas 2 : Compagnie d'Assurance - "SecureLife Global"

**Contexte** :
- 50M de polices actives dans 25 pays
- 35Mds€ de primes annuelles
- Systèmes OLTP multiples par pays/produit

**Besoins Critiques** :
1. Tarification actuarielle dynamique
2. Vue 360° client cross-produits
3. Reporting Solvency II automatisé
4. Analyse prédictive sinistralité

**Architecture Solution** :
```
┌───────────────── SOURCES MULTIPLES ───────────────┐
│ 25 systèmes core insurance + CRM + Claims         │
│ IoT télématique + Données externes                │
└───────────────────────────────────────────────────┘
                            ↓
┌───────────────── DATA HUB ────────────────────────┐
│ GoldenGate/CDP → Kafka → Data Validation          │
│           ↓                                       │
│   S3 Data Lake (Raw Zone)                         │
│           ↓                                       │
│   Spark ETL → Delta Lake (Curated Zone)           │
│           ↓                                       │
│   Snowflake (Data Warehouse)                      │
└───────────────────────────────────────────────────┘
                            ↓
┌───────────────── SERVING LAYER ───────────────────┐
│ ML Models (SageMaker) → APIs                      │
│ Tableau/Power BI → Dashboards                     │
│ Regulatory Reporting Engine                       │
└───────────────────────────────────────────────────┘
```

**Points Clés** :
- Utilisation de Delta Lake pour l'historisation et ACID transactions
- Snowflake pour les requêtes analytiques complexes sur 20+ ans d'historique
- Architecture event-driven pour la vue client temps réel

**Exercice 5** : Concevez l'architecture pour une plateforme de streaming vidéo avec :
- 15M abonnés, 50K contenus
- Recommandations personnalisées en <100ms
- Analytics usage en temps réel
- Budget de 200K$/mois

**Solution détaillée** :
**Architecture** :
- **Ingestion** : Kafka pour les événements de visionnage
- **Processing** : Flink pour le traitement temps réel, Spark pour le batch
- **Storage** : S3 pour le data lake, Redis pour le cache features
- **Serving** : Microservices pour les recommandations, Druid pour l'analytique

**Justification des choix** :
Kafka pour le throughput, Flink pour la low latency, S3 pour le coût de stockage, Redis pour la performance des recommandations.

---

## Module 7 : Optimisation des Coûts et ROI

### 7.1 Modèle de Coûts Détaillé

**Exemple Pipeline E-commerce (1TB/jour)** :
```
API/DB Sources → Kafka → S3 Raw → Spark on EMR → Snowflake → Tableau
```

**Breakdown mensuel** :
- **Ingestion** (Kafka/MSK): $800
- **Storage** (S3): $250
- **Processing** (EMR Spark): $2,000
- **Analytics** (Snowflake): $3,000
- **Orchestration** (Airflow): $300

**Total: ~$6,350/mois**

### 7.2 Stratégies d'Optimisation

```python
# 1. Compression aggressive
df.write.mode("overwrite") \
  .option("compression", "snappy") \
  .parquet("s3://bucket/path")  # 70% reduction

# 2. Incremental processing
@incremental(
    unique_key="id",
    updated_at="modified_date"
)
def incremental_model():
    # Process only new/changed records
    pass

# 3. Auto-scaling policies
scaling_policy = {
    "min_nodes": 2,
    "max_nodes": 20,
    "scale_up_threshold": 80,  # CPU %
    "scale_down_threshold": 20
}
```

### 7.3 Calcul de ROI

```
ROI = (Gain from Investment - Cost) / Cost × 100

Exemple:
- Coût pipeline: $6,350/mois
- Valeur business:
  - Réduction fraude: $50,000/mois
  - Optimisation stock: $30,000/mois
  - Insights marketing: $20,000/mois
  
ROI = (100,000 - 6,350) / 6,350 × 100 = 1,476%
```

**Exercice 6** : Calculez le ROI pour un pipeline qui coûte 15K€/mois et génère :
- 25K€/mois de réduction de fraude
- 40K€/mois d'optimisation des campagnes marketing
- 15K€/mois de productivité améliorée

**Solution détaillée** :
```
Gain = 25,000 + 40,000 + 15,000 = 80,000€/mois
Coût = 15,000€/mois
ROI = (80,000 - 15,000) / 15,000 × 100 = 433%
```

---

## Module 8 : Conclusion et Best Practices

### 8.1 Checklist des Best Practices

#### Design
- [ ] Idempotence garantie
- [ ] Schema evolution supporté
- [ ] Backfill strategy définie
- [ ] Monitoring/alerting en place
- [ ] Documentation à jour

#### Sécurité
- [ ] Encryption at rest/transit
- [ ] IAM roles (least privilege)
- [ ] Data masking PII
- [ ] Audit logs enabled
- [ ] GDPR compliance

#### Performance
- [ ] Partitioning strategy
- [ ] Indexing optimal
- [ ] Query optimization
- [ ] Resource auto-scaling
- [ ] Cost monitoring

### 8.2 Roadmap d'Évolution Type

#### Phase 1: MVP (0-6 mois)
```
PostgreSQL → Airflow batch → Simple transformations → BI Tool
Coût: ~$500/mois
Volume: <100GB
```

#### Phase 2: Growth (6-18 mois)
```
Multiple sources → S3 Data Lake → Spark/DBT → Redshift → Multiple consumers
Coût: ~$5,000/mois
Volume: 1-10TB
```

#### Phase 3: Scale (18+ mois)
```
Real-time + Batch → Delta Lake → Databricks/Snowflake → ML Platform
Coût: ~$20,000+/mois
Volume: 10TB+
```

### 8.3 Principes de Conception Clés

1. **Commencez simple** : MVP avant optimisation prématurée
2. **Pensez évolutivité** : Architecture qui scale horizontalement
3. **Mesurez tout** : Monitoring et métriques complètes
4. **Automatisez** : CI/CD, testing, déploiements
5. **Documentez** : Knowledge sharing et maintenance

### 8.4 Ressources pour Approfondir

**Livres** :
- "Designing Data-Intensive Applications" par Martin Kleppmann
- "Fundamentals of Data Engineering" par Joe Reis et Matt Housley

**Cours en ligne** :
- Data Engineering Nanodegree (Udacity)
- Apache Spark Certification (Databricks)
- AWS Data Analytics Specialty

**Communautés** :
- Data Engineering Podcast
- r/dataengineering sur Reddit
- Meetups Data Engineering locaux

---

## Évaluation Finale

### Questionnaire à Choix Multiples
1. Quel outil est optimal pour le CDC depuis PostgreSQL?
   a) AWS DMS  
   b) Debezium  
   c) Oracle GoldenGate  
   d) Apache NiFi

2. Quelle architecture convient le mieux pour un besoin de temps réel avec historique?
   a) Lambda Architecture  
   b) Kappa Architecture  
   c) Batch-only  
   d) Microservices

3. Quel format de fichier offre la meilleure compression pour l'analytique?
   a) CSV  
   b) JSON  
   c) Parquet  
   d) Avro

### Projet Pratique Final
**Concevez une architecture complète pour** :
Une fintech avec 5M utilisateurs, traitant 10M transactions/jour, avec besoin de détection de fraude en <100ms et reporting réglementaire journalier.

**Livrables** :
1. Diagramme d'architecture détaillé
2. Justification des choix technologiques
3. Estimation des coûts mensuels
4. Plan de mise en œuvre par phases
5. Stratégie de monitoring et alerting

**Critères d'évaluation** :
- Adéquation architecture/besoin
- Justification des choix techniques
- Optimisation coûts/performance
- Complétude de la solution
- Clarté de la documentation

---

Félicitations ! Vous avez complété le cours magistral sur l'architecture et l'ingénierie des données modernes. Vous disposez maintenant des connaissances nécessaires pour concevoir, implémenter et maintenir des systèmes data robustes, scalables et économiques.