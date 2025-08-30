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