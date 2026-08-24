import React from 'react';
import { useApp } from '../../context/AppContext';
import { AccessDenied } from '../common/AccessDenied';
import { PageId } from '../../types';
import { 
  Users, Network, Bot, Wrench, Database, ShieldCheck, CheckCircle2, Plus, Lock, Key
} from 'lucide-react';

interface Props {
  pageId: PageId;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

export const GenericAdminPage: React.FC<Props> = ({ pageId, title, subtitle, icon }) => {
  const { currentUser, hasPermission, setToastMessage } = useApp();

  if (!currentUser || !hasPermission(currentUser.role, pageId)) {
    return <AccessDenied />;
  }

  const handleSimulateAction = (actionName: string) => {
    setToastMessage({
      title: 'Action Executed',
      desc: `Admin executed '${actionName}' on ${title}. Audit ledger updated.`,
      type: 'success'
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-cyan-400 mb-1">
            {icon} Administrator Control Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {subtitle}
          </p>
        </div>

        <button
          onClick={() => handleSimulateAction(`Create New ${title} Record`)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs transition-all shadow-md glow-cyan flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Record
        </button>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="font-bold text-white text-base font-mono">
            Active Catalog & Permissions ({title})
          </h3>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
            ENFORCED BY RBAC
          </span>
        </div>

        <div className="space-y-3">
          {[1, 2, 3].map(idx => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <h4 className="font-bold text-white text-sm font-mono">
                  {title} Item #{idx} — Sovereign Cluster Policy Target
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Restricted to Administrator clearance • Encryption Key Node #0{idx}
                </p>
              </div>

              <button
                onClick={() => handleSimulateAction(`Configure Policy Item #${idx}`)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono font-semibold transition-colors border border-slate-700"
              >
                Configure Item #{idx}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
