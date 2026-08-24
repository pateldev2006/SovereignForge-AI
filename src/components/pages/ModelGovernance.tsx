import React from 'react';
import { useApp } from '../../context/AppContext';
import { AccessDenied } from '../common/AccessDenied';
import { 
  Sparkles, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, Server, Cpu, RefreshCw, Eye
} from 'lucide-react';

export const ModelGovernance: React.FC = () => {
  const { models, updateModelLifecycle, currentUser, hasPermission } = useApp();

  if (!currentUser || !hasPermission(currentUser.role, 'models')) {
    return <AccessDenied />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-cyan-400 mb-1">
            <Sparkles className="w-4 h-4" /> Sovereign Model Governance
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            AI Model Lifecycle & Evaluation
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Enforce strict Testing → Approved → Production deployment workflows for local weights.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">
            LOCAL INFERENCE ENGINE ACTIVE
          </span>
        </div>
      </div>

      {/* Models Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {models.map(m => (
          <div 
            key={m.id}
            className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 flex flex-col justify-between hover:border-slate-700 transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-950 text-cyan-300 border border-slate-800">
                  {m.type}
                </span>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  m.status === 'Production' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  m.status === 'Approved' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                  'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  STATUS: {m.status.toUpperCase()}
                </span>
              </div>

              <h3 className="font-bold text-white text-lg">{m.name}</h3>
              <div className="text-xs font-mono text-slate-400 mt-1">
                Version: <strong className="text-white">{m.version}</strong> • Updated: {m.updatedAt}
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-mono">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase block mb-0.5">Eval Benchmark</span>
                  <span className="text-cyan-400 font-bold text-base">{m.evalScore}%</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase block mb-0.5">Deployment</span>
                  <span className={`font-bold text-xs ${m.deploymentStatus === 'Active' ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {m.deploymentStatus}
                  </span>
                </div>
              </div>

              <div className="mt-3 text-xs text-slate-400 font-mono">
                Approved By: <span className="text-slate-200">{m.approvedBy}</span>
              </div>
            </div>

            {/* Lifecycle Action Buttons */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                Simulate Lifecycle Transition:
              </span>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => updateModelLifecycle(m.id, 'Testing')}
                  disabled={m.status === 'Testing'}
                  className="py-2 px-2 rounded-xl text-[11px] font-mono font-semibold transition-all bg-slate-950 hover:bg-slate-800 text-amber-300 border border-slate-800 disabled:opacity-40"
                >
                  Testing
                </button>

                <button
                  onClick={() => updateModelLifecycle(m.id, 'Approved')}
                  disabled={m.status === 'Approved'}
                  className="py-2 px-2 rounded-xl text-[11px] font-mono font-semibold transition-all bg-slate-950 hover:bg-slate-800 text-blue-300 border border-slate-800 disabled:opacity-40"
                >
                  Approved
                </button>

                <button
                  onClick={() => updateModelLifecycle(m.id, 'Production')}
                  disabled={m.status === 'Production'}
                  className="py-2 px-2 rounded-xl text-[11px] font-mono font-semibold transition-all bg-slate-950 hover:bg-slate-800 text-emerald-300 border border-slate-800 disabled:opacity-40"
                >
                  Production
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
