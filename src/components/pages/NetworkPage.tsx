import React from 'react';
import { useApp } from '../../context/AppContext';
import { Network, ShieldCheck, Lock, Server, Radio, Database, Activity, RefreshCw } from 'lucide-react';

export const NetworkPage: React.FC = () => {
  const { networkTelemetry, setIsSovereigntyModalOpen, showToast } = useApp();

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              PHYSICAL AIR-GAP TELEMETRY
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Zero Outbound Invariant
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
            Network Sovereignty & Interface Telemetry
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Physical and virtual network interface monitor verifying zero external internet egress and air-gapped GPU cluster communication.
          </p>
        </div>

        <button
          onClick={() => setIsSovereigntyModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all"
        >
          <Activity className="w-4 h-4" />
          <span>Launch Telemetry Diagnostics</span>
        </button>
      </div>

      {/* Hero Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Outbound Egress</span>
            <Lock className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-mono font-extrabold text-emerald-900 mt-2">
            0 <span className="text-xs font-normal font-sans text-emerald-700">Connections (Hardware Lock)</span>
          </div>
          <p className="text-xs text-emerald-700 mt-1 font-medium">Zero external data transmission guaranteed.</p>
        </div>

        <div className="p-5 bg-blue-50 border border-blue-200 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Internal LAN Cluster</span>
            <Server className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-mono font-extrabold text-blue-900 mt-2">
            6 <span className="text-xs font-normal font-sans text-blue-700">Healthy Microservices</span>
          </div>
          <p className="text-xs text-blue-700 mt-1 font-medium">vLLM, Milvus, MinIO, PostgreSQL, LDAP & SCADA.</p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Air-Gap Audit Token</span>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-base font-mono font-bold text-slate-900 mt-2">
            Enterprise-HSM-2026-FIPS
          </div>
          <p className="text-xs text-slate-500 mt-1">Hardware cryptotoken validated.</p>
        </div>
      </div>

      {/* Adapters Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <Network className="w-4 h-4 text-blue-600" />
          Physical & Virtual Network Adapters
        </h3>

        <div className="divide-y divide-slate-100 text-xs">
          {networkTelemetry.activeInterfaces.map((iface, idx) => (
            <div key={idx} className="py-3.5 first:pt-0 last:pb-0 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="font-mono font-bold text-slate-900 text-sm block">{iface.name}</span>
                <span className="text-slate-500 font-mono">IP: {iface.ip} | Subnet: {iface.subnet}</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right font-mono text-[11px] text-slate-500">
                  <span>Rx: {(iface.packetsRx / 1000000).toFixed(2)}M pkts</span>
                  <span className="block">Tx: {(iface.packetsTx / 1000000).toFixed(2)}M pkts</span>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  iface.status === 'UP' 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  {iface.status} ({iface.externalGateway})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
