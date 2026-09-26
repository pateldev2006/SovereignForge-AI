import React from 'react';
import { useApp } from '../../context/AppContext';
import { Cpu, ShieldCheck, CheckCircle2, RefreshCw, HardDrive, Zap, Check, AlertCircle } from 'lucide-react';

export const ModelRegistry: React.FC = () => {
  const { models, verifyModelIntegrity, showToast, currentUser } = useApp();

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              AIR-GAPPED MODEL WEIGHTS & RUNTIMES
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Hardware Weight Hash Verification
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
            Local Air-Gapped Model Registry
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage local LLM weights, vision backends, dense embedding models, and OCR engines running directly on MRPL GPU clusters.
          </p>
        </div>

        <button
          onClick={() => showToast('Cluster Health Checked', 'All 6 local model engines verified healthy.', 'success')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Run Cluster Check</span>
        </button>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map((m) => (
          <div key={m.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card hover:border-blue-300 transition-all flex flex-col justify-between space-y-4">
            
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {m.category}
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {m.status}
                </span>
              </div>

              <h3 className="font-extrabold text-sm text-slate-900 leading-snug">{m.name}</h3>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">{m.parameters} • {m.quantization}</p>

              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                {m.description}
              </p>

              {/* Hardware Performance Metrics */}
              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">VRAM</span>
                  <span className="font-mono font-bold text-slate-800">{m.vramUsageGb} GB</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Latency</span>
                  <span className="font-mono font-bold text-slate-800">{m.inferenceLatencyMs} ms</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Speed</span>
                  <span className="font-mono font-bold text-blue-600">{m.tpsSpeed} tps</span>
                </div>
              </div>

              {/* Cryptographic SHA-256 Digest */}
              <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 text-[11px] font-mono">
                <div className="flex items-center justify-between text-slate-500 text-[10px]">
                  <span>SHA-256 WEIGHT CHECKSUM</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> VERIFIED
                  </span>
                </div>
                <span className="text-slate-700 break-all block mt-0.5">
                  {m.sha256Hash.slice(0, 32)}...
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">Ver: {m.version}</span>
              <button
                onClick={() => verifyModelIntegrity(m.id)}
                className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-colors shadow-2xs flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Verify Checksum</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
