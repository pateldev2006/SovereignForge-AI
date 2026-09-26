import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Lock, Activity, Users, Cpu, Database, CheckCircle2, ArrowRight } from 'lucide-react';

export const Overview: React.FC = () => {
  const { navigateTo, currentUser } = useApp();

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              ADMIN CONTROL CENTER
            </span>
            <span className="text-xs text-slate-500 font-medium">
              System Governance & Operations
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
            Control Center Governance Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Centralized hub for refinery AI model lifecycle, capability firewalls, role-based access matrix, and air-gapped security.
          </p>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        <div 
          onClick={() => navigateTo('admin-security')}
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card hover:border-blue-400 transition-all cursor-pointer space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">CISO Security Dashboard</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Zero-egress telemetry, failed auth logs, model hash checks, and incident streams.
          </p>
          <span className="text-xs font-bold text-blue-700 flex items-center gap-1">
            <span>Open Security Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div 
          onClick={() => navigateTo('admin-roles')}
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card hover:border-blue-400 transition-all cursor-pointer space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Role & Permission Matrix</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Granular module and action permissions across Engineer, IT, QA, Approver, and CISO.
          </p>
          <span className="text-xs font-bold text-blue-700 flex items-center gap-1">
            <span>Configure RBAC Matrix</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div 
          onClick={() => navigateTo('admin-firewall')}
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card hover:border-blue-400 transition-all cursor-pointer space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">AI Capability Firewall</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Agent-level restrictions on reading docs, writing files, code execution, and egress.
          </p>
          <span className="text-xs font-bold text-blue-700 flex items-center gap-1">
            <span>Manage Agent Guardrails</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div 
          onClick={() => navigateTo('admin-models')}
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card hover:border-blue-400 transition-all cursor-pointer space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Local Model Registry</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Qwen2.5-VL, Qwen Coder, DeepSeek R1, BGE-M3, and PaddleOCR weight verifications.
          </p>
          <span className="text-xs font-bold text-blue-700 flex items-center gap-1">
            <span>Inspect Model Weights</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div 
          onClick={() => navigateTo('admin-network')}
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card hover:border-blue-400 transition-all cursor-pointer space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Network Sovereignty</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Physical interface adapters, internal LAN nodes, packet metrics, and hardware keys.
          </p>
          <span className="text-xs font-bold text-blue-700 flex items-center gap-1">
            <span>View Network Telemetry</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div 
          onClick={() => navigateTo('admin-audit')}
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card hover:border-blue-400 transition-all cursor-pointer space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Global Forensic Audit</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Tamper-evident cryptographic audit logs for statutory PSU and OISD compliance.
          </p>
          <span className="text-xs font-bold text-blue-700 flex items-center gap-1">
            <span>Inspect Audit Ledger</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

      </div>

    </div>
  );
};
