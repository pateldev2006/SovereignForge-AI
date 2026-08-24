export type UserRole = 
  | 'Administrator' 
  | 'Engineer' 
  | 'Maintenance' 
  | 'Operations' 
  | 'Safety' 
  | 'Manager';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  activeSession: boolean;
  avatar?: string;
}

export type PageId = 
  | 'dashboard'
  | 'workbench'
  | 'documents'
  | 'image-analysis'
  | 'investigations'
  | 'sensor-data'
  | 'approvals'
  | 'reports'
  | 'users'
  | 'roles-departments'
  | 'models'
  | 'agents'
  | 'tools'
  | 'policies'
  | 'knowledge-base'
  | 'audit-logs'
  | 'security'
  | 'architecture'
  | 'prompt-injection';

export type ClassificationLevel = 'Public' | 'Internal' | 'Confidential' | 'Restricted';

export interface DocumentItem {
  id: string;
  title: string;
  fileName: string;
  classification: ClassificationLevel;
  department: string;
  authorizedRoles: UserRole[];
  uploadDate: string;
  fileSize: string;
  sha256: string;
  originalSha256: string;
  isTampered: boolean;
  content: string;
  metadata: {
    author: string;
    version: string;
    equipmentTarget?: string;
  };
}

export interface VerificationStatus {
  status: 'Verified' | 'Needs Review' | 'Insufficient Evidence';
  label: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  evidence?: {
    title: string;
    page: number;
    section: string;
    classification: ClassificationLevel;
  }[];
  confidence?: number; // e.g. 87%
  verificationStatus?: 'Verified' | 'Needs Review' | 'Insufficient Evidence';
  isDenied?: boolean;
}

export interface ImageAnalysisResult {
  id: string;
  imageName: string;
  imageUrl: string;
  detectedEquipment: string;
  observedConditions: string[];
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  confidence: number;
  timestamp: string;
}

export interface InvestigationItem {
  id: string;
  title: string;
  equipment: string;
  createdDate: string;
  status: 'In Progress' | 'Awaiting Approval' | 'Approved' | 'Rejected';
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  stepsCompleted: string[];
  aiRecommendation: string;
  evidence: string[];
  confidence: number;
  approvalId?: string;
}

export interface ApprovalItem {
  id: string;
  investigationId: string;
  title: string;
  recommendation: string;
  confidence: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  supportingEvidence: string[];
  requestingUser: string;
  requestingRole: UserRole;
  dateTime: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Under Review';
  reviewerNote?: string;
  reviewedBy?: string;
}

export interface PolicyState {
  externalApi: boolean; // false = BLOCKED
  internetAccess: boolean; // false = BLOCKED
  autonomousActions: boolean; // false = BLOCKED
  confidentialExport: boolean; // false = BLOCKED
  humanApprovalRequired: boolean; // true = REQUIRED
  toolAuthorization: boolean; // true = ENABLED
  auditLogging: boolean; // true = ENABLED
}

export interface ModelItem {
  id: string;
  name: string;
  type: string;
  version: string;
  status: 'Testing' | 'Approved' | 'Production';
  evalScore: number;
  approvedBy: string;
  deploymentStatus: 'Deploying' | 'Active' | 'Offline';
  updatedAt: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: string;
  resource: string;
  result: 'Success' | 'Denied' | 'Violation' | 'Blocked' | 'Pending';
  details?: string;
}

export interface SecurityAlert {
  id: string;
  severity: 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
  timestamp: string;
  resolved: boolean;
}
