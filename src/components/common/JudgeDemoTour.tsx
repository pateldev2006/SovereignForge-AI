import React from 'react';
import { useApp } from '../../context/AppContext';
import { Play, ChevronRight, ChevronLeft, X, Sparkles, CheckCircle2, UserCheck, ShieldCheck, FileText, ArrowRight } from 'lucide-react';

export const JudgeDemoTour: React.FC = () => {
  const { 
    isDemoTourActive, 
    demoTourStep, 
    nextDemoTourStep, 
    prevDemoTourStep, 
    closeDemoTour, 
    jumpToDemoStep,
    currentUser,
    activePage
  } = useApp();

  if (!isDemoTourActive) return null;

  const tourSteps = [
    {
      step: 1,
      title: 'Step 1: Authenticate as Plant Engineer',
      role: 'PlantEngineer',
      desc: 'Start as Rajesh Kumar (Plant / Process Engineer). Notice the clean White + Blue industrial interface with least-privilege RBAC. Admin controls are completely hidden.',
      actionLabel: 'View Active Workbench'
    },
    {
      step: 2,
      title: 'Step 2: Ingest Inspection Report (HX-204)',
      role: 'PlantEngineer',
      desc: 'Select or drag & drop inspection_report.pdf (Heat Exchanger HX-204, 4.2 MB) containing scanned NDT tables, ultrasonic measurements, and photos.',
      actionLabel: 'Pre-load Industrial Files'
    },
    {
      step: 3,
      title: 'Step 3: Run AI Agentic Workflow',
      role: 'PlantEngineer',
      desc: 'Submit task: "Prepare approval note for Heat Exchanger HX-204 and check against SOP-4.2.1." The system initiates local sovereign processing.',
      actionLabel: 'Trigger Agent Execution'
    },
    {
      step: 4,
      title: 'Step 4: Inspect Expandable Agent Trace',
      role: 'PlantEngineer',
      desc: 'Observe the 7-step autonomous trace pipeline (Task Router → Qwen2.5-VL → PaddleOCR → Hybrid RAG → SOP Retrieval → Reasoning → Verification → Doc Gen) in 12.4s.',
      actionLabel: 'Inspect Pipeline Trace'
    },
    {
      step: 5,
      title: 'Step 5: Hybrid Multimodal RAG Retrieval',
      role: 'PlantEngineer',
      desc: 'Visual representation of Dense Vector + BM25 + Graph Search retrieving 3 authoritative SOP sections with relevance confidence up to 98%.',
      actionLabel: 'Explore RAG Citations'
    },
    {
      step: 6,
      title: 'Step 6: Hero SOP Deviation Detection',
      role: 'PlantEngineer',
      desc: 'AI detects critical non-conformance: Observed 18-month turnaround in report vs. 12-month mandatory limit in SOP-4.2.1 (+6 month critical variance). Flags for human review.',
      actionLabel: 'View Deviation Alert'
    },
    {
      step: 7,
      title: 'Step 7: Click-to-Source Provenance [1]',
      role: 'PlantEngineer',
      desc: 'Click citation [1] to open the right-side provenance drawer showing exact highlighted text on SOP-4.2.1 Page 18. Zero hallucinations.',
      actionLabel: 'Open Source Drawer'
    },
    {
      step: 8,
      title: 'Step 8: Generated Deliverable (Approval Note)',
      role: 'PlantEngineer',
      desc: 'Preview realistic industrial deliverable Ref: MRPL/MECH/2026/HX-204-APPR complete with comparison tables, risk assessment, and draft recommendations.',
      actionLabel: 'Review Generated Note'
    },
    {
      step: 9,
      title: 'Step 9: Dispatch for Human Approval',
      role: 'PlantEngineer',
      desc: 'Click "Send for Approval" to submit the technical note to the executive review queue. Invariant: AI never executes high-risk decisions autonomously.',
      actionLabel: 'Submit to Approver Queue'
    },
    {
      step: 10,
      title: 'Step 10: Switch to Approving Authority',
      role: 'Approver',
      desc: 'Switch role to Dr. Vikram Shetty (Approving Authority). Notice how the sidebar dynamically reveals the Approval Queue, which was previously invisible to the Engineer.',
      actionLabel: 'Switch to Approver View'
    },
    {
      step: 11,
      title: 'Step 11: Executive Sign-Off & RSA Signature',
      role: 'Approver',
      desc: 'Review supporting evidence, confirm 12-month overhaul condition, and apply digital RSA signature. Generates immutable Audit ID SF-2026-000241.',
      actionLabel: 'Execute Digital Approval'
    },
    {
      step: 12,
      title: 'Step 12: CISO Security & Global Audit Ledger',
      role: 'CISO',
      desc: 'Switch role to Suresh Bhat (CISO). Inspect the complete tamper-evident audit trail, AI Capability Firewall, Model Registry, and Zero Outbound Network Monitor.',
      actionLabel: 'View CISO Security Center'
    }
  ];

  const currentStepData = tourSteps[demoTourStep - 1] || tourSteps[0];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-in slide-in-from-bottom-6 duration-200">
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-2xl border-2 border-blue-500/80 backdrop-blur-md">
        
        {/* Tour Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-600 text-white">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
              3-Minute Judge Evaluation Tour
            </span>
            <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
              Step {demoTourStep} of 12
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-300">
              Active: <strong className="text-white">{currentUser.name}</strong> ({currentUser.role})
            </span>
            <button
              onClick={closeDemoTour}
              className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
              title="Close tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tour Body */}
        <div className="py-3.5 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                {currentStepData.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mt-1">
                {currentStepData.desc}
              </p>
            </div>
          </div>

          {/* Step Progress Dots */}
          <div className="flex items-center gap-1.5 pt-2">
            {tourSteps.map((s) => (
              <button
                key={s.step}
                onClick={() => jumpToDemoStep(s.step)}
                className={`h-1.5 rounded-full transition-all ${
                  s.step === demoTourStep 
                    ? 'w-7 bg-blue-500' 
                    : s.step < demoTourStep 
                    ? 'w-3 bg-emerald-500' 
                    : 'w-2 bg-slate-700 hover:bg-slate-600'
                }`}
                title={`Jump to step ${s.step}: ${s.title}`}
              />
            ))}
          </div>
        </div>

        {/* Tour Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            onClick={prevDemoTourStep}
            disabled={demoTourStep === 1}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors ${
              demoTourStep === 1 
                ? 'text-slate-600 cursor-not-allowed' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={closeDemoTour}
              className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
            >
              Exit Tour
            </button>

            <button
              onClick={nextDemoTourStep}
              className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md flex items-center gap-1.5 transition-all"
            >
              {demoTourStep === 12 ? 'Finish Tour' : 'Next Step'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
