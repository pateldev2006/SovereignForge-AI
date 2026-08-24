import { User, DocumentItem, ModelItem, ApprovalItem, AuditLogItem, SecurityAlert, InvestigationItem, PolicyState } from '../types';

export const DEMO_USERS: User[] = [
  {
    id: 'user-admin',
    name: 'Sarah Connor',
    email: 'admin@sovereignforge.local',
    role: 'Administrator',
    department: 'System Governance & Cyber Operations',
    activeSession: true,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-engineer',
    name: 'Alex Mercer',
    email: 'engineer@sovereignforge.local',
    role: 'Engineer',
    department: 'Plant Mechanical Maintenance',
    activeSession: true,
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-manager',
    name: 'Marcus Vance',
    email: 'manager@sovereignforge.local',
    role: 'Manager',
    department: 'Industrial Asset & Operations Management',
    activeSession: true,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_POLICIES: PolicyState = {
  externalApi: false,         // BLOCKED
  internetAccess: false,      // BLOCKED
  autonomousActions: false,   // BLOCKED
  confidentialExport: false,  // BLOCKED
  humanApprovalRequired: true,// REQUIRED
  toolAuthorization: true,   // ENABLED
  auditLogging: true,         // ENABLED
};

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-sop-p204',
    title: 'Maintenance Standard Operating Procedure — Pump P204',
    fileName: 'SOP_Pump_P204_v4.2.pdf',
    classification: 'Internal',
    department: 'Plant Maintenance',
    authorizedRoles: ['Administrator', 'Engineer', 'Maintenance', 'Operations', 'Manager'],
    uploadDate: '2026-08-10 09:15:00',
    fileSize: '4.2 MB',
    sha256: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
    originalSha256: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
    isTampered: false,
    content: `SECTION 4.2: PUMP P204 PREVENTIVE MAINTENANCE PROCEDURE
1. Isolate main power breaker CB-402 and apply Lockout/Tagout (LOTO) tags.
2. Relieve internal hydraulic pressure to 0 PSI via bleed valve V-12B.
3. Inspect mechanical seal assembly for coolant weepage or pitting.
4. Measure shaft alignment using dial indicators. Maximum permissible radial misalignment is 0.05 mm.
5. Replenish synthetic ISO VG 68 bearing lubricant up to the center of sight glass.
6. Torque coupling bolts to 145 Nm in a cross-star pattern.`,
    metadata: {
      author: 'Senior Mechanical Engineer J. Vance',
      version: '4.2',
      equipmentTarget: 'Industrial Centrifugal Pump P204'
    }
  },
  {
    id: 'doc-inspection-p204',
    title: 'Q3 Ultrasonic & Thermographic Inspection — Pump P204',
    fileName: 'INSP_P204_2026_Q3.pdf',
    classification: 'Internal',
    department: 'Plant Maintenance',
    authorizedRoles: ['Administrator', 'Engineer', 'Maintenance', 'Manager'],
    uploadDate: '2026-08-18 14:30:22',
    fileSize: '12.8 MB',
    sha256: '9f8e7d6c5b4a3210987654321fedcba0987654321fedcba0987654321fedcba0',
    originalSha256: '9f8e7d6c5b4a3210987654321fedcba0987654321fedcba0987654321fedcba0',
    isTampered: false,
    content: `EXECUTIVE SUMMARY: PUMP P204 DIAGNOSTIC REPORT
Page 6, Section 2.1: Vibration spectrum analysis indicates elevated peak amplitude at 1X RPM (48.5 Hz) along drive-end bearing housing.
Page 8: Thermographic scan reveals localized surface temperature of 82.4°C (Normal baseline: < 65°C).
Observed Condition: Minor surface corrosion observed on secondary suction flange. Slight coolant seepage detected at discharge valve gasket V-04.
Recommendation: Immediate seal inspection and bearing re-greasing recommended within 24–48 operating hours.`,
    metadata: {
      author: 'Reliability Specialist D. Hayes',
      version: '1.0',
      equipmentTarget: 'Industrial Centrifugal Pump P204'
    }
  },
  {
    id: 'doc-safety-manual',
    title: 'Industrial High-Pressure Containment Safety Protocols',
    fileName: 'SAFETY_MANUAL_2026_REV3.pdf',
    classification: 'Public',
    department: 'Safety',
    authorizedRoles: ['Administrator', 'Engineer', 'Maintenance', 'Operations', 'Safety', 'Manager'],
    uploadDate: '2026-01-15 08:00:00',
    fileSize: '8.1 MB',
    sha256: '11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff',
    originalSha256: '11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff',
    isTampered: false,
    content: `SECTION 3.1: HIGH-PRESSURE FLUID DISCHARGE REGULATION
Operate high-pressure pumps only under verified relief valve tolerances. Any operating unit exhibiting bearing housing temperatures above 80°C or vibration velocity exceeding 4.5 mm/s RMS must be placed on expedited maintenance review. Safety isolation requires dual valve shutoff and pressure verification before technicians touch drive couplings.`,
    metadata: {
      author: 'Chief Safety Officer M. Al-Mansoor',
      version: '3.0'
    }
  },
  {
    id: 'doc-reactor-confidential',
    title: 'Confidential Reactor Core Thermal Dynamics & Control Matrix',
    fileName: 'CONFIDENTIAL_REACTOR_CORE_DYNAMICS.pdf',
    classification: 'Confidential',
    department: 'Operations',
    authorizedRoles: ['Administrator', 'Manager'],
    uploadDate: '2026-07-02 11:20:00',
    fileSize: '18.4 MB',
    sha256: '44556677889900aabbccddeeff11223344556677889900aabbccddeeff112233',
    originalSha256: '44556677889900aabbccddeeff11223344556677889900aabbccddeeff112233',
    isTampered: false,
    content: `CONFIDENTIAL INTELLECTUAL PROPERTY:
Core thermal flux model parameters for heavy industrial cracking units. Operating pressure setpoints are strictly confidential and restricted to authorized Operations Executives and System Administrators. Secondary coolant pump flow thresholds must stay above 420 m³/h.`,
    metadata: {
      author: 'VP of Thermal Engineering R. Sterling',
      version: '2.1'
    }
  },
  {
    id: 'doc-cyber-restricted',
    title: 'Restricted Industrial Control Systems Cyber Vulnerability Audit',
    fileName: 'RESTRICTED_ICS_CYBER_AUDIT_2026.pdf',
    classification: 'Restricted',
    department: 'System Governance & Cyber Operations',
    authorizedRoles: ['Administrator'],
    uploadDate: '2026-08-01 16:45:00',
    fileSize: '5.6 MB',
    sha256: '77889900aabbccddeeff11223344556677889900aabbccddeeff112233445566',
    originalSha256: '77889900aabbccddeeff11223344556677889900aabbccddeeff112233445566',
    isTampered: false,
    content: `RESTRICTED SECURITY DOCUMENT:
Assessment of air-gapped PLC networks, firmware checksums, and key management modules across sovereign computing nodes. Unauthorized access to this document triggers immediate automated security escalation.`,
    metadata: {
      author: 'Lead Cyber Operations Auditor',
      version: '1.0'
    }
  }
];

export const INITIAL_MODELS: ModelItem[] = [
  {
    id: 'mod-llm-21',
    name: 'Sovereign Industrial LLM',
    type: 'Language Model',
    version: '2.1',
    status: 'Production',
    evalScore: 94.2,
    approvedBy: 'Sarah Connor (Admin)',
    deploymentStatus: 'Active',
    updatedAt: '2026-08-15 10:00:00'
  },
  {
    id: 'mod-vision-14',
    name: 'Industrial Equipment Vision Transformer',
    type: 'Vision Model',
    version: '1.4',
    status: 'Production',
    evalScore: 91.8,
    approvedBy: 'Sarah Connor (Admin)',
    deploymentStatus: 'Active',
    updatedAt: '2026-08-10 14:20:00'
  },
  {
    id: 'mod-embed-30',
    name: 'Industrial Dense Vector Embedder',
    type: 'Embedding Model',
    version: '3.0',
    status: 'Production',
    evalScore: 96.5,
    approvedBy: 'Sarah Connor (Admin)',
    deploymentStatus: 'Active',
    updatedAt: '2026-07-28 09:30:00'
  },
  {
    id: 'mod-llm-30-beta',
    name: 'Sovereign Industrial LLM - High Precision',
    type: 'Language Model',
    version: '3.0-Beta',
    status: 'Testing',
    evalScore: 97.4,
    approvedBy: 'Pending Evaluation',
    deploymentStatus: 'Offline',
    updatedAt: '2026-08-22 16:00:00'
  }
];

export const INITIAL_APPROVALS: ApprovalItem[] = [
  {
    id: 'appr-101',
    investigationId: 'inv-204-01',
    title: 'Emergency Maintenance Schedule: Pump P204 Bearing Replacement',
    recommendation: 'Schedule a maintenance inspection and mechanical seal alignment for Pump P204 within 24 operating hours.',
    confidence: 87,
    riskLevel: 'High',
    supportingEvidence: [
      'Maintenance SOP — Page 17, Section 4.2',
      'Pump P204 Inspection Report — Page 6 & 8 (Temp 82.4°C)',
      'Safety Manual — Section 3.1'
    ],
    requestingUser: 'Alex Mercer',
    requestingRole: 'Engineer',
    dateTime: '2026-08-23 18:10:45',
    status: 'Pending'
  },
  {
    id: 'appr-100',
    investigationId: 'inv-108-03',
    title: 'Thermal Exchange Valve V-12 Calibration Request',
    recommendation: 'Recalibrate digital pressure transducer PT-109 and replace secondary diaphragm during shift change.',
    confidence: 94,
    riskLevel: 'Medium',
    supportingEvidence: [
      'Valve V-12 Calibration Standard — Rev 2.1',
      'Telemetry Sensor Log #8841'
    ],
    requestingUser: 'Dave Miller',
    requestingRole: 'Maintenance',
    dateTime: '2026-08-23 14:05:12',
    status: 'Approved',
    reviewerNote: 'Approved. Maintenance slot reserved for 22:00 window.',
    reviewedBy: 'Marcus Vance (Manager)'
  }
];

export const INITIAL_INVESTIGATIONS: InvestigationItem[] = [
  {
    id: 'inv-204-01',
    title: 'Pump P204 Abnormal Condition & Vibration Anomaly',
    equipment: 'Industrial Centrifugal Pump P204',
    createdDate: '2026-08-23 18:05:00',
    status: 'Awaiting Approval',
    riskLevel: 'High',
    stepsCompleted: [
      'Investigation Created',
      'Documents Retrieved (SOP v4.2, Inspection Q3)',
      'Permission Check Completed (RBAC Passed)',
      'Inspection History Analyzed',
      'Image Analysis Performed (Surface corrosion & weepage detected)',
      'AI Recommendation Generated',
      'Verification Required',
      'Awaiting Human Approval'
    ],
    aiRecommendation: 'Schedule a maintenance inspection and mechanical seal alignment for Pump P204 within 24 operating hours.',
    evidence: [
      'Maintenance SOP — Page 17, Section 4.2',
      'Pump P204 Inspection Report — Page 6 & 8',
      'High-Pressure Safety Manual — Section 3.1'
    ],
    confidence: 87,
    approvalId: 'appr-101'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'audit-001',
    timestamp: '2026-08-23 18:42:31',
    user: 'Alex Mercer (Engineer)',
    role: 'Engineer',
    action: 'Analyze Pump P204 Diagnostics',
    resource: 'Pump P204 Inspection Report & SOP',
    result: 'Success',
    details: 'AI query executed. Evidence retrieved: SOP v4.2, Inspection Report Q3. Recommendation generated.'
  },
  {
    id: 'audit-002',
    timestamp: '2026-08-23 18:30:14',
    user: 'Alex Mercer (Engineer)',
    role: 'Engineer',
    action: 'Attempt Document Access',
    resource: 'Restricted ICS Cyber Audit 2026',
    result: 'Denied',
    details: 'ACCESS DENIED. Document classification: Restricted. User role Engineer lacks authorized clearance.'
  },
  {
    id: 'audit-003',
    timestamp: '2026-08-23 17:15:00',
    user: 'Sarah Connor (Admin)',
    role: 'Administrator',
    action: 'Update System Policy',
    resource: 'Agent Policy Engine',
    result: 'Success',
    details: 'Policy verified: External API Calls BLOCKED, Human Approval REQUIRED, Audit Logging ENABLED.'
  },
  {
    id: 'audit-004',
    timestamp: '2026-08-23 16:50:22',
    user: 'Alex Mercer (Engineer)',
    role: 'Engineer',
    action: 'Image Analysis Execution',
    resource: 'pump_p204_suction_flange.png',
    result: 'Success',
    details: 'Vision Model v1.4 detected minor surface corrosion and valve leakage with 82% confidence.'
  },
  {
    id: 'audit-005',
    timestamp: '2026-08-23 14:05:12',
    user: 'Marcus Vance (Manager)',
    role: 'Manager',
    action: 'Approve Recommendation',
    resource: 'Approval #appr-100 (Thermal Exchange Valve V-12)',
    result: 'Success',
    details: 'Recommendation approved by Marcus Vance. Work order generated.'
  }
];

export const INITIAL_SECURITY_ALERTS: SecurityAlert[] = [
  {
    id: 'sec-alert-1',
    severity: 'High',
    title: 'Unauthorized Restricted Access Attempt',
    description: 'User Engineer_07 attempted to retrieve Restricted Security Document "ICS Cyber Audit 2026". Blocked by RBAC engine.',
    timestamp: '2026-08-23 18:30:14',
    resolved: false
  },
  {
    id: 'sec-alert-2',
    severity: 'Medium',
    title: 'Potential Prompt Injection Neutralized',
    description: 'Embedded system instructions detected in uploaded report "Vendor_Note_Draft.txt". Sanitized by Sovereign Security Layer.',
    timestamp: '2026-08-23 15:10:02',
    resolved: true
  },
  {
    id: 'sec-alert-3',
    severity: 'Low',
    title: 'Repeated Invalid Login Attempt',
    description: '3 failed authentication attempts from IP 192.168.10.45. User account locked temporarily.',
    timestamp: '2026-08-23 09:44:11',
    resolved: true
  }
];
