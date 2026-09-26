import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Lock, ShieldCheck, Check, X, AlertTriangle, Bot, Sliders, Cpu, 
  Terminal, Database, FileText, Eye, ShieldAlert, Zap, Pause, Play,
  Trash2, RefreshCw, Layers, Radio, Settings2, Shield
} from 'lucide-react';

type ToolPermissionLevel = 'ALLOW' | 'REQUIRE_APPROVAL' | 'DENY';

interface ToolConstraint {
  toolName: string;
  category: string;
  timeoutSec: number;
  memoryLimitMb: number;
  allowedPaths: string;
  sqlOperations: string;
  networkEgress: string;
}

interface ActiveAgentProcess {
  pid: string;
  agentName: string;
  taskTitle: string;
  currentStep: string;
  stepCount: number;
  maxSteps: number;
  elapsedSec: number;
  tokensUsed: number;
  status: 'RUNNING' | 'PAUSED' | 'AWAITING_APPROVAL' | 'TERMINATED';
}

export const AICapabilityFirewall: React.FC = () => {
  const { firewallRules, toggleFirewallCapability, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'matrix' | 'constraints' | 'lifecycle'>('matrix');

  // Agent x Tool Matrix State
  const [matrixPermissions, setMatrixPermissions] = useState<Record<string, Record<string, ToolPermissionLevel>>>({
    'Process Engineering Reasoning Agent': {
      'Calculator & Formula Engine': 'ALLOW',
      'Document & SOP Parser': 'ALLOW',
      'Python Sandbox Executor': 'REQUIRE_APPROVAL',
      'SQL / SCADA Historian Diode': 'REQUIRE_APPROVAL',
      'P&ID Computer Vision': 'ALLOW',
      'Deliverable Generation Studio': 'ALLOW'
    },
    'P&ID & Drawing Vision Agent': {
      'Calculator & Formula Engine': 'ALLOW',
      'Document & SOP Parser': 'ALLOW',
      'Python Sandbox Executor': 'DENY',
      'SQL / SCADA Historian Diode': 'DENY',
      'P&ID Computer Vision': 'ALLOW',
      'Deliverable Generation Studio': 'REQUIRE_APPROVAL'
    },
    'IT Automation & Code Agent': {
      'Calculator & Formula Engine': 'ALLOW',
      'Document & SOP Parser': 'ALLOW',
      'Python Sandbox Executor': 'ALLOW',
      'SQL / SCADA Historian Diode': 'REQUIRE_APPROVAL',
      'P&ID Computer Vision': 'DENY',
      'Deliverable Generation Studio': 'ALLOW'
    },
    'QA & Compliance Review Agent': {
      'Calculator & Formula Engine': 'ALLOW',
      'Document & SOP Parser': 'ALLOW',
      'Python Sandbox Executor': 'DENY',
      'SQL / SCADA Historian Diode': 'ALLOW',
      'P&ID Computer Vision': 'ALLOW',
      'Deliverable Generation Studio': 'ALLOW'
    }
  });

  // Tool Constraints State
  const [toolConstraints, setToolConstraints] = useState<ToolConstraint[]>([
    {
      toolName: 'Python Sandbox Executor',
      category: 'Compute & Code',
      timeoutSec: 30,
      memoryLimitMb: 512,
      allowedPaths: '/data/workspace/sandbox_tmp/*',
      sqlOperations: 'N/A (Process Isolated)',
      networkEgress: 'STRICT DROP (0 Egress)'
    },
    {
      toolName: 'SQL / SCADA Historian Diode',
      category: 'Data Diode Read',
      timeoutSec: 15,
      memoryLimitMb: 256,
      allowedPaths: 'N/A (Read-only TDS Stream)',
      sqlOperations: 'SELECT ONLY (INSERT/UPDATE/DROP BLOCKED)',
      networkEgress: 'One-Way Local Diode Interface'
    },
    {
      toolName: 'P&ID Computer Vision Engine',
      category: 'Vision / OCR',
      timeoutSec: 45,
      memoryLimitMb: 1024,
      allowedPaths: '/data/documents/drawings/*',
      sqlOperations: 'N/A',
      networkEgress: 'NO SOCKETS'
    },
    {
      toolName: 'Deliverable Generation Studio',
      category: 'File Export',
      timeoutSec: 20,
      memoryLimitMb: 384,
      allowedPaths: '/data/deliverables/output/*',
      sqlOperations: 'N/A',
      networkEgress: 'LOCAL FS ONLY'
    }
  ]);

  // Safety & PII filter toggles
  const [safetyFilters, setSafetyFilters] = useState({
    piiAadhaarPan: true,
    confidentialPlantTags: true,
    groundingConfidenceThreshold: 85,
    failSafeMode: 'FAIL_CLOSED' as 'FAIL_CLOSED' | 'FAIL_OPEN'
  });

  // Active Agent Processes
  const [agentProcesses, setAgentProcesses] = useState<ActiveAgentProcess[]>([
    {
      pid: 'AGT-PROC-901',
      agentName: 'Process Engineering Reasoning Agent',
      taskTitle: 'API 510 Deethanizer Column Pressure Vessel Calculation',
      currentStep: 'Step 4/6: Evaluating minimum wall thickness equation against ASME Section VIII Div 1',
      stepCount: 4,
      maxSteps: 8,
      elapsedSec: 14,
      tokensUsed: 4820,
      status: 'RUNNING'
    },
    {
      pid: 'AGT-PROC-902',
      agentName: 'P&ID & Drawing Vision Agent',
      taskTitle: 'Instrumentation Tag Discrepancy Cross-Reference (DWG-042)',
      currentStep: 'Step 3/5: Bounding box matching for PT-1002 pressure transmitter',
      stepCount: 3,
      maxSteps: 7,
      elapsedSec: 28,
      tokensUsed: 6240,
      status: 'AWAITING_APPROVAL'
    }
  ]);

  const cyclePermission = (agent: string, tool: string) => {
    const current = matrixPermissions[agent]?.[tool] || 'ALLOW';
    const next: ToolPermissionLevel = current === 'ALLOW' ? 'REQUIRE_APPROVAL' : current === 'REQUIRE_APPROVAL' ? 'DENY' : 'ALLOW';
    
    setMatrixPermissions({
      ...matrixPermissions,
      [agent]: {
        ...matrixPermissions[agent],
        [tool]: next
      }
    });

    showToast('Firewall Rule Updated', `${agent} → ${tool} set to ${next}.`, 'info');
  };

  const handleKillProcess = (pid: string) => {
    setAgentProcesses(agentProcesses.map(p => p.pid === pid ? { ...p, status: 'TERMINATED', currentStep: 'Terminated by CISO Admin' } : p));
    showToast('Agent Process Terminated', `Process ${pid} killed immediately. Resources reclaimed.`, 'error');
  };

  const handlePauseProcess = (pid: string) => {
    setAgentProcesses(agentProcesses.map(p => p.pid === pid ? { ...p, status: p.status === 'PAUSED' ? 'RUNNING' : 'PAUSED' } : p));
    showToast('Process State Changed', `Process ${pid} state updated.`, 'info');
  };

  const toolsList = [
    'Calculator & Formula Engine',
    'Document & SOP Parser',
    'Python Sandbox Executor',
    'SQL / SCADA Historian Diode',
    'P&ID Computer Vision',
    'Deliverable Generation Studio'
  ];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              AGENTIC CAPABILITY FIREWALL & LIFECYCLE (SECTIONS 4 & 6)
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Zero-Trust Execution Invariant
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
            AI Capability Firewall & Agent Sandbox
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Fine-grained access control matrix governing tool invocations, hardware resource limits, PII output filters, and live agent lifecycles.
          </p>
        </div>

        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-900 font-medium">
          <Lock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span><strong>Air-Gap Invariant:</strong> External Internet access is permanently disabled for all agent subprocesses.</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'matrix'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Agent × Tool Permission Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('constraints')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'constraints'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Settings2 className="w-4 h-4" />
          <span>Tool Resource Constraints & Safety Filters</span>
        </button>

        <button
          onClick={() => setActiveTab('lifecycle')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'lifecycle'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Live Agent Processes ({agentProcesses.filter(p => p.status !== 'TERMINATED').length})</span>
        </button>
      </div>

      {/* TAB 1: AGENT X TOOL PERMISSION MATRIX */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-x-auto">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">Fine-Grained Capability Matrix</h3>
                <p className="text-xs text-slate-500">Click any cell to toggle between ALLOW, REQUIRE APPROVAL, and DENY.</p>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono font-bold">
                <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <Check className="w-3 h-3" /> ALLOW
                </span>
                <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  <AlertTriangle className="w-3 h-3" /> REQUIRE APPROVAL
                </span>
                <span className="flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  <X className="w-3 h-3" /> DENY
                </span>
              </div>
            </div>

            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100/75 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5 min-w-[220px]">Autonomous Agent Role</th>
                  {toolsList.map((tool, idx) => (
                    <th key={idx} className="p-3 text-center min-w-[130px]">{tool}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {Object.keys(matrixPermissions).map((agentName) => (
                  <tr key={agentName} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                      <Bot className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span>{agentName}</span>
                    </td>
                    {toolsList.map((tool) => {
                      const level = matrixPermissions[agentName]?.[tool] || 'DENY';
                      return (
                        <td key={tool} className="p-2.5 text-center">
                          <button
                            onClick={() => cyclePermission(agentName, tool)}
                            className={`w-full py-1.5 px-2 rounded-lg font-mono font-bold text-[10px] transition-all shadow-2xs border ${
                              level === 'ALLOW'
                                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                                : level === 'REQUIRE_APPROVAL'
                                ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
                                : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-200'
                            }`}
                          >
                            {level === 'ALLOW' && 'ALLOW'}
                            {level === 'REQUIRE_APPROVAL' && 'HUMAN GATE'}
                            {level === 'DENY' && 'BLOCKED'}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: TOOL CONSTRAINTS & SAFETY FILTERS */}
      {activeTab === 'constraints' && (
        <div className="space-y-6">
          {/* Tool Resource Limits Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-700">
              TOOL-LEVEL EXECUTION CONSTRAINTS & ISOLATION LIMITS
            </div>
            <div className="divide-y divide-slate-200">
              {toolConstraints.map((t, idx) => (
                <div key={idx} className="p-4 flex flex-wrap items-center justify-between gap-4 hover:bg-slate-50/70">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {t.category}
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900">{t.toolName}</h4>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-1 space-x-3">
                      <span>Path Whitelist: <strong className="text-slate-700">{t.allowedPaths}</strong></span>
                      <span>•</span>
                      <span>SQL Scope: <strong className="text-slate-700">{t.sqlOperations}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div className="p-2 bg-slate-100 rounded-lg text-center min-w-[90px]">
                      <span className="text-[10px] text-slate-400 block font-semibold">TIMEOUT</span>
                      <strong className="text-slate-800">{t.timeoutSec}s</strong>
                    </div>
                    <div className="p-2 bg-slate-100 rounded-lg text-center min-w-[90px]">
                      <span className="text-[10px] text-slate-400 block font-semibold">MAX RAM</span>
                      <strong className="text-slate-800">{t.memoryLimitMb} MB</strong>
                    </div>
                    <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-center min-w-[120px]">
                      <span className="text-[10px] text-emerald-600 block font-semibold">EGRESS LOCK</span>
                      <strong className="text-emerald-800 font-bold">{t.networkEgress}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Safety & Output Filtering */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
            <h3 className="font-extrabold text-base text-slate-900">
              Real-Time Output Filtering & Hallucination Prevention
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900 block">Aadhaar / PAN / PII Redaction Filter</strong>
                    <span className="text-slate-500 text-[11px]">Automatically regex mask all identification numbers from deliverables</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={safetyFilters.piiAadhaarPan}
                    onChange={(e) => setSafetyFilters({ ...safetyFilters, piiAadhaarPan: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <div>
                    <strong className="text-slate-900 block">Confidential Plant Tag Anonymization</strong>
                    <span className="text-slate-500 text-[11px]">Enforce L5 access for raw SCADA telemetry addresses</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={safetyFilters.confidentialPlantTags}
                    onChange={(e) => setSafetyFilters({ ...safetyFilters, confidentialPlantTags: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div>
                  <div className="flex justify-between font-bold text-slate-900 mb-1">
                    <span>Source Grounding Threshold</span>
                    <span className="font-mono text-blue-600">{safetyFilters.groundingConfidenceThreshold}%</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="98"
                    value={safetyFilters.groundingConfidenceThreshold}
                    onChange={(e) => setSafetyFilters({ ...safetyFilters, groundingConfidenceThreshold: Number(e.target.value) })}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Outputs with source similarity below this threshold trigger mandatory human approval.
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-900">Violation Policy Mode</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSafetyFilters({ ...safetyFilters, failSafeMode: 'FAIL_CLOSED' })}
                      className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold ${
                        safetyFilters.failSafeMode === 'FAIL_CLOSED' ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      FAIL-CLOSED (Block)
                    </button>
                    <button
                      onClick={() => setSafetyFilters({ ...safetyFilters, failSafeMode: 'FAIL_OPEN' })}
                      className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold ${
                        safetyFilters.failSafeMode === 'FAIL_OPEN' ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      FAIL-OPEN (Warn)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LIVE AGENT PROCESSES & LIFECYCLE */}
      {activeTab === 'lifecycle' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Active Agent Process Monitor & Task Step Trace
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time execution telemetry for autonomous agents with instant process termination and step-level intervention.
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                MAX STEP BUDGET: 10 ITERATIONS
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {agentProcesses.map((proc) => (
                <div key={proc.pid} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                        {proc.pid}
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900">{proc.taskTitle}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        proc.status === 'RUNNING'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : proc.status === 'AWAITING_APPROVAL'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : proc.status === 'PAUSED'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {proc.status}
                      </span>

                      {proc.status !== 'TERMINATED' && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handlePauseProcess(proc.pid)}
                            className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs"
                            title={proc.status === 'PAUSED' ? 'Resume' : 'Pause'}
                          >
                            {proc.status === 'PAUSED' ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleKillProcess(proc.pid)}
                            className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-xs font-bold"
                            title="Kill Process (Hard Abort)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs font-mono text-slate-700">
                    <span className="text-slate-400 font-bold block text-[10px]">CURRENT SCRATCHPAD STEP</span>
                    {proc.currentStep}
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
                    <span>Agent: <strong className="text-slate-800">{proc.agentName}</strong></span>
                    <span>Elapsed: <strong className="text-slate-800">{proc.elapsedSec}s</strong></span>
                    <span>Tokens: <strong className="text-blue-600">{proc.tokensUsed} tokens</strong></span>
                    <span>Steps: <strong className="text-slate-800">{proc.stepCount} / {proc.maxSteps}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
