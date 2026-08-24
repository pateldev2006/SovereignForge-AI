import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckSquare, ShieldAlert, Check, X, HelpCircle, FileText, UserCheck, Clock, CheckCircle2
} from 'lucide-react';

export const Approvals: React.FC = () => {
  const { approvals, handleApprovalAction, currentUser } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [reviewNote, setReviewNote] = useState<{ [key: string]: string }>({});

  const filteredApprovals = approvals.filter(item => {
    if (filterStatus === 'All') return true;
    return item.status === filterStatus;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-cyan-400 mb-1">
            <CheckSquare className="w-4 h-4" /> Human-in-the-Loop Governance
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            AI Recommendation Approval Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Mandatory manager signoff for autonomous agent high-risk action execution.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {['All', 'Pending', 'Approved', 'Rejected', 'Under Review'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                filterStatus === st
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Approval Cards List */}
      <div className="space-y-6">
        {filteredApprovals.map(item => {
          const isPending = item.status === 'Pending';

          return (
            <div 
              key={item.id}
              className={`bg-slate-900/90 border rounded-3xl p-6 shadow-2xl space-y-6 transition-all ${
                item.status === 'Approved' ? 'border-emerald-500/40' :
                item.status === 'Rejected' ? 'border-rose-500/40' :
                item.status === 'Under Review' ? 'border-cyan-500/40' :
                'border-slate-800'
              }`}
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      item.riskLevel === 'High' || item.riskLevel === 'Critical'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {item.riskLevel} Risk
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      item.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      item.status === 'Rejected' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      item.status === 'Under Review' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                      'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      STATUS: {item.status.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base sm:text-lg">{item.title}</h3>
                </div>

                <div className="text-left sm:text-right font-mono text-xs text-slate-400">
                  <div>Confidence Score: <strong className="text-cyan-400">{item.confidence}%</strong></div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{item.dateTime}</div>
                </div>
              </div>

              {/* Recommendation Body */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                  Proposed AI Action Recommendation:
                </span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-semibold">
                  "{item.recommendation}"
                </p>
              </div>

              {/* Supporting Evidence & Metadata Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <span className="font-mono font-bold text-slate-400 uppercase text-[11px] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-cyan-400" /> Supporting Evidence ({item.supportingEvidence.length})
                  </span>
                  <div className="space-y-1">
                    {item.supportingEvidence.map((ev, i) => (
                      <div key={i} className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 font-mono text-[11px]">
                        • {ev}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="font-mono font-bold text-slate-400 uppercase text-[11px] flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-cyan-400" /> Requestor & Governance Profile
                  </span>
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Requesting User:</span>
                      <span className="text-white font-semibold">{item.requestingUser}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Role:</span>
                      <span className="text-cyan-300 font-mono">{item.requestingRole}</span>
                    </div>
                    {item.reviewedBy && (
                      <div className="flex justify-between border-t border-slate-800 pt-1 text-emerald-400">
                        <span>Reviewed By:</span>
                        <span className="font-bold">{item.reviewedBy}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Notes & Buttons */}
              {isPending && (
                <div className="pt-4 border-t border-slate-800 space-y-4">
                  <input
                    type="text"
                    placeholder="Optional review note (e.g. Approved for shift 2 overhaul window)..."
                    value={reviewNote[item.id] || ''}
                    onChange={e => setReviewNote({ ...reviewNote, [item.id]: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                  />

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleApprovalAction(item.id, 'Approved', reviewNote[item.id])}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" /> Approve Recommendation
                    </button>

                    <button
                      onClick={() => handleApprovalAction(item.id, 'Rejected', reviewNote[item.id])}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
                    >
                      <X className="w-4 h-4" /> Reject
                    </button>

                    <button
                      onClick={() => handleApprovalAction(item.id, 'Under Review', reviewNote[item.id] || 'Requested additional diagnostics')}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs transition-all border border-slate-700 flex items-center justify-center gap-1.5"
                    >
                      <HelpCircle className="w-4 h-4" /> Request More Information
                    </button>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
