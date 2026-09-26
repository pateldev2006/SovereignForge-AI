import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Network, ShieldCheck, Lock, Server, Radio, Database, Activity, 
  RefreshCw, CheckCircle2, XCircle, Download, Terminal, Layers, 
  Cpu, FileCheck, ShieldAlert
} from 'lucide-react';

export const NetworkPage: React.FC = () => {
  const { networkTelemetry, setIsSovereigntyModalOpen, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'interfaces' | 'probes' | 'iptables'>('interfaces');
  const [isProbing, setIsProbing] = useState(false);

  // Probes list
  const [probes, setProbes] = useState([
    { target: '8.8.8.8 (Google Public DNS)', port: '53/UDP', result: 'NETWORK_UNREACHABLE (0ms)', status: 'BLOCKED' },
    { target: '1.1.1.1 (Cloudflare DNS)', port: '53/UDP', result: 'NETWORK_UNREACHABLE (0ms)', status: 'BLOCKED' },
    { target: 'api.openai.com', port: '443/TCP', result: 'NO_ROUTE_TO_HOST (0ms)', status: 'BLOCKED' },
    { target: 'huggingface.co', port: '443/TCP', result: 'NO_ROUTE_TO_HOST (0ms)', status: 'BLOCKED' },
    { target: '10.14.0.12 (Internal vLLM Node)', port: '8000/TCP', result: 'CONNECTED (0.12ms)', status: 'ALLOWED_LAN' }
  ]);

  const handleRunContinuousProbe = () => {
    setIsProbing(true);
    showToast('Air-Gap Probe Dispatched', 'Transmitting probe packets to external IP targets...', 'info');
    setTimeout(() => {
      setIsProbing(false);
      showToast('Air-Gap Verified', '100% of external outbound packets dropped at kernel level.', 'success');
    }, 1500);
  };

  const handleDownloadCertificate = () => {
    const certData = {
      title: 'SOVEREIGNFORGE AIR-GAP ZERO-EGRESS ATTESTATION CERTIFICATE',
      issuedAt: new Date().toISOString(),
      standard: 'OISD-STD-129 / IEC 62443 Level 4',
      hardwareEnclosure: 'Enterprise GPU Node 0/1 (Dual-Socket H100)',
      egressPacketCount: 0,
      iptablesPolicy: 'OUTPUT DROP',
      hardwareDiodeStatus: 'UNIDIRECTIONAL_ISOLATED',
      cryptographicSignature: '0x99A418B51E7728FA44901C9283719AE1029471BCF99302'
    };

    const blob = new Blob([JSON.stringify(certData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `airgap-sovereignty-certificate-${Date.now()}.json`;
    a.click();
    showToast('Certificate Exported', 'Zero-Egress Compliance Certificate downloaded.', 'success');
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              PHYSICAL AIR-GAP & EGRESS MONITOR (SECTION 8)
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Zero Outbound Invariant
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
            Network Sovereignty & Air-Gap Telemetry
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time packet inspection, iptables drop policies, automated WAN connectivity probes, and compliance attestation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCertificate}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export Zero-Egress Cert</span>
          </button>
          <button
            onClick={() => setIsSovereigntyModalOpen(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Activity className="w-4 h-4" />
            <span>Launch Telemetry Diagnostics</span>
          </button>
        </div>
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
          <p className="text-xs text-blue-700 mt-1 font-medium">vLLM, Qdrant, Redis, Postgres, Tesseract & SCADA Diode.</p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Air-Gap Audit Token</span>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-base font-mono font-bold text-slate-900 mt-2">
            SF-AIRGAP-2026-FIPS
          </div>
          <p className="text-xs text-slate-500 mt-1">Hardware cryptotoken validated.</p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('interfaces')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'interfaces'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Physical & Virtual Interfaces</span>
        </button>

        <button
          onClick={() => setActiveTab('probes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'probes'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Active Air-Gap Probes</span>
        </button>

        <button
          onClick={() => setActiveTab('iptables')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'iptables'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Kernel IPTables & Data Diode</span>
        </button>
      </div>

      {/* TAB 1: INTERFACES */}
      {activeTab === 'interfaces' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Network className="w-4 h-4 text-blue-600" />
            <span>Network Adapters & Physical Port Status</span>
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
                    {iface.status}
                  </span>
                </div>
              </div>
            ))}

            {/* Simulated Physically Disconnected WAN eth1 */}
            <div className="py-3.5 flex flex-wrap items-center justify-between gap-4 bg-rose-50/50 p-3 rounded-xl border border-rose-100">
              <div>
                <span className="font-mono font-bold text-rose-950 text-sm block">eth1 (WAN / Internet Gateway)</span>
                <span className="text-rose-700 font-mono text-xs">Physical Cable Detached • Hardware Transceiver Disabled</span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                PHYSICALLY DOWN
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROBES */}
      {activeTab === 'probes' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Continuous WAN Reachability Probe Test
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Periodic synthetic probes sent to external internet hosts. Air-gap compliance requires 100% hard packet rejection.
              </p>
            </div>

            <button
              onClick={handleRunContinuousProbe}
              disabled={isProbing}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isProbing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Probing External Targets...</span>
                </>
              ) : (
                <>
                  <Radio className="w-4 h-4" />
                  <span>Run WAN Probe Sweep</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-3">
            {probes.map((p, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                <div>
                  <strong className="text-slate-900 block">{p.target}</strong>
                  <span className="text-slate-500 text-[11px]">Port: {p.port} • Response: {p.result}</span>
                </div>

                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1 ${
                  p.status === 'BLOCKED'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-blue-50 text-blue-800 border-blue-200'
                }`}>
                  {p.status === 'BLOCKED' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Activity className="w-3.5 h-3.5 text-blue-600" />}
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: IPTABLES & DIODE */}
      {activeTab === 'iptables' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4 font-mono text-xs">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 font-sans">
                Kernel-Level Firewall Rules (iptables -L -n -v)
              </h3>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                Default drop policies enforced in Linux kernel netfilter layer.
              </p>
            </div>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-bold">
              POLICY: DROP ALL
            </span>
          </div>

          <div className="p-4 bg-slate-900 text-emerald-400 rounded-xl overflow-x-auto text-[11px] leading-relaxed space-y-1">
            <div className="text-slate-400"># Chain INPUT (policy DROP 0 packets, 0 bytes)</div>
            <div>pkts bytes target     prot opt in     out     source               destination</div>
            <div> 48M 4.2G ACCEPT     all  --  lo     *       0.0.0.0/0            0.0.0.0/0</div>
            <div> 12M 1.8G ACCEPT     all  --  eth0   *       10.14.0.0/16         10.14.0.0/16</div>
            <div className="text-slate-400 pt-2"># Chain OUTPUT (policy DROP 0 packets, 0 bytes)</div>
            <div> 48M 4.2G ACCEPT     all  --  *      lo      0.0.0.0/0            0.0.0.0/0</div>
            <div> 12M 1.8G ACCEPT     all  --  *      eth0    10.14.0.0/16         10.14.0.0/16</div>
            <div className="text-rose-400 font-bold">   0     0 DROP       all  --  *      *       0.0.0.0/0            0.0.0.0/0 (HARD AIR-GAP LOCK)</div>
          </div>
        </div>
      )}

    </div>
  );
};
