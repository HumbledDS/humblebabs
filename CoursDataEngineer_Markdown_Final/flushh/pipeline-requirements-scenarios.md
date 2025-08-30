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