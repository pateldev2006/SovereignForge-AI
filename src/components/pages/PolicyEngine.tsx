import React from 'react';
import { useApp } from '../../context/AppContext';
import { AccessDenied } from '../common/AccessDenied';
import { 
  Sliders, ShieldCheck, ShieldAlert, Lock, AlertTriangle, Play, RefreshCw, CheckCircle2, XCircle
} from 'lucide-react';
import { PolicyState } from '../../types';

export const PolicyEngine: React.FC = () => {
  const { 
    policies, 
    togglePolicy, 
    currentUser, 
    hasPermission, 
    addAuditLog, 
    setToastMessage 
  } = useApp();

  if (!currentUser || !hasPermission(currentUser.role, 'policies')) {
    return <AccessDenied />;
  }

  const policyItems: { key: keyof PolicyState; label: string; description: string; defaultBadge: string }[] = [
    {
      key: 'externalApi',
      label: 'External API Calls',
      description: 'Prevent LLM or agents from connecting to external public cloud endpoints.',
      defaultBadge: 'BLOCKED'
    },
    {
      key: 'internetAccess',
      label: 'Internet Access',
      description: 'Enforce strict local node network isolation and air-gapped web boundaries.',
      defaultBadge: 'BLOCKED'
    },
    {
      key: 'autonomousActions',
      label: 'Autonomous Physical Actions',
      description: 'Prevent agents from executing real-world SCADA/PLC commands without human approval.',
      defaultBadge: 'BLOCKED'
    },
    {
      key: 'confidentialExport',
      label: 'Confidential Data Export',
      description: 'Block unencrypted raw file downloads or bulk exports of Restricted documents.',
      defaultBadge: 'BLOCKED'
    },
    {
      key: 'humanApprovalRequired',
      label: 'Human Approval Requirement',
      description: 'Mandate manager digital signature before any maintenance work order is issued.',
      defaultBadge: 'REQUIRED'
    },
    {
      key: 'toolAuthorization',
      label: 'Tool Authorization Framework',
      description: 'Enable agent access to local vector index, image vision, and sensor telemetry.',
      defaultBadge: 'ENABLED'
    },
    {
      key: 'auditLogging',
      label: 'Immutable Audit Logging',
      description: 'Record every query, document retrieval, and policy decision with SHA-256 hash.',
      defaultBadge: 'ENABLED'
    }
  ];

  const handleSimulateViolation = (policyName: string) => {
    addAuditLog('POLICY VIOLATION ATTEMPT', `Action: ${policyName}`, 'Blocked', 'Security Policy blocked unauthorized outbound call.');
    setToastMessage({
      title: 'POLICY BLOCKED',
      desc: `External API access is disabled by SovereignForge security policy (${policyName}).`,
      type: 'error'
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-amber-400 mb-1">
            <Sliders className="w-4 h-4" /> Sovereign Control Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            AI Policy & Governance Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure real-time safety guardrails and policy enforcement for autonomous AI agents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">
            ENFORCEMENT ACTIVE
          </span>
        </div>
      </div>

      {/* Policy Toggle List */}
      <div className="space-y-4">
        {policyItems.map(item => {
          const isActive = policies[item.key];

          return (
            <div 
              key={item.key}
              className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl hover:border-slate-700 transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-white text-base">{item.label}</h3>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                    isActive 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {isActive ? 'ACTIVE / ALLOWED' : 'BLOCKED / DISABLED'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Toggle Switch */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => togglePolicy(item.key)}
                  className={`w-14 h-8 rounded-full p-1 transition-colors relative border ${
                    isActive 
                      ? 'bg-cyan-600 border-cyan-400 glow-cyan' 
                      : 'bg-slate-950 border-slate-800'
                  }`}
                  aria-label={`Toggle ${item.label}`}
                >
                  <div className={`w-6 h-6 rounded-full bg-white transition-transform ${
                    isActive ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>

                <button
                  onClick={() => handleSimulateViolation(item.label)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-rose-400 border border-slate-800 text-xs font-mono font-semibold transition-colors flex items-center gap-1.5"
                  title="Simulate action that violates this policy"
                >
                  <Play className="w-3.5 h-3.5" /> Test Violation
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Policy Violation Demonstration Sandbox */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl backdrop-blur">
        <h3 className="font-bold text-white text-base flex items-center gap-2 font-mono">
          <ShieldAlert className="w-5 h-5 text-rose-400" /> Interactive Policy Violation Simulator
        </h3>
        <p className="text-xs text-slate-400">
          Click below to simulate an AI agent trying to query an external public API endpoint (e.g. OpenAI/Anthropic cloud).
        </p>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-mono">
            <span className="text-slate-400">Simulated Agent Action:</span>
            <div className="text-rose-400 font-bold mt-0.5">
              POST https://api.external-ai.com/v1/chat/completions
            </div>
          </div>

          <button
            onClick={() => handleSimulateViolation('External API Access')}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md glow-red transition-all flex items-center gap-2"
          >
            Trigger Outbound API Test <Play className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
