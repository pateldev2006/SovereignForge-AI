import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sliders, CheckCircle2, Eye } from 'lucide-react';

export const Reviews: React.FC = () => {
  const { openSourceViewer, showToast } = useApp();

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              DESIGN & ASSET INTEGRITY QA
            </span>
            <span className="text-xs text-slate-500 font-medium">
              P&ID Verification & Technical Audit
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
            Design, P&ID & SOP Compliance Review
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            QA Officer workspace for approving or rejecting technical engineering findings, drawing tag audits, and safety relief valve schedules.
          </p>
        </div>
      </div>

      {/* Review Item Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-6">
        
        <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold flex-shrink-0">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-purple-900 bg-purple-100/70 px-2 py-0.5 rounded border border-purple-200">
                  MRPL/QA/2026/PSV-304-AUD
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                </span>
              </div>
              <h2 className="text-base font-extrabold text-slate-900 mt-1">
                P&ID Unit 03 Relief Line Sizing & PSV-304 Setpoint Audit
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Target: CDU-03 Pre-Heat Train • Drawing: P&ID_Unit_03.png
              </p>
            </div>
          </div>

          <button
            onClick={() => openSourceViewer(1)}
            className="px-3.5 py-2 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 flex items-center gap-1.5 shadow-2xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Inspect Drawing Overlay</span>
          </button>
        </div>

        {/* Technical Finding Checklist */}
        <div className="space-y-3 text-xs">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
            Verified QA Compliance Checkpoints:
          </h4>

          <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="text-slate-800">
                <strong>PSV-304 Setpoint Verification:</strong> Setpoint 32.0 kg/cm²g matches maximum allowable vessel MAWP.
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              COMPLIANT
            </span>
          </div>

          <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="text-slate-800">
                <strong>Discharge Line Sizing:</strong> 4" Sch-80 pipe satisfies acoustic velocity guidelines under OISD-STD-129.
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              COMPLIANT
            </span>
          </div>
        </div>

        {/* QA Actions */}
        <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            Signed by Pooja Hegde (Design / QA Officer) • Cert ID: QA-2026-9904
          </span>
          <button
            onClick={() => showToast('Compliance Report Download', 'Downloading official P&ID certification note.', 'info')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Export Signed QA Certificate
          </button>
        </div>

      </div>

    </div>
  );
};
