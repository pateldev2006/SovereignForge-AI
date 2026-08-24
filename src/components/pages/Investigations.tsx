import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Activity, CheckCircle2, Clock, AlertTriangle, ShieldCheck, 
  FileText, ArrowRight, UserCheck, Check, X, HelpCircle
} from 'lucide-react';

export const Investigations: React.FC = () => {
  const { 
    investigations, 
    handleApprovalAction, 
    currentUser, 
    navigateTo 
  } = useApp();

  const activeInv = investigations[0] || {
    id: 'inv-204-01',
    title: 'Pump P204 Abnormal Condition & Vibration Anomaly',
    equipment: 'Industrial Centrifugal Pump P204',
    createdDate: '2026-08-23 18:05:00',
    status: 'Awaiting Approval',
    riskLevel: 'High',
    stepsCompleted: [
      'Investigation Created',
      'Documents Retrieved (SOP v4.2, Inspection Q3)',
      'Permission Check Completed (RBAC Passed)',
      'Inspection History Analyzed',
      'Image Analysis Performed',
      'AI Recommendation Generated',
      'Verification Required',
      'Awaiting Human Approval'
    ],
    aiRecommendation: 'Schedule a maintenance inspection and mechanical seal alignment for Pump P204 within 24 operating hours.',
    evidence: [
      'Maintenance SOP — Page 17, Section 4.2',
      'Pump P204 Inspection Report — Page 6 & 8',
      'High-Pressure Safety Manual — Section 3.1'
    ],
    confidence: 87,
    approvalId: 'appr-101'
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-cyan-400 mb-1">
            <Activity className="w-4 h-4" /> Agentic Autonomous Workflow Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Industrial Equipment Investigations
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Multi-agent RAG workflow with mandatory Human-in-the-Loop approval safeguards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">
            PROTOTYPE SAFETY BOUNDARY ACTIVE
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Agent Workflow Timeline */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="font-bold text-white text-base font-mono flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" /> Agent Workflow Timeline
            </h2>
            <span className="text-[10px] font-mono text-slate-500">8 Steps</span>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {activeInv.stepsCompleted.map((step, idx) => {
              const isLast = idx === activeInv.stepsCompleted.length - 1;
              return (
                <div key={idx} className="relative flex items-start gap-3">
                  <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isLast 
                      ? 'bg-amber-500 text-slate-950 glow-emerald animate-pulse' 
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}>
                    {isLast ? <Clock className="w-3 h-3" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <h4 className={`text-xs font-mono ${isLast ? 'font-bold text-amber-300' : 'text-slate-300'}`}>
                      {step}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono">Completed via Autonomous Agent</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
            <p className="text-[11px] leading-tight">
              <strong>SAFETY RULE ENFORCED:</strong> Autonomous execution is BLOCKED. This recommendation requires explicit Human Approval before maintenance work orders can issue.
            </p>
          </div>
        </div>

        {/* Right 2 Columns: AI Recommendation & Decision Card */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl backdrop-blur">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {activeInv.riskLevel} Risk Level
                </span>
                <h3 className="font-bold text-white text-lg mt-1">{activeInv.title}</h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-mono block">AI Confidence Score</span>
                <span className="text-base font-bold text-cyan-400 font-mono">{activeInv.confidence}%</span>
              </div>
            </div>

            {/* Recommendation Box */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-mono font-bold uppercase text-cyan-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Synthesized AI Recommendation
              </span>
              <p className="text-sm font-semibold text-white leading-relaxed">
                "{activeInv.aiRecommendation}"
              </p>
            </div>

            {/* Supporting Evidence Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase font-bold text-slate-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-400" /> Supporting Evidence ({activeInv.evidence.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {activeInv.evidence.map((ev, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <div className="font-semibold text-slate-200">{ev}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-1">Verified RAG Source</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Human Approval Action Panel */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 space-y-4">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400 font-bold uppercase">Required Approval Level:</span>
                <span className="text-amber-400 font-bold">Manager or Administrator Only</span>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleApprovalAction(activeInv.approvalId || 'appr-101', 'Approved', 'Approved during live prototype demo.')}
                  className="flex-1 min-w-[120px] py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Approve Recommendation
                </button>

                <button
                  onClick={() => handleApprovalAction(activeInv.approvalId || 'appr-101', 'Rejected', 'Rejected for further vibration testing.')}
                  className="flex-1 min-w-[120px] py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <X className="w-4 h-4" /> Reject
                </button>

                <button
                  onClick={() => handleApprovalAction(activeInv.approvalId || 'appr-101', 'Under Review', 'Requested secondary thermographic scan.')}
                  className="flex-1 min-w-[120px] py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs transition-all border border-slate-700 flex items-center justify-center gap-1.5"
                >
                  <HelpCircle className="w-4 h-4" /> Request Review
                </button>
              </div>

              <div className="text-[10px] text-slate-500 text-center font-mono">
                Current Authenticated Role: <strong className="text-slate-300">{currentUser?.role}</strong> • All decisions recorded into Audit Logs.
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
