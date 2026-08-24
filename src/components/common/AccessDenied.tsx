import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, Lock, ArrowLeft, ShieldCheck } from 'lucide-react';

export const AccessDenied: React.FC = () => {
  const { currentUser, navigateTo, switchUserRole } = useApp();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-6 glow-red animate-pulse">
        <ShieldAlert className="w-10 h-10 text-rose-500" />
      </div>

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 text-xs font-mono font-semibold tracking-wider uppercase mb-4 border border-rose-500/30">
        <Lock className="w-3.5 h-3.5" /> Security Enforced — RBAC Block
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2 font-mono">
        ACCESS DENIED
      </h1>

      <p className="text-lg text-slate-300 max-w-md mb-8">
        "You do not have permission to access this resource."
      </p>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 max-w-lg w-full text-left mb-8 backdrop-blur">
        <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" /> Active Credentials Profile
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Authenticated User:</span>
            <span className="text-white font-medium">{currentUser?.name || 'Unknown'}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Current Role:</span>
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-xs font-semibold">
              {currentUser?.role || 'None'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Department:</span>
            <span className="text-slate-300">{currentUser?.department || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={() => navigateTo(currentUser?.role === 'Administrator' ? 'dashboard' : currentUser?.role === 'Manager' ? 'approvals' : 'workbench')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-all border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Authorized Area
        </button>

        {currentUser?.role !== 'Administrator' && (
          <button
            onClick={() => switchUserRole('Administrator')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-sm transition-all shadow-lg glow-cyan"
          >
            Switch to Administrator Account (Demo)
          </button>
        )}
      </div>
    </div>
  );
};
