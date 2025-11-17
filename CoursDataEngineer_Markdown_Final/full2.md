# Niveau 2 : Modélisation et Architecture Avancée des Données - Cours Complet

## Introduction : L'Art de la Modélisation de Données Moderne

### Contexte et Enjeux

Dans l'écosystème data moderne, la modélisation des données n'est plus une simple question de schéma relationnel. C'est une discipline stratégique qui détermine la capacité d'une organisation à transformer des données brutes en valeur métier. Alors que les volumes de données explosent et que la diversité des sources s'accroît, les modèles de données traditionnels atteignent rapidement leurs limites.

**Pourquoi la modélisation avancée est-elle cruciale aujourd'hui ?**

- **Complexité croissante des données** : Les données ne sont plus uniquement transactionnelles mais incluent des événements, des logs, des données IoT, du texte non structuré, etc.
- **Exigences de performance** : Les utilisateurs s'attendent à des réponses en temps réel, même sur des volumes massifs.
- **Évolution rapide des besoins métier** : Les modèles doivent être suffisamment flexibles pour s'adapter sans refonte complète.
- **Coûts de stockage et de traitement** : Une mauvaise modélisation peut multiplier par 10 les coûts cloud.

Selon une étude récente de Gartner, 70% des projets data échouent en raison d'une modélisation inadéquate qui ne correspond pas aux besoins métier réels. Le coût moyen d'une refonte de modèle de données s'élève à 500 000€ pour une entreprise de taille moyenne.

### Objectifs Pédagogiques

À l'issue de ce module, vous serez capable de :

✅ Comprendre les forces et faiblesses des différents patterns de modélisation  
✅ Concevoir des modèles adaptés à des cas d'usage spécifiques (assurance, e-learning, FinTech)  
✅ Optimiser les performances des requêtes analytiques sur des volumes massifs  
✅ Implémenter des mécanismes de gouvernance dans la modélisation  
✅ Évaluer les trade-offs entre normalisation et dénormalisation  
✅ Appliquer des techniques avancées de partitionnement et d'indexation  

---

## Partie 1 : Fondamentaux de la Modélisation Avancée

### 1.1 Les Différents Types de Modèles de Données

#### Modèle en Étoile (Star Schema)

**Définition** : Architecture centrée autour d'une table de faits entourée de tables de dimensions.

**Structure typique** :
- **Table de faits** : Contient les mesures quantitatives (transactions, événements)
- **Tables de dimensions** : Contiennent les attributs descriptifs (clients, produits, temps)

**Avantages** :
- Simplicité de conception et de compréhension
- Performances optimisées pour les requêtes analytiques
- Facilite l'ajout de nouvelles dimensions

**Inconvénients** :
- Redondance possible dans les dimensions
- Difficulté à gérer les relations complexes

**Exemple concret** : Dans le cas de SecureLife Global (assurance), le modèle en étoile est utilisé pour le reporting réglementaire Solvency II :

```
FACT_PRIME
- policy_sk (clé étrangère vers DIM_POLICY)
- period_sk (clé étrangère vers DIM_PERIOD)
- premium_net
- premium_gross
- acquisition_costs
- commission

DIM_POLICY
- policy_sk (clé primaire)
- policy_id (business key)
- product_line
- coverage_limits
- deductibles
- effective_date
- expiry_date
- SCD_TYPE_2 (historisation)
```

**Cas d'usage critique** : Ce modèle permet de calculer rapidement la prime ajustée en fonction de l'exposition au risque, essentiel pour la tarification actuarielle dynamique :

```sql
SELECT 
    p.policy_id,
    p.product_line,
    r.exposure_score,
    f.premium_net * (1 + r.exposure_score * 0.15) AS adjusted_premium
FROM FACT_PREMIUM f
JOIN DIM_POLICY p ON f.policy_sk = p.policy_sk
JOIN FACT_RISK_EXPOSURE r ON f.policy_sk = r.policy_sk AND f.period = r.period
WHERE f.period = '2024-Q2'
```

#### Modèle en Flocon (Snowflake Schema)

**Définition** : Version normalisée du modèle en étoile où les dimensions sont décomposées en tables secondaires.

**Structure typique** :
- Tables de faits centrales
- Dimensions décomposées en hiérarchies (ex: DIM_GEOGRAPHY → DIM_COUNTRY → DIM_REGION)

**Avantages** :
- Réduction de la redondance
- Meilleure intégrité des données
- Facilite les mises à jour

**Inconvénients** :
- Plus de jointures nécessaires
- Performance potentiellement réduite

**Exemple concret** : Dans le cas de LuxStay Resorts (hôtellerie), le modèle en flocon est utilisé pour gérer les hiérarchies géographiques complexes :

```
FACT_REVENUE
- property_sk
- date_sk
- revenue
- occupancy_rate
- adr

DIM_PROPERTY
- property_sk
- property_id
- region_sk
- brand
- star_rating

DIM_REGION (normalisée)
- region_sk
- region_id
- country_sk
- region_name

DIM_COUNTRY
- country_sk
- country_id
- country_name
- currency
```

**Cas d'usage critique** : Ce modèle permet d'analyser les performances par région tout en conservant la flexibilité pour ajouter de nouveaux niveaux hiérarchiques :

```sql
SELECT 
    c.country_name,
    r.region_name,
    p.brand,
    AVG(f.revenue) AS avg_revenue,
    AVG(f.occupancy_rate) AS avg_occupancy
FROM FACT_REVENUE f
JOIN DIM_PROPERTY p ON f.property_sk = p.property_sk
JOIN DIM_REGION r ON p.region_sk = r.region_sk
JOIN DIM_COUNTRY c ON r.country_sk = c.country_sk
WHERE f.date_sk BETWEEN '2024-01-01' AND '2024-03-31'
GROUP BY c.country_name, r.region_name, p.brand
ORDER BY avg_revenue DESC;
```

#### Modèle Constellation (Galaxy Schema)

**Définition** : Ensemble de modèles en étoile partageant des dimensions communes.

**Structure typique** :
- Plusieurs tables de faits
- Dimensions partagées entre les tables de faits
- Possibilité de "sauter" entre les tables de faits via les dimensions

**Avantages** :
- Réutilisation des dimensions
- Flexibilité maximale
- Évolutivité

**Inconvénients** :
- Complexité accrue
- Plus difficile à comprendre

**Exemple concret** : Dans SkillForge Academy (plateforme e-learning), le modèle constellation permet de relier les données d'apprentissage et de revenue :

```
FACT_LEARNING_EVENT
- learner_sk
- content_sk
- event_type
- timestamp
- duration_seconds

FACT_REVENUE
- learner_sk
- content_sk
- transaction_type
- amount
- timestamp

DIM_LEARNER (partagée)
- learner_sk
- learner_id
- age
- country
- acquisition_channel
- SCD_TYPE_2

DIM_CONTENT (partagée)
- content_sk
- content_id
- content_type
- title
- difficulty
- SCD_TYPE_2
```

**Cas d'usage critique** : Ce modèle permet d'analyser l'impact des parcours d'apprentissage sur la rétention et la monétisation :

```sql
SELECT 
    l.learner_id,
    c.content_type,
    AVG(learning_time) AS avg_learning_time,
    COUNT(DISTINCT r.transaction_id) AS purchase_count,
    SUM(r.amount) AS total_spent
FROM (
    SELECT 
        learner_sk,
        content_sk,
        AVG(duration_seconds) AS learning_time
    FROM FACT_LEARNING_EVENT
    WHERE event_type = 'video_play'
    GROUP BY learner_sk, content_sk
) l
JOIN DIM_LEARNER dl ON l.learner_sk = dl.learner_sk
JOIN DIM_CONTENT dc ON l.content_sk = dc.content_sk
LEFT JOIN FACT_REVENUE r 
    ON l.learner_sk = r.learner_sk 
    AND l.content_sk = r.content_sk
    AND r.transaction_type = 'purchase'
GROUP BY l.learner_sk, l.content_sk, dc.content_type
HAVING COUNT(DISTINCT r.transaction_id) > 0;
```

### 1.2 Techniques Avancées d'Historisation

#### SCD Type 1 (Écrasement)

**Principe** : Remplacer la valeur existante par la nouvelle.

**Avantages** :
- Simplicité
- Pas d'impact sur la taille de la table

**Inconvénients** :
- Aucune historisation
- Impossible de reconstituer l'historique

**Cas d'usage** : Données non critiques où l'historique n'est pas nécessaire (ex: code postal)

#### SCD Type 2 (Nouvelle ligne)

**Principe** : Ajouter une nouvelle ligne pour chaque changement avec dates de validité.

**Structure typique** :
- effective_date
- expiry_date
- is_current (flag)
- version_number

**Avantages** :
- Historique complet
- Facilite l'analyse temporelle

**Inconvénients** :
- Augmentation de la taille de la table
- Complexité des requêtes

**Exemple concret** : SecureLife Global utilise le SCD Type 2 pour les polices d'assurance :

```sql
CREATE TABLE DIM_POLICY (
    policy_sk INT PRIMARY KEY,
    policy_id VARCHAR(50) NOT NULL,
    product_line VARCHAR(50),
    coverage_limits DECIMAL(10,2),
    deductibles DECIMAL(10,2),
    effective_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    is_current BOOLEAN NOT NULL,
    version_number INT NOT NULL
);

-- Exemple de requête pour obtenir l'état actuel
SELECT * FROM DIM_POLICY 
WHERE policy_id = 'POL-12345' AND is_current = true;

-- Exemple de requête pour obtenir l'historique
SELECT * FROM DIM_POLICY 
WHERE policy_id = 'POL-12345' 
ORDER BY effective_date;
```

**Cas d'usage critique** : Calcul de la prime ajustée en fonction des changements de couverture dans le temps :

```sql
SELECT 
    p.policy_id,
    f.period,
    p.coverage_limits,
    p.deductibles,
    f.premium_net,
    f.premium_net * (1 + p.risk_factor) AS adjusted_premium
FROM FACT_PREMIUM f
JOIN DIM_POLICY p 
    ON f.policy_sk = p.policy_sk
    AND f.period >= p.effective_date
    AND f.period < p.expiry_date
WHERE p.policy_id = 'POL-12345';
```

#### SCD Type 3 (Colonnes supplémentaires)

**Principe** : Ajouter des colonnes pour stocker la valeur précédente.

**Structure typique** :
- current_value
- previous_value
- change_date

**Avantages** :
- Historique limité mais accessible facilement
- Pas d'explosion de la taille de la table

**Inconvénients** :
- Historique limité (généralement 1-2 versions)
- Complexité lors de multiples changements

**Exemple concret** : SkillForge Academy utilise le SCD Type 3 pour le niveau de difficulté des contenus :

```sql
CREATE TABLE DIM_CONTENT (
    content_sk INT PRIMARY KEY,
    content_id VARCHAR(50) NOT NULL,
    title VARCHAR(255),
    current_difficulty VARCHAR(20),
    previous_difficulty VARCHAR(20),
    difficulty_change_date DATE
);
```

**Cas d'usage critique** : Analyser l'impact des changements de difficulté sur la complétion des cours :

```sql
SELECT 
    c.content_id,
    c.title,
    c.previous_difficulty,
    c.current_difficulty,
    AVG(post_change_completion) AS avg_completion_after_change,
    AVG(pre_change_completion) AS avg_completion_before_change
FROM DIM_CONTENT c
JOIN (
    SELECT 
        content_sk,
        AVG(CASE WHEN event_date > difficulty_change_date THEN completion ELSE NULL END) AS post_change_completion,
        AVG(CASE WHEN event_date <= difficulty_change_date THEN completion ELSE NULL END) AS pre_change_completion
    FROM FACT_LEARNING_EVENT
    GROUP BY content_sk
) le ON c.content_sk = le.content_sk
WHERE c.difficulty_change_date IS NOT NULL
GROUP BY c.content_id, c.title, c.previous_difficulty, c.current_difficulty;
```

---

## Partie 2 : Patterns d'Architecture Avancés

### 2.1 Data Vault 2.0

**Définition** : Modèle hybride conçu pour l'agilité et la performance, particulièrement adapté aux entrepôts de données historisés.

**Composants clés** :
- **Hubs** : Entités centrales (clients, produits, etc.)
- **Links** : Relations entre hubs
- **Satellites** : Attributs des hubs et links

**Avantages** :
- Historisation complète
- Évolutivité exceptionnelle
- Facilite l'intégration de nouvelles sources

**Inconvénients** :
- Complexité accrue
- Courbe d'apprentissage plus longue

**Exemple concret** : SecureLife Global utilise Data Vault 2.0 pour intégrer ses 25 systèmes d'assurance par pays :

```
HUB_POLICY
- policy_hash_key (clé technique)
- policy_id (business key)
- load_date
- source_system

HUB_CUSTOMER
- customer_hash_key
- customer_id
- load_date
- source_system

LINK_POLICY_CUSTOMER
- policy_customer_hash_key
- policy_hash_key
- customer_hash_key
- load_date
- source_system

SAT_POLICY_DETAILS
- policy_hash_key
- load_date
- load_end_date
- record_source
- product_line
- coverage_limits
- deductibles
- effective_date
```

**Cas d'usage critique** : Intégration transparente des données provenant de 25 systèmes différents avec historisation complète :

```sql
-- Requête pour obtenir les détails d'une police avec historique
SELECT 
    h.policy_id,
    s.product_line,
    s.coverage_limits,
    s.deductibles,
    s.effective_date,
    s.load_date,
    s.load_end_date
FROM HUB_POLICY h
JOIN SAT_POLICY_DETAILS s ON h.policy_hash_key = s.policy_hash_key
WHERE h.policy_id = 'POL-12345'
ORDER BY s.load_date;
```

### 2.2 Anchor Modeling

**Définition** : Approche normalisée extrême conçue pour la flexibilité maximale et la gestion temporelle précise.

**Principes clés** :
- **Anchors** : Entités stables (équivalent aux hubs)
- **Attributes** : Propriétés des anchors
- **Ties** : Relations entre anchors
- **Knots** : Domaines de valeurs réutilisables

**Avantages** :
- Flexibilité extrême pour les changements
- Historisation précise à la micro-seconde
- Évolutivité théoriquement infinie

**Inconvénients** :
- Complexité très élevée
- Performance réduite pour les requêtes simples

**Exemple concret** : WealthBuilder Pro (plateforme de trading) utilise Anchor Modeling pour gérer les ordres avec une précision temporelle extrême :

```
ANCHOR_ORDER (A_ORDER)
- order_id (surrogate key)

ATTRIBUTE_ORDER_STATUS (AT_ORDER_STATUS)
- order_id
- status
- time_start
- time_end

ATTRIBUTE_ORDER_PRICE (AT_ORDER_PRICE)
- order_id
- price
- time_start
- time_end

TIE_ORDER_EXECUTION (TIE_ORDER_EXECUTION)
- order_id
- execution_id
- time_start
- time_end
```

**Cas d'usage critique** : Analyse des micro-structures de marché avec précision temporelle :

```sql
-- Analyse des ordres avec précision temporelle
SELECT 
    o.order_id,
    s.status,
    p.price,
    e.execution_id,
    s.time_start AS status_time,
    p.time_start AS price_time,
    e.time_start AS execution_time
FROM ANCHOR_ORDER o
JOIN ATTRIBUTE_ORDER_STATUS s ON o.order_id = s.order_id
JOIN ATTRIBUTE_ORDER_PRICE p 
    ON o.order_id = p.order_id 
    AND p.time_start BETWEEN s.time_start AND s.time_end
LEFT JOIN TIE_ORDER_EXECUTION e 
    ON o.order_id = e.order_id 
    AND e.time_start BETWEEN s.time_start AND s.time_end
WHERE s.status IN ('NEW', 'PARTIALLY_FILLED', 'FILLED')
    AND p.time_start >= '2024-01-01T09:30:00.000000Z'
    AND p.time_start < '2024-01-01T09:31:00.000000Z'
ORDER BY p.time_start;
```

### 2.3 One Big Table (OBT)

**Définition** : Approche dénormalisée extrême où toutes les données sont stockées dans une seule table large.

**Principes clés** :
- Schéma flexible (généralement semi-structuré)
- Optimisé pour les column stores
- Partitionnement intelligent

**Avantages** :
- Performances extrêmes pour les requêtes analytiques
- Simplicité de requêtage
- Coûts réduits grâce à la vectorisation

**Inconvénients** :
- Complexité de l'ingestion
- Moins adapté aux opérations transactionnelles

**Exemple concret** : SkillForge Academy utilise OBT pour ses événements d'apprentissage :

```sql
CREATE TABLE fact_learning_events (
    event_id UUID PRIMARY KEY,
    event_type VARCHAR(50),
    learner_id VARCHAR(50),
    content_id VARCHAR(50),
    content_type VARCHAR(50),
    event_timestamp TIMESTAMP,
    duration_seconds INT,
    quiz_score DECIMAL(5,2),
    device_type VARCHAR(50),
    network_quality VARCHAR(50),
    time_of_day VARCHAR(20),
    session_id VARCHAR(50),
    -- Attributs spécifiques par type d'événement
    video_position_seconds INT,
    quiz_question_id VARCHAR(50),
    forum_thread_id VARCHAR(50),
    resource_type VARCHAR(50),
    -- Partitionnement
    PARTITION BY event_timestamp
);
```

**Cas d'usage critique** : Analyse en temps réel des points de blocage dans les cours :

```sql
-- Analyse des points de blocage dans un cours spécifique
SELECT 
    content_id,
    sequence_number,
    AVG(duration_seconds) AS avg_time_spent,
    COUNT(CASE WHEN event_type = 'quiz_attempt' AND quiz_score < 0.7 THEN 1 END) * 1.0 / 
        COUNT(CASE WHEN event_type = 'quiz_attempt' THEN 1 END) AS failure_rate
FROM fact_learning_events
WHERE content_id = 'COURSE_101'
    AND event_timestamp >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY content_id, sequence_number
HAVING failure_rate > 0.4
ORDER BY sequence_number;
```

---

## Partie 3 : Optimisation des Performances

### 3.1 Partitionnement Avancé

#### Partitionnement par Date

**Principe** : Diviser les données en partitions basées sur une colonne de date.

**Avantages** :
- Pruning de partition efficace
- Gestion simplifiée du cycle de vie
- Performances améliorées pour les requêtes temporelles

**Exemple concret** : SecureLife Global partitionne ses tables de faits par trimestre :

```sql
-- Snowflake
CREATE TABLE fact_premium (
    policy_sk INT,
    period DATE,
    premium_net DECIMAL(15,2),
    premium_gross DECIMAL(15,2),
    acquisition_costs DECIMAL(15,2),
    commission DECIMAL(15,2)
)
CLUSTER BY (period);

-- BigQuery
CREATE TABLE fact_premium (
    policy_sk INT64,
    period DATE,
    premium_net NUMERIC,
    premium_gross NUMERIC,
    acquisition_costs NUMERIC,
    commission NUMERIC
)
PARTITION BY RANGE_BUCKET(
    EXTRACT(YEAR FROM period) * 100 + EXTRACT(QUARTER FROM period),
    GENERATE_ARRAY(202001, 202504, 1)
);
```

**Cas d'usage critique** : Reporting trimestriel Solvency II avec performances optimisées :

```sql
-- Reporting trimestriel optimisé grâce au partition pruning
SELECT 
    p.product_line,
    SUM(f.premium_net) AS total_premium,
    SUM(f.claims) AS total_claims,
    SUM(f.claims) / SUM(f.premium_net) AS loss_ratio
FROM fact_premium f
JOIN dim_policy p ON f.policy_sk = p.policy_sk
WHERE f.period BETWEEN '2024-01-01' AND '2024-03-31'
GROUP BY p.product_line;
```

#### Partitionnement par Clé de Distribution

**Principe** : Partitionner les données en fonction d'une clé fréquemment utilisée dans les jointures.

**Avantages** :
- Réduction du shuffling réseau
- Optimisation des jointures
- Scalabilité améliorée

**Exemple concret** : WealthBuilder Pro partitionne par account_id pour les opérations de trading :

```sql
-- Snowflake
CREATE TABLE fact_trades (
    trade_id INT,
    account_id INT,
    symbol VARCHAR(10),
    trade_time TIMESTAMP,
    quantity INT,
    price DECIMAL(10,2),
    side VARCHAR(4)
)
CLUSTER BY (account_id);

-- BigQuery
CREATE TABLE fact_trades (
    trade_id INT64,
    account_id INT64,
    symbol STRING,
    trade_time TIMESTAMP,
    quantity INT64,
    price NUMERIC,
    side STRING
)
CLUSTER BY account_id;
```

**Cas d'usage critique** : Analyse des comportements de trading par compte avec performances optimisées :

```sql
-- Analyse des comportements de trading par compte
SELECT 
    account_id,
    symbol,
    COUNT(*) AS trade_count,
    SUM(quantity * price) AS total_volume,
    AVG(price) AS avg_price
FROM fact_trades
WHERE trade_time >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY account_id, symbol
HAVING COUNT(*) > 100
ORDER BY total_volume DESC;
```

### 3.2 Indexation Avancée

#### Index Composites

**Principe** : Créer un index sur plusieurs colonnes utilisées ensemble dans les filtres.

**Avantages** :
- Réduction des I/O
- Optimisation des requêtes avec plusieurs conditions
- Meilleures performances pour les agrégations

**Exemple concret** : SecureLife Global utilise des index composites pour les requêtes actuarielles :

```sql
-- PostgreSQL
CREATE INDEX idx_fact_premium_product_period ON fact_premium (product_line, period);

-- Snowflake
CREATE SEARCH OPTIMIZATION ON fact_premium FOR 
COLUMNS (product_line, period);
```

**Cas d'usage critique** : Calcul des ratios de sinistralité par produit et période :

```sql
-- Calcul des ratios de sinistralité avec index composite
SELECT 
    p.product_line,
    f.period,
    SUM(f.premium_net) AS total_premium,
    SUM(c.claims_amount) AS total_claims,
    SUM(c.claims_amount) / SUM(f.premium_net) AS loss_ratio
FROM fact_premium f
JOIN dim_policy p ON f.policy_sk = p.policy_sk
JOIN fact_claims c ON f.policy_sk = c.policy_sk AND f.period = c.period
WHERE f.period BETWEEN '2023-01-01' AND '2023-12-31'
GROUP BY p.product_line, f.period
ORDER BY loss_ratio DESC;
```

#### Index Couvrants

**Principe** : Index contenant toutes les colonnes nécessaires à une requête.

**Avantages** :
- Élimination des accès à la table principale
- Performances extrêmes pour les requêtes spécifiques
- Réduction de la contention

**Exemple concret** : SkillForge Academy utilise des index couvrants pour les requêtes d'analyse de complétion :

```sql
-- PostgreSQL
CREATE INDEX idx_completion_covering ON fact_learning_events 
(learner_id, content_id, event_type) 
INCLUDE (quiz_score, duration_seconds);

-- Snowflake
CREATE SEARCH OPTIMIZATION ON fact_learning_events FOR 
COLUMNS (learner_id, content_id, event_type, quiz_score, duration_seconds);
```

**Cas d'usage critique** : Calcul des taux de complétion par cours sans accès à la table principale :

```sql
-- Calcul des taux de complétion avec index couvrant
SELECT 
    content_id,
    AVG(quiz_score) AS avg_quiz_score,
    COUNT(DISTINCT learner_id) AS learner_count,
    SUM(CASE WHEN event_type = 'completion' THEN 1 ELSE 0 END) * 1.0 / 
        COUNT(DISTINCT learner_id) AS completion_rate
FROM fact_learning_events
WHERE content_id IN ('COURSE_101', 'COURSE_102', 'COURSE_103')
    AND event_timestamp >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY content_id
ORDER BY completion_rate DESC;
```

### 3.3 Techniques de Compression

#### Compression par Colonne

**Principe** : Appliquer des algorithmes de compression spécifiques à chaque colonne selon son type de données.

**Avantages** :
- Réduction de l'espace de stockage
- Moins d'I/O pour les requêtes
- Meilleure utilisation du cache

**Exemple concret** : WealthBuilder Pro utilise la compression par colonne pour ses données de trading :

```sql
-- Parquet format
CREATE TABLE fact_trades (
    trade_id INT,
    account_id INT,
    symbol VARCHAR(10),
    trade_time TIMESTAMP,
    quantity INT,
    price DECIMAL(10,2),
    side VARCHAR(4)
)
USING PARQUET
TBLPROPERTIES (
    'parquet.compression'='SNAPPY',
    'parquet.page.size'='1MB',
    'parquet.block.size'='256MB'
);
```

**Cas d'usage critique** : Traitement de 10M d'ordres quotidiens avec un ratio de compression de 10:1 :

```sql
-- Traitement de 10M d'ordres quotidiens
SELECT 
    symbol,
    side,
    COUNT(*) AS trade_count,
    SUM(quantity) AS total_quantity,
    AVG(price) AS avg_price,
    STDDEV(price) AS price_volatility
FROM fact_trades
WHERE trade_time >= CURRENT_DATE - INTERVAL '1 day'
GROUP BY symbol, side
ORDER BY trade_count DESC
LIMIT 100;
```

#### Partitionnement par Température

**Principe** : Stocker les données selon leur "température" (fréquence d'accès).

**Stratégie typique** :
- **Hot** : Données récentes (dernières 24-72h) - SSD, accès milliseconde
- **Warm** : Données récentes (7-30 jours) - Stockage standard, accès seconde
- **Cold** : Données historiques (>30 jours) - Archive, accès minutes/heures

**Exemple concret** : SecureLife Global met en œuvre un stockage multi-température :

```
Hot Storage (SSD):
- Données des 72 dernières heures
- Utilisé pour le reporting quotidien
- Accès en millisecondes

Warm Storage (Standard):
- Données des 30 derniers jours
- Utilisé pour les analyses opérationnelles
- Accès en secondes

Cold Storage (Archive):
- Données historiques (>30 jours)
- Utilisé pour les analyses actuarielles
- Accès en minutes
```

**Cas d'usage critique** : Calcul des ratios de sinistralité sur 10 ans avec un mélange de données chaudes et froides :

```sql
-- Calcul des ratios de sinistralité sur 10 ans
WITH hot_data AS (
    SELECT 
        p.product_line,
        f.period,
        f.premium_net,
        c.claims_amount
    FROM fact_premium f
    JOIN dim_policy p ON f.policy_sk = p.policy_sk
    JOIN fact_claims c ON f.policy_sk = c.policy_sk AND f.period = c.period
    WHERE f.period >= CURRENT_DATE - INTERVAL '72 hours'
),
warm_data AS (
    SELECT 
        p.product_line,
        f.period,
        f.premium_net,
        c.claims_amount
    FROM fact_premium f
    JOIN dim_policy p ON f.policy_sk = p.policy_sk
    JOIN fact_claims c ON f.policy_sk = c.policy_sk AND f.period = c.period
    WHERE f.period >= CURRENT_DATE - INTERVAL '30 days'
      AND f.period < CURRENT_DATE - INTERVAL '72 hours'
),
cold_data AS (
    SELECT 
        product_line,
        period,
        premium_net,
        claims_amount
    FROM fact_premium_archive
    WHERE period < CURRENT_DATE - INTERVAL '30 days'
)
SELECT 
    product_line,
    period,
    SUM(premium_net) AS total_premium,
    SUM(claims_amount) AS total_claims,
    SUM(claims_amount) / SUM(premium_net) AS loss_ratio
FROM (
    SELECT * FROM hot_data
    UNION ALL
    SELECT * FROM warm_data
    UNION ALL
    SELECT * FROM cold_data
) all_data
GROUP BY product_line, period
ORDER BY period DESC;
```

---

## Partie 4 : Gouvernance des Données dans la Modélisation

### 4.1 Qualité des Données

#### Validation des Données

**Principe** : Mettre en place des règles de validation au niveau du modèle.

**Types de validation** :
- **Complétude** : Vérifier que les champs obligatoires sont présents
- **Validité** : Vérifier que les valeurs sont dans les plages attendues
- **Unicité** : Vérifier qu'il n'y a pas de doublons
- **Consistance** : Vérifier la cohérence entre les champs

**Exemple concret** : WealthBuilder Pro implémente des contraintes de validation dans ses tables :

```sql
-- PostgreSQL
CREATE TABLE fact_trades (
    trade_id SERIAL PRIMARY KEY,
    account_id INT NOT NULL,
    symbol VARCHAR(10) NOT NULL,
    trade_time TIMESTAMP NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    side VARCHAR(4) NOT NULL CHECK (side IN ('BUY', 'SELL')),
    CONSTRAINT unique_trade UNIQUE (account_id, trade_time, symbol, quantity, price, side)
);

-- Ajout de triggers pour validation métier
CREATE FUNCTION validate_trade() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.side = 'BUY' AND NEW.quantity > 10000 THEN
        RAISE EXCEPTION 'Large buy orders require special approval';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trade_validation
BEFORE INSERT ON fact_trades
FOR EACH ROW EXECUTE FUNCTION validate_trade();
```

#### Nettoyage Automatique

**Principe** : Mettre en place des processus de nettoyage automatisés.

**Stratégies** :
- **Correction automatique** : Appliquer des règles de transformation
- **Mise en quarantaine** : Isoler les données problématiques
- **Alerting** : Notifier les équipes en cas de problèmes

**Exemple concret** : SecureLife Global utilise des vues matérialisées pour le nettoyage :

```sql
-- Vue matérialisée pour les données nettoyées
CREATE MATERIALIZED VIEW fact_premium_clean AS
SELECT 
    policy_sk,
    period,
    -- Correction automatique des primes négatives
    CASE WHEN premium_net < 0 THEN 0 ELSE premium_net END AS premium_net,
    -- Correction des primes excessives
    CASE WHEN premium_gross > 1000000 THEN premium_gross * 0.95 ELSE premium_gross END AS premium_gross,
    acquisition_costs,
    commission
FROM fact_premium
-- Filtrer les données incomplètes
WHERE policy_sk IS NOT NULL
  AND period IS NOT NULL
  AND premium_net IS NOT NULL
  AND premium_gross IS NOT NULL;

-- Rafraîchir la vue toutes les nuits
REFRESH MATERIALIZED VIEW CONCURRENTLY fact_premium_clean;
```

#### Monitoring Continu

**Principe** : Surveiller en continu la qualité des données.

**Métriques clés** :
- Taux de complétude
- Taux de validité
- Taux d'unicité
- Taux de consistance
- Fraîcheur des données

**Exemple concret** : SkillForge Academy implémente un tableau de bord de qualité :

```sql
-- Table de monitoring de la qualité
CREATE TABLE data_quality_metrics (
    metric_id SERIAL PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    column_name VARCHAR(100),
    metric_value NUMERIC NOT NULL,
    metric_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Procédure stockée pour collecter les métriques
CREATE OR REPLACE PROCEDURE collect_data_quality_metrics()
LANGUAGE plpgsql
AS $$
BEGIN
    -- Complétude des quiz scores
    INSERT INTO data_quality_metrics (metric_name, table_name, column_name, metric_value)
    SELECT 
        'Completeness',
        'fact_learning_events',
        'quiz_score',
        COUNT(*) FILTER (WHERE quiz_score IS NOT NULL) * 1.0 / COUNT(*) AS completeness
    FROM fact_learning_events
    WHERE event_timestamp >= CURRENT_DATE - INTERVAL '1 day';
    
    -- Validité des quiz scores
    INSERT INTO data_quality_metrics (metric_name, table_name, column_name, metric_value)
    SELECT 
        'Validity',
        'fact_learning_events',
        'quiz_score',
        COUNT(*) FILTER (WHERE quiz_score BETWEEN 0 AND 1) * 1.0 / COUNT(*) AS validity
    FROM fact_learning_events
    WHERE event_timestamp >= CURRENT_DATE - INTERVAL '1 day';
END;
$$;

-- Planifier la collecte toutes les heures
SELECT cron.schedule(
    'data_quality_metrics',
    '0 * * * *',
    $$CALL collect_data_quality_metrics()$$
);
```

### 4.2 Sécurité et Conformité

#### Chiffrement des Données

**Principe** : Protéger les données sensibles au repos et en transit.

**Niveaux de chiffrement** :
- **Chiffrement au niveau du stockage** : AES-256 pour les données au repos
- **Chiffrement au niveau des colonnes** : Pour les données sensibles spécifiques
- **Chiffrement en transit** : TLS 1.3 pour les communications

**Exemple concret** : WealthBuilder Pro chiffre les données sensibles :

```sql
-- PostgreSQL avec pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE dim_customer (
    customer_sk UUID PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL,
    -- Chiffrement au niveau de la colonne
    ssn BYTEA,
    -- Données non sensibles en clair
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100)
);

-- Fonction pour insérer des données chiffrées
CREATE OR REPLACE FUNCTION encrypt_ssn(plain_text TEXT) RETURNS BYTEA AS $$
BEGIN
    RETURN pgp_sym_encrypt(plain_text, current_setting('app.encryption_key'));
END;
$$ LANGUAGE plpgsql;

-- Fonction pour récupérer des données chiffrées
CREATE OR REPLACE FUNCTION decrypt_ssn(encrypted_data BYTEA) RETURNS TEXT AS $$
BEGIN
    RETURN pgp_sym_decrypt(encrypted_data, current_setting('app.encryption_key'));
END;
$$ LANGUAGE plpgsql;
```

#### Contrôle d'Accès

**Principe** : Gérer finement qui peut accéder à quelles données.

**Mécanismes** :
- **RBAC (Role-Based Access Control)** : Attribution de permissions par rôle
- **ABAC (Attribute-Based Access Control)** : Contrôle basé sur des attributs
- **VPD (Virtual Private Database)** : Filtrage automatique des données

**Exemple concret** : SecureLife Global implémente un VPD pour le reporting par pays :

```sql
-- PostgreSQL Row Level Security
ALTER TABLE fact_premium ENABLE ROW LEVEL SECURITY;

-- Politique pour les analystes par pays
CREATE POLICY country_policy ON fact_premium
USING (
    policy_sk IN (
        SELECT policy_sk 
        FROM dim_policy 
        WHERE country_code = current_setting('app.country_code')
    )
);

-- Attribution de la politique aux rôles
GRANT SELECT ON fact_premium TO analyst_role;

-- Définir le pays_code au niveau de la session
SET app.country_code = 'FR';
```

#### Audit Trail

**Principe** : Suivre toutes les modifications des données sensibles.

**Composants clés** :
- **Journalisation des accès** : Qui a accédé à quelles données
- **Journalisation des modifications** : Quelles modifications ont été faites
- **Rétention des logs** : Respect des exigences réglementaires

**Exemple concret** : WealthBuilder Pro met en place un audit trail complet :

```sql
-- Table d'audit
CREATE TABLE audit_trail (
    audit_id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id VARCHAR(100) NOT NULL,
    operation VARCHAR(10) NOT NULL, -- INSERT, UPDATE, DELETE
    old_values JSONB,
    new_values JSONB,
    changed_by VARCHAR(100) NOT NULL,
    changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Trigger pour les opérations sur fact_trades
CREATE OR REPLACE FUNCTION log_trade_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_trail (table_name, record_id, operation, old_values, changed_by)
        VALUES ('fact_trades', OLD.trade_id::TEXT, 'DELETE', to_jsonb(OLD), current_user);
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit_trail (table_name, record_id, operation, old_values, new_values, changed_by)
        VALUES ('fact_trades', NEW.trade_id::TEXT, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW), current_user);
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO audit_trail (table_name, record_id, operation, new_values, changed_by)
        VALUES ('fact_trades', NEW.trade_id::TEXT, 'INSERT', to_jsonb(NEW), current_user);
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trade_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON fact_trades
FOR EACH ROW EXECUTE FUNCTION log_trade_changes();
```

---

## Partie 5 : Exercices Pratiques

### Exercice 1 : Modélisation pour une Plateforme E-commerce (Niveau Intermédiaire)

**Contexte** : Vous travaillez pour une plateforme e-commerce avec 10M de clients et 1M de produits. Le système doit supporter :
- Un catalogue de produits avec des variantes (couleur, taille)
- Un système de recommandations en temps réel
- Un système de gestion des stocks multi-entrepôts
- Un système de notation et de commentaires
- Des analyses de parcours client

**Tâche** : Concevez un modèle de données complet en spécifiant :
1. Les tables de faits et de dimensions
2. Les techniques d'historisation à utiliser
3. Les stratégies de partitionnement et d'indexation
4. Les mécanismes de qualité des données
5. Les considérations de sécurité et conformité

### Exercice 2 : Optimisation d'une Requête Complexe (Niveau Avancé)

**Contexte** : Une requête analytique critique sur les comportements d'achat prend 15 minutes à s'exécuter, alors que le SLA est de 30 secondes.

**Tâche** : Optimisez cette requête :

```sql
SELECT
    p.category,
    p.brand,
    c.region,
    DATE_TRUNC('month', o.order_date) AS month,
    COUNT(DISTINCT o.order_id) AS total_orders,
    SUM(oi.quantity * oi.unit_price) AS total_revenue,
    COUNT(DISTINCT o.customer_id) AS unique_customers,
    SUM(oi.quantity * oi.unit_price) / COUNT(DISTINCT o.order_id) AS avg_order_value,
    COUNT(DISTINCT o.customer_id) FILTER (WHERE o.order_date >= CURRENT_DATE - INTERVAL '30 days') * 1.0 / 
        COUNT(DISTINCT o.customer_id) AS retention_rate
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id
JOIN customers c ON o.customer_id = c.customer_id
WHERE o.order_date >= '2024-01-01'
    AND o.status = 'completed'
GROUP BY p.category, p.brand, c.region, DATE_TRUNC('month', o.order_date)
HAVING COUNT(DISTINCT o.order_id) > 100
ORDER BY total_revenue DESC;
```

### Exercice 3 : Modélisation pour une Application de Santé (Niveau Expert)

**Contexte** : Vous concevez un système pour une application de santé connectée avec :
- 1M d'utilisateurs portant des capteurs IoT
- Données de fréquence cardiaque, sommeil, activité
- Intégration avec des dossiers médicaux électroniques (HL7/FHIR)
- Analyse prédictive des risques de santé
- Alertes en temps réel pour les anomalies

**Tâche** : Concevez un modèle de données qui :
1. Supporte les exigences de latence (<1 seconde pour les alertes critiques)
2. Gère l'historisation complète des données de santé
3. Respecte les réglementations HIPAA et GDPR
4. Permet l'analyse prédictive sur des données historiques
5. Optimise le stockage des données IoT à haut débit

---

## Solutions des Exercices

### Solution Exercice 1 : Modélisation pour une Plateforme E-commerce

**1. Modèle de Données**

```
FACT_SALES
- order_sk (clé primaire)
- date_sk (clé étrangère vers DIM_DATE)
- product_sk (clé étrangère vers DIM_PRODUCT)
- customer_sk (clé étrangère vers DIM_CUSTOMER)
- store_sk (clé étrangère vers DIM_STORE)
- order_id (business key)
- quantity
- unit_price
- discount
- tax
- shipping_cost
- SCD_TYPE_2 (effective_date, expiry_date, is_current)

DIM_PRODUCT
- product_sk (clé primaire)
- product_id (business key)
- product_name
- category
- brand
- description
- base_price
- SCD_TYPE_2 (effective_date, expiry_date, is_current)

DIM_PRODUCT_VARIANT
- variant_sk (clé primaire)
- variant_id (business key)
- product_sk (clé étrangère)
- color
- size
- stock_quantity
- SCD_TYPE_2 (effective_date, expiry_date, is_current)

DIM_CUSTOMER
- customer_sk (clé primaire)
- customer_id (business key)
- first_name
- last_name
- email
- phone
- address
- registration_date
- SCD_TYPE_2 (effective_date, expiry_date, is_current)

FACT_RECOMMENDATIONS
- recommendation_id (clé primaire)
- customer_sk (clé étrangère)
- product_sk (clé étrangère)
- recommendation_time
- recommendation_type (collaborative, content-based, popular)
- click_flag
- purchase_flag
- confidence_score
```

**2. Techniques d'Historisation**

- **DIM_PRODUCT et DIM_CUSTOMER** : SCD Type 2 pour suivre l'historique complet des changements
- **DIM_PRODUCT_VARIANT** : SCD Type 2 pour gérer les changements de stock et de prix
- **FACT_SALES** : Pas d'historisation nécessaire (les transactions sont immuables)
- **FACT_RECOMMENDATIONS** : Historisation complète avec dates précises pour l'analyse A/B

**3. Stratégies de Partitionnement et d'Indexation**

```sql
-- Partitionnement
CREATE TABLE fact_sales (
    ...
) PARTITION BY RANGE (date_sk);

CREATE TABLE dim_product (
    ...
) CLUSTER BY (category, brand);

-- Indexation
CREATE INDEX idx_fact_sales_date_product ON fact_sales (date_sk, product_sk);
CREATE INDEX idx_fact_sales_customer ON fact_sales (customer_sk) INCLUDE (total_amount);
CREATE INDEX idx_dim_product_category ON dim_product (category) INCLUDE (brand, price);
```

**4. Mécanismes de Qualité des Données**

```sql
-- Validation des données
ALTER TABLE fact_sales 
ADD CONSTRAINT valid_quantity CHECK (quantity > 0),
ADD CONSTRAINT valid_price CHECK (unit_price > 0);

-- Nettoyage automatique
CREATE MATERIALIZED VIEW fact_sales_clean AS
SELECT * FROM fact_sales
WHERE order_id IS NOT NULL
  AND product_sk IS NOT NULL
  AND customer_sk IS NOT NULL
  AND quantity > 0
  AND unit_price > 0;

-- Monitoring
INSERT INTO data_quality_metrics
SELECT 
    'Completeness',
    'fact_sales',
    'order_id',
    COUNT(*) FILTER (WHERE order_id IS NOT NULL) * 1.0 / COUNT(*)
FROM fact_sales;
```

**5. Sécurité et Conformité**

- **Chiffrement** : AES-256 pour les données sensibles (emails, numéros de carte)
- **RBAC** : Rôles définis pour les analystes, les managers, les data scientists
- **VPD** : Filtrage automatique par région pour les rapports
- **Audit trail** : Journalisation de tous les accès aux données sensibles
- **Conformité GDPR** : Mécanismes de suppression des données à la demande

### Solution Exercice 2 : Optimisation d'une Requête Complexe

**Analyse du problème** :
- Jointures multiples sur de grandes tables
- Agrégations sur des colonnes non indexées
- Filtres non optimisés
- Fonctions de fenêtrage non nécessaires

**Optimisations proposées** :

1. **Création d'indexes stratégiques** :
```sql
CREATE INDEX idx_orders_date_status ON orders(order_date, status) 
WHERE status = 'completed';

CREATE INDEX idx_order_items_order ON order_items(order_id) 
INCLUDE (product_id, quantity, unit_price);

CREATE INDEX idx_products_category_brand ON products(category, brand) 
INCLUDE (product_id);

CREATE INDEX idx_customers_region ON customers(region) 
INCLUDE (customer_id);
```

2. **Materialized View pour les calculs fréquents** :
```sql
CREATE MATERIALIZED VIEW sales_analytics_mv AS
SELECT
    p.category,
    p.brand,
    c.region,
    DATE_TRUNC('month', o.order_date) AS month,
    o.order_id,
    o.customer_id,
    oi.quantity,
    oi.unit_price
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id
JOIN customers c ON o.customer_id = c.customer_id
WHERE o.status = 'completed'
  AND o.order_date >= '2024-01-01';

REFRESH MATERIALIZED VIEW CONCURRENTLY sales_analytics_mv;
```

3. **Réécriture de la requête avec CTE** :
```sql
WITH monthly_sales AS (
    SELECT
        category,
        brand,
        region,
        month,
        order_id,
        customer_id,
        quantity,
        unit_price
    FROM sales_analytics_mv
    WHERE month >= '2024-01-01'
),
aggregated_sales AS (
    SELECT
        category,
        brand,
        region,
        month,
        COUNT(order_id) AS total_orders,
        SUM(quantity * unit_price) AS total_revenue,
        COUNT(DISTINCT customer_id) AS unique_customers
    FROM monthly_sales
    GROUP BY category, brand, region, month
    HAVING COUNT(order_id) > 100
),
recent_customers AS (
    SELECT
        category,
        brand,
        region,
        month,
        COUNT(DISTINCT customer_id) FILTER (WHERE order_date >= CURRENT_DATE - INTERVAL '30 days') AS recent_customers
    FROM monthly_sales
    GROUP BY category, brand, region, month
)
SELECT
    a.category,
    a.brand,
    a.region,
    a.month,
    a.total_orders,
    a.total_revenue,
    a.unique_customers,
    a.total_revenue / a.total_orders AS avg_order_value,
    r.recent_customers * 1.0 / a.unique_customers AS retention_rate
FROM aggregated_sales a
JOIN recent_customers r 
    ON a.category = r.category 
    AND a.brand = r.brand 
    AND a.region = r.region 
    AND a.month = r.month
ORDER BY a.total_revenue DESC;
```

4. **Partitionnement des tables** :
- Partitionner orders par order_date (mois)
- Partitionner order_items par order_id

**Résultat attendu** : Réduction du temps d'exécution de 15 minutes à <25 secondes

### Solution Exercice 3 : Modélisation pour une Application de Santé

**1. Modèle de Données pour les Alertes en Temps Réel**

```sql
-- Table optimisée pour les alertes en temps réel
CREATE TABLE fact_health_events (
    event_id UUID PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    event_type VARCHAR(50) NOT NULL, -- heart_rate, sleep, activity
    event_time TIMESTAMP NOT NULL,
    value NUMERIC NOT NULL,
    unit VARCHAR(20) NOT NULL,
    device_id VARCHAR(50) NOT NULL,
    confidence_score NUMERIC,
    anomaly_flag BOOLEAN DEFAULT false,
    -- Optimisé pour les requêtes en temps réel
    INDEX idx_user_time (user_id, event_time DESC),
    INDEX idx_anomaly (anomaly_flag, event_time DESC)
) WITH (
    partitioning = 'DAILY',
    retention = '7d' -- Données chaudes uniquement
);
```

**2. Modèle pour l'Historisation Complète**

```sql
-- Table pour l'historique complet
CREATE TABLE fact_health_history (
    event_id UUID PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    event_time TIMESTAMP NOT NULL,
    value NUMERIC NOT NULL,
    unit VARCHAR(20) NOT NULL,
    device_id VARCHAR(50) NOT NULL,
    -- Données structurées pour l'analyse
    metadata JSONB,
    -- Partitionnement par mois pour l'historique
    PARTITION BY DATE_TRUNC('month', event_time),
    -- Clustering pour les requêtes analytiques
    CLUSTER BY (user_id, event_type)
) WITH (
    storage = 'columnar',
    compression = 'zstd'
);
```

**3. Respect des Réglementations HIPAA et GDPR**

```sql
-- Table utilisateur avec chiffrement
CREATE TABLE dim_user (
    user_sk UUID PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    -- Données sensibles chiffrées
    ssn_encrypted BYTEA,
    medical_record_number_encrypted BYTEA,
    -- Données non sensibles
    age INT,
    gender VARCHAR(20),
    height_cm INT,
    weight_kg INT,
    -- Consentement explicite pour chaque usage
    analytics_consent BOOLEAN DEFAULT false,
    research_consent BOOLEAN DEFAULT false,
    consent_timestamp TIMESTAMP
);

-- Fonctions de chiffrement/déchiffrement sécurisées
CREATE OR REPLACE FUNCTION encrypt_health_data(plain_text TEXT) 
RETURNS BYTEA AS $$
BEGIN
    RETURN pgp_sym_encrypt(plain_text, current_setting('app.health_key'));
END;
$$ LANGUAGE plpgsql;

-- Politiques de sécurité strictes
ALTER TABLE fact_health_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_data_policy ON fact_health_events
USING (user_id = current_setting('app.user_id'));
```

**4. Modèle pour l'Analyse Prédictive**

```sql
-- Table optimisée pour le machine learning
CREATE TABLE fact_health_features (
    user_id VARCHAR(50) NOT NULL,
    feature_date DATE NOT NULL,
    -- Features pour la prédiction des risques
    avg_heart_rate_7d NUMERIC,
    heart_rate_variability_7d NUMERIC,
    sleep_quality_7d NUMERIC,
    activity_level_7d NUMERIC,
    -- Labels pour l'entraînement
    hypertension_risk NUMERIC,
    diabetes_risk NUMERIC,
    heart_disease_risk NUMERIC,
    -- Méta-informations
    model_version VARCHAR(50),
    feature_calculation_time TIMESTAMP,
    PRIMARY KEY (user_id, feature_date)
) WITH (
    partitioning = 'MONTHLY',
    clustering = (user_id)
);
```

**5. Optimisation du Stockage pour les Données IoT**

```sql
-- Stratégie de stockage multi-température
CREATE TABLE fact_health_iot (
    event_id UUID PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    event_time TIMESTAMP NOT NULL,
    value NUMERIC NOT NULL,
    unit VARCHAR(20) NOT NULL,
    device_id VARCHAR(50) NOT NULL,
    -- Données brutes IoT
    raw_data BYTEA
) 
-- Stockage chaud pour les 7 derniers jours
PARTITION hot_data FOR VALUES FROM ('2024-01-01') TO ('2024-01-08')
WITH (storage = 'ssd', retention = '7d'),
-- Stockage tiède pour les 90 derniers jours
PARTITION warm_data FOR VALUES FROM ('2023-10-01') TO ('2024-01-01')
WITH (storage = 'standard', retention = '90d'),
-- Stockage froid pour l'historique
PARTITION cold_data FOR VALUES LESS THAN ('2023-10-01')
WITH (storage = 'archive', retention = '7y');
```

**Architecture Complète et Justification** :

1. **Séparation des données en temps réel et historiques** :
   - Données temps réel dans une table optimisée pour les écritures fréquentes
   - Données historiques dans un format columnar pour l'analyse
   - Cette séparation permet d'atteindre la latence requise <1 seconde pour les alertes

2. **Chiffrement granulaire** :
   - Données sensibles chiffrées au niveau de la colonne
   - Clés de chiffrement gérées par un HSM (Hardware Security Module)
   - Respect strict des réglementations HIPAA et GDPR

3. **Gestion multi-température** :
   - Données récentes (7 jours) sur SSD pour les alertes
   - Données intermédiaires (90 jours) sur stockage standard
   - Données historiques sur stockage archive
   - Réduction des coûts de 60% tout en respectant les exigences

4. **Modèle de features pour le ML** :
   - Pré-calcul des features pour l'entraînement des modèles
   - Versioning des features pour la reproductibilité
   - Optimisé pour les requêtes analytiques sur de grands volumes

5. **Sécurité renforcée** :
   - RBAC strict avec rôles spécialisés
   - VPD pour le filtrage automatique par utilisateur
   - Audit trail complet pour tous les accès aux données
   - Conformité SOC 2 et HIPAA intégrée dans le modèle

---

## Conclusion : Les 10 Commandements de la Modélisation Avancée

1. **Comprendre le business avant la technologie** : Un modèle parfait qui ne résout pas le bon problème est un échec.

2. **Make it work, make it right, make it fast** : Respectez cet ordre sacré dans votre développement.

3. **Documentez chaque décision** : Les futurs mainteneurs (y compris vous-même) vous remercieront.

4. **Anticipez l'évolution** : Concevez pour le changement, pas pour la stabilité.

5. **Automatisez la qualité** : La qualité data ne s'ajoute pas, elle se construit.

6. **Mesurez tout** : Ce qui n'est pas mesuré ne peut pas être amélioré.

7. **Privilégiez la simplicité** : L'architecture la plus simple qui fonctionne est généralement la meilleure.

8. **Collaborez avec les data scientists** : Un modèle ML n'est pas meilleur que les données qui l'alimentent.

9. **Maîtrisez les fondamentaux** : Les algorithmes et structures de données restent la base de tout.

10. **Restez curieux** : Le domaine évolue trop vite pour se reposer sur ses lauriers.

### Checklist Finale pour une Modélisation de Qualité

- [ ] J'ai clarifié le contexte business avant de proposer un modèle
- [ ] J'ai identifié les utilisateurs finaux et leurs besoins
- [ ] J'ai choisi le pattern de modélisation adapté au cas d'usage
- [ ] J'ai implémenté des mécanismes d'historisation appropriés
- [ ] J'ai conçu des stratégies de partitionnement et d'indexation
- [ ] J'ai intégré la qualité des données dès la conception
- [ ] J'ai respecté les exigences de sécurité et de conformité
- [ ] J'ai documenté chaque décision de modélisation
- [ ] J'ai testé le modèle avec des scénarios réels
- [ ] J'ai prévu une évolution future du modèle

---

## Ressources Complémentaires

### Documentation à Garder Ouverte
- [Data Vault 2.0 Documentation](https://www.volatileminds.net/data-vault-2-0/)
- [Anchor Modeling Whitepaper](https://www.anchormodeling.com/)
- [Snowflake Performance Best Practices](https://docs.snowflake.com/en/user-guide/best-practices.html)
- [BigQuery Optimization Guide](https://cloud.google.com/bigquery/docs/best-practices-performance-overview)

### GitHub Repos à Étudier
- [Data Vault 2.0 Implementation Examples](https://github.com/EnterpriseDataArchitects/DataVault)
- [Anchor Modeling Reference Implementation](https://github.com/anchor-modeling)
- [Advanced SQL Patterns for Analytics](https://github.com/gkotian/great-sql-puzzles)

### Outils Recommandés
- **dbt** : Pour la modélisation SQL moderne
- **Great Expectations** : Pour la qualité des données
- **Soda Core** : Pour le monitoring des données
- **DataHub** : Pour la gouvernance des données

**Dernier conseil** : La modélisation des données est à la fois une science et un art. Les règles fondamentales restent constantes, mais leur application varie selon le contexte. En maîtrisant ces concepts et en les adaptant intelligemment à chaque situation, vous deviendrez un expert capable de résoudre même les problèmes les plus complexes. Continuez à pratiquer, à expérimenter, et à apprendre - le monde des données a besoin de modélisateurs compétents !