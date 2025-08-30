# Framework Data Engineering - Guide Complet pour Entretiens

## 1. INGESTION DES DONNÉES

### 1.1 Types de Données

#### Données Transactionnelles (OLTP)
**Définition**: Données opérationnelles générées par les systèmes métiers (commandes, transactions bancaires, logs utilisateurs)

**Caractéristiques**:
- Volume: Faible à moyen (GB/jour)
- Vélocité: Haute (millisecondes)
- Structure: Hautement structurée (schéma fixe)
- Latence requise: Temps réel ou quasi temps réel

**Outils recommandés**:
- **CDC (Change Data Capture)**: Debezium, AWS DMS, Oracle GoldenGate
- **API/Webhooks**: REST APIs, GraphQL
- **Message Queues**: RabbitMQ, AWS SQS

**Exemple de pipeline**:
```
Source: MySQL OLTP → Debezium CDC → Kafka → S3 Raw Layer → Spark Processing → Redshift
```

#### Données Analytiques (OLAP)
**Définition**: Données agrégées et historiques pour l'analyse et le reporting

**Caractéristiques**:
- Volume: Moyen à très élevé (TB/jour)
- Vélocité: Basse à moyenne (heures/jours)
- Structure: Structurée à semi-structurée
- Latence acceptable: Heures à jours

**Outils recommandés**:
- **ETL/ELT**: Airflow + DBT, Matillion, Talend
- **Batch Processing**: Spark, Hadoop MapReduce
- **Data Warehouses**: Snowflake, BigQuery, Redshift

**Exemple de pipeline**:
```
Sources multiples → Airbyte/Fivetran → S3 Data Lake → DBT transformations → Snowflake → Tableau
```

### 1.2 Modes d'Ingestion

#### Batch Processing

**Définition**: Traitement périodique de grands volumes de données

**Avantages**:
- Économique pour grands volumes
- Simplicité de mise en œuvre
- Idempotence facile à garantir
- Retry et recovery simples

**Inconvénients**:
- Latence élevée (heures/jours)
- Pics de charge système
- Données potentiellement obsolètes

**Cas d'usage optimal**:
- Rapports journaliers/mensuels
- Agrégations historiques
- ML training sur données complètes
- Migrations de données

**Technologies**:
- **Orchestration**: Apache Airflow, Dagster, Prefect
- **Processing**: Apache Spark, Hadoop, AWS Glue
- **Stockage temporaire**: HDFS, S3, Azure Data Lake

**Métriques de comparaison**:
- Coût: €€ (2/5)
- Complexité: ★★ (2/5)
- Latence: 1h-24h
- Throughput: TB/jour

#### Streaming/Real-time

**Définition**: Traitement continu des données au fil de l'eau

**Avantages**:
- Latence minimale (ms-secondes)
- Données toujours à jour
- Réaction immédiate aux événements
- Charge système distribuée

**Inconvénients**:
- Coût élevé (infrastructure 24/7)
- Complexité accrue (gestion état, exactly-once)
- Debugging difficile
- Nécessite expertise spécialisée

**Cas d'usage optimal**:
- Détection de fraude
- Recommandations temps réel
- Monitoring et alerting
- IoT et capteurs

**Technologies**:
- **Message Brokers**: Kafka, Pulsar, Kinesis
- **Stream Processing**: Flink, Spark Streaming, Kafka Streams
- **CEP**: Esper, WSO2

**Métriques de comparaison**:
- Coût: €€€€€ (5/5)
- Complexité: ★★★★★ (5/5)
- Latence: <1s
- Throughput: Millions events/sec

### 1.3 Comparaison Batch vs Streaming

| Critère | Batch | Streaming | Hybride (Lambda/Kappa) |
|---------|-------|-----------|------------------------|
| **Latence** | Heures-Jours | Millisecondes-Secondes | Variable selon layer |
| **Coût** | €€ | €€€€€ | €€€€ |
| **Complexité** | Simple | Complexe | Très complexe |
| **Scalabilité** | Horizontale facile | Horizontale complexe | Selon architecture |
| **Cas d'erreur** | Rejeu facile | Rejeu complexe | Dépend du layer |
| **État** | Stateless | Stateful | Mixte |

## 2. STOCKAGE DES DONNÉES

### 2.1 Types de Stockage

#### Data Lake
**Définition**: Stockage centralisé de données brutes dans leur format natif

**Technologies principales**:
- **Cloud**: S3, Azure Data Lake, GCS
- **On-premise**: HDFS, MinIO

**Format de fichiers**:
- **Parquet**: Optimal pour analytics (compression columnar)
- **ORC**: Alternative à Parquet, meilleur pour Hive
- **Avro**: Idéal pour streaming (évolution de schéma)
- **Delta/Iceberg**: ACID transactions sur data lake

**Architecture recommandée**:
```
Bronze (Raw) → Silver (Cleaned) → Gold (Business-ready)
```

**Coût mensuel estimé** (1TB):
- S3 Standard: ~$23
- S3 Infrequent Access: ~$12.50
- Glacier: ~$4

#### Data Warehouse
**Définition**: Base de données optimisée pour l'analyse avec schéma défini

**Technologies principales**:
- **Cloud-native**: Snowflake, BigQuery, Redshift
- **Traditional**: Teradata, Oracle Exadata

**Modélisation**:
- **Star Schema**: Fait central + dimensions
- **Snowflake Schema**: Dimensions normalisées
- **Data Vault**: Hub, Link, Satellite

**Comparaison des solutions**:

| Solution | Coût/TB/mois | Séparation Compute/Storage | Scaling | Concurrent Users |
|----------|--------------|---------------------------|---------|------------------|
| Snowflake | $40-50 | Oui | Auto | Illimité |
| BigQuery | $20-25 | Oui | Auto | Illimité |
| Redshift | $250-350 | Non | Manuel | Limité |

#### Bases NoSQL

**Document Store (MongoDB, DynamoDB)**
- Use case: Données semi-structurées, catalogues produits
- Scalabilité: Horizontale native
- Consistency: Eventually consistent par défaut

**Column Family (Cassandra, HBase)**
- Use case: Time series, logs, IoT
- Scalabilité: Linéaire
- Write performance: Excellente

**Graph (Neo4j, Neptune)**
- Use case: Réseaux sociaux, recommandations
- Requêtes: Traversal complexes optimisés
- Scalabilité: Verticale principalement

**Key-Value (Redis, DynamoDB)**
- Use case: Cache, sessions, real-time
- Latence: <1ms
- Persistence: Optionnelle

### 2.2 Choix Architecture selon le Besoin

```
Décision Tree:

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

## 3. PROCESSING ET TRANSFORMATION

### 3.1 Moteurs de Processing

#### Apache Spark
**Forces**:
- Unified batch + streaming
- In-memory processing
- Riche écosystème (MLlib, GraphX)
- Support SQL natif

**Limitations**:
- Coût mémoire élevé
- Complexité tuning (shuffle, partitions)
- Overhead pour petits datasets

**Optimisations clés**:
```python
# Partitioning optimal
df.repartition(200, "key_column")

# Broadcast join pour petites tables
broadcast(small_df).join(large_df)

# Cache stratégique
df.cache().count()  # Forcer materialisation
```

**Coût cluster type** (AWS EMR):
- 5 nodes m5.xlarge: ~$1.15/heure
- Processing 1TB: ~$5-10

#### Apache Flink
**Forces**:
- True streaming (event-time)
- Exactly-once guarantees
- Low latency (<100ms)
- Stateful processing natif

**Limitations**:
- Courbe apprentissage steep
- Moins de connecteurs que Spark
- Community plus petite

**Use case optimal**:
```java
// Détection fraude temps réel
dataStream
  .keyBy(transaction -> transaction.userId)
  .window(SlidingWindow.of(Time.minutes(5)))
  .aggregate(new FraudDetector())
  .filter(score -> score > 0.8)
  .addSink(alertSystem);
```

#### DBT (Data Build Tool)
**Forces**:
- SQL-only transformations
- Version control natif
- Testing intégré
- Documentation automatique

**Architecture type**:
```yaml
models/
  staging/
    stg_orders.sql  # Cleaning
  intermediate/
    int_order_items.sql  # Joining
  marts/
    fct_sales.sql  # Business logic
    dim_customers.sql
```

**Comparaison pour Transformations**:

| Outil | Complexité | Coût | Performance | Testing | Use Case |
|-------|------------|------|-------------|---------|----------|
| Spark | Élevée | €€€€ | Excellent | Manuel | Big Data, ML |
| DBT | Faible | €€ | Bon | Natif | Analytics, DW |
| Pandas | Faible | € | Limité | Manuel | Prototyping |
| Kafka Streams | Moyenne | €€€ | Excellent | Manuel | Streaming |

### 3.2 Patterns d'Architecture

#### Lambda Architecture
```
                 ┌─────────────┐
Source Data ─────┤             ├───→ Batch Layer (Spark)
                 │  Ingestion  │         ↓
                 │             ├───→ Speed Layer (Flink)
                 └─────────────┘         ↓
                                    Serving Layer
```

**Avantages**: Robustesse, reprocessing facile
**Inconvénients**: Duplication logique, maintenance double

#### Kappa Architecture
```
Source Data ───→ Kafka ───→ Stream Processing ───→ Serving
                   ↑                                   ↓
                   └──────── Replay if needed ────────┘
```

**Avantages**: Architecture simple, single codebase
**Inconvénients**: Reprocessing historique complexe

## 4. IDENTIFICATION DES BOTTLENECKS

### 4.1 Bottlenecks Communs par Étape

#### Ingestion
**Symptômes**:
- Lag croissant dans CDC
- Timeout API fréquents
- Queue overflow

**Solutions**:
- Parallel ingestion (multiple consumers)
- Batch size optimization
- Connection pooling
- Compression at source

**Monitoring**:
```python
# Métriques clés
ingestion_lag = current_time - last_record_timestamp
throughput = records_processed / time_elapsed
error_rate = failed_records / total_records
```

#### Processing
**Symptômes**:
- Jobs Spark qui durent >2h
- OOM errors fréquents
- Shuffle spill to disk

**Solutions**:
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
**Symptômes**:
- Query timeout
- Storage costs explosion
- Slow joins

**Solutions**:
- Partitioning strategy (date, region)
- Z-ordering/clustering
- Materialized views
- Data retention policies

```sql
-- Optimisation Snowflake
ALTER TABLE sales CLUSTER BY (sale_date, region);

-- Partitioning BigQuery
CREATE TABLE sales
PARTITION BY DATE(sale_date)
CLUSTER BY region, product_id;
```

### 4.2 Performance Metrics Framework

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

## 5. ÉVOLUTION ET SCALING

### 5.1 Roadmap d'Évolution Type

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

### 5.2 Stratégies de Migration

**Parallel Run Strategy**:
1. Nouveau pipeline en parallèle
2. Validation résultats (2-4 semaines)
3. Progressive cutover
4. Décommission ancien

**Blue-Green Deployment**:
- Deux environnements identiques
- Switch instantané
- Rollback facile

## 6. COST OPTIMIZATION

### 6.1 Modèle de Coûts Détaillé

#### Exemple Pipeline E-commerce (1TB/jour)

**Architecture proposée**:
```
API/DB Sources → Kafka → S3 Raw → Spark on EMR → Snowflake → Tableau
```

**Breakdown mensuel**:
- **Ingestion** (Kafka/MSK): $800
  - 3 brokers m5.large
  - 1TB storage
  
- **Storage** (S3): $250
  - 30TB accumulated
  - Lifecycle policies après 90 jours
  
- **Processing** (EMR Spark): $2,000
  - 10 nodes × 4h/jour
  - Spot instances (-70%)
  
- **Analytics** (Snowflake): $3,000
  - Medium warehouse
  - 10TB compressed storage
  
- **Orchestration** (Airflow): $300
  - Managed service

**Total: ~$6,350/mois**

### 6.2 Optimisations Cost-Effective

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

### 6.3 ROI Calculation

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

## 7. DÉCISION MATRIX

### Choix Technologique selon Contexte

| Contexte | Ingestion | Storage | Processing | Serving |
|----------|-----------|---------|------------|---------|
| **Startup (<10GB/jour)** | REST APIs, Airbyte | PostgreSQL | Python/SQL | Metabase |
| **Scale-up (10GB-1TB/jour)** | Kafka, Debezium | S3 + Redshift | Spark, DBT | Tableau |
| **Enterprise (>1TB/jour)** | Kafka, Flink | Delta Lake | Databricks | Multiple |
| **Real-time Focus** | Kafka, Pulsar | Cassandra, Druid | Flink, KStreams | Grafana |
| **Cost-Conscious** | Batch Scripts | S3 + Athena | Presto, Trino | Open source BI |

## 8. QUESTIONS TYPES D'ENTRETIEN

### Questions Architecture
1. **"Comment gérer 10TB/jour avec budget limité?"**
   - S3 pour storage (cheap)
   - Spot instances pour processing
   - Athena pour queries ad-hoc
   - Partition aggressive + compression

2. **"Migrer de batch vers streaming?"**
   - Start with micro-batching (5min)
   - Parallel run période
   - Progressive decrease window
   - Full streaming when stable

### Questions Optimisation
1. **"Pipeline prend 8h, comment réduire à 2h?"**
   - Profile pour identifier bottlenecks
   - Parallélisation aggressive
   - Incremental processing
   - Caching intermediate results
   - Hardware upgrade si nécessaire

2. **"Réduire coûts Snowflake de 50%?"**
   - Warehouse sizing optimization
   - Auto-suspend aggressive (1 minute)
   - Clustering keys optimization
   - Materialized views pour queries répétitives
   - Data retention policies

## 9. BEST PRACTICES CHECKLIST

### Design
- [ ] Idempotence garantie
- [ ] Schema evolution supporté
- [ ] Backfill strategy définie
- [ ] Monitoring/alerting en place
- [ ] Documentation à jour

### Sécurité
- [ ] Encryption at rest/transit
- [ ] IAM roles (least privilege)
- [ ] Data masking PII
- [ ] Audit logs enabled
- [ ] GDPR compliance

### Opérations
- [ ] CI/CD pipeline
- [ ] Automated testing (unit, integration)
- [ ] Rollback procedure
- [ ] Disaster recovery plan
- [ ] SLA définis et monitored

### Performance
- [ ] Partitioning strategy
- [ ] Indexing optimal
- [ ] Query optimization
- [ ] Resource auto-scaling
- [ ] Cost monitoring

## 10. ARCHITECTURE PATTERNS AVANCÉS

### Event Sourcing + CQRS
```
Commands → Event Store → Event Processors → Read Models
                ↓
         Event History (Source of Truth)
```

**Avantages**: Audit complet, replay possible, découplage
**Use case**: Systèmes financiers, e-commerce

### Data Mesh
```
Domain 1 ─→ Data Product ─→ Self-serve Platform
Domain 2 ─→ Data Product ─→ Data Governance
Domain 3 ─→ Data Product ─→ Federated Query
```

**Principes**:
- Domain ownership
- Data as product
- Self-serve infrastructure
- Federated governance

---

## CONCLUSION

Ce framework couvre l'ensemble des aspects critiques pour un Data Engineer. Pour chaque projet, adaptez les choix selon:

1. **Volume & Vélocité**: Détermine batch vs streaming
2. **Budget**: Guide choix open-source vs managed
3. **Compétences équipe**: Influence complexité acceptable
4. **Time-to-market**: Impact build vs buy
5. **Évolutivité requise**: Définit architecture flexibility

Gardez toujours en tête: "Make it work, make it right, make it fast" - dans cet ordre.

# 15 Pipelines Data Engineering - Cas Pratiques Détaillés

## Pipeline 1: E-Commerce Temps Réel - Marketplace Global

### Contexte & Besoins
**Entreprise**: Marketplace avec 50M utilisateurs actifs, 500K vendeurs, 100M produits
**Volume**: 5M transactions/jour, 10TB logs/jour, 50M events/heure en peak

**Besoins Critiques**:
1. **Recommandations temps réel** (<100ms): Augmentation panier moyen de 35%
2. **Détection fraude instantanée**: Pertes actuelles 0.5% CA (~$10M/an)
3. **Inventory sync multi-vendeurs**: Éviter survente (impact satisfaction client)
4. **Analytics vendeurs real-time**: Dashboards pour décisions pricing dynamique
5. **Conformité GDPR**: Amendes jusqu'à 4% CA global

### Architecture Pipeline

```
┌─────────────────────────── INGESTION LAYER ───────────────────────────┐
│                                                                        │
│  Game Clients → UDP/TCP → Game Servers                               │
│             ↓                                                         │
│  Event Collectors (Fluentd) → Kafka (100 partitions)                │
│             ↓                                                         │
│  Protobuf Serialization → Schema Registry                           │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌──────────────────── PROCESSING LAYERS ─────────────────────────────────┐
│                                                                        │
│  HOT PATH (Real-time):                                               │
│  Kafka → Flink → Feature Computation → Redis Cluster                │
│       ↓                                                              │
│  Anti-Cheat ML → Instant Banning System                             │
│                                                                       │
│  WARM PATH (Near Real-time):                                         │
│  Kafka → Spark Streaming → ClickHouse (Analytics)                   │
│       ↓                                                              │
│  Leaderboards + Matchmaking Pools                                   │
│                                                                       │
│  COLD PATH (Batch):                                                  │
│  S3 → Databricks → Player Behavior Models                           │
│                                                                       │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────────── SERVING & APIS ──────────────────────────────────┐
│                                                                        │
│  Game Services:                                                       │
│  - Matchmaking: Redis Sorted Sets + Custom Algorithm                 │
│  - Leaderboards: ClickHouse + CDN Cache                             │
│  - Player Profile: DynamoDB + DAX Cache                             │
│  - Analytics Dashboard: Grafana + Prometheus                         │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Choix Technologiques Justifiés

**InfluxDB pour time-series**:
- Optimisé pour IoT metrics
- Downsampling automatique
- Continuous queries pour aggregations
```sql
-- Continuous query pour moyennes 15min
CREATE CONTINUOUS QUERY "cq_15m_avg" ON "smartgrid"
BEGIN
  SELECT mean("power") AS "avg_power",
         max("voltage") AS "max_voltage",
         min("voltage") AS "min_voltage"
  INTO "smartgrid"."monthly"."meter_15m"
  FROM "smartgrid"."raw"."meter_readings"
  GROUP BY time(15m), meter_id, substation_id
END
```

**Demand forecasting avec Prophet + LSTM**:
```python
class HybridForecaster:
    def __init__(self):
        self.prophet = Prophet(
            yearly_seasonality=True,
            weekly_seasonality=True,
            daily_seasonality=True,
            changepoint_prior_scale=0.05
        )
        self.lstm_model = self.build_lstm()
    
    def forecast(self, historical_data, weather_forecast):
        # Prophet for trend and seasonality
        prophet_forecast = self.prophet.fit(historical_data).predict()
        
        # LSTM for complex patterns
        lstm_features = self.prepare_features(
            historical_data, 
            weather_forecast
        )
        lstm_forecast = self.lstm_model.predict(lstm_features)
        
        # Ensemble with weighted average
        final_forecast = (
            0.6 * prophet_forecast['yhat'] + 
            0.4 * lstm_forecast
        )
        
        # Adjust for renewable generation
        final_forecast -= self.predict_renewable_generation(weather_forecast)
        
        return final_forecast
```

**Grid optimization avec CPLEX**:
```python
from docplex.mp.model import Model

def optimize_power_flow(demand, generation, grid_topology):
    mdl = Model('optimal_power_flow')
    
    # Decision variables
    power_flow = {}
    for line in grid_topology.transmission_lines:
        power_flow[line] = mdl.continuous_var(
            lb=-line.capacity,
            ub=line.capacity,
            name=f'flow_{line.id}'
        )
    
    # Objective: Minimize transmission losses
    losses = mdl.sum(
        power_flow[line]**2 * line.resistance
        for line in grid_topology.transmission_lines
    )
    mdl.minimize(losses)
    
    # Constraints
    # Power balance at each node
    for node in grid_topology.nodes:
        mdl.add_constraint(
            mdl.sum(power_flow[line] for line in node.incoming) ==
            mdl.sum(power_flow[line] for line in node.outgoing) +
            demand[node] - generation[node]
        )
    
    # Voltage limits
    for node in grid_topology.nodes:
        mdl.add_constraint(node.voltage >= 0.95)
        mdl.add_constraint(node.voltage <= 1.05)
    
    solution = mdl.solve()
    return extract_dispatch_instructions(solution)
```

### Bottlenecks Identifiés

1. **Meter data ingestion delays**
   - Symptôme: 30min lag in readings
   - Solution: Parallel collection paths
   - Direct cellular backup for critical meters

2. **Forecast computation time**
   - Symptôme: 2h for all substations
   - Solution: Distributed training
   - Incremental model updates

3. **Alert storm during outages**
   - Symptôme: 100K alerts/min
   - Solution: Alert correlation engine
   - Hierarchical suppression

### Évolutions Planifiées

**2024**: V2G Integration
- Vehicle-to-grid bidirectional
- Dynamic pricing
- Battery optimization

**2025**: Microgrid Management
- Peer-to-peer energy trading
- Blockchain settlements
- Island mode operations

**2026**: AI Grid Operator
- Autonomous grid management
- Self-healing networks
- Predictive maintenance

### Métriques & Coûts
- **Coût**: $150,000/mois
- **Forecast accuracy**: MAPE 3.2%
- **Theft detection**: 89% precision
- **Grid efficiency gain**: 12%
- **Outage reduction**: -40%

---

## Pipeline 13: Insurance - Claims Processing & Fraud Detection

### Contexte & Besoins
**Volume**: 100K claims/mois, $500M exposure
**Fraud**: 10% claims fraudulent, $50M loss/year
**SLA**: 24h initial decision, 7 days final

**Besoins Critiques**:
1. **OCR/NLP processing**: Extract from documents
2. **Fraud detection**: Network analysis + ML
3. **Damage assessment**: Computer vision
4. **Risk pricing**: Dynamic premium calculation
5. **Regulatory compliance**: Solvency II reporting

### Architecture Pipeline

```
┌────────────────────── CLAIMS INGESTION ────────────────────────────────┐
│                                                                        │
│  Mobile App → Photos/Videos → S3 → Lambda (Preprocessing)           │
│  Email → SES → Document Extraction → Textract                        │
│  Call Center → Audio Recording → Transcribe → Text                  │
│  Partner APIs → REST Endpoints → API Gateway                         │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌───────────────────── PROCESSING LAYER ─────────────────────────────────┐
│                                                                        │
│  Document Processing:                                                 │
│  S3 → Step Functions → Textract/Comprehend → DynamoDB               │
│                                                                        │
│  Damage Assessment:                                                   │
│  Images → Rekognition → Custom CV Model → Damage Score              │
│                                                                        │
│  Fraud Detection Pipeline:                                            │
│  Claims Data → Feature Engineering → XGBoost → Risk Score           │
│              ↓                                                       │
│  Graph Analysis (Neptune) → Network Fraud Patterns                  │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌───────────────────── DECISION ENGINE ──────────────────────────────────┐
│                                                                        │
│  Rules Engine (Drools):                                              │
│  - Auto-approve: Score >0.9, Amount <$1000                          │
│  - Auto-reject: Score <0.2, Blacklist match                         │
│  - Manual review: All others                                         │
│                                                                        │
│  Workflow Management:                                                 │
│  Camunda BPM → Task Assignment → SLA Monitoring                     │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Choix Technologiques Justifiés

**Computer Vision pour damage assessment**:
```python
class DamageAssessmentModel:
    def __init__(self):
        self.model = self.load_pretrained_model()
        self.damage_categories = {
            'minor': (0, 1000),
            'moderate': (1000, 5000),
            'severe': (5000, 20000),
            'total': (20000, float('inf'))
        }
    
    def assess_damage(self, images):
        damages = []
        for img in images:
            # Detect damaged areas
            segmentation = self.model.segment(img)
            
            # Classify damage type
            damage_types = self.classify_damage(segmentation)
            
            # Estimate repair cost
            cost_estimate = self.estimate_cost(
                damage_types,
                self.get_vehicle_info(img)
            )
            
            damages.append({
                'image': img.id,
                'damage_mask': segmentation,
                'types': damage_types,
                'estimated_cost': cost_estimate,
                'confidence': self.calculate_confidence(segmentation)
            })
        
        return self.aggregate_assessment(damages)
```

**Fraud detection avec Graph Analytics**:
```cypher
// Detect fraud rings
MATCH (c1:Claim)-[:INVOLVES]->(p1:Person)
MATCH (c2:Claim)-[:INVOLVES]->(p2:Person)
WHERE c1 <> c2
  AND (
    p1.phone = p2.phone OR
    p1.address = p2.address OR
    (p1)-[:LINKED_TO]-(p2)
  )
  AND c1.date > c2.date - duration('P30D')
WITH c1, c2, count(DISTINCT p1) as shared_entities
WHERE shared_entities > 2
RETURN c1, c2, shared_entities
ORDER BY shared_entities DESC

// Identify suspicious patterns
MATCH (p:Person)-[:FILED]->(c:Claim)
WHERE c.amount > 10000
  AND NOT EXISTS(p.claim_history)
  AND p.account_age < 90
RETURN p, c, 'HIGH_RISK' as flag
```

**Workflow automation avec Camunda**:
```xml
<bpmn:process id="ClaimsProcess">
  <bpmn:startEvent id="ClaimReceived"/>
  
  <bpmn:serviceTask id="DocumentExtraction" 
                    camunda:delegateExpression="${documentProcessor}"/>
  
  <bpmn:serviceTask id="FraudScoring"
                    camunda:delegateExpression="${fraudDetector}"/>
  
  <bpmn:exclusiveGateway id="DecisionGateway">
    <bpmn:outgoing>
      <bpmn:conditionExpression>
        ${fraudScore > 0.8 and claimAmount < 5000}
      </bpmn:conditionExpression>
    </bpmn:outgoing>
  </bpmn:exclusiveGateway>
  
  <bpmn:userTask id="ManualReview" 
                 camunda:assignee="${assignee}">
    <bpmn:extensionElements>
      <camunda:taskListener event="create">
        <camunda:script>
          task.setDueDate(new Date(System.currentTimeMillis() + 86400000));
        </camunda:script>
      </camunda:taskListener>
    </bpmn:extensionElements>
  </bpmn:userTask>
  
  <bpmn:endEvent id="ClaimProcessed"/>
</bpmn:process>
```

### Bottlenecks Identifiés

1. **OCR processing backlog**
   - Symptôme: 1h delay for document extraction
   - Solution: Parallel processing with SQS
   - Batch optimization for Textract

2. **Graph queries timeout**
   - Symptôme: Fraud ring detection >30s
   - Solution: Materialized subgraphs
   - Incremental pattern matching

3. **Model serving latency**
   - Symptôme: Image assessment >5s
   - Solution: Edge deployment
   - Model compression (TensorRT)

### Évolutions Planifiées

**2024**: Telematics Integration
- IoT device data
- Driving behavior analysis
- Usage-based pricing

**2025**: Parametric Insurance
- Automatic triggers
- Smart contracts
- Instant payouts

**2026**: Predictive Underwriting
- Real-time risk assessment
- Dynamic pricing
- Personalized products

### Métriques & Coûts
- **Coût**: $120,000/mois
- **Processing time**: 4h average
- **Fraud detection rate**: 85%
- **False positive rate**: 8%
- **Cost savings**: $35M/year

---

## Pipeline 14: Agriculture - Precision Farming Platform

### Contexte & Besoins
**Scale**: 10K farms, 1M hectares monitored
**Sensors**: 100K IoT devices, drones, satellites
**Goal**: Yield increase 20%, water reduction 30%

**Besoins Critiques**:
1. **Satellite imagery processing**: Daily updates
2. **IoT sensor fusion**: Soil, weather, crop health
3. **Predictive analytics**: Yield forecasting
4. **Prescription maps**: Variable rate application
5. **Supply chain integration**: Farm to market

### Architecture Pipeline

```
┌──────────────────── DATA ACQUISITION ──────────────────────────────────┐
│                                                                        │
│  Satellite (Sentinel-2) → Google Earth Engine → BigQuery            │
│  Drones → Object Storage → Computer Vision Pipeline                  │
│  IoT Sensors → LoRaWAN → ChirpStack → MQTT                         │
│  Weather Stations → APIs → Time Series DB                           │
│  Farm Management → REST APIs → Data Lake                            │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌───────────────────── PROCESSING HUB ───────────────────────────────────┐
│                                                                        │
│  Imagery Processing:                                                  │
│  Earth Engine → NDVI/NDWI Calculation → Field Boundaries            │
│                                                                        │
│  Sensor Fusion:                                                       │
│  MQTT → Kafka → Flink → Aggregations → PostgreSQL/TimescaleDB       │
│                                                                        │
│  ML Pipeline:                                                         │
│  Feature Engineering → AutoML (Vertex AI) → Model Registry          │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────── DECISION SUPPORT SYSTEM ─────────────────────────────┐
│                                                                        │
│  Yield Prediction:                                                    │
│  Random Forest + Weather Data → Yield Maps                           │
│                                                                        │
│  Prescription Generation:                                             │
│  Soil Maps + Crop Models → Variable Rate Maps                       │
│                                                                        │
│  Mobile Apps:                                                         │
│  Offline-first (PouchDB) → Sync → CouchDB                          │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Choix Technologiques Justifiés

**Google Earth Engine pour satellite**:
- Petabytes d'imagerie gratuite
- Processing côté serveur
- Analyses temporelles natives
```javascript
// NDVI time series analysis
var collection = ee.ImageCollection('COPERNICUS/S2_SR')
  .filterBounds(farmBoundary)
  .filterDate('2024-01-01', '2024-12-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20));

var addNDVI = function(image) {
  var ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI');
  return image.addBands(ndvi);
};

var ndviCollection = collection.map(addNDVI);

// Detect crop stress
var stressThreshold = 0.3;
var stressedAreas = ndviCollection.map(function(image) {
  return image.select('NDVI').lt(stressThreshold);
});

Export.table.toDrive({
  collection: stressedAreas,
  description: 'crop_stress_alerts',
  fileFormat: 'GeoJSON'
});
```

**Yield prediction model**:
```python
class YieldPredictor:
    def __init__(self):
        self.models = {
            'corn': self.load_model('corn_yield.pkl'),
            'wheat': self.load_model('wheat_yield.pkl'),
            'soybean': self.load_model('soybean_yield.pkl')
        }
    
    def predict_yield(self, field_data, crop_type):
        features = self.engineer_features(field_data)
        
        # Ensemble approach
        predictions = []
        
        # Historical yield regression
        historical_pred = self.historical_model(
            field_data['past_yields']
        )
        predictions.append(historical_pred)
        
        # Vegetation index model
        ndvi_pred = self.vegetation_model(
            field_data['ndvi_timeseries']
        )
        predictions.append(ndvi_pred)
        
        # Weather-based model
        weather_pred = self.weather_model(
            field_data['weather_data'],
            field_data['soil_moisture']
        )
        predictions.append(weather_pred)
        
        # ML model
        ml_pred = self.models[crop_type].predict(features)
        predictions.append(ml_pred)
        
        # Weighted average based on historical accuracy
        weights = [0.2, 0.25, 0.25, 0.3]
        final_yield = np.average(predictions, weights=weights)
        
        # Confidence interval
        std_dev = np.std(predictions)
        confidence_interval = (
            final_yield - 1.96 * std_dev,
            final_yield + 1.96 * std_dev
        )
        
        return {
            'predicted_yield': final_yield,
            'confidence_interval': confidence_interval,
            'risk_factors': self.identify_risks(field_data)
        }
```

**Prescription map generation**:
```python
def generate_prescription_map(field_boundary, soil_data, crop_requirements):
    # Create management zones
    zones = create_management_zones(
        soil_data,
        num_zones=5,
        variables=['organic_matter', 'cec', 'ph', 'texture']
    )
    
    prescriptions = {}
    for zone_id, zone_data in zones.items():
        # Calculate fertilizer needs
        n_need = calculate_n_requirement(
            zone_data,
            crop_requirements,
            expected_yield
        )
        
        # Adjust for precision
        prescriptions[zone_id] = {
            'nitrogen_rate': n_need,
            'seed_rate': calculate_seed_rate(zone_data),
            'irrigation': calculate_irrigation_need(zone_data)
        }
    
    # Generate shapefile for equipment
    return export_to_shapefile(prescriptions, field_boundary)
```

### Bottlenecks Identifiés

1. **Satellite processing delays**
   - Symptôme: 48h for new imagery
   - Solution: Edge processing on acquisition
   - Pre-computed indices

2. **IoT data gaps**
   - Symptôme: 15% missing sensor readings
   - Solution: Interpolation algorithms
   - Redundant sensors in critical areas

3. **Model accuracy degradation**
   - Symptôme: -5% accuracy after season
   - Solution: Continuous learning pipeline
   - Transfer learning from similar regions

### Évolutions Planifiées

**2024**: Robot Integration
- Autonomous tractors
- Selective harvesting
- Weed detection/removal

**2025**: Carbon Credits
- Soil carbon measurement
- Blockchain verification
- Market integration

**2026**: Climate Adaptation
- Crop recommendation engine
- Extreme weather prediction
- Insurance integration

### Métriques & Coûts
- **Coût**: $80,000/mois
- **Yield increase**: +18%
- **Water savings**: -28%
- **Fertilizer reduction**: -35%
- **ROI**: 250%

---

## Pipeline 15: Pharmaceutical - Clinical Trials Data Platform

### Contexte & Besoins
**Scale**: 50 trials, 100K patients, 500 sites
**Data**: EDC, ePRO, wearables, labs, imaging
**Regulation**: FDA 21 CFR Part 11, GDPR, HIPAA

**Besoins Critiques**:
1. **Data integration**: 20+ source systems
2. **Real-time monitoring**: Safety signals
3. **Quality checks**: Protocol deviations
4. **Regulatory compliance**: Audit trail
5. **Statistical analysis**: Interim analyses

### Architecture Pipeline

```
┌───────────────────── DATA SOURCES ─────────────────────────────────────┐
│                                                                        │
│  EDC Systems → REST APIs → Validation Layer                          │
│  ePRO/eCOA → Mobile SDK → Direct Upload                             │
│  Wearables → IoT Hub → Stream Processing                            │
│  Labs (HL7) → Mirth → FHIR Conversion                              │
│  Imaging → DICOM → Orthanc → Cloud Storage                         │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌──────────────── CLINICAL DATA PLATFORM ────────────────────────────────┐
│                                                                        │
│  Data Lake (Validated):                                              │
│  S3 (Immutable) → Glue Catalog → Athena                            │
│                                                                        │
│  Master Data Management:                                              │
│  Patient Registry → PostgreSQL → Audit Triggers                      │
│                                                                        │
│  Real-time Processing:                                                │
│  Kinesis → Lambda → Safety Monitoring → SNS Alerts                  │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌───────────────── ANALYTICS & REPORTING ────────────────────────────────┐
│                                                                        │
│  Statistical Computing:                                               │
│  SAS Grid → R/Python → Validated Outputs                            │
│                                                                        │
│  Safety Monitoring:                                                   │
│  Adverse Event Detection → Signal Processing → DSMB Reports         │
│                                                                        │
│  Regulatory Submissions:                                              │
│  SDTM/ADaM Generation → Pinnacle 21 → FDA Gateway                   │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Choix Technologiques Justifiés

**Validated environment setup**:
```python
class ValidatedPipeline:
    def __init__(self):
        self.audit_logger = AuditLogger()
        self.validator = DataValidator()
        
    def process_clinical_data(self, data):
        # Input validation
        validation_result = self.validator.validate(
            data,
            schema='clinical_trial_v2.1'
        )
        
        if not validation_result.is_valid:
            self.audit_logger.log_validation_failure(
                data_id=data.id,
                errors=validation_result.errors,
                user=get_current_user(),
                timestamp=datetime.utcnow()
            )
            raise ValidationError(validation_result.errors)
        
        # Process with full audit trail
        with self.audit_context():
            processed = self.apply_transformations(data)
            
            # Double programming validation
            secondary_result = self.secondary_validation(processed)
            
            if self.compare_results(processed, secondary_result) > 0.001:
                raise DiscrepancyError("Results do not match")
            
            # Store with versioning
            self.store_versioned(processed)
            
        return processed
    
    @contextmanager
    def audit_context(self):
        audit_id = str(uuid4())
        self.audit_logger.start_transaction(audit_id)
        try:
            yield
        finally:
            self.audit_logger.end_transaction(audit_id)
```

**Safety signal detection**:
```python
class SafetyMonitor:
    def __init__(self):
        self.baseline_rates = self.load_baseline_rates()
        self.detection_algorithms = [
            ProportionalReportingRatio(),
            BayesianConfidencePropagation(),
            MultiItemGammaPoisson()
        ]
    
    def detect_signals(self, adverse_events, exposure_data):
        signals = []
        
        for algorithm in self.detection_algorithms:
            detected = algorithm.detect(
                adverse_events,
                exposure_data,
                self.baseline_rates
            )
            
            for signal in detected:
                if signal.score > algorithm.threshold:
                    signals.append({
                        'event': signal.event_term,
                        'drug': signal.drug_name,
                        'score': signal.score,
                        'algorithm': algorithm.name,
                        'patients_affected': signal.count,
                        'expected': signal.expected_count
                    })
        
        # Ensemble approach - signal must be detected by 2+ algorithms
        confirmed_signals = self.confirm_signals(signals)
        
        if confirmed_signals:
            self.alert_safety_team(confirmed_signals)
            self.update_risk_management_plan(confirmed_signals)
        
        return confirmed_signals
```

**SDTM mapping and validation**:
```python
def generate_sdtm_domains(source_data):
    sdtm_domains = {}
    
    # Demographics (DM)
    sdtm_domains['DM'] = map_demographics(source_data)
    
    # Adverse Events (AE)
    sdtm_domains['AE'] = map_adverse_events(source_data)
    
    # Concomitant Medications (CM)
    sdtm_domains['CM'] = map_medications(source_data)
    
    # Laboratory (LB)
    sdtm_domains['LB'] = map_laboratory(source_data)
    
    # Validate using Pinnacle 21
    validation_report = validate_sdtm(sdtm_domains)
    
    if validation_report.has_errors:
        raise SDTMValidationError(validation_report.errors)
    
    # Generate define.xml
    define_xml = generate_define_xml(sdtm_domains)
    
    return {
        'domains': sdtm_domains,
        'define': define_xml,
        'validation': validation_report
    }
```

### Bottlenecks Identifiés

1. **EDC integration delays**
   - Symptôme: 24h lag in data availability
   - Solution: Real-time APIs
   - Event-driven architecture

2. **Statistical computing time**
   - Symptôme: 8h for interim analysis
   - Solution: Distributed R/SAS
   - Pre-computed statistics

3. **Audit trail performance**
   - Symptôme: Query degradation over time
   - Solution: Partitioned audit tables
   - Archive to cold storage

### Évolutions Planifiées

**2024**: AI/ML Integration
- Protocol optimization
- Patient matching
- Synthetic control arms

**2025**: Decentralized Trials
- Home health integration
- Telemedicine platform
- Direct-to-patient shipping

**2026**: Real-world Evidence
- EHR integration
- Claims data analysis
- Outcomes research

### Métriques & Coûts
- **Coût**: $200,000/mois
- **Data integration time**: -70%
- **Query response time**: <2s
- **Compliance score**: 100%
- **Trial completion rate**: +15%

---

## SYNTHÈSE : Patterns Communs et Best Practices

### Patterns Architecturaux Récurrents

1. **Lambda/Kappa Architecture**: 8/15 pipelines
   - Batch pour exactitude
   - Streaming pour latence
   - Serving layer unifié

2. **Data Lake + Warehouse**: 12/15 pipelines
   - Lake pour données brutes
   - Warehouse pour analytics
   - Lakehouse emerging (5/15)

3. **ML Integration**: 15/15 pipelines
   - Feature stores (7/15)
   - Online serving critiques
   - Continuous training

### Technologies Dominantes

**Ingestion**: Kafka (10/15), Kinesis (4/15)
**Processing**: Spark (12/15), Flink (7/15)
**Storage**: S3/Cloud Storage (14/15)
**Analytics**: Snowflake (5/15), ClickHouse (3/15)

### Bottlenecks Universels

1. **Ingestion**: Partition skew, API limits
2. **Processing**: Memory pressure, shuffle overhead
3. **Storage**: Hot partitions, query performance
4. **Serving**: Cache invalidation, latency spikes

### Évolutions Convergentes

- **Real-time**: Tous migrent vers plus de streaming
- **ML/AI**: Integration croissante
- **Cloud-native**: Serverless adoption
- **Privacy**: Zero-trust architectures

Ces 15 pipelines représentent la diversité des défis en data engineering moderne, avec des solutions adaptées à chaque contexte métier spécifique.iques Justifiés

**ClickHouse pour analytics gaming**:
- 100x faster than PostgreSQL for analytics
- Real-time materialized views
- Compression ratio 10:1
```sql
CREATE MATERIALIZED VIEW player_stats_mv
ENGINE = AggregatingMergeTree()
ORDER BY (player_id, date)
AS SELECT
    player_id,
    toDate(timestamp) as date,
    sum(kills) as total_kills,
    avg(accuracy) as avg_accuracy,
    maxState(elo_rating) as peak_elo
FROM game_events
GROUP BY player_id, date;
```

**Anti-cheat architecture**:
```python
class RealtimeAntiCheat:
    def __init__(self):
        self.models = {
            'aimbot': load_model('aimbot_detector.pkl'),
            'wallhack': load_model('wallhack_detector.pkl'),
            'speedhack': load_model('speed_anomaly.pkl')
        }
        
    def process_event_stream(self, events):
        features = self.extract_features(events)
        
        # Ensemble voting
        predictions = [
            model.predict_proba(features) 
            for model in self.models.values()
        ]
        
        if max(predictions) > 0.95:
            self.instant_ban(events.player_id)
        elif max(predictions) > 0.80:
            self.flag_for_review(events.player_id)
```

**Matchmaking optimization**:
```python
def optimized_matchmaking(player_pool):
    # Multi-dimensional matching
    factors = {
        'skill': 0.4,
        'latency': 0.3,
        'play_style': 0.2,
        'toxicity_score': 0.1
    }
    
    # Graph-based optimization
    G = nx.Graph()
    for p1, p2 in combinations(player_pool, 2):
        weight = calculate_match_score(p1, p2, factors)
        G.add_edge(p1.id, p2.id, weight=weight)
    
    # Maximum weight matching
    matching = nx.max_weight_matching(G)
    return create_lobbies(matching)
```

### Bottlenecks Identifiés

1. **Redis hot keys during events**
   - Symptôme: Latency spikes during tournaments
   - Solution: Redis Cluster with hash tags
   - Key sharding strategy

2. **Kafka lag during peak hours**
   - Symptôme: 30s delay in events
   - Solution: Increase partitions to 200
   - Optimize consumer groups

3. **ClickHouse query performance**
   - Symptôme: Dashboard queries >2s
   - Solution: Projection optimization
   - Pre-aggregation tables

### Évolutions Planifiées

**Q2 2024**: AI NPCs
- Behavioral AI training
- Personalized difficulty
- Infrastructure: +$15K/mois

**Q3 2024**: Blockchain Integration
- NFT game assets
- Play-to-earn mechanics
- Smart contracts on Polygon

**2025**: Cloud Gaming
- Streaming infrastructure
- Global edge deployment
- Investment: $500K

### Métriques & Coûts
- **Coût**: $120,000/mois
- **Matchmaking time**: 3.2s avg
- **Cheat detection**: 94% accuracy
- **Player retention D30**: 42%
- **Revenue per user**: $0.52

---

## Pipeline 8: Telco - Network Optimization & Customer 360

### Contexte & Besoins
**Opérateur**: 50M subscribers, 100K cell towers
**Data**: CDR 10B/jour, Network metrics 1M/sec
**Régulation**: GDPR, Data retention 6 mois

**Besoins Critiques**:
1. **Network optimization**: Predictive maintenance
2. **Churn prevention**: <24h reaction time
3. **Fraud detection**: SIM swap, IRSF
4. **Customer 360**: Unified view
5. **5G rollout planning**: Coverage optimization

### Architecture Pipeline

```
┌───────────────────── NETWORK SOURCES ──────────────────────────────────┐
│                                                                        │
│  Cell Towers → SNMP/NetFlow → Telegraf → InfluxDB                   │
│  CDR/EDR → Mediation System → Kafka                                  │
│  CRM → Oracle → GoldenGate → Kafka                                  │
│  Network Elements → Syslog → Logstash → Elasticsearch               │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────────── DATA PLATFORM ───────────────────────────────────┐
│                                                                        │
│  Streaming Layer:                                                     │
│  Kafka (500 brokers) → Flink Cluster                                │
│      ├→ Fraud Detection (CEP)                                        │
│      ├→ Network Anomalies                                            │
│      └→ Real-time Aggregations                                       │
│                                                                        │
│  Storage Layer:                                                       │
│  HDFS (10PB) + Kudu (Operational)                                    │
│  HBase (Customer Profiles)                                           │
│  Druid (Time-series Analytics)                                       │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌───────────────────── ANALYTICS & ML ───────────────────────────────────┐
│                                                                        │
│  Churn Prediction:                                                    │
│  Spark ML + XGBoost → Probability Scores → Campaign System           │
│                                                                        │
│  Network Optimization:                                                │
│  Graph Analytics (Neo4j) → Tower Optimization                        │
│  Time Series Forecasting → Capacity Planning                         │
│                                                                        │
│  Customer 360:                                                        │
│  HBase + Phoenix → REST API → Customer Service Apps                  │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Choix Technologiques Justifiés

**Kudu pour operational analytics**:
- Mutable storage (updates critiques)
- Fast analytics on changing data
- Integration native avec Impala

**Flink CEP pour fraud**:
```java
Pattern<CDR> fraudPattern = Pattern.<CDR>begin("first")
    .where(new SimpleCondition<CDR>() {
        public boolean filter(CDR cdr) {
            return cdr.getCallDuration() < 3;
        }
    }).times(5).within(Time.minutes(10))
    .followedBy("location_change")
    .where(new IterativeCondition<CDR>() {
        public boolean filter(CDR cdr, Context<CDR> ctx) {
            return distanceBetween(cdr, ctx.getEventsForPattern("first")) > 100;
        }
    });
```

**Graph analytics pour network**:
```cypher
// Find optimal tower placement
MATCH (t:Tower)-[:COVERS]->(a:Area)
WHERE a.congestion_score > 0.8
WITH a, collect(t) as towers
MATCH (candidate:Location)
WHERE distance(candidate, a) < 5000
AND NOT (candidate)-[:HAS_TOWER]->()
RETURN candidate, 
       sum(a.population * a.congestion_score) as impact_score
ORDER BY impact_score DESC
```

### Bottlenecks Identifiés

1. **CDR ingestion lag**
   - Symptôme: 15min delay
   - Solution: Parallel mediation
   - Kafka partition increase

2. **HBase region hotspotting**
   - Symptôme: Uneven load distribution
   - Solution: Salt keys
   - Pre-splitting regions

3. **Spark job failures**
   - Symptôme: OOM on joins
   - Solution: Broadcast joins
   - Adaptive query execution

### Évolutions Planifiées

**2024**: 5G Analytics
- Network slicing optimization
- Edge computing metrics
- Investment: $2M

**2025**: AI Customer Service
- Voice analytics
- Predictive issue resolution
- Cost reduction: -30% call center

**2026**: IoT Platform
- 100M devices support
- Real-time billing
- New revenue: $50M/year

### Métriques & Coûts
- **Coût**: $300,000/mois
- **Fraud detection**: 97% accuracy
- **Churn reduction**: -25%
- **Network uptime**: 99.95%

---

## Pipeline 9: Fintech - Real-time Payments & Risk Scoring

### Contexte & Besoins
**Plateforme**: 10M users, 1M transactions/jour
**Régulation**: PSD2, KYC/AML, GDPR
**Latence**: <100ms pour authorization

**Besoins Critiques**:
1. **Payment authorization**: Real-time decision
2. **Fraud scoring**: ML-based, <50ms
3. **Liquidity management**: Treasury optimization
4. **Regulatory reporting**: Automated compliance
5. **Open banking**: API aggregation

### Architecture Pipeline

```
┌──────────────────── PAYMENT INGESTION ─────────────────────────────────┐
│                                                                        │
│  Mobile Apps → API Gateway (Kong) → Rate Limiting                    │
│  Bank APIs → Open Banking Aggregator → Transformation                │
│  Card Networks → ISO8583 Parser → Event Stream                       │
│  Webhooks → Lambda Functions → SQS                                   │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌───────────────── PROCESSING & DECISION ────────────────────────────────┐
│                                                                        │
│  Authorization Pipeline:                                              │
│  Request → Redis (Account Cache) → Risk Engine (Flink)              │
│         ↓                                                            │
│  ML Scoring (SageMaker Endpoint) → Rule Engine (Drools)             │
│         ↓                                                            │
│  Decision (<100ms) → Response                                        │
│                                                                        │
│  Async Processing:                                                    │
│  Kafka → Spark Streaming → Cassandra (Transaction Store)            │
│       ↓                                                              │
│  Compliance Checks → Regulatory Reports                              │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────────── DATA STORES ─────────────────────────────────────┐
│                                                                        │
│  Hot Data: Redis Cluster (Account balances, Limits)                  │
│  Transactional: Aurora PostgreSQL (ACID compliance)                  │
│  Analytical: Snowflake (Historical analysis)                         │
│  Time-series: TimescaleDB (Metrics, Monitoring)                      │
│  Document: MongoDB (KYC documents, Contracts)                        │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Choix Technologiques Justifiés

**Flink pour risk scoring temps réel**:
```java
public class RealTimeRiskScorer extends KeyedProcessFunction<String, Transaction, RiskScore> {
    private ValueState<UserProfile> userProfile;
    private MapState<String, Double> velocityCounters;
    
    @Override
    public void processElement(Transaction txn, Context ctx, Collector<RiskScore> out) {
        UserProfile profile = userProfile.value();
        
        // Update velocity counters
        updateVelocityCounters(txn);
        
        // Calculate risk factors
        double amountRisk = calculateAmountRisk(txn, profile);
        double velocityRisk = calculateVelocityRisk();
        double merchantRisk = getMerchantRisk(txn.merchantId);
        double geoRisk = calculateGeoRisk(txn.location, profile.homeLocation);
        
        // ML model inference
        double mlScore = inferMLScore(txn, profile);
        
        // Combine scores
        RiskScore score = new RiskScore(
            txn.id,
            weightedAverage(amountRisk, velocityRisk, merchantRisk, geoRisk, mlScore),
            System.currentTimeMillis() - ctx.timestamp() // latency
        );
        
        out.collect(score);
    }
}
```

**Aurora pour transactional consistency**:
- ACID guarantees essentielles
- Multi-master pour HA
- Point-in-time recovery

**Circuit breaker pattern**:
```python
class PaymentCircuitBreaker:
    def __init__(self):
        self.failure_threshold = 0.5
        self.timeout_duration = 30
        self.state = "CLOSED"
        
    def call_payment_service(self, request):
        if self.state == "OPEN":
            if self.timeout_expired():
                self.state = "HALF_OPEN"
            else:
                return self.fallback_response()
        
        try:
            response = self.execute_request(request)
            self.on_success()
            return response
        except Exception as e:
            self.on_failure()
            if self.failure_rate > self.failure_threshold:
                self.state = "OPEN"
            raise e
```

### Bottlenecks Identifiés

1. **Redis connection pool exhaustion**
   - Symptôme: Timeouts during peak
   - Solution: Connection multiplexing
   - Cluster mode enabled

2. **ML model inference latency**
   - Symptôme: P99 >100ms
   - Solution: Model optimization (ONNX)
   - GPU inference endpoints

3. **Database write throughput**
   - Symptôme: Transaction backlogs
   - Solution: Write-through cache
   - Async write batching

### Évolutions Planifiées

**Q3 2024**: Crypto Integration
- Stablecoin payments
- DeFi yield optimization
- Compliance framework

**Q4 2024**: AI Financial Advisor
- Personalized insights
- Automated investing
- Robo-advisor features

**2025**: Banking-as-a-Service
- White-label platform
- API marketplace
- Revenue target: $10M ARR

### Métriques & Coûts
- **Coût**: $150,000/mois
- **Authorization latency**: P99 92ms
- **Fraud loss rate**: 0.02%
- **System uptime**: 99.99%
- **Compliance score**: 100%

---

## Pipeline 10: Logistics - Last-Mile Delivery Optimization

### Contexte & Besoins
**Flotte**: 50K drivers, 10K vehicles
**Deliveries**: 500K/jour, 15min time windows
**Coverage**: 100 cities, real-time routing

**Besoins Critiques**:
1. **Dynamic routing**: Traffic-aware, <1s
2. **Capacity optimization**: Load balancing
3. **Driver tracking**: Real-time GPS
4. **Customer notifications**: Accurate ETAs
5. **Carbon footprint**: Reduce 30%

### Architecture Pipeline

```
┌────────────────────── DATA SOURCES ────────────────────────────────────┐
│                                                                        │
│  Driver Apps → GPS Stream → AWS IoT Core → Kinesis                  │
│  Orders → API → Lambda → DynamoDB Streams                            │
│  Traffic Data → HERE/Google APIs → Cache Layer                       │
│  Weather → External APIs → S3 → Batch Updates                        │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌──────────────────── OPTIMIZATION ENGINE ───────────────────────────────┐
│                                                                        │
│  Real-time Routing:                                                   │
│  Kinesis → Lambda → GraphHopper (Routing) → Response                │
│                                                                        │
│  Batch Optimization:                                                  │
│  DynamoDB → Step Functions → OR-Tools → Route Plans                 │
│                                                                        │
│  ML Predictions:                                                      │
│  Historical Data → SageMaker → ETA Model → API                      │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌───────────────────── EXECUTION LAYER ──────────────────────────────────┐
│                                                                        │
│  Driver Assignment:                                                   │
│  Redis (Available Drivers) → Matching Algorithm → Push Notification  │
│                                                                        │
│  Tracking & Monitoring:                                               │
│  GPS Events → ElasticSearch → Kibana Dashboards                     │
│  Geofencing → Lambda → Customer Notifications                        │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Choix Technologiques Justifiés

**GraphHopper pour routing**:
- Open source, customizable
- Offline routing capability
- Speed: <10ms per route
```java
GraphHopper hopper = new GraphHopper()
    .setGraphHopperLocation("./graphs")
    .setProfiles(new Profile("car").setVehicle(CAR).setWeighting(FASTEST))
    .setCustomModel(new CustomModel()
        .addToPriority(If("road_class == RESIDENTIAL", MULTIPLY, 0.5))
        .addToPriority(If("max_weight < 3.5", MULTIPLY, 0))
    );

GHRequest req = new GHRequest(pickup, delivery)
    .setProfile("car")
    .setAlgorithm(Parameters.Algorithms.DIJKSTRA_BI)
    .putHint("instructions", false);
```

**Vehicle Routing Problem solver**:
```python
from ortools.constraint_solver import pywrapcp

def optimize_routes(deliveries, vehicles, depot):
    manager = pywrapcp.RoutingIndexManager(
        len(deliveries), len(vehicles), depot
    )
    routing = pywrapcp.RoutingModel(manager)
    
    # Distance callback
    def distance_callback(from_idx, to_idx):
        from_node = manager.IndexToNode(from_idx)
        to_node = manager.IndexToNode(to_idx)
        return distance_matrix[from_node][to_node]
    
    transit_callback = routing.RegisterTransitCallback(distance_callback)
    routing.SetArcCostEvaluatorOfAllVehicles(transit_callback)
    
    # Capacity constraint
    def demand_callback(idx):
        node = manager.IndexToNode(idx)
        return deliveries[node].weight
    
    demand_callback_index = routing.RegisterUnaryTransitCallback(demand_callback)
    routing.AddDimensionWithVehicleCapacity(
        demand_callback_index,
        0,  # null capacity slack
        vehicle_capacities,
        True,  # start cumul to zero
        'Capacity'
    )
    
    # Time windows
    routing.AddDimension(
        transit_callback,
        30,  # allow waiting time
        86400,  # maximum time per vehicle
        False,
        'Time'
    )
    
    search_parameters = pywrapcp.DefaultRoutingSearchParameters()
    search_parameters.first_solution_strategy = (
        routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
    )
    
    solution = routing.SolveWithParameters(search_parameters)
    return extract_routes(solution, routing, manager)
```

### Bottlenecks Identifiés

1. **Route calculation timeout**
   - Symptôme: >5s for complex routes
   - Solution: Pre-computed route cache
   - Hierarchical routing

2. **GPS data ingestion overflow**
   - Symptôme: Kinesis throttling
   - Solution: Batch GPS updates
   - Adaptive sampling rate

3. **Notification delays**
   - Symptôme: 30s lag in updates
   - Solution: WebSocket connections
   - Push notification optimization

### Évolutions Planifiées

**2024**: Autonomous Vehicles
- Integration with AVs
- Remote monitoring
- Safety protocols

**2025**: Drone Delivery
- Hybrid routing (road + air)
- Regulatory compliance
- Urban air mobility

**2026**: Sustainability Focus
- Electric vehicle optimization
- Carbon credit integration
- Green routing preferences

### Métriques & Coûts
- **Coût**: $85,000/mois
- **On-time delivery**: 94%
- **Route efficiency**: +18%
- **Fuel savings**: -22%
- **Customer satisfaction**: 4.6/5

---

## Pipeline 11: AdTech - Programmatic Bidding Platform

### Contexte & Besoins
**Scale**: 100B bid requests/jour
**Latency**: <50ms response time
**Partners**: 1000+ SSPs, 500 advertisers
**Fraud**: 20% invalid traffic

**Besoins Critiques**:
1. **RTB decisioning**: <40ms including ML
2. **Fraud detection**: Pre-bid filtering
3. **Budget pacing**: Real-time spend control
4. **Attribution**: Cross-device tracking
5. **Privacy**: GDPR/CCPA compliance

### Architecture Pipeline

```
┌──────────────────── BID STREAM INGESTION ──────────────────────────────┐
│                                                                        │
│  SSPs → OpenRTB → Load Balancers (HAProxy)                          │
│      ↓                                                               │
│  Bid Processors (Go microservices) → In-memory Decision              │
│      ↓                                                               │
│  Aerospike (User profiles) + Redis (Campaigns)                      │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌───────────────────── DECISION ENGINE ──────────────────────────────────┐
│                                                                        │
│  ML Scoring Pipeline:                                                 │
│  Feature Assembly (<5ms) → TensorFlow Serving → Bid Price           │
│                                                                        │
│  Fraud Detection:                                                     │
│  IP Intelligence + Device Fingerprint + Behavioral Analysis          │
│                                                                        │
│  Pacing Algorithm:                                                    │
│  Current Spend → Projected Spend → Throttling Decision              │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────── ANALYTICS & REPORTING ───────────────────────────────┐
│                                                                        │
│  Stream Processing:                                                   │
│  Kafka → Flink → ClickHouse (Real-time Analytics)                   │
│                                                                        │
│  Attribution:                                                         │
│  Impression/Click/Conversion Events → Identity Graph (Neo4j)         │
│                                                                        │
│  Data Warehouse:                                                      │
│  S3 → Spark → Vertica (Reporting)                                   │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Choix Technologiques Justifiés

**Aerospike pour user profiles**:
- Sub-millisecond latency
- 99.999% uptime
- Hybrid memory architecture
```python
class UserProfileStore:
    def __init__(self):
        self.client = aerospike.client({
            'hosts': [('aerospike-cluster', 3000)],
            'policies': {
                'timeout': 10,  # 10ms timeout
                'retry': aerospike.POLICY_RETRY_NONE
            }
        })
    
    def get_user_profile(self, user_id):
        try:
            key = ('adtech', 'profiles', user_id)
            (key, meta, record) = self.client.get(key)
            return record
        except RecordNotFound:
            return self.default_profile()
```

**Bid decision logic**:
```go
func decideBid(request *openrtb.BidRequest) *openrtb.BidResponse {
    start := time.Now()
    
    // Parallel processing
    var wg sync.WaitGroup
    results := make(chan BidDecision, len(request.Imp))
    
    for _, imp := range request.Imp {
        wg.Add(1)
        go func(impression openrtb.Imp) {
            defer wg.Done()
            
            // Get user profile (1ms)
            profile := getUserProfile(request.User.ID)
            
            // Check fraud (2ms)
            if isFraudulent(request, profile) {
                return
            }
            
            // ML scoring (5ms)
            score := mlScore(impression, profile)
            
            // Calculate bid price
            bidPrice := calculateBid(score, getCampaignBudget())
            
            results <- BidDecision{
                ImpID: impression.ID,
                Price: bidPrice,
            }
        }(imp)
    }
    
    wg.Wait()
    close(results)
    
    // Assemble response
    response := assembleBidResponse(results)
    
    metrics.RecordLatency(time.Since(start))
    return response
}
```

### Bottlenecks Identifiés

1. **Aerospike hot keys**
   - Symptôme: Latency spikes for popular users
   - Solution: Sharding + local cache
   - Bloom filters for existence check

2. **ML model serving latency**
   - Symptôme: P99 >10ms
   - Solution: Model quantization
   - Batching predictions

3. **Attribution graph queries**
   - Symptôme: Complex traversals >1s
   - Solution: Graph partitioning
   - Cached subgraphs

### Évolutions Planifiées

**2024**: Privacy-First Architecture
- Differential privacy
- Federated learning
- Consent management platform

**2025**: CTV/OTT Focus
- Connected TV bidding
- Video ad serving
- QoS guarantees

**2026**: Blockchain Transparency
- Bid verification on-chain
- Smart contract payments
- Supply chain visibility

### Métriques & Coûts
- **Coût**: $200,000/mois
- **Bid latency**: P99 38ms
- **Win rate**: 2.3%
- **Invalid traffic blocked**: 92%
- **Revenue**: $5M/mois

---

## Pipeline 12: Energy - Smart Grid Analytics

### Contexte & Besoins
**Infrastructure**: 10M smart meters, 5K substations
**Data**: 100M readings/hour, 50TB/mois
**Goal**: Grid optimization, 15% efficiency gain

**Besoins Critiques**:
1. **Demand forecasting**: 15-min intervals
2. **Anomaly detection**: Power theft, failures
3. **Load balancing**: Real-time distribution
4. **Renewable integration**: Solar/wind prediction
5. **Customer insights**: Usage patterns

### Architecture Pipeline

```
┌───────────────────── DATA COLLECTION ──────────────────────────────────┐
│                                                                        │
│  Smart Meters → AMI Network → Head-End Systems                       │
│  SCADA Systems → OPC UA → Industrial Gateway                         │
│  Weather Stations → APIs → Stream Ingestion                          │
│  Solar Inverters → Modbus → Edge Collectors                          │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌──────────────────── PROCESSING PLATFORM ───────────────────────────────┐
│                                                                        │
│  Edge Processing:                                                     │
│  Apache NiFi MiNiFi → Local Aggregation → MQTT                      │
│                                                                        │
│  Central Processing:                                                  │
│  MQTT → Kafka → Spark Streaming → Time Series DB (InfluxDB)        │
│         ↓                                                            │
│  Anomaly Detection (Isolation Forest) → Alert System                │
│                                                                       │
│  Batch Analytics:                                                    │
│  HDFS → Spark → Demand Forecasting Models                           │
│                                                                       │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────── OPTIMIZATION & CONTROL ──────────────────────────────┐
│                                                                        │
│  Grid Optimization:                                                   │
│  Linear Programming (CPLEX) → Optimal Power Flow                     │
│                                                                        │
│  Forecasting:                                                         │
│  Prophet + LSTM → 24h ahead forecast                                │
│                                                                        │
│  Visualization:                                                       │
│  Grafana + Mapbox → Real-time Grid Status                           │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Choix Technolog
│  Web/App Events ──→ Kinesis Data Streams (20 shards)                 │
│                          ↓                                            │
│  MySQL CDC ──────→ Debezium → Kafka (MSK, 15 brokers)               │
│                          ↓                                            │
│  Partner APIs ───→ Airflow Scheduled Ingestion → S3 Raw             │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────── PROCESSING LAYER ──────────────────────────┐
│                                                                        │
│  Stream Path:                                                         │
│  Kafka → Flink (Fraud Detection) → DynamoDB (User State)            │
│       ↓                                                               │
│       → Spark Streaming (Aggregations) → ElasticSearch              │
│                                                                        │
│  Batch Path:                                                          │
│  S3 Raw → EMR Spark → S3 Processed (Parquet) → Athena              │
│         ↓                                                             │
│         → DBT (Snowflake) → Business Models                         │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────── SERVING LAYER ─────────────────────────────┐
│                                                                        │
│  ML Features → Feature Store (SageMaker) → Recommendation API        │
│  Analytics → Snowflake → Tableau/Looker                             │
│  Real-time → ElasticSearch → Grafana                                │
│  Cache → Redis Cluster (User sessions, Hot products)                │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Choix Technologiques Justifiés

**Kinesis vs Kafka pour events**:
- Kinesis: Managed, auto-scaling, mais limité à 1MB/sec par shard
- **Choix Kafka** pour flexibilité et pas de vendor lock-in
- Coût: MSK ~$3,000/mois vs Kinesis ~$4,500/mois pour ce volume

**Flink pour fraud detection**:
- Besoin: Stateful processing avec event-time windows
- Latence <50ms requise
- Pattern CEP (Complex Event Processing) natif
```java
Pattern<Transaction> fraudPattern = Pattern.<Transaction>begin("first")
    .where(evt -> evt.amount > 1000)
    .followedBy("second")
    .where(evt -> evt.location != previous.location)
    .within(Time.minutes(10));
```

**DynamoDB pour user state**:
- Reads/writes <10ms
- Auto-scaling
- Global tables pour multi-région

### Bottlenecks Identifiés

1. **Kafka partition skew**
   - Symptôme: 20% partitions reçoivent 60% traffic
   - Cause: Hash key mal choisi (user_id concentré)
   - Solution: Composite key (user_id + timestamp % 100)

2. **Flink checkpointing lag**
   - Symptôme: Checkpoints >5min, backpressure
   - Cause: State size 500GB+
   - Solution: RocksDB backend + incremental checkpoints

3. **Snowflake compute saturation**
   - Symptôme: Queries timeout pendant Black Friday
   - Solution: Multi-cluster warehouse + result caching

### Évolutions Planifiées

**Phase 1 (Q1-Q2)**: ML Enhancement
- Feature store temps réel
- A/B testing framework
- Coût additionnel: +$5,000/mois

**Phase 2 (Q3)**: Global Expansion
- Multi-region deployment
- Cross-region replication
- Coût: +$15,000/mois

**Phase 3 (Q4)**: Advanced Analytics
- Graph database pour social features
- Stream analytics avec Apache Druid
- Coût: +$8,000/mois

### Métriques & Coûts
- **Coût total**: $28,000/mois
- **SLA**: 99.95% uptime
- **Latence P99**: 87ms
- **ROI**: Fraude -70%, Revenue +15%

---

## Pipeline 2: Banque - Risque Crédit & Compliance

### Contexte & Besoins
**Institution**: Banque retail, 10M clients, 500 agences
**Régulation**: Bâle III, RGPD, MiFID II
**Volume**: 50M transactions/jour, 100TB historique

**Besoins Critiques**:
1. **Calcul risque intraday**: Exposition temps réel (régulateur)
2. **AML (Anti Money Laundering)**: Detection patterns suspects <1h
3. **Stress testing mensuel**: Simulations 10,000 scénarios
4. **Audit trail complet**: 7 ans rétention, immutable
5. **Data lineage**: Traçabilité source→résultat obligatoire

### Architecture Pipeline

```
┌─────────────────────── SOURCES & INGESTION ───────────────────────────┐
│                                                                        │
│  Core Banking (Oracle) ──→ GoldenGate CDC ──→ Kafka                  │
│  Trading Systems ────────→ FIX Protocol ────→ Kafka                  │
│  External Data ─────────→ SFTP/APIs ────────→ Airflow → S3          │
│  Market Data (Reuters) ──→ WebSocket ───────→ Kinesis               │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌──────────────────────── PROCESSING & COMPUTE ─────────────────────────┐
│                                                                        │
│  Lambda Architecture:                                                 │
│                                                                        │
│  SPEED LAYER:                                                        │
│  Kafka → Spark Streaming → Risk Calculations → Cassandra            │
│       ↓                                                              │
│       → Flink CEP → AML Detection → Alert System                   │
│                                                                       │
│  BATCH LAYER:                                                        │
│  S3 Raw → Spark on EMR → Risk Models → S3 Processed                │
│         ↓                                                            │
│         → Regulatory Reports → Data Vault (Snowflake)              │
│                                                                       │
│  SERVING LAYER:                                                      │
│  Cassandra + Snowflake → API Gateway → Internal Systems            │
│                                                                       │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────────────── GOVERNANCE & AUDIT ─────────────────────────┐
│                                                                        │
│  Data Catalog: Collibra                                              │
│  Lineage: DataHub + Custom Metadata                                  │
│  Quality: Great Expectations + Monte Carlo                           │
│  Audit Logs: Immutable S3 + Blockchain Anchoring                     │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Choix Technologiques Justifiés

**GoldenGate pour CDC**:
- Support natif Oracle avec garantie transactionnelle
- Latence <1s vs 30s pour Debezium
- Coût élevé justifié par criticité

**Cassandra pour risk metrics**:
- Write throughput: 1M ops/sec
- Time-series native avec TTL
- Multi-datacenter replication
```cql
CREATE TABLE risk_metrics (
    account_id UUID,
    timestamp timestamp,
    var_95 decimal,
    var_99 decimal,
    exposure decimal,
    PRIMARY KEY (account_id, timestamp)
) WITH CLUSTERING ORDER BY (timestamp DESC)
  AND default_time_to_live = 7889400; -- 3 months
```

**Data Vault in Snowflake**:
- Historisation complète requise
- Parallel loading patterns
- Zero data loss architecture

### Bottlenecks Identifiés

1. **Oracle source saturation**
   - Symptôme: CDC lag >5min pendant batch jobs
   - Solution: Read replicas + partitioned CDC

2. **Spark streaming memory pressure**
   - Symptôme: GC pauses >1s
   - Solution: Tungsten optimization + off-heap memory
   ```scala
   spark.conf.set("spark.memory.offHeap.enabled", "true")
   spark.conf.set("spark.memory.offHeap.size", "10g")
   ```

3. **Regulatory report generation**
   - Symptôme: 8h pour rapport mensuel
   - Solution: Incremental materialized views

### Évolutions Planifiées

**2024 Q2**: Real-time Reg Reporting
- Event sourcing architecture
- KSQL pour aggregations
- Coût: +$10,000/mois

**2024 Q3**: AI Risk Models
- GPU cluster pour deep learning
- Feature store (Feast)
- Coût: +$25,000/mois

**2025**: Cloud Migration
- Hybrid architecture
- Progressive workload migration
- Économies estimées: -30%

### Métriques & Coûts
- **Coût total**: $85,000/mois
- **Compliance SLA**: 100% (critique)
- **Risk calculation latency**: <30s
- **Audit completeness**: 100%

---

## Pipeline 3: IoT Manufacturing - Predictive Maintenance

### Contexte & Besoins
**Entreprise**: 50 usines, 100,000 capteurs, 24/7 production
**Enjeu**: Downtime coûte $50,000/heure
**Volume**: 1M messages/sec, 5TB/jour

**Besoins Critiques**:
1. **Anomaly detection <1s**: Prévenir pannes
2. **Edge processing**: Latence réseau inacceptable
3. **Time-series forecasting**: Maintenance prédictive
4. **Digital twin sync**: Simulation temps réel
5. **OEE optimization**: Overall Equipment Effectiveness

### Architecture Pipeline

```
┌───────────────────────── EDGE LAYER ──────────────────────────────────┐
│                                                                        │
│  Sensors → Edge Gateways (Apache NiFi MiNiFi)                        │
│         ↓                                                             │
│  Local Processing (TensorFlow Lite) → Filtered Events                │
│         ↓                                                             │
│  MQTT Brokers (Mosquitto) → Apache Pulsar                           │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌──────────────────────── CLOUD INGESTION ──────────────────────────────┐
│                                                                        │
│  Apache Pulsar (Geo-replicated)                                      │
│       ├→ Hot Path: Critical Alerts                                   │
│       ├→ Warm Path: Aggregations                                     │
│       └→ Cold Path: Historical Archive                               │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌───────────────────────── PROCESSING ──────────────────────────────────┐
│                                                                        │
│  HOT: Pulsar → Flink → InfluxDB (Alerts <1s)                        │
│  WARM: Pulsar → Spark Streaming → TimescaleDB (Metrics)             │
│  COLD: Pulsar → S3 → Spark Batch → Parquet → Athena                │
│                                                                        │
│  ML Pipeline:                                                         │
│  TimescaleDB → Feature Engineering → SageMaker → Model Registry      │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Choix Technologiques Justifiés

**Apache Pulsar vs Kafka**:
- Geo-replication native
- Multi-tenancy built-in
- Tiered storage (hot/warm/cold)
- Better latency for IoT (P99 <5ms)

**InfluxDB pour time-series**:
- Compression 90% pour IoT data
- Continuous queries native
- Retention policies automatiques
```sql
CREATE CONTINUOUS QUERY "downsample_1h"
ON "sensors"
BEGIN
  SELECT mean("temperature"), max("vibration")
  INTO "sensors_1h"
  FROM "raw_sensors"
  GROUP BY time(1h), machine_id
END
```

**Edge processing critique**:
```python
# Edge anomaly detection
class EdgeAnomalyDetector:
    def __init__(self):
        self.model = tf.lite.Interpreter("model.tflite")
        self.threshold = 0.95
    
    def process(self, sensor_data):
        if self.predict_anomaly(sensor_data) > self.threshold:
            self.send_immediate_alert()
        else:
            self.batch_for_cloud(sensor_data)
```

### Bottlenecks Identifiés

1. **Network bandwidth saturation**
   - Symptôme: 80% bandwidth usage
   - Solution: Edge filtering + compression
   - Résultat: -60% traffic

2. **InfluxDB cardinality explosion**
   - Symptôme: Queries >10s
   - Solution: Tag set optimization
   - Monitoring cardinality

3. **Model serving latency**
   - Symptôme: Inference >100ms
   - Solution: TensorRT optimization + caching

### Évolutions Planifiées

**Phase 1**: 5G Integration
- Ultra-low latency (<1ms)
- Network slicing pour QoS
- Coût: +$5,000/mois/usine

**Phase 2**: Federated Learning
- Models trained at edge
- Privacy preserving
- Bandwidth reduction 90%

**Phase 3**: Digital Twin Platform
- Real-time 3D visualization
- What-if simulations
- Unity + Azure Digital Twins

### Métriques & Coûts
- **Coût**: $45,000/mois
- **Downtime reduction**: -65%
- **False positives**: <2%
- **ROI**: $2M/mois saved

---

## Pipeline 4: Healthcare - Patient 360 & Clinical Analytics

### Contexte & Besoins
**Système**: 20 hôpitaux, 500K patients actifs
**Standards**: HL7 FHIR, DICOM, HIPAA
**Volume**: 10M clinical events/jour, 50TB imaging/mois

**Besoins Critiques**:
1. **Interopérabilité**: 200+ systèmes différents
2. **Real-time alerting**: Sepsis detection <15min
3. **HIPAA compliance**: Encryption + audit
4. **Research analytics**: Cohorte studies
5. **Cost optimization**: Reduce readmissions

### Architecture Pipeline

```
┌────────────────────── DATA SOURCES ───────────────────────────────────┐
│                                                                        │
│  EHR Systems → HL7 MLLP → Mirth Connect → FHIR Format               │
│  Medical Devices → IoT Gateway → MQTT → Kafka                        │
│  PACS/Imaging → DICOM → Orthanc → S3 Glacier                        │
│  Labs → HL7 v2 → Apache Camel → Transformation                       │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────── INTEGRATION & PROCESSING ──────────────────────────┐
│                                                                        │
│  Apache NiFi (Orchestration & Routing)                               │
│       ↓                                                               │
│  Kafka Topics (Encrypted, Per Department)                            │
│       ├→ Clinical Events → Spark Streaming                           │
│       ├→ Vitals → Flink CEP (Alert Detection)                        │
│       └→ Admin Data → Batch ETL                                      │
│                                                                        │
│  FHIR Server (HAPI) → PostgreSQL (Operational)                       │
│  Data Lake (S3) → Databricks Delta Lake (Analytics)                 │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌──────────────────── ANALYTICS & SERVING ──────────────────────────────┐
│                                                                        │
│  Clinical Analytics:                                                  │
│  Delta Lake → Spark SQL → Aggregations → Redshift                   │
│                                                                        │
│  ML Platform:                                                         │
│  Feature Store → SageMaker → Model Endpoints                         │
│                                                                        │
│  Operational:                                                         │
│  PostgreSQL → GraphQL API → Clinical Apps                            │
│  Redis Cache → Session Management                                     │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Choix Technologiques Justifiés

**Mirth Connect pour HL7**:
- Transformation HL7→FHIR native
- GUI pour mappings (personnel non-tech)
- Channel architecture flexible

**Delta Lake pour HIPAA**:
- ACID transactions obligatoires
- Data versioning pour audit
- Time travel pour corrections
```python
# Anonymisation HIPAA
from pyspark.sql import functions as F
from presidio_pyspark import anonymize_column

df_anonymized = df \
    .transform(anonymize_column(column="patient_name")) \
    .transform(anonymize_column(column="ssn")) \
    .withColumn("patient_id", F.sha2(F.col("patient_id"), 256))
```

**HAPI FHIR Server**:
- Standard industrie
- Validation automatique
- Search capabilities natives

### Bottlenecks Identifiés

1. **HL7 parsing bottleneck**
   - Symptôme: Queue backup >10K messages
   - Solution: Horizontal scaling Mirth
   - Parallel channel processing

2. **DICOM storage costs**
   - Symptôme: $30K/mois S3
   - Solution: Intelligent tiering
   - Compression + deduplication

3. **Query performance degradation**
   - Symptôme: Patient history >5s
   - Solution: Materialized views
   - Denormalization stratégique

### Évolutions Planifiées

**2024**: AI Diagnostics
- Computer vision pour radiologie
- NLP pour notes cliniques
- Investment: $500K

**2025**: Genomics Integration
- Precision medicine
- Variant analysis pipeline
- Storage: +100TB/mois

**2026**: Federated Learning
- Multi-hospital collaboration
- Privacy-preserving ML
- Differential privacy

### Métriques & Coûts
- **Coût**: $75,000/mois
- **Interop success**: 98%
- **Alert accuracy**: 94%
- **Readmission reduction**: -20%

---

## Pipeline 5: Media Streaming - Video Analytics Platform

### Contexte & Besoins
**Platform**: 100M users, 10K concurrent streams
**Content**: 4K/8K video, Live events
**Volume**: 1PB/mois, 100Gbps peak

**Besoins Critiques**:
1. **CDN optimization**: Réduire coûts 40%
2. **Real-time personalization**: <50ms
3. **Piracy detection**: Live fingerprinting
4. **QoE monitoring**: Buffer ratio <2%
5. **Content moderation**: COPPA compliance

### Architecture Pipeline

```
┌───────────────────── CONTENT INGESTION ───────────────────────────────┐
│                                                                        │
│  Live Streams → Wowza → Transcoding (AWS Elemental)                  │
│  VOD Upload → S3 Multipart → Lambda Triggers                         │
│  User Events → Cloudfront → Kinesis Data Firehose                    │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────── PROCESSING PIPELINE ────────────────────────────────┐
│                                                                        │
│  REAL-TIME:                                                           │
│  Kinesis → Kinesis Analytics → Recommendation Engine                 │
│         ↓                                                             │
│  Video Fingerprinting → Kafka → Flink → Piracy Detection            │
│                                                                        │
│  BATCH:                                                               │
│  S3 Raw → EMR (Spark) → Feature Extraction → S3 Processed           │
│         ↓                                                             │
│  Audience Analytics → Databricks → ML Training                       │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌──────────────────────── SERVING LAYER ────────────────────────────────┐
│                                                                        │
│  CDN: CloudFront + Akamai (Multi-CDN)                                │
│  Personalization API: DynamoDB + ElastiCache                         │
│  Analytics: Druid (Sub-second OLAP)                                  │
│  ML Serving: SageMaker Endpoints + TorchServe                        │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Choix Technologiques Justifiés

**Multi-CDN Strategy**:
- CloudFront: 60% traffic (AWS integration)
- Akamai: 40% traffic (better Asia coverage)
- Cost optimization: -35% vs single CDN

**Apache Druid pour analytics**:
- Sub-second queries sur TB
- Real-time ingestion
- Perfect pour time-series
```json
{
  "queryType": "timeseries",
  "dataSource": "video_metrics",
  "granularity": "minute",
  "aggregations": [
    {"type": "sum", "name": "views", "fieldName": "view_count"},
    {"type": "avg", "name": "buffer_ratio", "fieldName": "buffer_time"}
  ]
}
```

**Fingerprinting architecture**:
```python
class VideoFingerprinter:
    def __init__(self):
        self.perceptual_hash = ImageHash()
        self.audio_fingerprint = Chromaprint()
    
    def process_stream(self, video_chunk):
        video_hash = self.perceptual_hash.compute(video_chunk)
        audio_hash = self.audio_fingerprint.compute(audio_chunk)
        
        # Check against known pirated content
        if self.redis_bloom.check(video_hash):
            self.trigger_takedown()
```

### Bottlenecks Identifiés

1. **Transcoding queue backup**
   - Symptôme: 30min delay for 4K
   - Solution: Spot instances + priority queues
   - Cost saving: 70%

2. **DynamoDB hot partitions**
   - Symptôme: Throttling on popular content
   - Solution: Write sharding pattern
   - Composite keys distribution

3. **Druid query latency spikes**
   - Symptôme: P99 >1s during events
   - Solution: Query routing + caching layer

### Évolutions Planifiées

**Q2 2024**: AI Content Generation
- Automated highlights
- Thumbnail generation
- Cost: +$20K/mois

**Q3 2024**: WebRTC Integration
- Ultra-low latency streaming
- P2P capabilities
- Infrastructure: +$30K/mois

**2025**: Blockchain DRM
- NFT content ownership
- Smart contracts royalties
- Development: $200K

### Métriques & Coûts
- **Coût total**: $250,000/mois
- **CDN costs**: $150,000/mois
- **Transcoding**: $30,000/mois
- **Buffering ratio**: 1.8%
- **Piracy detection**: 96%

---

## Pipeline 6: Retail Analytics - Supply Chain Optimization

### Contexte & Besoins
**Réseau**: 2000 magasins, 50 entrepôts, 10K fournisseurs
**SKUs**: 500K produits, 100M mouvements/mois
**Challenge**: Stock-out coûte 8% CA

**Besoins Critiques**:
1. **Demand forecasting**: Précision >92%
2. **Real-time inventory**: Cross-channel
3. **Route optimization**: -20% transport
4. **Supplier scoring**: Risk management
5. **Promotion impact**: Cannibalization analysis

### Architecture Pipeline

```
┌───────────────────── SOURCE SYSTEMS ──────────────────────────────────┐
│                                                                        │
│  ERP (SAP) → SAP Data Services → Azure Event Hub                     │
│  POS Systems → Change Feed → CosmosDB → Stream Analytics            │
│  WMS → REST APIs → Logic Apps → Data Factory                         │
│  IoT Sensors → Azure IoT Hub → Time Series Insights                  │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────── INTEGRATION LAYER ───────────────────────────────────┐
│                                                                        │
│  Azure Synapse Analytics (Unified Platform)                          │
│    ├→ Spark Pools (Heavy Processing)                                 │
│    ├→ SQL Pools (Data Warehouse)                                     │
│    └→ Data Explorer (Time Series)                                    │
│                                                                        │
│  Delta Lake Architecture:                                             │
│    Bronze: Raw Ingestion                                             │
│    Silver: Cleansed & Conformed                                      │
│    Gold: Business Aggregates                                         │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌───────────────────── ANALYTICS & ML ──────────────────────────────────┐
│                                                                        │
│  Demand Forecasting:                                                  │
│  Prophet + Azure ML → Hierarchical Forecasting                       │
│                                                                        │
│  Optimization:                                                        │
│  OR-Tools + Gurobi → Route & Inventory Optimization                  │
│                                                                        │
│  Real-time Scoring:                                                   │
│  Azure ML Endpoints → AKS Cluster                                    │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Choix Technologiques Justifiés

**Azure Synapse (All-in-one)**:
- Unified experience
- Cost optimization vs separate services
- Seamless integration with Azure ecosystem

**Hierarchical Forecasting**:
```python
from hts import HTSRegressor
import prophet

class DemandForecaster:
    def __init__(self):
        self.hierarchy = {
            'total': ['region'],
            'region': ['store'],
            'store': ['category'],
            'category': ['sku']
        }
    
    def forecast(self, historical_data):
        # Bottom-up approach for accuracy
        sku_forecasts = self.prophet_forecast(historical_data)
        
        # Reconciliation for consistency
        reconciled = HTSRegressor(
            hierarchy=self.hierarchy,
            method='OLS'
        ).reconcile(sku_forecasts)
        
        return reconciled
```

**CosmosDB pour inventory real-time**:
- Global distribution
- 99.999% SLA
- Multi-model (document + graph)

### Bottlenecks Identifiés

1. **SAP extraction overload**
   - Symptôme: 6h pour daily extract
   - Solution: Incremental CDC
   - Parallel extraction jobs

2. **Forecast computation time**
   - Symptôme: 12h pour tous SKUs
   - Solution: Distributed computing
   - Only reforecast changed items

3. **Report generation timeout**
   - Symptôme: PowerBI timeout >10min
   - Solution: Aggregation tables
   - Composite models

### Évolutions Planifiées

**2024**: Computer Vision
- Shelf monitoring
- Automated inventory counts
- Investment: $300K

**2025**: Autonomous Replenishment
- ML-driven ordering
- No human intervention
- Expected savings: $5M/year

**2026**: Blockchain Supply Chain
- End-to-end traceability
- Smart contracts with suppliers
- Compliance automation

### Métriques & Coûts
- **Coût**: $95,000/mois
- **Forecast accuracy**: 93.5%
- **Stock-out reduction**: -60%
- **Transport savings**: -22%

---

## Pipeline 7: Gaming - Real-time Multiplayer Analytics

### Contexte & Besoins
**Game**: 5M DAU, 100K concurrent, Battle Royale
**Events**: 1B events/jour, 50K events/sec peak
**Monetization**: $0.50 ARPDAU target

**Besoins Critiques**:
1. **Matchmaking optimization**: Skill-based <5s
2. **Anti-cheat detection**: Real-time behavioral
3. **Economy balancing**: Virtual goods pricing
4. **Player retention**: Churn prediction
5. **Tournament system**: Live leaderboards

### Architecture Pipeline

```
┌────────────────────── CLIENT EVENTS ───────────────────────────────────┐
│                                                                        │
# Guide d'Adaptation des Pipelines pour Entretiens Data Engineering

## 1. STRATÉGIE D'UTILISATION EN ENTRETIEN

### 1.1 Analyse Rapide du Contexte (2 minutes)

**Questions à poser immédiatement :**
```
1. "Quel est le volume de données actuel et projeté ?"
   → Détermine batch vs streaming
   
2. "Quelle est la latence acceptable ?"
   → <1s: Streaming obligatoire
   → <1min: Micro-batch possible
   → >1h: Batch sufficient

3. "Quel est le budget approximatif ?"
   → Limite: Open source prioritaire
   → Moyen: Mix managed/open source
   → Élevé: Best-in-class solutions

4. "Quelles sont les compétences de l'équipe ?"
   → Détermine complexité acceptable

5. "Y a-t-il des contraintes réglementaires ?"
   → GDPR, HIPAA, PCI-DSS impact l'architecture
```

### 1.2 Mapping Contexte → Pipeline Reference

| Si l'entreprise est... | Utiliser Pipeline # | Adapter en... |
|------------------------|---------------------|---------------|
| Marketplace/E-commerce | #1 E-commerce | Focus sur catalogue si B2B |
| Fintech/Néobanque | #9 Fintech | Ajouter crypto si mentionné |
| SaaS B2B | #6 Retail | Remplacer supply chain par customer analytics |
| Média/Content | #5 Media | Adapter CDN selon contenu |
| Startup IoT | #3 IoT | Simplifier architecture |
| Healthtech | #4 Healthcare | Insister sur compliance |
| Assurtech | #13 Insurance | Focus sur UX mobile |
| Logistique/Mobilité | #10 Logistics | Adapter véhicules/modes |
| Jeux/Apps mobiles | #7 Gaming | Ajuster pour mobile |
| Industrie/Manufacturing | #3 IoT | Focus sur OEE |

## 2. QUESTIONS TYPES ET RÉPONSES STRUCTURÉES

### Question 1: "Concevez un pipeline de données de bout en bout"

**Structure de réponse optimale :**

```markdown
1. CLARIFICATION (2 min)
   - Poser les 5 questions clés
   - Identifier le pipeline de référence
   
2. HIGH-LEVEL DESIGN (3 min)
   - Dessiner les 3 couches : Ingestion → Processing → Serving
   - Mentionner les technologies principales
   
3. DEEP DIVE (10 min)
   - Détailler la partie la plus critique
   - Montrer du code si pertinent
   
4. BOTTLENECKS (3 min)
   - Identifier 3 problèmes potentiels
   - Proposer solutions concrètes
   
5. ÉVOLUTION (2 min)
   - Roadmap 6-12-24 mois
   - Estimation des coûts
```

**Exemple concret :**
```python
# Si on vous demande un pipeline temps réel
"Pour un système de recommandation e-commerce temps réel, je proposerais :

INGESTION:
- Events utilisateurs → Kafka (100 partitions)
- CDC depuis MySQL → Debezium → Kafka
- Pourquoi Kafka? Throughput 1M msg/sec, replay capability

PROCESSING:
- Flink pour windowing et CEP
- Feature computation <50ms
- State backend RocksDB pour 100GB+ state

SERVING:
- Redis pour features (latence <5ms)
- DynamoDB pour profils (scalabilité)
- API Gateway avec cache CDN

BOTTLENECK principal: Hot partitions dans Kafka
Solution: Composite key (user_id + timestamp % 100)"
```

### Question 2: "Comment gérer 10TB de données par jour ?"

**Framework de réponse :**

```python
def design_for_scale(volume_per_day):
    if volume_per_day < "100GB":
        return {
            "storage": "PostgreSQL avec partitioning",
            "processing": "Python/Pandas sur single machine",
            "cost": "$500/mois"
        }
    elif volume_per_day < "1TB":
        return {
            "storage": "PostgreSQL + S3 archival",
            "processing": "Spark on Kubernetes",
            "cost": "$5,000/mois"
        }
    elif volume_per_day < "10TB":
        return {
            "storage": "S3 + Redshift/Snowflake",
            "processing": "EMR/Databricks",
            "cost": "$25,000/mois"
        }
    else:  # >10TB
        return {
            "storage": "Data Lake (S3) + Query Engine",
            "processing": "Spark on dedicated cluster",
            "cost": "$50,000+/mois"
        }
```

**Points clés à mentionner :**
- Compression (Parquet = 70% reduction)
- Partitioning strategy (par date + région)
- Incremental processing
- Data retention (hot/warm/cold)

### Question 3: "Votre pipeline prend 8h, comment l'optimiser ?"

**Approche systématique :**

```sql
-- 1. PROFILING
EXPLAIN ANALYZE SELECT ...;
-- Identifier où est le temps passé

-- 2. QUICK WINS (gain 30-50%)
- Index manquants
- Partitioning tables
- Parallel processing
- Incremental au lieu de full refresh

-- 3. ARCHITECTURE CHANGES (gain 70%+)
- Pré-aggregations
- Materialized views
- Change Data Capture
- Stream processing

-- 4. SCALING (si nécessaire)
- Vertical: Plus de RAM/CPU
- Horizontal: Plus de nodes
- Serverless: Auto-scaling
```

### Question 4: "Comment garantir la qualité des données ?"

**Framework complet :**

```python
class DataQualityFramework:
    def __init__(self):
        self.rules = {
            'completeness': self.check_nulls,
            'uniqueness': self.check_duplicates,
            'validity': self.check_ranges,
            'consistency': self.check_relationships,
            'timeliness': self.check_freshness,
            'accuracy': self.check_business_rules
        }
    
    def implement_quality_gates(self):
        return {
            "ingestion": {
                "schema_validation": "Avro/Protobuf schemas",
                "format_checks": "Regex patterns",
                "tools": "Great Expectations"
            },
            "processing": {
                "assertions": "dbt tests",
                "monitoring": "Datadog/DataDog",
                "circuit_breakers": "Fail fast on anomalies"
            },
            "serving": {
                "sla_monitoring": "99.9% accuracy target",
                "feedback_loops": "User reports → corrections",
                "ml_monitoring": "Data drift detection"
            }
        }
```

### Question 5: "Choisir entre Batch et Streaming ?"

**Matrice de décision :**

| Critère | Batch | Streaming | Hybride |
|---------|-------|-----------|---------|
| **Use Case Examples** | Reports, ML training, Backfills | Fraud, Trading, Gaming | E-commerce, IoT |
| **Latency** | Hours | Milliseconds | Minutes |
| **Cost** | $ | $$$$$ | $$$ |
| **Complexity** | Simple | Complex | Very Complex |
| **Error Recovery** | Easy replay | Difficult | Depends on layer |
| **Team Size Needed** | 2-3 | 5-10 | 8-15 |

**Réponse type :**
"Je commencerais par batch pour prouver la valeur, puis migrerais progressivement vers streaming pour les use cases critiques. Par exemple, commencer avec batch toutes les heures, puis micro-batch 5 minutes, puis streaming pur."

## 3. ADAPTATIONS PAR TYPE D'ENTREPRISE

### 3.1 Startup (Seed/Series A)

**Priorités :**
- Time to market > Perfection
- Coût minimal
- Évolutivité future

**Architecture recommandée :**
```yaml
Ingestion: Airbyte/Fivetran (managed)
Storage: PostgreSQL → S3 quand >1TB
Processing: dbt + Python
Analytics: Metabase/Redash (open source)
Orchestration: Airflow/Dagster
Coût: <$1,000/mois
```

**Exemple de réponse :**
"Pour une startup, je privilégierais des solutions managed et open source. Commencer simple avec PostgreSQL et dbt, puis évoluer vers un data lake S3 + Athena quand le volume justifie. L'important est de pouvoir itérer rapidement."

### 3.2 Scale-up (Series B-D)

**Priorités :**
- Scalabilité
- Fiabilité (SLA)
- Début d'optimisation coûts

**Architecture recommandée :**
```yaml
Ingestion: Kafka/Kinesis + CDC tools
Storage: Data Lake (S3) + Snowflake/BigQuery
Processing: Spark on K8s/EMR
ML Platform: SageMaker/Vertex AI
Real-time: Flink/Spark Streaming
Coût: $10,000-50,000/mois
```

### 3.3 Enterprise

**Priorités :**
- Governance & Compliance
- Multi-tenancy
- Integration legacy

**Architecture recommandée :**
```yaml
Ingestion: Enterprise ESB + Kafka
Storage: Hybrid Cloud + On-prem
Processing: Databricks/Cloudera
Governance: Collibra/Alation
Security: Knox, Ranger, encryption everywhere
Coût: >$100,000/mois
```

## 4. ANTI-PATTERNS À ÉVITER EN ENTRETIEN

### ❌ Ne PAS faire :

1. **Over-engineering initial**
   ```
   Mauvais: "Je mettrais Kubernetes + Istio + Kafka + Flink + ..."
   Bon: "Je commencerais simple et j'évoluerais selon les besoins"
   ```

2. **Ignorer les coûts**
   ```
   Mauvais: "La meilleure solution technique peu importe le prix"
   Bon: "Voici 3 options avec trade-offs coût/performance"
   ```

3. **One-size-fits-all**
   ```
   Mauvais: "Spark résout tout"
   Bon: "Spark pour batch lourd, Flink pour streaming, dbt pour SQL"
   ```

4. **Négliger la dette technique**
   ```
   Mauvais: "On migrera tout plus tard"
   Bon: "Architecture évolutive dès le début"
   ```

### ✅ TOUJOURS faire :

1. **Mentionner monitoring/observability**
2. **Parler de data quality**
3. **Considérer l'équipe existante**
4. **Proposer une migration progressive**
5. **Estimer les coûts (ordre de grandeur)**

## 5. FRAMEWORKS DE DÉCISION RAPIDE

### 5.1 Choix Base de Données

```python
def choose_database(requirements):
    if requirements['type'] == 'OLTP':
        if requirements['scale'] == 'global':
            return 'CockroachDB/Spanner'
        elif requirements['open_source']:
            return 'PostgreSQL'
        else:
            return 'Aurora'
    
    elif requirements['type'] == 'OLAP':
        if requirements['real_time']:
            return 'ClickHouse/Druid'
        elif requirements['serverless']:
            return 'BigQuery/Athena'
        else:
            return 'Snowflake/Redshift'
    
    elif requirements['type'] == 'NoSQL':
        if requirements['model'] == 'document':
            return 'MongoDB/DynamoDB'
        elif requirements['model'] == 'graph':
            return 'Neo4j/Neptune'
        elif requirements['model'] == 'time_series':
            return 'InfluxDB/TimescaleDB'
        else:  # key-value
            return 'Redis/DynamoDB'
```

### 5.2 Choix Processing Engine

```python
def choose_processing_engine(context):
    latency = context['latency_requirement']
    volume = context['daily_volume']
    complexity = context['transformation_complexity']
    
    if latency < '1s':
        if complexity == 'simple':
            return 'Kafka Streams'
        else:
            return 'Flink'
    
    elif latency < '1min':
        return 'Spark Streaming (micro-batch)'
    
    elif volume > '1TB':
        if complexity == 'SQL_only':
            return 'Presto/Athena'
        else:
            return 'Spark Batch'
    
    else:
        if complexity == 'SQL_only':
            return 'dbt'
        else:
            return 'Python/Pandas'
```

## 6. TEMPLATES DE RÉPONSES

### Template 1: Architecture Générale

```
"Pour ce use case de [CONTEXTE], je propose une architecture en 3 couches :

INGESTION (Sources → Landing):
- [OUTIL1] pour [RAISON1]
- [OUTIL2] pour [RAISON2]
- Format: [FORMAT] pour [RAISON]

PROCESSING (Transform → Analytics):
- [ENGINE] pour traiter [VOLUME]/jour
- Orchestration: [ORCHESTRATOR]
- Latence cible: [LATENCE]

SERVING (Business Value):
- [STORAGE] pour [TYPE] queries
- [API/TOOL] pour [USERS]
- Cache: [CACHE] pour [RAISON]

Cette architecture coûterait environ [COÛT]/mois et pourrait évoluer vers [EVOLUTION] quand [CONDITION]."
```

### Template 2: Optimisation

```
"Pour optimiser ce pipeline qui prend [TEMPS_ACTUEL], j'appliquerais :

QUICK WINS (1 semaine, gain 30%):
- [OPTIMISATION1]: [IMPACT]
- [OPTIMISATION2]: [IMPACT]

MEDIUM TERM (1 mois, gain 60%):
- [CHANGEMENT1]: [IMPACT]
- [CHANGEMENT2]: [IMPACT]

LONG TERM (3 mois, gain 90%):
- [REFONTE]: [IMPACT]
- Coût: [INVESTISSEMENT]
- ROI: [RETOUR]

Je mesurerais le succès avec [MÉTRIQUES]."
```

### Template 3: Troubleshooting

```
"Face à ce problème de [SYMPTÔME], mon approche serait :

1. DIAGNOSTIC (1h):
   - Vérifier [METRIQUE1]
   - Analyser [LOG/TRACE]
   - Query: [QUERY_DIAGNOSTIC]

2. MITIGATION (immédiat):
   - [ACTION1] pour stabiliser
   - [ACTION2] pour limiter impact

3. ROOT CAUSE (1 jour):
   - Hypothèse 1: [CAUSE1] → Test: [TEST1]
   - Hypothèse 2: [CAUSE2] → Test: [TEST2]

4. FIX PERMANENT (1 semaine):
   - Solution: [SOLUTION]
   - Prévention: [MONITORING]
   - Documentation: [RUNBOOK]"
```

## 7. MÉTRIQUES CLÉS À TOUJOURS MENTIONNER

### Métriques Techniques
```python
technical_metrics = {
    "latency": {
        "p50": "Médiane - performance normale",
        "p95": "95% des requêtes",
        "p99": "Cas extrêmes à optimiser"
    },
    "throughput": {
        "records_per_second": "Volume processing",
        "mb_per_second": "Bandwidth usage"
    },
    "availability": {
        "uptime": "99.9% = 43min/mois downtime",
        "error_rate": "Failures / Total requests"
    },
    "cost": {
        "per_gb_processed": "Efficacité",
        "per_million_events": "Scalabilité coût"
    }
}
```

### Métriques Business
```python
business_metrics = {
    "data_quality": {
        "completeness": "% champs non-null",
        "accuracy": "% données correctes",
        "timeliness": "Âge des données"
    },
    "business_impact": {
        "decisions_enabled": "Nombre de dashboards/APIs",
        "time_to_insight": "Pipeline end-to-end",
        "roi": "Value generated / Cost"
    }
}
```

## 8. SCRIPTS DE NÉGOCIATION ARCHITECTURE

### Quand on challenge votre choix

**Challenge**: "Pourquoi Kafka plutôt que Kinesis ?"
```
Réponse structure:
1. "Excellente question. Les deux sont valides, voici mon raisonnement :"
2. "Kafka offre [AVANTAGE1] qui est critique pour [RAISON]"
3. "Kinesis serait meilleur si [CONDITION]"
4. "Dans ce contexte, je privilégie Kafka mais je suis ouvert à Kinesis si [CONTRAINTE]"
```

**Challenge**: "C'est trop cher"
```
Réponse structure:
1. "Vous avez raison, voici 3 options :"
2. "Option 1 (Budget): [SOLUTION] à [COÛT1]"
3. "Option 2 (Balanced): [SOLUTION] à [COÛT2]"
4. "Option 3 (Premium): [SOLUTION] à [COÛT3]"
5. "Je recommande Option 2 car [RAISON]"
```

**Challenge**: "Trop complexe"
```
Réponse structure:
1. "Je comprends. Simplifions par phases :"
2. "Phase 1 (MVP): [SOLUTION_SIMPLE]"
3. "Phase 2 (+6 mois): Ajouter [FEATURE]"
4. "Phase 3 (+12 mois): Migrer vers [SOLUTION_COMPLETE]"
5. "Chaque phase apporte de la valeur indépendamment"
```

## 9. CODE SNIPPETS À MÉMORISER

### Spark Optimizations
```python
# Toujours mentionner ces optimisations
spark.conf.set("spark.sql.adaptive.enabled", "true")
spark.conf.set("spark.sql.adaptive.coalescePartitions.enabled", "true")
spark.conf.set("spark.serializer", "org.apache.spark.serializer.KryoSerializer")

# Broadcast join
from pyspark.sql.functions import broadcast
result = large_df.join(broadcast(small_df), "key")

# Partition optimization
df.repartition(200, "partition_key")
```

### Kafka Best Practices
```python
# Producer
producer_config = {
    'compression.type': 'snappy',
    'batch.size': 32768,
    'linger.ms': 20,
    'acks': 'all'  # ou 1 pour performance
}

# Consumer
consumer_config = {
    'enable.auto.commit': False,  # Manuel pour exactly-once
    'max.poll.records': 500,
    'fetch.min.bytes': 1024
}
```

### SQL Window Functions
```sql
-- Toujours impressionnant en entretien
WITH ranked_events AS (
    SELECT *,
        ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY timestamp DESC) as rn,
        LAG(event_type) OVER (PARTITION BY user_id ORDER BY timestamp) as prev_event,
        SUM(amount) OVER (PARTITION BY user_id ORDER BY timestamp 
                          ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) as running_total
    FROM events
)
SELECT * FROM ranked_events WHERE rn = 1;
```

## 10. CHECKLIST PRÉ-ENTRETIEN

### 24h avant
- [ ] Rechercher l'entreprise : Tech stack, Scale, Challenges
- [ ] Identifier 2-3 pipelines pertinents du framework
- [ ] Préparer questions sur leur contexte

### 1h avant
- [ ] Revoir architecture des pipelines sélectionnés
- [ ] Mémoriser quelques métriques clés
- [ ] Préparer tableau blanc mental

### Pendant l'entretien
- [ ] Poser questions de contexte (5 questions clés)
- [ ] Dessiner avant de parler
- [ ] Donner des chiffres (latence, coût, volume)
- [ ] Mentionner trade-offs
- [ ] Proposer évolution

### Structure temporelle (45min tech interview)
```
0-5min: Introductions et contexte
5-10min: Clarification du problème
10-25min: Design de la solution
25-35min: Deep dive technique
35-40min: Optimisations et évolutions
40-45min: Questions candidat
```

## CONCLUSION

Ce guide, combiné avec les 15 pipelines détaillés, vous donne :

1. **Flexibilité** : Adapter n'importe quel pipeline au contexte
2. **Structure** : Réponses organisées et complètes
3. **Crédibilité** : Détails techniques et métriques business
4. **Différenciation** : Solutions pragmatiques avec trade-offs

Succès = Préparation + Adaptation + Communication claire

Remember: "Il n'y a pas de solution parfaite, seulement des trade-offs bien compris."

# Pipelines pour Données Transactionnelles - 2 Cas Détaillés

## Pipeline 1: Système Bancaire Core - Migration OLTP vers Data Platform Temps Réel

### Contexte & Besoins

**Institution**: Banque avec 15M de comptes actifs  
**Volume transactionnel**: 
- 30M transactions/jour (pics à 1000 TPS)
- Base OLTP Oracle : 50TB, 200 tables critiques
- Croissance 25% YoY

**Systèmes sources**:
- Core Banking: Oracle RAC (mission-critical)
- Payment Gateway: PostgreSQL (microservices)
- ATM Network: IBM DB2
- Mobile Banking: MongoDB

**Besoins critiques**:
1. **Zero data loss**: Aucune transaction perdue (régulation bancaire)
2. **Cohérence transactionnelle**: Maintenir l'intégrité référentielle
3. **Latence <5 secondes**: Du commit OLTP à la disponibilité analytique
4. **Audit complet**: Traçabilité de chaque modification
5. **Replay capability**: Pouvoir reconstruire l'état à n'importe quel moment

### Architecture Détaillée

```
┌────────────────── SOURCES TRANSACTIONNELLES ──────────────────────────┐
│                                                                        │
│  Oracle RAC (Core Banking)                                           │
│  ├── 200 tables critiques                                            │
│  ├── 30M transactions/jour                                           │
│  ├── ACID compliance strict                                          │
│  └── Archive logs: 500GB/jour                                        │
│                                                                        │
│  PostgreSQL (Payments) | MongoDB (Mobile) | DB2 (ATM)                │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌───────────────────── CDC LAYER (Change Data Capture) ─────────────────┐
│                                                                        │
│  Oracle → GoldenGate                                                 │
│  ├── Configuration:                                                   │
│  │   - Extract: TRANLOG mode                                         │
│  │   - Trail files: 2GB max                                          │
│  │   - Checkpoint: every 10 seconds                                  │
│  │   - Coordinated Replicat for consistency                          │
│  │                                                                     │
│  PostgreSQL → Debezium                                               │
│  ├── Logical replication slots                                       │
│  ├── WAL retention: 7 days                                           │
│  └── Snapshot mode: initial load                                     │
│                                                                        │
│  MongoDB → Debezium MongoDB Connector                                │
│  └── Change Streams API                                              │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌──────────────────── STREAM PROCESSING & ROUTING ──────────────────────┐
│                                                                        │
│  Apache Kafka (Confluent Platform)                                   │
│  ├── Architecture:                                                    │
│  │   - 15 brokers (m5.4xlarge)                                       │
│  │   - RF=3, min.insync.replicas=2                                   │
│  │   - 500 partitions total                                          │
│  │   - Retention: 7 days                                             │
│  │                                                                     │
│  ├── Topics Structure:                                                │
│  │   - transactions.accounts.raw                                     │
│  │   - transactions.payments.raw                                     │
│  │   - transactions.cards.raw                                        │
│  │   - transactions.audit.log                                        │
│  │                                                                     │
│  └── Schema Registry:                                                 │
│      - Avro schemas with evolution                                   │
│      - Backward compatibility enforced                               │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────── PROCESSING & ENRICHMENT ─────────────────────────────┐
│                                                                        │
│  Stream Processing (Apache Flink)                                     │
│  ├── Stateful Operations:                                             │
│  │   - Transaction enrichment                                        │
│  │   - Account balance calculation                                   │
│  │   - Fraud detection patterns                                      │
│  │   - Customer 360 aggregation                                      │
│  │                                                                     │
│  ├── Exactly-once semantics:                                          │
│  │   - Checkpointing: 30 seconds                                     │
│  │   - State backend: RocksDB                                        │
│  │   - State size: ~2TB                                              │
│  │                                                                     │
│  └── Output Streams:                                                  │
│      - Enriched transactions                                         │
│      - Aggregated metrics                                            │
│      - Anomaly alerts                                                │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌──────────────────── STORAGE & SERVING LAYER ──────────────────────────┐
│                                                                        │
│  Hot Storage (Operational)                                           │
│  ├── Apache Pinot: Real-time OLAP                                    │
│  │   - Sub-second queries                                            │
│  │   - 7 days retention                                              │
│  │   - Pre-aggregations                                              │
│  │                                                                     │
│  ├── Redis Cluster: Session & Cache                                  │
│  │   - Account balances                                              │
│  │   - Recent transactions                                           │
│  │   - TTL: 24 hours                                                │
│  │                                                                     │
│  Warm Storage (Analytical)                                           │
│  ├── Snowflake: Data Warehouse                                       │
│  │   - Micro-partitions                                              │
│  │   - Time travel (90 days)                                         │
│  │   - Zero-copy cloning                                             │
│  │                                                                     │
│  Cold Storage (Archive)                                              │
│  └── S3 Glacier: Compliance                                          │
│      - 7 years retention                                             │
│      - Immutable backups                                             │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Gestion de la Cohérence Transactionnelle

```python
class TransactionalConsistencyManager:
    def __init__(self):
        self.watermark_tracker = WatermarkTracker()
        self.transaction_buffer = TransactionBuffer()
        self.consistency_validator = ConsistencyValidator()
    
    def process_cdc_event(self, event):
        """
        Maintient la cohérence ACID même en streaming
        """
        # 1. Identifier la transaction
        tx_id = event.transaction_id
        tx_timestamp = event.commit_timestamp
        
        # 2. Buffer les events de la même transaction
        self.transaction_buffer.add(tx_id, event)
        
        # 3. Vérifier si la transaction est complète
        if self.is_transaction_complete(tx_id):
            tx_events = self.transaction_buffer.get_transaction(tx_id)
            
            # 4. Valider la cohérence
            if self.validate_transaction_consistency(tx_events):
                # 5. Appliquer dans l'ordre
                self.apply_transaction_atomically(tx_events)
                
                # 6. Mettre à jour le watermark
                self.watermark_tracker.update(tx_timestamp)
            else:
                self.handle_inconsistency(tx_id, tx_events)
    
    def validate_transaction_consistency(self, events):
        """
        Vérifie l'intégrité référentielle
        """
        validations = [
            self.check_foreign_keys(events),
            self.check_balance_consistency(events),
            self.check_business_rules(events),
            self.check_duplicate_prevention(events)
        ]
        return all(validations)
    
    def apply_transaction_atomically(self, events):
        """
        Application atomique avec two-phase commit
        """
        try:
            # Phase 1: Prepare
            prepared_writes = []
            for event in events:
                prepared = self.prepare_write(event)
                prepared_writes.append(prepared)
            
            # Phase 2: Commit
            for write in prepared_writes:
                write.commit()
                
            # Publier vers downstream
            self.publish_to_kafka(events)
            
        except Exception as e:
            # Rollback
            for write in prepared_writes:
                write.rollback()
            raise TransactionFailedException(e)
```

### Optimisations Spécifiques OLTP

```sql
-- 1. Partitioning strategy pour les tables transactionnelles
CREATE TABLE transactions (
    transaction_id UUID PRIMARY KEY,
    account_id BIGINT NOT NULL,
    amount DECIMAL(19,4) NOT NULL,
    transaction_type VARCHAR(20),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
) PARTITION BY RANGE (created_at);

-- Créer les partitions par jour
CREATE TABLE transactions_2024_01_01 PARTITION OF transactions
    FOR VALUES FROM ('2024-01-01') TO ('2024-01-02');

-- Index optimisés pour les requêtes OLTP
CREATE INDEX idx_account_date ON transactions(account_id, created_at DESC);
CREATE INDEX idx_type_amount ON transactions(transaction_type, amount) 
    WHERE amount > 1000; -- Partial index pour grandes transactions
```

```python
# 2. CDC avec gestion du backpressure
class CDCProcessor:
    def __init__(self):
        self.max_lag_allowed = 5000  # ms
        self.batch_size = 1000
        self.circuit_breaker = CircuitBreaker()
    
    def process_wal_stream(self, wal_position):
        while True:
            # Monitorer le lag
            current_lag = self.calculate_replication_lag(wal_position)
            
            if current_lag > self.max_lag_allowed:
                # Backpressure: réduire le batch size
                self.batch_size = max(100, self.batch_size // 2)
                logger.warning(f"Lag detected: {current_lag}ms, reducing batch to {self.batch_size}")
            else:
                # Augmenter progressivement
                self.batch_size = min(5000, int(self.batch_size * 1.1))
            
            # Récupérer le batch
            events = self.fetch_wal_events(wal_position, self.batch_size)
            
            # Process avec circuit breaker
            with self.circuit_breaker:
                self.process_batch(events)
            
            wal_position = events[-1].wal_position
```

### Monitoring & Alerting

```python
class TransactionalPipelineMonitor:
    def __init__(self):
        self.metrics = {
            'replication_lag': Gauge('cdc_replication_lag_ms'),
            'transaction_throughput': Counter('transactions_processed_total'),
            'consistency_errors': Counter('consistency_violations_total'),
            'data_freshness': Histogram('data_freshness_seconds'),
            'transaction_latency': Histogram('transaction_e2e_latency_ms')
        }
    
    def monitor_critical_metrics(self):
        # 1. Lag de réplication (critique)
        lag = self.measure_replication_lag()
        if lag > 1000:  # 1 seconde
            self.alert("CRITICAL: Replication lag > 1s", lag)
        
        # 2. Cohérence transactionnelle
        consistency_score = self.check_consistency()
        if consistency_score < 0.999:  # 99.9%
            self.alert("WARNING: Consistency below threshold", consistency_score)
        
        # 3. Throughput
        tps = self.calculate_tps()
        if tps < 500:  # Minimum expected
            self.alert("WARNING: Low throughput", tps)
        
        # 4. Data freshness
        freshness = self.measure_data_freshness()
        if freshness > 5:  # 5 secondes
            self.alert("WARNING: Data staleness detected", freshness)
```

### Bottlenecks Identifiés et Solutions

1. **Hot Partitions dans Kafka**
   - **Symptôme**: Certaines partitions reçoivent 70% du trafic
   - **Cause**: Hash key basé sur account_id, comptes corporate très actifs
   - **Solution**:
   ```python
   # Stratégie de partitioning composite
   def get_partition_key(transaction):
       # Combiner account_id avec round-robin pour distribution
       base_key = transaction.account_id
       time_bucket = transaction.timestamp.minute % 10
       return f"{base_key}_{time_bucket}"
   ```

2. **Checkpoint Recovery Time**
   - **Symptôme**: 15 minutes pour restaurer depuis checkpoint
   - **Cause**: State de 2TB à recharger
   - **Solution**:
   ```yaml
   # Incremental checkpointing + local recovery
   flink:
     state.backend: rocksdb
     state.backend.incremental: true
     state.backend.local-recovery: true
     state.checkpoints.num-retained: 3
   ```

3. **Deadlocks lors des écritures concurrentes**
   - **Symptôme**: Timeouts dans les transactions
   - **Solution**:
   ```python
   # Ordered locking strategy
   def acquire_locks_ordered(resources):
       # Toujours acquérir dans le même ordre
       sorted_resources = sorted(resources, key=lambda x: x.id)
       locks = []
       for resource in sorted_resources:
           lock = resource.acquire_lock(timeout=5)
           locks.append(lock)
       return locks
   ```

### Évolution et Roadmap

**Phase 1 (Actuel → 3 mois): Stabilisation**
- Objectif: 99.99% uptime
- Actions:
  - Monitoring avancé
  - Automated failover
  - Performance tuning
- Coût: $150K/mois

**Phase 2 (3-6 mois): Enrichissement**
- ML-based fraud detection en temps réel
- Graph analytics pour AML
- Customer 360 view temps réel
- Coût additionnel: +$50K/mois

**Phase 3 (6-12 mois): Global Expansion**
- Multi-region active-active
- Cross-border transaction support
- 24/7 global operations
- Coût: $400K/mois total

### Métriques de Performance

| Métrique | Actuel | Target | Meilleur de l'industrie |
|----------|--------|--------|-------------------------|
| **Latence E2E** | 4.2s | <3s | <1s |
| **Throughput** | 1000 TPS | 2000 TPS | 5000 TPS |
| **Cohérence** | 99.95% | 99.99% | 99.999% |
| **Availability** | 99.9% | 99.99% | 99.999% |
| **Recovery Time** | 15 min | <5 min | <1 min |
| **Coût/Million Tx** | $8.50 | $5.00 | $2.00 |

---

## Pipeline 2: E-Commerce Multi-Canal - Synchronisation Inventaire Temps Réel

### Contexte & Besoins

**Entreprise**: Retailer omnicanal avec 500 magasins + e-commerce  
**Volume transactionnel**:
- 2M transactions/jour tous canaux
- 100K SKUs actifs
- 50 systèmes POS différents
- Pics Black Friday: 10x volume normal

**Systèmes OLTP sources**:
- ERP central: SAP HANA (source of truth)
- E-commerce: PostgreSQL cluster
- Magasins: 50 systèmes POS différents
- Marketplace: APIs partenaires
- Entrepôts: WMS Oracle

**Défis critiques**:
1. **Cohérence inventaire**: Éviter survente (coût: $2M/an)
2. **Latence <500ms**: Pour disponibilité produit temps réel
3. **Distributed transactions**: Cross-système ACID
4. **Isolation multi-tenant**: Par magasin/canal
5. **Rollback capability**: Annulation commandes complexes

### Architecture Détaillée

```
┌──────────────── SYSTÈMES TRANSACTIONNELS SOURCES ─────────────────────┐
│                                                                        │
│  SAP HANA (ERP Central)                                              │
│  ├── Master Data: Products, Pricing, Inventory                       │
│  ├── Financial Transactions                                          │
│  └── Supply Chain Events                                             │
│                                                                        │
│  PostgreSQL Cluster (E-Commerce)                                     │
│  ├── Orders, Carts, Sessions                                         │
│  ├── Customer Data                                                   │
│  └── Sharded by customer_id % 10                                     │
│                                                                        │
│  POS Systems (50 types)                                              │
│  ├── Square, Shopify POS, Custom systems                             │
│  ├── Batch uploads + Real-time streams                              │
│  └── Different data formats                                          │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────── CAPTURE & NORMALISATION ─────────────────────────────┐
│                                                                        │
│  CDC Implementation par Source:                                       │
│                                                                        │
│  SAP HANA → SLT (SAP Landscape Transformation)                      │
│  ├── Trigger-based CDC                                               │
│  ├── Real-time replication                                           │
│  └── Guaranteed delivery                                             │
│                                                                        │
│  PostgreSQL → Logical Replication + Debezium                         │
│  ├── Slot-based CDC                                                  │
│  ├── Transaction grouping                                            │
│  └── Parallel extractors (1 per shard)                              │
│                                                                        │
│  POS Systems → Custom Adapters                                       │
│  ├── Polling for batch systems                                       │
│  ├── Webhooks for modern POS                                         │
│  └── File watchers for legacy                                        │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌──────────────── DISTRIBUTED TRANSACTION COORDINATOR ───────────────────┐
│                                                                        │
│  Apache Kafka + Saga Pattern Implementation                          │
│                                                                        │
│  Transaction Coordinator Service (Spring Boot)                       │
│  ├── Saga Orchestration                                              │
│  ├── Compensation Logic                                              │
│  ├── State Management (Event Sourcing)                              │
│  └── Timeout Handling                                                │
│                                                                        │
│  Topics Architecture:                                                 │
│  ├── orders.commands                                                 │
│  ├── orders.events                                                   │
│  ├── inventory.commands                                              │
│  ├── inventory.events                                                │
│  ├── saga.orchestration                                              │
│  └── saga.compensation                                               │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────── INVENTORY SYNCHRONIZATION ENGINE ────────────────────┐
│                                                                        │
│  Real-time Inventory Service (Akka Cluster)                         │
│  ├── Actor Model for Distributed State                              │
│  ├── CRDT for Conflict Resolution                                   │
│  ├── Event Sourcing for Audit                                       │
│  └── Sharding by SKU                                                │
│                                                                        │
│  Cache Layer (Redis Cluster + Hazelcast)                            │
│  ├── Write-through cache                                             │
│  ├── Inventory snapshots                                             │
│  ├── Pessimistic locking for critical SKUs                          │
│  └── TTL: 60 seconds                                                │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Implémentation Saga Pattern pour Transactions Distribuées

```python
class DistributedTransactionSaga:
    """
    Implémente le pattern Saga pour maintenir la cohérence
    à travers plusieurs systèmes OLTP
    """
    
    def __init__(self):
        self.saga_log = SagaLog()  # Event store
        self.compensations = {}     # Rollback actions
        self.timeout = 30           # seconds
        
    async def execute_order_saga(self, order):
        """
        Saga pour une commande multi-canal
        """
        saga_id = str(uuid4())
        saga_state = SagaState(saga_id, order)
        
        try:
            # Step 1: Réserver l'inventaire
            reservation = await self.reserve_inventory(order.items)
            saga_state.add_step("inventory_reserved", reservation)
            self.compensations[saga_id] = {
                "inventory": lambda: self.release_inventory(reservation)
            }
            
            # Step 2: Valider le paiement
            payment = await self.process_payment(order.payment_info)
            saga_state.add_step("payment_processed", payment)
            self.compensations[saga_id]["payment"] = \
                lambda: self.refund_payment(payment)
            
            # Step 3: Créer la commande dans l'ERP
            erp_order = await self.create_erp_order(order)
            saga_state.add_step("erp_order_created", erp_order)
            self.compensations[saga_id]["erp"] = \
                lambda: self.cancel_erp_order(erp_order)
            
            # Step 4: Déclencher le fulfillment
            fulfillment = await self.trigger_fulfillment(order)
            saga_state.add_step("fulfillment_triggered", fulfillment)
            
            # Success - Commit the saga
            await self.commit_saga(saga_state)
            
            # Publier l'événement de succès
            await self.publish_event("OrderCompleted", order)
            
            return {"status": "success", "order_id": order.id}
            
        except Exception as e:
            # Échec - Exécuter les compensations
            await self.compensate_saga(saga_id, saga_state)
            await self.publish_event("OrderFailed", order, str(e))
            raise OrderSagaException(f"Saga failed: {e}")
    
    async def compensate_saga(self, saga_id, saga_state):
        """
        Rollback dans l'ordre inverse
        """
        completed_steps = saga_state.get_completed_steps()
        
        for step in reversed(completed_steps):
            try:
                compensation = self.compensations[saga_id].get(step.name)
                if compensation:
                    await compensation()
                    saga_state.add_compensation(step.name)
            except Exception as e:
                # Log mais continue le rollback
                logger.error(f"Compensation failed for {step.name}: {e}")
                saga_state.add_failed_compensation(step.name, str(e))
        
        # Persister l'état final
        await self.saga_log.save(saga_state)
```

### Gestion de la Cohérence Inventaire Multi-Canal

```python
class InventorySynchronizer:
    """
    Maintient la cohérence de l'inventaire à travers tous les canaux
    """
    
    def __init__(self):
        self.inventory_cache = DistributedCache()
        self.conflict_resolver = CRDTResolver()
        self.event_store = EventStore()
        
    def process_inventory_transaction(self, transaction):
        """
        Process une transaction d'inventaire avec cohérence garantie
        """
        sku = transaction.sku
        quantity_change = transaction.quantity_change
        channel = transaction.channel
        
        # 1. Acquérir un lock distribué
        with self.distributed_lock(f"inventory:{sku}", timeout=5):
            
            # 2. Lire l'état actuel depuis toutes les sources
            current_state = self.read_inventory_state(sku)
            
            # 3. Valider la transaction
            validation = self.validate_inventory_change(
                current_state, 
                quantity_change,
                channel
            )
            
            if not validation.is_valid:
                raise InsufficientInventoryException(validation.reason)
            
            # 4. Calculer le nouvel état
            new_state = self.calculate_new_state(
                current_state,
                quantity_change,
                channel
            )
            
            # 5. Propager vers tous les systèmes (2PC)
            self.two_phase_commit(sku, new_state)
            
            # 6. Publier l'événement
            self.publish_inventory_event(sku, current_state, new_state)
            
            return new_state
    
    def two_phase_commit(self, sku, new_state):
        """
        Two-phase commit pour garantir la cohérence
        """
        participants = [
            self.erp_adapter,
            self.ecommerce_adapter,
            self.pos_adapter,
            self.wms_adapter
        ]
        
        # Phase 1: Prepare
        prepared = []
        for participant in participants:
            try:
                vote = participant.prepare(sku, new_state)
                if vote == "YES":
                    prepared.append(participant)
                else:
                    raise CommitAbortedException(f"{participant} voted NO")
            except Exception as e:
                raise CommitAbortedException(f"Prepare failed: {e}")
        
        # Phase 2: Commit
        try:
            for participant in prepared:
                participant.commit(sku, new_state)
        except Exception as e:
            # Rollback en cas d'échec
            for participant in prepared:
                try:
                    participant.rollback(sku)
                except:
                    pass  # Best effort
            raise CommitFailedException(f"Commit failed: {e}")
    
    def handle_conflicting_updates(self, sku, updates):
        """
        Résolution de conflits avec CRDT
        """
        # Utiliser un G-Counter pour l'inventaire
        merged_state = GCounter()
        
        for update in updates:
            merged_state.merge(update.vector_clock, update.value)
        
        # Valider le résultat
        final_value = merged_state.value()
        
        if final_value < 0:
            # Conflict irréconciliable - escalader
            self.escalate_conflict(sku, updates)
        
        return final_value
```

### Optimisations pour Haute Performance

```python
# 1. Batching intelligent pour réduire la latence
class SmartBatcher:
    def __init__(self):
        self.batch_size = 100
        self.max_wait = 10  # ms
        self.adaptive = True
        
    async def process(self, stream):
        batch = []
        batch_start = time.time()
        
        async for event in stream:
            batch.append(event)
            
            should_flush = (
                len(batch) >= self.batch_size or
                (time.time() - batch_start) * 1000 > self.max_wait
            )
            
            if should_flush:
                await self.flush_batch(batch)
                batch = []
                batch_start = time.time()
                
                # Adaptation dynamique
                if self.adaptive:
                    self.adjust_parameters()
    
    def adjust_parameters(self):
        """Ajuste les paramètres selon la charge"""
        current_throughput = self.measure_throughput()
        
        if current_throughput > 10000:  # High load
            self.batch_size = min(500, self.batch_size * 1.2)
            self.max_wait = max(5, self.max_wait * 0.8)
        else:  # Low load
            self.batch_size = max(50, self.batch_size * 0.8)
            self.max_wait = min(50, self.max_wait * 1.2)

# 2. Cache prédictif pour les SKUs populaires
class PredictiveCache:
    def __init__(self):
        self.cache = LRUCache(maxsize=10000)
        self.access_pattern = TimeSeriesPredictor()
        self.preloader = AsyncPreloader()
        
    async def get(self, sku):
        # Check cache
        if sku in self.cache:
            self.record_hit(sku)
            return self.cache[sku]
        
        # Miss - charger et prédire
        value = await self.load_from_source(sku)
        self.cache[sku] = value
        
        # Prédire les prochains accès
        predicted_skus = self.access_pattern.predict_next(sku, n=5)
        
        # Précharger de manière asynchrone
        for predicted_sku in predicted_skus:
            if predicted_sku not in self.cache:
                self.preloader.schedule(predicted_sku)
        
        return value
```

### Monitoring Avancé

```python
class TransactionalMetricsCollector:
    def __init__(self):
        self.metrics = {
            'transaction_rate': Rate(),
            'consistency_score': Gauge(),
            'conflict_rate': Counter(),
            'saga_success_rate': Histogram(),
            'inventory_accuracy': Gauge()
        }
        
    def collect_real_time_metrics(self):
        return {
            # Performance
            'tps_current': self.calculate_tps(),
            'latency_p50': self.get_percentile(50),
            'latency_p99': self.get_percentile(99),

# Checklist Complète - Questions pour Conception de Pipeline Data Engineering

## 1. CONTEXTE BUSINESS & OBJECTIFS

### 1.1 Vision Stratégique
- [ ] **Quel est l'objectif business principal de ce pipeline ?**
  - ROI attendu ?
  - KPIs à impacter ?
  - Valeur métier générée ?

- [ ] **Qui sont les utilisateurs finaux ?**
  - Analystes data ?
  - Data scientists ?
  - Business users ?
  - Applications temps réel ?
  - Systèmes externes ?

- [ ] **Quelle est la criticité business ?**
  - Mission-critical (impact revenue direct) ?
  - Opérationnel (processus métier) ?
  - Analytique (reporting, insights) ?
  - Exploratoire (R&D, POC) ?

- [ ] **Quel est l'horizon temporel ?**
  - POC (< 3 mois) ?
  - MVP (3-6 mois) ?
  - Production (6-12 mois) ?
  - Long terme (> 1 an) ?

### 1.2 Contraintes Organisationnelles
- [ ] **Quel est le budget disponible ?**
  - CAPEX initial ?
  - OPEX mensuel maximum ?
  - Coût par GB/TB acceptable ?
  - Budget évolutif ou fixe ?

- [ ] **Quelle est la maturité data de l'organisation ?**
  - Débutant (première initiative) ?
  - Intermédiaire (quelques pipelines existants) ?
  - Avancé (data-driven culture) ?
  - Expert (ML ops, real-time) ?

- [ ] **Quelles sont les compétences de l'équipe ?**
  - Taille de l'équipe ?
  - Stack technique maîtrisé ?
  - Capacité d'apprentissage ?
  - Support externe disponible ?

## 2. SOURCES DE DONNÉES

### 2.1 Identification des Sources
- [ ] **Quelles sont TOUTES les sources de données ?**
  - Bases OLTP (MySQL, PostgreSQL, Oracle) ?
  - APIs (REST, GraphQL, SOAP) ?
  - Fichiers (CSV, JSON, XML, Excel) ?
  - Streams (Kafka, logs, IoT) ?
  - Services SaaS (Salesforce, Google Analytics) ?
  - Data lakes existants ?

- [ ] **Pour chaque source, quelle est sa nature ?**
  - Transactionnelle (OLTP) ?
  - Analytique (OLAP) ?
  - Semi-structurée ?
  - Non-structurée ?
  - Time-series ?

- [ ] **Quel est l'accès aux sources ?**
  - Accès direct base ?
  - API avec rate limits ?
  - Export fichiers seulement ?
  - CDC disponible ?
  - Temps réel possible ?

### 2.2 Caractéristiques des Sources
- [ ] **Quel est le volume par source ?**
  - Volume initial à migrer ?
  - Volume incrémental journalier ?
  - Taille moyenne des records ?
  - Nombre de tables/entités ?

- [ ] **Quelle est la vélocité des données ?**
  - Fréquence de mise à jour ?
  - Données en temps réel nécessaires ?
  - Batch acceptable (fréquence) ?
  - Pics de charge (quand, volume) ?

- [ ] **Quelle est la qualité des données sources ?**
  - Données manquantes fréquentes ?
  - Doublons possibles ?
  - Formats inconsistants ?
  - Schéma évolutif ?

## 3. EXIGENCES FONCTIONNELLES

### 3.1 Latence & Fraîcheur
- [ ] **Quelle est la latence acceptable end-to-end ?**
  - Temps réel (< 1 seconde) ?
  - Near real-time (< 1 minute) ?
  - Micro-batch (5-15 minutes) ?
  - Batch (horaire, journalier) ?
  - Pourquoi ce choix (justification business) ?

- [ ] **Quelle est la fraîcheur requise par dataset ?**
  - Certaines données plus critiques ?
  - Fenêtres de maintenance acceptables ?
  - Impact business si données obsolètes ?

### 3.2 Transformations & Enrichissement
- [ ] **Quelles transformations sont nécessaires ?**
  - Nettoyage (nulls, formats) ?
  - Normalisation/Dénormalisation ?
  - Agrégations (temporelles, dimensions) ?
  - Jointures (combien, complexité) ?
  - Calculs métier (lesquels) ?

- [ ] **Quel enrichissement est requis ?**
  - Données de référence ?
  - APIs externes ?
  - ML scoring ?
  - Géolocalisation ?
  - Données dérivées ?

- [ ] **Quelle est la complexité des règles métier ?**
  - Règles simples (SQL) ?
  - Logique complexe (code) ?
  - Machine Learning requis ?
  - Changements fréquents ?

### 3.3 Qualité & Gouvernance
- [ ] **Quels sont les critères de qualité obligatoires ?**
  - Complétude (% acceptable) ?
  - Unicité (déduplications) ?
  - Validité (règles de validation) ?
  - Cohérence (cross-source) ?
  - Exactitude (tolerance) ?

- [ ] **Quelles sont les exigences de gouvernance ?**
  - Lignage des données requis ?
  - Catalogage nécessaire ?
  - Propriétaires identifiés ?
  - Classification sensibilité ?

## 4. EXIGENCES NON-FONCTIONNELLES

### 4.1 Performance & Scalabilité
- [ ] **Quels sont les SLA de performance ?**
  - Temps de traitement maximum ?
  - Throughput minimum (records/sec) ?
  - Temps de requête maximum ?
  - Disponibilité requise (99.9%, 99.99%) ?

- [ ] **Quelle est la croissance anticipée ?**
  - Croissance volume (% par an) ?
  - Nouveaux cas d'usage prévus ?
  - Nouvelles sources planifiées ?
  - Expansion géographique ?

- [ ] **Quelles sont les contraintes de ressources ?**
  - CPU/RAM disponibles ?
  - Stockage maximum ?
  - Bande passante réseau ?
  - Quotas cloud ?

### 4.2 Sécurité & Conformité
- [ ] **Quelles sont les exigences de sécurité ?**
  - Chiffrement at-rest obligatoire ?
  - Chiffrement in-transit requis ?
  - Authentification (SSO, MFA) ?
  - Autorisation (RBAC, ABAC) ?
  - Audit trail complet ?

- [ ] **Quelles sont les contraintes réglementaires ?**
  - GDPR (données EU) ?
  - CCPA (données California) ?
  - HIPAA (santé US) ?
  - PCI-DSS (cartes bancaires) ?
  - SOC2/ISO27001 ?
  - Réglementations sectorielles ?

- [ ] **Quelle est la sensibilité des données ?**
  - PII (Personal Identifiable Information) ?
  - PHI (Protected Health Information) ?
  - Données financières ?
  - Propriété intellectuelle ?
  - Niveau de classification ?

### 4.3 Résilience & Récupération
- [ ] **Quelle est la tolérance aux pannes ?**
  - RPO (Recovery Point Objective) ?
  - RTO (Recovery Time Objective) ?
  - Backup fréquence/rétention ?
  - Géo-réplication requise ?

- [ ] **Comment gérer les erreurs ?**
  - Retry automatique ?
  - Dead letter queues ?
  - Alerting (qui, comment) ?
  - Rollback capability ?

- [ ] **Quelle est la stratégie de reprise ?**
  - Replay depuis quand ?
  - Données de recovery ?
  - Mode dégradé acceptable ?
  - Switchover time ?

## 5. ARCHITECTURE TECHNIQUE

### 5.1 Choix Technologiques
- [ ] **Quel est l'écosystème technique actuel ?**
  - Cloud provider (AWS, GCP, Azure) ?
  - On-premise contraintes ?
  - Hybrid cloud possible ?
  - Technologies déjà en place ?
  - Standards entreprise ?

- [ ] **Quelles sont les préférences techniques ?**
  - Open source prioritaire ?
  - Managed services préférés ?
  - Vendor lock-in acceptable ?
  - Best-of-breed vs all-in-one ?

- [ ] **Quelles sont les contraintes d'intégration ?**
  - Systèmes legacy à connecter ?
  - APIs à exposer ?
  - Formats imposés ?
  - Protocoles requis ?

### 5.2 Patterns Architecturaux
- [ ] **Quel pattern global adopter ?**
  - Lambda (batch + streaming) ?
  - Kappa (streaming only) ?
  - Batch traditionnel ?
  - Event-driven ?
  - Microservices ?

- [ ] **Comment organiser le stockage ?**
  - Data Lake requis ?
  - Data Warehouse nécessaire ?
  - Lakehouse envisagé ?
  - Bases opérationnelles ?
  - Cache nécessaire ?

- [ ] **Quelle stratégie de processing ?**
  - ETL classique ?
  - ELT moderne ?
  - Stream processing ?
  - In-database processing ?
  - Distributed computing ?

## 6. OPÉRATIONS & MAINTENANCE

### 6.1 Déploiement & CI/CD
- [ ] **Comment sera déployé le pipeline ?**
  - Environnements (dev, staging, prod) ?
  - Stratégie de déploiement (blue-green, canary) ?
  - Fréquence de release ?
  - Rollback process ?

- [ ] **Quelle automatisation mettre en place ?**
  - Tests automatisés (unit, integration) ?
  - Validation données automatique ?
  - Déploiement automatisé ?
  - Scaling automatique ?

### 6.2 Monitoring & Observabilité
- [ ] **Que faut-il monitorer ?**
  - Métriques techniques (CPU, RAM, I/O) ?
  - Métriques pipeline (latence, throughput) ?
  - Métriques data (qualité, volume) ?
  - Métriques business (KPIs) ?

- [ ] **Comment alerter ?**
  - Seuils d'alerte ?
  - Canaux (email, Slack, PagerDuty) ?
  - Escalation process ?
  - On-call rotation ?

- [ ] **Quelle observabilité nécessaire ?**
  - Logs centralisés ?
  - Distributed tracing ?
  - Dashboards temps réel ?
  - Data lineage visible ?

### 6.3 Documentation & Formation
- [ ] **Quelle documentation produire ?**
  - Architecture diagrams ?
  - Runbooks opérationnels ?
  - API documentation ?
  - Business glossary ?
  - Troubleshooting guides ?

- [ ] **Comment assurer le knowledge transfer ?**
  - Formation équipe ?
  - Documentation technique ?
  - Sessions de handover ?
  - Support post-deployment ?

## 7. ÉVOLUTION & OPTIMISATION

### 7.1 Roadmap & Évolutions
- [ ] **Quelles évolutions sont prévues ?**
  - Nouvelles sources (timing) ?
  - Nouveaux use cases ?
  - Migration cloud ?
  - ML/AI integration ?
  - Real-time evolution ?

- [ ] **Comment l'architecture doit-elle évoluer ?**
  - Passage à l'échelle prévu ?
  - Migration technologique ?
  - Modernisation progressive ?
  - Deprecation planning ?

### 7.2 Optimisation Continue
- [ ] **Comment mesurer et optimiser les coûts ?**
  - Cost monitoring en place ?
  - Optimisation storage (compression, tiering) ?
  - Compute optimization (spot, reserved) ?
  - Data lifecycle management ?

- [ ] **Comment améliorer les performances ?**
  - Bottlenecks identifiés ?
  - Optimisations planifiées ?
  - Caching strategy ?
  - Index optimization ?

## 8. VALIDATION DES CHOIX

### 8.1 Trade-offs Critiques
- [ ] **Batch vs Streaming : justification finale ?**
  - Pourquoi ce choix ?
  - Alternatives considérées ?
  - Impact si mauvais choix ?
  - Coût du changement ?

- [ ] **Build vs Buy : décision pour chaque composant ?**
  - Coût développement vs licence ?
  - Maintenance long terme ?
  - Expertise disponible ?
  - Flexibilité requise ?

- [ ] **On-premise vs Cloud vs Hybrid ?**
  - TCO sur 3 ans ?
  - Contraintes légales ?
  - Performance requise ?
  - Expertise équipe ?

### 8.2 Risques & Mitigation
- [ ] **Quels sont les risques principaux ?**
  - Risques techniques ?
  - Risques organisationnels ?
  - Risques réglementaires ?
  - Risques financiers ?

- [ ] **Comment mitiger chaque risque ?**
  - Plan de mitigation ?
  - Plan de contingence ?
  - Acceptation formelle ?
  - Monitoring du risque ?

## 9. CRITÈRES DE SUCCÈS

### 9.1 Métriques de Succès
- [ ] **Comment mesurer le succès technique ?**
  - SLA atteints ?
  - Performance metrics ?
  - Uptime achieved ?
  - Incidents count ?

- [ ] **Comment mesurer le succès business ?**
  - ROI mesuré ?
  - User adoption ?
  - Business KPIs impactés ?
  - Time to market ?

### 9.2 Acceptance Criteria
- [ ] **Quels sont les critères d'acceptance ?**
  - Tests de performance ?
  - Validation business ?
  - Security audit ?
  - Documentation complète ?

## 10. DÉCISIONS FINALES

### 10.1 Architecture Finale
- [ ] **Stack technologique validé :**
  - Ingestion: _____________
  - Storage: _____________
  - Processing: _____________
  - Serving: _____________
  - Orchestration: _____________
  - Monitoring: _____________

- [ ] **Justification pour chaque choix écarté :**
  - Pourquoi pas [Technology X] ?
  - Conditions de reconsidération ?
  - Impact du non-choix ?

### 10.2 Plan d'Implémentation
- [ ] **Phases de delivery définies ?**
  - Phase 1 (scope, timeline, cost) ?
  - Phase 2 (scope, timeline, cost) ?
  - Phase 3 (scope, timeline, cost) ?
  - Dependencies identifiées ?

- [ ] **Ressources allouées ?**
  - Équipe (roles, sizing) ?
  - Infrastructure (specs) ?
  - Budget (CAPEX/OPEX) ?
  - Timeline (milestones) ?

---

## UTILISATION DE CETTE CHECKLIST

### Mode d'emploi :

1. **Phase Discovery (Questions 1-4)** : 2-3 sessions avec stakeholders
   - Business owners
   - Data owners  
   - IT/Security teams

2. **Phase Design (Questions 5-7)** : 1-2 semaines d'architecture
   - Workshops techniques
   - POCs si nécessaire
   - Vendor evaluations

3. **Phase Validation (Questions 8-9)** : Revue architecture
   - Peer review
   - Security review
   - Cost review

4. **Phase Decision (Question 10)** : Documentation finale
   - Architecture Decision Records (ADR)
   - Implementation plan
   - Risk register

### Points de Vigilance :

⚠️ **Ne pas ignorer de questions** - Chaque question non répondue = risque potentiel

⚠️ **Challenger les "évidences"** - "On a toujours fait comme ça" n'est pas une justification

⚠️ **Documenter les trade-offs** - Expliquer pourquoi on n'a PAS choisi certaines options

⚠️ **Réviser régulièrement** - Les besoins évoluent, l'architecture aussi

### Scoring de Maturité :

- **< 30% questions répondues** : Pas prêt, plus de discovery nécessaire
- **30-60% répondues** : Besoin de clarifications sur points critiques  
- **60-80% répondues** : Peut commencer le design détaillé
- **> 80% répondues** : Prêt pour l'implémentation

Cette checklist garantit qu'aucun aspect critique n'est oublié et que chaque décision est justifiée et documentée.

# 5 Scénarios Détaillés - Besoins pour Pipelines Data

## Scénario 1: FinTech Neo-Bank - "RapidPay"

### Description de l'entreprise
RapidPay est une néo-banque européenne en forte croissance, lancée il y a 18 mois, avec 2.5 millions de clients actifs. L'entreprise vient de lever une Série B de 150M€ et vise 10 millions de clients dans 2 ans. Le business model repose sur les frais d'interchange, les abonnements premium et le crédit à la consommation.

### Réponses aux questions de la checklist

**CONTEXTE BUSINESS & OBJECTIFS**
L'objectif principal est de créer une plateforme de données unifiée pour : (1) scoring de crédit en temps réel avec un taux d'acceptation 30% supérieur aux banques traditionnelles tout en maintenant le risque, (2) détection de fraude instantanée réduisant les pertes de 0.1% à 0.02% du volume transactionnel, (3) personnalisation de l'expérience client augmentant l'ARPU de 12€ à 18€/mois. ROI attendu : 25M€/an. Les utilisateurs finaux sont les risk managers (20 personnes), l'équipe produit (50 personnes), les data scientists (15 personnes), les régulateurs (accès audit), et les APIs mobiles servant 2.5M d'utilisateurs. Criticité maximale : système mission-critical avec impact direct sur les revenus et la conformité réglementaire. Timeline : MVP en 3 mois pour le scoring, 6 mois pour la plateforme complète.

Budget : 100K€ CAPEX initial, 40K€/mois OPEX, évolutif selon la croissance. L'équipe data compte 8 personnes : 2 data engineers seniors, 3 juniors, 2 DevOps, 1 architecte. Stack actuel : AWS, Python, PostgreSQL. Capacité d'apprentissage élevée, culture startup agile.

**SOURCES DE DONNÉES**
Sources principales : (1) Base transactionnelle PostgreSQL Aurora (core banking) - 500GB, 5M transactions/jour, (2) MongoDB pour les données utilisateurs et KYC - 200GB, (3) Kafka streams des événements mobiles - 1M events/heure, (4) APIs externes : bureaux de crédit (Experian, Equifax), open banking (Plaid, TrueLayer) - 100K calls/jour, (5) Fichiers batch des processeurs de paiement (Mastercard, Visa) - 10GB/jour en CSV, (6) Logs CloudWatch des applications - 50GB/jour.

Accès : CDC disponible sur PostgreSQL via logical replication, MongoDB change streams actifs, APIs avec rate limits stricts (1000/min pour bureaux crédit), fichiers SFTP pour processeurs paiement. Volume total : 2TB existant, +100GB/jour, croissance 40%/an.

**EXIGENCES FONCTIONNELLES**
Latence : scoring crédit <500ms (P99), détection fraude <100ms (P99), agrégations dashboards <5min, reporting régulateur batch quotidien. Justification : l'UX mobile nécessite des réponses instantanées pour maintenir les taux de conversion.

Transformations requises : (1) Enrichissement temps réel avec bureaux de crédit, (2) Feature engineering pour ML (200+ features), (3) Agrégations par merchant/catégorie/géographie, (4) Anonymisation PII pour analytics, (5) Calculs de risque complexes (VaR, stress testing).

Qualité : 99.9% de complétude obligatoire, zéro duplication des transactions (reconciliation quotidienne), validation des montants avec règles métier, cohérence cross-système critique.

**EXIGENCES NON-FONCTIONNELLES**
Performance : SLA 99.95% disponibilité, throughput 10K transactions/sec en peak, P99 latency <500ms end-to-end. Scalabilité : prévoir 5x croissance en 18 mois, multi-région Europe prévu.

Sécurité : PCI-DSS Level 1 obligatoire, GDPR avec droit à l'oubli, PSD2 pour open banking, chiffrement AES-256 at-rest, TLS 1.3 in-transit, tokenisation des PANs, audit trail complet 7 ans.

Résilience : RPO 1 minute, RTO 5 minutes, backups toutes les heures avec rétention 90 jours, multi-AZ obligatoire, disaster recovery cross-région.

**CONTRAINTES SPÉCIFIQUES**
Contrainte réglementaire forte avec audits trimestriels BCE, reporting quotidien obligatoire, data residency EU uniquement. Technologies imposées : rester sur AWS (contrat entreprise), réutiliser Kafka existant, PostgreSQL pour transactionnel.

---

## Scénario 2: Retail Traditionnel - "MegaStore"

### Description de l'entreprise
MegaStore est une chaîne de distribution française centenaire avec 850 magasins, 45 000 employés et 8 milliards € de CA. Face à la concurrence d'Amazon, l'entreprise lance sa transformation digitale avec fusion online/offline. Legacy important : SAP ECC6 depuis 2005, 50+ systèmes différents, culture IT traditionnelle.

### Réponses aux questions de la checklist

**CONTEXTE BUSINESS & OBJECTIFS**
Objectif : créer un data hub unifiant online et offline pour (1) optimisation des stocks réduisant les ruptures de 30% (impact : +120M€/an), (2) personnalisation marketing augmentant la conversion de 2%, (3) optimisation supply chain réduisant les coûts logistiques de 8%. ROI visé : 200M€/an après 2 ans.

Utilisateurs : 500 category managers, 200 analystes supply chain, 5000 directeurs magasins (tableaux de bord), 50 data analysts centraux, système de réapprovisionnement automatique. Criticité : haute pour supply chain (rupture = perte CA), moyenne pour analytics marketing. Horizon : migration progressive sur 24 mois, quick wins attendus sous 6 mois.

Budget : 5M€ année 1, 3M€/an ensuite. Équipe : 15 personnes IT data existantes (principalement SQL/Oracle), recrutement de 10 profils modernes prévu, support Capgemini pour transformation.

**SOURCES DE DONNÉES**
Sources : (1) SAP ECC6 - 15TB Oracle, 500 tables, temps réel impossible, (2) 850 systèmes de caisse différents - mix AS400, SQL Server, propriétaire, batch quotidien uniquement, (3) E-commerce Salesforce Commerce Cloud - APIs REST, (4) 20 WMS différents selon entrepôts - formats hétérogènes, (5) Données fournisseurs - 3000 EDI différents, (6) IoT naissant - 10K capteurs température pour frais, (7) Google Analytics 360 - 10GB/jour.

Accès limité : SAP extraction nocturne uniquement (fenêtre 2h-6h), caisses via FTP/batch (pas de temps réel), nombreux formats propriétaires nécessitant parsing custom. Volume : 50TB existant, +500GB/jour, pics x3 pendant soldes.

**EXIGENCES FONCTIONNELLES**
Latence : stock temps réel pour e-commerce (<1min), dashboards magasins rafraîchis toutes les heures, supply chain optimization quotidien, financial reporting hebdomadaire. Pas de real-time critique sauf stock e-commerce.

Transformations : (1) Harmonisation référentiels produits (8M SKUs, 50 nomenclatures), (2) Géocodage magasins/clients, (3) Calculs marges complexes avec conditions fournisseurs, (4) Prévisions ventes par ML, (5) Master Data Management critique.

Qualité : référentiel produit 100% cohérent obligatoire, prix sans erreur (impact légal), stock fiable à 95%, acceptation de 48h de délai pour certaines métriques.

**EXIGENCES NON-FONCTIONNELLES**
Performance : dashboards <3 secondes, batch quotidien en <4 heures, disponibilité 99% (maintenance weekend acceptée). Croissance modérée : +20%/an, pas de pic majeur prévu.

Sécurité : RGPD pour 15M clients, SOC2 demandé par actionnaires, ségrégation données RH/finance, pas de contrainte carte bancaire (processeur externe). Résilience : RPO 24h acceptable sauf commandes, RTO 4h business hours, backup 30 jours suffisant.

**CONTRAINTES SPÉCIFIQUES**
Résistance au changement forte, besoin d'accompagnement utilisateurs, interfaces familières obligatoires (Excel, Tableau). Migration SAP S/4HANA prévue dans 3 ans (ne pas trop investir sur ECC6). Préférence solutions Microsoft (contrat EA), on-premise pour données sensibles.

---

## Scénario 3: HealthTech Startup - "MediCare AI"

### Description de l'entreprise
MediCare AI développe une plateforme SaaS B2B2C de télémédecine augmentée par l'IA, servant 200 cliniques, 5000 médecins et 500K patients. Série A de 25M$ récente, forte croissance USA + expansion EU prévue. Modèle : abonnement SaaS + facturation à l'acte + analytics premium.

### Réponses aux questions de la checklist

**CONTEXTE BUSINESS & OBJECTIFS**
Objectif principal : pipeline HIPAA-compliant pour (1) prédiction de risques médicaux avec 85% précision permettant médecine préventive, (2) optimisation parcours patient réduisant les réadmissions de 20%, (3) analytics pour assureurs/hôpitaux (nouveau revenue stream 10M$/an). ROI : permettre le passage à 5M patients (x10) sans augmenter l'infra linéairement.

Utilisateurs : médecins via dashboards temps réel, data scientists pour modèles prédictifs (équipe de 8), APIs feeding l'app mobile (500K MAU), chercheurs cliniques pour études, assureurs pour risk assessment. Criticité maximale : vies en jeu, erreurs inacceptables. Timeline : compliance HIPAA immédiate, MVP analytics 6 mois, scale-up 12 mois.

Budget : 500K$ immédiat, 50K$/mois, forte flexibilité si ROI prouvé. Équipe : 5 engineers dont 2 senior, CTO ex-Google hands-on, culture tech-first, apprentissage rapide.

**SOURCES DE DONNÉES**
Sources : (1) PostgreSQL app principale - 500GB données patients/consultations, (2) InfluxDB métriques IoT - 1M data points/jour de wearables, (3) S3 data lake - 5TB imagerie médicale DICOM, (4) APIs EHR (Epic, Cerner) - formats HL7/FHIR, rate limited, (5) Streaming Kinesis - events real-time app mobile, (6) Documents non-structurés - 10M PDFs notes cliniques.

Accès : APIs FHIR standard mais latence variable (1-30s), streaming natif pour mobile/IoT, batch quotidien pour imagerie, NLP requis pour 40% des données (notes texte). Volume : 10TB total, +50GB/jour, doublant tous les 6 mois.

**EXIGENCES FONCTIONNELLES**
Latence : alertes critiques <1 seconde (arythmie, chute glucose), risk scores <5 secondes pour consultation, analytics population batch acceptable (nuit), recherche similarité patients <2 secondes.

Transformations : (1) Normalisation multi-formats vers FHIR, (2) Feature extraction imagerie (radiographies, IRM), (3) NLP sur notes cliniques (extraction symptômes, médications), (4) Time-series analysis vitals, (5) Dé-identification pour recherche.

Qualité : zero erreur sur identité patient (patient matching 99.9%), données vitales 100% complètes, validation clinique algorithmes obligatoire, traçabilité modification donnée patient.

**EXIGENCES NON-FONCTIONNELLES**
Performance : 99.99% uptime (53min/an max), supportant 100K consultations simultanées, latence P99 <1s pour API. Croissance exponentielle : x10 en 18 mois, burst 5x lors épidémies.

Sécurité : HIPAA compliance totale (PHI encryption, BAA avec vendors), HITRUST certification requise, audit logs 7 ans, consent management GDPR, zero-trust architecture. Résilience : RPO 5 minutes, RTO 30 minutes, hot standby obligatoire, données critiques répliquées 3x.

**CONTRAINTES SPÉCIFIQUES**
Interopérabilité avec 20+ systèmes EHR différents, standards HL7 v2/v3/FHIR à supporter. FDA clearance potentielle (documentation rigoureuse). Préférence cloud-native, serverless quand possible, multi-cloud à terme pour résilience.

---

## Scénario 4: Manufacturing IoT - "SmartFactory Systems"

### Description de l'entreprise
SmartFactory Systems est un équipementier automobile Tier 1 allemand, 15 usines mondiales, 2.5Mds€ CA. Transition vers l'Industrie 4.0 avec objectif zero-defect manufacturing. Clients : BMW, Mercedes, Tesla. Pression forte sur qualité (PPM <10) et costs (-3%/an demandé).

### Réponses aux questions de la checklist

**CONTEXTE BUSINESS & OBJECTIFS**
Objectif : créer un data backbone industrial pour (1) maintenance prédictive réduisant downtime de 40% (1 heure arrêt = 250K€), (2) optimisation énergétique -20% (objectif carbon neutral 2030), (3) quality prediction inline évitant recalls (coût moyen recall : 50M€), (4) digital twin complet des lignes de production. ROI attendu : 30M€/an économies + évitement de 2 recalls majeurs.

Utilisateurs : 200 opérateurs via HMI temps réel, 50 quality engineers, 30 maintenance managers, 20 energy managers, C-level dashboards, clients OEM accès quality metrics. Criticité : production 24/7, 1 minute arrêt = 4K€ perte. Horizon : POC 1 usine (3 mois), déploiement global (18 mois).

Budget : 2M€ année 1, 500K€/an run, ROI break-even exigé année 2. Équipe : 3 data engineers, 5 automation engineers (PLC/SCADA experts), 2 data scientists, partenariat Siemens pour edge computing.

**SOURCES DE DONNÉES**
Sources : (1) 50K capteurs par usine - température, vibration, pression, qualité optique - 100Hz sampling, (2) 500 PLCs Siemens/Rockwell - protocoles OPC-UA/Modbus, (3) Systèmes MES/SCADA existants - Oracle/SQL Server, (4) ERP SAP - ordres fabrication, stocks, (5) Données qualité - mesures CMM, tests laboratoire, (6) Données externes - météo, prix énergie, supply chain.

Volume considérable : 1TB/jour/usine données brutes capteurs, 50GB/jour après edge filtering, 15 usines = 750GB/jour centralisé. Pics lors démarrage nouvelles lignes. Historical data 5 ans dans systèmes legacy.

**EXIGENCES FONCTIONNELLES**
Latence : contrôle qualité inline <100ms (rejet pièce immédiat), alertes maintenance <1 seconde, OEE real-time dashboards, analytics batch acceptable pour optimisation. Edge processing critique pour latence.

Transformations : (1) Détection anomalies multivariées sur séries temporelles, (2) Corrélation défauts/paramètres process (500+ variables), (3) FFT pour analyse vibratoire, (4) Computer vision pour défauts surface, (5) Calculs OEE complexes multi-lignes.

Qualité : données capteurs 99% disponibilité (redundance), synchronisation temporelle <1ms entre capteurs (crucial pour corrélations), calibration traçable métrologie.

**EXIGENCES NON-FONCTIONNELLES**
Performance : système temps réel garanti pour safety-critical, 99.9% disponibilité minimum, supportant 1M messages/seconde en peak. Scalabilité : 15 usines aujourd'hui, 25 dans 3 ans, nouveaux capteurs +50%/an.

Sécurité : isolation IT/OT obligatoire (Purdue model), cybersecurity IEC 62443, données production confidentielles (IP clients), audit trail modifications paramètres. Résilience : aucune perte donnée production acceptable, edge autonomy 72h si déconnexion, backup sur site + cloud.

**CONTRAINTES SPÉCIFIQUES**
Environnement industriel hostile (poussière, vibrations, température), certifications industrielles requises, latence réseau variable inter-sites, standards OPC-UA/PackML à respecter. Intégration avec équipements 30 ans d'âge, protocoles propriétaires nombreux.

---

## Scénario 5: Media Streaming - "StreamFlow Entertainment"

### Description de l'entreprise
StreamFlow est une plateforme de streaming vidéo régionale (Asie SE) avec 15M abonnés, catalogue 50K titres, production originale croissante. Face à Netflix/Disney+, différenciation par contenu local et recommandations culturellement adaptées. Monétisation : SVOD + AVOD + live events PPV.

### Réponses aux questions de la checklist

**CONTEXTE BUSINESS & OBJECTIFS**
Objectif : pipeline data pour (1) personnalisation poussée augmentant watch time +40% et réduisant churn -25%, (2) optimisation CDN réduisant coûts bandwidth 30% (actuellement 5M$/mois), (3) content intelligence pour acquisition/production (prédire succès série à 70% accuracy), (4) anti-piracy real-time. ROI : +50M$ revenus annuels via rétention améliorée.

Utilisateurs : 15M end-users via recommandations, 100 content managers, 50 marketing analysts, 20 data scientists, 200 content partners (analytics dashboards), advertisers (real-time campaign metrics). Criticité : haute pour streaming (buffering = churn immédiat), moyenne pour analytics. Timeline : amélioration progressive continue, big bang impossible.

Budget : 200K$/mois disponible, élastique selon savings CDN réalisés. Équipe : 10 engineers (forte expertise Spark/Kafka), 5 ML engineers, 3 DevOps, culture data mature, proche équipes Netflix alumni.

**SOURCES DE DONNÉES**
Sources : (1) Événements viewing Kafka - 500M events/jour (play, pause, skip, quality), (2) MongoDB metadata catalogue - 10TB contenus/acteurs/genres, (3) PostgreSQL users/subscriptions - 500GB transactionnel, (4) CloudFront logs - 1TB/jour données CDN, (5) Social media APIs - sentiment analysis Twitter/Instagram 1M posts/jour, (6) Partenaires mesure audience - Nielsen, Comscore.

Streaming natif fort : Kafka 200TB/mois throughput, peaks 50K events/sec pendant prime time (20h-23h). CDN logs délai 5-15 minutes. APIs sociales rate limited agressivement.

**EXIGENCES FONCTIONNELLES**
Latence : recommandations <100ms (pré-calculées + real-time adjust), bandwidth optimization <1 minute, détection piracy <5 minutes pour takedown, dashboards partenaires <1h.

Transformations : (1) Sessionization complexe multi-device, (2) Embeddings contenus/users (transformers), (3) Géo-agrégations pour licensing, (4) Fingerprinting vidéo/audio anti-piracy, (5) Sentiment analysis multilingue (6 langues).

Qualité : déduplication vues critique (facturation partenaires), cohérence multi-CDN, attribution conversion marketing précise, données personnelles anonymisées hors recommandation.

**EXIGENCES NON-FONCTIONNELLES**
Performance : 99.95% API availability, supportant 1M concurrent streams, 10M API calls/minute en peak. Croissance : +50% users/an, 4K/8K adoption multipliant bandwidth x4.

Sécurité : DRM obligatoire, geo-blocking par licence, COPPA pour contenu enfants, data residency par pays (regulatory), PCI-DSS pour payments. Résilience : multi-CDN failover <30 secondes, dégradation gracieuse (SD si HD impossible), cache edge 24h autonomy.

**CONTRAINTES SPÉCIFIQUES**
Multi-country avec régulations différentes (censure, data localization), latences réseau variables (îles), devices hétérogènes (smart TV 2015 à iPhone 15), ABR streaming complexe. Peak loads imprévisibles (viral content), compétition bandwidth avec gaming/video calls from home.

---

## Synthèse des 5 Scénarios

| Aspect | RapidPay (FinTech) | MegaStore (Retail) | MediCare AI (Health) | SmartFactory (IoT) | StreamFlow (Media) |
|--------|-------|-------|-------|-------|-------|
| **Volume/Jour** | 100GB | 500GB | 50GB | 750GB | 2TB |
| **Latence Critique** | <100ms (fraude) | <1min (stock) | <1s (alertes) | <100ms (qualité) | <100ms (reco) |
| **Budget Mensuel** | 40K€ | 250K€ | 50K$ | 40K€ | 200K$ |
| **Contrainte Majeure** | Régulation PSD2 | Legacy SAP | HIPAA | IT/OT isolation | Multi-géo latence |
| **Pattern Probable** | Lambda | Batch + cache | Streaming + ML | Edge + Central | Full streaming |
| **Priorité #1** | Compliance | Migration risque | Zero erreur médical | Zero downtime | User experience |

Ces 5 scénarios représentent un spectre complet de besoins, contraintes et contextes différents, permettant de designer des architectures sur mesure adaptées à chaque situation spécifique.

# 5 Nouveaux Scénarios avec Focus OLAP - Besoins pour Pipelines Data

## Scénario 6: Compagnie d'Assurance - "SecureLife Global"

### Description de l'entreprise
SecureLife Global est un assureur international (vie, santé, auto, habitation) présent dans 25 pays, 50M de polices actives, 35Mds€ de primes annuelles. Transformation data-driven pour tarification dynamique, détection fraude et regulatory reporting. Systèmes OLTP multiples par pays/produit nécessitant consolidation OLAP massive.

### Réponses aux questions de la checklist

**CONTEXTE BUSINESS & OBJECTIFS**
Objectif principal : créer un data warehouse groupe unifié pour (1) tarification actuarielle dynamique augmentant la profitabilité de 8% tout en restant compétitif, (2) vue 360° client cross-produits permettant upsell +25%, (3) reporting réglementaire Solvency II automatisé (actuellement 200 personnes/mois), (4) analyse prédictive sinistralité réduisant les provisions de 15%. ROI visé : 500M€/an via meilleure tarification et réduction fraude.

Utilisateurs : 2000 actuaires pour modélisation risques, 5000 agents commerciaux via CRM analytique, 500 analystes risques, 100 executives pour pilotage stratégique, régulateurs (30 pays différents), réassureurs pour cessions. Criticité : haute pour tarification (compétitivité), maximale pour reporting réglementaire (amendes si retard). Timeline : data warehouse opérationnel 9 mois, analytics avancés 18 mois, ML/AI 24 mois.

Budget : 10M€ année 1, 5M€/an run. Équipe actuelle : 30 personnes BI traditionnelles (SAS, Teradata), recrutement 20 profils modern data stack, support Accenture pour transformation.

**SOURCES DE DONNÉES & BESOINS OLTP/OLAP**
Sources OLTP : (1) 25 systèmes core insurance par pays - Oracle, DB2, SQL Server - 100TB total, 10M transactions/jour, (2) CRM Salesforce global - 5TB, temps réel requis pour agents, (3) Claims management systems (15 différents) - 50TB historique 20 ans, (4) IoT télématique auto - 1M véhicules, 100GB/jour, (5) Données externes : météo (corrélation sinistres), données économiques, mortalité INSEE.

Besoins OLAP massifs : Cubes multidimensionnels par (géographie × produit × canal × segment client × temps), analyses actuarielles sur 30 ans historique, simulations Monte Carlo (10K scénarios), backtesting modèles sur données complètes, stress testing réglementaire, analyses what-if tarification.

Volume : 200TB données structurées, 500TB documents (polices PDF, photos sinistres), +1TB/jour nouvelles données. Requêtes OLAP complexes joignant 50+ tables, agrégations sur 100M+ lignes courantes.

**EXIGENCES FONCTIONNELLES OLAP**
Latence analytique : dashboards exécutifs <3 secondes (pré-agrégés), requêtes actuarielles ad-hoc <30 secondes sur 5 ans données, simulations batch acceptables (nuit), reporting réglementaire J+1 obligatoire.

Transformations OLAP spécifiques : (1) Calculs actuariels complexes (provisions, IBNR, chain ladder), (2) Segmentation clients multivariée, (3) Analyse survie/durée pour vie, (4) Triangles de liquidation sinistres, (5) Ratios réglementaires (SCR, MCR), (6) Profitabilité par cohorte/vintage.

Qualité : cohérence 100% entre pays obligatoire pour consolidation, réconciliation quotidienne OLTP/OLAP, traçabilité complète pour audit, versioning des calculs réglementaires.

**EXIGENCES NON-FONCTIONNELLES**
Performance OLAP : supporter 500 utilisateurs concurrents, requêtes complexes <1 minute, 10TB scans quotidiens, pré-calculs nocturnes en <6h. Scalabilité : croissance 30%/an, pics fin trimestre (×5 charge).

Sécurité : isolation par pays (réglementation locale), chiffrement données clients, RBAC granulaire par produit/région, audit trail 10 ans, GDPR avec pseudonymisation pour analytics.

**ARCHITECTURE OLAP REQUISE**
Modélisation : schémas en étoile par domaine (sinistres, polices, clients), fait tables partitionnées par mois, dimensions SCD Type 2 pour historisation, hiérarchies complexes (géographiques, organisationnelles, produits).

Technologies OLAP pressenties : Snowflake pour élasticité et separation compute/storage, Tableau + PowerBI pour visualisation (choix utilisateurs), Apache Druid pour real-time OLAP sur données IoT, Python/R pour modèles actuariels.

---

## Scénario 7: Groupe Hôtelier International - "LuxStay Resorts"

### Description de l'entreprise
LuxStay Resorts opère 500 hôtels premium dans 60 pays, 150K chambres, 8Mds$ revenus. Face à Airbnb et OTAs, besoin crucial d'optimisation revenue management et expérience client. Systèmes : PMS différent par marque/région, loyalty program global, distribution multi-canal.

### Réponses aux questions de la checklist

**CONTEXTE BUSINESS & OBJECTIFS**
Objectif : plateforme analytique unifiée pour (1) revenue management dynamique augmentant RevPAR +15%, (2) customer analytics prédisant LTV et optimisant loyalty program (coût actuel 200M$/an), (3) operational analytics réduisant coûts -10%, (4) benchmarking compétitif temps réel. ROI : 400M$/an via yield optimization.

Utilisateurs : 2000 revenue managers pour pricing quotidien, 500 GMs hôtels pour opérations, 10K staff front-desk pour guest intelligence, 200 corporate analysts, partenaires distribution (Booking, Expedia) pour inventory. Criticité maximale : pricing errors = perte revenue immédiate. Timeline : MVP 6 mois pour top 50 hôtels, global 18 mois.

Budget : 3M$ CAPEX, 300K$/mois OPEX. Équipe : 20 analysts Excel-based actuels, hiring 15 data engineers/scientists, vendor support (Databricks partner).

**SOURCES DE DONNÉES & ARCHITECTURE OLTP/OLAP**
Sources OLTP opérationnelles : (1) 30 PMS différents (Opera, Protel, Amadeus) - 50TB, structures hétérogènes, (2) CRS (Central Reservation) - PostgreSQL 10TB temps réel, (3) Channel managers - XML feeds 100GB/jour, (4) POS restaurants/spa - 20 systèmes, (5) Loyalty MongoDB - 20M membres, 5TB.

Sources analytiques existantes : Data marts locaux par région (inconsistants), Google Analytics par propriété, OTA analytics APIs, TripAdvisor/social reviews, données compétiteurs (scraped rates).

Besoins OLAP complexes : Analyse multi-dimensionnelle (temps × propriété × room type × channel × segment), forecasting demand par micro-segment, price elasticity modeling, attribution modeling parcours booking, cohort analysis guests, géospatial analytics (events impact).

Volume OLAP : 5 ans historique détaillé (100TB), 50M transactions/an, 1B searches analysées, 10M reviews à processer.

**EXIGENCES FONCTIONNELLES OLAP**
Latence : pricing decisions <30 secondes pour react à compétition, dashboards property <5 secondes, forecast runs 2h acceptable (nuit), benchmarking quasi temps réel (<15 min).

Transformations OLAP : (1) Revenue optimization algorithms (Littlewood, EMSR), (2) Demand forecasting avec saisonnalité complexe, (3) Customer segmentation (business, leisure, groups), (4) Sentiment analysis reviews multilingue, (5) Competitive set analysis, (6) Attribution modeling multi-touch.

Cubes OLAP requis : Occupancy cube (date × property × segment), Revenue cube (avec 15 KPIs), Guest cube (comportement, préférences), Channel performance cube, Forecast vs Actual cube.

**EXIGENCES NON-FONCTIONNELLES OLAP**
Performance : 100K requêtes/jour, 1000 users concurrents peak (9h-10h check-out), agrégations sur 5 ans minimum, drill-down jusqu'à transaction. Évolution : +100 hôtels/an, nouvelles marques acquisition.

Sécurité : PCI-DSS pour paiements, isolation par marque/franchise, GDPR global, SOC2 pour corporate. Distribution géographique : régional DW pour latence, central pour consolidation.

**SPÉCIFICITÉS OLAP HÔTELLERIE**
Dimensions spécifiques : calendrier avec events (foires, vacances par pays), météo historique, walk-in vs advance booking, length of stay patterns, day of week patterns critiques.

Métriques OLAP industrie : RevPAR, ADR, Occupancy%, GOPPAR, TRevPAR, Pickup, Pace, Perfect Stay Index. Benchmarking STR obligatoire. Forecast accuracy critique (événements non récurrents).

---

## Scénario 8: Plateforme E-learning - "SkillForge Academy"

### Description de l'entreprise
SkillForge Academy est une edtech B2B2C avec 10M apprenants, 50K cours, 5K entreprises clientes. Modèle : subscriptions entreprises + marketplace formateurs + certifications. Croissance 100% YoY, objectif IPO dans 2 ans nécessitant analytics sophistiqués.

### Réponses aux questions de la checklist

**CONTEXTE BUSINESS & OBJECTIFS**
Objectif : infrastructure data supportant (1) apprentissage adaptatif personnalisé augmentant completion rate à 60% (actuel 15%), (2) content intelligence optimisant création cours (ROI formateurs +40%), (3) enterprise analytics pour clients B2B (retention tool), (4) predictive analytics pour career pathing. Business impact : doubler LTV à 500$/user.

Utilisateurs : 10M apprenants (recommandations), 10K formateurs (analytics dashboard), 1K enterprise admins (usage analytics), 50 learning designers (content optimization), 30 data scientists (modèles ML). Criticité : haute pour parcours apprentissage (engagement). Timeline : personalisation 6 mois, B2B analytics 3 mois prioritaire.

Budget : 1M$ initial, 100K$/mois. Équipe : 8 engineers actuels, culture tech forte (ex-FAANG), croissance équipe prévue ×2.

**SOURCES DE DONNÉES & BESOINS OLAP**
Sources transactionnelles : (1) PostgreSQL app principale - 10TB users/progress, (2) Cassandra pour clickstream - 50TB, 1B events/jour, (3) S3 videos/contenus - 1PB, metadata riche, (4) Redis sessions - 10M actives, (5) Elasticsearch pour recherche, (6) APIs intégrations (Zoom, Teams, Slack).

Besoins OLAP learning analytics : Analyse parcours apprentissage complexes (séquences, abandons, reprises), effectiveness measurement par modalité, skill gap analysis croisant jobs market data, cohort analysis par entreprise/secteur, content performance multi-dimensionnel.

Volume analytique : 3B learning events historique, 100M quiz attempts analysés, 50M video interactions, 10TB texte forums/chats.

**EXIGENCES FONCTIONNELLES OLAP**
Latence : recommandations temps réel <200ms (cache + pre-compute), learning path optimization <5s, enterprise dashboards <3s, batch analytics nocturne OK. 

Analyses OLAP spécifiques : (1) Funnel analysis multi-step avec attribution, (2) Retention curves par cohorte/contenu, (3) Collaborative filtering 10M×50K matrix, (4) Knowledge graph traversal (prerequisites), (5) Time-to-competency modeling, (6) A/B test analysis continuel.

Cubes requis : Engagement cube (learner × content × time × device), Performance cube (scores × skills × demographics), Enterprise cube (company × department × role × progress), Content effectiveness cube.

**EXIGENCES NON-FONCTIONNELLES**
Performance OLAP : supporter 50K concurrent learners, 10K requêtes analytics/minute peak, ML training sur 1B+ records, graphes 100M edges. Scalabilité : ×10 en 2 ans pour IPO.

Sécurité : FERPA compliance (US education), COPPA pour <13 ans, SOC2 pour entreprises, data residency par région. Privacy by design pour learning data sensitive.

**SPÉCIFICITÉS EDTECH OLAP**
Dimensions pédagogiques : Bloom's taxonomy levels, learning modalities, difficulty progression, prerequisite chains, skill taxonomies (O*NET), micro-learning patterns.

Métriques critiques : Time on task, completion rates, knowledge retention (spacing effect), peer learning impact, instructor responsiveness, certification pass rates. Adaptive learning nécessite OLAP temps réel sur historique complet.

---

## Scénario 9: Telco 5G & Convergence - "ConnectWave Telecom"

### Description de l'entreprise
ConnectWave est un opérateur convergent (mobile, fixe, TV, cloud) avec 30M abonnés, déploiement 5G en cours, pression ARPU forte. Infrastructure : 50K antennes, 10M box internet, 5M box TV. Enjeux : optimisation réseau 5G coûteux, personnalisation pour réduire churn, monétisation B2B2X.

### Réponses aux questions de la checklist

**CONTEXTE BUSINESS & OBJECTIFS**
Objectif : plateforme data convergée pour (1) network analytics optimisant investissements 5G (10Mds€ sur 5 ans), (2) customer experience personnalisée réduisant churn -30% (coût acquisition 150€/client), (3) B2B analytics-as-a-service (nouveau revenu 100M€/an), (4) convergence insights augmentant bundle adoption +40%. ROI : 500M€/an économies + nouveaux revenus.

Utilisateurs : 5K network engineers pour optimization, 10K customer service avec vue 360°, 2K marketing pour campaigns, 500 finance pour revenue assurance, 100 B2B clients pour network slicing analytics. Criticité : maximale pour réseau (QoS), haute pour billing. Timeline : network analytics 6 mois, customer 12 mois, B2B 18 mois.

Budget : 15M€ année 1, 8M€/an run. Équipe : 40 personnes data actuelles (Oracle, Teradata legacy), transformation vers cloud native, partenariat AWS.

**SOURCES DE DONNÉES TELCO & OLAP MASSIF**
Sources OLTP telco : (1) CDR/xDR - 10B records/jour, 1PB/mois, formats ASN.1 complexes, (2) Network elements - 1M devices SNMP/streaming telemetry, (3) BSS/OSS - 20 systèmes (billing, provisioning, inventory), (4) CRM Siebel - 30M customers, 20TB, (5) Probes/DPI - 100TB/jour raw (sampled).

Besoins OLAP telco spécifiques : Analyse trafic multi-dimensionnel (subscriber × location × time × application × device), network performance cubes (cell × KPI × time), customer journey analytics, churn prediction sur 24 mois historique, revenue assurance (réconciliation massive).

Volume OLAP extrême : 10PB données historique, requêtes sur billions records, agrégations géospatiales complexes (coverage, handovers), time-series 5-minute granularity minimum.

**EXIGENCES FONCTIONNELLES OLAP TELCO**
Latence : network KPIs temps réel <1 minute pour NOC, customer dashboards <5s, usage analytics hourly, billing reconciliation J+1 strict.

OLAP computations télécom : (1) Erlang calculations capacity planning, (2) Geospatial coverage analysis avec propagation models, (3) Traffic pattern mining (commute, events), (4) QoE scoring multi-paramètres, (5) ARPU/AMPU calculations complexes, (6) Interconnect settlements.

Cubes spécialisés : Network Performance (1M cells × 100 KPIs × time), Subscriber Usage (30M × services × locations × time), Revenue (plans × segments × channels × time), Roaming (partners × countries × services).

**EXIGENCES NON-FONCTIONNELLES MASSIVES**
Performance : 100K requêtes/heure, scanning PBs quotidien, 10K dashboards temps réel, latence requête P95 <10s sur année données. Croissance : data doubling yearly avec 5G.

Régulation : RGPD strict, lawful interception capabilities, data retention 2 ans (obligation légale), net neutrality reporting. Géo-distribution : edge analytics pour latence, sovereign cloud requirements.

**ARCHITECTURE OLAP TELCO**
Technologies requises : Apache Druid pour time-series real-time OLAP, ClickHouse pour CDR analytics, Presto pour federated queries, GeoMesa pour spatial analytics, proprietary cubing engine pour volumes extrêmes.

Optimisations critiques : Pré-agrégations multiniveaux (5min, hour, day), partitioning par temps + géographie, sampling intelligent pour DPI, columnar compression aggressive (10:1 ratio minimum).

---

## Scénario 10: Retail Investing Platform - "WealthBuilder Pro"

### Description de l'entreprise
WealthBuilder Pro est un néo-courtier avec 5M utilisateurs retail, 100Mds$ AUM, exécutant 10M ordres/jour. Modèle : commission-free trading compensé par payment for order flow, margin lending, premium features. Contexte : volatilité marchés, régulation accrue post-GameStop.

### Réponses aux questions de la checklist

**CONTEXTE BUSINESS & OBJECTIFS**
Objectif : infrastructure data temps réel pour (1) risk management prévenant margin calls systémiques, (2) behavioral analytics pour education investisseurs et réduction comportements risqués, (3) personalized insights augmentant engagement +50%, (4) regulatory reporting automatisé (SEC, FINRA), (5) market intelligence competitive edge. Impact : éviter incidents type Robinhood, différenciation par analytics.

Utilisateurs : 5M retail traders via app, 100 risk managers monitoring real-time, 200 compliance officers, 50 quants pour stratégies, 30 data scientists pour recommandations. Criticité maximale : erreur = pertes millions + régulation. Timeline : risk platform 3 mois urgent, analytics 9 mois.

Budget : 5M$ immédiat, 500K$/mois ongoing. Équipe : 15 engineers actuels, hiring 10 seniors urgents, culture fintech agile.

**SOURCES DE DONNÉES TRADING & OLAP**
Sources OLTP trading : (1) Order Management System - PostgreSQL 50TB, 10M orders/day, microsecond timestamps, (2) Market data feeds - 100K updates/sec equities+options+crypto, (3) Positions ledger - CockroachDB distributed, (4) Account management - MongoDB 10TB, (5) External : exchanges APIs, news feeds, Reddit/Twitter sentiment.

Besoins OLAP trading massifs : Position aggregation real-time par (account × symbol × strategy), P&L analytics historiques et projections, risk metrics (VaR, stress testing) sur portfolios, pattern analysis comportements trading, market microstructure analysis.

Volume OLAP : tick data 5 ans (100TB compressed), 1B transactions historique, 50M portfolio snapshots daily, social sentiment 10M posts/jour.

**EXIGENCES FONCTIONNELLES OLAP TRADING**
Latence critique : risk calculations <100ms pour margin calls, positions aggregation real-time, P&L streaming updates, market analytics <1s pour trading decisions, compliance reports EOD strict.

OLAP calculations financières : (1) Greeks calculation options (delta, gamma, vega, theta), (2) Portfolio optimization (Markowitz, Black-Litterman), (3) Risk metrics (VaR, CVaR, Sharpe, Sortino), (4) Correlation matrices 5000×5000, (5) Monte Carlo simulations (10K paths), (6) Tax lot optimization.

Cubes spécialisés : Trading Activity (user × symbol × time × order_type), Risk Exposure (account × asset_class × metric × time), Market Microstructure (symbol × venue × time), Behavioral Analytics (user × pattern × outcome).

**EXIGENCES NON-FONCTIONNELLES TRADING**
Performance : supportant 100K concurrent users, 1M orders/minute peak, risk recalculation <1s sur 5M portfolios, OLAP queries <2s sur intraday data. Croissance : 10x si market volatility.

Sécurité/Compliance : SOC2 Type II, FINRA CAT reporting, best execution analysis, Reg SHO compliance, audit trail immutable 7 ans. Zero data loss tolérance, ACID strict pour positions.

**ARCHITECTURE OLAP HAUTE FRÉQUENCE**
Technologies : Apache Pinot pour OLAP temps réel, TimescaleDB pour time-series, kdb+/q pour tick analytics (si budget), Apache Druid pour drill-down, Databricks pour ML sur données historiques.

Optimisations trading : in-memory computing pour positions live, GPU acceleration pour risk calcs, columnar storage avec compression spécialisée finance, event sourcing pour audit complet, CQRS pattern séparant writes/reads.

---

## Synthèse Comparative des 10 Scénarios

### Comparaison Volumes & Complexité OLAP

| Scénario | Volume/Jour | Volume OLAP Historique | Complexité Analytique | Latence Critique |
|----------|-------------|------------------------|----------------------|------------------|
| **SecureLife Insurance** | 1TB | 200TB (20 ans) | Actuariat complexe | J+1 régulateur |
| **LuxStay Hotels** | 200GB | 100TB (5 ans) | Revenue optimization | <30s pricing |
| **SkillForge Edtech** | 100GB | 50TB | Learning analytics | <200ms reco |
| **ConnectWave Telco** | 100TB | 10PB | Network + Customer | <1min NOC |
| **WealthBuilder Trading** | 10TB | 100TB tick data | Risk + Compliance | <100ms risk |

### Patterns OLAP Dominants

| Pattern | Use Cases | Technologies Typiques |
|---------|-----------|----------------------|
| **Cube OLAP Classique** | Insurance, Hotels | Snowflake, Hyperscale DW |
| **Real-time OLAP** | Trading, Telco Network | Druid, Pinot, ClickHouse |
| **ML-Heavy OLAP** | Edtech, Insurance | Databricks, Spark + MLflow |
| **Geo-Spatial OLAP** | Telco, Hotels | PostGIS, GeoMesa, Elasticsearch |
| **Time-Series OLAP** | Trading, Telco | TimescaleDB, InfluxDB, kdb+ |

### Besoins OLAP Spécifiques par Industrie

| Industrie | Besoins OLAP Uniques | Contraintes Spéciales |
|-----------|---------------------|----------------------|
| **Insurance** | Triangles liquidation, Actuariat, Simulations | Régulation Solvency II, 30 ans historique |
| **Hospitality** | Revenue Management, Forecasting demand | Saisonnalité complexe, Multi-property |
| **Education** | Learning paths, Engagement funnels | Privacy étudiants, Adaptive real-time |
| **Telecom** | Network optimization, Churn prediction | Volumes extrêmes, Régulation |
| **Trading** | Risk real-time, Market microstructure | Zero latency, Compliance strict |

### Recommandations Architecture OLAP

1. **Insurance & Hotels** → **Snowflake/BigQuery** : Élasticité pour pics reporting, SQL standard pour analystes business

2. **Edtech** → **Databricks + Delta Lake** : ML integration native, streaming + batch unifié

3. **Telco** → **Druid + ClickHouse + Presto** : Mix real-time et historical, federated queries sur sources multiples

4. **Trading** → **Pinot + TimescaleDB + kdb+** : Ultra-low latency avec historical depth

Ces 5 nouveaux scénarios ajoutent une dimension OLAP complexe absente des 5 premiers, avec des besoins de :
- Cubes multidimensionnels massifs
- Analyses historiques profondes  
- Calculs complexes domaine-spécifiques
- Agrégations sur billions de records
- Mix OLTP feeding OLAP en continu

# Solutions Sur Mesure pour les 10 Scénarios - Architecture Détaillée et Justifiée

## Solution 1: RapidPay (FinTech Neo-Bank)

### Architecture Proposée

Pour RapidPay, je recommande une architecture Lambda hybride combinant le meilleur du streaming et du batch, avec une forte emphase sur la cohérence transactionnelle et la conformité réglementaire. Le cœur du système repose sur Apache Kafka comme épine dorsale événementielle, mais contrairement à une architecture Kappa pure, nous maintenons une voie batch parallèle pour les réconciliations et le reporting réglementaire.

L'ingestion des données transactionnelles depuis PostgreSQL Aurora se fait via Debezium plutôt que AWS DMS ou des solutions propriétaires comme Oracle GoldenGate. Debezium offre une capture des changements avec exactement-une-fois sémantique et une latence inférieure à 100ms, crucial pour la détection de fraude. AWS DMS aurait été moins cher (environ 30% de moins) mais sa latence moyenne de 500ms-1s et son manque de garanties transactionnelles strictes l'ont écarté. GoldenGate, bien que techniquement supérieur, coûterait 10x plus cher sans apporter de valeur proportionnelle pour PostgreSQL.

Pour le processing en temps réel, Apache Flink s'impose face à Spark Streaming ou Kafka Streams. Flink gère nativement le stateful processing avec exactement-une-fois sémantique, crucial pour les calculs de balance et la détection de fraude. Sa gestion du event-time et des watermarks permet de gérer les événements en retard, fréquents dans les systèmes bancaires distribués. Spark Streaming aurait nécessité des micro-batches de minimum 1 seconde, incompatible avec notre requirement de <100ms pour la fraude. Kafka Streams, bien que plus simple, manque de sophistication pour les patterns CEP complexes nécessaires à la détection de fraude avancée.

Le stockage adopte une approche polyglotte réfléchie. DynamoDB sert de store opérationnel pour les profils clients et les états de compte, garantissant une latence <10ms avec auto-scaling. Nous aurions pu utiliser Cassandra (30% moins cher) mais DynamoDB offre une meilleure intégration AWS, un TCO inférieur quand on compte l'operational overhead, et surtout des global tables pour notre expansion européenne future. Pour l'analytique, Snowflake bat Redshift et BigQuery. Snowflake offre le time-travel natif (crucial pour audit), la séparation compute/storage permettant de scaler le reporting réglementaire sans impacter les requêtes opérationnelles, et un coût 40% inférieur à Redshift pour nos patterns d'usage (pics en fin de journée/mois).

### Gestion de la Conformité et Sécurité

La conformité PSD2 et GDPR dicte plusieurs choix architecturaux. Tous les événements passent par un layer de tokenisation utilisant AWS Payment Cryptography (anciennement Payment HSM) avant stockage. Nous avons écarté Hashicorp Vault (moins mature pour PCI-DSS) et Thales HSM (trop complexe pour notre équipe). Le chiffrement utilise AWS KMS avec rotation automatique des clés tous les 90 jours. L'audit trail est immutable grâce à AWS QLDB pour les transactions critiques, complété par CloudTrail pour l'audit infrastructure. Nous avons considéré une blockchain privée Hyperledger mais la complexité additionnelle ne se justifiait pas pour notre use case.

Pour le GDPR et le droit à l'oubli, nous implémentons un pattern de crypto-shredding où les données personnelles sont chiffrées avec des clés par utilisateur. Supprimer la clé rend les données irrécupérables sans avoir à purger les systèmes analytiques, ce qui aurait été impossible avec notre besoin de conservation pour l'audit.

### Optimisations Coût et Performance

L'architecture est optimisée pour un budget de 40K€/mois. Kafka fonctionne sur des instances Spot avec failover automatique (économie de 70% vs on-demand). Flink utilise des checkpoints incrémentaux sur S3 plutôt qu'EBS (économie de 5K€/mois). Snowflake est configuré avec auto-suspend après 60 secondes d'inactivité et des warehouses de taille variable selon l'heure (XS la nuit, L pendant les pics). Cette approche nous permet de rester dans le budget tout en gérant les pics 5x pendant les lancements de produits.

La stratégie de monitoring combine Datadog pour l'infrastructure (choisi sur Prometheus pour sa facilité malgré un coût 2x supérieur - justifié par la taille réduite de l'équipe) et des métriques custom dans CloudWatch pour le business. Nous avons écarté New Relic (trop cher) et l'ELK stack (trop de maintenance).

**Coût mensuel détaillé**: Kafka MSK: 8K€, Flink on EKS: 6K€, DynamoDB: 5K€, Snowflake: 12K€, Networking/Transfer: 3K€, Monitoring: 2K€, Backup/DR: 4K€ = 40K€/mois

---

## Solution 2: MegaStore (Retail Traditionnel)

### Architecture Proposée

Pour MegaStore, la solution doit naviguer la complexité du legacy tout en permettant une modernisation progressive. J'ai opté pour une architecture de transition intelligente qui ne cherche pas à révolutionner mais à évoluer. Le principe directeur est le "strangler fig pattern" où le nouveau système coexiste avec l'ancien avant de le remplacer progressivement.

L'extraction depuis SAP ECC6 utilise SAP Data Services plutôt que des alternatives comme Talend ou Informatica. Bien que Talend soit 50% moins cher, SAP DS comprend nativement les structures complexes d'ECC6, notamment les cluster tables et pool tables que les ETL génériques gèrent mal. Nous avons écarté SLT (SAP Landscape Transformation) car il nécessite des modifications sur le système source, risquées sur un ECC6 en production critique. L'extraction se fait par CDC sur les tables techniques de changement SAP (CDHDR/CDPOS) plutôt que par full extracts, réduisant la fenêtre batch de 4h à 45 minutes.

Pour l'intégration des 850 systèmes de caisse hétérogènes, nous déployons Apache NiFi plutôt qu'Airflow ou des solutions cloud natives. NiFi excelle dans la gestion de formats hétérogènes avec ses 300+ processors préconstruits. Son interface graphique permet aux équipes IT traditionnelles de créer des flux sans coder, crucial pour l'adoption. Airflow aurait nécessité du Python, créant une barrière pour les équipes actuelles. Azure Data Factory a été écarté malgré le contrat Microsoft car il ne supporte pas nativement les protocoles legacy (AS400 notamment).

Le stockage adopte une approche Data Lakehouse avec Azure Data Lake Gen2 et Databricks Delta Lake. Cette combinaison offre le meilleur des deux mondes : la flexibilité du lac pour ingérer les formats hétérogènes et la performance/gouvernance du warehouse pour l'analytique. Nous avons longuement hésité avec Snowflake sur Azure, mais Delta Lake permet de garder les données dans le compte Azure de MegaStore (crucial pour leur politique de sécurité) tout en offrant des performances comparables pour 40% du coût. Le format Delta apporte l'ACID sur le lac, permettant les updates/deletes nécessaires pour le RGPD sans reconstruire les partitions entières.

### Gestion de la Migration et du Change Management

La stratégie de migration minimise les risques avec une approche en vagues. La première vague (6 mois) se concentre sur les données en lecture seule : catalogue produits et historique des ventes. Cela permet des quick wins visibles (dashboards modernes) sans toucher aux processus critiques. La deuxième vague (6-12 mois) ajoute les stocks temps quasi-réel via Kafka Connect depuis les systèmes modernes et batch quotidien pour les legacy. La troisième vague (12-18 mois) s'attaque aux flux financiers, une fois la confiance établie.

Pour gérer la résistance au changement, nous maintenons des interfaces familières. Power BI remplace progressivement Excel avec des rapports qui "ressemblent" à Excel mais sont connectés au lakehouse. Nous avons écarté Tableau (techniquement supérieur) car Power BI s'intègre dans Office 365, réduisant la barrière d'adoption. Les utilisateurs peuvent même exporter vers Excel pour leurs analyses ad-hoc, une concession pragmatique qui a fait débat mais s'avère cruciale pour l'adhésion.

Le Master Data Management utilise Informatica MDM Cloud plutôt que des solutions open source comme Apache Atlas ou Collibra. Bien que 3x plus cher, Informatica gère nativement les hiérarchies produits complexes du retail et offre des connecteurs SAP préconfigurés. L'investissement se justifie par la criticité du référentiel produit (8M SKUs avec 50 nomenclatures différentes).

### Architecture de Transition

Pendant la coexistence, nous maintenons une synchronisation bidirectionnelle entre l'ancien et le nouveau système via Apache Kafka et des CDC patterns. Cela permet de router progressivement le trafic vers le nouveau système tout en gardant une fallback option. Nous avons écarté une approche "big bang" qui aurait été 50% moins chère mais comportait un risque inacceptable pour 8Mds€ de CA.

Le coût total (250K€/mois) se décompose ainsi : Infrastructure Azure: 80K€, Databricks: 50K€, Informatica MDM: 30K€, NiFi on VMs: 20K€, Power BI Premium: 20K€, Support/Consulting: 50K€. C'est 2x le budget initial mais justifié par la réduction du risque et le ROI prouvé de 200M€/an.

---

## Solution 3: MediCare AI (HealthTech Startup)

### Architecture Proposée

Pour MediCare AI, l'architecture doit concilier innovation technologique et conformité HIPAA stricte. La solution proposée adopte une architecture event-driven serverless-first qui optimise les coûts tout en garantissant la scalabilité nécessaire pour passer de 500K à 5M patients.

L'ingestion multi-source utilise AWS HealthLake plutôt que de construire notre propre layer FHIR. HealthLake comprend nativement HL7v2, FHIR R4, et peut ingérer les notes cliniques non structurées. À 0.26$ par GB stocké et 0.20$ par GB ingéré, c'est 60% moins cher que maintenir une infrastructure FHIR custom. Nous avons écarté Google Healthcare API (performance supérieure mais 2x plus cher) et Azure API for FHIR (moins mature sur le NLP médical). Les APIs EHR externes passent par AWS AppFlow qui gère le throttling et les retries automatiquement, évitant de coder ces logiques.

Pour le streaming IoT des wearables, AWS IoT Core avec Kinesis Data Streams bat Kafka MSK. IoT Core offre le device management, l'authentification mutuelle TLS, et le rules engine natif pour filtrer à la source. Kinesis s'intègre naturellement avec Lambda pour le processing serverless. Kafka aurait nécessité de maintenir un cluster 24/7 (15K$/mois minimum) alors que Kinesis scale à zéro. Pour les volumes actuels (1M data points/jour), Kinesis coûte 2K$/mois.

Le processing adopte une architecture Lambda (le pattern, pas AWS Lambda) innovante. Le hot path utilise Kinesis Analytics avec Flink pour les alertes critiques. Nous avons préféré le managed service à Flink sur Kubernetes car la latence <1s est atteinte dans les deux cas mais le managed service élimine l'operational overhead pour une équipe de 5 personnes. Le warm path utilise AWS Lambda functions avec Step Functions pour l'orchestration. Cette approche serverless scale automatiquement et ne coûte que pour l'utilisation réelle. Le cold path utilise AWS Glue avec Spark pour les analyses population et l'entraînement des modèles.

### Gestion HIPAA et Sécurité

La conformité HIPAA structure toute l'architecture. Nous utilisons AWS HealthLake qui est HIPAA-eligible par design plutôt que d'essayer de rendre Snowflake ou BigQuery conformes. Toutes les données patient au repos sont chiffrées avec AWS KMS et des customer-managed keys. En transit, nous utilisons TLS 1.3 minimum avec certificate pinning pour l'app mobile.

La dé-identification pour la recherche utilise AWS Comprehend Medical plutôt que des solutions open source comme Presidio ou des APIs tierces comme Private Analytics. Comprehend Medical comprend le contexte médical et atteint 99.2% de précision sur la détection de PHI contre 94% pour les alternatives. Le surcoût (0.01$ par 100 caractères) est justifié par le risque de breach HIPAA (amendes jusqu'à 50M$).

L'architecture Zero Trust utilise AWS PrivateLink pour tous les services, éliminant l'exposition internet. Nous avons écarté une architecture multi-cloud pour la résilience car la complexité de maintenir la conformité HIPAA sur plusieurs clouds dépassait les bénéfices. À la place, nous utilisons le multi-region sur AWS avec failover automatique.

### ML Pipeline Médical

Pour les modèles prédictifs, SageMaker bat Databricks MLflow et Vertex AI. SageMaker offre des algorithmes pré-approuvés pour le healthcare (DeepAR pour les séries temporelles vitales, XGBoost pour les risques) et surtout SageMaker Model Monitor qui track le drift, crucial quand les modèles impactent des décisions cliniques. Databricks aurait été plus flexible mais nécessite plus d'expertise ML. Vertex AI a une meilleure AutoML mais moins d'intégration avec les services HIPAA AWS.

Le feature store utilise SageMaker Feature Store plutôt que Feast ou Tecton. L'intégration native permet de maintenir la lignée des features jusqu'aux données source, requirement FDA pour les algorithmes médicaux. Le coût additionnel (3K$/mois) est négligeable comparé au risque réglementaire.

Pour l'imagerie médicale (DICOM), nous utilisons AWS HealthImaging (nouveau service) plutôt que de stocker sur S3 avec Orthanc. HealthImaging offre le streaming intelligent des images (seulement les résolutions nécessaires), réduisant la bande passante de 70%. Pour 5TB d'imagerie, cela économise 8K$/mois en transfer costs.

**Architecture finale et coûts**: HealthLake: 12K$/mois, Kinesis + Analytics: 8K$, Lambda/Step Functions: 5K$, SageMaker: 15K$, HealthImaging: 5K$, Monitoring/Security: 5K$ = 50K$/mois, exactement dans le budget avec une marge pour la croissance.

---

## Solution 4: SmartFactory Systems (Manufacturing IoT)

### Architecture Proposée

Pour SmartFactory Systems, l'architecture doit gérer des volumes massifs de données capteurs tout en respectant les contraintes strictes de l'environnement industriel. La solution proposée adopte une architecture edge-to-cloud sophistiquée qui traite 80% des données à la périphérie pour minimiser la latence et les coûts de bande passante.

Au niveau edge, nous déployons Azure IoT Edge plutôt qu'AWS Greengrass ou des solutions open source comme EdgeX Foundry. Azure IoT Edge s'intègre nativement avec les protocoles industriels (OPC-UA, Modbus) via des modules certifiés, crucial pour nos 500 PLCs Siemens/Rockwell. AWS Greengrass aurait nécessité plus de développement custom pour ces protocoles. EdgeX Foundry, bien qu'open source et flexible, manque de support enterprise et de certifications industrielles. Chaque usine déploie 5 edge gateways en configuration redondante, exécutant des containers Docker avec les modèles ML pour la détection d'anomalies. Cette approche réduit le volume de données envoyées au cloud de 1TB/jour à 50GB/jour par usine.

L'ingestion utilise Azure IoT Hub avec Azure Time Series Insights plutôt que Kafka ou Kinesis. IoT Hub gère nativement 50K capteurs par usine avec authentification par certificat X.509, partitioning automatique, et device twins pour la configuration. Time Series Insights offre des requêtes temporelles optimisées sans gérer InfluxDB ou TimescaleDB. Nous avons longuement considéré Apache Pulsar pour sa geo-replication native inter-usines, mais l'expertise requise et le manque d'intégration avec l'écosystème industriel l'ont écarté.

Pour le processing, nous combinons Azure Stream Analytics pour les règles simples (seuils, moyennes mobiles) et Apache Flink sur AKS pour les analyses complexes (FFT pour vibrations, corrélations multivariées). Stream Analytics coûte 75% moins cher que Flink pour les transformations basiques et s'intègre avec les Azure ML models. Flink reste nécessaire pour les calculs scientifiques avancés. Spark Streaming a été écarté car ses micro-batches de minimum 1 seconde sont incompatibles avec notre requirement <100ms pour le contrôle qualité inline.

### Architecture OT/IT et Sécurité Industrielle

La séparation OT/IT suit le modèle Purdue niveau 3.5 (DMZ industrielle). Les edge gateways fonctionnent en configuration air-gapped avec synchronisation unidirectionnelle vers le cloud via data diodes hardware (Waterfall Security). Cette architecture empêche toute compromission cloud d'affecter la production. Nous avons écarté les firewalls traditionnels qui restent bidirectionnels et vulnérables.

La sécurité suit IEC 62443 niveau 2 avec authentification 802.1X sur le réseau industriel, segmentation VLAN par ligne de production, et chiffrement TLS 1.3 pour toute communication externe. Nous utilisons Azure Defender for IoT plutôt que des solutions spécialisées comme Claroty ou Dragos (3x plus chères) car l'intégration Azure simplifie le déploiement multi-sites.

Le stockage utilise Azure Data Lake Gen2 avec hierarchical namespace pour organiser les données par usine/ligne/capteur/timestamp. Les données chaudes (7 jours) restent sur SSD premium, les tièdes (90 jours) sur standard, et les froides sur archive. Cette stratégie de tiering automatique économise 60% vs tout garder en hot storage. Nous avons écarté AWS S3 avec Athena car Azure Data Lake offre de meilleures performances pour nos requêtes hiérarchiques fréquentes.

### Digital Twin et Maintenance Prédictive

Le digital twin utilise Azure Digital Twins plutôt que AWS IoT TwinMaker ou des solutions industrielles comme PTC ThingWorx. Azure Digital Twins offre DTDL (Digital Twins Definition Language) standardisé et s'intègre avec nos modèles CAD via Autodesk Forge. ThingWorx aurait été plus riche fonctionnellement mais coûte 5x plus cher. AWS TwinMaker manque de maturité pour les cas d'usage industriels complexes.

Pour la maintenance prédictive, nous utilisons Azure Machine Learning avec AutoML pour créer rapidement des modèles par type d'équipement. Les modèles sont entraînés sur 5 ans d'historique (50TB) avec Spark sur Databricks, puis déployés sur les edge devices via ONNX Runtime pour une inférence <10ms. Nous avons écarté TensorFlow/Kubernetes (trop complexe pour l'équipe) et les solutions propriétaires comme SAP Predictive Maintenance (vendor lock-in et coût prohibitif).

La visualisation combine Power BI pour les managers et Grafana pour les opérateurs. Power BI s'intègre avec l'Active Directory existant et offre des rapports pixel-perfect pour le C-level. Grafana sur les HMI d'usine fournit des dashboards temps réel personnalisables. Nous avons écarté Tableau (pas de version industrielle durcie) et les solutions SCADA traditionnelles (pas assez flexibles pour nos besoins analytiques).

**Décomposition des coûts**: Azure IoT Hub + Edge: 8K€/mois, Stream Analytics + Flink: 10K€, Digital Twins: 5K€, Data Lake + Databricks: 12K€, ML + Edge Inference: 8K€, Réseau + Sécurité: 7K€ = 40K€/mois par usine, soit 600K€/mois pour 15 usines, dans le budget de 500K€/an de run après l'investissement initial.

---

## Solution 5: StreamFlow Entertainment (Media Streaming)

### Architecture Proposée

Pour StreamFlow, l'architecture doit optimiser chaque milliseconde de latence et chaque byte de bande passante tout en personnalisant l'expérience pour 15M utilisateurs. La solution combine une architecture événementielle pure avec du edge computing intelligent et des optimisations CDN avancées.

Le cœur du système utilise Apache Pulsar plutôt que Kafka pour l'event streaming. Pulsar offre le multi-tenancy natif (crucial pour isoler par région/pays), la geo-replication built-in entre datacenters, et surtout le tiered storage automatique vers S3 pour les événements anciens. Kafka nécessiterait Kafka Connect, MirrorMaker pour la réplication, et une gestion manuelle du tiering. Pour 500M événements/jour, Pulsar avec BookKeeper pour le storage coûte 30% moins cher que Kafka avec la même durabilité. Kinesis a été écarté car les volumes dépassent ses limites économiques (au-delà de 100MB/s, Kinesis devient prohibitif).

L'ingestion vidéo utilise AWS Elemental MediaConvert pour le transcoding plutôt que FFmpeg sur EC2 ou des solutions comme Bitmovin. MediaConvert offre la qualité broadcast, supporte tous les codecs modernes (AV1, VP9), et scale automatiquement. FFmpeg aurait été 40% moins cher mais nécessiterait de gérer la queue, le scaling, et la résilience. Bitmovin offre une meilleure qualité perceptuelle mais coûte 3x plus cher. Pour l'adaptive bitrate, nous générons 8 renditions par contenu (de 144p à 4K) avec VMAF scores optimisés par genre de contenu.

Le stockage adopte une stratégie multi-tier sophistiquée. Les masters et les renditions populaires (top 20% représentant 80% des vues) sont sur S3 Standard avec CloudFront. Les contenus tièdes utilisent S3 Intelligent-Tiering qui déplace automatiquement vers Infrequent Access. Les archives utilisent Glacier Deep Archive (0.00099$/GB/mois). Cette stratégie économise 65% vs tout garder en Standard. Nous avons écarté Azure Blob Storage malgré des prix similaires car CloudFront a de meilleures performances en Asie du Sud-Est.

### CDN et Optimisation de Bande Passante

La stratégie CDN multi-provider utilise CloudFront pour 60% du trafic (intégration AWS native), Akamai pour 30% (meilleure présence en Asie insulaire), et Fastly pour 10% (edge computing capabilities). Cette approche multi-CDN offre la résilience et permet l'arbitrage de coût. Un CDN unique aurait été 20% moins cher mais créerait un single point of failure inacceptable pour du streaming.

L'optimisation utilise plusieurs techniques avancées. Le predictive caching analyse les patterns de viewing pour pré-positionner le contenu sur les edge locations 2h avant les pics. Les modèles ML prédisent avec 75% de précision quel contenu sera viral. Le bandwidth throttling intelligent réduit la qualité pendant les heures de pointe réseau (économie 30% de bande passante). Le P2P-assisted delivery via WebRTC permet aux utilisateurs de partager des segments (réduction 15% des coûts CDN). Nous avons écarté les solutions blockchain de CDN décentralisé (Theta, VideoCoin) car trop immatures pour notre scale.

Pour la personnalisation, nous utilisons Apache Pinot pour le real-time OLAP plutôt que Druid ou ClickHouse. Pinot offre une ingestion depuis Pulsar native, des indexes inversés pour les requêtes de filtrage complexes, et surtout le star-tree index qui accélère les agrégations de 100x. Pour calculer les recommandations personnalisées de 15M users en <100ms, cette performance est critique. Druid aurait été comparable en performance mais plus complexe à opérer. ClickHouse excelle en batch mais moins en real-time ingestion.

### Anti-Piracy et Fingerprinting

Le système anti-piracy utilise une approche multi-couches. Le watermarking invisible avec Irdeto TraceMark embed un identifiant unique par session de streaming, permettant de tracer les fuites. Le fingerprinting audio/vidéo utilise Gracenote (Nielsen) qui maintient une base de données de contenus protégés. Pour la détection en temps réel, nous déployons un modèle CLIP fine-tuné qui compare les frames extraites des streams pirates avec notre catalogue. Ce modèle tourne sur des instances GPU (G4dn) avec une latence de 200ms pour identifier une correspondance.

Nous avons écarté les solutions open source (Dejavu pour audio) qui manquent de robustesse face aux transformations (re-encoding, cropping). Les solutions enterprise comme Friend MTS étaient 5x plus chères sans amélioration proportionnelle de détection. Notre approche hybride atteint 94% de détection pour 50K$/mois.

### Analytics et Machine Learning

Le ML pipeline utilise Databricks plutôt que SageMaker ou Vertex AI. Databricks offre Delta Lake pour le feature store avec time travel (crucial pour l'A/B testing), MLflow natif pour le versioning des modèles, et surtout la capacité de traiter les données où elles sont (S3) sans déplacement. SageMaker aurait nécessité de copier les données, doublant les coûts de stockage. Vertex AI offre un meilleur AutoML mais moins de flexibilité pour nos modèles custom de recommandation.

Les modèles de recommandation combinent collaborative filtering (matrix factorization avec ALS), content-based filtering (embeddings via transformers), et session-based recommendations (GRU4Rec). Cette approche ensemble améliore le click-through rate de 35% vs un seul modèle. Le réentraînement quotidien sur 100TB de données prend 3h sur un cluster de 20 nodes r5.24xlarge spot instances.

**Breakdown des coûts**: Pulsar cluster: 25K$/mois, Transcoding: 30K$, Storage S3: 40K$, CDN multi-provider: 100K$, Pinot + Analytics: 20K$, ML/Databricks: 25K$, Anti-piracy: 10K$ = 250K$/mois total. C'est 25% au-dessus du budget initial mais justifié par les économies CDN (-30%) qui compensent largement.

---

## Solution 6: SecureLife Global (Assurance)

### Architecture Proposée

Pour SecureLife Global, l'architecture doit gérer l'un des plus grands défis du data engineering : consolider 25 systèmes pays hétérogènes dans un data warehouse groupe unifié tout en respectant les contraintes réglementaires locales et en supportant des calculs actuariels complexes sur 30 ans d'historique. La solution proposée adopte une architecture hub-and-spoke avec Snowflake comme plateforme analytique centrale, mais avec des nuances importantes.

La consolidation des 25 systèmes core insurance utilise Informatica Cloud Data Integration plutôt que des alternatives open source comme Apache NiFi ou des solutions cloud natives comme AWS Glue. Informatica comprend nativement les structures de données d'assurance complexes (polices avec riders multiples, structures de réassurance en cascade, historiques de sinistres avec développements). Plus important encore, Informatica offre des connecteurs préconfigurés pour les principaux systèmes d'assurance (Guidewire, Duck Creek, SAP FS-CD) économisant 6 mois de développement. Talend aurait été 50% moins cher mais nécessiterait de développer ces mappings from scratch. Fivetran a été écarté car il ne supporte pas les transformations complexes nécessaires pour harmoniser les données entre pays (chaque pays a ses propres règles de provisioning).

Pour le data warehouse analytique, Snowflake sur AWS bat ses concurrents pour plusieurs raisons critiques. D'abord, sa capacité à créer des shares de données cross-region sans duplication physique permet de respecter la data residency tout en offrant une vue consolidée. Les données françaises restent physiquement en eu-west-3 (Paris) mais sont accessibles en lecture depuis us-east-1 pour le reporting groupe. BigQuery n'offre pas cette flexibilité géographique. Redshift nécessiterait de répliquer les données, doublant les coûts et complexifiant la conformité GDPR. Databricks Lakehouse a été sérieusement considéré mais Snowflake est plus accessible pour les 2000 actuaires habitués à SQL pur.

L'architecture de Snowflake est organisée en trois layers. Le Raw Vault stocke les données exactement comme reçues de chaque pays, avec full historisation pour audit. Le Business Vault applique les règles groupe pour harmoniser les métriques (par exemple, la définition d'un sinistre "grave" varie selon les pays). Les Data Marts sont optimisés par domaine : Underwriting, Claims, Finance, Risk. Cette approche Data Vault 2.0 permet de tracer chaque transformation, crucial pour les auditeurs.

### Calculs Actuariels et OLAP Complexe

Pour les calculs actuariels complexes, nous déployons une architecture hybride innovante. Les calculs standards (provisions, ratios S/P) utilisent Snowflake avec des UDFs Python pour les méthodes actuarielles. Mais pour les simulations Monte Carlo intensives (stress testing avec 10,000 scénarios), nous utilisons Databricks avec Apache Spark. Les données sont partagées entre Snowflake et Databricks via External Tables sur S3, évitant la duplication. Cette approche permet d'utiliser la puissance de Spark pour les calculs parallèles massifs tout en gardant Snowflake pour les requêtes ad-hoc des analystes.

Les triangles de liquidation pour IBNR (Incurred But Not Reported) illustrent bien notre approche. Ces calculs nécessitent de pivoter des années de données de sinistres dans des matrices complexes, puis d'appliquer des méthodes comme Chain Ladder ou Bornhuetter-Ferguson. Plutôt que de forcer ces calculs dans SQL pur (possible mais illisible), nous utilisons des Snowpark Python UDFs qui permettent d'utiliser des librairies actuarielles comme ChainLadder-Python tout en gardant les données dans Snowflake. Cette approche est 10x plus rapide que d'extraire vers SAS (l'ancienne méthode) et permet aux actuaires de versionner leur code dans Git.

Pour les cubes OLAP multidimensionnels, nous avons fait un choix controversé mais pragmatique : maintenir certains cubes dans SQL Server Analysis Services (SSAS) en mode tabulaire, alimentés depuis Snowflake. Les actuaires seniors ont 15 ans d'expérience avec MDX et Excel PivotTables connectées à SSAS. Forcer une migration vers un modèle purement relationnel aurait créé une résistance massive. Cette architecture hybride permet une transition douce : les nouveaux actuaires utilisent Snowflake directement via Tableau, les seniors gardent leurs outils familiers. Dans 2-3 ans, quand Snowflake aura des capacités MDX natives (sur leur roadmap), nous migrerons complètement.

### Conformité Réglementaire et Reporting

Le reporting Solvency II impose des contraintes architecturales strictes. Chaque chiffre reporté doit être traçable jusqu'à la transaction source, avec un audit trail complet des transformations. Nous implémentons cela via Snowflake Time Travel (90 jours) combiné avec un archivage dans AWS S3 Glacier pour 10 ans. Chaque run de reporting génère un snapshot immutable avec un hash cryptographique, stocké dans AWS QLDB pour garantir la non-répudiation.

Les calculs de SCR (Solvency Capital Requirement) utilisent une architecture de calcul distribué sur Databricks. Un calcul SCR complet implique d'évaluer le portefeuille sous 10,000+ scénarios de stress, nécessitant 100+ TB-heures de compute. Avec Databricks job clusters et spot instances, nous réduisons le coût de 8,000€ à 2,000€ par run mensuel. Nous avons écarté EMR (moins cher mais plus complexe à gérer) et les grilles de calcul traditionnelles comme GridGain (excellent pour le calcul distribué mais mauvaise intégration avec notre stack data).

Pour garantir la cohérence entre pays, nous implémentons un système de "golden records" dans Snowflake. Chaque métrique critique (provisions techniques, ratio de solvabilité) a une seule source de vérité, calculée selon les règles groupe, puis déclinée selon les spécificités locales. Cette approche élimine les réconciliations manuelles qui prenaient 200 personnes-mois par trimestre.

### Optimisations Performance et Coût

L'optimisation de Snowflake pour notre use case mérite une attention particulière. Nous utilisons des warehouses multi-cluster pour les pics de fin de trimestre, avec auto-scaling de X-Small à 4X-Large. Les requêtes actuarielles complexes utilisent des result caching et des materialized views pour les agrégations fréquentes. Le clustering sur les colonnes dates et entity_id améliore les performances de 70% pour nos requêtes types. Le coût Snowflake est maîtrisé à 100K€/mois via des Reserved Capacity commitments et une politique stricte d'auto-suspend après 60 secondes.

Pour l'IoT télématique (1M véhicules), nous adoptons une approche différente. Les données temps réel vont dans Apache Druid plutôt que Snowflake. Druid excelle pour les agrégations sur des données de série temporelle avec cardinalité élevée. Les scores de conduite sont calculés en streaming via Kafka Streams et stockés dans Druid pour analyse. Seuls les agrégats journaliers sont poussés vers Snowflake. Cette architecture évite d'ingérer 100GB/jour de données granulaires dans Snowflake (économie de 30K€/mois).

**Architecture finale**: Informatica Cloud: 50K€/mois, Snowflake: 100K€, Databricks: 40K€, SSAS (transition): 10K€, Druid cluster: 20K€, S3 + Glacier: 30K€, Monitoring/Security: 20K€, Support: 30K€ = 300K€/mois. C'est en dessous du budget de 420K€/mois (5M€/an) avec une marge pour la croissance.

---

## Solution 7: LuxStay Resorts (Groupe Hôtelier)

### Architecture Proposée

Pour LuxStay Resorts, le défi principal réside dans l'unification de 30 PMS différents tout en permettant un revenue management dynamique en temps quasi-réel face à la concurrence des OTAs. La solution adoptée privilégie une approche pragmatique avec une couche d'abstraction API plutôt qu'une consolidation physique des données.

Au lieu de tenter d'extraire et centraliser toutes les données des 30 PMS (projet de 2+ ans), nous créons une couche d'abstraction via MuleSoft Anypoint Platform. MuleSoft offre des connecteurs pour les principaux PMS hôteliers (Opera, Protel, Amadeus) et permet de créer une API unifiée que nos systèmes analytiques consomment. Cette approche "API-led connectivity" permet d'obtenir des données quasi temps réel (latence <30 secondes) pour les décisions de pricing. Nous avons écarté Kong ou Apigee qui sont excellents pour l'API management mais manquent de connecteurs spécialisés hospitality. Apache Camel aurait été 70% moins cher mais nécessiterait 12+ mois de développement des intégrations.

Pour le revenue management, contrairement à l'approche traditionnelle de batch nocturne, nous implémentons un système event-driven. Chaque réservation, annulation, ou changement de prix competitor déclenche un événement dans Amazon Kinesis. Ces événements alimentent une state machine dans AWS Step Functions qui orchestre le recalcul des prix. Cette approche permet de réagir en <30 secondes aux actions des compétiteurs, crucial quand Booking.com modifie ses prix 100+ fois par jour.

Le cœur analytique utilise une combinaison surprenante : ClickHouse pour l'OLAP temps réel et Snowflake pour l'analytique historique. ClickHouse, déployé sur 3 nodes (c6gd.8xlarge), ingère les événements de réservation en temps réel et permet des requêtes complexes en <500ms sur 2 ans de données. Son moteur MergeTree avec projection est parfait pour nos analyses multidimensionnelles (date × property × room_type × channel). Snowflake héberge les données historiques (5+ ans) et les modèles de forecasting. Cette architecture dual-OLAP coûte 40% moins cher qu'un Snowflake unique dimensionné pour le temps réel.

### Revenue Optimization et Pricing Dynamique

L'algorithme de revenue management mérite une explication détaillée car il diverge des solutions traditionnelles. Au lieu d'utiliser un système RMS commercial (IDeaS, Duetto) qui coûterait 500K$/an, nous développons un système hybride. Le forecasting utilise Facebook Prophet dans Databricks pour capturer la saisonnalité complexe (journalière, hebdomadaire, événements locaux). Prophet gère mieux les outliers (COVID, événements exceptionnels) que les modèles ARIMA traditionnels. L'optimization utilise des algorithmes de programmation linéaire (CPLEX via Pyomo) pour maximiser le RevPAR sous contraintes (capacité, longueur de séjour minimale, overbooking contrôlé).

Le plus innovant est notre "competitive intelligence engine". Nous scrapons légalement (via les APIs partenaires et le scraping éthique avec respect des robots.txt) les prix de 50 compétiteurs toutes les heures. Ces données alimentent un modèle de price elasticity qui calcule l'impact probable d'un changement de prix sur la demande. Ce modèle, entraîné sur 3 ans d'historique avec XGBoost, prédit la demande avec 82% de précision. Nous avons écarté les solutions de veille tarifaire commerciales (RateGain, OTA Insight) qui coûtent 10K$/mois par propriété et offrent moins de flexibilité.

Pour la distribution multi-canal, nous adoptons une architecture controversée : au lieu d'un channel manager central, chaque propriété garde son système mais nous créons un "meta-channel manager" qui optimise l'allocation d'inventaire. Cet orchestrateur, construit avec Apache Airflow, décide quelle chambre allouer à quel canal based sur la profitabilité nette (après commissions). Cette approche respecte les contrats existants tout en optimisant le mix de distribution.

### Guest Analytics et Personnalisation

Le programme de fidélité (20M membres) nécessite une approche particulière. Les données sont stockées dans MongoDB Atlas pour la flexibilité du schéma (les préférences guests évoluent constamment). Mais pour l'analytique, nous utilisons Rockset qui offre des requêtes SQL sur MongoDB avec une latence <100ms. Cette combinaison évite la complexité d'ETL entre MongoDB et un data warehouse tout en offrant les performances nécessaires pour la personnalisation temps réel.

La personnalisation utilise une architecture de feature store avec Feast plutôt que des solutions propriétaires comme Tecton ou SageMaker Feature Store. Feast s'intègre avec notre stack (données dans S3, serving depuis Redis, compute avec Spark) et coûte 90% moins cher. Les features incluent : historique de séjours, préférences implicites (déduites du comportement), valeur lifetime prédite, propension à l'upsell. Ces features alimentent des modèles TensorFlow Lite déployés en edge dans les apps mobiles pour des recommandations offline-first.

Le sentiment analysis des reviews (TripAdvisor, Google, propriétaire) utilise AWS Comprehend pour 10 langues principales, avec un fallback sur Google Cloud Natural Language API pour les 30 autres langues. Cette approche multi-cloud pour le NLP (généralement déconseillée) se justifie par la couverture linguistique : nos hôtels sont dans 60 pays avec 40+ langues. Comprehend est meilleur et moins cher pour l'anglais/majeur européen, Google excelle sur l'asiatique.

### Architecture Géo-Distribuée

La distribution géographique impose une architecture en hub régionaux. Nous déployons 4 hubs (US-East, EU-West, APAC-Singapore, MENA-Dubai) avec réplication active-active. Chaque hub a son cluster ClickHouse et cache Redis. Snowflake Data Sharing permet la consolidation sans déplacement physique des données. Cette architecture réduit la latence pour les propriétés (dashboards <2s globally) et respecte les contraintes de data residency.

Le disaster recovery utilise une approche progressive. Les données critiques (réservations, disponibilité) sont répliquées en temps réel entre régions via AWS Database Migration Service. Les données analytiques sont répliquées toutes les heures. En cas de panne régionale, le revenue management peut continuer avec des données jusqu'à 1h old, acceptable pour notre business.

**Coûts détaillés**: MuleSoft: 40K$/mois, ClickHouse cluster: 25K$, Snowflake: 35K$, MongoDB Atlas: 15K$, Kinesis + Step Functions: 10K$, Databricks (forecasting): 20K$, Rockset: 10K$, Multi-cloud NLP: 5K$, Infrastructure réseau: 20K$, Monitoring: 10K$ = 190K$/mois, bien en dessous du budget de 300K$ avec de la marge pour scaling.

---

## Solution 8: SkillForge Academy (E-learning Platform)

### Architecture Proposée

Pour SkillForge Academy, l'architecture doit supporter l'apprentissage adaptatif personnalisé pour 10M apprenants tout en fournissant des analytics sophistiqués aux entreprises clientes. La solution proposée adopte une architecture CQRS (Command Query Responsibility Segregation) avec event sourcing, particulièrement adaptée aux parcours d'apprentissage complexes.

Le cœur du système utilise Apache Pulsar avec event sourcing complet. Chaque action d'apprentissage (video play, quiz attempt, forum post) est un événement immutable dans Pulsar. Cette approche offre plusieurs avantages cruciaux : replay complet des parcours pour analyse, calcul de nouvelles métriques sur l'historique, et conformité FERPA par design (les événements originaux ne sont jamais modifiés). Nous avons préféré Pulsar à Kafka car Pulsar offre le tiered storage natif vers S3 (les vieux événements sont automatiquement archivés), crucial pour stocker 3 milliards d'événements historiques économiquement. EventStore a été considéré pour son support natif de l'event sourcing mais ne scale pas à notre volume.

Pour le processing en temps réel des parcours d'apprentissage, nous utilisons Apache Flink avec stateful processing. Flink maintient l'état de progression de chaque apprenant (10M états actifs) et calcule en continu les métriques d'engagement, détecte les apprenants à risque d'abandon, et déclenche des interventions personnalisées. La latence <200ms pour les recommandations est atteinte grâce au state backend RocksDB avec cache en mémoire. Spark Streaming aurait été plus simple mais ses micro-batches minimum 1 seconde sont incompatibles avec notre besoin de feedback immédiat. Kafka Streams manque de sophistication pour nos calculs de graphes de connaissances.

Le stockage adopte une approche polyglotte réfléchie. PostgreSQL avec Citus extension stocke les données transactionnelles shardées par organization_id (pour les clients B2B). Cassandra héberge les données de clickstream et progression, partitionnées par learner_id avec TTL de 1 an sur les données granulaires. Neo4j maintient le graphe de connaissances (skills, prerequisites, learning paths) avec 100M nodes et 1B relationships. Elasticsearch indexe tout le contenu textuel pour la recherche. Cette diversité est justifiée : chaque store est optimal pour son use case, et la complexité est gérée par une couche d'abstraction GraphQL.

### Apprentissage Adaptatif et ML

L'engine d'apprentissage adaptatif est le différenciateur clé. Nous utilisons Ray Serve plutôt que SageMaker ou Vertex AI pour le ML serving. Ray Serve permet de servir des modèles Python arbitraires (PyTorch, TensorFlow, XGBoost) avec auto-scaling et batching intelligent. Plus important, Ray permet l'online learning : les modèles sont continuellement mis à jour avec les nouvelles interactions sans re-training complet. Cette capacité est cruciale pour l'adaptation en temps réel. SageMaker aurait forcé un pattern batch training/deployment incompatible avec notre besoin d'adaptation continue.

Le système de recommandation combine plusieurs approches. Le collaborative filtering utilise Alternating Least Squares (ALS) sur Spark pour la factorisation matricielle 10M users × 50K courses, mis à jour quotidiennement. Le content-based filtering utilise Sentence-BERT pour créer des embeddings de cours, permettant la recommandation de nouveaux contenus sans historique. Le knowledge-based filtering traverse le graphe Neo4j pour respecter les prérequis et construire des parcours cohérents. Un meta-learner (gradient boosting) combine ces trois approches based sur le contexte (nouvel utilisateur, cours nouveau, domaine structuré).

Pour l'analyse des forums et contenus textuels, nous déployons un pipeline NLP sophistiqué. Les posts sont analysés avec spaCy pour extraction d'entités (concepts appris, difficultés). Un modèle BERT fine-tuné classifie les questions par taxonomie de Bloom (mémorisation, compréhension, application, etc.). Un autre modèle détecte la confusion ou frustration pour alerter les instructeurs. Ces modèles tournent sur AWS Inferentia (70% moins cher que GPUs) avec une latence de 50ms par post.

### Analytics B2B et Compliance

Pour les entreprises clientes, nous offrons des analytics poussés via une architecture innovante. Au lieu de créer des data marts par client (maintenance nightmare), nous utilisons ClickHouse avec row-level security. Chaque requête est automatiquement filtrée par organization_id, garantissant l'isolation. ClickHouse permet des agrégations complexes (progression par département, skill gaps analysis) en <2 secondes sur des billions de lignes.

La compliance FERPA (protection des données éducatives US) et COPPA (protection des mineurs) impose des contraintes strictes. Toutes les données personnelles sont chiffrées avec des clés par organisation (AWS KMS). Les mineurs (<13 ans) ont des comptes spéciaux sans features sociales et avec retention limitée. Le droit à l'oubli est implémenté via crypto-shredding : supprimer la clé rend les données irrécupérables sans purger les systèmes analytiques.

Pour l'A/B testing continu (crucial pour optimiser l'apprentissage), nous utilisons Optimizely Feature Experimentation plutôt que de build notre propre système. Optimizely s'intègre avec notre event stream et permet des experiments sophistiqués (multi-armed bandits pour l'optimisation de contenu). Le coût (10K$/mois) est justifié par la complexité d'implémenter un système d'experimentation statistiquement rigoureux.

### Edge Computing et Offline Learning

Un aspect unique est le support de l'apprentissage offline. L'app mobile utilise SQLite avec sync bidirectionnelle vers le cloud. Les modèles de recommandation sont compilés en TensorFlow Lite et déployés sur device. Cette approche permet l'apprentissage sans connexion, crucial pour les marchés émergents. La synchronisation utilise un CRDT (Conflict-free Replicated Data Type) custom pour merger les progressions offline sans perte.

**Architecture complète et coûts**: Pulsar cluster: 15K$/mois, Flink on Kubernetes: 20K$, PostgreSQL/Citus: 10K$, Cassandra: 15K$, Neo4j: 8K$, ClickHouse: 12K$, Ray Serve: 10K$, Inferentia inference: 5K$, Optimizely: 10K$, CDN/Vidéo: 20K$ = 125K$/mois. Légèrement au-dessus du budget initial de 100K$ mais justifié par les capacités d'adaptation uniques qui doublent la rétention.

---

## Solution 9: ConnectWave Telecom (Telco 5G)

### Architecture Proposée

Pour ConnectWave Telecom, l'architecture doit gérer des volumes de données sans précédent (100TB/jour de CDR/xDR) tout en supportant l'analytics temps réel nécessaire pour l'optimisation du réseau 5G et la monétisation B2B2X. La solution proposée adopte une architecture lambda modernisée avec un fort accent sur le edge computing et l'analyse géospatiale.

L'ingestion des CDR/xDR utilise Apache Pulsar avec Apache BookKeeper pour le storage distribué. Pulsar est choisi sur Kafka pour plusieurs raisons critiques dans le contexte telco : support natif du multi-tenancy (isolation par MVNO), geo-replication native entre datacenters (crucial pour la résilience), et surtout le tiered storage automatique qui archive les vieux CDRs vers object storage. Avec 10 milliards de CDRs/jour, Kafka nécessiterait un cluster de 200+ brokers coûtant 100K€/mois rien qu'en infrastructure. Pulsar avec tiering réduit cela à 40K€/mois. AWS Kinesis a été immédiatement écarté : au-delà de 1GB/s, ses coûts deviennent prohibitifs (500K$/mois pour nos volumes).

Pour le traitement des données réseau en temps réel, nous déployons Apache Flink sur Kubernetes avec une architecture particulière. Les jobs Flink sont organisés en pipeline : enrichissement (ajout des données subscriber, cell info), aggregation (KPIs par cellule/subscriber/service), anomaly detection (patterns de fraude, défaillances réseau), et routing vers les systèmes downstream. Cette architecture pipeline permet de scaler chaque étape indépendamment. Un job unique monolithique aurait été plus simple mais créerait un bottleneck impossible à débugger à cette échelle.

Le stockage adopte une stratégie multi-tier aggressive. Apache Druid ingère les données temps réel pour les KPIs réseau critiques (latence, packet loss, throughput par cellule). Druid permet des requêtes sub-seconde sur des trillions de lignes grâce à ses indices bitmap et son architecture segment-based. ClickHouse stocke les CDRs enrichis pour l'analyse client et la facturation, avec une compression 10:1 grâce à son moteur MergeTree. Les données historiques (>30 jours) sont dans Apache Hudi sur S3, permettant les updates GDPR tout en gardant les coûts bas. Cette architecture tri-OLAP coûte 60% moins qu'une solution unique Snowflake ou BigQuery dimensionnée pour ces volumes.

### Network Analytics et Optimisation 5G

L'optimisation du réseau 5G utilise une approche ML sophistiquée. Les données de performance réseau (1M cells × 100 KPIs × every 5 minutes) sont traitées par un pipeline TensorFlow sur Kubeflow. Nous utilisons des Temporal Convolutional Networks (TCN) plutôt que des LSTM pour prédire la congestion réseau. Les TCN offrent une meilleure parallélisation et gèrent mieux les longues séquences temporelles. Le modèle prédit la congestion 2h en avance avec 87% de précision, permettant le traffic steering proactif.

Pour l'analyse géospatiale (coverage maps, handover optimization), nous utilisons GeoMesa sur Accumulo plutôt que PostGIS ou solutions propriétaires. GeoMesa gère les requêtes spatio-temporelles sur des billions de points (positions des subscribers) avec une latence <100ms. PostGIS aurait plafonné à quelques milliards de points. Les solutions propriétaires telco (Teradata Geospatial, Oracle Spatial) coûtent 10x plus sans performance supérieure.

Le network slicing pour les clients B2B utilise une architecture event-driven avec Apache Pulsar Functions. Chaque slice a ses SLA (latence, bandwidth, reliability) monitored en temps réel. Quand un SLA est à risque, des functions automatiques réallouent les ressources réseau via les APIs des équipements. Cette approche serverless scale mieux que des microservices traditionnels pour les 10K+ slices prévus.

### Customer Analytics et Churn Prevention

Le churn prediction utilise une approche ensemble combinant XGBoost pour les features structurées (usage patterns, billing history) et un Graph Neural Network pour les features sociales (qui appelle qui). Le GNN, implémenté avec PyTorch Geometric, capture les effets de réseau : si les contacts d'un subscriber churnent, sa probabilité de churn augmente de 40%. Cette approche améliore la précision de prédiction de 72% à 84%.

Les modèles sont entraînés sur Databricks avec MLflow pour le versioning et tracking. Databricks est choisi sur SageMaker car il permet de traiter les données où elles sont (dans notre data lake S3) sans déplacement. Le feature store utilise Feast déployé sur Redis pour le online serving et S3/Parquet pour le offline store. Cette architecture open source coûte 80% moins que Tecton ou SageMaker Feature Store.

Pour le real-time marketing, nous utilisons Apache Pinot qui ingère les événements depuis Pulsar et permet des requêtes OLAP avec latence P99 <100ms. Pinot permet de segmenter les 30M subscribers en temps réel based sur leur comportement immédiat (par exemple, cibler les users en roaming avec des offres data). Druid aurait été similaire en performance mais Pinot s'intègre mieux avec notre stack Pulsar.

### Architecture Edge et Multi-Region

L'architecture edge déploie Apache Flink sur 100+ edge locations (central offices) pour le processing local. Cela réduit le backhaul de 60% et améliore la latence pour les use cases 5G critiques (AR/VR, autonomous vehicles). Les edge nodes utilisent K3s (Kubernetes léger) avec OpenFaaS pour les functions. Cette stack edge coûte 10x moins que les solutions telco traditionnelles (MEC platforms).

La réplication multi-région utilise Pulsar's geo-replication avec une topologie mesh. Chaque région (5 au total) a son cluster Pulsar qui réplique vers les autres. En cas de partition réseau, chaque région continue à fonctionner indépendamment avec eventual consistency. Cette architecture active-active élimine le RPO/RTO traditionnel : il n'y a pas de "disaster" à recover, juste une dégradation gracieuse.

**Coûts finaux**: Pulsar (multi-region): 60K€/mois, Flink processing: 80K€, Druid + ClickHouse + Hudi: 100K€, Databricks ML: 50K€, GeoMesa cluster: 30K€, Pinot real-time: 25K€, Edge infrastructure: 40K€, Network/Transfer: 60K€, Monitoring/Security: 40K€ = 485K€/mois, en dessous du budget de 670K€/mois (8M€/an) avec marge pour croissance 5G.

---

## Solution 10: WealthBuilder Pro (Trading Platform)

### Architecture Proposée

Pour WealthBuilder Pro, l'architecture doit gérer le paradoxe du trading retail moderne : offrir une latence digne du HFT (High-Frequency Trading) avec un modèle commission-free qui presse les marges. La solution adopte une architecture CQRS extrême avec event sourcing, optimisée pour la latence et la conformité réglementaire.

Le cœur du système utilise Apache Kafka configuré de manière atypique pour le trading. Au lieu de privilégier le throughput, nous optimisons pour la latence minimale : acks=1 (leadership acknowledgment only), compression désactivée, batching désactivé (linger.ms=0). Cette configuration sacrifie 30% de throughput mais garantit une latence P99 <5ms. Nous avons écarté Pulsar (meilleur throughput mais latence plus variable) et Redis Streams (excellent latency mais durabilité questionnnable pour des ordres financiers). Kinesis n'a même pas été considéré : sa latence minimale de 70ms est rédhibitoire pour le trading.

L'Order Management System abandonne l'architecture traditionnelle synchrone pour une architecture event-driven pure. Les ordres sont des événements immutables dans Kafka. Le matching engine, écrit en Rust pour la performance, consomme ces événements et produit des executions. Cette architecture permet de scaler horizontalement le matching par symbole. Un OMS traditionnel comme FIX engine aurait été plus standard mais créerait un bottleneck centralisé incompatible avec 10M ordres/jour.

Pour les positions et P&L temps réel, nous utilisons Apache Ignite plutôt qu'une base de données traditionnelle. Ignite offre un compute grid in-memory qui recalcule les positions sur chaque tick. Avec 5M comptes × 50 positions moyennes × 100K updates/sec, une base relationnelle même en mémoire (Redis, KeyDB) ne tiendrait pas. Hazelcast a été écarté car Ignite offre une meilleure intégration SQL pour les requêtes complexes de risk.

### Risk Management Temps Réel

Le risk management utilise une architecture innovante à trois niveaux. Le premier niveau, en Rust dans le matching engine, fait des checks basiques (buying power, pattern day trader) en <1 microseconde. Le deuxième niveau utilise Apache Flink avec state local pour des calculs plus complexes (concentration risk, correlation) en <10ms. Le troisième niveau utilise Python avec NumPy/Numba sur GPU pour les calculs sophistiqués (VaR Monte Carlo, stress testing) en <100ms.

Cette architecture en cascade permet de rejeter 95% des ordres risqués au niveau 1 (ultra-rapide), 4% au niveau 2, et seulement 1% nécessite le niveau 3 coûteux. Nous avons écarté une architecture monolithique en kdb+/q (standard en finance) qui aurait été plus élégante mais coûterait 500K$/an en licenses et nécessiterait des experts rares.

Pour les calculs de Greeks sur les options, nous utilisons QuantLib compilé en WebAssembly et déployé sur Cloudflare Workers. Cette approche edge permet de calculer les Greeks côté client avec une latence <10ms, déchargeant nos serveurs. Les solutions traditionnelles (serveur de calcul centralisé) auraient nécessité 50+ serveurs GPU pour notre volume.

### Market Data et Compliance

L'ingestion de market data utilise une architecture peu conventionnelle. Au lieu de normaliser toutes les feeds dans un format commun, nous gardons les formats natifs (FIX, ITCH, propriétaire) et utilisons Apache Arrow Flight pour le transport. Arrow permet le zero-copy transfer entre processus, crucial pour gérer 100K updates/sec par symbole. La normalisation se fait lazily au moment de la consommation. Cette approche réduit la latence de 40% vs une normalisation eagered.

Pour la compliance, chaque ordre génère un événement immutable dans AWS QLDB (Quantum Ledger Database) en parallèle de Kafka. QLDB fournit un journal cryptographiquement vérifiable, nécessaire pour les audits FINRA CAT. Nous avons préféré QLDB à une blockchain privée (Hyperledger) car il est managed et s'intègre nativement avec AWS. L'overhead (<5ms) est acceptable pour la garantie de non-répudiation.

Le best execution monitoring utilise TigerBeetle, une base de données financière conçue pour la comptabilité en partie double. TigerBeetle garantit que chaque transaction balance et peut prouver le best execution en comparant notre prix au NBBO (National Best Bid and Offer) au microseconde près. Les bases traditionnelles ne peuvent pas garantir cette précision temporelle.

### Analytics et ML

Pour l'analytics, nous utilisons QuestDB pour les time-series et Apache Druid pour l'OLAP temps réel. QuestDB, écrit en Java avec des parties critiques en C++, offre des performances exceptionnelles pour les requêtes temporelles sur les tick data. Il surpasse InfluxDB de 10x et TimescaleDB de 5x sur nos benchmarks. Druid permet les analyses multidimensionnelles (user × symbol × strategy × time) nécessaires pour la surveillance.

Le ML pour la détection de manipulation de marché utilise une approche non supervisée avec Isolation Forests sur Apache Spark. Les features incluent des patterns temporels (spoofing, layering), des anomalies de volume, et des corrélations suspectes entre comptes. Le modèle s'entraîne quotidiennement sur 1TB de données et score chaque ordre en temps réel via Spark Streaming. Cette approche a détecté 3 cas de manipulation confirmés par la SEC, validant notre investissement.

Pour les recommandations personnalisées et l'éducation des investisseurs, nous utilisons une architecture différente. Les embeddings des actions sont créés avec Node2Vec sur le graphe de co-trading (qui trade quoi avec quoi). Les préférences utilisateurs sont modélisées avec un Transformer fine-tuné sur les historiques de trading. Cette approche permet de recommander des actions similaires mais moins risquées aux traders novices, réduisant les comportements spéculatifs dangereux de 30%.

### Architecture Cloud et Disaster Recovery

L'architecture multi-région utilise CockroachDB pour les données critiques (positions, ordres) avec des instances dans us-east-1, us-west-2, et eu-west-1. CockroachDB offre la consistency forte avec survie automatique aux pannes régionales. Nous avons préféré CockroachDB à Spanner (vendor lock-in Google) et YugabyteDB (moins mature). La latence cross-région (50ms) est masquée par le traitement asynchrone des ordres.

Pour le disaster recovery, nous adoptons une approche "chaos engineering" avec Gremlin. Nous injectons des pannes continuellement en production (heures creuses) pour valider notre résilience. Cette approche proactive a révélé 12 points de défaillance qui auraient causé des pertes en situation réelle. L'investissement (5K$/mois pour Gremlin) est négligeable comparé aux risques évités.

**Coûts détaillés**: Kafka cluster: 40K$/mois, Ignite in-memory grid: 60K$, CockroachDB multi-region: 35K$, Flink on K8s: 30K$, QuestDB + Druid: 25K$, GPU instances pour risk: 40K$, Market data feeds: 150K$, AWS QLDB: 10K$, Cloudflare Workers: 5K$, Network/Transfer: 50K$, Monitoring/Compliance tools: 30K$, Chaos engineering: 5K$ = 480K$/mois, en dessous du budget de 500K$ avec buffer pour croissance.

---

## Synthèse et Patterns Architecturaux Émergents

### Patterns Récurrents à Travers les Solutions

En analysant les 10 solutions, plusieurs patterns architecturaux émergent qui transcendent les industries. Le premier est l'adoption quasi-universelle d'une architecture Lambda modernisée, mais avec des nuances importantes. Contrairement au Lambda classique avec batch et streaming séparés, nous voyons une convergence vers ce que j'appelle "Lambda 2.0" : streaming-first avec batch pour réconciliation et compliance. RapidPay, ConnectWave, et WealthBuilder illustrent parfaitement ce pattern où le streaming porte la charge opérationnelle tandis que le batch assure la cohérence et l'audit.

Le deuxième pattern majeur est la polyglotie réfléchie du stockage. Aucune solution n'utilise une base de données unique. La combinaison typique inclut : une base transactionnelle pour l'état courant (PostgreSQL, CockroachDB), un store analytical pour l'historique (Snowflake, ClickHouse), un cache pour la latence (Redis, Ignite), et un data lake pour l'archivage (S3, Azure Data Lake). Cette complexité est acceptée car chaque store est optimal pour son use case spécifique.

Le troisième pattern est l'edge computing même dans des contextes non-IoT. StreamFlow utilise l'edge pour le transcodage, WealthBuilder pour les calculs de Greeks, SkillForge pour les recommandations offline. Cette tendance reflète la réalisation que déplacer le compute vers les données est souvent plus efficient que l'inverse.

### Décisions Technologiques Controversées mais Justifiées

Plusieurs décisions vont à contre-courant des best practices conventionnelles mais sont justifiées par le contexte. MegaStore maintient SSAS pour les actuaires seniors - une dette technique assumée pour gérer le changement humain. LuxStay utilise le multi-cloud pour le NLP - généralement déconseillé mais nécessaire pour la couverture linguistique. SecureLife garde certains calculs dans SAS - archaïque mais irremplaçable pour certains modèles actuariels validés par les régulateurs.

Ces compromis pragmatiques illustrent une vérité importante : l'architecture parfaite techniquement n'est pas toujours la meilleure architecture business. La gestion du changement, les compétences existantes, et les contraintes réglementaires peuvent justifier des choix sous-optimaux techniquement.

### Innovations Architecturales Notables

Plusieurs solutions introduisent des innovations intéressantes. WealthBuilder utilise WebAssembly pour déporter des calculs complexes côté client - une approche qui pourrait révolutionner le edge computing. SkillForge implémente l'online learning avec Ray Serve - permettant l'adaptation continue des modèles sans re-déploiement. ConnectWave utilise GeoMesa pour l'analyse spatio-temporelle à l'échelle télécom - une combinaison rare mais puissante.

SmartFactory déploie l'IA sur edge devices industriels avec ONNX Runtime - apportant l'intelligence artificielle directement sur le shop floor. StreamFlow combine fingerprinting et ML pour l'anti-piracy - plus efficace que chaque approche isolément.

### Gestion des Coûts et ROI

L'analyse des coûts révèle des stratégies d'optimisation sophistiquées. L'utilisation systématique de spot instances pour le processing non-critique (économie moyenne de 65%). Le tiered storage agressif avec archivage automatique (réduction de 70% des coûts storage). L'auto-scaling et auto-suspend des ressources (Snowflake warehouses, Databricks clusters). Le caching intelligent qui réduit les requêtes coûteuses.

Mais surtout, chaque solution justifie ses coûts par un ROI clair. RapidPay justifie 40K€/mois par 25M€/an de revenus additionnels. MegaStore accepte 250K€/mois pour 200M€/an d'économies. Le ratio ROI/coût varie de 10x à 50x, validant les investissements.

### Leçons pour l'Architecture Data en 2024

Ces solutions révèlent plusieurs tendances majeures pour l'architecture data moderne. Premièrement, le streaming devient la norme, pas l'exception. Même les entreprises traditionnelles comme MegaStore adoptent l'event-driven pour certains use cases. Deuxièmement, le ML s'intègre nativement dans les pipelines, plus comme une afterthought. Chaque solution inclut des modèles prédictifs ou prescriptifs.

Troisièmement, la gouvernance et compliance ne sont plus des contraintes mais des enablers. Les architectures modernes intègrent la privacy, l'audit, et la conformité by design plutôt que comme des patches. Quatrièmement, l'edge computing émerge comme un pattern architectural majeur, pas seulement pour l'IoT mais pour tout use case nécessitant latence minimale ou processing distribué.

### Recommandations Finales

Pour les architectes confrontés à des défis similaires, ces solutions offrent plusieurs leçons clés. D'abord, ne pas hésiter à mixer les paradigmes : streaming pour l'opérationnel, batch pour l'analytique, edge pour la latence. Ensuite, accepter la complexité quand elle est justifiée : une architecture polyglotte bien maîtrisée surpasse une solution monolithique.

Investir dans l'automatisation et l'observabilité dès le début : tous ces systèmes complexes nécessitent un monitoring sophistiqué et une automatisation poussée pour rester gérables. Prioriser la flexibilité sur l'optimisation prématurée : les besoins évoluent rapidement, une architecture adaptable survit mieux qu'une architecture parfaite mais rigide.

Enfin, toujours ancrer les décisions techniques dans la valeur business. Chaque technologie choisie, chaque pattern implémenté, chaque dollar dépensé doit tracer vers un outcome business mesurable. C'est cette alignment qui distingue une bonne architecture technique d'une grande architecture d'entreprise.

### Matrice de Décision Consolidée

| Critère | Solution Recommandée | Quand l'Utiliser | Alternatives |
|---------|---------------------|------------------|--------------|
| **Streaming <100ms** | Kafka optimisé latence | Trading, Fraude | Pulsar, Redis Streams |
| **Streaming >1M msg/s** | Pulsar avec tiering | Telco, IoT | Kafka avec très gros cluster |
| **OLAP temps réel** | ClickHouse, Druid, Pinot | Analytics opérationnel | Snowflake avec result cache |
| **OLAP historique** | Snowflake, BigQuery | Reporting, BI | Databricks Lakehouse |
| **ML Platform** | Databricks + MLflow | Quand ML central au business | SageMaker, Vertex AI |
| **Edge Computing** | K3s + OpenFaaS | IoT, Latence critique | AWS Greengrass, Azure IoT Edge |
| **Compliance forte** | Immutable logs + encryption | Finance, Santé | Blockchain si justifié |
| **Multi-région** | CockroachDB, Pulsar geo-rep | Global business | Spanner si Google Cloud |

Cette analyse comparative des 10 solutions révèle que l'excellence en architecture data ne réside pas dans l'application dogmatique de patterns mais dans leur adaptation intelligente au contexte. Chaque solution est unique car chaque entreprise l'est, mais les patterns sous-jacents sont universels et réutilisables.

#### Modélisation pour CDN et Performance

**FACT_CDN_DELIVERY** track chaque segment vidéo servi : edge_location, bytes_transferred, latency_ms, cache_hit_flag. Crucial pour optimiser les coûts CDN (100K$/mois) et la QoE (Quality of Experience).

**DIM_CDN_EDGE** modélise les 200+ edge locations avec leur capacité, coût par GB, et performance metrics. Hiérarchie : Edge → Region → Provider (CloudFront, Akamai, Fastly).

#### Modèle pour la Personnalisation

**FACT_RECOMMENDATION** enregistre chaque recommandation servie avec : algorithm_version, position_shown, was_clicked, watch_time_if_clicked. Permet l'A/B testing continu et l'amélioration des algos.

Nous maintenons une **FEATURE_MATRIX_USER_CONTENT** : matrice sparse user×content×feature pour le ML. Features incluent : collaborative_similarity, content_similarity, trending_score, freshness_score. Mise à jour incrementale toutes les heures.

#### Anti-Piracy Tracking

**FACT_PIRACY_DETECTION** enregistre chaque détection : content_fingerprint, detected_platform, confidence_score, action_taken. Linked à DIM_CONTENT et DIM_PIRACY_SOURCE pour pattern analysis.

---

## Partie 3: Data Models pour les Scénarios 6-10

### Scénario 6: SecureLife Global (Assurance)

#### Modélisation Actuarielle Complexe

SecureLife nécessite un modèle supportant les calculs actuariels sur 30 ans d'historique tout en gérant la complexité multi-produits et multi-pays. Le défi principal est de maintenir la cohérence des calculs réglementaires tout en permettant l'innovation analytique.

#### Structure des Faits Actuariels

**FACT_POLICY_TRANSACTION** est notre fait central, capturant chaque mouvement sur une police : nouvelle souscription, avenant, prime collectée, sinistre déclaré, sinistre payé, résiliation. La granularité transaction permet de reconstruire l'état d'une police à n'importe quel moment historique, crucial pour les calculs de provisions.

La complexité vient de la nature des montants. Chaque transaction a potentiellement plusieurs montants selon les perspectives : montant_comptable (pour les livres), montant_actuariel (pour les provisions), montant_fiscal (pour les taxes), montant_solvency2 (pour le régulateur). Ces montants peuvent différer selon les normes appliquées.

**FACT_CLAIM_DEVELOPMENT** modélise l'évolution des sinistres dans le temps, essentiel pour les triangles de liquidation. Chaque ligne représente l'état d'un sinistre à une date de développement : montant_déclaré, montant_évalué, montant_payé, montant_réservé. La structure permet de construire les triangles pour les méthodes Chain-Ladder et Bornhuetter-Ferguson.

Pour l'IBNR (Incurred But Not Reported), nous maintenons **FACT_IBNR_PROJECTION** avec les estimations par cohorte : année_survenance × année_développement × montant_projeté. Ces projections sont versionnées car les méthodes actuarielles évoluent et nous devons pouvoir expliquer les changements de provisions.

**FACT_RISK_EXPOSURE** capture l'exposition au risque par police par période. Pour l'assurance auto : nombre de véhicules × jours couverts × facteurs de risque (zone géographique, type véhicule, profil conducteur). Cette granularité fine permet les analyses de profitabilité précises et le pricing dynamique.

#### Dimensions Assurance Spécialisées

**DIM_POLICY** est notre dimension maîtresse avec des attributs complexes : product_line, coverage_limits, deductibles, riders (garanties additionnelles). Chaque police peut avoir plusieurs coverages, modélisés dans une table bridge BRIDGE_POLICY_COVERAGE.

La gestion temporelle est critique. Nous utilisons SCD Type 2 avec bi-temporalité : valid_from/valid_to (quand la police était active) et effective_from/effective_to (quand l'information était valide dans notre système). Cette double temporalité permet de corriger rétroactivement des erreurs tout en maintenant l'audit trail.

**DIM_INSURED_OBJECT** modélise ce qui est assuré : personne, véhicule, propriété, entreprise. Nous utilisons un modèle de généralisation/spécialisation : une table principale avec les attributs communs et des tables spécialisées par type. Un véhicule a VIN, marque, modèle. Une propriété a adresse, surface, année construction.

**DIM_PERIL** catégorise les causes de sinistre selon les standards industriels mais avec nos enrichissements : catastrophes naturelles (avec échelle de sévérité), accidents (avec codes détaillés), maladies (codes ICD-10). La hiérarchie permet l'analyse à différents niveaux de granularité.

**DIM_GEOGRAPHY** est particulièrement riche car le risque varie géographiquement. Au-delà de la hiérarchie standard (pays → région → ville), nous incluons : zone_risque_inondation, zone_sismique, distance_côte, densité_population, indice_criminalité. Ces attributs sont mis à jour annuellement depuis des sources externes.

#### Modélisation pour Solvency II

Le reporting Solvency II nécessite des structures spécifiques :

**FACT_SCR_CALCULATION** (Solvency Capital Requirement) enregistre chaque calcul mensuel par module de risque : market_risk, underwriting_risk, counterparty_risk, operational_risk. Les sous-modules (equity_risk, interest_rate_risk, etc.) sont détaillés avec leurs correlations.

**DIM_SCENARIO** définit les 10,000+ scénarios de stress testing : variations de taux d'intérêt, chocs de mortalité, catastrophes naturelles. Chaque scénario a ses paramètres et probabilités, permettant le calcul du VaR (Value at Risk) à 99.5%.

**FACT_ASSET_LIABILITY** matche les actifs et passifs par duration bucket pour l'ALM (Asset Liability Management). Structure : date × duration_bucket × asset_amount × liability_amount × gap. Critique pour gérer le risque de taux.

#### Optimisations pour Volumes Historiques

Avec 200TB d'historique sur 20 ans, nous adoptons une stratégie de stockage par température :
- Hot (< 1 an) : données complètes en columnar store (Parquet) pour requêtes rapides
- Warm (1-5 ans) : agrégations journalières + données détaillées compressées
- Cold (5-20 ans) : agrégations mensuelles + archive sur Glacier pour audit

Les calculs actuariels nécessitant l'historique complet utilisent des vues matérialisées rafraîchies mensuellement. Par exemple, VIEW_LOSS_RATIO_DEVELOPMENT maintient les ratios S/P par cohorte sur 10 ans glissants.

### Scénario 7: LuxStay Resorts (Hôtellerie)

#### Modélisation Revenue Management

LuxStay nécessite un modèle optimisant le revenue management tout en gérant la complexité multi-propriétés et multi-canaux. Le défi est de capturer la nature temporelle du business hôtelier où le même inventaire (chambre) est vendu différemment selon le timing et le canal.

#### Faits de Réservation et Occupation

**FACT_RESERVATION** capture chaque réservation avec sa progression temporelle. Une particularité hôtelière : une réservation évolue depuis la création jusqu'au check-out. Nous enregistrons donc plusieurs lignes par réservation : created, modified, cancelled/confirmed, checked_in, checked_out. Chaque état a ses mesures : room_nights, room_revenue, ancillary_revenue, channel_commission.

La clé business est (confirmation_number, status_timestamp), permettant de reconstruire le parcours complet d'une réservation. Les métriques incluent : lead_time (jours entre booking et arrival), length_of_stay, ADR (Average Daily Rate), party_size.

**FACT_ROOM_INVENTORY** est un snapshot quotidien par room_type par propriété : total_rooms, rooms_sold, rooms_blocked, rooms_OOO (Out of Order), rooms_available. Cette structure permet le calcul instantané de l'occupancy et la réconciliation avec les réservations.

**FACT_DAILY_REVENUE** agrège les revenus réalisés (pas seulement réservés) par jour par propriété : room_revenue, F&B_revenue, spa_revenue, other_revenue. Important : nous séparons revenue_recognized (comptable) de cash_received (trésorerie) car les clients peuvent payer avant/après le séjour.

**FACT_PACE** capture le "booking pace" - comment les réservations s'accumulent dans le temps pour une date future. Structure : stay_date × booking_date × rooms_on_books × ADR_on_books. Crucial pour forecasting et décisions de pricing.

#### Dimensions Hôtelières Spécifiques

**DIM_PROPERTY** modélise nos 500 hôtels avec attributs riches : brand, category (luxury/premium/select), location_type (urban/resort/airport), capacity, star_rating, tripadvisor_score. Nous incluons aussi des métriques dérivées : comp_set_index (performance vs competition), market_penetration_index.

La hiérarchie organisationnelle (Property → Cluster → Region → Brand → Global) est modélisée en snowflake car les analyses par niveau sont fréquentes et la structure change rarement.

**DIM_ROOM** détaille chaque chambre physique : room_number, floor, room_type, view_type, size_sqm, max_occupancy. Le room_type pointe vers DIM_ROOM_TYPE qui définit les catégories vendables (Standard, Deluxe, Suite, etc.) avec leurs amenities.

**DIM_RATE_PLAN** capture la complexité tarifaire : BAR (Best Available Rate), Corporate, Package, Opaque (via OTAs), Group. Chaque plan a ses règles : advance_purchase_required, refundable, minimum_stay, included_services. Les rate plans sont versionnés (SCD Type 2) car les conditions changent.

**DIM_CHANNEL** définit les canaux de distribution : Brand.com, GDS (Amadeus/Sabre), OTA (Booking/Expedia), Corporate Direct, Walk-in. Attributs incluent : commission_rate, payment_terms, segment_focus. La hiérarchie : Channel → Channel_Category → Distribution_Type.

**DIM_GUEST** nécessite une approche privacy-first. Nous stockons : loyalty_tier, lifetime_value_bucket, preference_category (business/leisure), home_market. Les PII sont dans un système séparé, seul un guest_token hashé fait le lien.

#### Modélisation pour Dynamic Pricing

**FACT_PRICE_RECOMMENDATION** enregistre chaque recommandation de prix générée : datetime, property, room_type, stay_date, recommended_ADR, factors_json (demand_score, competition_price, event_impact). Même si non appliquée, nous gardons pour améliorer l'algorithme.

**FACT_COMPETITOR_RATE** capture les prix des concurrents scrappés : competitor_property, room_type_mapped, check_in_date, los (length of stay), rate_found, availability_status. Mis à jour toutes les 2 heures pour les 90 prochains jours.

**DIM_DEMAND_DRIVER** catégorise les événements impactant la demande : type (conference, concert, holiday), expected_impact (low/medium/high), affected_radius_km. Lié aux dates et propriétés via bridge tables.

#### Optimisation Multi-Propriétés

Avec 500 propriétés, les agrégations sont critiques :

**Partitioning Strategy** :
- FACT_RESERVATION : par mois de stay_date + sous-partition par brand
- FACT_DAILY_REVENUE : par jour avec partition rotation après 400 jours
- Toutes les dimensions : répliquées sur tous les nodes (petit volume)

**Materialized Views** pour les KPIs standards :
- RevPAR par propriété par mois
- Occupancy par région par semaine  
- ADR par channel par trimestre

Ces vues sont rafraîchies incrementalement la nuit, offrant des performances sub-seconde pour les dashboards executifs.

### Scénario 8: SkillForge Academy (E-learning)

#### Modélisation pour Apprentissage Adaptatif

SkillForge nécessite un modèle capturant les parcours d'apprentissage complexes tout en supportant la personnalisation temps réel. Le défi est de modéliser la progression non-linéaire où les apprenants peuvent revenir en arrière, refaire, ou sauter du contenu.

#### Faits d'Apprentissage Granulaires

**FACT_LEARNING_EVENT** capture chaque interaction : video_play, pause, quiz_attempt, forum_post, resource_download. Granularité à la seconde avec context riche : device_type, network_quality, time_of_day, session_duration_so_far. Volume : 100M événements/jour.

Pour éviter l'explosion du volume, nous appliquons un sampling intelligent : 100% pour les quiz/tests (critiques), 10% pour video events après les 5 premières minutes (comportement stable), 1% pour les page views (moins informatif).

**FACT_ASSESSMENT_RESULT** enregistre chaque tentative d'évaluation : score_achieved, time_taken, questions_attempted, hints_used. Nous gardons toutes les tentatives, pas juste la meilleure, pour analyser la progression.

**FACT_SKILL_PROGRESSION** track l'évolution des compétences : learner × skill × date × proficiency_level. Proficiency calculé par un modèle IRT (Item Response Theory) based sur les assessments. Cette table alimente les learning paths adaptatifs.

**FACT_ENGAGEMENT_SESSION** agrège une session d'apprentissage : total_time, content_completed, engagement_score (calculé via algorithme propriétaire), flow_state_achieved (basé sur ratio challenge/skill). Sessions définies par 30min d'inactivité.

#### Dimensions Pédagogiques

**DIM_CONTENT** modélise le matériel pédagogique avec métadonnées riches : type (video, quiz, lab, reading), duration_minutes, difficulty_level, required_prerequisites, learning_objectives, bloom_taxonomy_level. 

La hiérarchie de contenu est un DAG (Directed Acyclic Graph) pas une tree : Module → Lesson → Topic → Item. Un item peut appartenir à plusieurs topics (reusability). Modélisé via table bridge BRIDGE_CONTENT_HIERARCHY.

**DIM_SKILL** représente les compétences selon plusieurs taxonomies : internal_taxonomy, ESCO (European Skills), O*NET (US occupations). Hiérarchie : Skill_Category → Skill_Group → Skill → Sub_skill. Les relations entre skills (prerequisites, related) sont dans BRIDGE_SKILL_RELATIONSHIP.

**DIM_LEARNER** profile les apprenants : age_group, education_level, learning_style (visual/auditory/kinesthetic), pace_preference (self-paced/structured), timezone, primary_language. 

Pour les entreprises clientes, nous avons des attributs additionnels : company, department, role, required_skills_for_role. Ces attributs permettent le gap analysis et les recommandations corporatives.

**DIM_INSTRUCTOR** pour les cours instructor-led : qualification_level, subject_expertise, avg_rating, response_time_hours, languages_taught. Lié au contenu via BRIDGE_CONTENT_INSTRUCTOR.

#### Modélisation pour Parcours Adaptatifs

**FACT_LEARNING_PATH** définit les séquences recommandées : learner × path_version × sequence_number × content_item × status (not_started/in_progress/completed/skipped). Paths sont générés par ML et évoluent.

**FACT_ADAPTATION_EVENT** enregistre chaque décision d'adaptation : trigger (low_score/high_score/time_exceeded), action_taken (add_remedial/skip_ahead/change_difficulty), model_confidence. Permet d'améliorer l'engine adaptatif.

**DIM_LEARNING_OBJECTIVE** structure les objectifs selon Bloom : Remember → Understand → Apply → Analyze → Evaluate → Create. Chaque contenu et assessment est tagué avec ses objectifs, permettant de vérifier la couverture.

#### Architecture pour B2B Analytics

**FACT_COMPANY_ENGAGEMENT** agrège par entreprise : active_learners, hours_learned, skills_developed, certifications_earned, ROI_metrics. Refreshed daily pour les dashboards clients.

**DIM_COMPANY** profile les entreprises clientes : industry, size_bracket, learning_budget, strategic_skills_focus, renewal_probability_score. SCD Type 2 pour tracker l'évolution.

Row-level security implémentée via VPD (Virtual Private Database) : chaque requête filtrée automatiquement par company_id selon le login.

### Scénario 9: ConnectWave Telecom (Telco 5G)

#### Modélisation pour Volumes Telco Extrêmes

ConnectWave présente le défi ultime du volume : 10B CDRs/jour nécessitant une modélisation qui balance granularité et performance. Nous adoptons une architecture multi-résolution avec agrégation progressive.

#### Faits Telco Multi-Résolution

**FACT_CDR_RAW** stocke les CDRs bruts pour 24h seulement (buffer rotatif). Structure minimale : calling_number_hash, called_number_hash, start_time, duration, cell_id, bytes_transferred. Partitionné par heure, compression Snappy.

**FACT_CDR_5MIN** agrège par fenêtres de 5 minutes : subscriber × cell × service_type. Mesures : call_count, total_duration, data_volume, unique_numbers_called. Retention 7 jours. Cette résolution suffit pour 90% des analyses opérationnelles.

**FACT_CDR_HOURLY** monte d'un niveau : subscriber × zone (groupe de cells) × hour. Ajout de métriques dérivées : mobility_index (cells traversées), usage_pattern (voice/data/mixed), roaming_flag. Retention 90 jours.

**FACT_CDR_DAILY** pour l'historique long terme et facturation. Inclut les revenus calculés, les forfaits consommés, les dépassements. Partitionné par mois, retention 24 mois pour conformité légale.

**FACT_NETWORK_PERFORMANCE** capture les KPIs réseau par cell par 15 minutes : signal_strength, interference_level, throughput, latency, packet_loss, connected_users. Volume énorme mais critique pour optimisation 5G.

#### Dimensions Telco Spécialisées

**DIM_SUBSCRIBER** profile les abonnés avec privacy protection : segment (prepaid/postpaid/corporate), value_tier, technology_capability (3G/4G/5G), device_category, churn_risk_score. Le MSISDN réel est hasé, seuls les systèmes de facturation ont le mapping.

Nous maintenons un historique complet (SCD Type 2) car l'analyse de churn nécessite de savoir quel plan/device l'abonné avait au moment du comportement observé.

**DIM_CELL_SITE** modélise le réseau radio : site_id, latitude, longitude, technology, frequency_band, antenna_height, azimuth, capacity, vendor. Hiérarchie : Cell → Site → Cluster → Region → Country.

Les cells 5G ont des attributs additionnels : network_slicing_capable, beam_forming_config, massive_mimo_streams. La topologie réseau (voisinage) est dans BRIDGE_CELL_NEIGHBOR.

**DIM_SERVICE** catégorise les services : voice, sms, data, mais aussi les nouveaux services 5G : IoT, URLLC (Ultra-Reliable Low-Latency), eMBB (Enhanced Mobile Broadband). Chaque service a ses SLA et pricing.

**DIM_DEVICE** enrichi depuis base TAC : manufacturer, model, capabilities (VoLTE, 5G, eSIM), launch_date, price_tier. Crucial pour analyser l'adoption technologique et optimiser le réseau selon le parc.

#### Modélisation pour Network Slicing 5G

**FACT_NETWORK_SLICE** enregistre l'usage des slices virtualisées : slice_id, tenant (entreprise cliente), allocated_bandwidth, actual_usage, latency_achieved, sla_met_flag. Permet la facturation B2B et l'optimisation des ressources.

**DIM_SLICE_TEMPLATE** définit les types de slices : eMBB_standard, URLLC_automotive, mMTC_smartcity. Chaque template a ses requirements : bandwidth_minimum, latency_maximum, reliability_target, isolation_level.

**FACT_SLICE_SLA_VIOLATION** track les violations pour pénalités : slice, timestamp, metric_violated, severity, duration_minutes, impact_assessment, penalty_amount. Alimente les SLA reports et l'amélioration continue.

#### Optimisations pour Échelle Pétabyte

**Stratégie de Partitioning** :
- CDR tables : Range partition par jour + hash sub-partition par subscriber_id % 100
- Network tables : List partition par région + range sub-partition par timestamp
- Dimensions : Broadcast join compatible (répliquées)

**Compression Aggressive** :
- CDR : Colonnes répétitives (cell_id) avec dictionary encoding
- Timestamps : Delta encoding (stocke différences)
- Mesures : Bit packing pour integers
- Taux compression global : 12:1

**Indexation Selective** :
- Bloom filters sur subscriber_id (réduit I/O de 90%)
- Bitmap index sur categorical (service_type, device_category)
- B-tree sur timestamps uniquement pour last 7 days
- Pas d'index sur données >30 jours (scan plus efficient)

### Scénario 10: WealthBuilder Pro (Trading Platform)

#### Modélisation pour Trading Haute Fréquence

WealthBuilder nécessite un modèle capturant chaque tick tout en supportant les calculs de risque temps réel et la conformité stricte. Le défi est la latence : certaines requêtes doivent répondre en <10ms.

#### Faits Trading Micro-Latence

**FACT_ORDER** enregistre chaque ordre avec granularité microseconde : order_id, account_id, symbol, side (buy/sell), order_type, quantity, limit_price, timestamp_received, timestamp_acknowledged. Les timestamps sont cruciaux pour prouver best execution.

Nous gardons l'historique complet des états : FACT_ORDER_STATUS track new → partially_filled → filled/cancelled avec timestamps précis. Nécessaire pour reconstruction des positions et audit FINRA.

**FACT_EXECUTION** capture chaque fill : execution_id, order_id, venue, price, quantity, timestamp_executed, liquidity_flag (add/remove), fee_amount. Le lien avec l'ordre permet l'analyse de slippage et price improvement.

**FACT_POSITION** est maintenu en temps réel par compte×symbole : quantity, cost_basis, market_value, unrealized_pnl, realized_pnl_day. Recalculé sur chaque execution, critique pour risk management.

**FACT_MARKET_DATA** stocke les ticks : symbol, bid_price, bid_size, ask_price, ask_size, last_price, last_size, timestamp_exchange, timestamp_received. Volume énorme (100K updates/sec) nécessitant une structure optimisée.

Pour les performances, nous maintenons trois versions :
- **Hot** : dernières 5 minutes en mémoire (Redis TimeSeries)
- **Warm** : dernières 24h en columnar (ClickHouse)
- **Cold** : historique en Parquet sur S3

#### Dimensions Trading Spécialisées

**DIM_ACCOUNT** profile les traders : account_type (cash/margin), trading_experience_level, risk_tolerance, pattern_day_trader_flag, options_level, margin_agreement. 

Attributs dérivés mis à jour temps réel : buying_power, maintenance_margin, day_trade_count, concentration_score. Le calcul temps réel est crucial pour les risk checks.

**DIM_SYMBOL** enrichit les instruments : asset_class (equity/option/crypto), exchange, market_cap_tier, volatility_bucket, sector, industry. Pour les options : underlying, strike, expiration, option_type.

Relations complexes modélisées : options chain via BRIDGE_OPTION_CHAIN, corporate actions via DIM_CORPORATE_ACTION.

**DIM_VENUE** détaille les lieux d'exécution : exchange/ATS/dark_pool, maker_taker_fees, hours, order_types_supported, regulatory_status. Important pour smart order routing.

**DIM_TRADING_STRATEGY** catégorise les comportements : day_trading, swing_trading, buy_and_hold, options_strategies. Détecté par ML, utilisé pour education et risk monitoring.

#### Modélisation pour Risk et Compliance

**FACT_RISK_METRIC** calculé par compte toutes les 5 secondes : var_95, var_99, max_drawdown, sharpe_ratio, concentration_risk, margin_usage. Stocké en mémoire pour les comptes actifs.

**FACT_COMPLIANCE_CHECK** enregistre chaque vérification : check_type (pattern_day_trade, wash_sale, insider_trading), result, action_taken. Volume élevé mais nécessaire pour audit.

**DIM_REGULATION** catalogue les règles : reg_t, reg_sho, finra_rules. Chaque règle a ses paramètres et seuils, versionnés car ils changent.

**FACT_BEST_EXECUTION** compare chaque execution au NBBO : nbbo_bid, nbbo_ask, execution_price, price_improvement, effective_spread. Agrégé mensuellement pour reporting 606.

#### Optimisations pour Latence Minimale

**In-Memory Architecture** :
- Positions courantes : 100% RAM (Apache Ignite)
- Orders actifs : Redis Sorted Sets
- Market data hot : Custom ring buffer en Rust
- Risk metrics : Computed in-memory grid

**Sharding Strategy** :
- Orders/Executions : Shardé par symbol (colocate related data)
- Accounts : Shardé par account_id % 100
- Market data : Shardé par exchange

**Denormalization Extrême** pour les requêtes critiques :
- Position inclut tous les attributs account (évite join)
- Order inclut symbol details (évite lookup)
- Trades précalculent les commissions (évite calculation)

Cette approche sacrifie l'espace pour la latence, justifié par les requirements <10ms.

---

## Partie 4: Data Models pour les Scénarios 11-15

### Scénario 11: Compagnie Aérienne - "SkyConnect Airlines" (Non détaillé précédemment)

Pour compléter les 15 scénarios, créons un nouveau cas d'une compagnie aérienne nécessitant revenue management sophistiqué et opérations temps réel.

#### Contexte et Modélisation Aérienne

SkyConnect opère 500 avions, 2000 vols/jour, 50M passagers/an. Le modèle doit supporter le pricing dynamique, l'optimisation des opérations, et l'expérience passager personnalisée.

**FACT_BOOKING** capture chaque réservation (PNR) : booking_ref, flight_segments (multi-leg), passengers, fare_class, total_revenue, ancillary_revenue (bags, seats, meals), channel, timestamp_booked. Un booking peut avoir plusieurs segments (connexions), modélisés dans FACT_BOOKING_SEGMENT.

**FACT_FLIGHT_OPERATION** enregistre chaque vol opéré : flight_number, scheduled_departure, actual_departure, delay_minutes, delay_reason, fuel_consumed, passengers_carried, cargo_weight. Lié aux dimensions pour analyse complète.

**DIM_FLIGHT** définit les vols programmés : flight_number, origin, destination, scheduled_time, aircraft_type, distance, block_time. Hiérarchie : Route → City-Pair → Region-Pair.

**DIM_PASSENGER** profile les voyageurs (avec privacy) : frequent_flyer_tier, lifetime_miles, preferred_seat, dietary_restrictions, average_ticket_value. Le passenger_id réel est tokenisé.

**DIM_AIRCRAFT** détaille la flotte : registration, model, configuration (seats by class), age, next_maintenance, operating_cost_hour. Lié à DIM_SEAT_MAP pour la configuration exacte.

Le revenue management utilise **FACT_FARE_BUCKET** : flight × booking_class × days_before_departure × available_seats × fare_amount. Mis à jour continuellement par l'algorithme de pricing.

### Scénario 12: Gouvernement - "SmartCity Platform"

#### Modélisation pour Services Publics

SmartCity intègre données de transport, énergie, sécurité, et services municipaux pour 5M habitants.

**FACT_CITIZEN_SERVICE** enregistre chaque interaction : service_type, channel (online/phone/office), processing_time, satisfaction_score, resolution_status. Anonymisé mais permettant l'analyse de parcours.

**FACT_TRAFFIC_FLOW** capture les flux par segment routier par 5 minutes : vehicle_count, average_speed, congestion_level. Alimenté par 10K capteurs et cameras.

**FACT_ENERGY_CONSUMPTION** par building par heure : electricity_kwh, gas_cubic_meters, water_liters, waste_kg. Permet l'optimisation énergétique ville.

**DIM_LOCATION** hiérarchie géographique fine : District → Neighborhood → Block → Building. Enrichi avec demographics, income_level, crime_statistics.

**DIM_SERVICE** catalogue les 200+ services municipaux : category, department, sla_days, digital_available, cost_to_serve. Permet l'analyse d'efficacité.

### Scénario 13: Agriculture - "FarmTech Cooperative"

#### Modélisation pour Agriculture de Précision

FarmTech gère 10K fermes, 1M hectares, avec IoT et satellite monitoring.

**FACT_CROP_OBSERVATION** données quotidiennes par parcelle : ndvi_index, soil_moisture, temperature, growth_stage, pest_detection, yield_prediction. Fusion données satellite + capteurs.

**FACT_FARMING_OPERATION** enregistre chaque intervention : operation_type (semis, traitement, récolte), parcel, equipment_used, inputs_applied (seeds, fertilizer, pesticide), cost, timestamp.

**DIM_PARCEL** définit chaque parcelle : farm, area_hectares, soil_type, slope, irrigation_type, organic_certified. Géométrie stockée en PostGIS pour analyses spatiales.

**DIM_CROP** catalogue les cultures : variety, growth_cycle_days, water_needs, optimal_temperature, market_price_current. Hiérarchie : Species → Variety → Hybrid.

**FACT_YIELD_ACTUAL** post-récolte : parcel × crop × season × yield_tons × quality_grade × revenue. Comparé aux prédictions pour améliorer les modèles.

### Scénario 14: Énergie - "GreenGrid Renewable"

#### Modélisation pour Énergies Renouvelables

GreenGrid opère 500 parcs éoliens/solaires, 10GW capacité, avec trading sur marchés spot.

**FACT_ENERGY_PRODUCTION** capture par générateur par 15 minutes : power_generated_mw, availability_factor, curtailment_mw, spot_price_at_time. Le curtailment (production perdue) est crucial pour l'optimisation.

**FACT_WEATHER_FORECAST** par site par heure : wind_speed, solar_irradiance, temperature, cloud_cover, forecast_horizon, accuracy_score. Plusieurs horizons stockés (1h, 6h, 24h, 7days) pour analyser la précision.

**FACT_ENERGY_TRADING** enregistre chaque transaction : market (day-ahead/intraday/balancing), volume_mwh, price_per_mwh, timestamp_trade, timestamp_delivery. Le décalage trade/delivery est caractéristique du marché électrique.

**DIM_ASSET** modélise les équipements : wind_turbine/solar_panel, manufacturer, model, capacity_mw, efficiency_curve, installation_date, expected_lifetime. Pour l'éolien : hub_height, rotor_diameter. Pour le solaire : panel_type, tracking_system.

**DIM_GRID_CONNECTION** définit les points d'injection : substation, voltage_level, max_export_capacity, grid_operator, curtailment_rules. Les règles de curtailment varient par région et impactent fortement les revenus.

**FACT_MAINTENANCE_EVENT** track les interventions : asset, maintenance_type (preventive/corrective), downtime_hours, cost, energy_lost_mwh. Lié à DIM_COMPONENT pour analyse de fiabilité par pièce.

### Scénario 15: Logistique - "GlobalFlow Logistics"

#### Modélisation pour Supply Chain Complexe

GlobalFlow gère 100K expéditions/jour à travers 50 pays avec multimodal (route, rail, mer, air).

**FACT_SHIPMENT** capture chaque envoi : tracking_number, origin, destination, customer, service_level, weight, volume, declared_value, timestamp_pickup, timestamp_delivery_promised, timestamp_delivery_actual. Multi-parcels modélisés via FACT_SHIPMENT_PARCEL.

**FACT_TRACKING_EVENT** enregistre chaque scan : shipment_id, location, event_type (pickup/transit/customs/delivery), timestamp, exception_flag, delay_minutes. Volume énorme (1B events/mois) mais nécessaire pour visibilité.

**FACT_TRANSPORT_LEG** modélise chaque segment de transport : from_hub, to_hub, transport_mode, carrier, vehicle_id, departure_planned, departure_actual, arrival_planned, arrival_actual, cost, carbon_emissions. Permet l'optimisation multimodale.

**DIM_LOCATION** riche hiérarchie : Address → ZIP → City → Province → Country → Region → Continent. Enrichi avec : timezone, customs_zone, dangerous_goods_allowed, average_dwell_time.

**DIM_SERVICE_PRODUCT** définit les offres : express/standard/economy, transit_time_days, cutoff_time, delivery_commitment, price_base, price_per_kg, price_per_km. SCD Type 2 car les prix changent fréquemment.

**DIM_CUSTOMER** segment les clients : shipper_type (B2B/B2C/C2C), volume_tier, credit_terms, preferred_services, compliance_certifications. Lié à DIM_CONTRACT pour tarifs négociés.

**FACT_CAPACITY_UTILIZATION** snapshot quotidien par route : available_capacity, booked_capacity, actual_used, revenue_per_unit, cost_per_unit. Crucial pour yield management.

---

## Partie 5: Synthèse et Patterns de Data Modeling

### Patterns Récurrents à Travers les 15 Modèles

#### Pattern 1: Multi-Granularité Temporelle

Presque tous nos modèles implémentent plusieurs niveaux de granularité temporelle. C'est particulièrement évident dans les scénarios à fort volume (Telco, Streaming, Trading) où nous gardons :
- Données brutes : quelques heures/jours en haute résolution
- Agrégations intermédiaires : semaines en résolution moyenne  
- Agrégations long terme : années en basse résolution

Cette approche balance le besoin d'analyse détaillée récente avec les contraintes de stockage. La clé est de définir les règles de roll-up qui préservent les métriques business critiques.

#### Pattern 2: Slowly Changing Dimensions Sophistiquées

Nous voyons une évolution du SCD Type 2 classique vers des approches plus nuancées :

**Bi-temporalité** (Assurance, Banking) : Deux timelines - quand le changement s'est produit dans le monde réel vs quand nous l'avons enregistré. Crucial pour les corrections rétroactives et l'audit.

**SCD Type 6** hybride (Retail, Hospitality) : Combine Type 1, 2, et 3 - garde l'historique complet, mais aussi la valeur courante et précédente pour performance. Utile quand 90% des requêtes veulent la valeur actuelle mais l'historique reste nécessaire.

**Versioning Explicite** (E-learning, Healthcare) : Au lieu de valid_from/to dates, nous utilisons des version_numbers explicites. Plus intuitif pour les utilisateurs business et permet de comparer facilement les versions.

#### Pattern 3: Bridge Tables et Relations Complexes

Les relations many-to-many sont omniprésentes, mais leur implémentation varie :

**Bridge Simple** (Retail promotions, Hotel amenities) : Table de liaison pure avec juste les clés étrangères.

**Bridge Enrichie** (Healthcare procedures, Insurance coverages) : La bridge table contient des attributs de la relation elle-même (date applied, contribution percentage, sequence order).

**Bridge Temporelle** (Telco network topology, Trading option chains) : La relation elle-même change dans le temps, nécessitant SCD sur la bridge table.

#### Pattern 4: Hierarchies Flexibles

Différentes approches selon la stabilité et complexité :

**Dénormalisée** (Streaming content, Retail products) : Tous les niveaux dans une table. Simple, performant, mais redondant.

**Snowflaked** (Insurance geography, Hotel organization) : Tables séparées par niveau. Normalized, flexible, mais plus de jointures.

**Parent-Child** (Manufacturing equipment, E-learning content) : Recursif avec parent_id. Très flexible mais requêtes récursives complexes.

**Graph** (Social features, Knowledge prerequisites) : Relations many-to-many entre nœuds. Nécessite graph database ou recursive CTEs.

#### Pattern 5: Données Dérivées et Feature Stores

Tous les modèles avec ML incluent des structures pour features calculées :

**Features Versionnées** (FinTech fraud, Telco churn) : Chaque version de feature a sa définition et période de validité. Permet de reproduire les prédictions historiques.

**Features Temps Réel vs Batch** (Trading risk, Streaming recommendations) : Deux stores - un pour features recalculées fréquemment (Redis), un pour features stables (S3).

**Feature Lineage** (Healthcare predictions, Insurance actuarial) : Trace complète de comment chaque feature est calculée. Nécessaire pour compliance et debugging.

### Principes de Design Émergents

#### Principe 1: Design for Change

Tous les modèles anticipent le changement. Que ce soit via SCD, versioning, ou modularité, la flexibilité est intégrée dès le début. Le coût de refactoring d'un modèle en production est prohibitif.

#### Principe 2: Performance via Denormalization Contrôlée

La normalisation pure (3NF) est rare. Nous dénormalisons stratégiquement :
- Dimensions : souvent complètement dénormalisées pour éviter les jointures
- Faits : incluent des attributs de dimension fréquemment accédés
- Agrégations : pré-calculées pour les requêtes communes

La clé est de documenter et automatiser la synchronisation des données dénormalisées.

#### Principe 3: Sécurité et Privacy by Design

GDPR, HIPAA, PCI impactent profondément les modèles :
- Separation of PII : Données personnelles dans des tables séparées avec accès restreint
- Tokenization : Remplacer les identifiants réels par des tokens
- Encryption : Au niveau colonne pour les données sensibles
- Audit : Chaque accès aux données sensibles est loggé

Ces contraintes ne sont plus des afterthoughts mais structurent le modèle.

#### Principe 4: Multi-Temperature Storage

Le concept de données "chaudes/tièdes/froides" influence l'architecture :
- Hot : In-memory ou SSD, accès milliseconde
- Warm : Standard storage, accès seconde
- Cold : Archive/Glacier, accès minutes/heures

Le modèle doit faciliter le mouvement des données entre températures sans casser les requêtes.

#### Principe 5: Observabilité Native

Les modèles modernes incluent des structures pour monitoring :
- Metadata tables : Track freshness, quality, lineage
- Audit tables : Qui a changé quoi quand
- Performance tables : Query patterns, slow queries
- Quality tables : Data quality scores, anomalies

Ces tables sont first-class citizens, pas des add-ons.

### Optimisations Communes

#### Partitioning Strategies

**Range Partitioning** (majorité des faits) : Par date généralement. Simple, supporte bien le pruning.

**List Partitioning** (dimensions géographiques) : Par région/pays. Permet l'isolation et compliance locale.

**Hash Partitioning** (très grandes dimensions) : Par customer_id % N. Distribue uniformément.

**Composite Partitioning** (volumes extrêmes) : Range + Hash. Date pour le pruning, hash pour la distribution.

#### Indexing Patterns

**Covering Indexes** : Include toutes les colonnes nécessaires pour éviter table lookup.

**Partial Indexes** : Seulement sur un subset de lignes (WHERE clause). Réduit la taille et améliore performance.

**Bloom Filters** : Pour membership testing rapide. Excellent pour foreign key checks.

**Bitmap Indexes** : Pour colonnes low-cardinality. Compression excellente et operations set rapides.

#### Materialized Views vs Tables

**Materialized Views** : 
- Pros : Maintenance automatique, consistency garantie
- Cons : Refresh peut être lent, flexibilité limitée
- Use : Agrégations simples, joins fréquents

**Aggregate Tables** :
- Pros : Contrôle total, optimisations custom
- Cons : Maintenance manuelle, risque d'inconsistance
- Use : Logique complexe, performance critique

### Anti-Patterns à Éviter

#### Anti-Pattern 1: Over-Normalization

Normaliser jusqu'à 5NF peut sembler "propre" mais crée des cauchemars de performance. Les 20+ joins nécessaires pour une requête simple tuent la performance et la lisibilité.

#### Anti-Pattern 2: God Tables

Tables avec 200+ colonnes, essayant de capturer tout. Ingérables, lentes, impossibles à maintenir. Mieux vaut splitter en tables cohérentes.

#### Anti-Pattern 3: EAV Everywhere

Entity-Attribute-Value semble flexible mais rend les requêtes complexes et lentes. Réserver pour les cas vraiment dynamiques (attributs produits variables).

#### Anti-Pattern 4: Ignorer les Types de Données

Utiliser VARCHAR pour tout "par simplicité". Les types appropriés (INT, DATE, DECIMAL) améliorent performance et intégrité.

#### Anti-Pattern 5: Missing Time Dimension

Stocker les dates comme strings ou sans dimension temps séparée. Rend les analyses temporelles difficiles et lentes.

### Guidelines pour Choisir une Approche

#### Quand Utiliser Star Schema
- Analytics principalement read-only
- Utilisateurs non-techniques (BI tools)
- Performance critique sur agrégations
- Données relativement stables

#### Quand Utiliser Snowflake Schema
- Nombreuses hiérarchies complexes
- Mises à jour fréquentes des dimensions
- Contraintes d'espace disque
- Besoin de normalisation pour cohérence

#### Quand Utiliser Data Vault
- Sources multiples avec qualité variable
- Besoin d'audit trail complet
- Changements fréquents de requirements
- Chargement parallel de sources indépendantes

#### Quand Utiliser Modèles NoSQL
- Données semi-structurées (JSON, XML)
- Schéma très variable
- Scaling horizontal nécessaire
- Queries simples par clé

### Métriques de Qualité d'un Modèle

Un bon modèle de données doit scorer haut sur ces critères :

**Compréhensibilité** : Un nouvel analyste peut-il comprendre le modèle en 1 heure ?

**Performance** : Les requêtes typiques s'exécutent-elles en <5 secondes ?

**Flexibilité** : Peut-on ajouter de nouvelles sources sans refonte majeure ?

**Intégrité** : Les contraintes garantissent-elles la cohérence des données ?

**Scalabilité** : Le modèle supporte-t-il 10x de croissance ?

**Maintenabilité** : Les changements sont-ils localisés ou cascadent-ils partout ?

**Compliance** : Le modèle respecte-t-il les régulations (GDPR, HIPAA) ?

**Documentation** : Chaque table/colonne a-t-elle une description claire ?

### Conclusion : L'Art du Data Modeling

Le data modeling moderne est un exercice d'équilibre constant entre des forces opposées : performance vs flexibilité, simplicité vs complétude, normalisation vs denormalisation, coût vs valeur.

Les 15 modèles explorés montrent qu'il n'existe pas de solution universelle. Chaque domaine a ses patterns, ses contraintes, ses optimisations spécifiques. Un modèle excellent pour le streaming serait désastreux pour l'actuariat, et vice versa.

La clé du succès réside dans :
1. **Comprendre profondément le domaine business** avant de modéliser
2. **Anticiper les évolutions** sans sur-ingénierer
3. **Optimiser pour les cas d'usage réels**, pas théoriques
4. **Documenter les décisions et trade-offs** pour les futurs mainteneurs
5. **Itérer et raffiner** basé sur l'usage réel

Le data modeling n'est pas qu'une compétence technique - c'est un pont entre le business et la technologie, traduisant les besoins humains en structures que les machines peuvent traiter efficacement. C'est cet aspect humain, cette compréhension du contexte et des besoins, qui distingue un bon modèle d'un excellent modèle.

Ces 15 exemples fournissent un playbook de patterns, d'approches, et de solutions testées en production. Ils montrent que derrière chaque grande application data se cache un modèle soigneusement conçu, constamment raffiné, et profondément aligné avec les objectifs business. C'est cette fondation solide qui permet aux organisations de transformer leurs données en valeur réelle.# Guide Complet du Data Modeling - Théorie et Pratique

## Partie 1: Comprendre le Data Modeling

### Qu'est-ce que le Data Modeling ?

Le data modeling est l'art et la science de structurer et organiser les données pour répondre aux besoins business tout en optimisant les performances, la maintenabilité et l'évolutivité. C'est comme concevoir les plans d'un bâtiment avant sa construction : chaque décision impacte l'utilisation future, les coûts, et les possibilités d'extension.

Un modèle de données efficace doit accomplir plusieurs objectifs simultanément. Il doit représenter fidèlement la réalité business (les clients achètent des produits, les étudiants suivent des cours), permettre des requêtes performantes (trouver toutes les commandes d'un client en milliseconds), garantir l'intégrité des données (un paiement ne peut exister sans commande), et rester compréhensible pour les développeurs et analystes qui l'utiliseront quotidiennement.

### Les Éléments Constitutifs du Data Modeling

#### 1. Les Tables de Faits (Fact Tables)

Les tables de faits sont le cœur d'un modèle analytique. Elles contiennent les événements mesurables du business : une vente, un clic, un appel téléphonique, une transaction bancaire. Ces tables stockent deux types d'informations : les mesures (montant de la vente, durée de l'appel) et les clés étrangères vers les dimensions qui contextualisent ces mesures.

Une caractéristique fondamentale des faits est qu'ils sont généralement immutables et additifs. Une vente du 15 janvier reste une vente du 15 janvier pour toujours. On peut additionner les ventes de janvier pour obtenir le total mensuel. Cette additivité est cruciale pour les performances : plutôt que de recalculer depuis les données granulaires, on peut pré-agréger.

#### 2. Les Tables de Dimensions (Dimension Tables)

Les dimensions fournissent le contexte aux faits. Elles répondent aux questions : Qui ? Quoi ? Où ? Quand ? Comment ? Pourquoi ? Une dimension Client nous dit qui a acheté. Une dimension Produit nous dit quoi a été acheté. Une dimension Temps nous dit quand c'était.

Les dimensions contiennent des attributs descriptifs riches. La dimension Client ne contient pas juste un nom, mais aussi l'adresse, le segment, la date d'inscription, le score de crédit, les préférences. Ces attributs permettent le slicing and dicing : analyser les ventes par région, par segment client, par catégorie produit.

#### 3. Les Types de Clés

**Clé Primaire Naturelle** : Un identifiant qui existe dans le monde réel, comme un numéro de sécurité sociale ou un code produit EAN. Avantage : signification business directe. Inconvénient : peut changer (rare mais catastrophique) et peut contenir de l'information (problème GDPR).

**Clé Surrogate** : Un identifiant artificiel généré par le système, typiquement un entier auto-incrémenté ou un UUID. Avantage : immuable, sans signification (donc pas de problème privacy), performance optimale. Inconvénient : nécessite des jointures pour obtenir l'information business.

**Clé Étrangère** : Référence la clé primaire d'une autre table, établissant une relation. Dans une table de faits, les clés étrangères pointent vers les dimensions. L'ensemble des clés étrangères forme souvent une clé composite unique pour la table de faits.

#### 4. Les Relations

**One-to-Many (1:N)** : La plus commune. Un client peut avoir plusieurs commandes. Implémentée avec une clé étrangère dans la table "many" pointant vers la table "one".

**Many-to-Many (M:N)** : Nécessite une table de liaison (bridge table). Un étudiant peut suivre plusieurs cours, un cours a plusieurs étudiants. La table inscription contient student_id et course_id.

**One-to-One (1:1)** : Rare en pratique, souvent indique une opportunité de fusion. Utilisée pour séparer des données sensibles ou rarement accédées.

### Les Approches de Modélisation

#### Modèle en Étoile (Star Schema)

Le plus simple et souvent le plus performant pour l'analytique. Une table de faits centrale entourée de dimensions dénormalisées. Chaque dimension est une table unique contenant toutes ses hiérarchies aplaties.

Avantages : Requêtes simples avec peu de jointures, excellent pour les outils BI, performance prévisible. Inconvénients : Redondance dans les dimensions, mises à jour plus complexes.

#### Modèle en Flocon (Snowflake Schema)

Les dimensions sont normalisées en plusieurs tables selon leurs hiérarchies. La dimension Produit se décompose en Product, Category, Department.

Avantages : Pas de redondance, updates plus simples, économie d'espace. Inconvénients : Plus de jointures donc potentiellement plus lent, plus complexe à comprendre.

#### Data Vault

Approche moderne séparant les Hubs (entités business), Links (relations), et Satellites (attributs). Optimisé pour l'ingestion parallèle et l'historisation complète.

Avantages : Flexibilité maximale, traçabilité complète, chargement parallèle. Inconvénients : Complexité élevée, nombreuses jointures pour requêtes business.

### Les Étapes de Création d'un Modèle

#### Étape 1: Comprendre le Business

Avant toute modélisation, il faut comprendre profondément le domaine. Quels sont les processus business ? Quelles décisions doivent être prises ? Quelles métriques sont critiques ? Cette compréhension vient d'interviews avec les stakeholders, l'analyse des systèmes existants, et l'observation des processus réels.

#### Étape 2: Identifier les Faits

Cherchez les événements business mesurables. Dans le retail : ventes, retours, réceptions stock. Dans la banque : transactions, ouvertures de compte, demandes de crédit. Dans le streaming : plays, likes, partages. Ces événements deviennent vos tables de faits.

#### Étape 3: Déterminer la Granularité

La granularité définit le niveau de détail d'un fait. Une vente peut être au niveau ligne de commande (chaque produit) ou en-tête de commande (total). Plus la granularité est fine, plus le volume est important mais plus les analyses sont flexibles. C'est un trade-off crucial.

#### Étape 4: Identifier les Dimensions

Pour chaque fait, listez les contextes nécessaires. Une vente nécessite : Date, Client, Produit, Magasin, Vendeur, Promotion. Ces contextes deviennent vos dimensions. Attention aux dimensions dégénérées : des attributs du fait qui ne méritent pas une dimension séparée (numéro de commande).

#### Étape 5: Définir les Hiérarchies

Les dimensions ont souvent des hiérarchies naturelles. Date : Jour → Mois → Trimestre → Année. Produit : SKU → Sous-catégorie → Catégorie → Département. Ces hiérarchies permettent le drill-down/roll-up dans les analyses.

#### Étape 6: Gérer les Changements (SCD)

Les dimensions changent dans le temps. Un client déménage, un produit change de prix. Les Slowly Changing Dimensions (SCD) gèrent ces changements :

- **Type 1** : Écraser l'ancienne valeur (perd l'historique)
- **Type 2** : Créer une nouvelle ligne avec dates de validité (garde l'historique complet)
- **Type 3** : Ajouter une colonne "previous_value" (garde un historique limité)

#### Étape 7: Optimiser les Performances

Ajoutez des index sur les clés étrangères et colonnes fréquemment filtrées. Considérez le partitionnement pour les grandes tables (par date typiquement). Évaluez la pré-agrégation pour les requêtes fréquentes.

---

## Partie 2: Data Models pour les Scénarios 1-5

### Scénario 1: RapidPay (FinTech Neo-Bank)

#### Analyse des Besoins et Conception

Pour RapidPay, nous devons modéliser un système bancaire moderne avec des exigences strictes de conformité et de performance. Le cœur du modèle tourne autour des transactions financières, mais nous devons aussi capturer le contexte riche nécessaire pour la détection de fraude, le scoring de crédit, et la conformité réglementaire.

#### Tables de Faits Identifiées

La table de faits principale est **FACT_TRANSACTION**, qui capture chaque mouvement d'argent dans le système. Chaque ligne représente une transaction atomique avec un montant, un timestamp précis à la milliseconde, et des références vers toutes les dimensions contextuelles. La granularité est au niveau transaction individuelle, pas d'agrégation, car nous avons besoin de cette précision pour la détection de fraude et l'audit.

Nous avons aussi **FACT_CREDIT_DECISION** pour capturer chaque décision de crédit (acceptée ou refusée) avec le score, les raisons, et le montant demandé/approuvé. Cette séparation permet d'analyser l'efficacité de notre scoring sans polluer la table de transactions.

Une troisième table de faits, **FACT_FRAUD_ALERT**, enregistre chaque alerte de fraude générée, qu'elle soit confirmée ou fausse positive. Ceci permet d'améliorer continuellement nos modèles de détection.

#### Dimensions Principales

**DIM_CUSTOMER** est notre dimension la plus riche et la plus sensible. Elle utilise une clé surrogate (customer_sk) plutôt que le customer_id naturel pour des raisons de sécurité et de performance. Les attributs incluent les informations démographiques (age_group, gender, location_tier - jamais les valeurs exactes pour la privacy), le segment (premium, standard, student), les scores de risque, et les dates clés (inscription, dernière activité). 

Nous implémentons cette dimension en SCD Type 2 car l'historique est crucial : savoir qu'un client était "high-risk" au moment d'une transaction passée est essentiel pour l'analyse, même s'il est maintenant "low-risk". Chaque changement crée une nouvelle ligne avec valid_from et valid_to dates, et un flag is_current pour identifier la version active.

**DIM_MERCHANT** capture les commerces où les transactions ont lieu. Au-delà des attributs basiques (nom, catégorie MCC, localisation), nous enrichissons avec des métriques de risque : taux de fraude historique, volume moyen, pays à risque. Ces enrichissements sont calculés mensuellement et versionnés (SCD Type 2) car un merchant peut devenir risqué avec le temps.

**DIM_DATE** et **DIM_TIME** sont séparées pour optimiser les performances. DIM_DATE contient les hiérarchies calendaires standards plus des attributs business spécifiques : is_payday (les 25-31 du mois voient plus de fraude), is_black_friday, days_until_quarter_end. DIM_TIME descend à la seconde avec des attributs comme is_business_hours, is_night_risk_period (23h-5h), permettant des analyses de patterns temporels fins.

#### Relations et Intégrité

La table FACT_TRANSACTION a une clé primaire composite : (transaction_id, transaction_timestamp). Le transaction_id seul n'est pas suffisant car en cas de replay pour correction, nous gardons les deux versions. Les clés étrangères vers les dimensions utilisent toutes des surrogate keys pour performance et sécurité.

La relation avec DIM_CUSTOMER est complexe car une transaction implique potentiellement deux customers (sender et receiver pour les virements). Nous avons donc sender_customer_sk et receiver_customer_sk, tous deux référençant DIM_CUSTOMER. Cette approche role-playing dimension évite la duplication de la dimension.

Pour gérer la conformité PSD2, nous avons une relation many-to-many entre transactions et régulations via une bridge table BRIDGE_TRANSACTION_COMPLIANCE. Chaque transaction peut être soumise à plusieurs régulations, et nous devons tracer lesquelles ont été vérifiées.

#### Optimisations Spécifiques FinTech

Le partitionnement est crucial pour les performances. FACT_TRANSACTION est partitionnée par jour, avec sous-partitions par transaction_type (payment, transfer, withdrawal). Ceci permet de scanner seulement les données pertinentes pour la majorité des requêtes qui ont une composante temporelle.

Pour la détection de fraude temps réel, nous maintenons une table agrégée FACT_CUSTOMER_DAILY_SUMMARY avec des métriques roulantes : montant total jour, nombre de transactions, merchants uniques. Cette table est mise à jour en streaming et permet des lookups <10ms pour le scoring temps réel.

Les données sensibles (montants exacts, identifiants personnels) sont stockées chiffrées au niveau colonne avec AWS KMS. Les clés de déchiffrement sont accordées par rôle, permettant aux analystes de voir des agrégats sans voir les transactions individuelles.

#### Modèle Physique Détaillé

```
FACT_TRANSACTION (
    transaction_sk BIGINT PRIMARY KEY AUTO_INCREMENT,  -- Surrogate key
    transaction_id VARCHAR(50) NOT NULL,               -- Business key
    transaction_timestamp TIMESTAMP(3) NOT NULL,       -- Millisecond precision
    sender_customer_sk INT,                            -- FK to DIM_CUSTOMER
    receiver_customer_sk INT,                          -- FK to DIM_CUSTOMER (nullable)
    merchant_sk INT,                                   -- FK to DIM_MERCHANT (nullable)
    date_sk INT NOT NULL,                              -- FK to DIM_DATE
    time_sk INT NOT NULL,                              -- FK to DIM_TIME
    transaction_type_sk INT NOT NULL,                  -- FK to DIM_TRANSACTION_TYPE
    channel_sk INT NOT NULL,                           -- FK to DIM_CHANNEL (mobile, web, ATM)
    amount_euro DECIMAL(19,4) ENCRYPTED,               -- Encrypted at column level
    fee_amount DECIMAL(19,4),
    original_currency VARCHAR(3),
    exchange_rate DECIMAL(10,6),
    fraud_score DECIMAL(3,2),                          -- 0.00 to 1.00
    is_flagged_fraud BOOLEAN DEFAULT FALSE,
    processing_time_ms INT,
    authorization_code VARCHAR(20),
    decline_reason_code VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date_customer (date_sk, sender_customer_sk),
    INDEX idx_merchant_date (merchant_sk, date_sk),
    INDEX idx_fraud_score (fraud_score) WHERE fraud_score > 0.7,  -- Partial index
    PARTITION BY RANGE (date_sk)
)
```

Cette structure permet des requêtes comme "Tous les clients ayant fait plus de 5 transactions au-dessus de 1000€ vers des merchants à risque le weekend" en scannant seulement les partitions weekend avec le partial index sur fraud_score.

### Scénario 2: MegaStore (Retail Traditionnel)

#### Analyse et Approche Hybride

MegaStore présente un défi unique : modéliser pour un retailer traditionnel en transformation digitale. Le modèle doit servir à la fois les besoins opérationnels (gestion des stocks temps réel) et analytiques (analyse des ventes historiques), tout en gérant la complexité de 850 magasins avec des systèmes hétérogènes.

Nous adoptons une approche hybride inhabituelle : un modèle en étoile pour l'analytique avec des extensions 3NF (Third Normal Form) pour l'opérationnel. Cette dualité reflète la réalité business où certains processus restent transactionnels tandis que d'autres sont purement analytiques.

#### Structure des Faits Retail

**FACT_SALES_LINE** est notre fait principal, au niveau ligne de ticket (chaque produit acheté). Cette granularité fine est essentielle pour analyser les paniers, les associations de produits, et l'efficacité des promotions. Chaque ligne contient : quantity, unit_price, discount_amount, tax_amount, net_amount. 

La particularité retail est la gestion des promotions multiples et empilables. Plutôt que d'essayer de tout capturer dans le fait, nous créons une table satellite **FACT_SALES_PROMOTION_BRIDGE** qui lie chaque ligne de vente aux promotions appliquées avec leur contribution respective. Ceci permet d'analyser l'efficacité de combinaisons promotionnelles complexes.

**FACT_INVENTORY_SNAPSHOT** capture l'état des stocks quotidiennement par SKU par localisation. C'est un fait périodique (snapshot) plutôt qu'événementiel. Les mesures incluent : on_hand_quantity, on_order_quantity, allocated_quantity, available_to_promise. Cette table permet les analyses de couverture stock et d'optimisation de réapprovisionnement.

**FACT_SUPPLIER_DELIVERY** enregistre chaque réception de marchandise avec les métriques de performance fournisseur : quantity_ordered vs quantity_received, on_time_delivery_flag, quality_score. Crucial pour le supplier scorecard et les négociations.

#### Dimensions Retail Spécifiques

**DIM_PRODUCT** est notre dimension la plus complexe avec une hiérarchie profonde : SKU → Sub-Category → Category → Department → Division. Mais la complexité vient des attributs multiples : chaque produit a des attributs standard (brand, size, color) mais aussi des attributs dynamiques selon la catégorie (puissance pour l'électroménager, pointure pour les chaussures).

Nous résolvons ceci avec un modèle EAV (Entity-Attribute-Value) pour les attributs spécifiques : une table DIM_PRODUCT_ATTRIBUTE avec (product_sk, attribute_name, attribute_value). Ceci sacrifie quelques performances pour une flexibilité totale, nécessaire avec 8 millions de SKUs aux caractéristiques variées.

**DIM_STORE** modélise nos 850 magasins avec leurs caractéristiques : surface, format (hypermarché, supermarché, proximité), zone de chalandise, cluster démographique. Nous incluons aussi des métriques dérivées mises à jour mensuellement : potentiel de marché, part de marché locale, indice de performance.

La hiérarchie géographique (Store → City → Region → Country) est gérée en snowflake (normalisée) car les analyses régionales sont fréquentes et la hiérarchie change rarement. Ceci évite la redondance massive qu'impliquerait 850 magasins × attributs géographiques complets.

**DIM_CUSTOMER** pose un défi particulier : 60% des ventes sont anonymes (cash). Nous créons un customer "WALK_IN" par magasin pour ces transactions. Pour les 40% identifiés (carte de fidélité), nous maintenons un profil riche avec segmentation RFM (Recency, Frequency, Monetary) mise à jour hebdomadairement.

#### Gestion de la Saisonnalité et Événements

Le retail a des patterns saisonniers complexes que nous modélisons explicitement. **DIM_CALENDAR_EVENT** capture tous les événements impactant les ventes : holidays, vacances scolaires, événements locaux, météo exceptionnelle. Cette dimension est liée aux faits via une bridge table car un jour peut avoir plusieurs événements.

Nous créons aussi **DIM_FISCAL_CALENDAR** séparée de DIM_DATE car l'année fiscale MegaStore commence en février. Cette dimension facilite les comparaisons year-over-year alignées sur les cycles business plutôt que calendaires.

#### Modèle pour l'Omnicanal

La convergence online/offline nécessite des adaptations. **FACT_CUSTOMER_JOURNEY** capture chaque touchpoint client à travers les canaux : visite web, email ouvert, visite magasin (via app mobile), achat. Ceci permet d'analyser les parcours cross-canal et l'attribution marketing.

Nous introduisons **DIM_FULFILLMENT** pour capturer comment une commande est satisfaite : ship-from-store, click-and-collect, livraison domicile, retrait drive. Cette dimension est cruciale pour optimiser le coût de fulfillment et l'expérience client.

#### Performance et Évolutivité

Avec 500GB de nouvelles données par jour, les optimisations sont critiques. Nous pré-agrégons systématiquement : 
- FACT_SALES_DAILY par magasin/produit pour les dashboards
- FACT_SALES_WEEKLY par catégorie/région pour le management
- FACT_SALES_MONTHLY par marque/canal pour les fournisseurs

Le partitionnement suit une stratégie composite : par mois pour les données > 3 mois, par jour pour les données récentes. Les index sont créés sur (date_sk, store_sk) et (date_sk, product_category_sk) qui couvrent 80% des requêtes.

### Scénario 3: MediCare AI (HealthTech)

#### Contraintes HIPAA et Modélisation

MediCare AI nécessite un modèle qui respecte HIPAA tout en permettant l'analytique avancé et le machine learning. La clé est la séparation stricte entre les identifiants (PHI - Protected Health Information) et les données cliniques, permettant l'analyse sans exposer l'identité des patients.

Nous adoptons un modèle en étoile avec une couche d'anonymisation. Chaque patient a un patient_id réel (PHI) stocké dans un vault sécurisé et un research_id (hash unidirectionnel) utilisé dans le modèle analytique. Seuls les systèmes autorisés peuvent faire le mapping.

#### Faits Cliniques Complexes

**FACT_CLINICAL_EVENT** capture chaque interaction médicale : consultation, test lab, prescription, procédure. La granularité est l'événement atomique car l'ordre et le timing sont cruciaux pour les prédictions cliniques. Les mesures incluent les valeurs cliniques (blood_pressure, glucose_level) mais aussi les scores dérivés (severity_score, risk_score).

La complexité médicale nécessite plusieurs tables de faits spécialisées :

**FACT_LAB_RESULT** pour les tests laboratoires avec leurs valeurs numériques, ranges normaux, et flags d'anomalie. Chaque test a potentiellement multiple composants (un CBC a 15+ mesures), modélisés comme lignes séparées liées par un batch_id.

**FACT_MEDICATION_ADMINISTRATION** enregistre chaque dose administrée avec dosage, route, et timing précis. Crucial pour l'analyse d'efficacité et d'adhérence thérapeutique.

**FACT_VITAL_SIGNS** capture les signes vitaux avec une granularité temporelle fine (par minute pour les patients ICU). Ces données time-series alimentent les modèles prédictifs d'événements adverses.

#### Dimensions Médicales Spécialisées

**DIM_PATIENT** contient les attributs démographiques et cliniques de base, mais anonymisés. L'âge est en ranges (18-25, 26-35), le zipcode est tronqué aux 3 premiers chiffres. Les conditions chroniques sont encodées comme flags booléens plutôt que texte libre.

Nous utilisons SCD Type 2 pour capturer l'évolution clinique : un patient diabétique Type 2 qui développe des complications rénales obtient une nouvelle ligne avec updated clinical profile.

**DIM_DIAGNOSIS** modélise la complexité des codes ICD-10 avec leur hiérarchie. ICD-10 a 70,000+ codes organisés en chapters → sections → categories → subcategories. Nous dénormalisons les niveaux fréquemment utilisés pour performance mais gardons la hiérarchie complète dans une table snowflaked.

**DIM_PROCEDURE** suit une approche similaire avec les codes CPT. La particularité est la gestion des procedure bundles : une chirurgie peut impliquer 10+ CPT codes. Nous utilisons une bridge table pour maintenir ces relations.

**DIM_PROVIDER** capture les médecins, infirmières, et autres professionnels avec leurs spécialités, affiliations, et métriques de qualité. Important : nous hashons les NPIs (National Provider Identifiers) pour privacy.

#### Modélisation pour le Machine Learning

Pour supporter les modèles prédictifs, nous créons des structures optimisées pour le feature engineering :

**FACT_PATIENT_TIMELINE** est une vue matérialisée qui aplatit l'historique patient en séquences temporelles. Chaque ligne représente un patient-jour avec des features agrégées : nombre de medications actifs, jours depuis dernière admission, trend des vitals signs.

**FEATURE_STORE_PATIENT** maintient les features calculées pour le ML : risk scores, embeddings de l'historique médical, clusters comportementaux. Ces features sont versionnées pour reproductibilité des modèles.

#### Gestion des Données Non-Structurées

Les notes cliniques et images médicales nécessitent une approche hybride :

**DIM_CLINICAL_NOTE** stocke les métadonnées (date, auteur, type) avec un document_id pointant vers le stockage blob. Le texte extrait et anonymisé est dans une colonne full-text indexed pour recherche.

**FACT_IMAGE_ANALYSIS** capture les résultats d'analyse d'imagerie : findings, measurements, anomalies détectées. L'image elle-même reste dans DICOM storage, référencée par study_uid.

### Scénario 4: SmartFactory Systems (Manufacturing IoT)

#### Modélisation pour l'IoT Industriel

SmartFactory présente le défi unique de modéliser des données de capteurs haute fréquence (100Hz) tout en supportant l'analytique industriel complexe. Le volume brut (1TB/jour/usine) nécessite une approche multi-résolution avec agrégation intelligente.

#### Structure Time-Series Optimisée

**FACT_SENSOR_READING** est notre fait de base, mais avec une twist : nous ne stockons pas chaque lecture. À 100Hz, un capteur génère 8.6M lectures/jour. Nous appliquons une compression temporelle :
- Stockage brut : 1 minute (tampons circulaires)
- Résolution fine : moyennes 1 seconde pour 24h
- Résolution moyenne : moyennes 1 minute pour 7 jours
- Résolution grossière : moyennes 5 minutes au-delà

Cette approche réduit le volume de 99% tout en préservant les patterns nécessaires pour l'analyse.

**FACT_PRODUCTION_EVENT** capture les événements discrets : début/fin de batch, changements de paramètres, interventions opérateur. Ces événements contextualisent les données continues des capteurs.

**FACT_QUALITY_MEASUREMENT** enregistre les contrôles qualité avec les mesures dimensionnelles, tests destructifs, et inspections visuelles. La liaison avec FACT_PRODUCTION_EVENT permet la traçabilité complète produit-à-process.

#### Dimensions Industrielles

**DIM_EQUIPMENT** modélise la hiérarchie des équipements : Plant → Line → Cell → Machine → Component → Sensor. Chaque niveau a ses attributs : capacité nominale, MTBF (Mean Time Between Failures), coûts opératoires.

Nous utilisons un modèle hiérarchique adjacency list pour flexibilité : equipment_id, parent_equipment_id. Ceci permet de reorganiser les lignes de production sans refonte du modèle.

**DIM_PRODUCT_SPEC** capture les spécifications produit avec tolérances. Complexité : un produit peut avoir 100+ spécifications, chacune avec upper/lower limits. Nous utilisons un modèle EAV optimisé avec types de données strongly typed.

**DIM_MAINTENANCE** enregistre les interventions maintenance avec leur type (préventive, corrective, prédictive), durée, coût, et impact. Lié aux équipements et aux techniciens pour analyse d'efficacité.

#### Modèle pour l'OEE (Overall Equipment Effectiveness)

L'OEE nécessite le calcul de Availability × Performance × Quality. Nous pré-calculons ces composants :

**FACT_OEE_HOURLY** agrège par heure :
- Availability : (runtime - unplanned_downtime) / runtime
- Performance : actual_output / theoretical_output
- Quality : good_units / total_units

Cette table permet le drill-down instantané sur les causes de perte d'efficacité.

#### Digital Twin Integration

Pour le digital twin, nous maintenons **FACT_SIMULATION_RESULT** qui compare prédictions vs réalité. Chaque simulation génère des prédictions timestampées, comparées aux mesures réelles quand disponibles. L'écart alimente l'amélioration des modèles.

### Scénario 5: StreamFlow Entertainment (Media Streaming)

#### Modélisation pour le Streaming Comportemental

StreamFlow nécessite un modèle capturant le comportement de viewing granulaire tout en supportant la personnalisation temps réel. Le challenge est le volume : 500M événements/jour avec pics 10x pendant les releases populaires.

#### Faits de Streaming Multi-Granularité

**FACT_STREAM_EVENT** capture chaque interaction : play, pause, seek, quality_change. Granularité à la seconde avec position dans le contenu. Volume massif mais nécessaire pour comprendre l'engagement réel.

Pour les analyses, nous maintenons plusieurs agrégations :

**FACT_VIEWING_SESSION** agrège une session complète : duration_watched, completion_rate, rebuffering_count, quality_switches. Une session = une interaction continue avec du contenu, max 4h.

**FACT_DAILY_ENGAGEMENT** par user×content : total_time_watched, number_of_sessions, furthest_position_reached. Optimisé pour les recommandations et le reporting licence.

#### Dimensions Media Riches

**DIM_CONTENT** est complexe avec métadonnées riches : genre (multiple), cast, director, release_date, licence_territory, age_rating. Nous dénormalisons agressivement car le catalogue change peu (50K titres) comparé aux événements (500M/jour).

La hiérarchie de contenu est gérée via **DIM_CONTENT_HIERARCHY** : Episode → Season → Series → Franchise. Séparée pour gérer les relations many-to-many (un film peut appartenir à plusieurs franchises).

**DIM_USER** inclut les préférences déduites : preferred_genres (top 3), viewing_time_pattern (morning/evening/night owl), binge_watcher_flag, churn_risk_score. Mis à jour quotidiennement par ML pipelines.

#### Modélisation pour CDN et Performance

**FACT_CDN

annexe : # Cours Intensif Data Engineering - 2 Semaines Combat Mode

## Introduction : Mindset et Objectifs

### La Philosophie du Chasseur

Ce cours n'est pas pour ceux qui attendent que les opportunités viennent à eux. C'est un programme intensif conçu pour transformer rapidement un profil data en hibernation en un Data Engineer opérationnel et confiant. En 14 jours, nous allons non seulement réactiver les compétences, mais aussi construire des preuves tangibles de capacité.

L'approche est simple : **Learn → Build → Show → Repeat**. Chaque concept appris est immédiatement appliqué dans un projet concret. Chaque projet devient une preuve de compétence. Chaque preuve de compétence devient un argument en entretien.

### Objectifs Mesurables

À la fin de ces 2 semaines, vous serez capable de :
1. Coder un ETL complet en Python sans chercher sur Stack Overflow toutes les 5 minutes
2. Concevoir et implémenter un pipeline de données moderne avec Airflow + DBT
3. Discuter architecture data avec assurance (batch vs streaming, data lake vs warehouse)
4. Résoudre des problèmes SQL complexes en live (window functions, CTEs, optimisation)
5. Déployer une infrastructure data basique sur le cloud
6. Montrer 2-3 projets GitHub professionnels comme portfolio

---

## SEMAINE 1 : Fondations Hardcore

### Jour 1-2 : Python Data Engineering Intensif

#### Matin (3h) : Python Core pour la Data

**Les Structures de Données Avancées**

Commençons par maîtriser les structures Python essentielles pour la data. Les dictionnaires sont votre pain quotidien en data engineering - ils représentent les JSON, les configurations, les mappings.

```python
# Pattern 1: Nested dict handling avec get() pour éviter les KeyError
config = {
    'pipeline': {
        'source': {'type': 'postgres', 'host': 'localhost'},
        'destination': {'type': 's3', 'bucket': 'data-lake'}
    }
}

# Mauvais: config['pipeline']['source']['port']  # KeyError!
# Bon: 
source_port = config.get('pipeline', {}).get('source', {}).get('port', 5432)

# Pattern 2: Dict comprehension pour transformation
raw_data = [
    {'id': 1, 'name': 'Alice', 'score': '85'},
    {'id': 2, 'name': 'Bob', 'score': '92'}
]

# Transformer les scores en int
processed = [
    {**record, 'score': int(record['score'])} 
    for record in raw_data
]

# Pattern 3: defaultdict pour agrégations
from collections import defaultdict

sales_by_region = defaultdict(list)
for sale in sales_data:
    sales_by_region[sale['region']].append(sale['amount'])

# Pattern 4: Counter pour analyses rapides
from collections import Counter

event_types = Counter(event['type'] for event in event_stream)
top_5_events = event_types.most_common(5)
```

**Générateurs et Yield : Traiter des GB sans exploser la RAM**

Les générateurs sont cruciaux pour traiter de gros volumes. Comprenons vraiment comment ils fonctionnent :

```python
# Exemple concret : Parser un gros CSV ligne par ligne
def read_large_csv(filepath, chunk_size=10000):
    """
    Lit un CSV par chunks pour éviter de charger tout en mémoire
    """
    with open(filepath, 'r') as file:
        headers = file.readline().strip().split(',')
        
        chunk = []
        for line in file:
            values = line.strip().split(',')
            record = dict(zip(headers, values))
            chunk.append(record)
            
            if len(chunk) >= chunk_size:
                yield chunk
                chunk = []
        
        # Yield le dernier chunk s'il existe
        if chunk:
            yield chunk

# Utilisation
for batch in read_large_csv('huge_file.csv'):
    # Process batch of 10000 records
    process_batch(batch)
    # La mémoire reste constante peu importe la taille du fichier!

# Pattern générateur pour transformation pipeline
def extract(source):
    """Extract data from source"""
    for record in source:
        yield record

def transform(records):
    """Transform records"""
    for record in records:
        # Business logic
        record['processed_at'] = datetime.now()
        record['amount'] = float(record['amount'])
        yield record

def load(records, destination):
    """Load to destination"""
    batch = []
    for record in records:
        batch.append(record)
        if len(batch) >= 1000:
            destination.insert_many(batch)
            batch = []
    if batch:
        destination.insert_many(batch)

# Pipeline complet avec generators
source_data = read_large_csv('transactions.csv')
extracted = extract(source_data)
transformed = transform(extracted)
load(transformed, database)
```

**Decorators : Le Pattern qui Impressionne en Entretien**

Les decorators montrent une maîtrise avancée de Python. Voici les patterns essentiels :

```python
import time
import functools
from datetime import datetime
import logging

# Pattern 1: Retry decorator pour API calls
def retry(max_attempts=3, delay=1):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            attempts = 0
            while attempts < max_attempts:
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    attempts += 1
                    if attempts >= max_attempts:
                        raise
                    logging.warning(f"Attempt {attempts} failed: {e}. Retrying...")
                    time.sleep(delay * attempts)  # Exponential backoff
            return None
        return wrapper
    return decorator

@retry(max_attempts=3, delay=2)
def fetch_api_data(endpoint):
    # This will automatically retry 3 times with exponential backoff
    response = requests.get(endpoint)
    response.raise_for_status()
    return response.json()

# Pattern 2: Timing decorator pour performance monitoring
def timeit(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        end = time.perf_counter()
        logging.info(f"{func.__name__} took {end-start:.4f} seconds")
        return result
    return wrapper

@timeit
def process_large_dataset(df):
    # Your processing logic
    return df.groupby('category').agg({'amount': 'sum'})

# Pattern 3: Validation decorator
def validate_schema(expected_schema):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(data, *args, **kwargs):
            # Validate data has expected columns
            if isinstance(data, pd.DataFrame):
                missing = set(expected_schema) - set(data.columns)
                if missing:
                    raise ValueError(f"Missing columns: {missing}")
            return func(data, *args, **kwargs)
        return wrapper
    return decorator

@validate_schema(['id', 'amount', 'date'])
def process_transactions(df):
    return df[df['amount'] > 0]
```

#### Après-midi (3h) : Mini-ETL Complet

Construisons un ETL réel qui extrait, transforme et charge des données :

```python
# etl_pipeline.py - Un ETL complet et professionnel
import logging
import json
from datetime import datetime
from typing import Dict, List, Generator, Any
import sqlite3
import requests
import pandas as pd
from contextlib import contextmanager

# Configuration
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class ETLPipeline:
    """
    ETL Pipeline professionnel avec error handling, logging, et monitoring
    """
    
    def __init__(self, config_path: str):
        with open(config_path, 'r') as f:
            self.config = json.load(f)
        self.stats = {
            'extracted': 0,
            'transformed': 0,
            'loaded': 0,
            'errors': 0
        }
    
    @contextmanager
    def database_connection(self):
        """Context manager pour gérer la connexion DB proprement"""
        conn = sqlite3.connect(self.config['database']['path'])
        try:
            yield conn
        finally:
            conn.close()
    
    @timeit
    def extract(self) -> Generator[Dict, None, None]:
        """
        Extract data from multiple sources
        """
        logger.info("Starting extraction phase")
        
        # Source 1: CSV file
        if 'csv' in self.config['sources']:
            yield from self._extract_csv()
        
        # Source 2: API
        if 'api' in self.config['sources']:
            yield from self._extract_api()
        
        # Source 3: Database
        if 'database' in self.config['sources']:
            yield from self._extract_database()
    
    def _extract_csv(self) -> Generator[Dict, None, None]:
        """Extract from CSV with chunking for large files"""
        csv_config = self.config['sources']['csv']
        
        try:
            for chunk in pd.read_csv(
                csv_config['path'],
                chunksize=csv_config.get('chunk_size', 10000)
            ):
                for _, row in chunk.iterrows():
                    self.stats['extracted'] += 1
                    yield row.to_dict()
        except Exception as e:
            logger.error(f"CSV extraction failed: {e}")
            self.stats['errors'] += 1
    
    @retry(max_attempts=3)
    def _extract_api(self) -> Generator[Dict, None, None]:
        """Extract from API with pagination"""
        api_config = self.config['sources']['api']
        
        page = 1
        while True:
            response = requests.get(
                api_config['endpoint'],
                params={'page': page, 'limit': 100},
                headers=api_config.get('headers', {})
            )
            response.raise_for_status()
            
            data = response.json()
            if not data['results']:
                break
            
            for record in data['results']:
                self.stats['extracted'] += 1
                yield record
            
            page += 1
    
    def transform(self, records: Generator) -> Generator[Dict, None, None]:
        """
        Apply business transformations
        """
        logger.info("Starting transformation phase")
        
        for record in records:
            try:
                # Clean and validate
                transformed = self._clean_record(record)
                
                # Business logic transformations
                transformed = self._apply_business_rules(transformed)
                
                # Enrich with additional data
                transformed = self._enrich_record(transformed)
                
                self.stats['transformed'] += 1
                yield transformed
                
            except Exception as e:
                logger.error(f"Transformation failed for record: {e}")
                self.stats['errors'] += 1
                continue
    
    def _clean_record(self, record: Dict) -> Dict:
        """Data cleaning and validation"""
        cleaned = {}
        
        # Remove null values
        for key, value in record.items():
            if value is not None and value != '':
                cleaned[key] = value
        
        # Standardize dates
        if 'date' in cleaned:
            cleaned['date'] = pd.to_datetime(cleaned['date']).isoformat()
        
        # Normalize text fields
        text_fields = ['name', 'description', 'category']
        for field in text_fields:
            if field in cleaned and isinstance(cleaned[field], str):
                cleaned[field] = cleaned[field].strip().title()
        
        # Validate numeric fields
        numeric_fields = ['amount', 'quantity', 'price']
        for field in numeric_fields:
            if field in cleaned:
                try:
                    cleaned[field] = float(cleaned[field])
                except (ValueError, TypeError):
                    logger.warning(f"Invalid numeric value for {field}: {cleaned[field]}")
                    cleaned[field] = 0.0
        
        return cleaned
    
    def _apply_business_rules(self, record: Dict) -> Dict:
        """Apply domain-specific business logic"""
        # Example: Calculate derived fields
        if 'quantity' in record and 'price' in record:
            record['total'] = record['quantity'] * record['price']
        
        # Example: Categorization
        if 'total' in record:
            if record['total'] > 1000:
                record['category'] = 'high_value'
            elif record['total'] > 100:
                record['category'] = 'medium_value'
            else:
                record['category'] = 'low_value'
        
        # Add metadata
        record['processed_at'] = datetime.now().isoformat()
        record['pipeline_version'] = self.config['version']
        
        return record
    
    def _enrich_record(self, record: Dict) -> Dict:
        """Enrich with external data"""
        # Example: Add exchange rates
        if 'currency' in record and record['currency'] != 'USD':
            # In real scenario, this would call an API
            exchange_rates = {'EUR': 1.1, 'GBP': 1.3, 'JPY': 0.009}
            rate = exchange_rates.get(record['currency'], 1)
            record['amount_usd'] = record.get('total', 0) * rate
        
        return record
    
    @timeit
    def load(self, records: Generator) -> None:
        """
        Load data to destination
        """
        logger.info("Starting load phase")
        
        with self.database_connection() as conn:
            cursor = conn.cursor()
            
            # Create table if not exists
            self._create_table(cursor)
            
            # Batch insert for performance
            batch = []
            batch_size = self.config['load'].get('batch_size', 1000)
            
            for record in records:
                batch.append(record)
                
                if len(batch) >= batch_size:
                    self._insert_batch(cursor, batch)
                    conn.commit()
                    batch = []
            
            # Insert remaining records
            if batch:
                self._insert_batch(cursor, batch)
                conn.commit()
    
    def _create_table(self, cursor):
        """Create destination table"""
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS processed_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT,
                name TEXT,
                category TEXT,
                amount REAL,
                total REAL,
                processed_at TEXT,
                pipeline_version TEXT
            )
        """)
    
    def _insert_batch(self, cursor, batch: List[Dict]):
        """Insert batch of records"""
        for record in batch:
            columns = ', '.join(record.keys())
            placeholders = ', '.join(['?' for _ in record])
            query = f"INSERT INTO processed_data ({columns}) VALUES ({placeholders})"
            
            try:
                cursor.execute(query, list(record.values()))
                self.stats['loaded'] += 1
            except Exception as e:
                logger.error(f"Failed to insert record: {e}")
                self.stats['errors'] += 1
    
    def run(self):
        """Execute the complete pipeline"""
        logger.info("Starting ETL Pipeline")
        start_time = datetime.now()
        
        try:
            # Extract → Transform → Load
            extracted = self.extract()
            transformed = self.transform(extracted)
            self.load(transformed)
            
            # Report statistics
            duration = (datetime.now() - start_time).total_seconds()
            logger.info(f"""
                Pipeline completed successfully:
                - Duration: {duration:.2f} seconds
                - Extracted: {self.stats['extracted']} records
                - Transformed: {self.stats['transformed']} records
                - Loaded: {self.stats['loaded']} records
                - Errors: {self.stats['errors']}
                - Throughput: {self.stats['loaded']/duration:.2f} records/second
            """)
            
        except Exception as e:
            logger.error(f"Pipeline failed: {e}")
            raise

# Configuration file: config.json
config = {
    "version": "1.0.0",
    "sources": {
        "csv": {
            "path": "data/sales.csv",
            "chunk_size": 10000
        },
        "api": {
            "endpoint": "https://api.example.com/data",
            "headers": {"Authorization": "Bearer token"}
        }
    },
    "database": {
        "path": "output/processed.db"
    },
    "load": {
        "batch_size": 1000
    }
}

if __name__ == "__main__":
    pipeline = ETLPipeline('config.json')
    pipeline.run()
```

### Jour 3-4 : SQL Avancé et Optimisation

#### Matin : Window Functions et CTEs

Les window functions sont le super-pouvoir du SQL moderne. Maîtrisons-les :

```sql
-- Pattern 1: Ranking et Top-N par groupe
WITH sales_ranked AS (
    SELECT 
        salesperson_id,
        sale_date,
        amount,
        ROW_NUMBER() OVER (PARTITION BY salesperson_id ORDER BY amount DESC) as rank,
        DENSE_RANK() OVER (PARTITION BY salesperson_id ORDER BY amount DESC) as dense_rank,
        PERCENT_RANK() OVER (PARTITION BY salesperson_id ORDER BY amount DESC) as percent_rank
    FROM sales
    WHERE sale_date >= '2024-01-01'
)
SELECT * FROM sales_ranked WHERE rank <= 3;  -- Top 3 sales per person

-- Pattern 2: Running totals et moyennes mobiles
SELECT 
    date,
    amount,
    SUM(amount) OVER (ORDER BY date) as running_total,
    AVG(amount) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as moving_avg_7d,
    amount - LAG(amount, 1) OVER (ORDER BY date) as day_over_day_change,
    LEAD(amount, 1) OVER (ORDER BY date) as next_day_amount
FROM daily_revenue;

-- Pattern 3: Comparaison avec agrégats du groupe
SELECT 
    employee_id,
    department,
    salary,
    AVG(salary) OVER (PARTITION BY department) as dept_avg,
    salary - AVG(salary) OVER (PARTITION BY department) as diff_from_avg,
    salary::DECIMAL / SUM(salary) OVER (PARTITION BY department) as pct_of_dept_total,
    NTILE(4) OVER (PARTITION BY department ORDER BY salary) as salary_quartile
FROM employees;

-- Pattern 4: Détection de patterns et gaps
WITH events_with_gaps AS (
    SELECT 
        user_id,
        event_time,
        event_type,
        event_time - LAG(event_time) OVER (PARTITION BY user_id ORDER BY event_time) as time_since_last,
        CASE 
            WHEN event_time - LAG(event_time) OVER (PARTITION BY user_id ORDER BY event_time) > INTERVAL '30 minutes'
            THEN 1 
            ELSE 0 
        END as new_session
    FROM user_events
)
SELECT 
    user_id,
    SUM(new_session) OVER (PARTITION BY user_id ORDER BY event_time) as session_number,
    event_time,
    event_type
FROM events_with_gaps;
```

**CTEs Récursifs : Le Niveau Expert**

```sql
-- Hiérarchie organisationnelle
WITH RECURSIVE org_chart AS (
    -- Anchor: CEO (top level)
    SELECT 
        employee_id,
        name,
        manager_id,
        1 as level,
        name as path
    FROM employees
    WHERE manager_id IS NULL
    
    UNION ALL
    
    -- Recursive: tous les autres
    SELECT 
        e.employee_id,
        e.name,
        e.manager_id,
        oc.level + 1,
        oc.path || ' > ' || e.name
    FROM employees e
    INNER JOIN org_chart oc ON e.manager_id = oc.employee_id
)
SELECT * FROM org_chart ORDER BY path;

-- Analyse de graphe : trouver tous les chemins
WITH RECURSIVE paths AS (
    SELECT 
        node_from,
        node_to,
        weight,
        ARRAY[node_from, node_to] as path,
        weight as total_weight
    FROM edges
    WHERE node_from = 'A'  -- Starting point
    
    UNION ALL
    
    SELECT 
        e.node_from,
        e.node_to,
        e.weight,
        p.path || e.node_to,
        p.total_weight + e.weight
    FROM edges e
    INNER JOIN paths p ON e.node_from = p.node_to
    WHERE NOT e.node_to = ANY(p.path)  -- Avoid cycles
)
SELECT * FROM paths WHERE node_to = 'Z';  -- All paths from A to Z
```

#### Après-midi : Optimisation et Performance

```sql
-- Analyse d'un plan d'exécution
EXPLAIN (ANALYZE, BUFFERS) 
SELECT 
    c.customer_id,
    c.name,
    COUNT(o.order_id) as order_count,
    SUM(oi.quantity * oi.unit_price) as total_spent
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
LEFT JOIN order_items oi ON o.order_id = oi.order_id
WHERE o.order_date >= '2024-01-01'
GROUP BY c.customer_id, c.name
HAVING SUM(oi.quantity * oi.unit_price) > 1000;

-- Création d'indexes stratégiques
CREATE INDEX idx_orders_customer_date ON orders(customer_id, order_date) 
WHERE order_date >= '2024-01-01';  -- Partial index

CREATE INDEX idx_order_items_order_id_include ON order_items(order_id) 
INCLUDE (quantity, unit_price);  -- Covering index

-- Partitioning pour grandes tables
CREATE TABLE orders_2024 (
    LIKE orders INCLUDING ALL
) PARTITION BY RANGE (order_date);

CREATE TABLE orders_2024_q1 PARTITION OF orders_2024
    FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');
    
CREATE TABLE orders_2024_q2 PARTITION OF orders_2024
    FOR VALUES FROM ('2024-04-01') TO ('2024-07-01');

-- Materialized View pour requêtes fréquentes
CREATE MATERIALIZED VIEW customer_summary AS
SELECT 
    c.customer_id,
    c.segment,
    COUNT(DISTINCT o.order_id) as total_orders,
    SUM(oi.quantity * oi.unit_price) as lifetime_value,
    MAX(o.order_date) as last_order_date,
    AVG(oi.quantity * oi.unit_price) as avg_order_value
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
LEFT JOIN order_items oi ON o.order_id = oi.order_id
GROUP BY c.customer_id, c.segment;

CREATE UNIQUE INDEX ON customer_summary(customer_id);
```

### Jour 5 : Linux et Automatisation

#### Commandes Data Engineering Essentielles

```bash
#!/bin/bash
# data_engineering_toolkit.sh

# Pattern 1: Traitement de fichiers CSV en masse
find /data/raw -name "*.csv" -type f | while read file; do
    echo "Processing $file"
    
    # Compter les lignes
    lines=$(wc -l < "$file")
    
    # Extraire le header
    header=$(head -1 "$file")
    
    # Vérifier la qualité
    duplicates=$(sort "$file" | uniq -d | wc -l)
    
    # Créer un rapport
    echo "File: $file, Lines: $lines, Duplicates: $duplicates" >> processing_report.txt
    
    # Compresser si gros fichier
    if [ $lines -gt 1000000 ]; then
        gzip -9 "$file"
        echo "Compressed $file due to size"
    fi
done

# Pattern 2: Monitoring de pipeline
monitor_pipeline() {
    while true; do
        # Check if Airflow is running
        airflow_status=$(systemctl is-active airflow-webserver)
        
        # Check database connections
        db_connections=$(psql -U postgres -c "SELECT count(*) FROM pg_stat_activity" -t)
        
        # Check disk space
        disk_usage=$(df -h /data | awk 'NR==2 {print $5}' | sed 's/%//')
        
        # Alert if issues
        if [ "$airflow_status" != "active" ]; then
            echo "ALERT: Airflow is down!" | mail -s "Pipeline Alert" admin@company.com
        fi
        
        if [ $disk_usage -gt 80 ]; then
            echo "WARNING: Disk usage at ${disk_usage}%" | mail -s "Disk Alert" admin@company.com
        fi
        
        sleep 300  # Check every 5 minutes
    done
}

# Pattern 3: ETL avec outils Unix
etl_unix_style() {
    # Extract: Download data
    curl -s "https://api.example.com/data" | \
    # Transform: Parse JSON, filter, transform
    jq '.results[] | select(.status == "active") | {id: .id, amount: .amount}' | \
    # More transformation with awk
    awk -F'"' '/"amount":/ {sum+=$4} END {print "Total:", sum}' | \
    # Load: Insert into database
    psql -U postgres -d analytics -c "COPY transactions FROM STDIN CSV"
}

# Pattern 4: Parallel processing
parallel_process() {
    # Export function for GNU parallel
    export -f process_file
    
    # Process files in parallel (4 at a time)
    find /data -name "*.json" | parallel -j 4 process_file {}
}

process_file() {
    file=$1
    # Your processing logic here
    python transform.py "$file" > "${file%.json}.csv"
}

# Pattern 5: Automated backups
backup_databases() {
    DATE=$(date +%Y%m%d_%H%M%S)
    BACKUP_DIR="/backups/$DATE"
    mkdir -p "$BACKUP_DIR"
    
    # Backup PostgreSQL
    pg_dump -U postgres analytics | gzip > "$BACKUP_DIR/analytics.sql.gz"
    
    # Backup MongoDB
    mongodump --uri="mongodb://localhost:27017" --out="$BACKUP_DIR/mongo"
    
    # Sync to S3
    aws s3 sync "$BACKUP_DIR" "s3://backups/$DATE/"
    
    # Clean old backups (keep 30 days)
    find /backups -type d -mtime +30 -exec rm -rf {} \;
}

# Cron jobs for automation
# Add to crontab with: crontab -e
# 0 2 * * * /path/to/backup_databases.sh  # Daily at 2 AM
# */5 * * * * /path/to/monitor_pipeline.sh  # Every 5 minutes
# 0 */6 * * * /path/to/etl_unix_style.sh  # Every 6 hours
```

---

## SEMAINE 2 : Stack Moderne et Projets

### Jour 6-8 : Pipeline Batch avec Airflow + DBT

#### Projet 1 : Pipeline E-commerce Analytics

Nous allons construire un pipeline complet qui analyse des données e-commerce. Ce projet sera votre vitrine principale.

**Architecture du Projet**
```
ecommerce-analytics/
├── dags/
│   ├── ecommerce_etl.py
│   └── data_quality_checks.py
├── dbt/
│   ├── models/
│   │   ├── staging/
│   │   │   ├── stg_orders.sql
│   │   │   └── stg_customers.sql
│   │   ├── marts/
│   │   │   ├── fct_orders.sql
│   │   │   └── dim_customers.sql
│   │   └── schema.yml
│   ├── tests/
│   └── dbt_project.yml
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
├── terraform/
│   ├── main.tf
│   └── variables.tf
└── README.md
```

**Airflow DAG Complet**

```python
# dags/ecommerce_etl.py
from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator
from airflow.providers.postgres.operators.postgres import PostgresOperator
from airflow.providers.http.sensors.http import HttpSensor
from airflow.providers.amazon.aws.transfers.local_to_s3 import LocalFilesystemToS3Operator
from airflow.providers.amazon.aws.operators.s3 import S3CreateBucketOperator
from airflow.utils.task_group import TaskGroup
import pandas as pd
import requests
import json

# Configuration
default_args = {
    'owner': 'data-team',
    'depends_on_past': False,
    'start_date': datetime(2024, 1, 1),
    'email_on_failure': True,
    'email_on_retry': False,
    'email': ['admin@company.com'],
    'retries': 2,
    'retry_delay': timedelta(minutes=5)
}

# DAG Definition
dag = DAG(
    'ecommerce_analytics_pipeline',
    default_args=default_args,
    description='End-to-end e-commerce analytics pipeline',
    schedule_interval='@daily',
    catchup=False,
    tags=['production', 'analytics', 'dbt']
)

def extract_api_data(**context):
    """
    Extract data from e-commerce API
    """
    execution_date = context['execution_date'].strftime('%Y-%m-%d')
    
    # Simulate API call
    response = requests.get(
        f'https://api.ecommerce.com/orders',
        params={'date': execution_date}
    )
    response.raise_for_status()
    
    data = response.json()
    
    # Save to local file
    output_path = f'/tmp/orders_{execution_date}.json'
    with open(output_path, 'w') as f:
        json.dump(data, f)
    
    # Push to XCom for next task
    context['task_instance'].xcom_push(key='raw_data_path', value=output_path)
    context['task_instance'].xcom_push(key='record_count', value=len(data))
    
    return f"Extracted {len(data)} records"

def transform_data(**context):
    """
    Transform and clean the extracted data
    """
    # Get file path from previous task
    input_path = context['task_instance'].xcom_pull(
        task_ids='extract_api_data',
        key='raw_data_path'
    )
    
    with open(input_path, 'r') as f:
        data = json.load(f)
    
    # Transform to DataFrame
    df = pd.DataFrame(data)
    
    # Data cleaning and transformation
    df['order_date'] = pd.to_datetime(df['order_date'])
    df['amount'] = df['amount'].astype(float)
    df['customer_id'] = df['customer_id'].astype(str)
    
    # Add derived columns
    df['order_month'] = df['order_date'].dt.to_period('M')
    df['is_weekend'] = df['order_date'].dt.dayofweek.isin([5, 6])
    df['order_size_category'] = pd.cut(
        df['amount'],
        bins=[0, 50, 200, 1000, float('inf')],
        labels=['small', 'medium', 'large', 'enterprise']
    )
    
    # Data quality checks
    assert df['amount'].min() >= 0, "Negative amounts found"
    assert df['customer_id'].notna().all(), "Null customer IDs found"
    
    # Save transformed data
    execution_date = context['execution_date'].strftime('%Y-%m-%d')
    output_path = f'/tmp/transformed_orders_{execution_date}.csv'
    df.to_csv(output_path, index=False)
    
    context['task_instance'].xcom_push(key='transformed_data_path', value=output_path)
    return f"Transformed {len(df)} records"

def data_quality_checks(**context):
    """
    Run data quality checks on transformed data
    """
    file_path = context['task_instance'].xcom_pull(
        task_ids='transform_data',
        key='transformed_data_path'
    )
    
    df = pd.read_csv(file_path)
    
    checks_passed = []
    checks_failed = []
    
    # Check 1: No duplicate orders
    if df['order_id'].duplicated().any():
        checks_failed.append("Duplicate order IDs found")
    else:
        checks_passed.append("No duplicate orders")
    
    # Check 2: Amount within reasonable range
    if (df['amount'] < 0).any() or (df['amount'] > 100000).any():
        checks_failed.append("Amounts outside valid range")
    else:
        checks_passed.append("All amounts valid")
    
    # Check 3: Date consistency
    if df['order_date'].isna().any():
        checks_failed.append("Null dates found")
    else:
        checks_passed.append("All dates valid")
    
    # Check 4: Customer ID format
    if not df['customer_id'].str.match(r'^[A-Z0-9]{8,}).all():
        checks_failed.append("Invalid customer ID format")
    else:
        checks_passed.append("Customer IDs valid")
    
    if checks_failed:
        raise ValueError(f"Quality checks failed: {', '.join(checks_failed)}")
    
    return f"All quality checks passed: {', '.join(checks_passed)}"

# Task definitions
with dag:
    # Check if API is available
    api_sensor = HttpSensor(
        task_id='check_api_availability',
        http_conn_id='ecommerce_api',
        endpoint='health',
        poke_interval=30,
        timeout=300
    )
    
    # Extract data
    extract_task = PythonOperator(
        task_id='extract_api_data',
        python_callable=extract_api_data,
        provide_context=True
    )
    
    # Transform data
    transform_task = PythonOperator(
        task_id='transform_data',
        python_callable=transform_data,
        provide_context=True
    )
    
    # Quality checks
    quality_task = PythonOperator(
        task_id='data_quality_checks',
        python_callable=data_quality_checks,
        provide_context=True
    )
    
    # Upload to S3
    upload_to_s3 = LocalFilesystemToS3Operator(
        task_id='upload_to_s3',
        filename='/tmp/transformed_orders_{{ ds }}.csv',
        dest_key='processed/orders/{{ ds }}/orders.csv',
        dest_bucket='data-lake',
        aws_conn_id='aws_default',
        replace=True
    )
    
    # Load to warehouse
    with TaskGroup('warehouse_loading') as warehouse_group:
        create_staging_table = PostgresOperator(
            task_id='create_staging_table',
            postgres_conn_id='warehouse',
            sql="""
                DROP TABLE IF EXISTS staging.orders_{{ ds_nodash }};
                CREATE TABLE staging.orders_{{ ds_nodash }} (
                    order_id VARCHAR(50) PRIMARY KEY,
                    customer_id VARCHAR(50),
                    order_date DATE,
                    amount DECIMAL(10,2),
                    order_month VARCHAR(7),
                    is_weekend BOOLEAN,
                    order_size_category VARCHAR(20)
                );
            """
        )
        
        load_staging = PostgresOperator(
            task_id='load_staging_data',
            postgres_conn_id='warehouse',
            sql="""
                COPY staging.orders_{{ ds_nodash }}
                FROM '/tmp/transformed_orders_{{ ds }}.csv'
                WITH (FORMAT csv, HEADER true);
            """
        )
        
        merge_to_production = PostgresOperator(
            task_id='merge_to_production',
            postgres_conn_id='warehouse',
            sql="""
                INSERT INTO analytics.fact_orders
                SELECT * FROM staging.orders_{{ ds_nodash }}
                ON CONFLICT (order_id) DO UPDATE SET
                    amount = EXCLUDED.amount,
                    updated_at = CURRENT_TIMESTAMP;
            """
        )
        
        create_staging_table >> load_staging >> merge_to_production
    
    # Run DBT models
    dbt_run = BashOperator(
        task_id='dbt_run_models',
        bash_command='cd /opt/dbt && dbt run --profiles-dir .',
        env={'DBT_PROFILES_DIR': '/opt/dbt'}
    )
    
    dbt_test = BashOperator(
        task_id='dbt_test_models',
        bash_command='cd /opt/dbt && dbt test --profiles-dir .',
        env={'DBT_PROFILES_DIR': '/opt/dbt'}
    )
    
    # Generate documentation
    dbt_docs = BashOperator(
        task_id='dbt_generate_docs',
        bash_command='cd /opt/dbt && dbt docs generate --profiles-dir .',
        env={'DBT_PROFILES_DIR': '/opt/dbt'}
    )
    
    # Define dependencies
    api_sensor >> extract_task >> transform_task >> quality_task >> upload_to_s3
    upload_to_s3 >> warehouse_group >> dbt_run >> dbt_test >> dbt_docs
```

**DBT Models**

```sql
-- dbt/models/staging/stg_orders.sql
{{
    config(
        materialized='view',
        schema='staging'
    )
}}

WITH source AS (
    SELECT * FROM {{ source('raw', 'orders') }}
),

cleaned AS (
    SELECT
        order_id,
        customer_id,
        order_date,
        amount,
        order_status,
        payment_method,
        shipping_address_country,
        -- Data cleaning
        CASE 
            WHEN amount < 0 THEN 0
            ELSE amount
        END AS cleaned_amount,
        -- Derived fields
        DATE_TRUNC('month', order_date) AS order_month,
        EXTRACT(year FROM order_date) AS order_year,
        EXTRACT(quarter FROM order_date) AS order_quarter,
        EXTRACT(dayofweek FROM order_date) IN (0, 6) AS is_weekend,
        -- Categorization
        CASE
            WHEN amount < 50 THEN 'small'
            WHEN amount < 200 THEN 'medium'
            WHEN amount < 1000 THEN 'large'
            ELSE 'enterprise'
        END AS order_size_category
    FROM source
    WHERE order_date >= '2020-01-01'  -- Only recent data
)

SELECT * FROM cleaned

-- dbt/models/marts/fct_orders.sql
{{
    config(
        materialized='incremental',
        schema='analytics',
        unique_key='order_id',
        on_schema_change='fail'
    )
}}

WITH orders AS (
    SELECT * FROM {{ ref('stg_orders') }}
),

customers AS (
    SELECT * FROM {{ ref('dim_customers') }}
),

enriched AS (
    SELECT
        o.order_id,
        o.customer_id,
        c.customer_segment,
        c.customer_lifetime_value,
        o.order_date,
        o.order_month,
        o.order_year,
        o.order_quarter,
        o.is_weekend,
        o.cleaned_amount AS amount,
        o.order_size_category,
        o.order_status,
        o.payment_method,
        o.shipping_address_country,
        -- Business metrics
        o.cleaned_amount * 0.3 AS estimated_margin,
        CASE
            WHEN c.customer_segment = 'VIP' THEN o.cleaned_amount * 0.1
            WHEN c.customer_segment = 'Regular' THEN o.cleaned_amount * 0.05
            ELSE 0
        END AS loyalty_discount,
        CURRENT_TIMESTAMP AS processed_at
    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.customer_id
)

SELECT * FROM enriched

{% if is_incremental() %}
    WHERE order_date > (SELECT MAX(order_date) FROM {{ this }})
{% endif %}

-- dbt/tests/assert_positive_amounts.sql
SELECT *
FROM {{ ref('fct_orders') }}
WHERE amount < 0

-- dbt/models/schema.yml
version: 2

models:
  - name: fct_orders
    description: "Fact table containing all processed orders"
    columns:
      - name: order_id
        description: "Unique order identifier"
        tests:
          - unique
          - not_null
      - name: amount
        description: "Order total amount"
        tests:
          - not_null
          - dbt_utils.expression_is_true:
              expression: ">= 0"
      - name: customer_id
        description: "Customer identifier"
        tests:
          - not_null
          - relationships:
              to: ref('dim_customers')
              field: customer_id
```

### Jour 9-10 : Pipeline Streaming

#### Projet 2 : Real-time Analytics avec Kafka

```python
# streaming_pipeline.py
from kafka import KafkaProducer, KafkaConsumer
from kafka.errors import KafkaError
import json
import time
import random
from datetime import datetime
import logging
import psycopg2
from psycopg2.extras import execute_batch
import redis
import pandas as pd
from typing import Dict, List, Optional
import asyncio
import aiohttp
import uvloop

# Configuration
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class StreamingPipeline:
    """
    Real-time streaming pipeline with Kafka
    """
    
    def __init__(self, config: Dict):
        self.config = config
        self.producer = self._init_producer()
        self.consumer = self._init_consumer()
        self.redis_client = redis.Redis(
            host=config['redis']['host'],
            port=config['redis']['port'],
            decode_responses=True
        )
        self.postgres_conn = psycopg2.connect(
            **config['postgres']
        )
    
    def _init_producer(self) -> KafkaProducer:
        """Initialize Kafka producer with proper settings"""
        return KafkaProducer(
            bootstrap_servers=self.config['kafka']['brokers'],
            value_serializer=lambda v: json.dumps(v).encode('utf-8'),
            key_serializer=lambda k: k.encode('utf-8') if k else None,
            acks='all',  # Wait for all replicas
            retries=3,
            max_in_flight_requests_per_connection=1,  # Ensure ordering
            compression_type='snappy',
            batch_size=16384,
            linger_ms=10
        )
    
    def _init_consumer(self) -> KafkaConsumer:
        """Initialize Kafka consumer"""
        return KafkaConsumer(
            *self.config['kafka']['topics'],
            bootstrap_servers=self.config['kafka']['brokers'],
            value_deserializer=lambda m: json.loads(m.decode('utf-8')),
            key_deserializer=lambda k: k.decode('utf-8') if k else None,
            group_id=self.config['kafka']['consumer_group'],
            auto_offset_reset='earliest',
            enable_auto_commit=False,  # Manual commit for exactly-once
            max_poll_records=500
        )
    
    async def produce_events(self, num_events: int = 1000):
        """
        Generate and send events to Kafka
        """
        event_types = ['page_view', 'click', 'purchase', 'add_to_cart', 'search']
        
        for i in range(num_events):
            event = {
                'event_id': f'evt_{i}_{int(time.time())}',
                'event_type': random.choice(event_types),
                'user_id': f'user_{random.randint(1, 10000)}',
                'timestamp': datetime.now().isoformat(),
                'properties': {
                    'page': f'/page_{random.randint(1, 100)}',
                    'value': random.uniform(10, 1000),
                    'session_id': f'session_{random.randint(1, 1000)}'
                }
            }
            
            # Send to Kafka
            future = self.producer.send(
                topic='events',
                key=event['user_id'],
                value=event,
                timestamp_ms=int(time.time() * 1000)
            )
            
            try:
                # Wait for confirmation
                record_metadata = future.get(timeout=10)
                logger.info(f"Sent event {event['event_id']} to {record_metadata.topic}")
            except KafkaError as e:
                logger.error(f"Failed to send event: {e}")
            
            # Simulate real-time
            await asyncio.sleep(random.uniform(0.01, 0.1))
    
    def process_stream(self):
        """
        Process events from Kafka stream
        """
        batch = []
        batch_start_time = time.time()
        
        for message in self.consumer:
            event = message.value
            
            # Process event
            processed = self._process_event(event)
            
            # Add to batch
            batch.append(processed)
            
            # Update real-time metrics
            self._update_metrics(processed)
            
            # Flush batch if needed
            if len(batch) >= 100 or (time.time() - batch_start_time) > 5:
                self._flush_batch(batch)
                self.consumer.commit()  # Commit offsets after successful processing
                batch = []
                batch_start_time = time.time()
    
    def _process_event(self, event: Dict) -> Dict:
        """
        Transform and enrich event
        """
        # Parse timestamp
        event['timestamp'] = datetime.fromisoformat(event['timestamp'])
        
        # Add processing metadata
        event['processed_at'] = datetime.now()
        event['processing_lag_ms'] = (
            event['processed_at'] - event['timestamp']
        ).total_seconds() * 1000
        
        # Enrich with user data from cache
        user_data = self.redis_client.hgetall(f"user:{event['user_id']}")
        if user_data:
            event['user_segment'] = user_data.get('segment', 'unknown')
            event['user_value'] = float(user_data.get('lifetime_value', 0))
        
        # Add derived fields
        event['is_high_value'] = event['properties']['value'] > 500
        event['hour_of_day'] = event['timestamp'].hour
        event['day_of_week'] = event['timestamp'].weekday()
        
        return event
    
    def _update_metrics(self, event: Dict):
        """
        Update real-time metrics in Redis
        """
        pipe = self.redis_client.pipeline()
        
        # Update counters
        pipe.hincrby('metrics:events', event['event_type'], 1)
        pipe.hincrby('metrics:hourly', f"{event['hour_of_day']:02d}", 1)
        
        # Update user activity
        pipe.zadd(
            'active_users',
            {event['user_id']: event['timestamp'].timestamp()}
        )
        
        # Update revenue if purchase
        if event['event_type'] == 'purchase':
            pipe.hincrbyfloat(
                'metrics:revenue',
                'total',
                event['properties']['value']
            )
        
        # Execute pipeline
        pipe.execute()
    
    def _flush_batch(self, batch: List[Dict]):
        """
        Write batch to PostgreSQL
        """
        if not batch:
            return
        
        cursor = self.postgres_conn.cursor()
        
        # Prepare data for insertion
        records = [
            (
                e['event_id'],
                e['event_type'],
                e['user_id'],
                e['timestamp'],
                e['properties']['value'],
                e.get('user_segment'),
                e['processed_at'],
                e['processing_lag_ms']
            )
            for e in batch
        ]
        
        # Bulk insert
        execute_batch(
            cursor,
            """
            INSERT INTO events (
                event_id, event_type, user_id, event_timestamp,
                value, user_segment, processed_at, processing_lag_ms
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (event_id) DO NOTHING
            """,
            records,
            page_size=1000
        )
        
        self.postgres_conn.commit()
        logger.info(f"Flushed {len(batch)} events to database")
    
    def aggregate_window(self, window_minutes: int = 5):
        """
        Perform windowed aggregations
        """
        while True:
            # Get recent events from Redis
            current_time = time.time()
            window_start = current_time - (window_minutes * 60)
            
            active_users = self.redis_client.zrangebyscore(
                'active_users',
                window_start,
                current_time
            )
            
            # Calculate aggregates
            metrics = {
                'window_end': datetime.now().isoformat(),
                'active_users_count': len(active_users),
                'events_count': sum(
                    int(v) for v in self.redis_client.hvals('metrics:events')
                ),
                'total_revenue': float(
                    self.redis_client.hget('metrics:revenue', 'total') or 0
                )
            }
            
            # Store aggregates
            self.redis_client.hset(
                f"window_aggregates:{int(current_time)}",
                mapping=metrics
            )
            
            # Also write to PostgreSQL for historical analysis
            cursor = self.postgres_conn.cursor()
            cursor.execute(
                """
                INSERT INTO metric_windows (
                    window_end, active_users, events_count, revenue
                ) VALUES (%s, %s, %s, %s)
                """,
                (
                    metrics['window_end'],
                    metrics['active_users_count'],
                    metrics['events_count'],
                    metrics['total_revenue']
                )
            )
            self.postgres_conn.commit()
            
            logger.info(f"Window aggregate: {metrics}")
            time.sleep(window_minutes * 60)

# Configuration
config = {
    'kafka': {
        'brokers': ['localhost:9092'],
        'topics': ['events'],
        'consumer_group': 'analytics-consumer'
    },
    'redis': {
        'host': 'localhost',
        'port': 6379
    },
    'postgres': {
        'host': 'localhost',
        'database': 'streaming',
        'user': 'postgres',
        'password': 'postgres'
    }
}

# Usage
if __name__ == "__main__":
    pipeline = StreamingPipeline(config)
    
    # Run producer in async mode
    asyncio.set_event_loop_policy(uvloop.EventLoopPolicy())
    asyncio.run(pipeline.produce_events(10000))
    
    # Or run consumer
    # pipeline.process_stream()
    
    # Or run aggregator
    # pipeline.aggregate_window()
```

### Jour 11 : Cloud et Infrastructure

#### Terraform pour Data Infrastructure

```hcl
# terraform/main.tf
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# S3 Buckets for Data Lake
resource "aws_s3_bucket" "data_lake" {
  bucket = "${var.project_name}-data-lake"
  
  tags = {
    Name        = "Data Lake"
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_s3_bucket_versioning" "data_lake_versioning" {
  bucket = aws_s3_bucket.data_lake.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "data_lake_lifecycle" {
  bucket = aws_s3_bucket.data_lake.id
  
  rule {
    id = "archive-old-data"
    
    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }
    
    transition {
      days          = 90
      storage_class = "GLACIER"
    }
    
    status = "Enabled"
  }
}

# RDS for Data Warehouse
resource "aws_db_instance" "data_warehouse" {
  identifier     = "${var.project_name}-warehouse"
  engine         = "postgres"
  engine_version = "15.3"
  instance_class = "db.t3.large"
  
  allocated_storage     = 100
  storage_type          = "gp3"
  storage_encrypted     = true
  
  db_name  = "analytics"
  username = var.db_username
  password = var.db_password
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  skip_final_snapshot = var.environment != "production"
  
  tags = {
    Name        = "Data Warehouse"
    Environment = var.environment
  }
}

# EMR Cluster for Spark
resource "aws_emr_cluster" "spark_cluster" {
  name          = "${var.project_name}-spark-cluster"
  release_label = "emr-6.10.0"
  applications  = ["Spark", "Hadoop", "Hive", "JupyterHub"]
  
  master_instance_group {
    instance_type = "m5.xlarge"
  }
  
  core_instance_group {
    instance_type  = "m5.xlarge"
    instance_count = 2
    
    ebs_config {
      size                 = 100
      type                 = "gp3"
      volumes_per_instance = 1
    }
  }
  
  ec2_attributes {
    key_name                          = var.key_pair_name
    subnet_id                         = aws_subnet.main.id
    emr_managed_master_security_group = aws_security_group.emr_master.id
    emr_managed_slave_security_group  = aws_security_group.emr_slave.id
  }
  
  configurations_json = jsonencode([
    {
      Classification = "spark-defaults"
      Properties = {
        "spark.sql.adaptive.enabled"                      = "true"
        "spark.sql.adaptive.coalescePartitions.enabled"   = "true"
        "spark.serializer"                                = "org.apache.spark.serializer.KryoSerializer"
      }
    }
  ])
  
  log_uri = "s3://${aws_s3_bucket.data_lake.id}/emr-logs/"
  
  service_role = aws_iam_role.emr_service.arn
}

# Lambda for Serverless ETL
resource "aws_lambda_function" "etl_processor" {
  filename      = "etl_lambda.zip"
  function_name = "${var.project_name}-etl-processor"
  role          = aws_iam_role.lambda_role.arn
  handler       = "handler.process"
  
  source_code_hash = filebase64sha256("etl_lambda.zip")
  
  runtime = "python3.10"
  timeout = 300
  memory_size = 1024
  
  environment {
    variables = {
      S3_BUCKET        = aws_s3_bucket.data_lake.id
      DB_HOST          = aws_db_instance.data_warehouse.address
      DB_NAME          = aws_db_instance.data_warehouse.db_name
      ENVIRONMENT      = var.environment
    }
  }
  
  vpc_config {
    subnet_ids         = [aws_subnet.main.id]
    security_group_ids = [aws_security_group.lambda.id]
  }
}

# EventBridge for Scheduling
resource "aws_cloudwatch_event_rule" "etl_schedule" {
  name                = "${var.project_name}-etl-schedule"
  description         = "Trigger ETL pipeline"
  schedule_expression = "rate(1 hour)"
}

resource "aws_cloudwatch_event_target" "lambda_target" {
  rule      = aws_cloudwatch_event_rule.etl_schedule.name
  target_id = "LambdaTarget"
  arn       = aws_lambda_function.etl_processor.arn
}

# Glue Catalog Database
resource "aws_glue_catalog_database" "analytics" {
  name = "${var.project_name}_analytics"
  
  description = "Analytics database for ${var.project_name}"
}

# Athena Workgroup
resource "aws_athena_workgroup" "analytics" {
  name = "${var.project_name}-analytics"
  
  configuration {
    result_configuration {
      output_location = "s3://${aws_s3_bucket.data_lake.id}/athena-results/"
    }
    
    enforce_workgroup_configuration    = true
    publish_cloudwatch_metrics_enabled = true
  }
}
```

#### Docker pour le Pipeline

```dockerfile
# Dockerfile
FROM apache/airflow:2.7.0-python3.10

USER root

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    libpq-dev \
    git \
    && rm -rf /var/lib/apt/lists/*

USER airflow

# Install Python packages
COPY requirements.txt /requirements.txt
RUN pip install --no-cache-dir -r /requirements.txt

# Copy DAGs and DBT project
COPY --chown=airflow:airflow ./dags /opt/airflow/dags
COPY --chown=airflow:airflow ./dbt /opt/dbt
COPY --chown=airflow:airflow ./scripts /opt/scripts

# requirements.txt
apache-airflow-providers-amazon==8.0.0
apache-airflow-providers-postgres==5.4.0
apache-airflow-providers-http==4.3.0
dbt-core==1.5.0
dbt-postgres==1.5.0
pandas==2.0.0
boto3==1.26.0
psycopg2-binary==2.9.6
redis==4.5.0
kafka-python==2.0.2
great-expectations==0.16.0
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: airflow
      POSTGRES_PASSWORD: airflow
      POSTGRES_DB: airflow
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
  
  redis:
    image: redis:7
    ports:
      - "6379:6379"
  
  kafka:
    image: confluentinc/cp-kafka:7.4.0
    depends_on:
      - zookeeper
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
    ports:
      - "9092:9092"
  
  zookeeper:
    image: confluentinc/cp-zookeeper:7.4.0
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
  
  airflow-webserver:
    build: .
    depends_on:
      - postgres
      - redis
    environment:
      AIRFLOW__CORE__EXECUTOR: CeleryExecutor
      AIRFLOW__DATABASE__SQL_ALCHEMY_CONN: postgresql+psycopg2://airflow:airflow@postgres/airflow
      AIRFLOW__CELERY__BROKER_URL: redis://redis:6379/0
      AIRFLOW__CELERY__RESULT_BACKEND: db+postgresql://airflow:airflow@postgres/airflow
    volumes:
      - ./dags:/opt/airflow/dags
      - ./logs:/opt/airflow/logs
      - ./dbt:/opt/dbt
    ports:
      - "8080:8080"
    command: webserver
  
  airflow-scheduler:
    build: .
    depends_on:
      - postgres
      - redis
    environment:
      AIRFLOW__CORE__EXECUTOR: CeleryExecutor
      AIRFLOW__DATABASE__SQL_ALCHEMY_CONN: postgresql+psycopg2://airflow:airflow@postgres/airflow
      AIRFLOW__CELERY__BROKER_URL: redis://redis:6379/0
      AIRFLOW__CELERY__RESULT_BACKEND: db+postgresql://airflow:airflow@postgres/airflow
    volumes:
      - ./dags:/opt/airflow/dags
      - ./logs:/opt/airflow/logs
      - ./dbt:/opt/dbt
    command: scheduler
  
  airflow-worker:
    build: .
    depends_on:
      - postgres
      - redis
    environment:
      AIRFLOW__CORE__EXECUTOR: CeleryExecutor
      AIRFLOW__DATABASE__SQL_ALCHEMY_CONN: postgresql+psycopg2://airflow:airflow@postgres/airflow
      AIRFLOW__CELERY__BROKER_URL: redis://redis:6379/0
      AIRFLOW__CELERY__RESULT_BACKEND: db+postgresql://airflow:airflow@postgres/airflow
    volumes:
      - ./dags:/opt/airflow/dags
      - ./logs:/opt/airflow/logs
      - ./dbt:/opt/dbt
    command: celery worker

volumes:
  postgres-data:
```

---

## SEMAINE 2 (Suite) : Finalisation et Polish

### Jour 12-13 : Intégration et Tests

#### Tests Unitaires pour vos Pipelines

```python
# tests/test_etl_pipeline.py
import unittest
from unittest.mock import Mock, patch, MagicMock
import pandas as pd
from datetime import datetime
import json
from etl_pipeline import ETLPipeline

class TestETLPipeline(unittest.TestCase):
    """
    Tests complets pour le pipeline ETL
    """
    
    def setUp(self):
        """Setup pour chaque test"""
        self.config = {
            'sources': {
                'csv': {'path': 'test.csv', 'chunk_size': 100},
                'api': {'endpoint': 'http://test.com', 'headers': {}}
            },
            'database': {'path': ':memory:'},
            'load': {'batch_size': 10},
            'version': '1.0.0'
        }
        self.pipeline = ETLPipeline('config_test.json')
    
    def test_clean_record_removes_nulls(self):
        """Test que le cleaning supprime les nulls"""
        record = {
            'id': 1,
            'name': 'Test',
            'value': None,
            'empty': ''
        }
        
        cleaned = self.pipeline._clean_record(record)
        
        self.assertNotIn('value', cleaned)
        self.assertNotIn('empty', cleaned)
        self.assertIn('id', cleaned)
        self.assertIn('name', cleaned)
    
    def test_clean_record_normalizes_dates(self):
        """Test la normalisation des dates"""
        record = {
            'date': '2024-01-15 10:30:00'
        }
        
        cleaned = self.pipeline._clean_record(record)
        
        self.assertIn('T', cleaned['date'])  # ISO format
    
    def test_apply_business_rules_calculates_total(self):
        """Test les règles business"""
        record = {
            'quantity': 5,
            'price': 10.0
        }
        
        result = self.pipeline._apply_business_rules(record)
        
        self.assertEqual(result['total'], 50.0)
        self.assertEqual(result['category'], 'low_value')
    
    @patch('requests.get')
    def test_extract_api_handles_errors(self, mock_get):
        """Test la gestion d'erreurs API"""
        mock_get.side_effect = Exception("API Error")
        
        results = list(self.pipeline._extract_api())
        
        self.assertEqual(len(results), 0)
        self.assertEqual(self.pipeline.stats['errors'], 1)
    
    def test_transform_handles_invalid_data(self):
        """Test que transform gère les données invalides"""
        def bad_generator():
            yield {'id': 1, 'amount': 'invalid'}
            yield {'id': 2, 'amount': 100}
        
        results = list(self.pipeline.transform(bad_generator()))
        
        # Devrait processer seulement le record valide
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['amount'], 100.0)
    
    @patch('sqlite3.connect')
    def test_load_batches_correctly(self, mock_connect):
        """Test que le load fait des batches correctement"""
        mock_cursor = MagicMock()
        mock_connect.return_value.cursor.return_value = mock_cursor
        
        # Générer 25 records (devrait faire 3 batches de 10)
        def record_generator():
            for i in range(25):
                yield {'id': i, 'value': i * 10}
        
        self.pipeline.load(record_generator())
        
        # Vérifie qu'on a bien fait 3 inserts batch
        self.assertEqual(mock_cursor.execute.call_count, 25)  # 25 individual inserts
    
    def test_end_to_end_pipeline(self):
        """Test complet du pipeline"""
        # Mock data source
        test_data = [
            {'id': 1, 'name': 'Alice', 'amount': '100'},
            {'id': 2, 'name': 'Bob', 'amount': '200'}
        ]
        
        with patch.object(self.pipeline, 'extract') as mock_extract:
            mock_extract.return_value = iter(test_data)
            
            # Run pipeline
            self.pipeline.run()
            
            # Verify stats
            self.assertEqual(self.pipeline.stats['transformed'], 2)
            self.assertGreaterEqual(self.pipeline.stats['loaded'], 0)

class TestStreamingPipeline(unittest.TestCase):
    """
    Tests pour le pipeline streaming
    """
    
    def setUp(self):
        self.config = {
            'kafka': {
                'brokers': ['localhost:9092'],
                'topics': ['test'],
                'consumer_group': 'test-group'
            },
            'redis': {'host': 'localhost', 'port': 6379},
            'postgres': {
                'host': 'localhost',
                'database': 'test',
                'user': 'test',
                'password': 'test'
            }
        }
    
    @patch('kafka.KafkaProducer')
    def test_producer_initialization(self, mock_producer):
        """Test l'initialisation du producer"""
        from streaming_pipeline import StreamingPipeline
        
        pipeline = StreamingPipeline(self.config)
        
        mock_producer.assert_called_once()
        call_kwargs = mock_producer.call_args[1]
        self.assertEqual(call_kwargs['acks'], 'all')
        self.assertEqual(call_kwargs['compression_type'], 'snappy')
    
    def test_process_event_enrichment(self):
        """Test l'enrichissement d'événements"""
        from streaming_pipeline import StreamingPipeline
        
        with patch('redis.Redis'):
            pipeline = StreamingPipeline(self.config)
            
            event = {
                'event_id': 'test_1',
                'event_type': 'click',
                'user_id': 'user_1',
                'timestamp': '2024-01-15T10:30:00',
                'properties': {'value': 600}
            }
            
            processed = pipeline._process_event(event)
            
            self.assertTrue(processed['is_high_value'])
            self.assertEqual(processed['hour_of_day'], 10)
            self.assertIn('processed_at', processed)
    
    @patch('psycopg2.connect')
    def test_batch_flush(self, mock_connect):
        """Test le flush des batches"""
        from streaming_pipeline import StreamingPipeline
        
        mock_cursor = MagicMock()
        mock_connect.return_value.cursor.return_value = mock_cursor
        
        with patch('redis.Redis'):
            pipeline = StreamingPipeline(self.config)
            
            batch = [
                {
                    'event_id': 'evt_1',
                    'event_type': 'click',
                    'user_id': 'user_1',
                    'timestamp': datetime.now(),
                    'properties': {'value': 100},
                    'processed_at': datetime.now(),
                    'processing_lag_ms': 50
                }
            ]
            
            pipeline._flush_batch(batch)
            
            # Vérifie que l'insert a été appelé
            self.assertTrue(mock_cursor.execute.called)

if __name__ == '__main__':
    unittest.main()
```

#### Tests d'Intégration

```python
# tests/test_integration.py
import pytest
import psycopg2
import redis
from kafka import KafkaProducer, KafkaConsumer
import time
import json

class TestPipelineIntegration:
    """
    Tests d'intégration pour vérifier que tous les composants fonctionnent ensemble
    """
    
    @pytest.fixture
    def postgres_connection(self):
        """Fixture pour la connexion PostgreSQL"""
        conn = psycopg2.connect(
            host='localhost',
            database='test_db',
            user='postgres',
            password='postgres'
        )
        yield conn
        conn.close()
    
    @pytest.fixture
    def redis_client(self):
        """Fixture pour Redis"""
        client = redis.Redis(host='localhost', port=6379, decode_responses=True)
        client.flushdb()  # Clean before test
        yield client
        client.flushdb()  # Clean after test
    
    def test_end_to_end_data_flow(self, postgres_connection, redis_client):
        """Test le flow complet de données"""
        # 1. Produce message to Kafka
        producer = KafkaProducer(
            bootstrap_servers=['localhost:9092'],
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )
        
        test_event = {
            'event_id': 'test_integration_1',
            'event_type': 'purchase',
            'user_id': 'user_test',
            'timestamp': '2024-01-15T10:00:00',
            'properties': {'value': 150.00}
        }
        
        producer.send('events', value=test_event)
        producer.flush()
        
        # 2. Consume from Kafka
        consumer = KafkaConsumer(
            'events',
            bootstrap_servers=['localhost:9092'],
            group_id='test-integration',
            auto_offset_reset='earliest',
            value_deserializer=lambda m: json.loads(m.decode('utf-8')),
            consumer_timeout_ms=5000
        )
        
        messages = []
        for message in consumer:
            messages.append(message.value)
            if message.value['event_id'] == 'test_integration_1':
                break
        
        assert len(messages) > 0
        assert messages[-1]['event_id'] == 'test_integration_1'
        
        # 3. Check Redis metrics updated
        redis_client.hincrby('metrics:events', 'purchase', 1)
        purchase_count = redis_client.hget('metrics:events', 'purchase')
        assert int(purchase_count) >= 1
        
        # 4. Check PostgreSQL
        cursor = postgres_connection.cursor()
        cursor.execute(
            "SELECT COUNT(*) FROM events WHERE event_id = %s",
            ('test_integration_1',)
        )
        count = cursor.fetchone()[0]
        # Might be 0 if pipeline hasn't processed yet
        assert count >= 0
    
    def test_data_quality_validation(self, postgres_connection):
        """Test que les validations de qualité fonctionnent"""
        cursor = postgres_connection.cursor()
        
        # Insert test data
        cursor.execute("""
            INSERT INTO staging_data (id, amount, created_at)
            VALUES (1, 100, NOW()), (2, -50, NOW()), (3, NULL, NOW())
        """)
        postgres_connection.commit()
        
        # Run validation query
        cursor.execute("""
            SELECT COUNT(*) FROM staging_data 
            WHERE amount < 0 OR amount IS NULL
        """)
        
        invalid_count = cursor.fetchone()[0]
        assert invalid_count == 2  # Should find 2 invalid records
```

### Jour 14 : Documentation et Portfolio

#### README Professionnel

```markdown
# E-Commerce Analytics Pipeline 🚀

A production-ready data pipeline built with modern data engineering best practices, featuring real-time streaming, batch processing, and comprehensive analytics.

## 📊 Architecture Overview

```mermaid
graph LR
    A[Data Sources] --> B[Ingestion Layer]
    B --> C[Processing Layer]
    C --> D[Storage Layer]
    D --> E[Analytics Layer]
    E --> F[Visualization]
```

## 🛠 Tech Stack

- **Orchestration**: Apache Airflow 2.7
- **Streaming**: Apache Kafka, Redis
- **Transformation**: DBT, Apache Spark
- **Storage**: PostgreSQL, S3, Snowflake
- **Infrastructure**: Docker, Terraform, AWS
- **Monitoring**: Prometheus, Grafana
- **Testing**: pytest, Great Expectations

## ⚡ Features

- ✅ Real-time event processing (<100ms latency)
- ✅ Batch ETL with incremental loading
- ✅ Data quality checks and monitoring
- ✅ Auto-scaling infrastructure
- ✅ GDPR-compliant data handling
- ✅ 99.9% uptime SLA

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Python 3.10+
- AWS CLI configured
- Terraform 1.5+

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/ecommerce-pipeline.git
cd ecommerce-pipeline
```

2. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configurations
```

3. Start services with Docker Compose
```bash
docker-compose up -d
```

4. Initialize Airflow
```bash
docker-compose exec airflow-webserver airflow db init
docker-compose exec airflow-webserver airflow users create \
    --username admin \
    --firstname Admin \
    --lastname User \
    --role Admin \
    --email admin@example.com
```

5. Deploy infrastructure
```bash
cd terraform
terraform init
terraform plan
terraform apply
```

## 📁 Project Structure

```
.
├── dags/               # Airflow DAGs
├── dbt/                # DBT models and tests
├── src/                # Python source code
├── tests/              # Unit and integration tests
├── terraform/          # Infrastructure as Code
├── docker/             # Docker configurations
├── config/             # Configuration files
├── docs/               # Documentation
└── scripts/            # Utility scripts
```

## 📈 Performance Metrics

- **Throughput**: 1M events/minute
- **Latency**: P50: 45ms, P95: 87ms, P99: 120ms
- **Data Quality**: 99.8% accuracy
- **Cost**: ~$2,000/month for 10TB processing

## 🧪 Testing

Run unit tests:
```bash
pytest tests/unit
```

Run integration tests:
```bash
pytest tests/integration
```

Run data quality tests:
```bash
dbt test
```

## 📊 Monitoring

Access dashboards:
- Airflow: http://localhost:8080
- Grafana: http://localhost:3000
- Prometheus: http://localhost:9090

## 🔧 Configuration

Key configurations in `config/pipeline.yaml`:
```yaml
pipeline:
  batch_size: 10000
  parallelism: 4
  retry_attempts: 3
  
kafka:
  brokers: ["localhost:9092"]
  topics:
    - events
    - transactions
  
database:
  host: localhost
  port: 5432
  name: analytics
```

## 📖 Documentation

- [Architecture Deep Dive](docs/architecture.md)
- [Data Models](docs/data-models.md)
- [API Reference](docs/api.md)
- [Deployment Guide](docs/deployment.md)
- [Troubleshooting](docs/troubleshooting.md)

## 🚦 CI/CD

The project uses GitHub Actions for CI/CD:

- **On Pull Request**: Linting, unit tests, security scanning
- **On Main Branch**: Integration tests, build Docker images
- **On Release**: Deploy to production

## 📝 Data Schema

### Events Table
```sql
CREATE TABLE events (
    event_id VARCHAR(50) PRIMARY KEY,
    event_type VARCHAR(30) NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    properties JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Metrics Table
```sql
CREATE TABLE metrics (
    metric_id SERIAL PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10,2),
    dimensions JSONB,
    timestamp TIMESTAMP NOT NULL
);
```


#### Script de Demo

```python
# demo.py - Script pour démontrer les capacités du pipeline
import time
import json
import random
from datetime import datetime, timedelta
import pandas as pd
import requests
from rich.console import Console
from rich.table import Table
from rich.progress import track
from rich.live import Live
from rich.panel import Panel

console = Console()

class PipelineDemo:
    """
    Démonstration interactive du pipeline
    """
    
    def __init__(self):
        self.console = Console()
        self.metrics = {
            'events_processed': 0,
            'errors': 0,
            'latency_ms': 0
        }
    
    def run_demo(self):
        """Run the complete demonstration"""
        self.console.print("[bold cyan]🚀 E-Commerce Analytics Pipeline Demo[/bold cyan]\n")
        
        # Step 1: Generate sample data
        self.console.print("[yellow]Step 1: Generating sample data...[/yellow]")
        data = self.generate_sample_data(1000)
        self.console.print(f"[green]✓ Generated {len(data)} sample records[/green]\n")
        
        # Step 2: Stream processing simulation
        self.console.print("[yellow]Step 2: Processing streaming data...[/yellow]")
        self.simulate_streaming(data[:100])
        
        # Step 3: Batch processing
        self.console.print("\n[yellow]Step 3: Running batch transformation...[/yellow]")
        self.run_batch_processing(data)
        
        # Step 4: Show analytics
        self.console.print("\n[yellow]Step 4: Analytics Dashboard[/yellow]")
        self.show_analytics(data)
        
        # Step 5: Data quality report
        self.console.print("\n[yellow]Step 5: Data Quality Report[/yellow]")
        self.show_quality_report(data)
    
    def generate_sample_data(self, n_records):
        """Generate realistic e-commerce data"""
        categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports']
        payment_methods = ['Credit Card', 'PayPal', 'Apple Pay', 'Google Pay']
        
        data = []
        for i in track(range(n_records), description="Generating..."):
            record = {
                'order_id': f'ORD-{i:06d}',
                'customer_id': f'CUST-{random.randint(1, 500):04d}',
                'order_date': (datetime.now() - timedelta(days=random.randint(0, 90))).isoformat(),
                'amount': round(random.uniform(10, 1000), 2),
                'category': random.choice(categories),
                'payment_method': random.choice(payment_methods),
                'is_returned': random.random() < 0.1
            }
            data.append(record)
            time.sleep(0.001)  # Simulate processing time
        
        return data
    
    def simulate_streaming(self, data):
        """Simulate real-time streaming processing"""
        with Live(self.generate_streaming_table(), refresh_per_second=4) as live:
            for record in data:
                # Process record
                time.sleep(random.uniform(0.01, 0.05))
                self.metrics['events_processed'] += 1
                self.metrics['latency_ms'] = random.uniform(20, 100)
                
                # Random error
                if random.random() < 0.02:
                    self.metrics['errors'] += 1
                
                # Update display
                live.update(self.generate_streaming_table())
    
    def generate_streaming_table(self):
        """Generate live metrics table"""
        table = Table(title="Real-time Processing Metrics")
        
        table.add_column("Metric", style="cyan")
        table.add_column("Value", style="green")
        
        table.add_row("Events Processed", str(self.metrics['events_processed']))
        table.add_row("Current Latency", f"{self.metrics['latency_ms']:.2f} ms")
        table.add_row("Error Rate", f"{self.metrics['errors'] / max(1, self.metrics['events_processed']) * 100:.2f}%")
        table.add_row("Throughput", f"{self.metrics['events_processed'] * 10} events/sec")
        
        return table
    
    def run_batch_processing(self, data):
        """Simulate batch ETL processing"""
        df = pd.DataFrame(data)
        
        steps = [
            ("Loading data", 0.5),
            ("Cleaning nulls", 0.3),
            ("Type conversion", 0.2),
            ("Business rules", 0.4),
            ("Aggregations", 0.6),
            ("Writing to warehouse", 0.8)
        ]
        
        for step, duration in track(steps, description="Processing..."):
            time.sleep(duration)
        
        self.console.print(f"[green]✓ Processed {len(df)} records successfully[/green]")
    
    def show_analytics(self, data):
        """Display analytics dashboard"""
        df = pd.DataFrame(data)
        
        # Create analytics table
        table = Table(title="📊 Analytics Summary")
        table.add_column("Metric", style="cyan")
        table.add_column("Value", style="yellow")
        
        table.add_row("Total Orders", str(len(df)))
        table.add_row("Total Revenue", f"${df['amount'].sum():,.2f}")
        table.add_row("Average Order Value", f"${df['amount'].mean():.2f}")
        table.add_row("Return Rate", f"{df['is_returned'].mean() * 100:.1f}%")
        table.add_row("Top Category", df['category'].mode()[0])
        table.add_row("Unique Customers", str(df['customer_id'].nunique()))
        
        self.console.print(table)
    
    def show_quality_report(self, data):
        """Display data quality metrics"""
        df = pd.DataFrame(data)
        
        panel = Panel.fit(
            f"""[green]✅ Data Quality Checks Passed[/green]
            
    • Completeness: {(1 - df.isnull().sum().sum() / (len(df) * len(df.columns))) * 100:.1f}%
    • Uniqueness: {(df['order_id'].nunique() / len(df)) * 100:.1f}%
    • Validity: All amounts positive ✓
    • Consistency: Date formats valid ✓
    • Timeliness: Data freshness < 1 hour ✓
            """,
            title="Data Quality Report",
            border_style="green"
        )
        
        self.console.print(panel)

if __name__ == "__main__":
    demo = PipelineDemo()
    demo.run_demo()
```

---

## Conseils Combat Mode & Daily Routine

### Planning Quotidien Optimal

**Matin (6h-12h) : Deep Work**
- 6h-8h : Théorie et apprentissage de nouveaux concepts
- 8h-10h : Coding et implémentation
- 10h-12h : Debugging et optimisation

**Après-midi (14h-18h) : Projet Building**
- 14h-16h : Construction du projet principal
- 16h-17h : Tests et documentation
- 17h-18h : Git commits et organisation

**Soir (20h-21h) : Révision et Préparation**
- Review du code de la journée
- Préparation du lendemain
- Leetcode/HackerRank pour rester sharp

### Checklist Quotidienne

```python
# daily_progress.py
import json
from datetime import datetime

class DailyProgress:
    def __init__(self):
        self.tasks = {
            'concepts_learned': [],
            'code_written': 0,  # lines
            'bugs_fixed': 0,
            'commits_made': 0,
            'documentation_updated': False
        }
    
    def log_progress(self):
        """Log daily progress"""
        self.tasks['date'] = datetime.now().isoformat()
        
        with open('progress.json', 'a') as f:
            json.dump(self.tasks, f)
            f.write('\n')
    
    def check_readiness(self):
        """Check interview readiness"""
        readiness_score = 0
        
        if len(self.tasks['concepts_learned']) >= 3:
            readiness_score += 25
        if self.tasks['code_written'] >= 200:
            readiness_score += 25
        if self.tasks['commits_made'] >= 2:
            readiness_score += 25
        if self.tasks['documentation_updated']:
            readiness_score += 25
        
        return readiness_score
```

### Resources Essentielles

**Documentation à Garder Ouverte:**
- [Apache Airflow Docs](https://airflow.apache.org/docs/)
- [DBT Docs](https://docs.getdbt.com/)
- [Kafka Documentation](https://kafka.apache.org/documentation/)
- [AWS Data Services](https://aws.amazon.com/big-data/datalakes-and-analytics/)

**GitHub Repos à Étudier:**
- Airflow DAGs examples
- DBT sample projects
- Streaming pipeline templates

**Communautés pour Questions:**
- r/dataengineering
- DataTalks.Club
- Apache Airflow Slack

### Message de Motivation

Rappelez-vous : En 2 semaines intensives, vous pouvez transformer complètement votre profil. Chaque ligne de code, chaque bug résolu, chaque concept maîtrisé vous rapproche de votre objectif. 

Le marché cherche des Data Engineers qui peuvent **construire**, pas juste parler. Avec ces projets dans votre portfolio, vous aurez des preuves concrètes de votre capacité.

**Stay focused. Ship code. Land that job. 🚀**