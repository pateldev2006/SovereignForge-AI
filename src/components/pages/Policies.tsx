import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Lock, AlertTriangle, Check, X, FileCheck2, Cpu } from 'lucide-react';

export const Policies: React.FC = () => {
  const { showToast } = useApp();

  const [policies, setPolicies] = useState([
    {
      id: 'pol-01',
      code: 'SEC-POL-01',
      title: 'Zero Outbound Network Egress (Air-Gap Mandate)',
      description: 'Strict hardware lock preventing any outbound TCP/UDP packets to non-Enterprise subnets.',
      status: 'Enforced',
      isLocked: true,
      category: 'Perimeter Defense'
    },
    {
      id: 'pol-02',
      code: 'SEC-POL-02',
      title: 'Human-in-the-Loop Sign-off for High-Risk Actions',
      description: 'Mandates explicit digital RSA sign-off for any turnaround schedule deviation or pressure setpoint change.',
      status: 'Enforced',
      isLocked: true,
      category: 'Operational Safety'
    },
    {
      id: 'pol-03',
      code: 'SEC-POL-03',
      title: 'Local Model Weight Cryptographic Integrity Verification',
      description: 'Verifies SHA-256 weight hash against signed root certificate before loading into GPU memory.',
      status: 'Enforced',
      isLocked: false,
      category: 'Model Governance'
    },
    {
      id: 'pol-04',
      code: 'SEC-POL-04',
      title: 'Prompt Injection & Jailbreak Sanitization Layer',
      description: 'Pre-screens document OCR text streams for embedded adversarial directives.',
      status: 'Enforced',
      isLocked: false,
      category: 'AI Security'
    }
  ]);

  const togglePolicyStatus = (id: string) => {
    setPolicies(prev => prev.map(p => {
      if (p.id === id) {
        if (p.isLocked) {
          showToast('Policy Locked', 'Core Air-Gap and Safety policies are mandatory and cannot be disabled.', 'warning');
          return p;
        }
        const nextStatus = p.status === 'Enforced' ? 'Disabled' : 'Enforced';
        showToast('Policy Updated', `${p.code} is now ${nextStatus}.`, 'info');
        return { ...p, status: nextStatus };
      }
      return p;
    }));
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              INDUSTRIAL CYBER POLICIES
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Statutory Compliance Rules
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
            Industrial Security & Governance Policies
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure system-wide AI execution guardrails, air-gap enforcement rules, and human-in-the-loop triggers.
          </p>
        </div>
      </div>

      {/* Policy List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {policies.map((pol) => (
          <div key={pol.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {pol.code}
                </span>
                <h3 className="font-bold text-sm text-slate-900 mt-1 leading-snug">{pol.title}</h3>
              </div>

              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex-shrink-0 ${
                pol.status === 'Enforced' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}>
                {pol.status}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {pol.description}
            </p>

            <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">{pol.category}</span>
              <button
                onClick={() => togglePolicyStatus(pol.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  pol.isLocked 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                }`}
              >
                {pol.isLocked ? 'Hardware Locked' : pol.status === 'Enforced' ? 'Disable Policy' : 'Enforce Policy'}
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
