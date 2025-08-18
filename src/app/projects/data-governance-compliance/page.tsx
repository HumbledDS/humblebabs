"use client"
import { motion } from "framer-motion"
import { TutorialSection } from "@/components/projects/tutorial-section"
import { ImplementationChecklist } from "@/components/projects/implementation-checklist"
import { ArchitectureDiagram } from "@/components/projects/architecture-diagram"
import { ToolComparison } from "@/components/projects/tool-comparison"
import { Shield, Zap, Lock, TrendingUp, Database, Code2, FileText, Target, ArrowRight, Lightbulb } from "lucide-react"

export default function DataGovernanceCompliancePage() {
  const gdprImplementationSteps = [
    {
      id: 1,
      title: "Data Inventory & Classification",
      description: "Create a comprehensive inventory of all personal data and classify it according to sensitivity and GDPR requirements. This includes identifying data subjects, data categories, and processing purposes.",
      code: `// Data Inventory Service
@Service
public class DataInventoryService {
    
    @Autowired
    private DataSourceRepository dataSourceRepository;
    
    @Autowired
    private DataClassificationService classificationService;
    
    public DataInventory createInventory(String organizationId) {
        DataInventory inventory = new DataInventory();
        inventory.setOrganizationId(organizationId);
        inventory.setCreatedAt(Instant.now());
        
        // Discover data sources
        List<DataSource> dataSources = dataSourceRepository.findByOrganizationId(organizationId);
        
        for (DataSource source : dataSources) {
            DataSourceInventory sourceInventory = analyzeDataSource(source);
            inventory.addDataSource(sourceInventory);
        }
        
        return inventory;
    }
    
    private DataSourceInventory analyzeDataSource(DataSource source) {
        DataSourceInventory inventory = new DataSourceInventory();
        inventory.setSourceId(source.getId());
        inventory.setSourceName(source.getName());
        inventory.setSourceType(source.getType());
        
        // Analyze data structure
        List<DataField> fields = source.getFields();
        for (DataField field : fields) {
            DataFieldClassification classification = classificationService.classifyField(field);
            inventory.addField(classification);
        }
        
        // Identify personal data
        List<PersonalDataField> personalDataFields = fields.stream()
            .filter(field -> classificationService.isPersonalData(field))
            .map(field -> new PersonalDataField(field, classificationService.getDataSubjectType(field)))
            .collect(Collectors.toList());
        
        inventory.setPersonalDataFields(personalDataFields);
        
        return inventory;
    }
}`,
      language: "java",
      tips: [
        "Use automated discovery tools for large datasets",
        "Implement data lineage tracking from the start",
        "Regularly update inventory as data sources change"
      ],
      warnings: [
        "Manual inventory creation can be error-prone",
        "Ensure all data sources are included, including shadow IT"
      ]
    },
    {
      id: 2,
      title: "Implement Data Subject Rights",
      description: "Implement the core GDPR data subject rights including access, rectification, erasure, and portability. This requires building APIs and processes to handle subject requests.",
      code: `// Data Subject Rights Service
@Service
public class DataSubjectRightsService {
    
    @Autowired
    private PersonalDataRepository personalDataRepository;
    
    @Autowired
    private DataErasureService erasureService;
    
    public DataSubjectResponse handleRightToAccess(String dataSubjectId, String requestId) {
        // Validate request
        validateRequest(dataSubjectId, requestId);
        
        // Collect all personal data
        List<PersonalDataRecord> personalData = personalDataRepository
            .findByDataSubjectId(dataSubjectId);
        
        // Format response
        DataSubjectResponse response = new DataSubjectResponse();
        response.setRequestId(requestId);
        response.setDataSubjectId(dataSubjectId);
        response.setPersonalData(personalData);
        response.setProcessedAt(Instant.now());
        
        // Log request for audit
        logDataSubjectRequest(requestId, "ACCESS", dataSubjectId);
        
        return response;
    }
    
    public ErasureResponse handleRightToErasure(String dataSubjectId, String requestId) {
        // Validate request
        validateRequest(dataSubjectId, requestId);
        
        // Check if erasure is possible (no legal basis for retention)
        if (!canErasureBeProcessed(dataSubjectId)) {
            throw new ErasureNotPossibleException("Legal basis prevents erasure");
        }
        
        // Process erasure
        ErasureResult result = erasureService.erasePersonalData(dataSubjectId);
        
        // Log request for audit
        logDataSubjectRequest(requestId, "ERASURE", dataSubjectId);
        
        return new ErasureResponse(requestId, dataSubjectId, result);
    }
    
    private boolean canErasureBeProcessed(String dataSubjectId) {
        // Check legal basis for data retention
        List<LegalBasis> legalBases = legalBasisService.getActiveLegalBases(dataSubjectId);
        
        // If any legal basis exists, erasure may not be possible
        return legalBases.stream()
            .noneMatch(basis -> basis.isActive() && basis.getRetentionPeriod().isActive());
    }
}`,
      language: "java",
      tips: [
        "Implement request validation and authentication",
        "Use async processing for large erasure requests",
        "Maintain audit logs for all data subject requests"
      ],
      warnings: [
        "Ensure erasure doesn't break system functionality",
        "Consider data backup and recovery implications"
      ]
    }
  ]

  const dataLineageSteps = [
    {
      id: 1,
      title: "Design Lineage Tracking Architecture",
      description: "Create a data lineage system that tracks data flow from source to consumption. This includes capturing metadata, transformations, and data quality metrics at each step.",
      code: `// Data Lineage Service
@Service
public class DataLineageService {
    
    @Autowired
    private LineageRepository lineageRepository;
    
    @Autowired
    private MetadataService metadataService;
    
    public void trackDataFlow(DataFlowEvent event) {
        // Create lineage record
        DataLineage lineage = new DataLineage();
        lineage.setFlowId(event.getFlowId());
        lineage.setSourceSystem(event.getSourceSystem());
        lineage.setTargetSystem(event.getTargetSystem());
        lineage.setDataEntity(event.getDataEntity());
        lineage.setTransformationType(event.getTransformationType());
        lineage.setTimestamp(Instant.now());
        lineage.setMetadata(metadataService.extractMetadata(event));
        
        // Store lineage
        lineageRepository.save(lineage);
        
        // Update lineage graph
        updateLineageGraph(lineage);
    }
    
    public LineageGraph getLineageGraph(String dataEntity, String organizationId) {
        // Get all lineage records for the entity
        List<DataLineage> lineageRecords = lineageRepository
            .findByDataEntityAndOrganizationId(dataEntity, organizationId);
        
        // Build graph
        LineageGraph graph = new LineageGraph();
        graph.setDataEntity(dataEntity);
        
        for (DataLineage record : lineageRecords) {
            LineageNode sourceNode = createOrGetNode(graph, record.getSourceSystem());
            LineageNode targetNode = createOrGetNode(graph, record.getTargetSystem());
            
            LineageEdge edge = new LineageEdge(sourceNode, targetNode, record);
            graph.addEdge(edge);
        }
        
        return graph;
    }
    
    public ImpactAnalysis analyzeImpact(String dataEntity, String organizationId) {
        LineageGraph graph = getLineageGraph(dataEntity, organizationId);
        
        ImpactAnalysis analysis = new ImpactAnalysis();
        analysis.setDataEntity(dataEntity);
        analysis.setDownstreamSystems(findDownstreamSystems(graph, dataEntity));
        analysis.setUpstreamSystems(findUpstreamSystems(graph, dataEntity));
        analysis.setDataQualityMetrics(calculateDataQualityMetrics(graph));
        
        return analysis;
    }
}`,
      language: "java",
      tips: [
        "Capture lineage at every data transformation",
        "Use graph databases for complex lineage relationships",
        "Implement real-time lineage tracking for streaming data"
      ],
      warnings: [
        "Lineage tracking can impact performance - optimize carefully",
        "Ensure lineage data is accurate and up-to-date"
      ]
    }
  ]

  const implementationChecklist = [
    {
      id: "planning-1",
      title: "Assess Compliance Requirements",
      description: "Identify applicable regulations and compliance requirements for your organization",
      category: "planning",
      priority: "critical",
      estimatedTime: "2-3 weeks",
      dependencies: []
    },
    {
      id: "planning-2",
      title: "Design Governance Framework",
      description: "Create data governance policies, roles, and responsibilities",
      category: "planning",
      priority: "critical",
      estimatedTime: "2-3 weeks",
      dependencies: ["planning-1"]
    },
    {
      id: "planning-3",
      title: "Data Classification Strategy",
      description: "Define data classification scheme and sensitivity levels",
      category: "planning",
      priority: "high",
      estimatedTime: "1-2 weeks",
      dependencies: ["planning-2"]
    },
    {
      id: "implementation-1",
      title: "Implement Data Discovery",
      description: "Build automated data discovery and classification tools",
      category: "implementation",
      priority: "high",
      estimatedTime: "3-4 weeks",
      dependencies: ["planning-3"]
    },
    {
      id: "implementation-2",
      title: "Data Lineage & Catalog",
      description: "Implement data lineage tracking and metadata management",
      category: "implementation",
      priority: "high",
      estimatedTime: "4-6 weeks",
      dependencies: ["implementation-1"]
    },
    {
      id: "implementation-3",
      title: "Privacy Controls",
      description: "Implement data privacy controls, encryption, and access management",
      category: "implementation",
      priority: "high",
      estimatedTime: "3-4 weeks",
      dependencies: ["implementation-2"]
    },
    {
      id: "testing-1",
      title: "Compliance Testing",
      description: "Test compliance controls and validate regulatory requirements",
      category: "testing",
      priority: "high",
      estimatedTime: "2-3 weeks",
      dependencies: ["implementation-3"]
    },
    {
      id: "deployment-1",
      title: "Production Deployment",
      description: "Deploy governance controls to production with monitoring",
      category: "deployment",
      priority: "critical",
      estimatedTime: "1-2 weeks",
      dependencies: ["testing-1"]
    },
    {
      id: "monitoring-1",
      title: "Ongoing Monitoring",
      description: "Set up continuous monitoring and compliance reporting",
      category: "monitoring",
      priority: "high",
      estimatedTime: "2-3 weeks",
      dependencies: ["deployment-1"]
    }
  ]

  const complianceDecisionTree = [
    {
      id: "start",
      title: "Compliance Framework Selection",
      description: "Choose the right compliance framework based on your industry and requirements",
      question: "What industry are you operating in?",
      options: [
        {
          id: "healthcare",
          label: "Healthcare & Life Sciences",
          description: "You handle patient data and medical information",
          nextNode: "healthcare-requirements",
          pros: ["Comprehensive protection", "Industry standard", "Clear guidelines"],
          cons: ["Strict requirements", "High compliance costs", "Complex implementation"],
          recommendation: "Implement HIPAA compliance framework"
        },
        {
          id: "finance",
          label: "Financial Services",
          description: "You handle financial data and transactions",
          nextNode: "finance-requirements",
          pros: ["Regulatory compliance", "Customer trust", "Industry standard"],
          cons: ["Complex regulations", "High audit requirements", "Ongoing compliance"],
          recommendation: "Implement PCI DSS and SOX compliance"
        },
        {
          id: "general",
          label: "General Business",
          description: "You handle customer and employee data",
          nextNode: "general-requirements",
          pros: ["Flexible approach", "Cost-effective", "Easier implementation"],
          cons: ["Less comprehensive", "May need additional frameworks", "Self-regulation"],
          recommendation: "Implement GDPR and general privacy framework"
        }
      ]
    }
  ]

  const governanceTools = [
    {
      id: "collibra",
      name: "Collibra",
      description: "Enterprise data governance and catalog platform for data discovery, quality, and lineage",
      category: "Data Governance",
      pricing: "paid",
      features: ["Data Catalog", "Data Lineage", "Data Quality", "Policy Management", "Workflow Automation"],
      pros: ["Comprehensive governance", "Enterprise features", "Good integration", "Scalable", "Professional support"],
      cons: ["Expensive", "Complex setup", "Steep learning curve", "Vendor lock-in"],
      bestFor: ["Large enterprises", "Complex governance needs", "Multi-domain governance", "Regulated industries"],
      notFor: ["Small organizations", "Simple use cases", "Budget constraints", "Quick implementation"],
      rating: 4.4,
      marketShare: "22.1",
      learningCurve: "hard",
      community: "medium",
      documentation: "good"
    },
    {
      id: "apache-atlas",
      name: "Apache Atlas",
      description: "Open-source metadata management and governance platform for Hadoop ecosystem",
      category: "Metadata Management",
      pricing: "free",
      features: ["Metadata Management", "Data Lineage", "Classification", "Security", "APIs"],
      pros: ["Free and open source", "Hadoop integration", "Good lineage tracking", "Active community", "Extensible"],
      cons: ["Limited enterprise features", "Hadoop-focused", "Basic UI", "Community support only"],
      bestFor: ["Hadoop environments", "Open source adoption", "Metadata management", "Data lineage"],
      notFor: ["Non-Hadoop environments", "Enterprise governance", "Advanced features", "Professional support"],
      rating: 3.9,
      marketShare: "15.3",
      learningCurve: "medium",
      community: "medium",
      documentation: "good"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-red-950">
      {/* Hero Section */}
      <motion.div
        className="relative overflow-hidden bg-gradient-to-br from-red-600 via-orange-600 to-amber-700 dark:from-red-800 dark:via-orange-800 dark:to-amber-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-orange-600/20 to-amber-700/20" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <div className="text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-medium mb-8 border border-white/20">
                <Shield className="w-5 h-5" />
                Data Governance & Compliance
                <ArrowRight className="w-4 h-4" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
                Data Governance &
                <span className="block bg-gradient-to-r from-orange-300 to-amber-300 bg-clip-text text-transparent">
                  Compliance
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-red-100 max-w-4xl mx-auto leading-relaxed">
                Build robust data governance frameworks and ensure compliance with global regulations. 
                Master data privacy, security, and governance best practices for enterprise data management.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                <Lock className="w-5 h-5 text-yellow-300" />
                <span className="font-medium text-white">Data Security</span>
              </div>
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                <Shield className="w-5 h-5 text-blue-300" />
                <span className="font-medium text-white">Regulatory Compliance</span>
              </div>
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                <Target className="w-5 h-5 text-green-300" />
                <span className="font-medium text-white">Governance Framework</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Overview Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Lightbulb className="w-4 h-4" />
              Why This Matters
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Why Data Governance & Compliance Matter
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              In today's data-driven world, organizations must balance data utility with privacy and security. 
              Strong data governance and compliance frameworks protect your organization, build customer trust, and enable responsible data innovation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="group text-center p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Risk Mitigation</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Identify and mitigate data risks, prevent breaches, and protect sensitive information through comprehensive governance controls.
              </p>
            </motion.div>

            <motion.div 
              className="group text-center p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Regulatory Compliance</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Ensure compliance with global regulations like GDPR, HIPAA, and SOX while maintaining operational efficiency and data utility.
              </p>
            </motion.div>

            <motion.div 
              className="group text-center p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Trust & Transparency</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Build customer and stakeholder trust through transparent data practices and accountable data management.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Tutorial Sections */}
        <div className="space-y-20">
          {/* GDPR Implementation Tutorial */}
          <TutorialSection
            title="GDPR Implementation Guide"
            description="Learn to implement GDPR compliance including data subject rights, data inventory, and privacy controls. Master the technical and process requirements for GDPR compliance."
            steps={gdprImplementationSteps}
            type="implementation"
            icon={FileText}
          />

          {/* Data Lineage Tutorial */}
          <TutorialSection
            title="Data Lineage Implementation Guide"
            description="Master data lineage tracking to understand data flow, transformations, and dependencies. Learn to build comprehensive lineage systems for governance and compliance."
            steps={dataLineageSteps}
            type="implementation"
            icon={Database}
          />
        </div>

        {/* Decision Tree */}
        <div className="my-20">
          <ArchitectureDiagram
            title="Compliance Framework Decision Tree"
            description="Use this interactive decision tree to choose the right compliance framework for your industry and requirements. Get personalized recommendations."
            type="decision-tree"
            content={complianceDecisionTree}
          />
        </div>

        {/* Implementation Checklist */}
        <div className="my-20">
          <ImplementationChecklist
            title="Data Governance Implementation Checklist"
            description="Follow this comprehensive checklist to ensure you cover all critical aspects of implementing data governance and compliance frameworks."
            items={implementationChecklist}
          />
        </div>

        {/* Tool Comparison */}
        <div className="my-20">
          <ToolComparison
            title="Data Governance Tools Comparison"
            description="Compare different data governance and compliance tools to choose the right technology stack for your implementation."
            tools={governanceTools}
            features={[]}
          />
        </div>

        {/* Next Steps */}
        <motion.div
          className="text-center py-20 bg-gradient-to-r from-slate-50 to-red-50 dark:from-slate-800 dark:to-red-900/20 rounded-3xl border border-slate-200 dark:border-slate-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="max-w-3xl mx-auto px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
              Ready to Build Data Governance?
            </h2>
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              You now have the knowledge and tools to implement robust data governance and compliance frameworks. 
              Start with the implementation checklist and work through the tutorials step by step.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <button className="group px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl hover:from-red-700 hover:to-orange-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1">
                Download Governance Guide
                <ArrowRight className="w-5 h-5 ml-2 inline group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button className="px-8 py-4 border-2 border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300 font-semibold text-lg">
                Schedule Compliance Review
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
