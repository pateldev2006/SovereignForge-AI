import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, UserRole, PageId, DocumentItem, PolicyState, ModelItem, 
  ApprovalItem, InvestigationItem, AuditLogItem, SecurityAlert, ChatMessage, ClassificationLevel
} from '../types';
import { 
  DEMO_USERS, INITIAL_POLICIES, INITIAL_DOCUMENTS, 
  INITIAL_MODELS, INITIAL_APPROVALS, INITIAL_INVESTIGATIONS, 
  INITIAL_AUDIT_LOGS, INITIAL_SECURITY_ALERTS 
} from '../data/mockData';

interface AppContextType {
  currentUser: User | null;
  activePage: PageId;
  sovereignMode: boolean;
  isInternetSimulatedOffline: boolean;
  policies: PolicyState;
  documents: DocumentItem[];
  models: ModelItem[];
  approvals: ApprovalItem[];
  investigations: InvestigationItem[];
  auditLogs: AuditLogItem[];
  securityAlerts: SecurityAlert[];
  chatMessages: ChatMessage[];
  
  // Actions
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  switchUserRole: (role: UserRole) => void;
  navigateTo: (page: PageId) => void;
  hasPermission: (role: UserRole, page: PageId) => boolean;
  canAccessDocument: (role: UserRole, classification: ClassificationLevel, authorizedRoles: UserRole[]) => boolean;
  
  togglePolicy: (policyKey: keyof PolicyState) => void;
  toggleInternetDisconnection: () => void;
  
  uploadDocument: (doc: Omit<DocumentItem, 'id' | 'uploadDate' | 'sha256' | 'originalSha256' | 'isTampered'>) => void;
  tamperDocument: (docId: string) => void;
  
  sendChatMessage: (query: string) => void;
  
  createInvestigationFromImage: (detectedEquipment: string, condition: string, riskLevel: 'Low' | 'Medium' | 'High' | 'Critical', confidence: number) => void;
  
  handleApprovalAction: (approvalId: string, action: 'Approved' | 'Rejected' | 'Under Review', note?: string) => void;
  
  updateModelLifecycle: (modelId: string, targetStatus: 'Testing' | 'Approved' | 'Production') => void;
  
  addAuditLog: (action: string, resource: string, result: 'Success' | 'Denied' | 'Violation' | 'Blocked' | 'Pending', details?: string) => void;
  
  runPromptInjectionTest: (docContent: string) => { threatDetected: boolean; safeText: string };
  
  // Toast notification state
  toastMessage: { title: string; desc: string; type: 'success' | 'error' | 'warning' | 'info' } | null;
  setToastMessage: (msg: { title: string; desc: string; type: 'success' | 'error' | 'warning' | 'info' } | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with localStorage or mock defaults
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sf_user');
    return saved ? JSON.parse(saved) : DEMO_USERS[0]; // Default to Admin for immediate demo experience
  });

  const [activePage, setActivePage] = useState<PageId>(() => {
    return (localStorage.getItem('sf_page') as PageId) || 'dashboard';
  });

  const [isInternetSimulatedOffline, setIsInternetSimulatedOffline] = useState<boolean>(() => {
    return localStorage.getItem('sf_offline') === 'true';
  });

  const [policies, setPolicies] = useState<PolicyState>(() => {
    const saved = localStorage.getItem('sf_policies');
    return saved ? JSON.parse(saved) : INITIAL_POLICIES;
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    const saved = localStorage.getItem('sf_documents');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [models, setModels] = useState<ModelItem[]>(() => {
    const saved = localStorage.getItem('sf_models');
    return saved ? JSON.parse(saved) : INITIAL_MODELS;
  });

  const [approvals, setApprovals] = useState<ApprovalItem[]>(() => {
    const saved = localStorage.getItem('sf_approvals');
    return saved ? JSON.parse(saved) : INITIAL_APPROVALS;
  });

  const [investigations, setInvestigations] = useState<InvestigationItem[]>(() => {
    const saved = localStorage.getItem('sf_investigations');
    return saved ? JSON.parse(saved) : INITIAL_INVESTIGATIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    const saved = localStorage.getItem('sf_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>(() => {
    const saved = localStorage.getItem('sf_alerts');
    return saved ? JSON.parse(saved) : INITIAL_SECURITY_ALERTS;
  });

  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: 'Greetings. I am SovereignForge AI Engine v2.1. All processing is executing locally inside your air-gapped security perimeter. How can I assist with your industrial equipment, documents, or safety procedures today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      verificationStatus: 'Verified'
    }
  ]);

  // Sync to localStorage
  useEffect(() => {
    if (currentUser) localStorage.setItem('sf_user', JSON.stringify(currentUser));
    else localStorage.removeItem('sf_user');
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('sf_page', activePage);
  }, [activePage]);

  useEffect(() => {
    localStorage.setItem('sf_policies', JSON.stringify(policies));
  }, [policies]);

  useEffect(() => {
    localStorage.setItem('sf_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('sf_approvals', JSON.stringify(approvals));
  }, [approvals]);

  useEffect(() => {
    localStorage.setItem('sf_investigations', JSON.stringify(investigations));
  }, [investigations]);

  useEffect(() => {
    localStorage.setItem('sf_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('sf_models', JSON.stringify(models));
  }, [models]);

  useEffect(() => {
    localStorage.setItem('sf_offline', String(isInternetSimulatedOffline));
  }, [isInternetSimulatedOffline]);

  // Helper for adding Audit Logs
  const addAuditLog = (action: string, resource: string, result: 'Success' | 'Denied' | 'Violation' | 'Blocked' | 'Pending', details?: string) => {
    const now = new Date();
    const timestamp = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString()}`;
    const newLog: AuditLogItem = {
      id: `audit-${Date.now()}`,
      timestamp,
      user: currentUser ? `${currentUser.name} (${currentUser.role})` : 'Anonymous / System',
      role: currentUser?.role || 'Engineer',
      action,
      resource,
      result,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // RBAC Permission Evaluator
  const hasPermission = (role: UserRole, page: PageId): boolean => {
    if (role === 'Administrator') return true;

    if (role === 'Manager') {
      const allowed: PageId[] = [
        'workbench', 'documents', 'approvals', 'reports', 
        'investigations', 'sensor-data', 'architecture', 'prompt-injection'
      ];
      return allowed.includes(page);
    }

    if (role === 'Engineer' || role === 'Maintenance' || role === 'Operations' || role === 'Safety') {
      const allowed: PageId[] = [
        'workbench', 'documents', 'image-analysis', 'investigations', 
        'reports', 'sensor-data', 'architecture', 'prompt-injection'
      ];
      return allowed.includes(page);
    }

    return false;
  };

  // Document Access Evaluator
  const canAccessDocument = (role: UserRole, classification: ClassificationLevel, authorizedRoles: UserRole[]): boolean => {
    if (role === 'Administrator') return true;
    if (classification === 'Public') return true;
    if (classification === 'Restricted' && (role as string) !== 'Administrator') return false;
    if (classification === 'Confidential' && ((role as string) !== 'Manager' && (role as string) !== 'Administrator')) return false;
    return authorizedRoles.includes(role);
  };

  // Authentication
  const login = (email: string, pass: string): boolean => {
    const found = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      // Check password matching mock rules
      const expectedPass = found.email.split('@')[0] + '123';
      if (pass === expectedPass || pass === 'admin123' || pass === 'engineer123' || pass === 'manager123') {
        setCurrentUser(found);
        // Redirect based on role
        if (found.role === 'Administrator') setActivePage('dashboard');
        else if (found.role === 'Manager') setActivePage('approvals');
        else setActivePage('workbench');

        addAuditLog('User Authentication Login', `Session initiated for ${found.email}`, 'Success');
        setToastMessage({
          title: `Welcome back, ${found.name}`,
          desc: `Authenticated as ${found.role} — ${found.department}`,
          type: 'success'
        });
        return true;
      }
    }
    addAuditLog('User Authentication Login', `Failed attempt for ${email}`, 'Denied');
    setToastMessage({
      title: 'Authentication Failed',
      desc: 'Invalid credentials. Please select one of the quick demo accounts.',
      type: 'error'
    });
    return false;
  };

  const logout = () => {
    if (currentUser) {
      addAuditLog('User Logout', `Session ended for ${currentUser.email}`, 'Success');
    }
    setCurrentUser(null);
    setActivePage('workbench');
    setToastMessage({
      title: 'Session Terminated',
      desc: 'You have logged out safely from SovereignForge AI.',
      type: 'info'
    });
  };

  const switchUserRole = (role: UserRole) => {
    const target = DEMO_USERS.find(u => u.role === role) || DEMO_USERS[0];
    setCurrentUser({ ...target, role });
    addAuditLog('Role Switch', `Switched active context to ${role}`, 'Success');
    setToastMessage({
      title: `Role Switched to ${role}`,
      desc: `Permissions updated for ${target.name}`,
      type: 'info'
    });
  };

  const navigateTo = (page: PageId) => {
    if (currentUser && !hasPermission(currentUser.role, page)) {
      addAuditLog('Unauthorized Page Access Attempt', `Page: ${page}`, 'Denied');
    }
    setActivePage(page);
  };

  // Policies
  const togglePolicy = (key: keyof PolicyState) => {
    if (currentUser?.role !== 'Administrator') {
      addAuditLog('Policy Toggle Attempt', `Policy: ${String(key)}`, 'Denied');
      setToastMessage({
        title: 'Permission Denied',
        desc: 'Only Administrators can modify System Security Policies.',
        type: 'error'
      });
      return;
    }
    setPolicies(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      addAuditLog('Policy Modified', `Policy '${String(key)}' set to ${updated[key]}`, 'Success');
      return updated;
    });
    setToastMessage({
      title: 'Security Policy Updated',
      desc: `System rule '${String(key)}' has been toggled.`,
      type: 'success'
    });
  };

  const toggleInternetDisconnection = () => {
    setIsInternetSimulatedOffline(prev => {
      const next = !prev;
      addAuditLog('Sovereign Network Toggle', next ? 'Simulated Air-Gap Offline Mode Enabled' : 'Sovereign Online Link Restored', 'Success');
      setToastMessage({
        title: next ? 'OFFLINE MODE ACTIVE' : 'SOVEREIGN MODE ACTIVE',
        desc: next 
          ? 'Core SovereignForge workflows remain available without internet connectivity.'
          : 'Local Sovereign AI network connected to air-gapped node.',
        type: next ? 'warning' : 'success'
      });
      return next;
    });
  };

  // Upload Document
  const uploadDocument = (docData: Omit<DocumentItem, 'id' | 'uploadDate' | 'sha256' | 'originalSha256' | 'isTampered'>) => {
    const mockHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newDoc: DocumentItem = {
      ...docData,
      id: `doc-${Date.now()}`,
      uploadDate: new Date().toISOString().replace('T', ' ').slice(0, 19),
      sha256: mockHash,
      originalSha256: mockHash,
      isTampered: false,
    };

    setDocuments(prev => [newDoc, ...prev]);
    addAuditLog('Document Upload', `Uploaded "${newDoc.title}" (${newDoc.classification})`, 'Success');
    setToastMessage({
      title: 'Document Ingested Successfully',
      desc: `SHA-256 fingerprint generated & verified: ${mockHash.slice(0, 16)}...`,
      type: 'success'
    });
  };

  // Document Tampering Simulation
  const tamperDocument = (docId: string) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === docId) {
        const alteredHash = doc.sha256.split('').reverse().join('');
        const tamperedDoc: DocumentItem = {
          ...doc,
          content: doc.content + '\n\n[TAMPERED BY MALICIOUS PROCESS: ALTERED PRESSURE LIMITS TO 999 PSI]',
          sha256: alteredHash,
          isTampered: true
        };

        // Add Security Alert
        const newAlert: SecurityAlert = {
          id: `alert-${Date.now()}`,
          severity: 'High',
          title: `INTEGRITY VIOLATION DETECTED: ${doc.title}`,
          description: `Document fingerprint mismatch detected on ${doc.fileName}. Original: ${doc.originalSha256.slice(0, 12)}... Current: ${alteredHash.slice(0, 12)}...`,
          timestamp: new Date().toLocaleTimeString(),
          resolved: false
        };
        setSecurityAlerts(al => [newAlert, ...al]);

        addAuditLog('INTEGRITY VIOLATION DETECTED', `Document ID ${doc.id} tampered`, 'Violation', `SHA-256 fingerprint mismatch. Content checksum mismatch detected.`);

        setToastMessage({
          title: 'INTEGRITY VIOLATION DETECTED',
          desc: 'The current document fingerprint does not match the original trusted version.',
          type: 'error'
        });

        return tamperedDoc;
      }
      return doc;
    }));
  };

  // AI Workbench Chat Interaction
  const sendChatMessage = (query: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);

    // Check policies first
    if (!policies.toolAuthorization) {
      addAuditLog('AI Query Blocked', query, 'Blocked', 'Tool authorization is disabled in policy.');
      const blockedMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: 'POLICY BLOCKED: Tool authorization is disabled by SovereignForge security policy.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        verificationStatus: 'Insufficient Evidence',
        isDenied: true
      };
      setChatMessages(prev => [...prev, blockedMsg]);
      return;
    }

    // Process query based on RBAC & content keywords
    const lower = query.toLowerCase();

    // Check if searching restricted document without permission
    if (lower.includes('cyber') || lower.includes('restricted') || lower.includes('vulnerability')) {
      if (currentUser?.role !== 'Administrator') {
        addAuditLog('Permission Denied AI Query', `Queried restricted resource: ${query}`, 'Denied');
        const deniedMsg: ChatMessage = {
          id: `msg-ai-${Date.now()}`,
          sender: 'ai',
          text: 'I do not have sufficient authorized evidence to provide a reliable answer. Access to Restricted Security Audit files requires Administrator clearance.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          verificationStatus: 'Insufficient Evidence',
          isDenied: true
        };
        setChatMessages(prev => [...prev, deniedMsg]);
        return;
      }
    }

    // Realistic response generator
    let aiResponseText = '';
    let evidence: ChatMessage['evidence'] = [];
    let confidence = 87;
    let verificationStatus: ChatMessage['verificationStatus'] = 'Verified';

    if (lower.includes('pump p204') || lower.includes('p204') || lower.includes('procedure') || lower.includes('maintenance')) {
      aiResponseText = `Based on the latest authorized maintenance SOP and inspection records for Pump P204:

1. Preventive Maintenance Procedure (SOP v4.2 Section 4.2):
   - Isolate main breaker CB-402 and enforce Lockout/Tagout (LOTO).
   - Relieve internal hydraulic pressure to 0 PSI via bleed valve V-12B.
   - Inspect mechanical seal assembly for coolant weepage or pitting.
   - Radial misalignment must not exceed 0.05 mm.
   - Torque coupling bolts to 145 Nm in cross-star pattern.

2. Current Health Status (Q3 Inspection Report):
   - Elevated vibration spectrum at 1X RPM drive-end housing.
   - Thermographic temperature measured at 82.4°C (Normal baseline < 65°C).
   - Action Item: Seal alignment and bearing re-greasing recommended within 24 hours.`;

      evidence = [
        { title: 'Maintenance SOP — Pump P204', page: 17, section: 'Section 4.2', classification: 'Internal' },
        { title: 'Q3 Inspection Report — Pump P204', page: 6, section: 'Section 2.1', classification: 'Internal' },
        { title: 'Industrial Safety Manual', page: 9, section: 'Section 3.1', classification: 'Public' }
      ];
      confidence = 87;
      verificationStatus = 'Verified';
    } else if (lower.includes('summarize') || lower.includes('inspection') || lower.includes('report')) {
      aiResponseText = `Summary of Latest Inspection Report (Q3 2026):
- Target Equipment: Industrial Centrifugal Pump P204
- Key Findings:
  • Drive-end bearing temperature elevated to 82.4°C.
  • Minor surface corrosion detected on secondary suction flange.
  • Slight coolant weepage observed near discharge valve gasket V-04.
- Recommended Action: Schedule mechanical seal overhaul and bearing lube refresh within 24-48 hours.`;
      evidence = [
        { title: 'Pump P204 Inspection Report', page: 6, section: 'Executive Summary', classification: 'Internal' }
      ];
      confidence = 92;
      verificationStatus = 'Verified';
    } else if (lower.includes('safe') || lower.includes('operate') || lower.includes('condition')) {
      aiResponseText = `Safety Assessment for Pump P204:
NEEDS REVIEW. The pump is operating at elevated bearing housing temperatures (82.4°C) exceeding standard 65°C baseline limits under Section 3.1 of the High-Pressure Safety Protocol. While emergency shutoff is not immediately mandatory, continued operation without maintenance within 24 hours poses a 38% risk of mechanical seal degradation.`;
      evidence = [
        { title: 'High-Pressure Safety Protocols', page: 12, section: 'Section 3.1', classification: 'Public' },
        { title: 'Q3 Inspection Report — Pump P204', page: 8, section: 'Thermal Scan', classification: 'Internal' }
      ];
      confidence = 81;
      verificationStatus = 'Needs Review';
    } else if (lower.includes('previous') || lower.includes('issues') || lower.includes('history')) {
      aiResponseText = `Historical Issue Log — Pump P204:
- 2026-05-14: Minor vibration spike resolved by coupling realignment.
- 2025-11-02: Mechanical seal gasket replaced during annual turnaround.
- 2025-04-19: Synthetic lubricant flush completed.`;
      evidence = [
        { title: 'Equipment History Log — P204', page: 3, section: 'History Matrix', classification: 'Internal' }
      ];
      confidence = 95;
      verificationStatus = 'Verified';
    } else {
      // Generic query fallback
      aiResponseText = `Sovereign AI Engine processed your query across ${documents.length} local authorized documents.
Synthesized insight: All operational setpoints are adhering to local air-gapped safety parameters. No external public API calls were executed.`;
      evidence = [
        { title: 'Plant Operations Governance', page: 1, section: 'General Rules', classification: 'Public' }
      ];
      confidence = 85;
      verificationStatus = 'Verified';
    }

    addAuditLog('AI Workbench Query Executed', `Query: "${query}"`, 'Success', `Retrieved ${evidence.length} evidence sources. Confidence: ${confidence}%.`);

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        evidence,
        confidence,
        verificationStatus
      };
      setChatMessages(prev => [...prev, aiMsg]);
    }, 600);
  };

  // Image Analysis -> Investigation Workflow
  const createInvestigationFromImage = (
    detectedEquipment: string, 
    condition: string, 
    riskLevel: 'Low' | 'Medium' | 'High' | 'Critical', 
    confidence: number
  ) => {
    const invId = `inv-${Date.now()}`;
    const apprId = `appr-${Date.now()}`;

    const newApproval: ApprovalItem = {
      id: apprId,
      investigationId: invId,
      title: `Emergency Repair Work Order: ${detectedEquipment}`,
      recommendation: `Schedule maintenance inspection and overhaul for ${detectedEquipment} within 24 hours based on visual evidence of ${condition}.`,
      confidence,
      riskLevel,
      supportingEvidence: [
        'Image Visual Analysis — Bounding Box Integrity Check',
        'Equipment Inspection History — P204',
        'Maintenance SOP Section 4.2'
      ],
      requestingUser: currentUser?.name || 'Engineer',
      requestingRole: currentUser?.role || 'Engineer',
      dateTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
      status: 'Pending'
    };

    const newInvestigation: InvestigationItem = {
      id: invId,
      title: `Investigation: ${detectedEquipment} Abnormal Condition`,
      equipment: detectedEquipment,
      createdDate: new Date().toISOString().replace('T', ' ').slice(0, 19),
      status: 'Awaiting Approval',
      riskLevel,
      stepsCompleted: [
        'Investigation Created',
        'Documents Retrieved',
        'Permission Check Completed',
        'Inspection History Analyzed',
        'Image Analysis Performed',
        'AI Recommendation Generated',
        'Verification Required',
        'Awaiting Human Approval'
      ],
      aiRecommendation: `Schedule maintenance inspection and mechanical seal alignment for ${detectedEquipment} within 24 hours.`,
      evidence: [
        'Image Visual Analysis',
        'Maintenance SOP v4.2 — Section 4.2',
        'Inspection Report Q3'
      ],
      confidence,
      approvalId: apprId
    };

    setApprovals(prev => [newApproval, ...prev]);
    setInvestigations(prev => [newInvestigation, ...prev]);

    addAuditLog('Investigation & Approval Created', `Created investigation for ${detectedEquipment}`, 'Pending', `Generated AI recommendation awaiting human approval.`);

    setToastMessage({
      title: 'Investigation Workflow Initiated',
      desc: `Created approval card #${apprId} for ${detectedEquipment}. Awaiting Manager/Admin review.`,
      type: 'success'
    });

    setActivePage('investigations');
  };

  // Human Approval Action
  const handleApprovalAction = (approvalId: string, action: 'Approved' | 'Rejected' | 'Under Review', note?: string) => {
    if (currentUser?.role !== 'Administrator' && currentUser?.role !== 'Manager') {
      addAuditLog('Approval Decision Blocked', `Approval ID ${approvalId}`, 'Denied', 'Only Manager or Administrator can decide high-risk recommendations.');
      setToastMessage({
        title: 'ACCESS DENIED',
        desc: 'Only Managers and Administrators have authority to approve or reject high-risk AI recommendations.',
        type: 'error'
      });
      return;
    }

    setApprovals(prev => prev.map(item => {
      if (item.id === approvalId) {
        return {
          ...item,
          status: action,
          reviewerNote: note || `${action} by ${currentUser.name} (${currentUser.role})`,
          reviewedBy: `${currentUser.name} (${currentUser.role})`
        };
      }
      return item;
    }));

    // Update corresponding investigation
    setInvestigations(prev => prev.map(inv => {
      if (inv.approvalId === approvalId) {
        return {
          ...inv,
          status: action === 'Approved' ? 'Approved' : action === 'Rejected' ? 'Rejected' : 'In Progress',
          stepsCompleted: action === 'Approved' 
            ? [...inv.stepsCompleted.filter(s => s !== 'Awaiting Human Approval'), 'Human Approval Granted — Work Order Executed']
            : action === 'Rejected'
            ? [...inv.stepsCompleted.filter(s => s !== 'Awaiting Human Approval'), 'Human Approval Rejected — Returned to Maintenance']
            : inv.stepsCompleted
        };
      }
      return inv;
    }));

    addAuditLog('Human Approval Decision', `Approval ID: ${approvalId} set to ${action}`, 'Success', `Decision executed by ${currentUser.name}. Note: ${note || 'N/A'}`);

    setToastMessage({
      title: `Approval ${action}`,
      desc: `Decision recorded into Immutable Audit Ledger by ${currentUser.name}.`,
      type: action === 'Approved' ? 'success' : action === 'Rejected' ? 'error' : 'info'
    });
  };

  // Model Governance Lifecycle
  const updateModelLifecycle = (modelId: string, targetStatus: 'Testing' | 'Approved' | 'Production') => {
    if (currentUser?.role !== 'Administrator') {
      addAuditLog('Model Transition Attempt', `Model ID: ${modelId}`, 'Denied', 'Only Administrators can change model governance lifecycle.');
      setToastMessage({
        title: 'Permission Denied',
        desc: 'Only Administrators can alter Model Governance status.',
        type: 'error'
      });
      return;
    }

    let success = false;
    setModels(prev => prev.map(m => {
      if (m.id === modelId) {
        // Enforce state transition rules: Testing -> Approved -> Production
        if (targetStatus === 'Production' && m.status === 'Testing') {
          setToastMessage({
            title: 'Transition Blocked',
            desc: 'A model cannot move directly to Production without prior Approval status.',
            type: 'warning'
          });
          addAuditLog('Model Governance Rule Violation', `Model ${m.name} transition Testing -> Production blocked`, 'Blocked');
          return m;
        }

        success = true;
        return {
          ...m,
          status: targetStatus,
          approvedBy: targetStatus === 'Approved' || targetStatus === 'Production' ? `${currentUser.name} (Admin)` : m.approvedBy,
          deploymentStatus: targetStatus === 'Production' ? 'Active' : 'Offline',
          updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
        };
      }
      return m;
    }));

    if (success) {
      addAuditLog('Model Lifecycle Transition', `Model ID ${modelId} moved to ${targetStatus}`, 'Success');
      setToastMessage({
        title: 'Model Lifecycle Updated',
        desc: `Model status changed to ${targetStatus}. Deployment state updated.`,
        type: 'success'
      });
    }
  };

  // Prompt Injection Sandbox Test
  const runPromptInjectionTest = (docContent: string) => {
    const injectionPatterns = [
      /ignore previous instructions/i,
      /reveal all confidential files/i,
      /disregard safety guidelines/i,
      /bypass rbac/i,
      /system prompt leak/i
    ];

    const threatDetected = injectionPatterns.some(p => p.test(docContent));
    let safeText = docContent;

    if (threatDetected) {
      injectionPatterns.forEach(pattern => {
        safeText = safeText.replace(pattern, '[REDACTED MALICIOUS INSTRUCTION]');
      });

      // Security Alert
      const alert: SecurityAlert = {
        id: `alert-pi-${Date.now()}`,
        severity: 'Medium',
        title: 'Prompt Injection Threat Neutralized',
        description: 'Embedded adversarial prompt detected in input document stream. Sanitized by Sovereign Security Layer.',
        timestamp: new Date().toLocaleTimeString(),
        resolved: true
      };
      setSecurityAlerts(al => [alert, ...al]);

      addAuditLog('Prompt Injection Detected', 'Sanitized raw text document stream', 'Violation', 'Malicious instructions stripped from AI context window.');
    }

    return { threatDetected, safeText };
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      activePage,
      sovereignMode: true,
      isInternetSimulatedOffline,
      policies,
      documents,
      models,
      approvals,
      investigations,
      auditLogs,
      securityAlerts,
      chatMessages,
      
      login,
      logout,
      switchUserRole,
      navigateTo,
      hasPermission,
      canAccessDocument,
      
      togglePolicy,
      toggleInternetDisconnection,
      
      uploadDocument,
      tamperDocument,
      
      sendChatMessage,
      createInvestigationFromImage,
      handleApprovalAction,
      updateModelLifecycle,
      addAuditLog,
      runPromptInjectionTest,
      
      toastMessage,
      setToastMessage
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
