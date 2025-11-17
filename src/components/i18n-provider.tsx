"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

type Language = "en" | "fr"

// Allow arbitrarily nested translation objects whose leaves are strings
type TranslationNode = string | { [key: string]: TranslationNode }

type Translations = Record<Language, { [key: string]: TranslationNode }>

const translations: Translations = {
  en: {
    nav: {
      about: "About",
      projects: "Projects",
      systemDesign: "System Design",
      masterClass: "MasterClass",
      blog: "Blog",
      contact: "Contact",
    },
    systemDesign: {
      heroTitle: "System Design",
      heroSubtitle: "Comprehensive guides to building scalable, resilient, and efficient systems. From data pipelines to microservices, explore architectural patterns that power modern applications.",
      heroBadge: "Expert-level architectural insights",
      exploreTitle: "Explore System Design Categories",
      exploreSubtitle: "Dive deep into different aspects of system design with practical examples, trade-offs analysis, and implementation guidance.",
      exploreCta: "Explore",
      categories: {
        dataPipelines: {
          title: "Data Pipeline Architectures",
          description: "Comprehensive guides to various data pipeline architectures with explanations, trade-offs, and flow diagrams."
        },
        microservices: {
          title: "Microservices Architecture",
          description: "Design patterns and best practices for building scalable microservices systems."
        },
        cloudNative: {
          title: "Cloud-Native Solutions",
          description: "Architecture patterns for building resilient and scalable cloud applications."
        },
        aiMl: {
          title: "AI/ML System Design",
          description: "Architectural patterns for machine learning systems and AI applications."
        }
      }
    },
    about: {
      summary: "Passionate Data & AI Engineer eager to master Cloud, AI, and automation.",
      downloadResume: "Download Resume (PDF)",
      roleShort: "Data Engineer",
      professionalSummaryTitle: "Professional Summary",
      professionalSummaryBody: "Results-driven Data Engineer with 3+ years of experience in developing data pipelines and data-driven applications. Proven track record of building scalable ETL processes, optimizing data infrastructure, and delivering impactful insights that drive business growth. Expertise in Python, Apache Spark, AWS, and data engineering technologies. Motivated to staying current with emerging technologies and contributing to open-source projects.",
      experienceTitle: "Professional Experience",
      educationTitle: "Education",
      gpaLabel: "GPA",
      skillsTitle: "Technical Skills",
      certificationsTitle: "Certifications",
      ctaTitle: "Interested in working together?",
      ctaSubtitle: "Let's discuss how I can contribute to your next project",
      ctaButton: "Get In Touch",
    },
    projects: {
      title: "Projects",
      subtitle: "A collection of projects showcasing my work in AI, data science, and financial markets",
      searchPlaceholder: "Search projects...",
      featured: "Featured",
      demo: "Demo",
      viewDetails: "View Details",
      code: "Code",
      emptyTitle: "No projects found",
      emptySubtitle: "Try adjusting your search or filter criteria",
      ctaQuestion: "Have a project in mind?",
      ctaButton: "Let's Work Together",
      backToProjects: "Back to Projects",
      categories: {
        all: "All",
        aiml: "AI/ML",
        data: "Data",
        cloud: "Cloud",
      },
      items: {
        "sp500-historical-analysis": {
          title: "S&P 500 Historical Performance Analysis System",
          description: "A comprehensive research framework for analyzing 100+ years of stock market performance and macro-economic correlations."
        },
        "job-market-analysis": {
          title: "Job Market Analytics Pipeline",
          description: "A complete end-to-end data engineering pipeline: extract, process, and visualize job market data with Airflow, APIs, and Streamlit."
        },
        "llm-rag-implementation": {
          title: "LLM RAG Implementation",
          description: "Retrieval-Augmented Generation system for intelligent document processing and Q&A."
        },
        "computer-vision-analytics": {
          title: "Computer Vision Analytics",
          description: "Advanced computer vision system for object detection and image analysis using deep learning."
        },
        "financial-data-analysis": {
          title: "Financial Data Analysis Platform",
          description: "Real-time financial data processing and analysis with predictive modeling capabilities."
        },
        "data-visualization-suite": {
          title: "Data Visualization Suite",
          description: "Interactive data exploration tools with real-time updates and collaborative features."
        },
        "cloud-ml-pipeline": {
          title: "Cloud ML Pipeline",
          description: "Automated machine learning pipeline for model training, validation, and deployment on AWS."
        },
        "advanced-data-modeling-patterns": {
          title: "Advanced Data Modeling Patterns",
          description: "Enterprise-grade data modeling patterns and architectures for complex, scalable, and compliant data systems."
        },
        "enterprise-data-pipeline-design": {
          title: "Enterprise Data Pipeline Design",
          description: "Design and implement scalable, reliable, and performant data pipelines for enterprise-grade data processing and analytics."
        },
        "real-time-analytics-ml-pipelines": {
          title: "Real-time Analytics & ML Pipelines",
          description: "Build production-ready ML pipelines with real-time analytics, automated model serving, and continuous learning capabilities."
        },
        "data-governance-compliance": {
          title: "Data Governance & Compliance",
          description: "Comprehensive data governance and compliance solutions for enterprise data protection, privacy, and regulatory adherence."
        }
      },
    },
    blog: {
      title: "Blog",
      subtitle: "Insights, tutorials, and thoughts on AI, data science, and technology",
      searchPlaceholder: "Search articles...",
      featuredSection: "Featured Articles",
      latestSection: "Latest Articles",
      readMore: "Read More",
      readShort: "Read",
      readTimeSuffix: "min read",
      featuredBadge: "Featured",
      backToBlog: "Back to Blog",
      categories: {
        all: "All",
        machineLearning: "Machine Learning",
        ai: "AI",
        webDev: "Web Development",
        dataScience: "Data Science",
        cloudComputing: "Cloud Computing",
      },
      posts: {
        "building-scalable-ml-pipelines": {
          title: "Building Scalable ML Pipelines with Apache Airflow",
          excerpt: "Learn how to design and implement robust machine learning pipelines that can handle production workloads and scale with your data needs."
        },
        "ai-healthcare-future": {
          title: "The Future of AI in Healthcare: Opportunities and Challenges",
          excerpt: "Exploring the transformative potential of artificial intelligence in healthcare and the ethical considerations that come with it."
        },
        "optimizing-react-performance": {
          title: "Optimizing React Performance: A Deep Dive",
          excerpt: "Advanced techniques for optimizing React applications, from code splitting to memoization strategies."
        },
        "d3-js-visualization-best-practices": {
          title: "Data Visualization Best Practices with D3.js",
          excerpt: "Master the art of creating compelling and informative data visualizations using D3.js."
        },
        "deploying-ml-models-aws": {
          title: "Deploying ML Models on AWS: A Complete Guide",
          excerpt: "Step-by-step guide to deploying machine learning models on AWS using SageMaker and other cloud services."
        },
        "transformer-architecture-nlp": {
          title: "Understanding Transformer Architecture in NLP",
          excerpt: "Deep dive into the transformer architecture that powers modern natural language processing models."
        }
      },
      empty: {
        title: "No articles found",
        subtitle: "Try adjusting your search or filter criteria",
      },
      newsletter: {
        title: "Stay Updated",
        subtitle: "Get the latest insights on AI, data science, and technology delivered to your inbox",
        emailPlaceholder: "Enter your email",
        subscribe: "Subscribe",
      },
    },
    masterclass: {
      searchPlaceholder: "Search a course...",
      featuredBadge: "Recommended",
      startCourse: "Start course",
      emptyTitle: "No courses found",
      emptySubtitle: "Try adjusting your filters or search",
    },
    home: {
      hero: {
        hi: "Hi, I'm",
        role: "Data & AI Engineer, Python Developer",
        description: "I build data-driven systems end-to-end, specializing in Data Engineering and Cloud Computing. I particularly enjoy SaaS and financial markets projects.",
        viewWork: "View My Work",
        aboutMe: "About Me",
        resume: "Resume",
      },
      skills: {
        aiMl: {
          title: "AI & Machine Learning",
          description: "Building intelligent systems with TensorFlow, PyTorch, and Scikit-learn. From neural networks to deep learning."
        },
        cloud: {
          title: "Cloud Computing",
          description: "Scalable solutions on AWS, Azure, and GCP. Container orchestration with Docker and Kubernetes."
        },
        dataScience: {
          title: "Data Science",
          description: "Extracting insights from complex datasets using Python, R, and advanced analytics techniques."
        },
        financialMarkets: {
          title: "Financial Markets",
          description: "Building end-to-end solutions for financial markets using Python, SQL, and Pandas."
        }
      },
      skillsTitle: "Technical Expertise",
      skillsSubtitle: "Combining cutting-edge technologies with practical experience to solve complex problems",
      featuredTitle: "Featured Projects",
      featuredSubtitle: "A showcase of my latest work in AI, Data Science, and Cloud Computing",
      viewAllProjects: "View All Projects",
      demo: "Demo",
      viewDetails: "View Details",
      code: "Code",
      projectStatus: {
        live: "Live",
        liveDemo: "Live Demo",
        beta: "Beta",
        openSource: "Open Source",
        expert: "Expert",
        advanced: "Advanced"
      },
      ctaTitle: "Let's Build Something Amazing",
      ctaSubtitle: "Have a project in mind? Let's discuss how we can bring your data-driven ideas to life.",
      ctaButton: "Get In Touch",
    },
    contact: {
      title: "Get In Touch",
      subtitle: "Have a project in mind? Let's discuss how we can bring your ideas to life",
      connectTitle: "Let's Connect",
      connectIntro: "I'm always interested in new opportunities and exciting projects. Whether you have a question about my work, want to collaborate, or just want to say hello, feel free to reach out.",
      followMe: "Follow Me",
      availability: "Available for opportunities",
      availabilityDesc: "I'm currently accepting new projects and collaborations. Let's discuss how we can work together!",
      sendMessage: "Send a Message",
      form: {
        name: "Name *",
        namePlaceholder: "Your name",
        email: "Email *",
        emailPlaceholder: "your.email@example.com",
        subject: "Subject *",
        subjectSelect: "Select a subject",
        subjectOptions: {
          project: "Project Inquiry",
          collaboration: "Collaboration",
          job: "Job Opportunity",
          consultation: "Consultation",
          general: "General Question",
          other: "Other",
        },
        message: "Message *",
        messagePlaceholder: "Tell me about your project or inquiry...",
        sending: "Sending...",
        send: "Send Message",
      },
      sentTitle: "Message Sent!",
      sentDesc: "Thank you for reaching out. I'll get back to you as soon as possible.",
      faqTitle: "Frequently Asked Questions",
      faqSubtitle: "Quick answers to common questions",
    },
  },
  fr: {
    nav: {
      about: "À propos",
      projects: "Projets",
      systemDesign: "Conception système",
      masterClass: "MasterClass",
      blog: "Blog",
      contact: "Contact",
    },
    systemDesign: {
      heroTitle: "Conception système",
      heroSubtitle: "Guides complets pour concevoir des systèmes scalables, résilients et efficaces. Des pipelines de données aux microservices, explorez les patterns d’architecture qui propulsent les applications modernes.",
      heroBadge: "Expertise architecturale de haut niveau",
      exploreTitle: "Explorer les catégories de conception système",
      exploreSubtitle: "Approfondissez chaque aspect de la conception avec des exemples concrets, des analyses de compromis et des conseils d’implémentation.",
      exploreCta: "Explorer",
      categories: {
        dataPipelines: {
          title: "Architectures de pipelines de données",
          description: "Guides complets sur diverses architectures de pipelines, avec explications, compromis et diagrammes de flux."
        },
        microservices: {
          title: "Architecture microservices",
          description: "patterns de conception et bonnes pratiques pour construire des systèmes microservices scalables."
        },
        cloudNative: {
          title: "Solutions cloud-native",
          description: "patterns d’architecture pour des applications cloud résilientes et scalables."
        },
        aiMl: {
          title: "Conception de systèmes IA/ML",
          description: "patterns d’architecture pour les systèmes de machine learning et les applications d’IA."
        }
      }
    },
    about: {
      summary: "Ingénieur Data & IA passionné, motivé pour maîtriser le Cloud, l’IA et l’automatisation.",
      downloadResume: "Télécharger le CV (PDF)",
      roleShort: "Ingénieur Data",
      professionalSummaryTitle: "Résumé professionnel",
      professionalSummaryBody: "Ingénieur Data orienté résultats avec plus de 3 ans d’expérience dans le développement de pipelines de données et d’applications data-driven. Historique prouvé dans la mise en place de processus ETL scalables, l’optimisation d’infrastructures data et la production d’insights à fort impact pour la croissance. Expertise en Python, Apache Spark, AWS et technologies d’ingénierie des données. Motivé à rester à jour sur les technologies émergentes et à contribuer aux projets open source.",
      experienceTitle: "Expériences professionnelles",
      educationTitle: "Formation",
      gpaLabel: "Moyenne",
      skillsTitle: "Compétences techniques",
      certificationsTitle: "Certifications",
      ctaTitle: "Envie de collaborer ?",
      ctaSubtitle: "Discutons de la manière dont je peux contribuer à votre prochain projet",
      ctaButton: "Me contacter",
    },
    projects: {
      title: "Projets",
      subtitle: "Une collection de projets présentant mes travaux en IA, data science et marchés financiers",
      searchPlaceholder: "Rechercher des projets…",
      featured: "À la une",
      demo: "Démo",
      viewDetails: "Voir les détails",
      code: "Code",
      emptyTitle: "Aucun projet trouvé",
      emptySubtitle: "Essayez d’ajuster votre recherche ou vos filtres",
      ctaQuestion: "Un projet en tête ?",
      ctaButton: "Travaillons ensemble",
      backToProjects: "Retour aux projets",
      categories: {
        all: "Tous",
        aiml: "IA/ML",
        data: "Données",
        cloud: "Cloud",
      },
      items: {
        "sp500-historical-analysis": {
          title: "Analyse historique des performances du S&P 500",
          description: "Cadre de recherche complet pour analyser plus de 100 ans de performances boursières et corrélations macroéconomiques."
        },
        "job-market-analysis": {
          title: "Pipeline d’analyse du marché de l’emploi",
          description: "Pipeline data de bout en bout: extraction, traitement et visualisation du marché de l’emploi avec Airflow, APIs et Streamlit."
        },
        "llm-rag-implementation": {
          title: "Implémentation LLM RAG",
          description: "Système de RAG (Retrieval-Augmented Generation) pour le traitement de documents et la FAQ intelligente."
        },
        "computer-vision-analytics": {
          title: "Analytique de Vision par Ordinateur",
          description: "Système avancé de vision par ordinateur pour la détection d’objets et l’analyse d’images via deep learning."
        },
        "financial-data-analysis": {
          title: "Plateforme d’analyse de données financières",
          description: "Traitement et analyse temps réel de données financières avec des capacités de modélisation prédictive."
        },
        "data-visualization-suite": {
          title: "Suite de visualisation de données",
          description: "Outils d’exploration interactive avec mises à jour temps réel et fonctionnalités collaboratives."
        },
        "cloud-ml-pipeline": {
          title: "Pipeline ML sur Cloud",
          description: "Pipeline ML automatisé pour l’entraînement, la validation et le déploiement de modèles sur AWS."
        },
        "advanced-data-modeling-patterns": {
          title: "Modèles avancés de modélisation de données",
          description: "patterns et architectures de modélisation pour des systèmes complexes, scalables et conformes."
        },
        "enterprise-data-pipeline-design": {
          title: "Conception de pipeline de données d’entreprise",
          description: "Concevez des pipelines scalables et fiables pour le traitement et l’analytique de niveau entreprise."
        },
        "real-time-analytics-ml-pipelines": {
          title: "Analytique temps réel et pipelines ML",
          description: "Pipelines ML prêts pour la production avec analytique temps réel, serving automatisé et apprentissage continu."
        },
        "data-governance-compliance": {
          title: "Gouvernance et conformité des données",
          description: "Solutions complètes de gouvernance et conformité: protection, confidentialité et exigences réglementaires."
        }
      },
    },
    blog: {
      title: "Blog",
      subtitle: "Analyses, tutoriels et réflexions sur l’IA, la data science et la technologie",
      searchPlaceholder: "Rechercher des articles…",
      featuredSection: "Articles à la une",
      latestSection: "Derniers articles",
      readMore: "Lire la suite",
      readShort: "Lire",
      readTimeSuffix: "min de lecture",
      featuredBadge: "À la une",
      backToBlog: "Retour au Blog",
      categories: {
        all: "Tous",
        machineLearning: "Machine Learning",
        ai: "IA",
        webDev: "Développement Web",
        dataScience: "Data Science",
        cloudComputing: "Cloud Computing",
      },
      posts: {
        "building-scalable-ml-pipelines": {
          title: "Construire des pipelines ML évolutifs avec Apache Airflow",
          excerpt: "Découvrez comment concevoir et mettre en production des pipelines ML robustes et évolutifs avec Apache Airflow."
        },
        "ai-healthcare-future": {
          title: "L’avenir de l’IA en santé : opportunités et défis",
          excerpt: "Exploration du potentiel transformateur de l’IA en santé et des enjeux éthiques associés."
        },
        "optimizing-react-performance": {
          title: "Optimiser les performances React : analyse approfondie",
          excerpt: "Techniques avancées pour optimiser les applications React, du code splitting à la mémoïsation."
        },
        "d3-js-visualization-best-practices": {
          title: "Bonnes pratiques de visualisation des données avec D3.js",
          excerpt: "Maîtrisez l’art de créer des visualisations informatives et percutantes avec D3.js."
        },
        "deploying-ml-models-aws": {
          title: "Déployer des modèles ML sur AWS : guide complet",
          excerpt: "Guide pas à pas pour déployer des modèles de machine learning sur AWS avec SageMaker et services associés."
        },
        "transformer-architecture-nlp": {
          title: "Comprendre l’architecture Transformer en NLP",
          excerpt: "Plongée au cœur de l’architecture Transformer qui alimente les modèles modernes de traitement du langage."
        }
      },
      empty: {
        title: "Aucun article trouvé",
        subtitle: "Essayez d’ajuster votre recherche ou vos filtres",
      },
      newsletter: {
        title: "Restez informé",
        subtitle: "Recevez les dernières analyses sur l’IA, la data science et la technologie directement dans votre boîte mail",
        emailPlaceholder: "Entrez votre email",
        subscribe: "S’abonner",
      },
    },
    masterclass: {
      searchPlaceholder: "Rechercher un cours...",
      featuredBadge: "Recommandé",
      startCourse: "Commencer le cours",
      emptyTitle: "Aucun cours trouvé",
      emptySubtitle: "Essayez de modifier vos filtres ou votre recherche",
    },
    home: {
      hero: {
        hi: "Bonjour, je suis",
        role: "Ingénieur Data & IA, Développeur Python",
        description: "Je conçois des systèmes data de bout en bout, spécialisé en Data Engineering et Cloud Computing. J'apprécie particulièrement les projets SaaS et les marchés financiers.",
        viewWork: "Voir mes projets",
        aboutMe: "À propos de moi",
        resume: "CV",
      },
      skills: {
        aiMl: {
          title: "IA & Machine Learning",
          description: "Conception de systèmes intelligents avec TensorFlow, PyTorch et Scikit-learn. Des réseaux de neurones au deep learning."
        },
        cloud: {
          title: "Cloud Computing",
          description: "Solutions scalables sur AWS, Azure et GCP. Orchestration de conteneurs avec Docker et Kubernetes."
        },
        dataScience: {
          title: "Data Science",
          description: "Extraction d’insights à partir de données complexes avec Python, R et des techniques d’analytique avancées."
        },
        financialMarkets: {
          title: "Marchés financiers",
          description: "Solutions de bout en bout pour les marchés financiers avec Python, SQL et Pandas."
        }
      },
      skillsTitle: "Expertise Technique",
      skillsSubtitle: "Allier technologies de pointe et expérience pratique pour résoudre des problèmes complexes",
      featuredTitle: "Projets à la Une",
      featuredSubtitle: "Une sélection de mes travaux récents en IA, Data Science et Cloud",
      viewAllProjects: "Voir tous les projets",
      demo: "Démo",
      viewDetails: "Voir les détails",
      code: "Code",
      projectStatus: {
        live: "En ligne",
        liveDemo: "Démo en ligne",
        beta: "Bêta",
        openSource: "Open Source",
        expert: "Expert",
        advanced: "Avancé"
      },
      ctaTitle: "Construisons quelque chose d’extraordinaire",
      ctaSubtitle: "Vous avez un projet en tête ? Discutons de la meilleure façon de donner vie à vos idées basées sur la donnée.",
      ctaButton: "Me contacter",
    },
    contact: {
      title: "Contactez-moi",
      subtitle: "Vous avez un projet en tête ? Discutons de la meilleure façon de le réaliser",
      connectTitle: "Entrons en contact",
      connectIntro: "Je suis toujours intéressé par de nouvelles opportunités et des projets ambitieux. Question sur mon travail, collaboration, ou juste un bonjour : n'hésitez pas à me contacter.",
      followMe: "Suivez-moi",
      availability: "Disponible pour des opportunités",
      availabilityDesc: "J'accepte actuellement de nouveaux projets et collaborations. Discutons de la façon dont nous pouvons travailler ensemble !",
      sendMessage: "Envoyer un message",
      form: {
        name: "Nom *",
        namePlaceholder: "Votre nom",
        email: "Email *",
        emailPlaceholder: "votre.email@exemple.com",
        subject: "Sujet *",
        subjectSelect: "Choisissez un sujet",
        subjectOptions: {
          project: "Demande de projet",
          collaboration: "Collaboration",
          job: "Opportunité d'emploi",
          consultation: "Consultation",
          general: "Question générale",
          other: "Autre",
        },
        message: "Message *",
        messagePlaceholder: "Parlez-moi de votre projet ou de votre demande...",
        sending: "Envoi en cours...",
        send: "Envoyer",
      },
      sentTitle: "Message envoyé !",
      sentDesc: "Merci pour votre message. Je reviendrai vers vous dès que possible.",
      faqTitle: "Questions fréquentes",
      faqSubtitle: "Des réponses rapides aux questions courantes",
    },
  },
}

interface I18nContextValue {
  lang: Language
  setLang: (lang: Language) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("en")

  useEffect(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem("lang") as Language | null) : null
    if (saved === "en" || saved === "fr") {
      setLangState(saved)
    }
  }, [])

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang
    }
  }, [lang])

  const setLang = (next: Language) => {
    setLangState(next)
    if (typeof window !== "undefined") {
      localStorage.setItem("lang", next)
    }
  }

  const t = useMemo(() => {
    const dict = translations[lang]
    return (key: string) => {
      const parts = key.split(".")
      let current: any = dict
      for (const part of parts) {
        if (current && typeof current === "object" && part in current) {
          current = current[part]
        } else {
          return key
        }
      }
      return typeof current === "string" ? current : key
    }
  }, [lang])

  const value = useMemo<I18nContextValue>(
    () => ({
      lang,
      setLang,
      t,
    }),
    [lang, t]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider")
  }
  return ctx
}



