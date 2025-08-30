# 🎯 **Niveau 5 : Préparation Entretiens & Tests Techniques**

## 📚 **Guide Complet de Préparation aux Entretiens Data Engineering**

Ce niveau vous prépare aux entretiens techniques les plus exigeants du marché. Chaque exercice est conçu pour simuler les conditions réelles d'un entretien, avec un contexte business clair, des questions progressives, et des solutions détaillées.

---

## 🗄️ **Section 1 : SQL Avancé - 20 Exercices Pratiques**

### **Exercice 1 : Analyse des Ventes E-commerce**

**Contexte Business :**
Vous travaillez pour une plateforme e-commerce qui souhaite analyser les performances de vente par catégorie de produits et par région. L'équipe marketing a besoin de comprendre les tendances saisonnières et d'identifier les opportunités d'amélioration.

**Tables disponibles :**
```sql
-- Table des commandes
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    user_id INT,
    product_id INT,
    quantity INT,
    unit_price DECIMAL(10,2),
    order_date DATE,
    region VARCHAR(50),
    status VARCHAR(20)
);

-- Table des produits
CREATE TABLE products (
    product_id INT PRIMARY KEY,
    product_name VARCHAR(100),
    category VARCHAR(50),
    brand VARCHAR(50)
);

-- Table des utilisateurs
CREATE TABLE users (
    user_id INT PRIMARY KEY,
    registration_date DATE,
    user_type VARCHAR(20) -- 'new', 'returning', 'vip'
);
```

**Question 1.1 : Calcul des Métriques de Vente**
Écrivez une requête qui calcule pour chaque mois de 2024 :
- Le nombre total de commandes
- Le chiffre d'affaires total
- Le panier moyen
- Le nombre de clients uniques

**Solution :**
```sql
WITH monthly_metrics AS (
    SELECT 
        DATE_TRUNC('month', order_date) as month,
        COUNT(*) as total_orders,
        SUM(quantity * unit_price) as total_revenue,
        COUNT(DISTINCT user_id) as unique_customers
    FROM orders 
    WHERE order_date >= '2024-01-01' 
        AND order_date < '2025-01-01'
        AND status = 'completed'
    GROUP BY DATE_TRUNC('month', order_date)
)
SELECT 
    month,
    total_orders,
    total_revenue,
    ROUND(total_revenue / total_orders, 2) as avg_order_value,
    unique_customers
FROM monthly_metrics
ORDER BY month;
```

**Question 1.2 : Analyse des Tendances Saisonnières**
Identifiez les 3 mois avec les meilleures performances de vente et calculez la croissance en pourcentage par rapport au mois précédent.

**Solution :**
```sql
WITH monthly_metrics AS (
    SELECT 
        DATE_TRUNC('month', order_date) as month,
        SUM(quantity * unit_price) as total_revenue
    FROM orders 
    WHERE order_date >= '2024-01-01' 
        AND order_date < '2025-01-01'
        AND status = 'completed'
    GROUP BY DATE_TRUNC('month', order_date)
),
ranked_months AS (
    SELECT 
        month,
        total_revenue,
        LAG(total_revenue) OVER (ORDER BY month) as prev_month_revenue,
        ROW_NUMBER() OVER (ORDER BY total_revenue DESC) as revenue_rank
    FROM monthly_metrics
)
SELECT 
    month,
    total_revenue,
    ROUND(
        ((total_revenue - prev_month_revenue) / prev_month_revenue) * 100, 2
    ) as growth_percentage
FROM ranked_months
WHERE revenue_rank <= 3
ORDER BY revenue_rank;
```

**Question 1.3 : Segmentation des Clients par Valeur**
Créez une segmentation des clients basée sur leur valeur totale d'achat :
- Bronze : < 100€
- Silver : 100€ - 500€  
- Gold : 500€ - 1000€
- Platinum : > 1000€

**Solution :**
```sql
WITH customer_segments AS (
    SELECT 
        u.user_id,
        u.user_type,
        COALESCE(SUM(o.quantity * o.unit_price), 0) as total_spent,
        CASE 
            WHEN COALESCE(SUM(o.quantity * o.unit_price), 0) < 100 THEN 'Bronze'
            WHEN COALESCE(SUM(o.quantity * o.unit_price), 0) < 500 THEN 'Silver'
            WHEN COALESCE(SUM(o.quantity * o.unit_price), 0) < 1000 THEN 'Gold'
            ELSE 'Platinum'
        END as segment
    FROM users u
    LEFT JOIN orders o ON u.user_id = o.user_id 
        AND o.status = 'completed'
    GROUP BY u.user_id, u.user_type
)
SELECT 
    segment,
    COUNT(*) as customer_count,
    ROUND(AVG(total_spent), 2) as avg_spent,
    ROUND(SUM(total_spent), 2) as total_revenue
FROM customer_segments
GROUP BY segment
ORDER BY 
    CASE segment
        WHEN 'Platinum' THEN 1
        WHEN 'Gold' THEN 2
        WHEN 'Silver' THEN 3
        WHEN 'Bronze' THEN 4
    END;
```

---

### **Exercice 2 : Analyse des Performances de Produits**

**Contexte Business :**
L'équipe produit souhaite analyser la performance des produits par catégorie et identifier les produits les plus rentables. Ils veulent également comprendre la distribution des prix et l'impact des promotions.

**Question 2.1 : Top 10 des Produits les Plus Vendus**
Identifiez les 10 produits qui ont généré le plus de revenus, avec leur catégorie et leur performance relative.

**Solution :**
```sql
WITH product_performance AS (
    SELECT 
        p.product_id,
        p.product_name,
        p.category,
        p.brand,
        COUNT(DISTINCT o.order_id) as order_count,
        SUM(o.quantity) as total_quantity,
        SUM(o.quantity * o.unit_price) as total_revenue,
        ROUND(AVG(o.unit_price), 2) as avg_price
    FROM products p
    JOIN orders o ON p.product_id = o.product_id
    WHERE o.status = 'completed'
    GROUP BY p.product_id, p.product_name, p.category, p.brand
),
ranked_products AS (
    SELECT 
        *,
        ROW_NUMBER() OVER (ORDER BY total_revenue DESC) as revenue_rank,
        ROUND(
            (total_revenue / SUM(total_revenue) OVER()) * 100, 2
        ) as revenue_percentage
    FROM product_performance
)
SELECT 
    product_name,
    category,
    brand,
    order_count,
    total_quantity,
    total_revenue,
    avg_price,
    revenue_percentage
FROM ranked_products
WHERE revenue_rank <= 10
ORDER BY revenue_rank;
```

**Question 2.2 : Analyse des Prix par Catégorie**
Calculez les statistiques de prix (min, max, moyenne, médiane) pour chaque catégorie de produits.

**Solution :**
```sql
WITH price_stats AS (
    SELECT 
        p.category,
        o.unit_price,
        COUNT(*) as price_count
    FROM products p
    JOIN orders o ON p.product_id = o.product_id
    WHERE o.status = 'completed'
),
category_prices AS (
    SELECT 
        category,
        unit_price,
        price_count,
        ROW_NUMBER() OVER (PARTITION BY category ORDER BY unit_price) as price_rank,
        SUM(price_count) OVER (PARTITION BY category) as total_count
    FROM price_stats
),
category_medians AS (
    SELECT 
        category,
        unit_price as median_price
    FROM category_prices
    WHERE price_rank = CEIL(total_count / 2.0)
)
SELECT 
    p.category,
    MIN(p.unit_price) as min_price,
    MAX(p.unit_price) as max_price,
    ROUND(AVG(p.unit_price), 2) as avg_price,
    m.median_price,
    COUNT(DISTINCT p.product_id) as product_count
FROM products p
JOIN orders o ON p.product_id = o.product_id
JOIN category_medians m ON p.category = m.category
WHERE o.status = 'completed'
GROUP BY p.category, m.median_price
ORDER BY avg_price DESC;
```

---

### **Exercice 3 : Analyse Temporelle et Cohortes**

**Contexte Business :**
L'équipe marketing souhaite analyser le comportement des utilisateurs dans le temps, notamment la rétention et la valeur vie client (LTV). Ils veulent identifier les patterns de fidélisation.

**Question 3.1 : Analyse de Cohortes par Mois d'Inscription**
Créez une analyse de cohortes qui montre la rétention des utilisateurs par mois d'inscription sur 6 mois.

**Solution :**
```sql
WITH user_cohorts AS (
    SELECT 
        user_id,
        DATE_TRUNC('month', registration_date) as cohort_month,
        DATE_TRUNC('month', order_date) as order_month,
        COUNT(DISTINCT order_id) as orders_count,
        SUM(quantity * unit_price) as revenue
    FROM users u
    JOIN orders o ON u.user_id = o.user_id
    WHERE o.status = 'completed'
    GROUP BY user_id, cohort_month, order_month
),
cohort_analysis AS (
    SELECT 
        cohort_month,
        order_month,
        COUNT(DISTINCT user_id) as active_users,
        SUM(revenue) as total_revenue,
        EXTRACT(MONTH FROM AGE(order_month, cohort_month)) as month_number
    FROM user_cohorts
    GROUP BY cohort_month, order_month
),
cohort_retention AS (
    SELECT 
        cohort_month,
        month_number,
        active_users,
        FIRST_VALUE(active_users) OVER (PARTITION BY cohort_month ORDER BY month_number) as cohort_size,
        ROUND(
            (active_users::DECIMAL / FIRST_VALUE(active_users) OVER (PARTITION BY cohort_month ORDER BY month_number)) * 100, 2
        ) as retention_rate
    FROM cohort_analysis
    WHERE month_number <= 6
)
SELECT 
    cohort_month,
    month_number,
    active_users,
    cohort_size,
    retention_rate
FROM cohort_retention
ORDER BY cohort_month, month_number;
```

**Question 3.2 : Calcul de la Valeur Vie Client (LTV)**
Calculez la LTV moyenne par cohorte d'inscription et identifiez les cohortes les plus rentables.

**Solution :**
```sql
WITH user_ltv AS (
    SELECT 
        u.user_id,
        DATE_TRUNC('month', u.registration_date) as cohort_month,
        COUNT(DISTINCT o.order_id) as total_orders,
        SUM(o.quantity * o.unit_price) as total_revenue,
        MAX(o.order_date) - u.registration_date as customer_lifespan
    FROM users u
    JOIN orders o ON u.user_id = o.user_id
    WHERE o.status = 'completed'
    GROUP BY u.user_id, u.registration_date
),
cohort_ltv AS (
    SELECT 
        cohort_month,
        COUNT(DISTINCT user_id) as cohort_size,
        ROUND(AVG(total_orders), 2) as avg_orders,
        ROUND(AVG(total_revenue), 2) as avg_ltv,
        ROUND(AVG(customer_lifespan), 0) as avg_lifespan_days
    FROM user_ltv
    GROUP BY cohort_month
)
SELECT 
    cohort_month,
    cohort_size,
    avg_orders,
    avg_ltv,
    avg_lifespan_days,
    ROUND(avg_ltv / NULLIF(avg_lifespan_days, 0) * 30, 2) as monthly_ltv
FROM cohort_ltv
ORDER BY avg_ltv DESC;
```

---

## 🐍 **Section 2 : Python Data Engineering - 15 Problèmes Pratiques**

### **Problème 1 : Pipeline ETL avec Gestion d'Erreurs**

**Contexte :**
Vous devez créer un pipeline ETL qui extrait des données depuis une API, les transforme, et les charge dans une base de données. Le pipeline doit être robuste et gérer les erreurs de manière appropriée.

**Exigences :**
- Gestion des erreurs de connexion API
- Retry automatique avec backoff exponentiel
- Logging structuré
- Validation des données
- Rollback en cas d'échec

**Solution :**
```python
import requests
import pandas as pd
import logging
import time
from typing import Dict, List, Optional
from dataclasses import dataclass
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import execute_batch

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@dataclass
class PipelineConfig:
    api_url: str
    api_key: str
    db_connection: str
    max_retries: int = 3
    retry_delay: int = 5
    batch_size: int = 1000

class DataExtractor:
    def __init__(self, config: PipelineConfig):
        self.config = config
        self.session = requests.Session()
        self.session.headers.update({'Authorization': f'Bearer {config.api_key}'})
    
    def extract_with_retry(self, endpoint: str) -> Optional[List[Dict]]:
        """Extrait des données avec retry automatique"""
        for attempt in range(self.config.max_retries):
            try:
                response = self.session.get(f"{self.config.api_url}/{endpoint}")
                response.raise_for_status()
                logger.info(f"Données extraites avec succès depuis {endpoint}")
                return response.json()
            
            except requests.exceptions.RequestException as e:
                logger.warning(f"Tentative {attempt + 1} échouée: {e}")
                if attempt < self.config.max_retries - 1:
                    delay = self.config.retry_delay * (2 ** attempt)
                    logger.info(f"Réessai dans {delay} secondes...")
                    time.sleep(delay)
                else:
                    logger.error(f"Échec de l'extraction après {self.config.max_retries} tentatives")
                    return None
        
        return None

class DataTransformer:
    @staticmethod
    def transform_orders(raw_data: List[Dict]) -> pd.DataFrame:
        """Transforme les données brutes en DataFrame structuré"""
        if not raw_data:
            return pd.DataFrame()
        
        df = pd.DataFrame(raw_data)
        
        # Nettoyage et validation
        df['order_date'] = pd.to_datetime(df['order_date'], errors='coerce')
        df['amount'] = pd.to_numeric(df['amount'], errors='coerce')
        df['status'] = df['status'].str.lower()
        
        # Validation des données
        df = df.dropna(subset=['order_id', 'order_date', 'amount'])
        df = df[df['amount'] > 0]
        
        # Ajout de métadonnées
        df['processed_at'] = datetime.now()
        df['data_source'] = 'api_orders'
        
        logger.info(f"Données transformées: {len(df)} lignes valides")
        return df
    
    @staticmethod
    def validate_data(df: pd.DataFrame) -> bool:
        """Valide la qualité des données transformées"""
        validation_checks = [
            df['order_id'].notna().all(),
            df['order_date'].notna().all(),
            df['amount'].notna().all(),
            (df['amount'] > 0).all(),
            df['status'].isin(['pending', 'completed', 'cancelled']).all()
        ]
        
        is_valid = all(validation_checks)
        if not is_valid:
            logger.error("Validation des données échouée")
            for i, check in enumerate(validation_checks):
                if not check:
                    logger.error(f"Check {i+1} échoué")
        
        return is_valid

class DataLoader:
    def __init__(self, config: PipelineConfig):
        self.config = config
    
    def load_data(self, df: pd.DataFrame, table_name: str) -> bool:
        """Charge les données dans la base de données"""
        if df.empty:
            logger.warning("Aucune donnée à charger")
            return True
        
        try:
            with psycopg2.connect(self.config.db_connection) as conn:
                with conn.cursor() as cursor:
                    # Préparation de la requête d'insertion
                    columns = ', '.join(df.columns)
                    placeholders = ', '.join(['%s'] * len(df.columns))
                    insert_query = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})"
                    
                    # Insertion par batch
                    data_tuples = [tuple(row) for row in df.values]
                    execute_batch(cursor, insert_query, data_tuples, page_size=self.config.batch_size)
                    
                    conn.commit()
                    logger.info(f"{len(df)} lignes chargées dans {table_name}")
                    return True
        
        except Exception as e:
            logger.error(f"Erreur lors du chargement: {e}")
            return False

class ETLPipeline:
    def __init__(self, config: PipelineConfig):
        self.config = config
        self.extractor = DataExtractor(config)
        self.transformer = DataTransformer()
        self.loader = DataLoader(config)
    
    def run_pipeline(self, endpoint: str, table_name: str) -> bool:
        """Exécute le pipeline ETL complet"""
        logger.info(f"Démarrage du pipeline pour {endpoint}")
        
        try:
            # Extraction
            raw_data = self.extractor.extract_with_retry(endpoint)
            if raw_data is None:
                return False
            
            # Transformation
            df = self.transformer.transform_orders(raw_data)
            if df.empty:
                logger.warning("Aucune donnée après transformation")
                return False
            
            # Validation
            if not self.transformer.validate_data(df):
                return False
            
            # Chargement
            if not self.loader.load_data(df, table_name):
                return False
            
            logger.info("Pipeline exécuté avec succès")
            return True
        
        except Exception as e:
            logger.error(f"Erreur dans le pipeline: {e}")
            return False

# Utilisation du pipeline
if __name__ == "__main__":
    config = PipelineConfig(
        api_url="https://api.example.com",
        api_key="your_api_key",
        db_connection="postgresql://user:pass@localhost/db",
        max_retries=3,
        retry_delay=5,
        batch_size=1000
    )
    
    pipeline = ETLPipeline(config)
    success = pipeline.run_pipeline("orders", "staging_orders")
    
    if success:
        print("Pipeline exécuté avec succès!")
    else:
        print("Pipeline échoué!")
```

---

### **Problème 2 : Optimisation de Performance Pandas**

**Contexte :**
Vous devez traiter un fichier CSV de 10GB contenant des données de transactions. Le code actuel est trop lent et consomme trop de mémoire. Optimisez-le pour la production.

**Exigences :**
- Traitement par chunks pour éviter l'overflow mémoire
- Optimisation des types de données
- Vectorisation des opérations
- Gestion efficace des ressources

**Solution :**
```python
import pandas as pd
import numpy as np
from typing import Iterator, Dict, Any
import logging
from pathlib import Path
import gc

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class OptimizedDataProcessor:
    def __init__(self, chunk_size: int = 100000):
        self.chunk_size = chunk_size
        
        # Types optimisés pour la mémoire
        self.optimized_dtypes = {
            'transaction_id': 'int32',
            'user_id': 'int32',
            'amount': 'float32',
            'category': 'category',
            'merchant_id': 'int32',
            'transaction_date': 'datetime64[ns]',
            'is_fraud': 'bool'
        }
    
    def process_large_file(self, file_path: Path, output_path: Path) -> None:
        """Traite un gros fichier par chunks optimisés"""
        logger.info(f"Début du traitement de {file_path}")
        
        # Compteurs pour le monitoring
        total_rows = 0
        total_amount = 0
        fraud_count = 0
        
        # Traitement par chunks
        for chunk_num, chunk in enumerate(self._read_chunks(file_path)):
            logger.info(f"Traitement du chunk {chunk_num + 1}")
            
            # Optimisation du chunk
            optimized_chunk = self._optimize_chunk(chunk)
            
            # Traitement business
            processed_chunk = self._process_chunk(processed_chunk)
            
            # Sauvegarde du chunk
            self._save_chunk(processed_chunk, output_path, chunk_num)
            
            # Mise à jour des métriques
            total_rows += len(processed_chunk)
            total_amount += processed_chunk['amount'].sum()
            fraud_count += processed_chunk['is_fraud'].sum()
            
            # Nettoyage mémoire
            del optimized_chunk, processed_chunk
            gc.collect()
        
        # Sauvegarde des métriques finales
        self._save_summary_stats(total_rows, total_amount, fraud_count, output_path)
        logger.info(f"Traitement terminé. {total_rows} lignes traitées")
    
    def _read_chunks(self, file_path: Path) -> Iterator[pd.DataFrame]:
        """Lit le fichier par chunks avec types optimisés"""
        return pd.read_csv(
            file_path,
            chunksize=self.chunk_size,
            dtype=self.optimized_dtypes,
            parse_dates=['transaction_date'],
            low_memory=False
        )
    
    def _optimize_chunk(self, chunk: pd.DataFrame) -> pd.DataFrame:
        """Optimise un chunk de données"""
        # Conversion des types
        for col, dtype in self.optimized_dtypes.items():
            if col in chunk.columns:
                try:
                    chunk[col] = chunk[col].astype(dtype)
                except Exception as e:
                    logger.warning(f"Impossible de convertir {col} en {dtype}: {e}")
        
        # Optimisation des catégories
        categorical_columns = chunk.select_dtypes(include=['object']).columns
        for col in categorical_columns:
            if chunk[col].nunique() / len(chunk) < 0.5:  # Si moins de 50% de valeurs uniques
                chunk[col] = chunk[col].astype('category')
        
        return chunk
    
    def _process_chunk(self, chunk: pd.DataFrame) -> pd.DataFrame:
        """Traite un chunk avec des opérations vectorisées"""
        # Calculs vectorisés (beaucoup plus rapides que apply)
        chunk['amount_usd'] = chunk['amount'] * 1.1  # Conversion EUR -> USD
        chunk['is_high_value'] = chunk['amount'] > 1000
        chunk['day_of_week'] = chunk['transaction_date'].dt.day_name()
        
        # Agrégations vectorisées
        chunk['user_avg_amount'] = chunk.groupby('user_id')['amount'].transform('mean')
        chunk['category_avg_amount'] = chunk.groupby('category')['amount'].transform('mean')
        
        # Filtrage vectorisé
        chunk = chunk[chunk['amount'] > 0]  # Suppression des montants négatifs
        
        return chunk
    
    def _save_chunk(self, chunk: pd.DataFrame, output_path: Path, chunk_num: int) -> None:
        """Sauvegarde un chunk optimisé"""
        chunk_output_path = output_path / f"chunk_{chunk_num:04d}.parquet"
        
        # Sauvegarde en Parquet (plus efficace que CSV)
        chunk.to_parquet(
            chunk_output_path,
            compression='snappy',
            index=False
        )
        
        logger.info(f"Chunk {chunk_num + 1} sauvegardé: {chunk_output_path}")
    
    def _save_summary_stats(self, total_rows: int, total_amount: float, 
                           fraud_count: int, output_path: Path) -> None:
        """Sauvegarde les statistiques de traitement"""
        stats = {
            'total_rows': total_rows,
            'total_amount': total_amount,
            'fraud_count': fraud_count,
            'fraud_rate': fraud_count / total_rows if total_rows > 0 else 0,
            'avg_amount': total_amount / total_rows if total_rows > 0 else 0
        }
        
        stats_df = pd.DataFrame([stats])
        stats_df.to_csv(output_path / 'summary_stats.csv', index=False)
        logger.info("Statistiques sauvegardées")

# Utilisation
if __name__ == "__main__":
    processor = OptimizedDataProcessor(chunk_size=100000)
    
    input_file = Path("large_transactions.csv")
    output_dir = Path("processed_chunks")
    output_dir.mkdir(exist_ok=True)
    
    processor.process_large_file(input_file, output_dir)
```

---

## 🏗️ **Section 3 : Pipeline Design - 10 Scénarios d'Architecture**

### **Scénario 1 : E-commerce Multi-tenant avec 1M+ Utilisateurs**

**Contexte Business :**
Une plateforme e-commerce B2B doit gérer 100+ entreprises clientes, chacune avec ses propres données, règles métier et exigences de conformité. Le système doit traiter 10M+ transactions par jour avec une latence < 100ms.

**Exigences Techniques :**
- Isolation complète des données entre tenants
- Performance garantie même avec croissance
- Conformité GDPR/CCPA par tenant
- Monitoring et alerting multi-tenant
- Backup et disaster recovery

**Architecture Proposée :**

```mermaid
graph TB
    subgraph "Tenant Isolation Layer"
        A1[Tenant Router] --> A2[Tenant Context]
        A2 --> A3[Data Partitioning]
    end
    
    subgraph "Data Ingestion"
        B1[API Gateway] --> B2[Tenant-aware Load Balancer]
        B2 --> B3[Kafka Topics per Tenant]
        B3 --> B4[Stream Processing]
    end
    
    subgraph "Storage Strategy"
        C1[Tenant-specific Schemas] --> C2[Partitioned Tables]
        C2 --> C3[Data Lake per Tenant]
        C3 --> C4[Compliance Engine]
    end
    
    subgraph "Processing Layer"
        D1[Flink Jobs] --> D2[Tenant-aware Aggregations]
        D2 --> D3[Real-time Analytics]
        D3 --> D4[ML Models per Tenant]
    end
    
    A3 --> B3
    B4 --> C1
    C4 --> D1
    D4 --> C3
```

**Technologies Recommandées :**
- **Ingestion :** Apache Kafka avec topics par tenant
- **Processing :** Apache Flink avec state backend par tenant
- **Storage :** PostgreSQL avec schemas par tenant + S3 pour data lake
- **Monitoring :** Prometheus + Grafana avec métriques par tenant
- **Security :** Vault pour gestion des secrets par tenant

**Points Clés de l'Implémentation :**
1. **Isolation des Données :** Utilisation de schemas PostgreSQL séparés par tenant
2. **Performance :** Partitionnement des tables par tenant et par date
3. **Scalabilité :** Auto-scaling des ressources Flink basé sur la charge par tenant
4. **Conformité :** Pipeline de data governance avec rétention et anonymisation par tenant

**Métriques de Performance :**
- Latence 95e percentile : < 100ms
- Throughput : 10M+ transactions/jour
- Disponibilité : 99.99%
- RTO : < 1 heure
- RPO : < 15 minutes

---

### **Scénario 2 : Système de Trading en Temps Réel**

**Contexte Business :**
Une plateforme de trading doit traiter des ordres de marché en temps réel avec une latence ultra-faible (< 1ms). Le système doit gérer 100K+ ordres par seconde avec une garantie de traitement exactement-une-fois.

**Exigences Techniques :**
- Latence < 1ms end-to-end
- Throughput 100K+ ordres/sec
- Garantie exactly-once
- Faute tolérance zéro
- Audit trail complet

**Architecture Proposée :**

```mermaid
graph LR
    subgraph "Market Data Feed"
        A1[Exchange APIs] --> A2[Ultra-low Latency Network]
        A2 --> A3[Market Data Processor]
    end
    
    subgraph "Order Processing"
        B1[Order Gateway] --> B2[Order Validation]
        B2 --> B3[Risk Engine]
        B3 --> B4[Order Router]
    end
    
    subgraph "Execution Engine"
        C1[Order Matching] --> C2[Execution Engine]
        C2 --> C3[Position Manager]
        C3 --> C4[P&L Calculator]
    end
    
    subgraph "Real-time Analytics"
        D1[Stream Processing] --> D2[Risk Monitoring]
        D2 --> D3[Performance Analytics]
        D3 --> D4[Compliance Engine]
    end
    
    A3 --> B1
    B4 --> C1
    C4 --> D1
    D4 --> B3
```

**Technologies Recommandées :**
- **Network :** InfiniBand ou Ethernet 100Gbps avec kernel bypass
- **Processing :** C++/Rust pour latence ultra-faible
- **Streaming :** Apache Pulsar avec zero-copy
- **Storage :** In-memory databases (Redis, Hazelcast)
- **Monitoring :** eBPF pour métriques kernel-level

**Points Clés de l'Implémentation :**
1. **Latence Ultra-Faible :** Utilisation de kernel bypass (DPDK, Solarflare)
2. **Exactly-Once :** Idempotence avec clés de transaction uniques
3. **Fault Tolerance :** Replication synchrone avec consensus Raft
4. **Audit :** Event sourcing avec stockage immuable

**Métriques de Performance :**
- Latence 99e percentile : < 1ms
- Throughput : 100K+ ordres/sec
- Disponibilité : 99.999%
- RTO : < 100ms
- RPO : < 1ms

---

## 📋 **Section 4 : Questions d'Entretien Types**

### **Questions Architecture (15 questions)**

1. **"Comment concevriez-vous un système qui doit gérer 1TB de données par jour ?"**
   - Réponse attendue : Discussion sur le partitionnement, le streaming vs batch, l'auto-scaling
   - Points clés : Data lake, cloud storage, processing distribué

2. **"Quelle est la différence entre Lambda et Kappa architecture ?"**
   - Réponse attendue : Lambda = batch + streaming, Kappa = streaming uniquement
   - Points clés : Complexité, maintenance, cas d'usage

3. **"Comment géreriez-vous la cohérence des données dans un système distribué ?"**
   - Réponse attendue : CAP theorem, consistency models, consensus algorithms
   - Points clés : Eventual consistency, strong consistency, trade-offs

### **Questions Techniques (20 questions)**

1. **"Comment optimiseriez-vous une requête SQL qui prend 10 minutes ?"**
   - Réponse attendue : EXPLAIN ANALYZE, index, partitioning, query rewriting
   - Points clés : Profiling, optimization techniques, monitoring

2. **"Quelle est la différence entre Spark et Flink ?"**
   - Réponse attendue : Spark = micro-batch, Flink = true streaming
   - Points clés : Latency, state management, use cases

3. **"Comment implémenteriez-vous l'idempotence dans un pipeline ?"**
   - Réponse attendue : Unique keys, deduplication, transaction management
   - Points clés : Data quality, reliability, error handling

### **Questions Business (15 questions)**

1. **"Comment justifieriez-vous l'investissement dans un data lake ?"**
   - Réponse attendue : ROI, business value, cost optimization
   - Points clés : Business case, metrics, stakeholder alignment

2. **"Quels métriques suivriez-vous pour un pipeline de production ?"**
   - Réponse attendue : SLA, data quality, performance, cost
   - Points clés : Monitoring, alerting, business impact

---

## 🎯 **Section 5 : Tests Techniques Simulés**

### **Test 1 : Design d'Architecture (45 minutes)**

**Problème :**
Concevez un système de recommandation en temps réel pour une plateforme e-commerce qui doit :
- Traiter 1M+ événements utilisateur par heure
- Générer des recommandations en < 100ms
- S'adapter aux changements de comportement utilisateur
- Gérer 10M+ utilisateurs actifs

**Éléments à évaluer :**
- Architecture générale et composants
- Choix technologiques et justifications
- Gestion de la scalabilité et performance
- Monitoring et observabilité
- Gestion des erreurs et fallbacks

### **Test 2 : Optimisation de Code (30 minutes)**

**Problème :**
Optimisez ce code Python pour traiter 100M+ enregistrements :

```python
def process_transactions(transactions):
    results = []
    for transaction in transactions:
        if transaction['amount'] > 1000:
            transaction['category'] = 'high_value'
        else:
            transaction['category'] = 'low_value'
        
        if transaction['user_age'] > 30:
            transaction['segment'] = 'adult'
        else:
            transaction['segment'] = 'young'
        
        results.append(transaction)
    return results
```

**Améliorations attendues :**
- Vectorisation avec Pandas
- Optimisation mémoire
- Gestion des gros volumes
- Tests de performance

### **Test 3 : Debugging et Troubleshooting (25 minutes)**

**Problème :**
Un pipeline de production échoue avec ces erreurs :
- "OutOfMemoryError" sur le cluster Spark
- "Connection timeout" sur la base de données
- "Data quality score below threshold"

**Actions attendues :**
- Diagnostic des problèmes
- Solutions immédiates et long terme
- Monitoring et alerting
- Documentation des procédures

---

## 🏆 **Section 6 : Évaluation et Feedback**

### **Grille d'Évaluation**

| Compétence | Excellent (5) | Bon (4) | Moyen (3) | Insuffisant (2) | Faible (1) |
|------------|---------------|----------|------------|-----------------|-------------|
| **Architecture** | Design robuste, scalable | Bonne compréhension | Approche basique | Manque de vision | Pas de compréhension |
| **Technique** | Code optimal, tests | Code fonctionnel | Code basique | Beaucoup d'erreurs | Code non fonctionnel |
| **Business** | Impact business clair | Bonne compréhension | Approche technique | Pas de vision business | Hors sujet |
| **Communication** | Explication claire | Bonne présentation | Présentation basique | Difficile à suivre | Incompréhensible |

### **Feedback Constructif**

**Points Forts à Développer :**
- Approche structurée et méthodique
- Compréhension des trade-offs techniques
- Vision business et impact

**Axes d'Amélioration :**
- Approfondir les patterns d'architecture
- Pratiquer le coding sous contrainte
- Développer la communication technique

**Prochaines Étapes :**
1. Pratiquer les exercices non réussis
2. Étudier les architectures de référence
3. Participer à des hackathons data
4. Contribuer à des projets open source

---

## 🚀 **Conclusion et Prochaines Étapes**

Ce niveau vous a préparé aux entretiens techniques les plus exigeants. Continuez à pratiquer régulièrement et à vous tenir au courant des dernières technologies et patterns d'architecture.

**Prochain niveau : Niveau 6 - Carrière & Développement Professionnel**

**Rappel :** La pratique régulière est la clé du succès. Codez, testez, et itérez constamment ! 💪
