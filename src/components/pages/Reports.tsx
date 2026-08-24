import React from 'react';
import { BarChart3, Download, FileText, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Reports: React.FC = () => {
  const { setToastMessage } = useApp();

  const handleDownloadReport = (title: string) => {
    setToastMessage({
      title: 'Report Export Generated',
      desc: `Generated encrypted PDF compliance report: ${title}.`,
      type: 'success'
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-cyan-400 mb-1">
            <BarChart3 className="w-4 h-4" /> Compliance & Asset Analytics
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Industrial Executive & Engineering Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Automated compliance summaries, equipment degradation trends, and audit summaries.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex justify-between items-start">
            <div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                WEEKLY DIAGNOSTIC
              </span>
              <h3 className="font-bold text-white text-base mt-2">Q3 Plant Mechanical Integrity Summary</h3>
            </div>
            <FileText className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Covers Pump P204 thermal scan, turbine alignment metrics, and safety valve recalibrations.
          </p>
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => handleDownloadReport('Q3 Plant Mechanical Integrity Summary')}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Export Encrypted PDF
            </button>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex justify-between items-start">
            <div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                AUDIT COMPLIANCE
              </span>
              <h3 className="font-bold text-white text-base mt-2">Sovereign AI Governance & RBAC Audit</h3>
            </div>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Complete cryptographic record of 1,842 AI queries, 0 policy violations, and 12 manager signoffs.
          </p>
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => handleDownloadReport('Sovereign AI Governance Audit')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Export Audit Ledger
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
