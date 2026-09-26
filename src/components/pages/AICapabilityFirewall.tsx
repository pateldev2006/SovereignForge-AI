import React from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, ShieldCheck, Check, X, AlertTriangle, Bot, Sliders, Cpu } from 'lucide-react';

export const AICapabilityFirewall: React.FC = () => {
  const { firewallRules, toggleFirewallCapability, showToast } = useApp();

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              AGENTIC GUARDRAILS & SANDBOX FIREWALL
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Zero-Trust AI Execution
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
            AI Capability Firewall
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict perimeter controls governing tool execution, filesystem access, subprocess spawning, and outbound egress for autonomous agent nodes.
          </p>
        </div>

        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-900">
          <Lock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span><strong>Air-Gap Invariant:</strong> External Internet access is permanently disabled by hardware lock for all agents.</span>
        </div>
      </div>

      {/* Firewall Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {firewallRules.map((rule) => (
          <div key={rule.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
            
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold flex-shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">{rule.agentName}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{rule.agentRole}</p>
                </div>
              </div>

              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex-shrink-0">
                SANDBOXED
              </span>
            </div>

            {/* Capability Toggles Matrix */}
            <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Permission Guardrails:
              </span>

              {/* Read Docs */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="font-semibold text-slate-800">Read Document Repository</span>
                <button
                  onClick={() => toggleFirewallCapability(rule.id, 'readDocs')}
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    rule.readDocs ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300 text-slate-300'
                  }`}
                >
                  {rule.readDocs && <Check className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Write Files */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="font-semibold text-slate-800">Write Deliverables & Drafts</span>
                <button
                  onClick={() => toggleFirewallCapability(rule.id, 'writeFiles')}
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    rule.writeFiles ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300 text-slate-300'
                  }`}
                >
                  {rule.writeFiles && <Check className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Run Code */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="font-semibold text-slate-800">Execute Sandboxed Code / Scripts</span>
                <button
                  onClick={() => toggleFirewallCapability(rule.id, 'runCode')}
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    rule.runCode ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300 text-slate-300'
                  }`}
                >
                  {rule.runCode && <Check className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Internet Access (PERMANENTLY DISABLED INVARIANT) */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50/70 border border-rose-200">
                <div>
                  <span className="font-bold text-rose-900 block">External Internet Egress</span>
                  <span className="text-[10px] text-rose-700">Hardware locked in Sovereign Air-Gap</span>
                </div>
                <div 
                  onClick={() => showToast('Firewall Lock Invariant', 'External internet egress cannot be enabled in sovereign air-gapped mode.', 'warning')}
                  className="w-5 h-5 rounded bg-rose-600 text-white flex items-center justify-center cursor-not-allowed"
                  title="Permanently locked"
                >
                  <X className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              {/* Export Data */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="font-semibold text-slate-800">Export DOCX / PDF Documents</span>
                <button
                  onClick={() => toggleFirewallCapability(rule.id, 'exportData')}
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    rule.exportData ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300 text-slate-300'
                  }`}
                >
                  {rule.exportData && <Check className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Sandbox Execution Limits */}
            <div className="border-t border-slate-100 pt-3 grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Execution Timeout</span>
                <span className="font-mono font-bold text-slate-800 mt-0.5 block">{rule.maxExecutionSec} seconds</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Memory Quota</span>
                <span className="font-mono font-bold text-slate-800 mt-0.5 block">{rule.memoryLimitMb} MB RAM</span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
