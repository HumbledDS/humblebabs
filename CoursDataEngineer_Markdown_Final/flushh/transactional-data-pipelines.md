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
            