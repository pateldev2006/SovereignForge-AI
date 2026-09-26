// ============================================================================
// SOVEREIGNFORGE AI - CORE DOMAIN TYPES & RBAC ARCHITECTURE
// Enterprise Air-Gapped Industrial AI Workbench Industrial Prototype
// ============================================================================

export type UserRole =
  | 'PlantEngineer'   // Plant / Process Engineer (Rajesh Kumar)
  | 'ITEngineer'      // IT / Automation Engineer (Arun Nayak)
  | 'QAOfficer'       // Design / QA Officer (Pooja Hegde)
  | 'Approver'        // Approving Authority (Dr. Vikram Shetty)
  | 'CISO';           // CISO / Security Administrator (Suresh Bhat)

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  department: string;
  employeeId: string;
  clearanceLevel: 'L1 - Process Operations' | 'L2 - Engineering & SCADA' | 'L3 - Quality & Compliance' | 'L4 - Executive Approval' | 'L5 - CISO Security Clearance';
  activeSession: boolean;
  avatar?: string;
  location: string;
}

export type PageId =
  // User Workbench
  | 'workbench'           // Hero Industrial AI Task Composer & Execution Engine
  | 'tasks'               // My Active Industrial Tasks
  | 'documents'           // Air-Gapped Document Repository & Ingestion
  | 'knowledge'           // SOP & Engineering Standards Knowledge Base
  | 'approvals'           // Approval Queue & Sign-Off (Approving Authority / QA)
  | 'reviews'             // P&ID & SOP Compliance Review (QA Officer)
  | 'code-sandbox'        // IT / Automation Code Agent & Offline Verification
  | 'audit-history'       // Role-Specific Audit Ledger
  // Admin Control Center
  | 'admin-overview'      // Security & System Health Overview
  | 'admin-roles'         // Role & Permission Management Matrix
  | 'admin-firewall'      // AI Capability Firewall (Agent-Level Guardrails)
  | 'admin-models'        // Local Air-Gapped Model Registry & Verification
  | 'admin-policies'      // Industrial Security & Compliance Policies
  | 'admin-security'      // CISO Security Operations & Forensic Analysis
  | 'admin-network'       // Network Sovereignty & Air-Gap Telemetry
  | 'admin-audit';        // Global Tamper-Evident Audit Ledger

export type ClassificationLevel = 'Public' | 'Internal' | 'Confidential' | 'Restricted' | 'CISO-Only';

export interface DocumentItem {
  id: string;
  title: string;
  fileName: string;
  fileType: 'pdf' | 'png' | 'jpg' | 'xlsx' | 'docx';
  fileSize: string;
  classification: ClassificationLevel;
  department: string;
  uploadedBy: string;
  uploadDate: string;
  ocrCompleted: boolean;
  visionCompleted: boolean;
  sha256: string;
  originalSha256: string;
  isTampered: boolean;
  description: string;
  equipmentTarget?: string;
  // Field-level security demonstration fields:
  securityClassification?: string; // Only CISO
  internalRiskScore?: number;      // Only CISO
  tamperChecksum?: string;         // Only CISO / IT
  contentSnippet?: string;
}

export interface SOPItem {
  id: string;
  sopCode: string;
  title: string;
  category: 'Mechanical' | 'Safety' | 'Electrical' | 'Operations' | 'Environmental';
  version: string;
  effectiveDate: string;
  pageCount: number;
  sections: {
    sectionId: string;
    sectionNumber: string;
    heading: string;
    page: number;
    text: string;
    mandatoryRule: string;
  }[];
  classification: ClassificationLevel;
}

export interface SourceCitation {
  id: string;
  citationIndex: number;
  documentTitle: string;
  documentCode: string;
  pageNumber: number;
  sectionTitle: string;
  exactExcerpt: string;
  relevanceScore: number; // e.g., 96%
  classification: ClassificationLevel;
  type: 'SOP' | 'InspectionReport' | 'EngineeringStandard' | 'PID';
}

export interface SOPDeviation {
  id: string;
  equipment: string;
  parameterName: string;
  observedValue: string;
  requiredValue: string;
  variance: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  observedSourceDoc: string;
  observedPage: number;
  requiredStandardDoc: string;
  requiredPage: number;
  riskDescription: string;
  mandatoryAction: string;
  status: 'Detected' | 'Under Review' | 'Accepted with Mitigation' | 'Rejected';
}

export interface AgentStepTrace {
  id: string;
  stepNumber: number;
  name: string;
  model: string;
  status: 'pending' | 'running' | 'completed' | 'warning' | 'error';
  durationMs: number;
  details: string;
  tokensProcessed?: number;
  outputSummary?: string;
}

export interface TaskDeliverable {
  id: string;
  referenceNumber: string;
  title: string;
  equipmentId: string;
  equipmentName: string;
  unit: string;
  generatedDate: string;
  generatedByModel: string;
  executiveSummary: string;
  findings: {
    point: string;
    citationId: number;
    status: 'Normal' | 'Observation' | 'Non-Conformance';
  }[];
  sopComparison: {
    criterion: string;
    observed: string;
    standard: string;
    compliance: 'COMPLIANT' | 'DEVIATION';
    citationId: number;
  }[];
  deviation: SOPDeviation;
  recommendation: string;
  riskAssessment: 'Low Risk' | 'Moderate Risk' | 'High Operational Risk' | 'Critical Failure Risk';
  verificationHash: string;
  status: 'Draft Ready' | 'Awaiting Human Review' | 'Approved' | 'Rejected' | 'Changes Requested';
  approvedBy?: string;
  approvalTimestamp?: string;
  digitalSignature?: string;
  reviewerNotes?: string;
}

export interface IndustrialTask {
  id: string;
  taskNumber: string;
  title: string;
  description: string;
  requestedBy: string;
  requestedByRole: UserRole;
  createdAt: string;
  status: 'Pending' | 'Processing' | 'Completed' | 'Awaiting Approval' | 'Approved' | 'Rejected';
  modelRoute: {
    taskType: string;
    selectedModel: string;
    routingReason: string;
    confidence: number;
  };
  attachedFiles: string[];
  agentSteps: AgentStepTrace[];
  retrievedSources: SourceCitation[];
  deviations: SOPDeviation[];
  deliverable?: TaskDeliverable;
  totalDurationSec: number;
}

export interface ApprovalQueueItem {
  id: string;
  taskId: string;
  taskNumber: string;
  title: string;
  documentType: string;
  equipment: string;
  requester: string;
  requesterRole: string;
  department: string;
  submittedAt: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Awaiting Review' | 'Approved' | 'Rejected' | 'Needs Changes';
  deviationDetected: boolean;
  deviationSummary?: string;
  deliverable: TaskDeliverable;
}

export interface AuditEvent {
  id: string;
  auditId: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: string;
  resource: string;
  agent: string;
  result: 'SUCCESS' | 'DENIED' | 'FLAGGED' | 'BLOCKED' | 'PENDING';
  risk: 'Low' | 'Medium' | 'High' | 'Critical';
  hashSignature: string;
  details: string;
  clientIp: string;
  forensicTrace?: {
    modelUsed?: string;
    tokensIn?: number;
    tokensOut?: number;
    latencyMs?: number;
    guardrailViolations?: number;
  };
}

export interface ModelItem {
  id: string;
  name: string;
  category: 'Vision-Language' | 'Code & Automation' | 'Reasoning & Logic' | 'Dense Embeddings' | 'Cross-Encoder Reranker' | 'Document OCR';
  parameters: string;
  quantization: string;
  status: 'READY' | 'ACTIVE' | 'DEGRADED' | 'OFFLINE';
  version: string;
  integrityVerified: boolean;
  sha256Hash: string;
  vramUsageGb: number;
  vramTotalGb: number;
  inferenceLatencyMs: number;
  tpsSpeed: number;
  lastHealthCheck: string;
  description: string;
  localPath: string;
}

export interface AICapabilityFirewallRule {
  id: string;
  agentName: string;
  agentRole: string;
  readDocs: boolean;
  writeFiles: boolean;
  runCode: boolean;
  internetAccess: boolean; // Permanently false in sovereign air-gap
  exportData: boolean;
  maxExecutionSec: number;
  memoryLimitMb: number;
  allowedToolIds: string[];
}

export interface RolePermissionMatrixItem {
  module: string;
  moduleKey: string;
  category: 'Workbench' | 'Governance' | 'Administration';
  permissions: {
    [key in UserRole]: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
      approve: boolean;
      export: boolean;
      admin: boolean;
    };
  };
}

export interface NetworkTelemetry {
  airGapStatus: 'ACTIVE' | 'ISOLATED' | 'DEGRADED';
  outboundConnections: 0; // Invariant: always 0 in sovereignforge
  inboundConnections: number; // e.g. 6 internal LAN services
  activeInterfaces: {
    name: string;
    ip: string;
    subnet: string;
    status: 'UP' | 'BLOCKED';
    packetsRx: number;
    packetsTx: number;
    externalGateway: 'DISABLED' | 'NONE';
  }[];
  internalServices: {
    name: string;
    endpoint: string;
    port: number;
    status: 'HEALTHY' | 'ACTIVE';
    latencyMs: number;
  }[];
  threatsBlockedCount: number;
  hardwareKeyPresent: boolean;
  lastAirgapAudit: string;
}

export interface SecurityMetrics {
  securityStatus: 'SECURE' | 'DEGRADED' | 'COMPROMISED';
  externalConnections: 0;
  failedAuthAttempts24h: number;
  policyViolations24h: number;
  unauthorizedToolCalls24h: number;
  modelIntegrityVerified: boolean;
  auditLedgerIntegrity: 'HEALTHY' | 'VERIFIED' | 'TAMPERED';
  activeAirgapGuardrails: number;
}
