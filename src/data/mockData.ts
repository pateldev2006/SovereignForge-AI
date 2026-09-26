import { 
  User, DocumentItem, SOPItem, SourceCitation, SOPDeviation, 
  TaskDeliverable, IndustrialTask, ApprovalQueueItem, AuditEvent, 
  ModelItem, AICapabilityFirewallRule, RolePermissionMatrixItem, 
  NetworkTelemetry, SecurityMetrics, AgentStepTrace
} from '../types';

// ============================================================================
// 1. DEMO USERS (5 SPECIFIC ROLES)
// ============================================================================
export const DEMO_USERS: User[] = [
  {
    id: 'usr-eng-01',
    name: 'Rajesh Kumar',
    email: 'engineer@demo.local',
    role: 'PlantEngineer',
    roleTitle: 'Lead Plant & Process Engineer',
    department: 'Process Engineering — CDU/VDU Unit 03',
    employeeId: 'ENG-10482',
    clearanceLevel: 'L1 - Process Operations',
    activeSession: true,
    location: 'Industrial Complex, Unit 03',
    avatar: 'RK'
  },
  {
    id: 'usr-it-02',
    name: 'Arun Nayak',
    email: 'it@demo.local',
    role: 'ITEngineer',
    roleTitle: 'Senior Industrial Automation & SCADA Engineer',
    department: 'IT, OT & Automation Infrastructure',
    employeeId: 'IT-08914',
    clearanceLevel: 'L2 - Engineering & SCADA',
    activeSession: true,
    location: 'Central Control Building (CCB-2)',
    avatar: 'AN'
  },
  {
    id: 'usr-qa-03',
    name: 'Pooja Hegde',
    email: 'qa@demo.local',
    role: 'QAOfficer',
    roleTitle: 'Design & Asset Integrity QA Officer',
    department: 'Quality Assurance & Technical Services',
    employeeId: 'QA-06721',
    clearanceLevel: 'L3 - Quality & Compliance',
    activeSession: true,
    location: 'Technical Services Directorate',
    avatar: 'PH'
  },
  {
    id: 'usr-appr-04',
    name: 'Dr. Vikram Shetty',
    email: 'approver@demo.local',
    role: 'Approver',
    roleTitle: 'Chief General Manager & Approving Authority',
    department: 'Directorate of Refinery Operations',
    employeeId: 'EXEC-01205',
    clearanceLevel: 'L4 - Executive Approval',
    activeSession: true,
    location: 'Executive Administrative Block',
    avatar: 'VS'
  },
  {
    id: 'usr-ciso-05',
    name: 'Suresh Bhat',
    email: 'ciso@demo.local',
    role: 'CISO',
    roleTitle: 'Chief Information Security Officer (CISO)',
    department: 'Industrial Cybersecurity & Governance',
    employeeId: 'SEC-00109',
    clearanceLevel: 'L5 - CISO Security Clearance',
    activeSession: true,
    location: 'Air-Gapped SOC / Cyber Operations',
    avatar: 'SB'
  }
];

// ============================================================================
// 2. INDUSTRIAL SAMPLE DOCUMENTS
// ============================================================================
export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-hx204-insp',
    title: 'Heat Exchanger HX-204 Detailed Inspection Report (Q3-2026)',
    fileName: 'inspection_report.pdf',
    fileType: 'pdf',
    fileSize: '4.2 MB',
    classification: 'Internal',
    department: 'Mechanical Maintenance — Unit 03',
    uploadedBy: 'Rajesh Kumar (Plant Engineer)',
    uploadDate: '2026-09-24 09:15:22',
    ocrCompleted: true,
    visionCompleted: true,
    sha256: '9f8e7d6c5b4a3928170e9f8e7d6c5b4a3928170e9f8e7d6c5b4a3928170e9f8e',
    originalSha256: '9f8e7d6c5b4a3928170e9f8e7d6c5b4a3928170e9f8e7d6c5b4a3928170e9f8e',
    isTampered: false,
    description: 'Comprehensive NDT ultrasonic thickness scan, tube bundle eddy current analysis, and shell integrity evaluation for Heat Exchanger HX-204 in Crude Distillation Unit 03.',
    equipmentTarget: 'Heat Exchanger HX-204',
    securityClassification: 'Restricted Industrial Telemetry (OISD Classified)',
    internalRiskScore: 78,
    tamperChecksum: '0x8FA4199B220C'
  },
  {
    id: 'doc-sop-421',
    title: 'SOP-4.2.1: Periodic Inspection & Overhaul of Shell & Tube Exchangers',
    fileName: 'SOP_4.2.1.pdf',
    fileType: 'pdf',
    fileSize: '2.8 MB',
    classification: 'Internal',
    department: 'Asset Integrity & Standards',
    uploadedBy: 'Pooja Hegde (Design / QA)',
    uploadDate: '2026-08-10 14:30:00',
    ocrCompleted: true,
    visionCompleted: true,
    sha256: '3c4b5a69788192a0b1c2d3e4f5061728394a5b6c7d8e9f0123456789abcdef01',
    originalSha256: '3c4b5a69788192a0b1c2d3e4f5061728394a5b6c7d8e9f0123456789abcdef01',
    isTampered: false,
    description: 'Mandatory refinery operating standard specifying inspection frequencies, allowable corrosion limits, hydrotest test pressures, and mandatory turnaround schedules.',
    equipmentTarget: 'Shell & Tube Exchangers',
    securityClassification: 'Internal Process Standard',
    internalRiskScore: 45,
    tamperChecksum: '0x4AB882910FE3'
  },
  {
    id: 'doc-pid-u03',
    title: 'P&ID Unit 03: Crude Pre-Heat Train & HX-204 Bypass Circuit',
    fileName: 'P&ID_Unit_03.png',
    fileType: 'png',
    fileSize: '5.1 MB',
    classification: 'Confidential',
    department: 'Process Engineering & Design',
    uploadedBy: 'Rajesh Kumar (Plant Engineer)',
    uploadDate: '2026-09-18 11:20:45',
    ocrCompleted: true,
    visionCompleted: true,
    sha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
    originalSha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
    isTampered: false,
    description: 'High-resolution engineering schematic showing nozzle sizes, relief valve setpoints (PSV-304), temperature transmitters (TT-104A/B), and bypass isolation valves.',
    equipmentTarget: 'CDU-03 Pre-Heat Train',
    securityClassification: 'Critical Infrastructure Asset Schematic',
    internalRiskScore: 82,
    tamperChecksum: '0xCC90172BAA4E'
  },
  {
    id: 'doc-photo-hx204',
    title: 'Visual Inspection Photo: HX-204 Channel Head Gasket Seating Surface',
    fileName: 'inspection_photo.jpg',
    fileType: 'jpg',
    fileSize: '3.4 MB',
    classification: 'Internal',
    department: 'NDT & Inspection Cell',
    uploadedBy: 'Rajesh Kumar (Plant Engineer)',
    uploadDate: '2026-09-24 09:40:10',
    ocrCompleted: true,
    visionCompleted: true,
    sha256: '778899aabbccddeeff00112233445566778899aabbccddeeff00112233445566',
    originalSha256: '778899aabbccddeeff00112233445566778899aabbccddeeff00112233445566',
    isTampered: false,
    description: 'Macro photographic record of localized pitting corrosion (0.8mm depth) on floating head flange gasket contact area.',
    equipmentTarget: 'Heat Exchanger HX-204',
    securityClassification: 'Internal Asset Photo',
    internalRiskScore: 35,
    tamperChecksum: '0x11B3944ACDE8'
  },
  {
    id: 'doc-vendor-bid',
    title: 'Vendor Quotation & Scope Matrix: L&T Hydrocarbon Turnaround 2026',
    fileName: 'vendor_bid.xlsx',
    fileType: 'xlsx',
    fileSize: '1.2 MB',
    classification: 'Confidential',
    department: 'Contracts & Procurement',
    uploadedBy: 'Dr. Vikram Shetty (Approver)',
    uploadDate: '2026-09-20 16:00:15',
    ocrCompleted: true,
    visionCompleted: false,
    sha256: '5566778899aabbccddeeff00112233445566778899aabbccddeeff0011223344',
    originalSha256: '5566778899aabbccddeeff00112233445566778899aabbccddeeff0011223344',
    isTampered: false,
    description: 'Itemized vendor line-item pricing, mobilization timeline, tube bundle replacement lead times, and hydrotest guarantee terms.',
    equipmentTarget: 'Unit 03 Turnaround Package',
    securityClassification: 'Commercial & Financial In-Confidence',
    internalRiskScore: 65,
    tamperChecksum: '0x77EE00192A41'
  }
];

// ============================================================================
// 3. INDUSTRIAL SOPS & ENGINEERING STANDARDS
// ============================================================================
export const INITIAL_SOPS: SOPItem[] = [
  {
    id: 'sop-421',
    sopCode: 'Enterprise-SOP-4.2.1',
    title: 'Standard Operating Procedure: Shell & Tube Heat Exchanger Inspection & Maintenance',
    category: 'Mechanical',
    version: 'Rev 4.2',
    effectiveDate: '2025-04-01',
    pageCount: 36,
    classification: 'Internal',
    sections: [
      {
        sectionId: 'sec-421-18',
        sectionNumber: 'Section 4.2.1',
        heading: 'Mandatory Inspection Frequency & Overhaul Intervals',
        page: 18,
        text: 'For all Class-1 and Class-2 heat exchangers operating in corrosive sour crude service (>1.5 wt% total sulfur), physical non-destructive inspection and ultrasonic tube bundle evaluation shall be conducted at a strictly mandated interval not exceeding 12 months (365 calendar days). Extension beyond 12 months requires formal written deviation approval by Asset Integrity Directorate and Chief Operations Manager.',
        mandatoryRule: 'Maximum allowable inspection interval: 12 months (sour crude service).'
      },
      {
        sectionId: 'sec-421-22',
        sectionNumber: 'Section 4.3.4',
        heading: 'Tube Bundle Corrosion Allowances & Retubing Thresholds',
        page: 22,
        text: 'When measured tube wall thinning exceeds 35% of nominal design thickness (nominal 2.11 mm; critical threshold < 1.37 mm), or when localized pit depth exceeds 0.75 mm in floating head tube sheets, tube plugging or partial bundle replacement is mandatory prior to recommissioning.',
        mandatoryRule: 'Retubing or plugging required when thinning > 35% or pit depth > 0.75 mm.'
      },
      {
        sectionId: 'sec-421-29',
        sectionNumber: 'Section 5.1.2',
        heading: 'Hydrostatic Pressure Test Verification Parameters',
        page: 29,
        text: 'Post-maintenance hydrostatic pressure test must be performed at 1.5 times the maximum allowable working pressure (MAWP = 24.5 kg/cm²g; Test Pressure = 36.75 kg/cm²g) with demineralized water (chloride content < 25 ppm) held for a minimum stabilization duration of 60 minutes with zero observable pressure drop.',
        mandatoryRule: 'Hydrotest: 1.5x MAWP (36.75 kg/cm²g) for 60 min with zero pressure drop.'
      }
    ]
  },
  {
    id: 'sop-214',
    sopCode: 'Enterprise-SOP-2.1.4',
    title: 'Process Safety Management: Mechanical Isolation & LOTO for Pressure Vessels',
    category: 'Safety',
    version: 'Rev 3.0',
    effectiveDate: '2025-01-15',
    pageCount: 24,
    classification: 'Internal',
    sections: [
      {
        sectionId: 'sec-214-08',
        sectionNumber: 'Section 2.1',
        heading: 'Double Block and Bleed (DBB) Positive Isolation',
        page: 8,
        text: 'No pressure vessel or heat exchanger shall be opened for internal inspection without verified spectacle blind positive isolation on hydrocarbon inlet and outlet lines.',
        mandatoryRule: 'Mandatory spectacle blind positive isolation prior to vessel entry.'
      }
    ]
  },
  {
    id: 'oisd-129',
    sopCode: 'OISD-STD-129',
    title: 'Oil Industry Safety Directorate: Inspection of Storage Tanks & Pressure Vessels',
    category: 'Safety',
    version: '2024 Edition',
    effectiveDate: '2024-11-01',
    pageCount: 52,
    classification: 'Public',
    sections: [
      {
        sectionId: 'sec-oisd-14',
        sectionNumber: 'Clause 6.2',
        heading: 'Statutory Overhaul Cycle for Petroleum Refining Units',
        page: 14,
        text: 'Refinery heat exchange equipment handling flammable fractions above flash point must be inspected within statutory limits set by PESO and state boiler regulations.',
        mandatoryRule: 'Statutory compliance with OISD and PESO inspection mandates.'
      }
    ]
  }
];

// ============================================================================
// 4. RETRIEVED SOURCE CITATIONS (PROVENANCE EVIDENCE)
// ============================================================================
export const SAMPLE_RETRIEVED_SOURCES: SourceCitation[] = [
  {
    id: 'cite-01',
    citationIndex: 1,
    documentTitle: 'SOP-4.2.1: Shell & Tube Exchanger Procedure',
    documentCode: 'SOP-4.2.1',
    pageNumber: 18,
    sectionTitle: 'Section 4.2.1 — Mandatory Inspection Frequency',
    exactExcerpt: 'For all Class-1 and Class-2 heat exchangers operating in corrosive sour crude service (>1.5 wt% total sulfur), physical non-destructive inspection and ultrasonic tube bundle evaluation shall be conducted at a strictly mandated interval not exceeding 12 months (365 calendar days). Extension beyond 12 months requires formal written deviation approval.',
    relevanceScore: 98,
    classification: 'Internal',
    type: 'SOP'
  },
  {
    id: 'cite-02',
    citationIndex: 2,
    documentTitle: 'Inspection Report: Heat Exchanger HX-204 (Q3-2026)',
    documentCode: 'INSP/2026/HX-204',
    pageNumber: 4,
    sectionTitle: 'Section 3.2 — Schedule & Maintenance Recommendations',
    exactExcerpt: 'Based on remaining calculated corrosion allowance on shell wall (calculated 4.2mm remaining), the field NDT team recommends deferring the next comprehensive turnaround and internal tube pulling to 18 months from current date (March 2028).',
    relevanceScore: 95,
    classification: 'Internal',
    type: 'InspectionReport'
  },
  {
    id: 'cite-03',
    citationIndex: 3,
    documentTitle: 'SOP-4.2.1: Shell & Tube Exchanger Procedure',
    documentCode: 'SOP-4.2.1',
    pageNumber: 22,
    sectionTitle: 'Section 4.3.4 — Tube Wall Thinning & Plugging Limits',
    exactExcerpt: 'When measured tube wall thinning exceeds 35% of nominal design thickness (nominal 2.11 mm; critical threshold < 1.37 mm), or when localized pit depth exceeds 0.75 mm in floating head tube sheets, tube plugging or partial bundle replacement is mandatory.',
    relevanceScore: 91,
    classification: 'Internal',
    type: 'SOP'
  }
];

// ============================================================================
// 5. SOP DEVIATION DETECTED
// ============================================================================
export const SAMPLE_DEVIATION: SOPDeviation = {
  id: 'dev-hx204-001',
  equipment: 'Heat Exchanger HX-204 (Crude Pre-Heat)',
  parameterName: 'Next Scheduled Turnaround / Inspection Frequency',
  observedValue: '18 months (March 2028 proposed by NDT team)',
  requiredValue: '12 months (Mandated for sour crude service >1.5 wt% S)',
  variance: '+6 months (+50% non-compliant extension)',
  severity: 'Critical',
  observedSourceDoc: 'Inspection Report HX-204 (inspection_report.pdf) — Page 4',
  observedPage: 4,
  requiredStandardDoc: 'SOP-4.2.1 (SOP_4.2.1.pdf) — Page 18, Section 4.2.1',
  requiredPage: 18,
  riskDescription: 'Operating sour crude heat exchanger 6 months past mandatory 12-month limit introduces severe vulnerability to undetected tube breach, crude-to-naphtha cross-contamination, and uncontained high-temperature flange leakage.',
  mandatoryAction: 'Human Review Required. Reject 18-month deferral; enforce mandatory 12-month overhaul by September 2027 with mandatory gasket seating overhaul.',
  status: 'Detected'
};

// ============================================================================
// 6. AGENT EXECUTION TRACE PIPELINE
// ============================================================================
export const SAMPLE_AGENT_STEPS: AgentStepTrace[] = [
  {
    id: 'step-01',
    stepNumber: 1,
    name: 'Task Classification & Intelligent Routing',
    model: 'AI Task Router v2.4 (Rule & Intent Engine)',
    status: 'completed',
    durationMs: 340,
    details: 'Detected complex industrial document ingestion + compliance audit request. Selected Qwen2.5-VL-7B Multimodal model.',
    tokensProcessed: 142,
    outputSummary: 'Route: Multimodal Document Compliance Engine'
  },
  {
    id: 'step-02',
    stepNumber: 2,
    name: 'Multimodal Document Ingestion & Vision OCR',
    model: 'Qwen2.5-VL-7B + PaddleOCR-v4 Engine',
    status: 'completed',
    durationMs: 2840,
    details: 'Parsed 4.2 MB PDF: 14 pages scanned text, 3 ultrasonic calibration tables, and 1 high-resolution gasket contact photo.',
    tokensProcessed: 4890,
    outputSummary: 'Extracted 12,450 tokens with 99.4% OCR confidence'
  },
  {
    id: 'step-03',
    stepNumber: 3,
    name: 'Hybrid Multimodal RAG Retrieval (Dense + Sparse + Graph)',
    model: 'BGE-M3 (Dense) + BM25 + Knowledge Graph Router',
    status: 'completed',
    durationMs: 1220,
    details: 'Searched 128 air-gapped refinery SOPs. Formulated vector query for HX-204 inspection interval, tube thickness, and sour crude limits.',
    tokensProcessed: 1850,
    outputSummary: '3 relevant SOP sections retrieved (Max relevance: 98%)'
  },
  {
    id: 'step-04',
    stepNumber: 4,
    name: 'Cross-Encoder Re-Ranking & Context Synthesis',
    model: 'BGE-Reranker-v2-Large (Local Air-Gapped)',
    status: 'completed',
    durationMs: 780,
    details: 'Prioritized SOP-4.2.1 Section 4.2.1 (p.18) and Section 4.3.4 (p.22). Injected into constrained reasoning context.',
    tokensProcessed: 3200,
    outputSummary: 'Top 3 authoritative references locked for provenance'
  },
  {
    id: 'step-05',
    stepNumber: 5,
    name: 'Deep Industrial Reasoning & Deviation Detection',
    model: 'Qwen-2.5-72B-Instruct / DeepSeek-R1-Distill',
    status: 'warning',
    durationMs: 3450,
    details: 'Compared observed NDT proposal (18 mos) against SOP-4.2.1 mandate (12 mos). Flagged critical non-conformance variance of +6 months.',
    tokensProcessed: 6120,
    outputSummary: '⚠️ SOP DEVIATION DETECTED (+6 Month Overrun)'
  },
  {
    id: 'step-06',
    stepNumber: 6,
    name: 'Deterministic Verification & Provenance Anchor',
    model: 'SovereignForge Policy & Verification Engine',
    status: 'completed',
    durationMs: 1120,
    details: 'Verified all factual statements against page numbers and cryptographic document hashes. Anchored citations [1], [2], [3].',
    tokensProcessed: 2400,
    outputSummary: 'Verification Rate: 100% (Zero Hallucinations)'
  },
  {
    id: 'step-07',
    stepNumber: 7,
    name: 'Official Deliverable & Approval Note Generation',
    model: 'Enterprise Industrial Template Generator v3.1',
    status: 'completed',
    durationMs: 1650,
    details: 'Structured formal executive note Ref: MECH/2026/HX-204-APPR ready for human engineering review.',
    tokensProcessed: 3800,
    outputSummary: 'Generated 4-page formal approval draft'
  }
];

// ============================================================================
// 7. TASK DELIVERABLE (GENERATED APPROVAL NOTE)
// ============================================================================
export const SAMPLE_DELIVERABLE: TaskDeliverable = {
  id: 'deliv-hx204-appr',
  referenceNumber: 'MECH/2026/HX-204-APPR',
  title: 'Technical Approval Note: Heat Exchanger HX-204 Maintenance & Overhaul Schedule',
  equipmentId: 'HX-204',
  equipmentName: 'Crude Pre-Heat Train Exchanger 204 (Shell & Tube)',
  unit: 'Crude Distillation Unit (CDU-03)',
  generatedDate: '2026-09-26 10:42:18',
  generatedByModel: 'SovereignForge Agentic Orchestrator (Qwen2.5-VL / R1-Distill)',
  executiveSummary: 'This technical approval note synthesizes the Q3-2026 Non-Destructive Testing (NDT) inspection findings for Heat Exchanger HX-204 and validates proposed overhaul timelines against mandatory Enterprise Standard Operating Procedure SOP-4.2.1. While ultrasonic wall thickness measurements confirm adequate shell base metal integrity, the field inspection recommendation to extend the turnaround interval to 18 months is a CRITICAL SOP DEVIATION. Approval is recommended conditionally upon enforcing a strict 12-month maximum turnaround deadline (September 2027).',
  findings: [
    {
      point: 'Shell base metal ultrasonic thickness scan indicates 14.8 mm average (Design: 16.0 mm; Minimum allowable: 10.6 mm; calculated corrosion allowance remaining: 4.2 mm).',
      citationId: 2,
      status: 'Normal'
    },
    {
      point: 'Localized pitting corrosion of 0.82 mm depth observed on floating head gasket seating surface, exceeding allowable 0.75 mm limit specified in SOP-4.2.1.',
      citationId: 3,
      status: 'Observation'
    },
    {
      point: 'NDT field team proposed next turnaround at 18 months, exceeding the 12-month maximum interval mandated for sour crude service (>1.5 wt% S).',
      citationId: 2,
      status: 'Non-Conformance'
    }
  ],
  sopComparison: [
    {
      criterion: 'Next Mandatory Overhaul Interval',
      observed: '18 Months (March 2028)',
      standard: '12 Months (September 2027 max)',
      compliance: 'DEVIATION',
      citationId: 1
    },
    {
      criterion: 'Floating Head Gasket Pitting Depth',
      observed: '0.82 mm localized pit',
      standard: '0.75 mm max before resurfacing',
      compliance: 'DEVIATION',
      citationId: 3
    },
    {
      criterion: 'Shell Wall Remaining Thickness',
      observed: '14.8 mm (4.2 mm allowance)',
      standard: '10.6 mm minimum retired limit',
      compliance: 'COMPLIANT',
      citationId: 2
    },
    {
      criterion: 'Required Hydrotest Pressure',
      observed: '36.75 kg/cm²g specified',
      standard: '1.5x MAWP = 36.75 kg/cm²g',
      compliance: 'COMPLIANT',
      citationId: 1
    }
  ],
  deviation: SAMPLE_DEVIATION,
  recommendation: 'CONDITIONAL APPROVAL: Reject proposed 18-month overhaul deferral. Schedule mandatory shop turnaround for Heat Exchanger HX-204 at the 12-month milestone (September 2027). Authorize precision machining/resurfacing of the floating head gasket seating surface during upcoming planned mini-turnaround window.',
  riskAssessment: 'High Operational Risk',
  verificationHash: 'SHA256: e8d7c6b5a49382710f9e8d7c6b5a49382710f9e8d7c6b5a49382710f9e8d7c6b',
  status: 'Awaiting Human Review',
  approvedBy: undefined,
  approvalTimestamp: undefined,
  digitalSignature: undefined,
  reviewerNotes: 'Awaiting review and digital sign-off from Approving Authority (Dr. Vikram Shetty).'
};

// ============================================================================
// 8. INITIAL INDUSTRIAL TASKS
// ============================================================================
export const INITIAL_TASKS: IndustrialTask[] = [
  {
    id: 'task-hx204',
    taskNumber: 'SF-TASK-2026-0042',
    title: 'Prepare Approval Note for Heat Exchanger HX-204 & Verify Against SOP-4.2.1',
    description: 'Ingest Q3-2026 NDT inspection report, extract ultrasonic tube bundle measurements, cross-reference SOP-4.2.1, detect maintenance schedule deviations, and draft formal engineering approval note.',
    requestedBy: 'Rajesh Kumar (Plant Engineer)',
    requestedByRole: 'PlantEngineer',
    createdAt: '2026-09-26 10:41:00',
    status: 'Awaiting Approval',
    modelRoute: {
      taskType: 'Multimodal Document Analysis & SOP Compliance',
      selectedModel: 'Qwen2.5-VL-7B (Vision) + R1-Distill (Reasoning)',
      routingReason: 'Scanned engineering PDF + inspection photography + tabular NDT data detected',
      confidence: 99.2
    },
    attachedFiles: ['inspection_report.pdf', 'SOP_4.2.1.pdf', 'P&ID_Unit_03.png', 'inspection_photo.jpg'],
    agentSteps: SAMPLE_AGENT_STEPS,
    retrievedSources: SAMPLE_RETRIEVED_SOURCES,
    deviations: [SAMPLE_DEVIATION],
    deliverable: SAMPLE_DELIVERABLE,
    totalDurationSec: 12.4
  },
  {
    id: 'task-pid-u03',
    taskNumber: 'SF-TASK-2026-0038',
    title: 'P&ID Unit 03 Relief Line Sizing & PSV Setpoint Audit',
    description: 'Cross-check relief valve PSV-304 setpoint (32.0 kg/cm²g) against OISD-STD-129 and high-pressure crude pre-heat line design ratings.',
    requestedBy: 'Pooja Hegde (Design / QA)',
    requestedByRole: 'QAOfficer',
    createdAt: '2026-09-25 15:10:00',
    status: 'Approved',
    modelRoute: {
      taskType: 'Engineering Drawing OCR & Valve Schedule Verification',
      selectedModel: 'Qwen2.5-VL-7B',
      routingReason: 'High-resolution P&ID schematic with vector tags',
      confidence: 97.8
    },
    attachedFiles: ['P&ID_Unit_03.png', 'SOP_4.2.1.pdf'],
    agentSteps: [],
    retrievedSources: [],
    deviations: [],
    totalDurationSec: 8.9
  },
  {
    id: 'task-scada-code',
    taskNumber: 'SF-TASK-2026-0031',
    title: 'Python Modbus Data Collector for CDU-03 Temperature Transmitters',
    description: 'Generate secure, sandboxed Modbus TCP polling script with zero external dependencies to read TT-104A/B registers into local PostgreSQL.',
    requestedBy: 'Arun Nayak (IT Engineer)',
    requestedByRole: 'ITEngineer',
    createdAt: '2026-09-24 11:00:00',
    status: 'Completed',
    modelRoute: {
      taskType: 'Sandboxed Python / SCADA Script Generation',
      selectedModel: 'Qwen-Coder-32B-Instruct',
      routingReason: 'Programming and network socket task detected',
      confidence: 99.6
    },
    attachedFiles: ['P&ID_Unit_03.png'],
    agentSteps: [],
    retrievedSources: [],
    deviations: [],
    totalDurationSec: 4.2
  }
];

// ============================================================================
// 9. APPROVAL QUEUE (APPROVING AUTHORITY & QA OFFICER)
// ============================================================================
export const INITIAL_APPROVALS: ApprovalQueueItem[] = [
  {
    id: 'appr-queue-001',
    taskId: 'task-hx204',
    taskNumber: 'SF-TASK-2026-0042',
    title: 'Approval Note: Heat Exchanger HX-204 Overhaul Schedule',
    documentType: 'Technical Approval Note',
    equipment: 'Heat Exchanger HX-204',
    requester: 'Rajesh Kumar',
    requesterRole: 'Plant / Process Engineer',
    department: 'CDU/VDU Unit 03',
    submittedAt: '2026-09-26 10:42:20',
    riskLevel: 'High',
    status: 'Awaiting Review',
    deviationDetected: true,
    deviationSummary: 'Proposed 18-month turnaround exceeds 12-month SOP-4.2.1 limit by +6 months.',
    deliverable: SAMPLE_DELIVERABLE
  },
  {
    id: 'appr-queue-002',
    taskId: 'task-pid-u03',
    taskNumber: 'SF-TASK-2026-0038',
    title: 'P&ID Unit 03 Relief Line Sizing Audit',
    documentType: 'Compliance Audit Sign-Off',
    equipment: 'PSV-304 Relief Loop',
    requester: 'Pooja Hegde',
    requesterRole: 'Design / QA Officer',
    department: 'Quality Assurance',
    submittedAt: '2026-09-25 16:30:00',
    riskLevel: 'Low',
    status: 'Approved',
    deviationDetected: false,
    deliverable: {
      ...SAMPLE_DELIVERABLE,
      id: 'deliv-pid-appr',
      referenceNumber: 'QA/2026/PSV-304-AUD',
      title: 'Relief Valve PSV-304 Setpoint Compliance Certification',
      status: 'Approved',
      approvedBy: 'Dr. Vikram Shetty (Approving Authority)',
      approvalTimestamp: '2026-09-25 17:00:12',
      digitalSignature: 'SIG_RSA4096_7F99E0221BA890'
    }
  }
];

// ============================================================================
// 10. AIR-GAPPED MODEL REGISTRY (CISO & ADMIN ONLY)
// ============================================================================
export const INITIAL_MODELS: ModelItem[] = [
  {
    id: 'mdl-qwen-vl',
    name: 'Qwen2.5-VL-7B-Instruct',
    category: 'Vision-Language',
    parameters: '7.6 Billion',
    quantization: 'AWQ 4-bit (TensorRT-LLM)',
    status: 'ACTIVE',
    version: 'v2.5-202603',
    integrityVerified: true,
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    vramUsageGb: 5.8,
    vramTotalGb: 24.0,
    inferenceLatencyMs: 42,
    tpsSpeed: 64.2,
    lastHealthCheck: '2026-09-26 12:00:00',
    description: 'Multimodal vision-language model for parsing scanned P&IDs, handwritten inspection sheets, NDT charts, and equipment damage photography.',
    localPath: '/opt/sovereignforge/models/weights/qwen2.5-vl-7b-awq'
  },
  {
    id: 'mdl-qwen-coder',
    name: 'Qwen2.5-Coder-32B-Instruct',
    category: 'Code & Automation',
    parameters: '32.5 Billion',
    quantization: 'GPTQ 4-bit (vLLM Engine)',
    status: 'READY',
    version: 'v2.5-Coder',
    integrityVerified: true,
    sha256Hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    vramUsageGb: 19.2,
    vramTotalGb: 48.0,
    inferenceLatencyMs: 65,
    tpsSpeed: 48.5,
    lastHealthCheck: '2026-09-26 11:58:30',
    description: 'Specialized code generation & static analysis engine for SCADA Modbus drivers, SQL data extractors, and DCS telemetry analyzers.',
    localPath: '/opt/sovereignforge/models/weights/qwen2.5-coder-32b-gptq'
  },
  {
    id: 'mdl-r1-distill',
    name: 'DeepSeek-R1-Distill-Qwen-14B',
    category: 'Reasoning & Logic',
    parameters: '14.7 Billion',
    quantization: 'GGUF Q8_0 (Llama.cpp on Prem)',
    status: 'ACTIVE',
    version: 'R1-Distill-2026',
    integrityVerified: true,
    sha256Hash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
    vramUsageGb: 15.4,
    vramTotalGb: 24.0,
    inferenceLatencyMs: 58,
    tpsSpeed: 52.0,
    lastHealthCheck: '2026-09-26 12:01:10',
    description: 'High-rigor chain-of-thought mathematical and regulatory deviation analyzer with zero hallucination enforcement.',
    localPath: '/opt/sovereignforge/models/weights/deepseek-r1-distill-qwen-14b-q8'
  },
  {
    id: 'mdl-bge-m3',
    name: 'BAAI/BGE-M3 Multilingual Dense',
    category: 'Dense Embeddings',
    parameters: '568 Million',
    quantization: 'FP16 (ONNX Runtime)',
    status: 'ACTIVE',
    version: 'v3.0-Dense',
    integrityVerified: true,
    sha256Hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    vramUsageGb: 1.4,
    vramTotalGb: 24.0,
    inferenceLatencyMs: 8,
    tpsSpeed: 320.0,
    lastHealthCheck: '2026-09-26 12:02:00',
    description: '1024-dim dense vector embedding model for hybrid semantic search over SOPs, P&IDs, and equipment manuals.',
    localPath: '/opt/sovereignforge/models/weights/bge-m3-fp16'
  },
  {
    id: 'mdl-bge-rerank',
    name: 'BAAI/BGE-Reranker-v2-Large',
    category: 'Cross-Encoder Reranker',
    parameters: '560 Million',
    quantization: 'FP16 (TensorRT)',
    status: 'ACTIVE',
    version: 'v2.0-Large',
    integrityVerified: true,
    sha256Hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    vramUsageGb: 1.2,
    vramTotalGb: 24.0,
    inferenceLatencyMs: 14,
    tpsSpeed: 180.0,
    lastHealthCheck: '2026-09-26 12:02:15',
    description: 'Cross-encoder reranking model evaluating query-document candidate relevance prior to LLM context assembly.',
    localPath: '/opt/sovereignforge/models/weights/bge-reranker-v2-fp16'
  },
  {
    id: 'mdl-paddleocr',
    name: 'PaddleOCR-v4 Industrial Doc Engine',
    category: 'Document OCR',
    parameters: '120 Million',
    quantization: 'INT8 Optimized',
    status: 'ACTIVE',
    version: 'v4.1',
    integrityVerified: true,
    sha256Hash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    vramUsageGb: 0.8,
    vramTotalGb: 24.0,
    inferenceLatencyMs: 12,
    tpsSpeed: 210.0,
    lastHealthCheck: '2026-09-26 12:03:00',
    description: 'High-speed OCR parser for scanned engineering tables, stamp seals, handwritten inspection notes, and P&ID text.',
    localPath: '/opt/sovereignforge/models/weights/paddleocr-v4-int8'
  }
];

// ============================================================================
// 11. AI CAPABILITY FIREWALL RULES (CISO & ADMIN ONLY)
// ============================================================================
export const INITIAL_FIREWALL_RULES: AICapabilityFirewallRule[] = [
  {
    id: 'fw-rule-01',
    agentName: 'Inspection & Compliance Agent',
    agentRole: 'Multimodal NDT document extraction & SOP cross-referencing',
    readDocs: true,
    writeFiles: true,
    runCode: false,
    internetAccess: false, // Invariant: Permanently disabled
    exportData: true,
    maxExecutionSec: 60,
    memoryLimitMb: 4096,
    allowedToolIds: ['tool-ocr-extract', 'tool-rag-search', 'tool-sop-compare', 'tool-docx-gen']
  },
  {
    id: 'fw-rule-02',
    agentName: 'IT Automation & Code Agent',
    agentRole: 'SCADA connector scripting & isolated sandbox code execution',
    readDocs: true,
    writeFiles: true,
    runCode: true,
    internetAccess: false, // Invariant: Permanently disabled
    exportData: true,
    maxExecutionSec: 30,
    memoryLimitMb: 2048,
    allowedToolIds: ['tool-code-exec', 'tool-schema-inspect', 'tool-syntax-check']
  },
  {
    id: 'fw-rule-03',
    agentName: 'Asset Integrity Analysis Agent',
    agentRole: 'Calculates corrosion rates & remaining life predictions',
    readDocs: true,
    writeFiles: false,
    runCode: false,
    internetAccess: false, // Invariant: Permanently disabled
    exportData: false,
    maxExecutionSec: 45,
    memoryLimitMb: 2048,
    allowedToolIds: ['tool-rag-search', 'tool-corrosion-calc']
  },
  {
    id: 'fw-rule-04',
    agentName: 'Deliverable Approval Agent',
    agentRole: 'Formats official Enterprise approval notes & generates cryptographic hashes',
    readDocs: true,
    writeFiles: true,
    runCode: false,
    internetAccess: false, // Invariant: Permanently disabled
    exportData: true,
    maxExecutionSec: 20,
    memoryLimitMb: 1024,
    allowedToolIds: ['tool-docx-gen', 'tool-pdf-stamp', 'tool-hash-anchor']
  }
];

// ============================================================================
// 12. ROLE & PERMISSION MATRIX (5 ROLES × MODULES)
// ============================================================================
export const INITIAL_ROLE_PERMISSION_MATRIX: RolePermissionMatrixItem[] = [
  {
    module: 'Industrial AI Workbench',
    moduleKey: 'workbench',
    category: 'Workbench',
    permissions: {
      PlantEngineer: { view: true, create: true, edit: true, delete: false, approve: false, export: true, admin: false },
      ITEngineer:    { view: true, create: true, edit: true, delete: false, approve: false, export: true, admin: false },
      QAOfficer:     { view: true, create: true, edit: true, delete: false, approve: false, export: true, admin: false },
      Approver:      { view: true, create: true, edit: false, delete: false, approve: true, export: true, admin: false },
      CISO:          { view: true, create: true, edit: true, delete: true, approve: true, export: true, admin: true }
    }
  },
  {
    module: 'Document Repository',
    moduleKey: 'documents',
    category: 'Workbench',
    permissions: {
      PlantEngineer: { view: true, create: true, edit: false, delete: false, approve: false, export: true, admin: false },
      ITEngineer:    { view: true, create: true, edit: false, delete: false, approve: false, export: true, admin: false },
      QAOfficer:     { view: true, create: true, edit: true, delete: false, approve: false, export: true, admin: false },
      Approver:      { view: true, create: false, edit: false, delete: false, approve: false, export: true, admin: false },
      CISO:          { view: true, create: true, edit: true, delete: true, approve: true, export: true, admin: true }
    }
  },
  {
    module: 'SOP & Standards Knowledge Base',
    moduleKey: 'knowledge',
    category: 'Workbench',
    permissions: {
      PlantEngineer: { view: true, create: false, edit: false, delete: false, approve: false, export: false, admin: false },
      ITEngineer:    { view: true, create: false, edit: false, delete: false, approve: false, export: false, admin: false },
      QAOfficer:     { view: true, create: true, edit: true, delete: false, approve: false, export: true, admin: false },
      Approver:      { view: true, create: false, edit: false, delete: false, approve: false, export: false, admin: false },
      CISO:          { view: true, create: true, edit: true, delete: true, approve: true, export: true, admin: true }
    }
  },
  {
    module: 'Approval & Sign-Off Queue',
    moduleKey: 'approvals',
    category: 'Governance',
    permissions: {
      PlantEngineer: { view: false, create: false, edit: false, delete: false, approve: false, export: false, admin: false },
      ITEngineer:    { view: false, create: false, edit: false, delete: false, approve: false, export: false, admin: false },
      QAOfficer:     { view: true, create: false, edit: false, delete: false, approve: true, export: true, admin: false },
      Approver:      { view: true, create: false, edit: false, delete: false, approve: true, export: true, admin: false },
      CISO:          { view: true, create: false, edit: false, delete: false, approve: true, export: true, admin: true }
    }
  },
  {
    module: 'Design & P&ID Review Queue',
    moduleKey: 'reviews',
    category: 'Governance',
    permissions: {
      PlantEngineer: { view: false, create: false, edit: false, delete: false, approve: false, export: false, admin: false },
      ITEngineer:    { view: false, create: false, edit: false, delete: false, approve: false, export: false, admin: false },
      QAOfficer:     { view: true, create: true, edit: true, delete: false, approve: true, export: true, admin: false },
      Approver:      { view: true, create: false, edit: false, delete: false, approve: false, export: false, admin: false },
      CISO:          { view: true, create: true, edit: true, delete: true, approve: true, export: true, admin: true }
    }
  },
  {
    module: 'IT Code Agent & Sandbox',
    moduleKey: 'code-sandbox',
    category: 'Workbench',
    permissions: {
      PlantEngineer: { view: false, create: false, edit: false, delete: false, approve: false, export: false, admin: false },
      ITEngineer:    { view: true, create: true, edit: true, delete: true, approve: false, export: true, admin: false },
      QAOfficer:     { view: false, create: false, edit: false, delete: false, approve: false, export: false, admin: false },
      Approver:      { view: false, create: false, edit: false, delete: false, approve: false, export: false, admin: false },
      CISO:          { view: true, create: true, edit: true, delete: true, approve: true, export: true, admin: true }
    }
  },
  {
    module: 'Local Model Registry',
    moduleKey: 'admin-models',
    category: 'Administration',
    permissions: {
      PlantEngineer: { view: false, create: false, edit: false, delete: false, approve: false, export: false, admin: false },
      ITEngineer:    { view: true, create: false, edit: false, delete: false, approve: false, export: false, admin: false },
      QAOfficer:     { view: false, create: false, edit: false, delete: false, approve: false, export: false, admin: false },
      Approver:      { view: false, create: false, edit: false, delete: false, approve: false, export: false, admin: false },
      CISO:          { view: true, create: true, edit: true, delete: true, approve: true, export: true, admin: true }
    }
  },
  {
    module: 'AI Capability Firewall',
    moduleKey: 'admin-firewall',
    category: 'Administration',
    permissions: {
      PlantEngineer: { view: false, create: false, edit: false, delete: false, approve: false, export: false, admin: false },
      ITEngineer:    { view: false, create: false, edit: false, delete: false, approve: false, export: false, admin: false },
      QAOfficer:     { view: false, create: false, edit: false, delete: false, approve: false, export: false, admin: false },
      Approver:      { view: false, create: false, edit: false, delete: false, approve: false, export: false, admin: false },
      CISO:          { view: true, create: true, edit: true, delete: true, approve: true, export: true, admin: true }
    }
  },
  {
    module: 'CISO Security Dashboard & Policies',
    moduleKey: 'admin-security',
    category: 'Administration',
    permissions: {
      PlantEngineer: { view: false, create: false, edit: false, delete: false, approve: false, export: false, admin: false },
      ITEngineer:    { view: false, create: false, edit: false, delete: false, approve: false, export: false, admin: false },
      QAOfficer:     { view: false, create: false, edit: false, delete: false, approve: false, export: false, admin: false },
      Approver:      { view: false, create: false, edit: false, delete: false, approve: false, export: false, admin: false },
      CISO:          { view: true, create: true, edit: true, delete: true, approve: true, export: true, admin: true }
    }
  },
  {
    module: 'Global Forensic Audit Ledger',
    moduleKey: 'admin-audit',
    category: 'Administration',
    permissions: {
      PlantEngineer: { view: false, create: false, edit: false, delete: false, approve: false, export: false, admin: false },
      ITEngineer:    { view: false, create: false, edit: false, delete: false, approve: false, export: false, admin: false },
      QAOfficer:     { view: false, create: false, edit: false, delete: false, approve: false, export: false, admin: false },
      Approver:      { view: false, create: false, edit: false, delete: false, approve: false, export: false, admin: false },
      CISO:          { view: true, create: false, edit: false, delete: false, approve: false, export: true, admin: true }
    }
  }
];

// ============================================================================
// 13. TAMPER-EVIDENT FORENSIC AUDIT EVENTS
// ============================================================================
export const INITIAL_AUDIT_LOGS: AuditEvent[] = [
  {
    id: 'aud-001',
    auditId: 'SF-AUD-2026-02431',
    timestamp: '2026-09-26 10:42:22',
    user: 'Rajesh Kumar (PlantEngineer)',
    role: 'PlantEngineer',
    action: 'AI_AGENT_WORKFLOW_EXECUTED',
    resource: 'Heat Exchanger HX-204 (inspection_report.pdf)',
    agent: 'Inspection & Compliance Agent (Qwen2.5-VL)',
    result: 'SUCCESS',
    risk: 'Medium',
    hashSignature: '0x7E3A99B4021F8C2A',
    details: 'Completed 7-step autonomous analysis in 12.4s. Detected critical SOP-4.2.1 deviation (+6 mos). Drafted approval note Ref: MECH/2026/HX-204-APPR.',
    clientIp: '10.14.32.105 (Internal LAN)',
    forensicTrace: {
      modelUsed: 'Qwen2.5-VL-7B + R1-Distill',
      tokensIn: 14820,
      tokensOut: 2450,
      latencyMs: 12400,
      guardrailViolations: 0
    }
  },
  {
    id: 'aud-002',
    auditId: 'SF-AUD-2026-02430',
    timestamp: '2026-09-26 10:41:05',
    user: 'Rajesh Kumar (PlantEngineer)',
    role: 'PlantEngineer',
    action: 'DOCUMENT_INGESTED',
    resource: 'inspection_report.pdf (SHA-256: 9f8e7d...9f8e)',
    agent: 'Document Ingestion Pipeline',
    result: 'SUCCESS',
    risk: 'Low',
    hashSignature: '0x1A2B3C4D5E6F7081',
    details: 'Uploaded 4.2 MB file into air-gapped local MinIO storage. Generated cryptographic hash signature.',
    clientIp: '10.14.32.105 (Internal LAN)'
  },
  {
    id: 'aud-003',
    auditId: 'SF-AUD-2026-02429',
    timestamp: '2026-09-26 09:14:10',
    user: 'External Gateway Probe (192.168.1.50)',
    role: 'PlantEngineer',
    action: 'EXTERNAL_EGRESS_ATTEMPT',
    resource: 'api.openai.com:443',
    agent: 'AI Capability Firewall',
    result: 'BLOCKED',
    risk: 'Critical',
    hashSignature: '0xDEADBEEF00000000',
    details: 'Air-Gap Firewall blocked outbound connection attempt to external IP. Hardware isolation enforced.',
    clientIp: '192.168.1.50 (Blocked Interface)'
  },
  {
    id: 'aud-004',
    auditId: 'SF-AUD-2026-02428',
    timestamp: '2026-09-25 17:00:12',
    user: 'Dr. Vikram Shetty (Approver)',
    role: 'Approver',
    action: 'APPROVAL_NOTE_SIGNED',
    resource: 'QA/2026/PSV-304-AUD (P&ID Audit)',
    agent: 'Deliverable Approval Agent',
    result: 'SUCCESS',
    risk: 'Low',
    hashSignature: '0x8899AABBCCDDEEFF',
    details: 'Applied digital signature SIG_RSA4096_7F99E0221BA890 to relief valve compliance certificate.',
    clientIp: '10.14.10.12 (Executive Network)'
  },
  {
    id: 'aud-005',
    auditId: 'SF-AUD-2026-02427',
    timestamp: '2026-09-25 15:30:44',
    user: 'Arun Nayak (ITEngineer)',
    role: 'ITEngineer',
    action: 'CODE_SANDBOX_EXECUTION',
    resource: 'modbus_poller.py (SCADA Reader)',
    agent: 'IT Automation & Code Agent',
    result: 'SUCCESS',
    risk: 'Low',
    hashSignature: '0x554433221100FFEE',
    details: 'Executed 120 lines of Python code in air-gapped Docker sandbox with network isolation. 0 external calls.',
    clientIp: '10.14.20.45 (OT Automation LAN)'
  },
  {
    id: 'aud-006',
    auditId: 'SF-AUD-2026-02426',
    timestamp: '2026-09-25 11:20:00',
    user: 'Suresh Bhat (CISO)',
    role: 'CISO',
    action: 'MODEL_INTEGRITY_VERIFIED',
    resource: 'Qwen2.5-VL-7B-Instruct (Local Weights)',
    agent: 'SovereignForge Model Guard',
    result: 'SUCCESS',
    risk: 'Low',
    hashSignature: '0x3344556677889900',
    details: 'Validated SHA-256 weight hash against signed Enterprise cybersecurity root cert. Integrity 100% verified.',
    clientIp: '10.14.5.2 (SOC Secure Console)'
  }
];

// ============================================================================
// 14. NETWORK SOVEREIGNTY & AIR-GAP TELEMETRY
// ============================================================================
export const INITIAL_NETWORK_TELEMETRY: NetworkTelemetry = {
  airGapStatus: 'ACTIVE',
  outboundConnections: 0, // Strict invariant
  inboundConnections: 6,
  activeInterfaces: [
    {
      name: 'eth0 (Enterprise Process LAN)',
      ip: '10.14.32.1',
      subnet: '255.255.240.0',
      status: 'UP',
      packetsRx: 4528190,
      packetsTx: 4120300,
      externalGateway: 'DISABLED'
    },
    {
      name: 'eth1 (Air-Gapped GPU Cluster)',
      ip: '192.168.100.1',
      subnet: '255.255.255.0',
      status: 'UP',
      packetsRx: 18492040,
      packetsTx: 18490100,
      externalGateway: 'NONE'
    },
    {
      name: 'wan0 (Public Internet Uplink)',
      ip: '0.0.0.0',
      subnet: '0.0.0.0',
      status: 'BLOCKED',
      packetsRx: 0,
      packetsTx: 0,
      externalGateway: 'DISABLED'
    }
  ],
  internalServices: [
    { name: 'Local GPU Inference Cluster (vLLM / TensorRT)', endpoint: '192.168.100.10', port: 8000, status: 'HEALTHY', latencyMs: 2.1 },
    { name: 'Milvus Vector Database (Air-Gapped)', endpoint: '192.168.100.12', port: 19530, status: 'HEALTHY', latencyMs: 1.4 },
    { name: 'MinIO Local S3 Document Storage', endpoint: '192.168.100.14', port: 9000, status: 'HEALTHY', latencyMs: 0.8 },
    { name: 'PostgreSQL Forensic Audit Database', endpoint: '192.168.100.16', port: 5432, status: 'HEALTHY', latencyMs: 0.9 },
    { name: 'Enterprise Enterprise LDAP / Active Directory', endpoint: '10.14.1.20', port: 636, status: 'ACTIVE', latencyMs: 3.2 },
    { name: 'DCS / SCADA Process Historian Gateway', endpoint: '10.14.20.10', port: 502, status: 'HEALTHY', latencyMs: 4.5 }
  ],
  threatsBlockedCount: 14,
  hardwareKeyPresent: true,
  lastAirgapAudit: '2026-09-26 06:00:00 (Automated Daily Hash Audit)'
};

// ============================================================================
// 15. CISO SECURITY METRICS
// ============================================================================
export const INITIAL_SECURITY_METRICS: SecurityMetrics = {
  securityStatus: 'SECURE',
  externalConnections: 0,
  failedAuthAttempts24h: 2,
  policyViolations24h: 0,
  unauthorizedToolCalls24h: 0,
  modelIntegrityVerified: true,
  auditLedgerIntegrity: 'VERIFIED',
  activeAirgapGuardrails: 18
};
