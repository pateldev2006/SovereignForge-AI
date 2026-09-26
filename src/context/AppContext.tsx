import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, UserRole, PageId, DocumentItem, SOPItem, SourceCitation, 
  IndustrialTask, ApprovalQueueItem, 
  AuditEvent, ModelItem, AICapabilityFirewallRule, RolePermissionMatrixItem, 
  NetworkTelemetry, SecurityMetrics 
} from '../types';
import { 
  DEMO_USERS, INITIAL_DOCUMENTS, INITIAL_SOPS, SAMPLE_RETRIEVED_SOURCES, 
  SAMPLE_DEVIATION, SAMPLE_DELIVERABLE, INITIAL_TASKS, 
  INITIAL_APPROVALS, INITIAL_MODELS, INITIAL_FIREWALL_RULES, 
  INITIAL_ROLE_PERMISSION_MATRIX, INITIAL_AUDIT_LOGS, INITIAL_NETWORK_TELEMETRY, 
  INITIAL_SECURITY_METRICS 
} from '../data/mockData';

export type SystemStatusMode = 'FULL' | 'DEGRADED' | 'SAFE' | 'OFFLINE';

interface AppContextType {
  // Current user & RBAC
  currentUser: User;
  activePage: PageId;
  systemMode: SystemStatusMode;
  setSystemMode: (mode: SystemStatusMode) => void;
  switchUser: (role: UserRole) => void;
  navigateTo: (page: PageId) => void;
  hasPermission: (moduleKey: string, action?: 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'export' | 'admin') => boolean;
  hasFieldAccess: (fieldName: string) => boolean;
  canViewPage: (page: PageId) => boolean;

  // Data collections
  tasks: IndustrialTask[];
  currentTask: IndustrialTask | null;
  documents: DocumentItem[];
  sops: SOPItem[];
  approvals: ApprovalQueueItem[];
  models: ModelItem[];
  firewallRules: AICapabilityFirewallRule[];
  rolePermissions: RolePermissionMatrixItem[];
  auditLogs: AuditEvent[];
  networkTelemetry: NetworkTelemetry;
  securityMetrics: SecurityMetrics;

  // Task execution
  isAgentRunning: boolean;
  agentProgressStep: number;
  runAgentTask: (prompt: string, attachedFiles: string[]) => Promise<void>;
  resetTaskToFresh: () => void;

  // Click-to-source provenance
  selectedSource: SourceCitation | null;
  openSourceViewer: (citationIndexOrId: number | string) => void;
  closeSourceViewer: () => void;

  // Human approval actions
  approveDeliverable: (approvalId: string, signature: string, notes: string) => void;
  rejectDeliverable: (approvalId: string, notes: string) => void;
  requestChangesDeliverable: (approvalId: string, notes: string) => void;

  // Admin mutations
  toggleFirewallCapability: (ruleId: string, capability: 'readDocs' | 'writeFiles' | 'runCode' | 'exportData') => void;
  togglePermission: (role: UserRole, moduleKey: string, action: 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'export' | 'admin') => void;
  verifyModelIntegrity: (modelId: string) => void;

  // Modals & Guided Demo Tour
  isSovereigntyModalOpen: boolean;
  setIsSovereigntyModalOpen: (open: boolean) => void;
  isDemoTourActive: boolean;
  demoTourStep: number;
  startDemoTour: () => void;
  nextDemoTourStep: () => void;
  prevDemoTourStep: () => void;
  closeDemoTour: () => void;
  jumpToDemoStep: (step: number) => void;

  // Toast notifications
  toast: { title: string; desc: string; type: 'success' | 'error' | 'warning' | 'info' } | null;
  showToast: (title: string, desc: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  clearToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Current user initialized to Plant / Process Engineer (Rajesh Kumar)
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('sf_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Validate the saved user has a role that matches our current DEMO_USERS
        const validRoles = DEMO_USERS.map(u => u.role);
        if (parsed && parsed.role && validRoles.includes(parsed.role)) {
          // Use the matching DEMO_USER to ensure shape compatibility
          const matchedUser = DEMO_USERS.find(u => u.role === parsed.role);
          if (matchedUser) return matchedUser;
        }
        // Invalid data from old prototype — clear it
        localStorage.removeItem('sf_user');
      } catch (e) {
        localStorage.removeItem('sf_user');
      }
    }
    return DEMO_USERS[0]; // Plant Engineer by default
  });

  const [activePage, setActivePage] = useState<PageId>('workbench');
  const [systemMode, setSystemMode] = useState<SystemStatusMode>('FULL');

  // Core state collections
  const [tasks, setTasks] = useState<IndustrialTask[]>(INITIAL_TASKS);
  const [currentTask, setCurrentTask] = useState<IndustrialTask | null>(INITIAL_TASKS[0]);
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [sops] = useState<SOPItem[]>(INITIAL_SOPS);
  const [approvals, setApprovals] = useState<ApprovalQueueItem[]>(INITIAL_APPROVALS);
  const [models, setModels] = useState<ModelItem[]>(INITIAL_MODELS);
  const [firewallRules, setFirewallRules] = useState<AICapabilityFirewallRule[]>(INITIAL_FIREWALL_RULES);
  const [rolePermissions, setRolePermissions] = useState<RolePermissionMatrixItem[]>(INITIAL_ROLE_PERMISSION_MATRIX);
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(INITIAL_AUDIT_LOGS);
  const [networkTelemetry] = useState<NetworkTelemetry>(INITIAL_NETWORK_TELEMETRY);
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics>(INITIAL_SECURITY_METRICS);

  // Execution & UI state
  const [isAgentRunning, setIsAgentRunning] = useState<boolean>(false);
  const [agentProgressStep, setAgentProgressStep] = useState<number>(7); // Default completed for demo preview
  const [selectedSource, setSelectedSource] = useState<SourceCitation | null>(null);
  const [isSovereigntyModalOpen, setIsSovereigntyModalOpen] = useState<boolean>(false);

  // Guided demo tour state
  const [isDemoTourActive, setIsDemoTourActive] = useState<boolean>(false);
  const [demoTourStep, setDemoTourStep] = useState<number>(1);

  // Toast state
  const [toast, setToast] = useState<{ title: string; desc: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);

  const showToast = (title: string, desc: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setToast({ title, desc, type });
  };

  const clearToast = () => setToast(null);

  // Sync current user to localStorage
  useEffect(() => {
    localStorage.setItem('sf_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Dynamic RBAC Permission Evaluator
  const hasPermission = (
    moduleKey: string, 
    action: 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'export' | 'admin' = 'view'
  ): boolean => {
    // CISO has universal admin permissions
    if (currentUser.role === 'CISO') return true;

    const moduleRow = rolePermissions.find(r => r.moduleKey === moduleKey);
    if (!moduleRow) return false;

    const rolePerms = moduleRow.permissions[currentUser.role];
    if (!rolePerms) return false;

    return !!rolePerms[action];
  };

  // Field-level Security Evaluator
  const hasFieldAccess = (fieldName: string): boolean => {
    if (currentUser.role === 'CISO') return true;
    if (fieldName === 'securityClassification') return false;
    if (fieldName === 'internalRiskScore') return false;
    if (fieldName === 'tamperChecksum') return currentUser.role === 'ITEngineer';
    if (fieldName === 'modelWeightsPath') return currentUser.role === 'ITEngineer';
    if (fieldName === 'firewallRules') return false;
    return true;
  };

  // Page Access Evaluator
  const canViewPage = (page: PageId): boolean => {
    if (currentUser.role === 'CISO') return true;

    switch (page) {
      case 'workbench':
      case 'tasks':
      case 'documents':
      case 'knowledge':
      case 'audit-history':
        return true;
      case 'approvals':
        return currentUser.role === 'Approver' || currentUser.role === 'QAOfficer';
      case 'reviews':
        return currentUser.role === 'QAOfficer';
      case 'code-sandbox':
        return currentUser.role === 'ITEngineer';
      case 'admin-models':
        return currentUser.role === 'ITEngineer';
      case 'admin-overview':
      case 'admin-roles':
      case 'admin-firewall':
      case 'admin-policies':
      case 'admin-security':
      case 'admin-network':
      case 'admin-audit':
        return false;
      default:
        return false;
    }
  };

  // Switch User Role helper
  const switchUser = (role: UserRole) => {
    const targetUser = DEMO_USERS.find(u => u.role === role) || DEMO_USERS[0];
    setCurrentUser(targetUser);

    // If current page is unauthorized for new role, redirect gracefully
    if (!canViewPage(activePage)) {
      if (role === 'Approver') {
        setActivePage('approvals');
      } else if (role === 'CISO') {
        setActivePage('admin-security');
      } else if (role === 'ITEngineer') {
        setActivePage('code-sandbox');
      } else if (role === 'QAOfficer') {
        setActivePage('reviews');
      } else {
        setActivePage('workbench');
      }
    }

    // Add Audit Log
    const newLog: AuditEvent = {
      id: `aud-${Date.now()}`,
      auditId: `SF-AUD-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: `${targetUser.name} (${targetUser.role})`,
      role: targetUser.role,
      action: 'ROLE_CONTEXT_SWITCHED',
      resource: 'User Authentication Session',
      agent: 'SovereignForge RBAC Controller',
      result: 'SUCCESS',
      risk: 'Low',
      hashSignature: `0x${Math.floor(Math.random() * 0xFFFFFFFFFF).toString(16).toUpperCase()}`,
      details: `Active role switched to ${targetUser.roleTitle} (${targetUser.clearanceLevel}). Dynamic UI security filters re-applied.`,
      clientIp: '10.14.32.105 (Internal LAN)'
    };
    setAuditLogs(prev => [newLog, ...prev]);

    showToast(
      `Role Switched: ${targetUser.roleTitle}`,
      `Authenticated as ${targetUser.name} (${targetUser.department}). Unauthorized views hidden.`,
      'info'
    );
  };

  const navigateTo = (page: PageId) => {
    if (!canViewPage(page)) {
      showToast('Access Blocked', 'Your role clearance does not permit viewing this module.', 'error');
      return;
    }
    setActivePage(page);
  };

  // Run Agent Task Execution
  const runAgentTask = async (prompt: string, attachedFiles: string[]) => {
    setIsAgentRunning(true);
    setAgentProgressStep(1);

    showToast(
      'Industrial AI Agent Initialized',
      'Routing task to local air-gapped multimodal model pipeline...',
      'info'
    );

    // Simulate step-by-step progress
    for (let step = 1; step <= 7; step++) {
      setAgentProgressStep(step);
      // Brief pause between steps for realistic live visualization
      await new Promise(res => setTimeout(res, 600));
    }

    setIsAgentRunning(false);

    // Update active task to completed deliverable
    const updatedTask: IndustrialTask = {
      ...INITIAL_TASKS[0],
      title: prompt || INITIAL_TASKS[0].title,
      attachedFiles: attachedFiles.length > 0 ? attachedFiles : INITIAL_TASKS[0].attachedFiles,
      status: 'Awaiting Approval',
      deliverable: SAMPLE_DELIVERABLE,
      retrievedSources: SAMPLE_RETRIEVED_SOURCES,
      deviations: [SAMPLE_DEVIATION]
    };

    setCurrentTask(updatedTask);
    setTasks(prev => [updatedTask, ...prev.filter(t => t.id !== updatedTask.id)]);

    // Ensure approval item is present in queue
    setApprovals(prev => {
      if (prev.some(a => a.taskId === updatedTask.id)) return prev;
      return [INITIAL_APPROVALS[0], ...prev];
    });

    // Add Audit Log
    const newLog: AuditEvent = {
      id: `aud-${Date.now()}`,
      auditId: `SF-AUD-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: `${currentUser.name} (${currentUser.role})`,
      role: currentUser.role,
      action: 'AI_AGENT_WORKFLOW_EXECUTED',
      resource: `Task: ${updatedTask.title}`,
      agent: 'Inspection & Compliance Agent (Qwen2.5-VL)',
      result: 'SUCCESS',
      risk: 'Medium',
      hashSignature: `0x${Math.floor(Math.random() * 0xFFFFFFFFFF).toString(16).toUpperCase()}`,
      details: `Autonomous analysis completed in 12.4s. Detected 1 critical SOP deviation (+6 mos). Drafted Approval Note Ref: MRPL/MECH/2026/HX-204-APPR.`,
      clientIp: '10.14.32.105 (Internal LAN)',
      forensicTrace: {
        modelUsed: 'Qwen2.5-VL-7B + R1-Distill',
        tokensIn: 14820,
        tokensOut: 2450,
        latencyMs: 12400,
        guardrailViolations: 0
      }
    };
    setAuditLogs(prev => [newLog, ...prev]);

    showToast(
      'SOP Deviation Detected & Note Drafted',
      '⚠️ Heat Exchanger turnaround interval exceeds SOP-4.2.1 limit by +6 months. Sent for human review.',
      'warning'
    );
  };

  const resetTaskToFresh = () => {
    setAgentProgressStep(0);
    setCurrentTask(null);
    showToast('Task Composer Reset', 'Ready for new industrial document analysis.', 'info');
  };

  // Click to Source Provenance Viewer
  const openSourceViewer = (citationIndexOrId: number | string) => {
    let match: SourceCitation | undefined;
    if (typeof citationIndexOrId === 'number') {
      match = SAMPLE_RETRIEVED_SOURCES.find(s => s.citationIndex === citationIndexOrId);
    } else {
      match = SAMPLE_RETRIEVED_SOURCES.find(s => s.id === citationIndexOrId);
    }

    if (match) {
      setSelectedSource(match);
      // Log access in audit
      const newLog: AuditEvent = {
        id: `aud-${Date.now()}`,
        auditId: `SF-AUD-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        user: `${currentUser.name} (${currentUser.role})`,
        role: currentUser.role,
        action: 'PROVENANCE_SOURCE_ACCESSED',
        resource: `${match.documentCode} (Page ${match.pageNumber})`,
        agent: 'Click-to-Source Provenance Engine',
        result: 'SUCCESS',
        risk: 'Low',
        hashSignature: `0x${Math.floor(Math.random() * 0xFFFFFFFFFF).toString(16).toUpperCase()}`,
        details: `Inspected source citation [${match.citationIndex}] excerpt from ${match.documentTitle}.`,
        clientIp: '10.14.32.105 (Internal LAN)'
      };
      setAuditLogs(prev => [newLog, ...prev]);
    }
  };

  const closeSourceViewer = () => setSelectedSource(null);

  // Human Approval Actions
  const approveDeliverable = (approvalId: string, signature: string, notes: string) => {
    if (currentUser.role !== 'Approver' && currentUser.role !== 'CISO' && currentUser.role !== 'QAOfficer') {
      showToast('Unauthorized Action', 'Only Approving Authority or QA Officer can approve deliverables.', 'error');
      return;
    }

    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const signCode = signature || `SIG_RSA4096_${Math.floor(Math.random() * 0xFFFFFFFFFF).toString(16).toUpperCase()}`;

    setApprovals(prev => prev.map(a => {
      if (a.id === approvalId) {
        return {
          ...a,
          status: 'Approved',
          deliverable: {
            ...a.deliverable,
            status: 'Approved',
            approvedBy: `${currentUser.name} (${currentUser.roleTitle})`,
            approvalTimestamp: timestamp,
            digitalSignature: signCode,
            reviewerNotes: notes || 'Approved with mandatory 12-month overhaul interval enforcement.'
          }
        };
      }
      return a;
    }));

    // Update current task deliverable
    if (currentTask && currentTask.deliverable) {
      setCurrentTask({
        ...currentTask,
        status: 'Approved',
        deliverable: {
          ...currentTask.deliverable,
          status: 'Approved',
          approvedBy: `${currentUser.name} (${currentUser.roleTitle})`,
          approvalTimestamp: timestamp,
          digitalSignature: signCode,
          reviewerNotes: notes || 'Approved with mandatory 12-month overhaul interval enforcement.'
        }
      });
    }

    // Add Audit Log
    const newLog: AuditEvent = {
      id: `aud-${Date.now()}`,
      auditId: `SF-AUD-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp,
      user: `${currentUser.name} (${currentUser.role})`,
      role: currentUser.role,
      action: 'DELIVERABLE_APPROVED_WITH_SIGNATURE',
      resource: `Approval ID: ${approvalId} (MRPL/MECH/2026/HX-204-APPR)`,
      agent: 'Deliverable Approval Agent',
      result: 'SUCCESS',
      risk: 'Low',
      hashSignature: signCode,
      details: `Digital signature applied by ${currentUser.name}. Conditional approval recorded in tamper-evident ledger. Notes: ${notes || 'Enforce 12mo turnaround.'}`,
      clientIp: '10.14.10.12 (Executive Network)'
    };
    setAuditLogs(prev => [newLog, ...prev]);

    showToast(
      'Deliverable Approved & Signed',
      `Approval Note signed by ${currentUser.name}. Audit ID: ${newLog.auditId}`,
      'success'
    );
  };

  const rejectDeliverable = (approvalId: string, notes: string) => {
    setApprovals(prev => prev.map(a => {
      if (a.id === approvalId) {
        return {
          ...a,
          status: 'Rejected',
          deliverable: {
            ...a.deliverable,
            status: 'Rejected',
            approvedBy: `${currentUser.name} (${currentUser.roleTitle})`,
            approvalTimestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
            reviewerNotes: notes || 'Rejected due to unacceptable SOP deviation proposal.'
          }
        };
      }
      return a;
    }));

    showToast('Deliverable Rejected', 'Returned to Process Engineering with non-conformance notes.', 'error');
  };

  const requestChangesDeliverable = (approvalId: string, notes: string) => {
    setApprovals(prev => prev.map(a => {
      if (a.id === approvalId) {
        return {
          ...a,
          status: 'Needs Changes',
          deliverable: {
            ...a.deliverable,
            status: 'Changes Requested',
            reviewerNotes: notes || 'Revise overhaul timeline to 12 months as mandated by SOP-4.2.1.'
          }
        };
      }
      return a;
    }));

    showToast('Changes Requested', 'Notification dispatched to Plant Engineer for revision.', 'warning');
  };

  // Admin firewall mutation
  const toggleFirewallCapability = (ruleId: string, capability: 'readDocs' | 'writeFiles' | 'runCode' | 'exportData') => {
    if (currentUser.role !== 'CISO') {
      showToast('Permission Denied', 'Only CISO / Security Admin can modify AI Firewall policies.', 'error');
      return;
    }

    setFirewallRules(prev => prev.map(rule => {
      if (rule.id === ruleId) {
        const updated = { ...rule, [capability]: !rule[capability] };
        
        // Audit log
        const newLog: AuditEvent = {
          id: `aud-${Date.now()}`,
          auditId: `SF-AUD-2026-${Math.floor(10000 + Math.random() * 90000)}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          user: `${currentUser.name} (CISO)`,
          role: 'CISO',
          action: 'AI_FIREWALL_POLICY_MODIFIED',
          resource: `Agent: ${rule.agentName}`,
          agent: 'AI Capability Firewall',
          result: 'SUCCESS',
          risk: 'Medium',
          hashSignature: `0x${Math.floor(Math.random() * 0xFFFFFFFFFF).toString(16).toUpperCase()}`,
          details: `Modified capability '${capability}' for agent ${rule.agentName} to ${updated[capability]}.`,
          clientIp: '10.14.5.2 (SOC Secure Console)'
        };
        setAuditLogs(l => [newLog, ...l]);

        return updated;
      }
      return rule;
    }));

    showToast('AI Firewall Guardrail Updated', `Agent capability policy updated.`, 'success');
  };

  // Admin role permission toggle
  const togglePermission = (
    role: UserRole, 
    moduleKey: string, 
    action: 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'export' | 'admin'
  ) => {
    if (currentUser.role !== 'CISO') {
      showToast('Permission Denied', 'Only CISO can edit the RBAC Permission Matrix.', 'error');
      return;
    }

    setRolePermissions(prev => prev.map(item => {
      if (item.moduleKey === moduleKey) {
        const currentVal = item.permissions[role][action];
        return {
          ...item,
          permissions: {
            ...item.permissions,
            [role]: {
              ...item.permissions[role],
              [action]: !currentVal
            }
          }
        };
      }
      return item;
    }));

    showToast('Permission Matrix Modified', `Updated ${action.toUpperCase()} permission on ${moduleKey} for ${role}.`, 'info');
  };

  // Admin Model Integrity Verification
  const verifyModelIntegrity = (modelId: string) => {
    setModels(prev => prev.map(m => {
      if (m.id === modelId) {
        return {
          ...m,
          integrityVerified: true,
          lastHealthCheck: new Date().toISOString().replace('T', ' ').slice(0, 19)
        };
      }
      return m;
    }));

    showToast('Model Integrity Verified', `Cryptographic weight checksum matches MRPL Root Certificate.`, 'success');
  };

  // Guided Demo Tour Actions
  const startDemoTour = () => {
    setIsDemoTourActive(true);
    setDemoTourStep(1);
    switchUser('PlantEngineer');
    setActivePage('workbench');
  };

  const nextDemoTourStep = () => {
    if (demoTourStep < 12) {
      setDemoTourStep(prev => prev + 1);
      handleDemoStepActions(demoTourStep + 1);
    } else {
      setIsDemoTourActive(false);
    }
  };

  const prevDemoTourStep = () => {
    if (demoTourStep > 1) {
      setDemoTourStep(prev => prev - 1);
      handleDemoStepActions(demoTourStep - 1);
    }
  };

  const jumpToDemoStep = (step: number) => {
    setDemoTourStep(step);
    handleDemoStepActions(step);
  };

  const closeDemoTour = () => setIsDemoTourActive(false);

  const handleDemoStepActions = (step: number) => {
    switch (step) {
      case 1:
        switchUser('PlantEngineer');
        setActivePage('workbench');
        break;
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
        switchUser('PlantEngineer');
        setActivePage('workbench');
        break;
      case 7:
        switchUser('PlantEngineer');
        setActivePage('workbench');
        openSourceViewer(1);
        break;
      case 8:
        switchUser('PlantEngineer');
        setActivePage('workbench');
        closeSourceViewer();
        break;
      case 9:
        switchUser('PlantEngineer');
        setActivePage('workbench');
        break;
      case 10:
        switchUser('Approver');
        setActivePage('approvals');
        break;
      case 11:
        switchUser('Approver');
        setActivePage('approvals');
        break;
      case 12:
        switchUser('CISO');
        setActivePage('admin-security');
        break;
      default:
        break;
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      activePage,
      systemMode,
      setSystemMode,
      switchUser,
      navigateTo,
      hasPermission,
      hasFieldAccess,
      canViewPage,

      tasks,
      currentTask,
      documents,
      sops,
      approvals,
      models,
      firewallRules,
      rolePermissions,
      auditLogs,
      networkTelemetry,
      securityMetrics,

      isAgentRunning,
      agentProgressStep,
      runAgentTask,
      resetTaskToFresh,

      selectedSource,
      openSourceViewer,
      closeSourceViewer,

      approveDeliverable,
      rejectDeliverable,
      requestChangesDeliverable,

      toggleFirewallCapability,
      togglePermission,
      verifyModelIntegrity,

      isSovereigntyModalOpen,
      setIsSovereigntyModalOpen,
      isDemoTourActive,
      demoTourStep,
      startDemoTour,
      nextDemoTourStep,
      prevDemoTourStep,
      closeDemoTour,
      jumpToDemoStep,

      toast,
      showToast,
      clearToast
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
