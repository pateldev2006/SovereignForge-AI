import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, ShieldAlert, Lock, Activity, Server, Radio, 
  Cpu, AlertTriangle, CheckCircle2, Clock, Terminal, Users, Database 
} from 'lucide-react';

export const SecurityCenter: React.FC = () => {
  const { securityMetrics, networkTelemetry, auditLogs, setIsSovereigntyModalOpen } = useApp();

  const securityEvents = auditLogs.filter(log => log.risk === 'High' || log.risk === 'Critical' || log.result === 'BLOCKED' || log.result === 'DENIED');

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              CISO / SECURITY OPERATIONS CENTER (SOC)
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Air-Gapped Sovereign AI Perimeter
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
            Cybersecurity & Integrity Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time monitoring of air-gapped network isolation, model weight integrity, tool sandbox execution, and forensic audit streams.
          </p>
        </div>

        <button
          onClick={() => setIsSovereigntyModalOpen(true)}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all"
        >
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Inspect Network Telemetry</span>
        </button>
      </div>

      {/* Hero Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Security Status</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-emerald-700 mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-green"></span>
            SECURE
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5">OISD-STD-129 Compliant</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Outbound Egress</span>
            <Lock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-emerald-900 mt-1">0</div>
          <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">Zero External Connections</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Failed Logins (24h)</span>
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-slate-900 mt-1">2</div>
          <span className="text-[10px] text-slate-500 block mt-0.5">Blocked by LDAP / MFA</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Policy Violations</span>
            <AlertTriangle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-emerald-700 mt-1">0</div>
          <span className="text-[10px] text-slate-500 block mt-0.5">Guardrails 100% Enforced</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Model Weights</span>
            <Cpu className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm font-bold text-blue-700 mt-2">VERIFIED</div>
          <span className="text-[10px] text-slate-500 block mt-0.5">SHA-256 Hash Matching</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Audit Ledger</span>
            <Database className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-sm font-bold text-emerald-700 mt-2">HEALTHY</div>
          <span className="text-[10px] text-slate-500 block mt-0.5">Tamper-Evident Signatures</span>
        </div>

      </div>

      {/* Security Incident & Anomaly Event Stream */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-rose-600" />
            Security & Egress Enforcement Events (Simulated SOC Stream)
          </h2>
          <span className="text-[11px] font-mono text-slate-400">Auto-refresh: 1s</span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {securityEvents.map((evt) => (
            <div key={evt.id} className="py-3 first:pt-0 last:pb-0 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${
                  evt.risk === 'Critical' ? 'bg-rose-600' : 'bg-amber-500'
                }`}></span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{evt.action}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-900 border border-rose-200">
                      {evt.result}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">{evt.timestamp}</span>
                  </div>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">{evt.details}</p>
                </div>
              </div>

              <div className="text-right font-mono text-[11px] text-slate-500">
                <span>{evt.clientIp}</span>
                <span className="block text-slate-400 text-[10px]">{evt.hashSignature}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
