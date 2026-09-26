import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShieldCheck, Network, Server, Lock, Database, Radio } from 'lucide-react';

export const SovereigntyMonitorModal: React.FC = () => {
  const { isSovereigntyModalOpen, setIsSovereigntyModalOpen, networkTelemetry } = useApp();

  if (!isSovereigntyModalOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
      onClick={() => setIsSovereigntyModalOpen(false)}
    >
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[88vh] overflow-hidden my-auto animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex-shrink-0 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  AIR-GAP ACTIVE
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  DEMO TELEMETRY
                </span>
              </div>
              <h2 className="text-base font-bold text-white mt-0.5">Network Sovereignty & Perimeter Defense</h2>
            </div>
          </div>
          <button
            onClick={() => setIsSovereigntyModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 bg-slate-50/50">
          
          {/* Hero Invariant Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Outbound Egress</span>
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-2xl font-mono font-extrabold text-emerald-900 mt-1">
                0 <span className="text-[10px] font-normal font-sans text-emerald-700">(Hardware Lock)</span>
              </div>
              <p className="text-[10px] text-emerald-700 mt-0.5 font-medium">Zero external data transmission.</p>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">Internal LAN Nodes</span>
                <Server className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="text-2xl font-mono font-extrabold text-blue-900 mt-1">
                6 <span className="text-[10px] font-normal font-sans text-blue-700">(Active Mesh)</span>
              </div>
              <p className="text-[10px] text-blue-700 mt-0.5 font-medium">GPU cluster, Milvus, S3 & SCADA.</p>
            </div>

            <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Hardware Token</span>
                <Radio className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-xs font-mono font-bold text-slate-900 mt-1.5 truncate">
                MRPL-HSM-2026
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">FIPS-140-3 token verified.</p>
            </div>
          </div>

          {/* Network Interfaces Status */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-2.5">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5 text-blue-600" />
              Physical & Virtual Network Adapters
            </h3>
            
            <div className="divide-y divide-slate-100 text-xs">
              {networkTelemetry.activeInterfaces.map((iface, i) => (
                <div key={i} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-mono font-bold text-slate-900 text-xs block">{iface.name}</span>
                    <span className="text-slate-500 font-mono text-[10px]">IP: {iface.ip} | Subnet: {iface.subnet}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      iface.status === 'UP' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {iface.status} ({iface.externalGateway})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Internal Air-Gapped Microservices */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-2.5">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-blue-600" />
              Local Air-Gapped Microservices Health
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {networkTelemetry.internalServices.map((srv, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <span className="font-bold text-slate-900 text-[11px] truncate block">{srv.name}</span>
                    <span className="text-[10px] font-mono text-slate-500">{srv.endpoint}:{srv.port}</span>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded border border-emerald-200 flex-shrink-0">
                    {srv.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer (Sticky & Clean) */}
        <div className="p-3.5 sm:p-4 bg-slate-100 border-t border-slate-200 flex-shrink-0 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-500 font-mono truncate max-w-[320px]">
            Audit: {networkTelemetry.lastAirgapAudit}
          </span>
          <button
            onClick={() => setIsSovereigntyModalOpen(false)}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs flex-shrink-0"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
