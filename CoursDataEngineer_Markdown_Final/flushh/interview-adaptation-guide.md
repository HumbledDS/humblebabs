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